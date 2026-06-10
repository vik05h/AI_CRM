# Design PRD — AI-Native Mini CRM Landing Page

## Design Philosophy

NOT another generic dark SaaS template. This is a cinematic, editorial experience that feels like a premium product reveal. Think: Apple Keynote meets Stripe Press — every pixel intentional, every animation purposeful.

Mood: Confident, precise, slightly mysterious. Like the AI knows something you don't.

---

## Visual References (MANDATORY)

Study these before designing:

1. Stripe Press (press.stripe.com) — Typography hierarchy, editorial spacing
2. Linear.app — Dark mode done right, subtle gradients, glassmorphism
3. Vercel Ship — Landing page storytelling, scroll-driven reveals
4. Awwwards SOTD "Made With GSAP" — ScrollTrigger pinning, text reveals
5. Truus.co — Elastic hover, physics interactions

Rule: If it looks like a Tailwind UI template, reject it and start over.

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| bg-primary | #050508 | Deepest background (almost black) |
| bg-secondary | #0a0f1e | Card backgrounds, elevated surfaces |
| bg-glass | rgba(10, 15, 30, 0.6) | Glassmorphism overlays |
| accent-primary | #6366f1 | Indigo — primary actions, AI highlights |
| accent-secondary | #8b5cf6 | Violet — gradients, secondary emphasis |
| accent-glow | rgba(99, 102, 241, 0.15) | Subtle glow effects |
| text-primary | #f8fafc | Headlines, primary content |
| text-secondary | #94a3b8 | Body text, descriptions |
| text-muted | #475569 | Labels, metadata |
| success | #22d3ee | Cyan — positive metrics, delivered |
| warning | #fbbf24 | Amber — pending, attention |
| error | #f87171 | Red — failed, critical |

Gradient accents:
- Hero text gradient: linear-gradient(135deg, #f8fafc 0%, #6366f1 50%, #8b5cf6 100%)
- Card hover glow: radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 70%)

---

## Typography

| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---------|------|--------|------|-------------|----------------|
| Hero H1 | Inter | 800 | 72px / 4.5rem | 1.0 | -0.03em |
| Section H2 | Inter | 700 | 48px / 3rem | 1.1 | -0.02em |
| Card Title | Inter | 600 | 24px / 1.5rem | 1.3 | -0.01em |
| Body | Inter | 400 | 16px / 1rem | 1.6 | 0 |
| Label | Inter | 500 | 12px / 0.75rem | 1.4 | 0.05em |
| Stat Number | Inter | 700 | 40px / 2.5rem | 1.0 | -0.02em |

Font loading:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

---

## Spacing System

Base unit: 8px

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 8px | Tight gaps, icon padding |
| space-2 | 16px | Component internal padding |
| space-3 | 24px | Card padding |
| space-4 | 32px | Section element gaps |
| space-5 | 48px | Between major sections |
| space-6 | 64px | Section vertical padding |
| space-7 | 96px | Hero vertical padding |

Container: max-width 1200px, centered with px-6 (24px) mobile, px-12 (48px) desktop.

---

## Landing Page Sections & GSAP Animations

### Section 1: Hero

Layout:
- Full viewport height (100vh)
- Centered content, NOT left-aligned
- Background: subtle animated gradient mesh (CSS only, no heavy WebGL)

Content:
[Pill badge] "Xeno Engineering Assignment — June 2026"
[Hero H1] "Stop blasting."
[Hero H1] "Start connecting intelligently."
[Body] "AI discovers your best segments, drafts personalized messages, and asks you for one confirmation. You stay in control."
[CTA Button] "Enter Dashboard →"

GSAP Animation Sequence:

// Timeline: Page load, auto-plays
const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

heroTl
  .from(".hero-badge", { 
    y: 20, 
    opacity: 0, 
    duration: 0.8 
  })
  .from(".hero-headline-1", { 
    y: 60, 
    opacity: 0, 
    duration: 1.0,
    skewY: 3
  }, "-=0.4")
  .from(".hero-headline-2", { 
    y: 60, 
    opacity: 0, 
    duration: 1.0,
    skewY: 3
  }, "-=0.7")
  .from(".hero-body", { 
    y: 30, 
    opacity: 0, 
    duration: 0.8 
  }, "-=0.5")
  .from(".hero-cta", { 
    y: 20, 
    opacity: 0, 
    duration: 0.6 
  }, "-=0.3");

Hero H1 Gradient Effect:
.hero-headline {
  background: linear-gradient(135deg, #f8fafc 0%, #6366f1 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

---

### Section 2: Stats Bar (ScrollTrigger)

Layout:
- Horizontal row of 4 stat cards
- NOT a boring grid — cards have subtle hover lift

Content:
| Stat | Value | Label |
|------|-------|-------|
| Customers | 1,024 | Total shoppers |
| Revenue | Rs 1.59L | Attributed to campaigns |
| Delivery | 84.8% | Average delivery rate |
| Campaigns | 3 | Active right now |

GSAP Animation:

// ScrollTrigger: Staggered reveal when section enters viewport
gsap.from(".stat-card", {
  scrollTrigger: {
    trigger: ".stats-section",
    start: "top 80%",
    toggleActions: "play none none reverse"
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: "power2.out"
});

// Counter animation for numbers
gsap.from(".stat-number", {
  textContent: 0,
  duration: 2,
  ease: "power1.out",
  snap: { textContent: 1 },
  scrollTrigger: {
    trigger: ".stats-section",
    start: "top 80%"
  }
});

Card Design:
- Background: rgba(10, 15, 30, 0.6) with backdrop-filter: blur(12px)
- Border: 1px solid rgba(255, 255, 255, 0.05)
- Hover: transform: translateY(-4px), border glows with accent-primary
- Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

---

### Section 3: Feature Showcase (ScrollTrigger Pinning)

Layout:
- Split screen: Left text, Right visual
- Pinned — text scrolls, visual stays fixed

Content:
[Label] "AI-POWERED SEGMENTATION"
[Headline] "Find your hidden champions"
[Body] "The AI analyzes purchase history, browsing behavior, and cart abandonment patterns to surface high-opportunity segments you didn't know existed."
[Feature list]
  - Lapsed shoppers (6+ months cold)
  - High-intent browsers (5+ sessions, 0 orders)
  - Cart abandoners (items left behind)

GSAP Animation:

// Pin the visual, scroll the text
ScrollTrigger.create({
  trigger: ".feature-section",
  start: "top top",
  end: "+=1000",
  pin: ".feature-visual",
  scrub: 1
});

// Text reveals with highlight effect
gsap.from(".feature-text", {
  scrollTrigger: {
    trigger: ".feature-section",
    start: "top 60%",
    toggleActions: "play none none reverse"
  },
  y: 50,
  opacity: 0,
  duration: 1,
  stagger: 0.2
});

---

### Section 4: How It Works (Horizontal Scroll)

Layout:
- Horizontal scrolling section (vertical scroll drives horizontal movement)
- 3 steps, each full viewport width

Content:
Step 1: "Discover" — AI finds segments
Step 2: "Draft" — AI writes personalized messages
Step 3: "Approve" — One click to launch

GSAP Animation:

// Horizontal scroll section
const horizontalSection = gsap.to(".horizontal-track", {
  x: () =&gt; -(horizontalTrack.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-section",
    start: "top top",
    end: () =&gt; `+=${horizontalTrack.scrollWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true
  }
});

---

### Section 5: CTA Footer

Layout:
- Centered, massive headline
- Single CTA button with magnetic hover effect

Content:
[Headline] "Ready to stop blasting?"
[CTA] "Launch Your First Campaign →"

GSAP Animation:

// Magnetic button effect
const ctaButton = document.querySelector(".cta-button");

ctaButton.addEventListener("mousemove", (e) =&gt; {
  const rect = ctaButton.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  gsap.to(ctaButton, {
    x: x * 0.3,
    y: y * 0.3,
    duration: 0.3,
    ease: "power2.out"
  });
});

ctaButton.addEventListener("mouseleave", () =&gt; {
  gsap.to(ctaButton, {
    x: 0,
    y: 0,
    duration: 0.5,
    ease: "elastic.out(1, 0.3)"
  });
});

---

## Global Animation Principles

1. Easing: Default to power3.out for entrances, power2.inOut for transitions, elastic.out for playful interactions
2. Duration: UI elements: 0.3-0.5s, Content reveals: 0.8-1.2s, Hero sequence: 3-4s total
3. Stagger: Always stagger related elements (cards, list items) by 0.1-0.15s
4. ScrollTrigger defaults:
   - start: "top 80%" — trigger when element top hits 80% of viewport
   - toggleActions: "play none none reverse" — play on enter, reverse on leave back
5. Performance:
   - Use will-change: transform, opacity on animated elements
   - Prefer transform and opacity only (GPU-accelerated)
   - Avoid animating width, height, top, left

---

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| &lt; 768px (mobile) | Single column, horizontal scroll sections become vertical stack, reduce font sizes by 20% |
| 768-1024px (tablet) | 2-column grids, maintain animations but reduce complexity |
| &gt; 1024px (desktop) | Full experience, all animations active |

---

## Accessibility

- Respect prefers-reduced-motion: disable GSAP animations, show static content
- All interactive elements have focus states
- Color contrast ratio &gt; 4.5:1 for body text
- Semantic HTML: main, section, nav, button

---

## Anti-Slop Checklist

Before accepting any design, verify:

- [ ] Does it look like it could win an Awwwards SOTD?
- [ ] Are the animations purposeful or just "because we can"?
- [ ] Is the typography hierarchy clear at a glance?
- [ ] Does the color palette feel intentional, not default Tailwind?
- [ ] Are interactions delightful (magnetic buttons, hover states)?
- [ ] Does it feel like a premium product, not a Bootstrap template?

If ANY checkbox is unchecked, redesign.