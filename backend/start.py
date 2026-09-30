import os
import sys
import time
import subprocess
import asyncio
from sqlalchemy import text

# Ensure backend root is in sys.path
sys.path.append(os.path.dirname(__file__))

from app.database import engine, SQLALCHEMY_DATABASE_URL

async def wait_for_db(max_retries: int = 5, delay: float = 3.0) -> bool:
    """Verify database connection with retries to tolerate cloud cold starts."""
    masked_url = SQLALCHEMY_DATABASE_URL.split("@")[-1] if "@" in SQLALCHEMY_DATABASE_URL else "local"
    print(f"Checking database connectivity ({masked_url})...")
    
    for attempt in range(1, max_retries + 1):
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            print("Database connected successfully!")
            return True
        except Exception as e:
            print(f"[Attempt {attempt}/{max_retries}] Database connection failed: {e}")
            if attempt < max_retries:
                time.sleep(delay)
    return False

def run_command(cmd: list[str]) -> bool:
    """Execute a CLI command and print output."""
    print(f"Executing: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    return result.returncode == 0

def main():
    port = int(os.environ.get("PORT", "8000"))
    
    # 1. Attempt to connect to database
    db_ready = asyncio.run(wait_for_db(max_retries=5, delay=3.0))
    
    if db_ready:
        print("\n Running database migrations (alembic upgrade head)...")
        run_command(["uv", "run", "alembic", "upgrade", "head"])
        
        print("\n Checking initial seed data...")
        run_command(["uv", "run", "python", "scripts/seed_data.py"])
    else:
        print("\n" + "=" * 65)
        print("⚠️  DATABASE COULD NOT BE REACHED DURING STARTUP")
        print("=" * 65)
        print("The backend web server will still start to keep Render online.")
        print("Common reasons for this failure:")
        print(" 1. Render Free PostgreSQL was deleted (free DBs expire in 30 days).")
        print(" 2. Supabase free-tier project is paused due to inactivity.")
        print(" 3. DATABASE_URL in Render environment settings is invalid or points to an expired host.")
        print("\nVisit /health on your live backend URL to view real-time diagnostics.")
        print("=" * 65 + "\n")
        
    print(f"\n🚀 Starting Uvicorn web server on 0.0.0.0:{port}...")
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
