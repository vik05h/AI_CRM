# AGENTS.md — AI-Native Mini CRM

> Global instructions for all AI agents working on this project.
> Location: ROOT of monorepo (AI_CRM/AGENTS.md)
> References: README.md, architecture_and_design_decisions.md

---

## 🧠 How to Use This File

Before generating ANY code, the agent MUST:
1. Read this AGENTS.md file
2. Read README.md for architecture and API specs
3. Read architecture_and_design_decisions.md for locked decisions
4. Activate relevant skills from `.agents/skills/` based on the task
5. Ask clarifying questions if requirements are ambiguous

---

## 🛠️ Available Skills (Activate Per Task)

### Backend Skills (`backend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `fastapi-templates` | Creating routes, dependency injection, middleware |
| `python-performance-optimization` | Optimizing queries, async patterns, caching |
| `supabase-postgres-best-practices` | Database design, migrations, JSONB queries |
| `.kilocode/` | General Python/FastAPI patterns and conventions |

### Frontend Skills (`frontend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `angular-component` | Creating components, services, directives |
| `bootstrap` | UI layout and responsive design (fallback) |
| `design-an-interface` | Dashboard UX, campaign builder UI |
| `diagnose` | Debugging frontend errors, performance issues |
| `git-guardrails-claude-code` | Commit messages, branch hygiene |
| `web-design-guidelines` | General web design principles, accessibility, layout |

### Animation Skills (`frontend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `gsap` | GSAP animations, timelines, tweens |
| `gsap-performance` | Optimizing GSAP animations, reducing layout thrash |
| `gsap-scrolltrigger` | Scroll-based animations, pinning, scrubbing |

### Code Quality & Review Skills (`frontend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `qa` | Quality assurance, testing strategies, edge cases |
| `review` | Code review feedback, catching bugs, style issues |
| `request-refactor-plan` | Planning refactors, improving existing code |
| `tdd` | Test-driven development, writing tests before code |
| `setup-pre-commit` | Pre-commit hooks, linting, formatting automation |

### Documentation & Writing Skills (`frontend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `edit-article` | Editing README, documentation copy |
| `writing-beats` | Writing rhythm and flow for documentation |
| `writing-fragments` | Drafting partial docs, notes, comments |
| `writing-shape` | Structuring documentation sections |
| `write-a-skill` | Creating new `.agents/skills/SKILL.md` files |
| `grill-with-docs` | Stress-testing documentation completeness |

### Architecture & Design Skills (`frontend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `improve-codebase-architecture` | Restructuring folders, improving module boundaries |
| `migrate-to-shoehorn` | Migrating patterns or refactoring legacy code |
| `ubiquitous-language` | Domain-driven design, naming conventions |
| `scaffold-exercises` | Creating boilerplate, scaffolding new features |

### Workflow & Process Skills (`frontend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `grill-me` | Alignment sessions, scoping decisions, tradeoff analysis |
| `handoff` | Preparing code for human review or deployment |
| `prototype` | Rapid prototyping, MVPs, proof-of-concept code |
| `teach` | Explaining code patterns, mentoring-style responses |
| `to-issues` | Converting TODOs and problems into GitHub issues |
| `to-prd` | Writing product requirement docs from conversations |
| `triage` | Prioritizing bugs, features, and technical debt |
| `zoom-out` | High-level system thinking, big picture architecture |

### Utility Skills (`frontend/.agents/skills/`)
| Skill | Use When |
|-------|----------|
| `caveman` | Simple, brute-force solutions when elegance is overkill |
| `obsidian-vault` | Knowledge management, linking concepts, note-taking |
| `setup-matt-pocock-skills` | TypeScript advanced patterns (if applicable) |

**Rule:** Always check if a skill exists for your task before improvising. Prefer specialized skills over general knowledge.

---

## 🏗️ Project Architecture

```
AI_CRM/
├── backend/          # FastAPI CRM (Port 8000) + Channel Stub (Port 8001)
│   ├── app/          # Main API: customers, orders, campaigns, analytics
│   ├── channel_stub/ # Separate service: simulates WhatsApp/SMS/Email delivery
│   ├── alembic/      # Database migrations
│   └── scripts/      # seed_data.py for synthetic data
├── frontend/         # Angular 21 + Tailwind v4 + GSAP
│   └── src/app/
│       ├── pages/    # Dashboard, Segments, Campaigns, Analytics
│       ├── components/
│       └── services/
└── docs/             # Architecture diagrams, API docs, decision records
```

### Key Architectural Rules
- **Two services:** CRM (8000) and Channel Stub (8001) are SEPARATE processes
- **Async callback loop:** Stub receives `POST /send`, simulates delay (2-5s), calls back `POST /api/callbacks`
- **Mock-first:** All AI features work offline via mock service before Vertex AI integration

---

## 🎯 Feature Implementation Order

Build in this EXACT sequence. Do NOT skip steps.

1. **Database & Models** — SQLAlchemy models + Alembic migration
2. **Seed Data** — `scripts/seed_data.py` with 1000 customers, 5000 orders
3. **Core APIs** — `GET /customers`, `GET /orders`, `GET /customers/{id}`
4. **Mock AI Service** — Returns realistic segments without Vertex AI
5. **Segment Discovery** — `POST /ai/segment` with natural language -> SQL
6. **Campaign Builder** — Create campaign, AI drafts message, marketer approves
7. **Channel Stub** — Separate FastAPI app, async simulation, callback loop
8. **Analytics** — Ingest callbacks, update dashboard metrics
9. **Frontend Shell** — Angular app, routing, Tailwind config, API service
10. **Dashboard Pages** — Connect to backend, display real data
11. **GSAP Polish** — Landing page animations, transitions

---

## 📋 Coding Standards

### Python (Backend)
- **Framework:** FastAPI with native `async/await`
- **ORM:** SQLAlchemy 2.0 with `Mapped[]` type annotations
- **Validation:** Pydantic v2 models for all request/response schemas
- **Database:** PostgreSQL with JSONB for flexible metadata
- **AI:** Google GenAI SDK with instant mock fallback

```python
# SQLAlchemy 2.0 pattern — ALWAYS use this style
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
from datetime import datetime, timezone
from uuid import uuid4

class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )
```

### TypeScript (Frontend)
- **Framework:** Angular 21 with standalone components
- **State:** Signals (`signal()`, `computed()`), NEVER mutate directly
- **DI:** Use `inject()` function, NOT constructor injection
- **Templates:** Native control flow (`@if`, `@for`, `@switch`), async pipe for observables
- **Styling:** Tailwind v4 utility classes
- **Animations:** GSAP with `ngZone.runOutsideAngular()` for DOM manipulation

```typescript
// Angular pattern — ALWAYS use this style
export class CampaignService {
  private http = inject(HttpClient);
  private campaigns = signal<Campaign[]>([]);

  readonly allCampaigns = computed(() => this.campaigns());

  loadCampaigns() {
    this.http.get<Campaign[]>('/api/campaigns')
      .subscribe(data => this.campaigns.set(data));
  }
}
```

---

## 📝 Documentation Rules (MUST Follow)

Every new feature, component, or API endpoint MUST include documentation:

### 1. README Updates
- When adding a new API endpoint, update the API table in `README.md`
- When adding a new page, update the Dashboard Views section
- When changing architecture, update the architecture diagram
- **Skill to use:** `edit-article`, `writing-shape`

### 2. Inline Code Documentation
- **Python:** Google-style docstrings for all public functions
- **TypeScript:** JSDoc comments for all public methods and complex logic
- **Skill to use:** `writing-fragments`

```python
# Python example
def discover_segments(criteria: str) -> list[Segment]:
    """Discover customer segments using AI-generated SQL queries.

    Args:
        criteria: Natural language description of desired segment.

    Returns:
        List of matching segments with metadata and estimated size.

    Raises:
        AIServiceError: If AI generation fails and mock is unavailable.
    """
```

```typescript
// TypeScript example
/**
 * Loads campaigns from the backend and updates the signal state.
 * Automatically handles error states and loading indicators.
 */
loadCampaigns(): void {
  this.loading.set(true);
  // ...
}
```

### 3. Component/Page README
Each major frontend page should have a brief header comment:
```typescript
/**
 * Campaign Builder Page
 * 
 * Features:
 * - AI-powered segment discovery
 * - Message drafting and personalization
 * - Marketer approval workflow
 * 
 * Related: CampaignService, SegmentService, AiService
 */
```

### 4. API Documentation
- FastAPI auto-generates Swagger at `/docs`
- Add `summary` and `description` to every route decorator
- Include response models with Pydantic

```python
@app.post("/api/campaigns", summary="Create new campaign", response_model=CampaignResponse)
async def create_campaign(request: CampaignCreate) -> CampaignResponse:
    """Create a new marketing campaign with AI-drafted message."""
    ...
```

---

## 🧪 Testing Checklist (Before Every Commit)

- [ ] API schema matches README specification
- [ ] Swagger UI (`/docs`) shows all endpoints correctly
- [ ] Async callback loop works end-to-end (stub -> CRM -> dashboard update)
- [ ] Mock AI works without Google Cloud credentials
- [ ] `ng build --configuration production` compiles without errors
- [ ] No secrets in code (`.env` is in `.gitignore`)
- [ ] Commit message follows format: `type(scope): description`
- [ ] **Skill to use:** `qa`, `review`, `setup-pre-commit`

---

## 🚨 Forbidden Patterns (NEVER Do These)

| Don't | Do Instead | Why |
|-------|-----------|-----|
| SQLite | PostgreSQL | JSONB required for `orders.items` |
| `*ngIf` / `*ngFor` | `@if` / `@for` | Angular new control flow |
| Constructor DI | `inject()` | Modern Angular pattern |
| Signal mutation | `.set()` / `.update()` | Reactive state management |
| Sync AI calls | Async with mock fallback | Non-blocking, works offline |
| Merge channel stub into main app | Separate service on Port 8001 | Assignment requirement |
| Commit `.env` | `.env.example` + `.gitignore` | Security |
| Complex logic in templates | Pure pipes or component methods | Maintainability |
| Skip documentation | Update README + inline docs | Reviewer clarity |

---

## 📝 Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scopes: backend, frontend, ai, channel, db, docs

Examples:
feat(backend): add customer CRUD with pagination
feat(ai): implement mock segmentation for lapsed shoppers
fix(channel): handle duplicate callback idempotently
feat(frontend): add campaign approval dashboard
docs(readme): update API specification with query params
```

**Skill to use:** `git-guardrails-claude-code`

---

## 💬 Agent Decision Tree

```
Starting a new task?
    |
    ▼
Is it backend-related?
    ├── YES -> Activate: fastapi-templates, supabase-postgres-best-practices
    |         Check .kilocode/ for Python conventions
    |
    └── NO -> Is it frontend-related?
              ├── YES -> Is it animation-related?
              |           ├── YES -> Activate: gsap, gsap-scrolltrigger, gsap-performance
              |           └── NO -> Activate: angular-component, design-an-interface
              |                     Use web-design-guidelines for accessibility
              |
              └── NO -> Is it documentation?
                        ├── YES -> Activate: edit-article, writing-shape, writing-fragments
                        └── NO -> Is it code quality/review?
                                  ├── YES -> Activate: qa, review, request-refactor-plan
                                  └── NO -> Is it architecture?
                                            ├── YES -> Activate: improve-codebase-architecture, ubiquitous-language, zoom-out
                                            └── NO -> Read README.md for context, then ask clarifying questions
```

---

## 📚 Essential Reference Files

| File | When to Read |
|------|-------------|
| `README.md` | Before ANY architectural decision |
| `architecture_and_design_decisions.md` | When tradeoffs are unclear |
| `backend/.env.example` | When adding new environment variables |
| `backend/requirements.txt` | When adding Python dependencies |
| `frontend/package.json` | When adding Node dependencies |
| `docs/` | When explaining architecture to humans |

---

## 🎯 Assignment Context

This is the **Xeno Engineering Take-Home Assignment (June 2026)**.
Evaluation criteria: Build & deploy, Creativity in scoping, AI-native development, Code quality, System design, Thought clarity.

Every line of code will be reviewed live. Understand everything you ship.

## Design

Use the design from DESIGN.md for the frontend.