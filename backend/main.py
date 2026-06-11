from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models import Customer, Order
from app.schemas import CustomerResponse, OrderResponse

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
