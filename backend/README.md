# AI-Native Mini CRM - Backend

This is the FastAPI backend for the AI-Native Mini CRM project. It provides the core CRM API, integrates with the Google GenAI SDK (Vertex AI) for AI features, and runs a separate Channel Stub service for simulating asynchronous campaign delivery.

## Services

1. **Core CRM API (Port 8000)**: Handles customers, orders, segments, and campaigns.
2. **Channel Stub Service (Port 8001)**: A standalone FastAPI service that simulates SMS, Email, and WhatsApp delivery with a 2-5 second delay, then posts a callback to the Core CRM API.

## Requirements

- Python 3.10+
- `uv` package manager (recommended)
- PostgreSQL database (or Supabase/Neon)

## Setup and Running

1. **Install dependencies**:
   Using `uv`:
   ```bash
   uv sync
   ```
   Or using pip:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and configure your PostgreSQL database URL and Google Vertex AI credentials.

3. **Database Migrations**:
   Run Alembic to create the tables in your PostgreSQL database:
   ```bash
   uv run alembic upgrade head
   ```

4. **Seed Synthetic Data**:
   Populate your database with realistic synthetic customers and orders:
   ```bash
   uv run python scripts/seed_data.py
   ```

5. **Start the Core CRM Server**:
   ```bash
   uv run uvicorn main:app --reload --port 8000
   ```
   *The API documentation (Swagger) will be available at `http://localhost:8000/docs`.*

6. **Start the Channel Stub Service** (in a new terminal):
   ```bash
   cd channel_stub
   uv run uvicorn main:app --port 8001
   ```

## Architecture

- **Framework**: FastAPI (async/await)
- **Database ORM**: SQLAlchemy 2.0 (`Mapped` type annotations)
- **Data Validation**: Pydantic v2
- **AI Engine**: `google-genai`
- **Background Tasks**: FastAPI `BackgroundTasks` for lightweight async callback simulation.
