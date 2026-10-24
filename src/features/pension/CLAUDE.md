# Group annuity portal (Carbon)

Covers `src/features/pension/` and its routes in `src/app/pension/`. This
part of the repo uses IBM Carbon, not shadcn; these rules override the root
CLAUDE.md here.

## What this is

A portal for retirees whose pension plan was transferred to an insurer as a
group annuity (pension risk transfer). Users check monthly payments, tax
forms, documents and personal details. Many are older adults, so clarity and
accessibility come first. Accessibility target: WCAG 2.1 AA.

Live at https://group-annuity-portal.vercel.app (served at the root via a
host rewrite to `/pension`).

## Design system

- Use Carbon (`@carbon/react`, `@carbon/icons-react`). Look up Carbon's docs
  and examples (Carbon MCP `docs_search` / `code_search`) before choosing a
  component. Don't work from memory.
- Cite the Carbon doc page for every guideline claim. No source, not a rule.
- If Carbon has a component for it, use it. Never hand-build a copy.
- If a request conflicts with Carbon, tell the designer before building
  around it.
- Styles: Carbon Sass tokens only (`$spacing-*`, `type-style()`, theme
  tokens like `$text-secondary`). A raw value needs a comment saying why.

## Content and structure

- Copy matches the mockup. Don't rewrite it.
- Three tabs (Account details, Personal details, E-documents) plus a profile
  page, which keeps the Personal details tab selected.
- "Edit personal details" opens `/profile?edit=personal` in edit mode.
- No top alert banner, "Pension Center" logo or password card.

## Design decisions

- Sentence case everywhere. Exception: the plan name title is all caps (CSS
  `text-transform`, so screen readers get mixed case).
- Full sentences end with periods.
- Light mode only; the page behind the tiles is Carbon `$blue-10`.
- Tile and table actions are ghost buttons, aligned with the text above
  them. ButtonSet is for form footers only.
- Payment history title and description match the tile titles and body text
  in type and spacing.
- Status definitions live in a Tooltip on an info icon beside the Status
  header. Tooltip for plain text; Toggletip only when the popover has
  buttons or links.
- Modals open with focus on their content (not the close button, whose
  tooltip would show) and return focus to the button that opened them.

## Approved exceptions to Carbon

- Payment settings modal footer buttons are 3rem tall, not Carbon's 4rem
  (designer request).

## Before saying done

1. `bun typecheck`, `bun lint` and `bun lint:styles` (Carbon token linter)
   pass.
2. Carbon MCP `code_audit` on changed files. Verify each finding against
   Carbon's source before acting; the audit has reported false positives.
3. `bun test:a11y` (IBM Equal Access rules) reports 0 violations.
4. Check the change in the browser against nearby components: alignment and
   spacing, not just behavior.
5. "Done" means the deploy finished and the PR checks are green. Show the
   evidence.
