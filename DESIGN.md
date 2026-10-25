# DESIGN.md — ctlx-website

Personal site of **citalopram** (CTLX). One page, one white sheet, read like a well-set README.
Started from Ollama's marketing system (flat white, pills, one dark card, terminal mockup) and adapted.
This file describes what ships. `style.css` is the source of truth; if this file and the CSS disagree, fix this file.

## Principles

1. **One sheet.** White `--canvas` from top to bottom. No colored bands, no section backgrounds, no dividers between sections — only `--section` of air.
2. **Black is the brand.** No accent color. Ink carries headlines and actions; greys carry everything else.
3. **Two shapes.** Interactive things and chips are pills (`9999px`). Containers are `--r-lg` (12px) with a 1px `--hairline`. Nothing else.
4. **One inversion per page.** The dark Compound card (`.card.dark`) is the only `--surface-dark` surface. Don't add a second.
5. **No shadows, no gradients** on page chrome. Exceptions are the brand marks only (CTLX nav mark, Zarobenqo `.mark` tile).
6. **Reuse before adding.** New content should fit pill + hairline card + rows + terminal. A new token or component needs a reason.

## Tokens

All tokens are CSS custom properties on `:root` in `style.css`. Use them; don't hardcode values.

### Color

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#ffffff` | Page, nav, text on black buttons |
| `--surface-soft` | `#fafafa` | Tags, social pills, disabled button |
| `--surface-dark` | `#171717` | The one dark card |
| `--hairline` | `#e5e5e5` | Card borders, row dividers, footer rule, meter track |
| `--ink` | `#000000` | Headings, nav links, primary button, tag text, values |
| `--ink-deep` | `#090909` | Pressed primary button |
| `--charcoal` | `#525252` | Disabled button text |
| `--body` | `#737373` | Default paragraph text, footer links, terminal comments |
| `--mute` | `#a3a3a3` | Lowest-emphasis meta (use sparingly, fails AA on white for small text) |
| `--on-dark-mute` | `rgb(255 255 255 / .7)` | Paragraphs on the dark card |
| `--focus-ring` | `rgb(59 130 246 / .5)` | `:focus-visible` outline, the only blue |

Fixed, non-token colors (keep them out of general UI):
- `#d97757` — Claude mark fill (footer credit).
- `#ff5f56` / `#ffbd2e` / `#27c93f` — terminal traffic lights only.
- Brand-mark gradients in `.brand-mark` and `.mark` plus the `<defs>` at the top of `index.html`.

### Type

| Token | Stack |
|---|---|
| `--display` | `'SF Pro Rounded', ui-rounded, Nunito, system-ui` — h1–h3 only. Nunito 500/600 is loaded from Google Fonts as the non-Apple fallback. |
| `--text` | `ui-sans-serif, system-ui` — everything else |
| `--mono` | `ui-monospace, SFMono-Regular, Menlo, …` — tags, terminal, numbers, social handles |

| Role | Size / weight / line-height |
|---|---|
| h1 (hero only) | 48px / 500 / 1.08 ≥1024px → 36px / 1.11 → 28px under 640px |
| h2 (section title) | 24px / 600 / 1.33 |
| h3 (card title) | 20px / 500 / 1.4 |
| Row title `.rows dt` | 18px / 500 / 1.56 |
| Body | 16px / 400 / 1.5, color `--body` |
| Small (card copy, nav, buttons) | 14px / 400–500 / 1.43 |
| Tags | 13px mono / 1.25 |
| Caption (footer, stat labels) | 12px / 1.33 |

No letter-spacing, no italics (`<em>` in the terminal is restyled as a color change). Use `text-wrap: balance` on short centered copy, `pretty` on card paragraphs.

### Space, size, radius

- 8px grid with 2/4/6px for tight inline gaps. Common steps: 4, 8, 12, 16, 24, 32.
- `--section`: 88px desktop → 64px ≤767px → 48px ≤640px. Applied as `main > section + section` margin and footer top margin.
- Page column `.wrap`: `min(100% - 48px, 1200px)`, shared by nav, content and footer.
- Card padding 32px → 24px ≤640px.
- `--r-sm` 6px (reserved), `--r-lg` 12px (cards, terminal), `9999px` (pills, bars), `50%` (portrait, dots).

### Motion

- Easing: `--ease` (expo-out) for almost everything, `--ease-in-out` for drawn lines and the sweep.
- Hero items fade/rise/unblur in, staggered by inline `--i`.
- `.reveal` and meters/terminal lines use scroll-driven `animation-timeline: view()` inside `@supports`; without support, content is simply visible.
- Stroke drawing uses `pathLength="1"` + `stroke-dasharray: 1` and the `draw` keyframe.
- `prefers-reduced-motion: reduce` kills all animation and transitions (CSS) and the eased scroll (`main.js`). Every new motion must respect it.
- Hover is decorative only (mark closes into an X, arrow nudges). Never hide information behind hover.

## Components

All live in `index.html` + `style.css`; behavior in `main.js`.

| Component | Markup | Notes |
|---|---|---|
| Nav | `header.nav` | Sticky, white, 56px tall. CTLX mark left, section links. ≤767px shows only the first link. |
| CTLX mark | `.brand-mark` | X cut at the waist; lower half is the Control caret. Source: `brand/ctlx-logo.html`. |
| Hero | `section.hero` | Portrait (GitHub avatar `github.com/whynoctlx.png`, falls back to `assets/profile-192.jpeg`) + `.intro` (h1, `.lede` 18px max 36ch, `.built-by` caption: 13px `--body` text with a 12px grey Claude mark, no pill). Left-aligned stack, 96px portrait; ≥1024px it follows the rail: 160px portrait in the title column, 48px h1 beside it. |
| Button | `.button` | 36px pill, black. Variants: `.on-dark` (white on dark card), `.disabled` (soft grey, used for "Private"). Only `a.button` gets the pressed state. |
| Tags | `ul.tags > li` | Mono pills on `--surface-soft`; translucent white inside `.dark`. Label with `aria-label="Built with"`. |
| Card | `.card` | Hairline, 12px radius, 32px padding, column flex; `.foot` pins the button to the bottom. Two cards sit in `.pair` (2-up → 1-up ≤767px). |
| Dark card | `.card.dark` | The single inversion. Contains `.curve`, a full-bleed SVG line drawn by `main.js`. |
| Zarobenqo mark | `.mark` | 3D tilt tile with pointer tracking, specular sweep and stroke intro (`main.js`). Gradients live in the `<defs>` at the top of `index.html`. |
| Socials | `ul.socials > li > .social` | 48px soft pills: 18px brand icon (`#i-*` symbols in the `<defs>`), platform name, mono handle in `--body`. A link when the platform has a profile URL, otherwise a `button[data-copy]` that copies the handle (`main.js`). Hover darkens to `--hairline`. Full-width stack ≤640px. |
| Rows | `dl.rows > div` | Flat list: dt title, dd text, optional tags, 1px bottom hairline. Used for minor and discontinued projects. |
| Rail | `main > section:not(.hero)` | ≥1024px: 240px title column + content column, 16px / 48px gap. Each section's first child (h2, or the Vibecoding intro) sits left, everything else right. Rows become dt 1fr / dd 2fr. Below 1024px sections stack as before. |
| Split | `.split` | 2fr / 3fr text + terminal at 768–1023px; stacks ≤767px; follows the rail ≥1024px. |
| Terminal | `.terminal` | Hairline card, traffic lights, mono `pre`; `<em>` = grey comment. Lines are `<span style="--l: n">` for the staggered print. Give it `role="img"` + a full `aria-label`; the `pre` is `aria-hidden`. |
| Usage meter | `.usage` | Joke Claude-usage card: `dl` of meters (`--p` = fill 0–1, `--l` = stagger), split bar + legend, session-cost figures as one hairline-ruled row (5-up → 2-up ≤640px), no tiles. The figures are running totals, see AGENTS.md. |
| Footer | `footer` | Hairline top rule, link row + credit with the Claude mark. |

## Accessibility

- Decorative SVGs get `aria-hidden="true"`; meaningful graphics get `role="img"` + `aria-label`.
- External links: `target="_blank" rel="noopener"`.
- Keep the global `:focus-visible` ring; never remove outlines.
- Body text on white must stay ≥ 4.5:1 (`--body` passes; `--mute` does not for small text).

## Responsive checkpoints

Check every change at **375px, 768px and 1280px**. Breakpoints: `min-width: 1024px` (rail layout), `max-width: 767px` (stack grids, trim nav, 64px sections) and `max-width: 640px` (smaller h1, 24px card padding, 2-up stats, 48px sections).
