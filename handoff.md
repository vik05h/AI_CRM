# AI CRM - Project Handoff Document

This document summarizes the current state of the AI CRM project to facilitate a seamless transition to a new agent session.

## Current Project State
We have successfully completed **Steps 1 through 6** of the Feature Implementation Order defined in `AGENTS.md`.

**Completed Milestones:**
- **Step 1 & 2:** Database models (`Customer`, `Order`, `Segment`, `Campaign`) created with async SQLAlchemy. Alembic migrations and seed data script (`scripts/seed_data.py`) are fully functional.
- **Step 3:** Core APIs (`GET /customers`, `GET /orders`, etc.) are implemented in FastAPI.
- **Step 4 & 5:** Mock AI Service (`ai_mock.py`) handles segment discovery based on natural language keywords. The frontend features a marketer-friendly `Preview Customers` panel that safely executes the generated SQL and visualizes the results with GSAP staggered animations.
- **Step 6:** Campaign Builder is live. It features a Two-Step Wizard UI with GSAP slide+fade transitions. Marketers can generate contextual email/SMS drafts via the AI Mock Service, review them, select a channel, and queue the campaign (status: `'approved'`).

## Architecture Notes
- The backend is running FastAPI on Port 8000 using asynchronous operations (`asyncSession`).
- The frontend uses Angular 17+ with standalone components, Signals for state management (in `crm.service.ts`), and `@if`/`@for` control flow.
- Auralis/Tailwind v4 utility classes are used for all responsive styling. No Bootstrap classes were used, strictly Tailwind.
- The UI features micro-animations built with GSAP.

## Next Session Focus
The next immediate priority is **Step 7: Channel Stub**.

According to `AGENTS.md`:
> "Channel Stub — Separate FastAPI app, async simulation, callback loop"
> "Two services: CRM (8000) and Channel Stub (8001) are SEPARATE processes"
> "Async callback loop: Stub receives `POST /send`, simulates delay (2-5s), calls back `POST /api/callbacks`"

You will need to:
1. Create the separate Channel Stub FastAPI application.
2. Integrate the `TODO` comment in `backend/main.py`'s `create_campaign_draft` endpoint to actually dispatch messages to this stub.
3. Build the callback ingestion webhook (`POST /api/callbacks`) in the main CRM to update campaign stats (`sent_count`, `converted_count`) and mark the campaign as `'completed'`.

## Suggested Skills for Next Session
When you start the next session, consider activating the following skills:
- `fastapi-templates` (for scaffolding the new Channel Stub service)
- `python-performance-optimization` (for async callbacks)
- `angular-component` (when updating the frontend to poll or display realtime delivery stats)

## Relevant Artifacts & Context
Please refer to the following artifacts from the previous session for deeper context on the code changes and design decisions:

- **Implementation Plan:** [implementation_plan.md](file:///C:/Users/Vikash/.gemini/antigravity-ide/brain/990f6390-7aeb-45c2-b794-e7a88e060b05/artifacts/implementation_plan.md)
- **Task List:** [task.md](file:///C:/Users/Vikash/.gemini/antigravity-ide/brain/990f6390-7aeb-45c2-b794-e7a88e060b05/artifacts/task.md)
- **Walkthrough / QA Report:** [walkthrough.md](file:///C:/Users/Vikash/.gemini/antigravity-ide/brain/990f6390-7aeb-45c2-b794-e7a88e060b05/artifacts/walkthrough.md)
