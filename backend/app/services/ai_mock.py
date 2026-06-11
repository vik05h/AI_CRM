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
