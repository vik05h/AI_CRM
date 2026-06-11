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
