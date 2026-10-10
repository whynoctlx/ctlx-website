# AGENTS.md — CTLX.app

## Sources of truth

- Read [DESIGN.md](./DESIGN.md) before UI changes. It is the single source of truth for visual design, tokens, components, and responsive layout; do not duplicate its specifications here.
- DESIGN.md uses Ollama as a design reference. Its example branding, copy, navigation, and product features are not CTLX requirements. Preserve CTLX's own identity and functionality.
- Reuse the corresponding CSS custom properties and patterns in `style.css`. If the implementation and DESIGN.md disagree, identify the discrepancy before changing the affected UI; do not silently invent a competing design system.

## Verify before editing

- Inspect the current files, Git status, relevant diff, and affected behavior. Preserve unrelated and uncommitted work.
- Confirm the problem and its cause from the implementation or reproducible behavior before applying a fix. Distinguish verified facts from assumptions.
- Check existing content, links, assets, and page-specific script requirements. Do not treat an earlier proposal as evidence of implemented features.

## Code and architecture

- Keep changes small, focused, readable, and limited to the requested scope. Use the simplest solution that preserves functionality.
- The site is built with Astro as static HTML: pages in `src/pages/` (`index.astro`, `about.astro`), the shared shell in `src/layouts/Base.astro`, shared `src/styles/style.css`, homepage `src/scripts/main.js`, and assets in `public/assets/`. Run `npm run dev` to develop and `npm run build` to produce `dist/`.
- Preserve this architecture and reuse existing styles, markup patterns, and assets. Do not add another framework, UI integration, dependency, or abstraction without a concrete need.
- Prefer semantic HTML and CSS; use JavaScript only where behavior requires it. Avoid redundant code and unnecessary client-side work.
- Preserve navigation, links, metadata, project previews, existing interactions, and reduced-motion behavior unless the task explicitly changes them. Only load scripts on pages with the elements they require.

## Content accuracy

- CTLX is the personal digital space and independent software lab of **citalopram**. Do not present it as a company, agency, or team.
- Keep public-facing content in English, concise, personal, and technically grounded. Preserve the pseudonym and existing identity assets.
- Verify project names, descriptions, technologies, links, and statuses against repository evidence or user-confirmed information. Do not invent credentials, achievements, releases, screenshots, integrations, or contact details.
- Distinguish concepts, experiments, private work, active projects, and discontinued projects. If sources conflict, resolve the uncertainty before changing factual claims.
- Do not describe hard-coded usage figures or illustrative charts as live data. Preserve their context and distinguish examples from measured data.
- Do not introduce private or sensitive personal information.

## Validation and completion

- Establish the relevant baseline before changes; after changes, inspect the diff and verify affected behavior and local links/assets.
- Use existing checks when available: `npm run build` must pass. There is no automated test suite; do not add tooling solely for a small change.
- For UI changes, check both pages at narrow mobile, tablet, and desktop widths. Verify navigation, readable content, touch interaction, and absence of horizontal overflow using DESIGN.md's responsive guidance.
- Check semantic structure, keyboard access, visible focus, and reduced motion. Test changed JavaScript interactions in the browser and inspect console errors.
- Add a focused regression test only when it provides meaningful coverage and fits the project's tooling; otherwise use targeted manual checks.
- Report what changed, what was actually checked, and any remaining limitations. Never claim browser or automated verification that was not performed.
