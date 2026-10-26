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

class PatientResponse(BaseModel):
    """Healthcare Patient Representation for Item 9 DevSecOps Compliance."""
    id: str
    name: str
    email: str
    created_at: datetime
    metadata_json: dict[str, Any]
    care_tier: str | None = "Standard"
    risk_level: str | None = "Low"
    phi_masked: bool = True

    model_config = ConfigDict(from_attributes=True)

class HealthComplianceAudit(BaseModel):
    """DevSecOps Healthcare Compliance & HIPAA Audit Status."""
    hipaa_compliant: bool
    data_encryption_at_rest: bool
    data_encryption_in_transit: bool
    phi_masking_active: bool
    total_patients_protected: int
    audit_timestamp: datetime
    compliance_frameworks: list[str]

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

class CampaignCallback(BaseModel):
    campaign_id: str
    sent_count: int
    converted_count: int
    status: str

class AnalyticsSummary(BaseModel):
    total_customers: int
    total_orders: int
    total_revenue: float
    campaigns_sent: int
    campaigns_converted: int
    active_segments: int
