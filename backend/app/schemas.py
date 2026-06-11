from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Any

class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime
    metadata_json: dict[str, Any]

    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: str
    customer_id: str
    total_amount: float
    status: str
    created_at: datetime
    items: dict[str, Any]

    model_config = ConfigDict(from_attributes=True)

class SegmentRequest(BaseModel):
    criteria: str

class SegmentResponse(BaseModel):
    id: str
    name: str
    description: str | None = None
    criteria: str
    size: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CustomerPreviewResponse(BaseModel):
    id: str
    name: str
    email: str
    total_orders: int | None = 0
    total_spent: float | None = 0.0
    last_order_date: datetime | None = None

class SegmentPreviewData(BaseModel):
    customers: list[CustomerPreviewResponse]
    total_count: int
    truncated: bool

class CampaignDraftRequest(BaseModel):
    segment_id: str
    goal: str

class CampaignDraftResponse(BaseModel):
    subject_line: str | None = None
    message_body: str

class CampaignCreate(BaseModel):
    name: str
    segment_id: str
    goal: str
    channel: str
    subject_line: str | None = None
    message_body: str

class CampaignResponse(BaseModel):
    id: str
    name: str
    segment_id: str
    goal: str
    channel: str
    subject_line: str | None = None
    message_body: str
    status: str
    sent_count: int
    converted_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
