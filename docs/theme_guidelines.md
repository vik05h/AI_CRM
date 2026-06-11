# Auralis System - Theme Guidelines

This document translates the **Auralis System** from `DESIGN.md` into actionable frontend guidelines for Angular with Tailwind CSS v4.

## Core Philosophy
- **Engineered Softness**: Premium, enterprise-grade, minimalistic, and authoritative.
- **Tonal Layering**: Moving away from shadows, focusing on inset or layered elements with shifts in neutral values.
- **Warm Neutrals & Cool Taupes**: avoiding sterile pure white.

## Tailwind Configuration (v4)
Angular v21 uses Tailwind CSS v4. The colors and typography should be utilized via arbitrary values or defined as CSS variables in `styles.css`.

### Colors
**Backgrounds & Surfaces:**
- **Base Plate (App Background):** `#fdf8f8`
- **Recessed Layer (Panels/Sidebar):** `#f3f2ef` or `#e5e2e1`
- **Elevated Layer (Cards):** `#fcfcfb` with border `#e7e7e4`

**Text / Typography:**
- **Primary Text:** `#1c1b1b` (or `#111111`)
- **Secondary / Meta Text:** `#6b6b6b` (or `#444748`)

### Typography
Font Family: **Inter** (Apply globally on `body`).

| Element | Size | Weight | Tracking (Letter Spacing) | Leading (Line Height) |
|---|---|---|---|---|
| **H1** | 84px | 600 (Semibold) | `-0.04em` | `1.05` |
| **H2** | 64px | 600 (Semibold) | `-0.03em` | `1.1` |
| **H3** | 32px | 600 (Semibold) | `-0.02em` | `1.2` |
| **Body Lg**| 18px | 400 (Regular) | `-0.01em` | `1.6` |
| **Body Md**| 16px | 400 (Regular) | `0` | `1.5` |
| **Labels** | 12px | 600 (Semibold) | `0.1em` | `1.0` |

### Shapes & Radii
- **Cards/Containers:** Generous rounding, `rounded-[24px]` to `rounded-[28px]`.
- **Buttons/Inputs:** Tighter radius, `rounded-lg` or `rounded-xl` (`8px` to `12px`).
- **Never use sharp corners (`rounded-none`).**

### Layout & Spacing
- **Container:** `max-w-[1280px] mx-auto`
- **Base Unit:** 8px spacing system (`p-2`, `p-4`, `gap-2`).
- **Section Gaps:** Very large padding between major vertical sections: `py-[140px]`.

### Elevation (No Shadows)
Do NOT use `shadow-md` or standard Tailwind shadows. Instead, rely on tonal layers.
- A typical Card: `bg-[#FCFCFB] border border-[#E7E7E4] rounded-[24px]` placed on a `bg-[#FDF8F8]` or `bg-[#F3F2EF]` background.

### Interactive Elements
- **Primary Buttons:** `bg-[#111111] text-[#FCFCFB] rounded-xl px-6 py-3 font-semibold`
- **Secondary Buttons:** `bg-transparent border border-[#E7E7E4] text-[#111111] rounded-xl px-6 py-3 font-semibold`
- **Glows:** For active/hover states, use a very soft gradient background or border-bottom instead of a box-shadow.
