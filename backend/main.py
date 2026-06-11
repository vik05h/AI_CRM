from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text, func
from typing import List

from app.database import get_db
from app.models import Customer, Order, Segment, Campaign
from app.schemas import (
    CustomerResponse, OrderResponse, SegmentRequest, SegmentResponse,
    SegmentPreviewData, CustomerPreviewResponse, CampaignDraftRequest,
    CampaignDraftResponse, CampaignCreate, CampaignResponse
)
from app.services.ai_mock import discover_segments, draft_campaign

app = FastAPI(title="AI CRM API", description="Core API for AI CRM", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
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
async def draft_campaign(request: CampaignDraftRequest, db: AsyncSession = Depends(get_db)):
    # Get segment to pass its name to the AI
    result = await db.execute(select(Segment).filter(Segment.id == request.segment_id))
    segment = result.scalar_one_or_none()
    if not segment:
        raise HTTPException(404, "Segment not found")
        
    draft = await draft_campaign(request.goal, segment.name)
    return draft

@app.post("/campaigns", response_model=CampaignResponse, summary="Create a new campaign")
async def create_campaign(request: CampaignCreate, db: AsyncSession = Depends(get_db)):
    # Validate channel
    if request.channel not in ['Email', 'SMS', 'WhatsApp', 'RCS']:
        raise HTTPException(400, "Invalid channel")
        
    new_campaign = Campaign(
        name=request.name,
        segment_id=request.segment_id,
        goal=request.goal,
        channel=request.channel,
        subject_line=request.subject_line,
        message_body=request.message_body,
        status='approved'
    )
    db.add(new_campaign)
    await db.commit()
    await db.refresh(new_campaign)
    
    # TODO: Integrate channel stub POST /channel/send here
    
    return new_campaign

@app.get("/campaigns", response_model=List[CampaignResponse], summary="List all campaigns")
async def get_campaigns(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Campaign).order_by(Campaign.created_at.desc()).offset(skip).limit(limit))
    return list(result.scalars().all())
