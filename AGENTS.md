# AGENTS.md — AI-Native Mini CRM

&gt; Global instructions for all AI agents working on this project.
&gt; Location: ROOT of monorepo (AI_CRM/AGENTS.md)
&gt; References: README.md, architecture_and_design_decisions.md

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

**Rule:** Always check if a skill exists for your task before improvising.

---

## 🏗️ Project Architecture

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
```

### Key Architectural Rules
- **Two services:** CRM (8000) and Channel Stub (8001) are SEPARATE processes
- **Async callback loop:** Stub receives `POST /send`, simulates delay (2-5s), calls back `POST /api/callbacks`
- **Mock-first:** All AI features work offline via mock service before Vertex AI integration

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

class Customer(Base):
    __tablename__ = "customers"
    
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.
```
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
## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
