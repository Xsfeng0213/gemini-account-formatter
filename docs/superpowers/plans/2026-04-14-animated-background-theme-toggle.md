# Animated Background Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three subtle animated background themes with a compact top-left theme switcher while preserving all existing formatter behavior and readability.

**Architecture:** Keep the formatter logic untouched and layer the feature into the page shell only. Introduce a small theme-definition module for data and helper access, drive selection with local React state in `App.tsx`, and implement the moving blurred background mostly in CSS using theme-specific variables and keyframes.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Motion, Node test runner with `tsx`

---

## File Structure

- Create: `src/backgroundThemes.ts`
  Holds theme ids, labels, and helper access for background theme metadata.
- Create: `src/backgroundThemes.test.ts`
  Covers the theme definitions and default-theme helper with TDD.
- Modify: `src/App.tsx`
  Adds theme state, top-left theme switcher, and decorative background layers.
- Modify: `src/index.css`
  Adds background animation keyframes, theme variables, and reduced-motion handling.

### Task 1: Add theme definitions and default-theme helper

**Files:**
- Create: `src/backgroundThemes.test.ts`
- Create: `src/backgroundThemes.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import test from "node:test";
import assert from "node:assert/strict";
import {
  BACKGROUND_THEMES,
  DEFAULT_BACKGROUND_THEME,
  getBackgroundTheme,
} from "./backgroundThemes";

test("exposes the three expected background themes", () => {
  assert.deepEqual(
    BACKGROUND_THEMES.map((theme) => theme.id),
    ["cool-tech", "rainbow-jelly", "sunset-neon"],
  );
});

test("returns the first theme as the default background theme", () => {
  assert.equal(DEFAULT_BACKGROUND_THEME, "cool-tech");
  assert.equal(getBackgroundTheme(DEFAULT_BACKGROUND_THEME).label, "冷色科技感");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test src/backgroundThemes.test.ts`
Expected: FAIL with `Cannot find module .../backgroundThemes`

- [ ] **Step 3: Write minimal implementation**

```typescript
export type BackgroundThemeId =
  | "cool-tech"
  | "rainbow-jelly"
  | "sunset-neon";

export type BackgroundTheme = {
  id: BackgroundThemeId;
  label: string;
  accentClassName: string;
};

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: "cool-tech",
    label: "冷色科技感",
    accentClassName: "theme-cool-tech",
  },
  {
    id: "rainbow-jelly",
    label: "彩虹果冻感",
    accentClassName: "theme-rainbow-jelly",
  },
  {
    id: "sunset-neon",
    label: "日落霓虹感",
    accentClassName: "theme-sunset-neon",
  },
];

export const DEFAULT_BACKGROUND_THEME: BackgroundThemeId = "cool-tech";

export function getBackgroundTheme(id: BackgroundThemeId) {
  return BACKGROUND_THEMES.find((theme) => theme.id === id) ?? BACKGROUND_THEMES[0];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import tsx --test src/backgroundThemes.test.ts`
Expected: PASS with 2 passing tests

- [ ] **Step 5: Commit**

```bash
git add src/backgroundThemes.ts src/backgroundThemes.test.ts
git commit -m "feat: add background theme definitions"
```

### Task 2: Add the theme switcher and background layers to the page shell

**Files:**
- Modify: `src/App.tsx`
- Create: `src/backgroundThemes.ts`
- Test: `src/backgroundThemes.test.ts`

- [ ] **Step 1: Extend the failing test with theme metadata needed by the UI**

```typescript
test("provides UI metadata for each theme", () => {
  assert.deepEqual(
    BACKGROUND_THEMES.map((theme) => ({
      id: theme.id,
      label: theme.label,
      accentClassName: theme.accentClassName,
    })),
    [
      {
        id: "cool-tech",
        label: "冷色科技感",
        accentClassName: "theme-cool-tech",
      },
      {
        id: "rainbow-jelly",
        label: "彩虹果冻感",
        accentClassName: "theme-rainbow-jelly",
      },
      {
        id: "sunset-neon",
        label: "日落霓虹感",
        accentClassName: "theme-sunset-neon",
      },
    ],
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test src/backgroundThemes.test.ts`
Expected: FAIL because the metadata shape is not fully implemented yet

- [ ] **Step 3: Write minimal implementation**

```typescript
export type BackgroundTheme = {
  id: BackgroundThemeId;
  label: string;
  accentClassName: string;
  orbClasses: [string, string, string, string];
};
```

Then update `src/App.tsx` to:

```tsx
const [backgroundTheme, setBackgroundTheme] =
  useState<BackgroundThemeId>(DEFAULT_BACKGROUND_THEME);

const activeBackgroundTheme = getBackgroundTheme(backgroundTheme);
```

And render:

```tsx
<div className={`page-shell ${activeBackgroundTheme.accentClassName}`}>
  <div className="background-orb-stack" aria-hidden="true">
    {activeBackgroundTheme.orbClasses.map((orbClassName) => (
      <span key={orbClassName} className={`background-orb ${orbClassName}`} />
    ))}
  </div>
  <div className="relative z-10 max-w-6xl w-full">
    <div className="mb-4 flex justify-start">
      <div className="theme-toggle-shell">
        {BACKGROUND_THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => setBackgroundTheme(theme.id)}
            className={theme.id === backgroundTheme ? "theme-toggle-active" : "theme-toggle"}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import tsx --test src/backgroundThemes.test.ts`
Expected: PASS with all background-theme tests green

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/backgroundThemes.ts src/backgroundThemes.test.ts
git commit -m "feat: add theme switcher shell"
```

### Task 3: Add animated theme styles and reduced-motion handling

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add a failing reduced-motion test**

```typescript
test("exports stable theme class names for CSS targeting", () => {
  assert.deepEqual(
    BACKGROUND_THEMES.map((theme) => theme.accentClassName),
    ["theme-cool-tech", "theme-rainbow-jelly", "theme-sunset-neon"],
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test src/backgroundThemes.test.ts`
Expected: FAIL if CSS-targeted class names are missing or renamed

- [ ] **Step 3: Write minimal implementation**

Add CSS similar to:

```css
.page-shell {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.background-orb-stack {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.background-orb {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.32;
  animation: drift 18s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .background-orb {
    animation: none;
  }
}
```

And add theme-specific variables or classes for the three themes so the background colors change smoothly without affecting content readability.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import tsx --test src/backgroundThemes.test.ts`
Expected: PASS

- [ ] **Step 5: Run verification**

Run: `npm run lint && npm run build`
Expected: both commands exit successfully

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/App.tsx src/backgroundThemes.ts src/backgroundThemes.test.ts
git commit -m "feat: add animated background themes"
```

### Task 4: Manual UI verification

**Files:**
- Modify: none

- [ ] **Step 1: Run the app locally**

Run: `npm run dev -- --host 127.0.0.1 --port 3000`
Expected: local dev server starts successfully

- [ ] **Step 2: Verify the visual behavior**

Check:

- The page loads with `冷色科技感` selected by default
- The switcher appears near the top-left and does not cover the main card
- Each theme changes the background mood distinctly
- The background motion stays subtle and blurred
- Main card and footer text remain easy to read
- Gemini and ChatGPT tabs still function exactly as before

- [ ] **Step 3: Commit if any final visual tuning was needed**

```bash
git add src/App.tsx src/index.css src/backgroundThemes.ts src/backgroundThemes.test.ts
git commit -m "style: polish animated background themes"
```
