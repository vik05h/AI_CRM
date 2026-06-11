from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import Segment, Customer

async def discover_segments(criteria: str, db: AsyncSession) -> Segment:
    """
    Mock AI Service that returns realistic segments without hitting Vertex AI.
    It parses the natural language input for keywords and builds a segment.
    """
    criteria_lower = criteria.lower()
    
    # Keyword-based routing
    if any(keyword in criteria_lower for keyword in ["lapsed", "churn", "inactive"]):
        name = "Lapsed Customers"
        description = "Customers who haven't placed an order in the last 90 days."
        sql_criteria = """
            SELECT 
              c.id, 
              c.name, 
              c.email,
              COUNT(o.id) as total_orders,
              SUM(o.total_amount) as total_spent,
              MAX(o.created_at) as last_order_date
            FROM customers c 
            LEFT JOIN orders o ON c.id = o.customer_id 
            GROUP BY c.id, c.name, c.email
            HAVING MAX(o.created_at) < NOW() - INTERVAL '90 days'
        """
        result = await db.execute(select(func.count(Customer.id)))
        size = result.scalar() or 0
        size = int(size * 0.2)
        
    elif any(keyword in criteria_lower for keyword in ["vip", "high", "expensive"]):
        name = "High-Value Customers"
        description = "Customers who have spent more than $1000 in total."
        sql_criteria = """
            SELECT 
              c.id, 
              c.name, 
              c.email,
              COUNT(o.id) as total_orders,
              SUM(o.total_amount) as total_spent,
              MAX(o.created_at) as last_order_date
            FROM customers c 
            LEFT JOIN orders o ON c.id = o.customer_id 
            GROUP BY c.id, c.name, c.email
            HAVING SUM(o.total_amount) > 1000
        """
        result = await db.execute(select(func.count(Customer.id)))
        size = result.scalar() or 0
        size = int(size * 0.05)
        
    else:
        name = "Recent Buyers"
        description = "Customers who placed an order in the last 30 days."
        sql_criteria = """
            SELECT 
              c.id, 
              c.name, 
              c.email,
              COUNT(o.id) as total_orders,
              SUM(o.total_amount) as total_spent,
              MAX(o.created_at) as last_order_date
            FROM customers c 
            LEFT JOIN orders o ON c.id = o.customer_id 
            GROUP BY c.id, c.name, c.email
            HAVING MAX(o.created_at) > NOW() - INTERVAL '30 days'
        """
        result = await db.execute(select(func.count(Customer.id)))
        size = result.scalar() or 0
        size = int(size * 0.5)

    # Create the segment in the database
    new_segment = Segment(
        name=name,
        description=description,
        criteria=sql_criteria,
        size=size
    )
    db.add(new_segment)
    await db.commit()
    await db.refresh(new_segment)
    
    return new_segment

async def draft_campaign(goal: str, segment_name: str) -> dict:
    """Mock AI campaign message drafting."""
    goal_lower = goal.lower()
    
    if "discount" in goal_lower or "sale" in goal_lower:
        return {
            "subject_line": "Special 20% Off Just For You!",
            "message_body": f"Hi {{name}},\n\nWe noticed you're one of our {segment_name}. To say thanks, use code SALE20 at checkout for 20% off your next order.\n\nShop now!"
        }
    elif "reactivate" in goal_lower or "miss" in goal_lower:
        return {
            "subject_line": "We miss you! Come back and save.",
            "message_body": f"Hi {{name}},\n\nIt's been a while! We value our {segment_name} and would love to see you again. Enjoy free shipping on your next order.\n\nSee what's new!"
        }
    else:
        return {
            "subject_line": "Exciting updates from us!",
            "message_body": f"Hi {{name}},\n\nWe have some great news to share with our {segment_name}. Check out our latest products and updates on our website.\n\nTalk soon!"
        }
