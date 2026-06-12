from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import asyncio
import random
import httpx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Channel Stub API", description="Simulates delivery for SMS/Email/WhatsApp")

class SendRequest(BaseModel):
    campaign_id: str
    channel: str
    message: str
    recipient_count: int
    callback_url: str = "http://localhost:8000/api/callbacks"

async def process_delivery(req: SendRequest):
    """Simulates a slow delivery process and then calls back."""
    logger.info(f"Starting delivery for campaign {req.campaign_id} via {req.channel} to {req.recipient_count} recipients.")
    
    # Simulate delivery delay (2 to 5 seconds)
    delay = random.uniform(2.0, 5.0)
    await asyncio.sleep(delay)
    
    # Simulate some failure rate for sent
    sent_count = int(req.recipient_count * random.uniform(0.9, 1.0))
    # Simulate conversion rate (15% - 30%)
    converted_count = int(sent_count * random.uniform(0.15, 0.30))
    
    payload = {
        "campaign_id": req.campaign_id,
        "sent_count": sent_count,
        "converted_count": converted_count,
        "status": "completed"
    }
    
    logger.info(f"Delivery complete for campaign {req.campaign_id}. Sending callback to {req.callback_url}")
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(req.callback_url, json=payload, timeout=10.0)
            resp.raise_for_status()
            logger.info(f"Callback successful for campaign {req.campaign_id}")
    except Exception as e:
        logger.error(f"Failed to send callback for campaign {req.campaign_id}: {str(e)}")

@app.post("/send")
async def send_messages(req: SendRequest, background_tasks: BackgroundTasks):
    """Receives send request and queues it for background processing."""
    if req.recipient_count <= 0:
        raise HTTPException(status_code=400, detail="recipient_count must be > 0")
        
    background_tasks.add_task(process_delivery, req)
    return {"status": "queued", "message": "Delivery process started in background."}
