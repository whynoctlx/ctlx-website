# AGENTS.md

Personal one-page site for citalopram (CTLX). Repo: `github.com/whynoctlx/ctlx-website`.

## Stack

- Plain static site: `index.html`, `style.css`, `main.js`, `assets/`. No framework, no build step, no dependencies.
- Tooling is **Bun**. Never use npm, npx, yarn or pnpm. One-off tools go through `bunx`.
- Don't add a `package.json`, framework or dependency unless the user asks. If one is ever needed, it's Bun (`bun add`, `bun.lock`).
- External resources: Nunito from Google Fonts (fallback for SF Pro Rounded) and the GitHub avatar in the hero (local fallback in `assets/`).

## Commands

```sh
bun --port 4321 index.html   # dev server with hot reload at http://localhost:4321
```

`.claude/launch.json` runs the same command. Bun bundles assets on the fly in dev; the files in the repo are what ships, so keep paths relative (`style.css`, `assets/…`) so the page also works opened as plain static files.

## Files

| Path | What |
|---|---|
| `index.html` | All markup and content |
| `style.css` | All styles; tokens on `:root` |
| `main.js` | Compound curve, eased anchor scroll, Zarobenqo mark tilt/sweep |
| `assets/` | `ctlx.svg` (favicon), `profile.jpeg` (portrait) |
| `brand/ctlx-logo.html` | Standalone CTLX logo source |
| `DESIGN.md` | Design system. Read it before any UI change |

Untracked `node_modules/`, `dist/`, `.astro/`, `src/`, `public/` are leftovers from an old Astro version. Ignore them; don't commit them and don't build on them.

## Design rules (short version of DESIGN.md)

- One white sheet, black is the only brand color, no shadows or gradients outside the brand marks.
- Pills for interactive things and chips, 12px hairline cards for containers.
- Exactly one dark surface on the page (`.card.dark`).
- Use the CSS custom properties; don't hardcode colors, radii or section spacing.
- Reuse existing components (`.button`, `.tags`, `.card`, `.rows`, `.terminal`) before inventing new ones.
- Every animation must stop under `prefers-reduced-motion`.
- Update `DESIGN.md` in the same commit when you add or change a token or component.

## Code style

- Match the existing files: 2-space indent, single quotes in JS and CSS, flat CSS (no nesting) grouped under the existing `/* ── section ── */` headers, `rgb()` space syntax.
- Vanilla JS, no libraries. Comments only for the "why", one line.
- Semantic HTML; decorative SVG `aria-hidden="true"`; external links `target="_blank" rel="noopener"`.
- Copy is short, dry, first person, a little self-deprecating. English.
- Usage card "Session cost" figures (cost, Lines, Input, Output, Cache read, Cache write) are running totals across sessions: always add the new session's numbers to what's there. Never overwrite, reset or delete them.

## Workflow

- Work on `main`, small focused commits. Commit only when the user asks.
- Commit messages: short imperative sentence describing the visible change, no prefix (e.g. `Add 'Built by Claude Opus 5.5' pill under the hero lede`).
- Before calling a change done: run the dev server, check the page at 375px, 768px and 1280px, and confirm no console errors.
