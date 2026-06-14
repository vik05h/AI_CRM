import httpx
from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text, func
from typing import List

from app.database import get_db
from app.models import Customer, Order, Segment, Campaign
from app.schemas import (
    CustomerResponse, OrderResponse, SegmentRequest, SegmentResponse,
    SegmentPreviewData, CustomerPreviewResponse, CampaignDraftRequest,
    CampaignDraftResponse, CampaignCreate, CampaignResponse,
    CampaignCallback, AnalyticsSummary
)
from app.services.ai_mock import discover_segments, draft_campaign

app = FastAPI(title="AI CRM API", description="Core API for AI CRM", version="1.0.0")

frontend_url_env = os.environ.get("FRONTEND_URL", "*")
origins = [url.strip().rstrip('/') for url in frontend_url_env.split(",")] if frontend_url_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/customers", response_model=List[CustomerResponse], summary="Get all customers")
async def get_customers(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), db: AsyncSession = Depends(get_db)):
    """Retrieve a list of customers with pagination."""
    result = await db.execute(select(Customer).offset(skip).limit(limit))
    return result.scalars().all()

@app.get("/customers/{customer_id}", response_model=CustomerResponse, summary="Get customer by ID")
async def get_customer(customer_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific customer by their ID."""
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalar_one_or_none()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.get("/orders", response_model=List[OrderResponse], summary="Get all orders")
async def get_orders(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), db: AsyncSession = Depends(get_db)):
    """Retrieve a list of orders with pagination."""
    result = await db.execute(select(Order).offset(skip).limit(limit))
    return result.scalars().all()

@app.post("/ai/segment", response_model=SegmentResponse, summary="Discover segment via AI")
async def create_segment(request: SegmentRequest, db: AsyncSession = Depends(get_db)):
    """Discover a segment from natural language criteria."""
    segment = await discover_segments(request.criteria, db)
    return segment

@app.get("/segments", response_model=List[SegmentResponse], summary="Get all segments")
async def get_segments(db: AsyncSession = Depends(get_db)):
    """Retrieve a list of discovered segments."""
    result = await db.execute(select(Segment).order_by(Segment.created_at.desc()))
    return result.scalars().all()

@app.delete("/segments/{segment_id}", summary="Delete a segment")
async def delete_segment(segment_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Segment).filter(Segment.id == segment_id))
    segment = result.scalar_one_or_none()
    if not segment:
        raise HTTPException(404, "Segment not found")
        
    # Delete child campaigns first to avoid foreign key constraints
    campaigns_res = await db.execute(select(Campaign).filter(Campaign.segment_id == segment_id))
    for c in campaigns_res.scalars().all():
        await db.delete(c)
        
    await db.delete(segment)
    await db.commit()
    return {"message": "Segment deleted"}

@app.get("/segments/{segment_id}/preview", response_model=SegmentPreviewData, summary="Preview segment customers")
async def preview_segment(segment_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Segment).filter(Segment.id == segment_id))
    segment = result.scalar_one_or_none()
    if not segment:
        raise HTTPException(404, "Segment not found")
    
    sql = segment.criteria.strip()
    
    # Safety checks
    if not sql.lower().startswith("select"):
        raise HTTPException(400, "Only SELECT queries allowed")
    
    import re
    # Prevent destructive operations
    forbidden = ['insert', 'update', 'delete', 'drop', 'alter', 'create', 'truncate']
    if any(re.search(r'\b' + word + r'\b', sql.lower()) for word in forbidden):
        raise HTTPException(400, "Query contains forbidden operations")
    
    # Add limit if missing
    if "limit " not in sql.lower():
        query_sql = sql + " LIMIT 50"
    else:
        query_sql = sql
    
    try:
        # execute raw sql
        exec_result = await db.execute(text(query_sql))
        customers = [dict(row) for row in exec_result.mappings()]
        total_count = await db.scalar(select(func.count()).select_from(text(f"({sql}) as subquery")))
    
        return SegmentPreviewData(
            customers=[CustomerPreviewResponse.model_validate(c) for c in customers],
            total_count=total_count,
            truncated=total_count > 50
        )
    except Exception as e:
        raise HTTPException(400, f"Query failed: {str(e)}")

@app.post("/ai/draft_campaign", response_model=CampaignDraftResponse, summary="Draft campaign message with AI")
async def create_campaign_draft(request: CampaignDraftRequest, db: AsyncSession = Depends(get_db)):
    # Get segment to pass its name to the AI
    result = await db.execute(select(Segment).filter(Segment.id == request.segment_id))
    segment = result.scalar_one_or_none()
    if not segment:
        raise HTTPException(404, "Segment not found")
        
    draft = await draft_campaign(request.goal, segment.name)
    return draft

async def send_to_channel_stub(campaign_id: str, channel: str, message: str, recipient_count: int):
    channel_stub_url = os.environ.get("CHANNEL_STUB_URL", "http://localhost:8001")
    try:
        async with httpx.AsyncClient() as client:
            await client.post(f"{channel_stub_url}/send", json={
                "campaign_id": campaign_id,
                "channel": channel,
                "message": message,
                "recipient_count": recipient_count
            }, timeout=10.0)
    except Exception as e:
        print(f"Failed to trigger channel stub: {e}")

@app.post("/campaigns", response_model=CampaignResponse, summary="Create a new campaign")
async def create_campaign(request: CampaignCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    # Validate channel
    if request.channel not in ['Email', 'SMS', 'WhatsApp', 'RCS']:
        raise HTTPException(400, "Invalid channel")
        
    # Get segment to find size
    result = await db.execute(select(Segment).filter(Segment.id == request.segment_id))
    segment = result.scalar_one_or_none()
    if not segment:
        raise HTTPException(404, "Segment not found")
        
    new_campaign = Campaign(
        name=request.name,
        segment_id=request.segment_id,
        goal=request.goal,
        channel=request.channel,
        subject_line=request.subject_line,
        message_body=request.message_body,
        status='sending'
    )
    db.add(new_campaign)
    await db.commit()
    await db.refresh(new_campaign)
    
    # Send to channel stub
    recipient_count = segment.size if segment.size > 0 else 100
    background_tasks.add_task(send_to_channel_stub, new_campaign.id, new_campaign.channel, new_campaign.message_body, recipient_count)
    
    return new_campaign

@app.get("/campaigns", response_model=List[CampaignResponse], summary="List all campaigns")
async def get_campaigns(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Campaign).order_by(Campaign.created_at.desc()).offset(skip).limit(limit))
    return list(result.scalars().all())

@app.delete("/campaigns/{campaign_id}", summary="Delete a campaign")
async def delete_campaign(campaign_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Campaign).filter(Campaign.id == campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(404, "Campaign not found")
        
    await db.delete(campaign)
    await db.commit()
    return {"message": "Campaign deleted"}

@app.post("/api/callbacks", summary="Receive delivery stats from channel stub")
async def receive_callback(payload: CampaignCallback, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Campaign).filter(Campaign.id == payload.campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(404, "Campaign not found")
        
    campaign.sent_count = payload.sent_count
    campaign.converted_count = payload.converted_count
    campaign.status = payload.status
    
    await db.commit()
    return {"message": "Callback received"}

@app.get("/analytics/summary", response_model=AnalyticsSummary, summary="Get analytics summary")
async def get_analytics_summary(db: AsyncSession = Depends(get_db)):
    total_customers = await db.scalar(select(func.count(Customer.id)))
    total_orders = await db.scalar(select(func.count(Order.id)))
    total_revenue = await db.scalar(select(func.sum(Order.total_amount)))
    
    campaigns_result = await db.execute(select(Campaign))
    campaigns = campaigns_result.scalars().all()
    campaigns_sent = sum(c.sent_count for c in campaigns)
    campaigns_converted = sum(c.converted_count for c in campaigns)
    
    active_segments = await db.scalar(select(func.count(Segment.id)))
    
    return AnalyticsSummary(
        total_customers=total_customers or 0,
        total_orders=total_orders or 0,
        total_revenue=total_revenue or 0.0,
        campaigns_sent=campaigns_sent,
        campaigns_converted=campaigns_converted,
        active_segments=active_segments or 0
    )
