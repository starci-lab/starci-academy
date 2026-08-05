# StarCi front end — the rules live in the back-end repo

This app has **no canon of its own**. Everything that governs how its code is written — the tier
system, the two-file split, the component matrix, the gates, the skill roster — lives in the
back-end repo, which is the single source of truth for both:

```
D:\Repositories\starci-academy-backend\.claude\
```

## The rule

**Any request that reads, writes, reviews, or plans code in this repo starts by reading the canon
that governs it, over there.** Before proposing a shape, before editing a source file, before
answering how something should be built.

| Work | Read first |
|---|---|
| any front-end work | `<backend>/.claude/canon/fe/README.md` |
| which tier a component belongs to, and what it may know | `<backend>/.claude/canon/fe/enforce/tiers/architecture.md` + the per-tier doc |
| where a file physically sits | `<backend>/.claude/canon/fe/sourcetree.md` |
| choosing a component for a shape of data | `<backend>/.claude/canon/fe/explore/component/` |
| which skill owns the verb | `<backend>/.claude/skills/` |

Reading "carefully" means opening the governing document, not pattern-matching its filename.

The failure this prevents is **inventing a shape the canon already settles** — a component placed at
the wrong tier, a block that fetches, a page that owns its own shell. Each one type-checks, each one
renders, and each one costs more to undo than it would have cost to read the rule first.

## What DOES live in this repo

- `src/` — the app.
- `.storybook/` — the design system: `components/` (impl) + `stories/` (the stories), split.
- `.claude/fe/` — queues written by the skills, not rules: `proposals/`, `scaffolds/`, `surfaces/`.
  Nothing here overrides canon; it records work in flight.
- `.artifacts/` — generated audits and maps. Regenerable; tracked; never a rule.
- `eslint-plugin-starci-fe/` — the lint half of the canon.

## Standing constraints

- **Branch**: all work lands on `mtp`.
- **Theming**: colours change in `globals.css` CSS variables — never by editing the atom layer.
- **Card padding** is `p-3`; card radius is `3xl` (except the `2xl` group).
- **Production build** is `next build --webpack` — Turbopack panics on Vercel.
- **Analysis before edits**: for anything beyond a trivial mechanical change, present the analysis
  and wait for approval before editing.

## Gates

The gates under `<backend>/.claude/scripts/gates/` are the machine half of the canon and take this
repo's path as their argument, for example:

```bash
node ../starci-academy-backend/.claude/scripts/gates/check-story-anatomy.mjs .
```

Run the ones that govern what was touched before calling work finished, and read what they print.
