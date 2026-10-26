import asyncio
import os
import sys
import random
from datetime import datetime, timedelta, timezone
from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database import SQLALCHEMY_DATABASE_URL, engine, AsyncSessionLocal
from app.models import Customer, Order, Campaign, Segment

fake = Faker()

async def seed_db():
    print(f"Connecting to database at {SQLALCHEMY_DATABASE_URL}...")

    async with AsyncSessionLocal() as session:
        # Check if we already have customers
        result = await session.execute(text("SELECT COUNT(id) FROM customers"))
        count = result.scalar()
        if count > 0:
            print(f"Database already seeded with {count} records. Skipping.")
            return

        print("Generating 1000 Patient / Customer records...")
        conditions = [
            "Type 2 Diabetes", "Hypertension", "Post-Op Recovery", 
            "Asthma", "Routine Wellness", "Cardiology Followup"
        ]
        care_tiers = ["Critical Care", "Chronic Support", "Preventative Care", "Standard"]
        risk_levels = ["High", "Moderate", "Low"]

        customers = []
        for _ in range(1000):
            created_at = fake.date_time_between(start_date="-1y", end_date="now", tzinfo=timezone.utc)
            c = Customer(
                name=fake.name(),
                email=fake.unique.email(),
                created_at=created_at,
                metadata_json={
                    "source": random.choice(["clinical_portal", "hospital_referral", "outpatient_clinic", "organic"]),
                    "care_tier": random.choice(care_tiers),
                    "primary_condition": random.choice(conditions),
                    "risk_level": random.choice(risk_levels),
                    "mrn": f"MRN-{fake.unique.random_number(digits=6, fix_len=True)}",
                    "hipaa_consent": True
                }
            )
            customers.append(c)
        
        session.add_all(customers)
        await session.commit()
        
        print("Records saved. Generating 5000 Clinical Appointments / Orders...")
        clinical_services = [
            {"product": "General Physician Consultation", "price": 75.0},
            {"product": "Comprehensive Metabolic Panel (CMP)", "price": 120.0},
            {"product": "Cardiology Follow-up Screening", "price": 250.0},
            {"product": "Prescription Refill - Maintenance Medication", "price": 45.0},
            {"product": "HbA1c Diabetes Monitoring Test", "price": 60.0},
            {"product": "Preventative Annual Wellness Exam", "price": 180.0},
            {"product": "Physical Therapy Session", "price": 95.0}
        ]
        
        orders = []
        for _ in range(5000):
            customer = random.choice(customers)
            order_date = fake.date_time_between(start_date=customer.created_at, end_date="now", tzinfo=timezone.utc)
            num_items = random.randint(1, 3)
            selected_services = random.sample(clinical_services, num_items)
            items = [
                {
                    "product": s["product"],
                    "price": s["price"],
                    "quantity": 1
                }
                for s in selected_services
            ]
            
            total = sum(i["price"] * i["quantity"] for i in items)
            
            o = Order(
                customer_id=customer.id,
                total_amount=total,
                status=random.choices(["completed", "scheduled", "cancelled", "processing"], weights=[0.85, 0.08, 0.04, 0.03])[0],
                created_at=order_date,
                items={"line_items": items}
            )
            orders.append(o)

        session.add_all(orders)
        await session.commit()
        
        print("Successfully generated 5000 healthcare appointments / orders!")

if __name__ == "__main__":
    asyncio.run(seed_db())
