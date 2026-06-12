# AI-Native Mini CRM - Frontend

This is the Angular frontend for the AI-Native Mini CRM project, built with Angular 21, Tailwind CSS v4, and GSAP for rich animations.

## Tech Stack
- **Framework**: Angular 21 (Standalone Components, Signals, new Control Flow)
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP (GreenSock Animation Platform) + ScrollTrigger
- **HTTP**: `HttpClient` via `inject()`

## Setup and Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

3. **Build for production**:
   ```bash
   ng build
   ```
   The build artifacts will be stored in the `dist/` directory.

## Pages & Navigation
- **Landing Page**: Animated hero and feature showcase built with GSAP ScrollTrigger.
- **Dashboard**: High-level KPIs and funnels.
- **Segments**: AI-discovered segments matching behavioral SQL queries.
- **Campaigns**: Campaign builder with AI-drafted subject lines and messages.
- **Analytics**: Real-time campaign tracking showing "SENDING", "COMPLETED", and conversion rates.

## Notes
- State is managed reactively using Angular Signals (`signal()`, `computed()`).
- All components use the standalone API (`standalone: true`).
- GSAP animations are used extensively for page transitions, text reveals, and UI micro-interactions.
