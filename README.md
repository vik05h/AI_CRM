# AI-Native Mini CRM for Consumer Brands

> **Xeno Engineering Take-Home Assignment | SDE Internship 2026**
>
> A production-grade, AI-native consumer engagement platform that helps marketers intelligently segment shoppers, auto-draft personalized campaigns, and track communication performance across channels.

---

## 🎬 Product Walkthrough & Video Demo

> 📹 **High-Definition Video Recording:** [Download / Watch Walkthrough Video (WebM)](docs/videos/ai_crm_walkthrough.webm)
>
> 🚀 **Live Interactive Application:** [https://ai-crm-edba6.web.app](https://ai-crm-edba6.web.app) *(Click **"Explore Live Demo"** or **"View Demo"** for instant evaluator access without requiring Google authentication).*
>
> ⚙️ **Production API (FastAPI):** [https://crm-backend-15tu.onrender.com/docs](https://crm-backend-15tu.onrender.com/docs)

### Visual Tour

| Landing Page (Engineered Night Theme) | Executive Overview Dashboard |
|:---:|:---:|
| ![Landing Page](docs/screenshots/01_landing_hero.png) | ![Dashboard Overview](docs/screenshots/03_dashboard_overview.png) |

| AI Segment Discovery | Real Customer Database (1,000 Seeded) |
|:---:|:---:|
| ![AI Segments](docs/screenshots/05_segments.png) | ![Customers Table](docs/screenshots/04_customers.png) |

| Campaign Builder & Channel Selection | Campaign Delivery & Analytics |
|:---:|:---:|
| ![Campaign Builder](docs/screenshots/06_campaigns.png) | ![Analytics Funnel](docs/screenshots/07_analytics.png) |

---

## Product Point of View (POV)

**The Problem:** Modern marketing is broken. Marketers either blast everyone with the same message (low relevance, high unsubscribe) or spend hours manually filtering spreadsheets to find the right audience (slow, error-prone).

**Our Bet:** An AI-native CRM where the system *proactively* surfaces high-opportunity customer segments, explains *why* they matter, auto-drafts context-aware messages, and asks the marketer for a single confirmation before executing. The marketer stays in control; the AI does the heavy lifting.

**What This Is:** A marketing & engagement tool for reaching shoppers/consumers — in the spirit of what Xeno does.
**What This Is NOT:** A sales/support CRM for deals, pipelines, leads, or tickets (no Salesforce/Attio clone).

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MARKETER (User)                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                    Angular Frontend (Port 4200)                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐ │   │
│  │  │  Dashboard   │  │  Segments    │  │  Campaign Builder & Approvals│ │   │
│  │  │  (KPIs)      │  │  (AI-found)  │  │  (AI-drafted messages)       │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  Customers   │  │  Orders      │  │  Campaigns   │  │  Analytics       │ │
│  │  API         │  │  API         │  │  API         │  │  API             │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  AI Engine (Vertex AI / Gemini)                                       │  │
│  │  - Dynamic SQL generation for segmentation                           │  │
│  │  - Message personalization & tone matching                             │  │
│  │  - Campaign recommendation reasoning                                   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Channel Service Stub (Separate Service)                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐ │  │
│  │  │  POST /send  │──▶│  Async Worker│──▶│  POST /api/callbacks         │ │  │
│  │  │  (non-block) │  │  (simulate)  │  │  (CRM receipt API)           │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Supabase/Neon)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  customers   │  │  orders      │  │  campaigns   │  │  comm_logs       │ │
│  │  (profiles)  │  │  (history)   │  │  (metadata)  │  │  (delivery state)│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Architecture?
- **Frontend (Angular):** Familiar dashboard paradigm for marketers, but AI-assisted at every step.
- **Backend (FastAPI):** Native async support for handling high-volume callback webhooks without blocking.
- **Database (PostgreSQL):** Relational data (customers ↔ orders ↔ campaigns) with ACID guarantees.
- **AI Engine (Vertex AI):** Gemini models for natural language → SQL, message generation, and reasoning.
- **Channel Stub (Separate Service):** Models real-world async delivery with simulated latencies and outcomes.

---

## AI-Native Product Flow (End-to-End)

### Flow 1: AI Discovers Segments (The "Ghosting" Engine)
Instead of static filters, the AI dynamically queries the database to find behavioral patterns:

| Segment | Definition | AI Query Logic |
|---------|-----------|----------------|
| **Lapsed Shoppers** | Bought 6+ months ago, gone cold | `last_order_date < NOW() - INTERVAL '6 months'` |
| **High-Intent Browsers** | Frequent visits, zero conversions | `session_count > 5 AND order_count = 0` |
| **Cart Abandoners** | Added items, reached checkout, exited | `cart_items > 0 AND checkout_reached = true AND order_placed = false` |

**AI Enhancement:** The AI doesn't just return IDs — it generates a *narrative summary*:
> *"We found 450 shoppers who abandoned their carts this week. 60% are first-time visitors. Top abandoned categories: Shoes (32%), Skincare (21%). Recommended hook: urgency-based discount."*

### Flow 2: Marketer Approval Workflow
The system surfaces segments with **context + recommendation + confirmation**:

1. **Discovery Card:** Segment size, behavioral explanation, predicted impact.
2. **AI-Drafted Message:** Context-aware copy with personalization tokens (`{{first_name}}`, `{{last_category}}`).
3. **Channel Selection:** AI-recommended channel (WhatsApp/SMS/Email) based on segment profile.
4. **One-Click Approval:** Marketer reviews and hits "Launch Campaign."

### Flow 3: Async Communication Loop (The Channel Stub)
This two-service, callback-driven loop is **core to the assignment** — it models real channel delivery:

```
┌─────────┐     POST /channel/send      ┌─────────────────┐
│  CRM    │ ───────────────────────────▶│  Channel Stub   │
│         │  {recipient, message,       │  (Separate      │
│         │   channel, campaign_id}      │   Service)       │
│         │                             │                 │
│         │ ◀───────────────────────────│  200 OK          │
│         │     Immediate Ack           │  (non-blocking)  │
│         │                             │                 │
│         │                             │  ┌───────────┐  │
│         │                             │  │  Async    │  │
│         │                             │  │  Worker   │  │
│         │                             │  │  (2-5s    │  │
│         │                             │  │   delay)  │  │
│         │                             │  └─────┬─────┘  │
│         │                             │        │        │
│         │     POST /api/callbacks     │        ▼        │
│         │ ◀───────────────────────────│  Simulate:      │
│         │  {comm_id, status,           │  delivered /    │
│         │   timestamp, metadata}      │  failed /       │
│         │                             │  opened /       │
│         │                             │  clicked        │
│         │                             └─────────────────┘
│         │
│         │  CRM ingests callback → updates comm_logs →
│         │  refreshes dashboard KPIs in real-time
└─────────┘
```

**Simulated Outcomes:**
- `sent` → `delivered` (85% probability)
- `delivered` → `opened` (60% probability)
- `opened` → `clicked` (25% probability)
- `clicked` → `converted` (10% probability — creates attributed order)
- Random `failed` (5% probability, with retry logic)

---

## Data Model (PostgreSQL)

```sql
-- Core Entities
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    preferred_channel VARCHAR(20) CHECK (preferred_channel IN ('whatsapp','sms','email','rcs')),
    created_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    total_amount DECIMAL(10,2) NOT NULL,
    items JSONB NOT NULL, -- [{"sku": "SHOE-001", "name": "Running Shoes", "qty": 1, "price": 89.99}]
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Engagement Entities
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    segment_description TEXT NOT NULL, -- AI-generated explanation
    target_segment JSONB NOT NULL, -- {"type": "lapsed", "criteria": "...", "estimated_size": 450}
    message_template TEXT NOT NULL, -- AI-drafted with {{tokens}}
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft → approved → sending → completed
    created_by VARCHAR(100) DEFAULT 'AI_Assistant',
    approved_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    customer_id UUID REFERENCES customers(id),
    channel VARCHAR(20) NOT NULL,
    message_content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending → sent → delivered → opened → clicked → converted / failed
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    failed_reason TEXT,
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics / Attribution
CREATE TABLE campaign_analytics (
    campaign_id UUID PRIMARY KEY REFERENCES campaigns(id),
    total_recipients INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    opened_count INT DEFAULT 0,
    clicked_count INT DEFAULT 0,
    converted_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    revenue_attributed DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Specification (FastAPI)

### Core CRM APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root status check |
| `GET` | `/health` | Real-time health & database connectivity check |
| `GET` | `/api/customers` | List all customers (with pagination) |
| `GET` | `/api/customers/{id}` | Get customer profile + order history |
| `GET` | `/api/orders` | List orders (filter by customer, date range) |
| `POST` | `/api/segments/discover` | **AI-powered**: Discover segments via natural language or predefined triggers |
| `GET` | `/api/segments` | List discovered segments with AI summaries |
| `POST` | `/api/campaigns` | Create campaign (AI auto-drafts if `auto_generate=true`) |
| `POST` | `/api/campaigns/{id}/approve` | Marketer approves → triggers send loop |
| `GET` | `/api/campaigns` | List campaigns with status & analytics |
| `GET` | `/api/campaigns/{id}/analytics` | Real-time performance metrics |
| `POST` | `/api/callbacks` | **Webhook**: Channel stub posts delivery updates |

### AI Engine APIs (Internal)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/segment` | Generate SQL + narrative from natural language intent |
| `POST` | `/ai/message` | Draft personalized message given segment + context |
| `POST` | `/ai/recommend` | Recommend channel + timing + discount strategy |

### Channel Stub APIs (Separate Service)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/channel/send` | Accept communication payload, return 200 OK immediately |
| `GET` | `/channel/health` | Health check for the stub service |

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Angular 21+ | Component-based, TypeScript-native, strong tooling for dashboard UIs |
| **Backend** | FastAPI (Python 3.10+) | Native async/await, automatic OpenAPI docs, high performance |
| **Database** | PostgreSQL (Supabase/Neon) | Relational integrity, JSONB for flexible metadata, free tier hosting |
| **AI Engine** | Google Vertex AI (Gemini) | Native Python SDK, strong reasoning + code generation for SQL |
| **ORM** | SQLAlchemy 2.0 + Alembic | Type-annotated models, migration management |
| **Task Queue** | Celery + Redis (or asyncio background tasks) | Async callback simulation, retry logic |
| **Channel Stub** | FastAPI (separate service) | Clean separation, models real-world service boundary |
| **Deployment** | Render / Railway / Fly.io | Free tier, easy PostgreSQL + service hosting |

---

## Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 20+ & Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL (local or Supabase/Neon connection string)
- Google Cloud account with Vertex AI API enabled

### 1. Clone & Structure
```bash
git clone <repo-url>
cd ai-native-mini-crm
```

Expected structure:
```
ai-native-mini-crm/
├── backend/                 # FastAPI CRM + Channel Stub
│   ├── app/
│   │   ├── main.py          # FastAPI app factory
│   │   ├── routers/         # API route modules
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── services/        # Business logic + AI integration
│   │   ├── ai/              # Vertex AI prompt engineering
│   │   └── core/            # Config, DB session, dependencies
│   ├── channel_stub/        # Separate channel simulation service
│   ├── alembic/             # Database migrations
│   ├── requirements.txt
│   └── .env
├── frontend/                # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Dashboard, Segments, Campaigns, Analytics
│   │   │   ├── services/    # HTTP services + state management
│   │   │   └── models/      # TypeScript interfaces
│   │   └── environments/
│   ├── angular.json
│   └── package.json
└── README.md
```

### 2. Backend Setup
```bash
cd backend
uv sync
```

Create `backend/.env`:
```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Google Vertex AI
GOOGLE_APPLICATION_CREDENTIALS=./keys/vertex-key.json
GOOGLE_CLOUD_PROJECT=your-project-id
VERTEX_MODEL=gemini-1.5-flash-001

# App
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development

# Channel Stub (internal)
CHANNEL_STUB_URL=http://localhost:8001
CRM_CALLBACK_URL=http://localhost:8000/api/callbacks
```

Run migrations & start:
```bash
uv run alembic upgrade head
uv run uvicorn main:app --reload --port 8000
# In another terminal:
cd backend/channel_stub
uv run uvicorn main:app --port 8001
```

API docs: `http://localhost:8000/docs` (Swagger UI)

### 3. Frontend Setup
```bash
cd frontend
npm install
ng serve
```

App: `http://localhost:4200`

---

## Production Deployment (Render + Firebase)

### Hosted URLs
- **Frontend (Firebase Hosting):** `https://ai-crm-edba6.web.app`
- **Backend API (Render):** `https://crm-backend-15tu.onrender.com`
- **Channel Stub (Render):** `https://channel-stub-ugn2.onrender.com`

### ⚠️ Important: Render Free Database Maintenance (Action Required After 31st Oct)

> [!WARNING]
> **Render Free PostgreSQL 30-Day Expiry Notice:**
> Free PostgreSQL instances created on Render have a strict **30-day lifespan**. The active free database will expire after **31st October 2026**.
> 
> **To redo this step and keep the backend running after 31st Oct:**
> 1. Open your [Render Dashboard](https://dashboard.render.com).
> 2. Click **New +** → **PostgreSQL**.
> 3. Set Name to `crm-db`, select Region **`Oregon (US West)`**, and choose the **Free** instance type.
> 4. Once created, copy the **Internal Database URL** (`postgres://...`).
> 5. Go to your `crm-backend` service → **Environment** tab.
> 6. Update `DATABASE_URL` with the new Internal Database URL and click **Save Changes**.
> 7. The backend will automatically boot up, apply migrations (`alembic upgrade head`), and re-seed 1,000 customers & 5,000 orders!
> *(Alternatively, connect a free Supabase or Neon database for permanent persistence).*

---

## Simulated Data Strategy

Since we don't have real customers/orders, we generate realistic synthetic data:

```python
# backend/scripts/seed_data.py
# Generates:
# - 1,000 customers with realistic names, emails, phone numbers
# - 5,000 orders across 12 months with seasonal patterns
# - Behavioral signals: session counts, cart events, checkout flags

# Run:
uv run python scripts/seed_data.py --customers 1000 --orders 5000
```

**Data realism principles:**
- Seasonal purchase patterns (higher in Nov-Dec)
- Customer lifetime value distribution (20% generate 80% revenue)
- Natural "ghosting" (exponential decay in repeat purchase probability)
- Cart abandonment rate (~65% industry average)

---

## Key Dashboard Views

### 1. Executive Overview
- Total customers, active campaigns, revenue attributed to campaigns
- Live communication funnel: Sent → Delivered → Opened → Clicked → Converted
- AI-recommended "next best action" card

### 2. Segment Discovery
- AI-discovered segments with narrative explanations
- Estimated audience size, predicted engagement rate, recommended channel
- One-click "Create Campaign" from any segment

### 3. Campaign Builder & Approval
- AI-drafted message preview with personalization tokens
- Channel selector with AI recommendation badge
- Marketer approval flow (Edit → Approve → Launch)

### 4. Campaign Performance
- Real-time status updates via callback ingestion
- Per-campaign funnel metrics
- Revenue attribution (orders placed within 24h of click)

---

## AI-Native Development Workflow

This project was built using an AI-native workflow:

1. **Architecture Design:** AI-assisted system design — reviewed tradeoffs for FastAPI vs. Django, PostgreSQL vs. MongoDB, Angular vs. React.
2. **Code Generation:** AI generated boilerplate (models, schemas, API stubs) from structured prompts; human reviewed and refined.
3. **Prompt Engineering:** Extensive iteration on Vertex AI prompts for SQL generation, message drafting, and reasoning.
4. **Testing:** AI-generated test cases for edge cases in callback handling, race conditions in async loops.
5. **Documentation:** This README was co-authored with AI to ensure clarity for both human reviewers and future AI assistants.

**Key Principle:** Every AI-generated line of code was reviewed, understood, and tested. The human remains the pilot; AI is the copilot.

---

## Assignment Evaluation Alignment

| Evaluation Criteria | How This README Guides the Build |
|--------------------|----------------------------------|
| **Build & Deploy** | Clear local setup + deployment path (Render/Railway) |
| **Creativity in Scoping** | Sharp POV: AI-assisted approval workflow, not everything shallow |
| **AI-Native Development** | Documented AI workflow; AI woven into product, not bolted on |
| **Code Quality & Structure** | Monorepo structure, clean separation of concerns |
| **System Design & Scalability** | Async callback loop, non-blocking send, retry logic documented |
| **Thought Clarity** | Architecture diagrams, data model, API spec, tradeoff rationale |

---

## Explicit Tradeoffs & Scale Assumptions

| Decision | At This Scope | At Scale |
|----------|--------------|----------|
| **Async callbacks** | asyncio background tasks | Celery + Redis/SQS workers |
| **Database** | Single PostgreSQL instance | Read replicas, connection pooling (PgBouncer) |
| **AI calls** | Synchronous Gemini API calls | Async batching, caching, fallback to cached segments |
| **Channel stub** | Single Python service | Dedicated microservice with its own queue |
| **Frontend state** | Angular 21 Signals (`signal()`, `computed()`) | NgRx or Akita for complex nested state |
| **Auth** | Firebase Auth (Google OAuth) + One-Click Demo Mode | Role-based access control (RBAC), multi-tenant enterprise SSO |

**What We Consciously Chose NOT to Build:**
-  Real messaging provider integration (assignment explicitly says stub)
-  Multi-tenant / multi-brand support (single brand scope)
-  Real-time WebSocket updates (polling sufficient for demo)
-  Complex A/B testing framework (out of scope)
-  Customer-facing preference center (marketer-facing only)

---

## Deliverables Checklist

- [x] **Hosted Product:** [https://ai-crm-edba6.web.app](https://ai-crm-edba6.web.app) (Frontend on Firebase Hosting, Backend on Render)
- [x] **Code Repository:** GitHub monorepo with clean conventional commit history (`git log`)
- [x] **Walkthrough Video:** High-definition video walkthrough recorded at [`docs/videos/ai_crm_walkthrough.webm`](docs/videos/ai_crm_walkthrough.webm)
- [x] **API Documentation:** Interactive Swagger UI at [`https://crm-backend-15tu.onrender.com/docs`](https://crm-backend-15tu.onrender.com/docs)
- [x] **Seed Data Script:** Realistic synthetic dataset generator (`1,000` customers, `5,000` orders) in [`backend/scripts/seed_data.py`](backend/scripts/seed_data.py)

---

## License

This project was built for the Xeno Engineering Take-Home Assignment (June 2026).

---

> *"Modern marketing shouldn't be about blind blasting."* — Built with AI, reviewed by humans.