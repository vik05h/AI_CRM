---
name: Dark Glassmorphism (AI-Native CRM)
colors:
  primary: '#000000'
  on-primary: '#ffffff'
  background: '#000000'
  on-background: '#ffffff'
  panel-recessed: 'rgba(0, 0, 0, 0.4)'
  card-elevated: 'rgba(30, 30, 30, 0.4)'
  input-field: 'rgba(255, 255, 255, 0.05)'
  text-secondary: '#9ca3af' # gray-400
typography:
  fontFamily: Inter
  h1:
    fontSize: 84px
    fontWeight: '600'
    lineHeight: '1.05'
    letterSpacing: -0.04em
  h2:
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  h3:
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  interactive: 8px
  card: 24px
spacing:
  max_width: 1280px
  gutter: 32px
  container_padding: 32px
  section_gap: 160px
---

## Brand & Style

The visual identity of this design system is rooted in **"Engineered Night"** and **Glassmorphism**. It is a premium, AI-native aesthetic that balances deep, immersive darkness with glowing, translucent structural layers. The target audience consists of modern marketers and operators who value sleek, cutting-edge software that feels alive and responsive.

The design style moves away from flat light modes in favor of **Tonal Layering** using translucency and background blurs. The mood is powerful, authoritative, and dynamic, evoking the feeling of an advanced command center. Soft radial gradients in the background provide a "technical soul," preventing the interface from feeling like a void while maintaining a professional, cinematic weight.

## Colors

The palette is a study in **Deep Blacks** and **Luminescent Whites**. By utilizing a base of pure black `#000000` combined with radial gradient spots, the interface achieves a sense of infinite depth.

- **Primary Canvas:** The `body` background is a composite of subtle white radial gradients (acting as distant spotlights) over a `#000000` base and a dark `135deg` linear gradient.
- **Structural Layers (Glass):** Panels and cards use low-opacity black/grey fills (`rgba(30, 30, 30, 0.4)`) combined with intense backdrop blurs (`blur(24px)`) and saturation boosts (`saturate(120%)`). This creates the frosted glass effect.
- **Contrast & Text:** Pure `#ffffff` is used for primary text and high-emphasis elements, while `#9ca3af` (Tailwind `gray-400`) is used for metadata, auxiliary labels, and secondary text.

## Typography

This design system utilizes **Inter** to achieve a technical, geometric rhythm. The typography is highly editorial, favoring large-scale headlines with tight tracking to create a "dense" and impactful presence against the dark background.

- **Headlines:** `H1` and `H2` should always be set with negative letter-spacing (e.g., `-0.04em`) to emphasize the engineered, locked-in feel of the characters.
- **Body:** Standard body text is set at 16px or 18px with generous line heights to ensure readability within complex data environments.
- **Labels:** Small utility text (`.text-label-caps`) utilizes uppercase styling with increased letter-spacing (`0.1em`) to provide clear distinction from narrative body text. 
- **Hierarchy:** Use weight and color, not just size, to define importance. Headers are consistently Semibold and White, while functional data is Regular and Gray.

## Layout & Spacing

The layout philosophy is a **Fixed-Modular Grid**. Content is constrained to a `1280px` container to ensure a premium, centered viewing experience that feels curated rather than stretched.

- **Rhythm:** Section spacing is intentionally expansive (`160px`). This "white space" (or dark space, in this case) is a key brand asset, elevating the content and signaling an enterprise-grade focus on clarity.
- **Animations:** Elements frequently use GSAP for `.textflow-wrap` stagger animations and `appMagnetic` directives to make the layout feel fluid and interactive.

## Elevation & Depth (Glassmorphism)

This design system achieves depth exclusively through **Translucency, Blurs, and Inset Borders**, rather than traditional solid drop shadows.

1. **The Base Plate:** The animated gradient dark background.
2. **The Recessed Layer (`.panel-recessed`):** Used for interior modules, stats, or inactive states. It uses `rgba(0, 0, 0, 0.4)` with an inset shadow to appear "cut into" the base.
3. **The Elevated Layer (`.card-elevated`):** Used for primary interactive containers and dashboard widgets. It uses `rgba(30, 30, 30, 0.4)` with a bright `rgba(255, 255, 255, 0.1)` border. On hover, it brightens to `rgba(45, 45, 45, 0.5)` and lifts via `transform: translateY(-2px)`.

## Shapes

The shape language is "Soft-Industrial." While the layout is rigid and grid-based, the corners are generously rounded to provide a modern, premium feel.

- **Primary Cards:** Use a significant radius of `24px`. This large curve softens the "technical" edges of the data and creates a modular, containerized look.
- **Interactive Elements:** Buttons and form inputs use a tighter radius (`8px`) to signify they are precision tools within the larger containers.

## Components

Components in this design system should feel translucent but tactile.

- **Primary Buttons (`.btn-primary`):** Solid `#ffffff` background with `#000000` text for maximum contrast against the dark UI. They lift slightly on hover.
- **Secondary Buttons (`.btn-secondary`):** Transparent background with a `rgba(255, 255, 255, 0.3)` border and `#ffffff` text.
- **Inputs (`.input-field`):** Fields are translucent (`rgba(255, 255, 255, 0.05)`) with an `8px` blur. Focus states trigger a brighter border (`rgba(255, 255, 255, 0.4)`) and a subtle white outer glow.
- **Text Reveal Animations:** Text elements frequently use the `.textflow-line` structure, revealing from the bottom up (`y: 100%` to `y: 0%`) via GSAP when they enter the viewport.