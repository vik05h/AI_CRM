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
            print(f"Database already seeded with {count} customers. Skipping.")
            return

        print("Generating 1000 customers...")
        customers = []
        for _ in range(1000):
            created_at = fake.date_time_between(start_date="-1y", end_date="now", tzinfo=timezone.utc)
            c = Customer(
                name=fake.name(),
                email=fake.unique.email(),
                created_at=created_at,
                metadata_json={"source": random.choice(["organic", "paid", "referral", "social"])}
            )
            customers.append(c)
        
        session.add_all(customers)
        await session.commit()
        
        # We need the IDs to associate orders
        print("Customers saved. Generating 5000 orders...")
        
        orders = []
        for _ in range(5000):
            customer = random.choice(customers)
            # Order date must be after customer creation date
            order_date = fake.date_time_between(start_date=customer.created_at, end_date="now", tzinfo=timezone.utc)
            num_items = random.randint(1, 5)
            items = [{"product": fake.word(), "price": round(random.uniform(10.0, 150.0), 2), "quantity": random.randint(1, 3)} for _ in range(num_items)]
            
            total = sum(i["price"] * i["quantity"] for i in items)
            
            o = Order(
                customer_id=customer.id,
                total_amount=total,
                status=random.choices(["completed", "refunded", "cancelled", "processing"], weights=[0.85, 0.05, 0.05, 0.05])[0],
                created_at=order_date,
                items={"line_items": items}
            )
            orders.append(o)

        session.add_all(orders)
        await session.commit()
        
        print("Successfully generated 5000 orders!")
        
if __name__ == "__main__":
    asyncio.run(seed_db())
