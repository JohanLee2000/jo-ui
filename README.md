# UI Library — Project Plan & Roadmap

> **Working name:** `@yourscope/ui` (placeholder — rename before first publish)
> **Author:** Jo
> **Status:** Planning
> **Purpose:** A custom, production-grade React + TypeScript UI library built for my own websites, web apps, and web-based games, documented publicly as a portfolio project.

This README is the source of truth for the project: goals, architecture, conventions, best practices, the release process, and a phased roadmap. It is written so it can be handed directly to Claude Code as project context (see [Working with Claude Code](#18-working-with-claude-code)).

## Notes
To add more custom colors go to packages/tokens/src/primitive/color.json and can add a range of colors 50-950.
"Once everything works, you can give jo-ui a signature color. Pick one brand hex value and run it through a scale generator such as uicolors.app, which builds a full 50–950 scale from a single color. Then add it as a new primitive (for example color.brand) and point the semantic accent tokens at it. Because components only use semantic tokens, nothing else has to change."

To run Storybook use "pnpm storybook" inside of apps/docs
---

## Table of Contents

1. [Goals & Non-Goals](#1-goals--non-goals)
2. [Guiding Principles](#2-guiding-principles)
3. [Target Platforms](#3-target-platforms)
4. [Tech Stack](#4-tech-stack)
5. [Architecture](#5-architecture)
6. [Repository Structure](#6-repository-structure)
7. [Design Tokens & Theming](#7-design-tokens--theming)
8. [Responsive Design Strategy](#8-responsive-design-strategy)
9. [Component API Conventions](#9-component-api-conventions)
10. [Accessibility](#10-accessibility)
11. [Game UI Layer](#11-game-ui-layer)
12. [Performance & Bundle Strategy](#12-performance--bundle-strategy)
13. [Testing Strategy](#13-testing-strategy)
14. [Documentation](#14-documentation)
15. [Versioning, Releases & CI/CD](#15-versioning-releases--cicd)
16. [Going Live](#16-going-live)
17. [Roadmap](#17-roadmap)
18. [Working with Claude Code](#18-working-with-claude-code)
19. [Portfolio Documentation Plan](#19-portfolio-documentation-plan)
20. [Open Decisions](#20-open-decisions)
21. [Appendix: Checklists](#21-appendix-checklists)

---

## 1. Goals & Non-Goals

### Goals
- **One design system, many surfaces:** the same tokens and components power marketing sites, web apps, and in-game UI (HUDs, menus, inventories).
- **Industry grade:** accessible (WCAG 2.2 AA), fully typed, tested, tree-shakeable, versioned with semver, and documented.
- **Responsive everywhere:** from 320px phones to ultrawide monitors, touch, mouse, keyboard, and gamepad.
- **Themeable:** light/dark plus custom themes (e.g. a "game" theme per title) without touching component code.
- **Portfolio-ready:** clean public repo, live docs site, published npm package, and written case studies explaining decisions.

### Non-Goals (for v1)
- Competing with MUI/Chakra on component count. **Depth over breadth** — ~12–15 excellent components beat 60 mediocre ones.
- Supporting frameworks other than React (Vue/Svelte/Solid) in v1.
- Native mobile (React Native) in v1.
- Rendering UI *inside* a WebGL canvas. Game UI is DOM layered over the canvas (see [§11](#11-game-ui-layer)).

---

## 2. Guiding Principles

1. **Accessibility is not a feature, it's a requirement.** Every interactive component follows the [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) pattern for its role.
2. **Tokens first.** No hard-coded colors, spacing, radii, shadows, durations, or font sizes in component code. Everything comes from tokens.
3. **Composable over configurable.** Prefer compound components (`<Dialog.Trigger>`, `<Dialog.Content>`) over giant prop lists.
4. **Zero-runtime styling.** No CSS-in-JS that computes styles at render time. Styles compile to static CSS.
5. **Predictable APIs.** Same prop names mean the same thing everywhere (`size`, `variant`, `disabled`, `onOpenChange`).
6. **Controlled and uncontrolled.** Every stateful component works both ways.
7. **Own the markup.** Consumers can override styling and element type without forking.
8. **Document the "why."** Every non-obvious decision gets an Architecture Decision Record (ADR) in `docs/adr/`.

---

## 3. Target Platforms

| Surface | Examples | Key needs |
|---|---|---|
| **Marketing / content sites** | Portfolio, landing pages, Next.js sites | SSR-safe, fast first paint, fluid typography, SEO-friendly markup |
| **Web apps** | DinosaurDatabase, dashboards, SaaS | Forms, data display, dialogs, toasts, keyboard-heavy workflows |
| **Web games** | HUD/menus over Phaser, PixiJS, three.js, or plain canvas | Gamepad + keyboard navigation, high-frequency updates without re-render storms, scalable UI, themed look |
| **Non-web engines (tokens only)** | Godot | Exported design tokens (colors, type scale, spacing) so a Godot game shares the brand visually |

**Browser support:** last 2 versions of Chrome, Edge, Firefox, Safari (desktop + iOS), plus Samsung Internet. Defined in a shared `browserslist` config.

**React support:** `react` and `react-dom` as peer dependencies: `^18.3 || ^19`.

**SSR:** must render on the server without errors (Next.js App Router compatible). Client-only components are marked `"use client"`.

---

## 4. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Language | **TypeScript (strict)** | Typed props are part of the API contract |
| UI framework | **React** | Primary skill set; largest ecosystem |
| Monorepo | **pnpm workspaces + Turborepo** | Fast installs, cached builds, clean package boundaries |
| Styling | **vanilla-extract** (with `recipes` for variants) | Zero-runtime, type-safe CSS, compiles to static CSS files, great for theming with CSS variables. *Alternative:* CSS Modules + CSS custom properties |
| Tokens | **Style Dictionary** | Single JSON source → CSS variables, TS constants, JSON, and custom formats (Godot) |
| Behavior / a11y primitives | **Hand-built** for core learning components; **React Aria hooks** where complexity is high (see [§20](#20-open-decisions)) | Industry-grade keyboard/screen-reader behavior while still owning markup and styles |
| Positioning | **Floating UI** | Tooltips, popovers, menus — collision detection, flipping, virtual elements |
| Animation | CSS transitions + Web Animations API; optional **Motion** for complex sequences | Keep core lightweight; respect `prefers-reduced-motion` |
| Icons | Own `icons` package generated from SVGs via **SVGR** | Tree-shakeable, consistent sizing via tokens |
| Build | **tsup** (esbuild) with vanilla-extract plugin | Fast ESM builds + `.d.ts` generation |
| Docs / playground | **Storybook** (React + Vite) with MDX | Industry standard; interaction + a11y addons |
| Unit / integration tests | **Vitest + React Testing Library + user-event** | Fast, Jest-compatible API |
| Accessibility tests | **axe-core** (via `vitest-axe` and Storybook a11y addon) | Automated WCAG checks |
| Visual regression | **Playwright** screenshots (or **Chromatic** if budget allows) | Catch unintended visual changes |
| E2E / browser tests | **Playwright** | Real browser keyboard, focus, and gamepad-simulation tests |
| Lint / format | **ESLint** (typescript-eslint, jsx-a11y, react-hooks) + **Prettier** | Consistency and a11y linting |
| Commits | **Conventional Commits** + commitlint + Husky + lint-staged | Readable history, automated changelogs |
| Versioning | **Changesets** | Per-package semver + changelogs in a monorepo |
| CI/CD | **GitHub Actions** | Test, build, release, deploy docs |
| Bundle budgets | **size-limit** | Fail CI when a component exceeds its size budget |
| Docs hosting | **Vercel** (or AWS S3 + CloudFront) | See [§16](#16-going-live) |

---

## 5. Architecture

```
                  ┌────────────────────────┐
                  │   tokens/*.json         │  ← single source of truth
                  └──────────┬─────────────┘
                             │ Style Dictionary
       ┌─────────────┬───────┴───────┬──────────────┐
       ▼             ▼               ▼              ▼
  CSS variables   TS constants     JSON         Godot theme
  (themes)        (typed tokens)   (tooling)    (.tres / GDScript)
       │             │
       └──────┬──────┘
              ▼
   ┌───────────────────────┐
   │  @yourscope/ui-core    │  primitives, hooks, utils (no styles)
   └──────────┬────────────┘
              ▼
   ┌───────────────────────┐      ┌────────────────────────┐
   │  @yourscope/ui         │◄─────│  @yourscope/ui-icons    │
   │  styled components     │      └────────────────────────┘
   └──────────┬────────────┘
              ▼
   ┌───────────────────────┐
   │  @yourscope/ui-game    │  HUD, gamepad nav, game-specific widgets
   └───────────────────────┘
```

### Packages

| Package | Responsibility | Depends on |
|---|---|---|
| `@yourscope/tokens` | Token source + generated outputs (CSS, TS, JSON, Godot) | — |
| `@yourscope/ui-core` | Unstyled hooks & utilities: `useControllableState`, `useFocusTrap`, `useId`, `Slot`, `Portal`, `VisuallyHidden`, `mergeRefs`, `composeEventHandlers` | — |
| `@yourscope/ui` | Styled, themeable components for sites and apps | tokens, ui-core, ui-icons |
| `@yourscope/ui-icons` | SVG icon components | tokens |
| `@yourscope/ui-game` | Game UI: HUD layout, bars, inventory grid, dialogue box, gamepad/spatial navigation | ui, ui-core |

### Layering rules
- `ui-core` never imports styles.
- `ui` never imports from `ui-game`.
- Apps import only from public entrypoints, never deep internal paths.
- These rules are enforced with ESLint (`no-restricted-imports`) or `dependency-cruiser`.

---

## 6. Repository Structure

```
ui-library/
├── .changeset/                 # Changesets release notes
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # lint, typecheck, test, build, size
│   │   ├── release.yml         # Changesets → npm publish
│   │   └── docs.yml            # deploy Storybook / docs site
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── apps/
│   ├── docs/                   # Storybook (or Next.js docs site later)
│   ├── playground-web/         # Next.js app consuming the library like a real user
│   └── playground-game/        # Vite + canvas/Phaser demo with HUD over the game
├── packages/
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── primitive/      # raw values: color.json, space.json, type.json...
│   │   │   ├── semantic/       # meaning: color.bg.surface, color.text.muted...
│   │   │   └── themes/         # light.json, dark.json, game-fantasy.json...
│   │   ├── style-dictionary.config.ts
│   │   └── formats/godot.ts    # custom Godot output format
│   ├── ui-core/
│   │   └── src/{hooks,utils,primitives}/
│   ├── ui/
│   │   └── src/
│   │       ├── components/
│   │       │   └── button/
│   │       │       ├── Button.tsx
│   │       │       ├── Button.css.ts        # vanilla-extract styles/recipe
│   │       │       ├── Button.test.tsx
│   │       │       ├── Button.stories.tsx
│   │       │       ├── Button.mdx           # usage docs
│   │       │       └── index.ts
│   │       ├── theme/                       # ThemeProvider, theme contracts
│   │       └── index.ts
│   ├── ui-icons/
│   └── ui-game/
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   ├── devlog/                 # weekly notes for the portfolio
│   └── contributing.md
├── tooling/
│   ├── eslint-config/
│   ├── tsconfig/
│   └── browserslist-config/
├── CLAUDE.md                   # instructions for Claude Code (see §18)
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 7. Design Tokens & Theming

### Three-tier token model

| Tier | Example | Used by |
|---|---|---|
| **Primitive** | `color.green.500 = #2f9e44`, `space.4 = 16px` | Only semantic tokens |
| **Semantic** | `color.bg.surface`, `color.text.primary`, `color.border.focus`, `space.inset.md` | Components |
| **Component** (sparingly) | `button.radius`, `hud.bar.height` | A single component |

**Rule:** components only reference semantic or component tokens, never primitives. Swapping themes = remapping semantic tokens.

### Token categories
- Color (with contrast-checked pairs)
- Typography: font families, fluid type scale, weights, line heights, letter spacing
- Spacing scale (4px base)
- Sizing (control heights per size: `sm`, `md`, `lg`)
- Radii
- Shadows / elevation
- Border widths
- Motion: durations and easings
- Z-index layers (`base`, `dropdown`, `overlay`, `modal`, `toast`, `tooltip`, `hud`)
- Breakpoints and container sizes
- Density (`compact`, `comfortable`, `touch`)

### Theming mechanics
- Tokens compile to CSS custom properties scoped by attribute:
  ```css
  :root, [data-theme="light"] { --color-bg-surface: #ffffff; }
  [data-theme="dark"]         { --color-bg-surface: #121212; }
  [data-theme="game-fantasy"] { --color-bg-surface: #2a1d12; }
  ```
- A `ThemeProvider` sets `data-theme` and `data-density`, and supports nested themes (e.g. a dark game panel inside a light page).
- Default to the system preference (`prefers-color-scheme`) with a user override persisted by the consuming app.
- **No flash of wrong theme:** document a small inline script for SSR apps that sets `data-theme` before paint.
- Every theme must pass automated contrast checks in CI (a script validates semantic text/background pairs against WCAG AA ratios).

### Godot export
A custom Style Dictionary format outputs a Godot `Theme` resource (`.tres`) or a GDScript constants file containing colors, font sizes, and spacing, so a Godot game can share the visual identity.

---

## 8. Responsive Design Strategy

### Layout
- **Mobile-first** CSS.
- **Container queries** for component-level responsiveness (a card adapts to its container, not the viewport). Media queries are reserved for page-level layout.
- Breakpoint tokens (suggested): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Layout primitives in v1: `Box`, `Stack`, `Inline`, `Grid`, `Container`, `AspectRatio`, plus responsive prop values:
  ```tsx
  <Stack gap={{ base: 2, md: 4 }} direction={{ base: "column", md: "row" }} />
  ```

### Typography & sizing
- **Fluid type** with `clamp()` (e.g. `font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem)`).
- Use `rem` for type and spacing so user font-size settings are respected.
- Use `dvh`/`svh` instead of `vh` for full-height layouts on mobile.

### Input modalities
- Minimum touch target **44×44px** (24×24px absolute minimum per WCAG 2.2), driven by the `touch` density.
- Adapt with `@media (pointer: coarse)` and `(hover: hover)` — never rely on hover alone to reveal information.
- Respect `env(safe-area-inset-*)` for notches and home indicators (important for fullscreen games).
- Support keyboard, mouse, touch, pen, and gamepad (see [§11](#11-game-ui-layer)).

### User preferences
- `prefers-reduced-motion` → disable non-essential animation.
- `prefers-contrast: more` → optional high-contrast theme.
- `forced-colors` (Windows High Contrast) → components remain usable; test borders and focus rings.

---

## 9. Component API Conventions

### Naming & props
- PascalCase components, camelCase props, `on` + PastTense or `on` + Noun + `Change` for events: `onOpenChange`, `onValueChange`.
- Shared prop vocabulary: `size` (`sm | md | lg`), `variant` (`solid | outline | ghost | ...`), `tone` (`neutral | accent | success | warning | danger`), `disabled`, `loading`, `fullWidth`.
- Booleans are positive (`disabled`, not `notEnabled`).

### Patterns
- **Controlled + uncontrolled:** `value` / `defaultValue` / `onValueChange`, implemented via a shared `useControllableState` hook.
- **Compound components** for anything with parts:
  ```tsx
  <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Root>
  ```
- **`asChild` / Slot pattern** to render a component's behavior onto a consumer's element (e.g. a Next.js `Link` styled as a `Button`).
- **Ref forwarding** on every component that renders a DOM element.
- **Prop passthrough:** spread remaining native props onto the root element, typed with `ComponentPropsWithoutRef<'button'>` etc.
- **`className` and `style` merge,** never replace.
- **State via data attributes** for styling hooks: `data-state="open"`, `data-disabled`, `data-orientation`.
- **Stable, documented CSS variables** per component for overrides (e.g. `--button-radius`).
- **No default margins** on components — spacing is the parent's job.

### TypeScript
- `strict: true`, no `any` in public types.
- Export prop types (`ButtonProps`) for every component.
- Variant types are derived from the vanilla-extract recipe so styles and types can't drift.

---

## 10. Accessibility

**Target:** WCAG 2.2 Level AA.

- Follow the APG pattern for each widget (Dialog, Menu, Tabs, Combobox, Listbox, Tooltip, etc.).
- **Keyboard:** everything operable without a mouse; logical tab order; arrow-key navigation inside composite widgets (roving tabindex).
- **Focus management:** visible focus ring via `:focus-visible` using a focus token; trap focus in modals; return focus to the trigger on close.
- **Screen readers:** correct roles, names, and states; `aria-live` regions for toasts and game notifications.
- **Labels:** every form control has a programmatic label; error messages linked via `aria-describedby`.
- **Color:** never the only carrier of meaning (e.g. health bars also show numbers or icons).
- **Motion:** honor reduced-motion.
- **Testing:**
  - Automated: axe in unit tests and Storybook; `eslint-plugin-jsx-a11y`.
  - Manual: keyboard-only pass, VoiceOver (macOS/iOS), NVDA (Windows), TalkBack (Android) before each minor release.
- Each component's docs page includes a **"Keyboard interactions"** table and an **"Accessibility notes"** section.

---

## 11. Game UI Layer

Game UI is rendered as **DOM overlaid on the game canvas**, which keeps text crisp, accessible, and styleable with the same tokens.

### `@yourscope/ui-game` components (planned)
| Component | Notes |
|---|---|
| `HudLayer` | Full-screen overlay with anchor slots (top-left, top-center, bottom-right…), `pointer-events: none` except on interactive children, safe-area aware |
| `StatBar` | Health/mana/XP; animated fill via CSS `transform` (no layout thrash); optional segmented style |
| `ResourceCounter` | Coins/gems with tabular numbers and animated increments |
| `DialogueBox` | Typewriter text, speaker portrait slot, skip/advance, `aria-live` |
| `GameMenu` | Pause/main menu with full gamepad + keyboard navigation |
| `InventoryGrid` | Grid with spatial navigation, drag and drop, tooltips, rarity theming |
| `CardFrame` | Themeable card shell (useful for card games like Dinomon) |
| `Notification` / `Toast` | Achievement and pickup popups, queue-based |
| `Minimap` slot | Layout container; rendering is the game's job |

### Input & navigation
- **Spatial navigation** hook (`useSpatialNavigation`): arrow keys / D-pad / left stick move focus to the nearest focusable element in that direction.
- **Gamepad support** via the Gamepad API, polled in `requestAnimationFrame`, mapped to semantic actions (`confirm`, `back`, `navigate`), with remappable bindings.
- **Input-mode detection:** show button prompts that match the last-used device (keyboard keys vs. gamepad glyphs vs. touch).

### Performance rules for game UI
- High-frequency values (HP, timers, positions) update via **refs and CSS variables**, or a lightweight external store with selectors — never by re-rendering a large React tree every frame.
- Animate only `transform` and `opacity`.
- Provide a **UI scale** setting (CSS variable multiplier) so the HUD scales with resolution and user preference.
- Optional **sound hooks** (`onNavigateSound`, `onConfirmSound`) so the game can play SFX without the library bundling audio.

### Engine integration
- Engine-agnostic: works with Phaser, PixiJS, three.js/React Three Fiber, or raw canvas.
- `playground-game` demonstrates an event bridge between the game loop and the UI.
- Godot games consume **tokens only** (see [§7](#7-design-tokens--theming)).

---

## 12. Performance & Bundle Strategy

- **ESM only** output (optionally CJS if a consumer needs it), with `"sideEffects": ["*.css"]` so bundlers tree-shake unused components.
- **Per-component entrypoints** via the `exports` map (`@yourscope/ui/button`) in addition to the barrel export.
- **Static CSS** shipped per component; document how to import the global stylesheet once.
- **size-limit** budgets per component in CI (e.g. Button < 3 kB gzipped JS).
- Avoid heavy dependencies; every new runtime dependency needs an ADR.
- Lazy-load heavy components (e.g. a date picker) where possible.
- Measure: React DevTools Profiler for re-renders; Lighthouse on the playground and docs site.

---

## 13. Testing Strategy

| Layer | Tool | What it covers |
|---|---|---|
| Static | TypeScript, ESLint | Types, hooks rules, a11y lint |
| Unit | Vitest + RTL | Rendering, props, controlled/uncontrolled state, event handlers |
| Interaction | user-event / Storybook interaction tests | Keyboard flows, focus, open/close |
| Accessibility | axe | Automated WCAG violations per story and test |
| Visual regression | Playwright screenshots (or Chromatic) | Every story in light/dark, key breakpoints |
| E2E | Playwright | Real-browser focus traps, portals, scroll lock, gamepad simulation |
| Type tests | `expectTypeOf` (Vitest) | Public API types stay correct |

**Coverage target:** 90%+ statements on `ui-core` and `ui`, but behavior coverage (every keyboard interaction from the APG pattern) matters more than the number.

---

## 14. Documentation

Each component has:
1. **Overview** — what it is and when to use it (and when *not* to).
2. **Live examples** — Storybook stories for every variant, size, and state.
3. **Props table** — auto-generated from TypeScript.
4. **Keyboard interactions** table.
5. **Accessibility notes.**
6. **Theming** — CSS variables and tokens it uses.
7. **Do / Don't** guidance.

Project-level docs:
- Getting started (install, global CSS, ThemeProvider, Next.js setup).
- Theming guide and how to create a custom game theme.
- Token reference (auto-generated).
- Game UI guide with the canvas overlay pattern.
- Changelog (generated by Changesets).
- ADRs in `docs/adr/` — numbered, dated, with context / decision / consequences.

---

## 15. Versioning, Releases & CI/CD

### Versioning
- **Semantic Versioning.** Stay on `0.x` until the core API is stable; then `1.0.0`.
- Breaking changes require a changeset marked `major` and a migration note.
- Deprecate before removing: log a dev-only warning for at least one minor version.

### Workflow
1. Branch from `main` → `feat/button-loading-state`.
2. Conventional commits (`feat(button): add loading state`).
3. Add a changeset (`pnpm changeset`).
4. Open a PR → CI must pass → merge (squash).
5. Changesets bot opens a "Version Packages" PR → merging it publishes to npm.

### CI pipeline (`ci.yml`) — on every PR
1. Install (pnpm, cached)
2. Lint + format check
3. Typecheck
4. Unit + a11y tests
5. Build all packages
6. size-limit check
7. Build Storybook + visual regression
8. Token contrast check

### Release pipeline (`release.yml`) — on `main`
- Changesets action → version bump → `npm publish --provenance` → GitHub Release with notes.

### Security & hygiene
- Dependabot or Renovate for dependency updates.
- `npm audit` / GitHub security alerts.
- Branch protection on `main`.
- Publish with npm **provenance** and an automation token stored in GitHub Secrets.

---

## 16. Going Live

"Live" means three things: an installable package, a public docs site, and demo apps.

### 1. Publish the package to npm
- Create an npm account and an org/scope (e.g. `@yourscope`).
- Set `"publishConfig": { "access": "public" }` in each package.
- Add `NPM_TOKEN` to GitHub Secrets and let `release.yml` publish.
- *Private alternative:* GitHub Packages, if you want it only for your own projects at first.

### 2. Deploy the docs site
| Option | Notes |
|---|---|
| **Vercel** (recommended to start) | Push-to-deploy, PR preview URLs, free tier, custom domain |
| **Chromatic** | Hosts Storybook and adds visual review; free tier available |
| **AWS S3 + CloudFront** | Shows AWS skills; deploy via GitHub Actions with OIDC (no long-lived keys), Route 53 for DNS, ACM for HTTPS |
| GitHub Pages | Simplest; fine for Storybook static build |

Suggested: Vercel first for speed, then migrate to (or mirror on) S3 + CloudFront with infrastructure as code (AWS CDK in TypeScript) as a portfolio bonus.

### 3. Custom domain
- e.g. `ui.yourdomain.com` for docs and `yourdomain.com/projects/ui` for the case study.

### 4. Demo apps
- Deploy `playground-web` (Next.js) and `playground-game` (Vite) so reviewers can try the library in real contexts.

### 5. Dogfooding
- Use the library in your portfolio site, DinosaurDatabase, and at least one web game prototype. Real usage is the strongest proof it's production-grade.

---

## 17. Roadmap

Assumes **~10+ hours/week**. Each phase ends with a demoable milestone and a devlog entry.

### Phase 0 — Foundations (Weeks 1–2)
- [ ] Write ADR-001 (stack), ADR-002 (styling), ADR-003 (behavior primitives strategy)
- [ ] Monorepo scaffold: pnpm, Turborepo, shared tsconfig/eslint/prettier
- [ ] Husky, lint-staged, commitlint, Changesets
- [ ] CI pipeline skeleton (lint, typecheck, test, build)
- [ ] Storybook running with a11y addon
- [ ] `CLAUDE.md` written
- **Milestone:** empty but fully wired repo; CI green.

### Phase 1 — Design Tokens & Theming (Weeks 3–4)
- [ ] Primitive + semantic tokens (color, type, space, radius, shadow, motion, z-index, breakpoints)
- [ ] Style Dictionary outputs: CSS vars, TS, JSON
- [ ] Light + dark themes; ThemeProvider; density modes
- [ ] Contrast-check script in CI
- [ ] Token reference page in docs
- **Milestone:** themed "foundations" Storybook page; theme switcher works.

### Phase 2 — Core Primitives & Layout (Weeks 5–6)
- [ ] `ui-core`: `useControllableState`, `useId`, `mergeRefs`, `composeEventHandlers`, `Slot`, `Portal`, `VisuallyHidden`, `useFocusTrap`, `useScrollLock`
- [ ] Layout: `Box`, `Stack`, `Inline`, `Grid`, `Container`, responsive props
- [ ] Typography: `Text`, `Heading`
- **Milestone:** responsive layout demo page in `playground-web`.

### Phase 3 — Essential Components (Weeks 7–10)
- [ ] Button, IconButton
- [ ] Input, Textarea, Field (label + hint + error)
- [ ] Checkbox, Radio Group, Switch
- [ ] Icons package
- [ ] Visual regression set up
- **Milestone:** a complete, accessible form in the playground.

### Phase 4 — Overlay & Composite Components (Weeks 11–15)
- [ ] Dialog / Modal (hand-built; write a deep-dive post)
- [ ] Tooltip, Popover (Floating UI)
- [ ] Dropdown Menu
- [ ] Tabs
- [ ] Toast system
- [ ] Select / Combobox (hand-built; second deep-dive post)
- **Milestone:** `v0.1.0` published to npm; docs site live on a custom domain.

### Phase 5 — Game UI Layer (Weeks 16–20)
- [ ] Input-mode detection, Gamepad API wrapper, `useSpatialNavigation`
- [ ] `HudLayer`, `StatBar`, `ResourceCounter`
- [ ] `GameMenu`, `DialogueBox`, `Notification`
- [ ] `InventoryGrid`, `CardFrame`
- [ ] Game theme(s) + UI scale setting
- [ ] Godot token export
- [ ] `playground-game` demo deployed
- **Milestone:** `v0.2.0`; playable demo with HUD and gamepad-navigable menus.

### Phase 6 — Hardening & 1.0 (Weeks 21–24)
- [ ] Manual screen-reader audit on all components
- [ ] Performance pass + size budgets locked
- [ ] API review: naming consistency, deprecations
- [ ] Migration guide, contributing guide
- [ ] Dogfood in portfolio site and DinosaurDatabase
- [ ] Optional: migrate docs hosting to AWS CDK + CloudFront
- **Milestone:** `v1.0.0` and the full portfolio case study published.

### Later / Backlog
- Data Table, Date Picker, Slider, Accordion, Avatar, Badge, Progress, Skeleton, Pagination, Breadcrumbs, Command Palette
- RTL support
- Figma token sync
- CLI to scaffold new themes

---

## 18. Working with Claude Code

Create a `CLAUDE.md` at the repo root so Claude Code follows the project's rules. Suggested contents:

```markdown
# CLAUDE.md

## Project
React + TypeScript UI library monorepo (pnpm + Turborepo). See README.md for architecture and roadmap.

## Commands
- Install: `pnpm install`
- Dev docs: `pnpm --filter docs dev`
- Test: `pnpm test` (single package: `pnpm --filter @yourscope/ui test`)
- Lint/typecheck: `pnpm lint && pnpm typecheck`
- Build: `pnpm build`
- Add changeset: `pnpm changeset`

## Rules
- Never hard-code colors, spacing, radii, font sizes, durations. Use semantic tokens.
- Every component folder contains: Component.tsx, Component.css.ts, Component.test.tsx, Component.stories.tsx, index.ts.
- Follow the WAI-ARIA APG pattern for the widget; include keyboard tests for every interaction listed.
- Support controlled + uncontrolled via useControllableState.
- Forward refs, spread native props, merge className.
- No new runtime dependency without an ADR in docs/adr/.
- Conventional commits. Add a changeset for any user-facing change.
- Run lint, typecheck, and tests before declaring a task done.

## Current phase
Phase X — <name>. See README §17.
```

### Recommended workflow
1. Work **one roadmap item at a time**; ask Claude Code to plan first, then implement.
2. Ask for tests and stories **in the same task** as the component.
3. Review accessibility behavior manually; don't trust automated checks alone.
4. Update the "Current phase" line in `CLAUDE.md` as you progress.
5. Write the devlog entry yourself — your reasoning is the portfolio value.

---

## 19. Portfolio Documentation Plan

### What to publish
- **Case study page** on the portfolio: problem, goals, architecture diagram, key decisions, results, what I'd do differently.
- **Deep-dive posts** (2–4):
  1. Building an accessible Dialog from scratch (focus traps, inert, scroll lock)
  2. One token system for websites, web games, and Godot
  3. Gamepad and spatial navigation for DOM-based game UI
  4. Zero-runtime theming with vanilla-extract and CSS variables
- **Links:** GitHub repo, npm package, live docs, game demo.

### Metrics to capture as you go
- Number of components, test count, coverage %
- Bundle size per component (gzipped)
- axe violations: 0
- Lighthouse scores of docs and playground
- Screen readers and devices tested
- Before/after screenshots and short GIFs of the game HUD with a gamepad

### Habits
- Weekly devlog in `docs/devlog/YYYY-MM-DD.md` (what I built, what was hard, what I decided).
- Keep ADRs up to date — they become case-study material almost for free.
- Use good-first-issue labels and a contributing guide so the repo looks like a real open-source project.

---

## 20. Open Decisions

| # | Decision | Options | Leaning |
|---|---|---|---|
| 1 | Behavior primitives | Fully hand-built · React Aria hooks · Radix primitives | Hand-build Dialog + Combobox for learning; React Aria hooks for other complex widgets |
| 2 | Styling engine | vanilla-extract · CSS Modules + CSS vars · Tailwind + cva | vanilla-extract |
| 3 | Visual regression | Playwright screenshots · Chromatic | Playwright (free), revisit later |
| 4 | Docs host | Vercel · Chromatic · AWS S3 + CloudFront | Vercel now, AWS later |
| 5 | Package name / scope | TBD | Check npm availability first |
| 6 | Public or private package at launch | npm public · GitHub Packages private | Public (portfolio value) |
| 7 | License | MIT · Apache-2.0 | MIT |
| 8 | Brand / visual identity | Neutral base + per-project themes · Strong signature look | Neutral base + signature default theme |

Record each final choice as an ADR.

---

## 21. Appendix: Checklists

### Component Definition of Done
- [ ] Follows APG pattern (if interactive); keyboard interactions implemented and tested
- [ ] Uses only semantic/component tokens
- [ ] Works in light, dark, and game themes
- [ ] Responsive: tested at 320px, 768px, 1280px+; container-query aware where relevant
- [ ] Touch target sizes met in `touch` density
- [ ] Controlled + uncontrolled (if stateful)
- [ ] Forwards ref, spreads props, merges className
- [ ] Unit, interaction, and axe tests pass
- [ ] Stories for all variants/states; visual snapshots updated
- [ ] Docs: overview, props, keyboard table, a11y notes, theming vars, do/don't
- [ ] SSR-safe (no `window` access during render)
- [ ] Respects reduced motion
- [ ] Within size budget
- [ ] Changeset added

### Release Checklist
- [ ] CI green on `main`
- [ ] Changelog reviewed
- [ ] Migration notes for breaking changes
- [ ] Docs deployed and spot-checked
- [ ] Playground apps updated to the new version
- [ ] Devlog entry written

### ADR Template
```markdown
# ADR-NNN: Title
Date: YYYY-MM-DD
Status: Proposed | Accepted | Superseded by ADR-XXX

## Context
## Decision
## Consequences
## Alternatives considered
```

---

## References
- WAI-ARIA Authoring Practices Guide — https://www.w3.org/WAI/ARIA/apg/
- WCAG 2.2 — https://www.w3.org/TR/WCAG22/
- Style Dictionary — https://styledictionary.com/
- vanilla-extract — https://vanilla-extract.style/
- Floating UI — https://floating-ui.com/
- React Aria — https://react-spectrum.adobe.com/react-aria/
- Changesets — https://github.com/changesets/changesets
- Turborepo — https://turbo.build/
- Storybook — https://storybook.js.org/
- MDN Gamepad API — https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
