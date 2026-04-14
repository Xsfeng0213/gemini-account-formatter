# Animated Background Theme Toggle Design

Date: 2026-04-14

## Goal

Refresh the page background so it feels more premium and alive without changing any formatter behavior. The page should keep its current layout and readability while adding:

- A subtle animated blurred-color background
- Three switchable visual themes
- A compact theme toggle in the top-left area
- Default selection set to the first theme

## Scope

In scope:

- Visual-only changes to the page shell and background layers
- A theme switcher rendered near the top-left of the page
- Smooth theme transitions
- Theme-aware background colors and floating blur orbs
- Preserving accessibility and readability of the existing cards

Out of scope:

- Any change to Gemini or ChatGPT formatting logic
- Any change to input, parsing, output, copy, or footer behavior
- Persistent theme storage across refreshes

## Chosen Approach

Use a CSS-first animated background with theme-driven color tokens and slow-moving blurred orb layers. Keep the current glass-card structure and place the animation behind all content.

This approach is preferred because it is lightweight, reliable, easy to tune, and less likely to create visual fatigue than a canvas-based or high-motion solution.

## Themes

### 1. Cool Tech

Default theme.

- Base background: soft blue to cyan haze
- Accent orbs: indigo, cyan, mint
- Overall feeling: calm, modern, high-trust

### 2. Rainbow Jelly

- Base background: pale multi-color wash
- Accent orbs: sky, pink, lemon, aqua
- Overall feeling: playful and colorful, but still soft

### 3. Sunset Neon

- Base background: warm cream with rose-orange glow
- Accent orbs: coral, orange, magenta, violet
- Overall feeling: atmospheric and more dramatic, without overpowering content

## Layout Changes

### Theme Toggle

Add a compact floating control near the top-left of the main page container.

Requirements:

- Visually lightweight glass style
- Displays the three theme names as pill buttons or segmented buttons
- Default selected theme is `Cool Tech`
- Clear active state
- Works on desktop and mobile without covering the main card

### Background Layering

Add a full-page background stack behind the content:

1. A soft base gradient driven by theme variables
2. Several oversized blurred color orbs
3. A faint radial texture or veil layer to soften the result

The content wrapper, cards, and footer remain above this layer.

## Motion Design

Animation should feel ambient rather than attention-seeking.

Rules:

- Use very slow drift, scaling, and position shifts
- No flashing, strobing, bouncing, or sharp looping
- Keep opacity low enough that text remains easy to read
- Theme switching should crossfade or smoothly transition color values
- Respect reduced-motion preferences by minimizing or disabling orb animation

## Implementation Notes

- Introduce a small theme config object in the app layer
- Use `useState` for the active visual theme
- Apply theme-specific classes or `data-theme` attributes to the page shell
- Render decorative background elements as separate absolutely positioned layers
- Place animation primarily in CSS keyframes to keep runtime simple
- Reuse the existing `motion` library only where it helps with subtle entrance or theme-toggle polish

## Readability Guardrails

- Preserve current card contrast and glass effect
- Keep the background effect behind all interactive UI
- Avoid saturated colors directly under dense text regions
- Ensure the main card remains the dominant focal point

## Testing And Verification

- Manual verification across all three themes
- Check desktop and narrow mobile widths
- Confirm tabs, input, output, copy buttons, and footer still behave exactly as before
- Verify reduced-motion behavior does not break layout
- Run TypeScript and production build verification after implementation

## Risks

### Risk: Background becomes too distracting

Mitigation:

- Use low opacity, large blur radii, and slow timing
- Keep one default theme especially restrained

### Risk: Theme toggle clashes with current header spacing

Mitigation:

- Anchor it inside the page container with responsive spacing
- Reduce control size on smaller screens

### Risk: Motion hurts performance or comfort

Mitigation:

- Prefer CSS transforms and opacity only
- Avoid too many animated elements
- Respect `prefers-reduced-motion`
