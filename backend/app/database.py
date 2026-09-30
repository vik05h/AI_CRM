import os
import re
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv

load_dotenv()

def normalize_database_url(url: str) -> str:
    """Normalize database URL for asyncpg compatibility and SSL requirements."""
    if not url:
        return "postgresql+asyncpg://postgres:postgres@localhost:5432/aicrm"

    # Replace postgres:// or postgresql:// with postgresql+asyncpg://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

    # Convert sslmode=... to ssl=... because asyncpg expects 'ssl'
    if "sslmode=" in url:
        url = re.sub(r'sslmode=([^&]+)', r'ssl=\1', url)

    # Detect if host is remote (not localhost/127.0.0.1)
    is_localhost = "localhost" in url or "127.0.0.1" in url
    requires_ssl = not is_localhost and any(
        provider in url for provider in [".supabase.", ".neon.tech", ".render.com", "pooler.supabase.com"]
    )

    if requires_ssl and "ssl=" not in url:
        join_char = "&" if "?" in url else "?"
        url += f"{join_char}ssl=require"

    return url

def get_engine_kwargs(url: str) -> dict:
    """Return appropriate engine kwargs based on host and connection pooling."""
    kwargs: dict = {
        "echo": False,
        "pool_pre_ping": True,  # Auto-reconnect stale or closed connections
        "pool_recycle": 300,    # Recycle connections every 5m to avoid idle timeouts
    }

    # If using PgBouncer / Transaction pooler (Supabase 6543, pooler.supabase.com, pgbouncer):
    is_pooler = any(indicator in url for indicator in ["6543", "pooler.supabase.com", "pgbouncer"])
    if is_pooler:
        kwargs["poolclass"] = NullPool
        kwargs["connect_args"] = {
            "statement_cache_size": 0,
            "prepared_statement_cache_size": 0,
        }

    return kwargs

RAW_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/aicrm"
)
SQLALCHEMY_DATABASE_URL = normalize_database_url(RAW_DATABASE_URL)
engine_kwargs = get_engine_kwargs(SQLALCHEMY_DATABASE_URL)

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
