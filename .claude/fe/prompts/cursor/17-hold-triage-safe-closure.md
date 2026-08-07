# BATCH 17 — Hold triage and safe closure

Repo: `D:\Repositories\starci-academy`

The previous batch applied only proven identity, dead-prop, and namespace
contracts. Remaining holds include live MiniCart/CvPreview/PDF props,
ModalShell story props, the Nivoexpert DrawerShell boundary, HeroUI vendor
boundaries, unclear identity hosts, skeletons, and teacher seams.

## Goal

Burn only newly proven safe cases and produce explicit proposals for every
remaining contract hold.

## Allowed

1. Remove story-only props when they have zero JSX consumers and no visual
   behavior.
2. Add identity to unambiguous component roots.
3. Remove dead consumer/import/barrel code with complete consumer proof.
4. Classify HeroUI cases as genuine vendor boundaries or accidental wrappers.
5. Classify MiniCart/CvPreview/PDF props as live API or dead passthrough.
6. Document Nivoexpert boundaries without editing Nivoexpert consumers.

## Forbidden

- Do not invent `dialogWidth`, `viewportFit`, `height`, `bodyVariant`, or new
  principles.
- Do not redesign MiniCart, CvPreview, PDFView, ContinueCard, or skeleton APIs.
- Do not migrate non-identical HeroUI components.
- Do not edit Nivo/Nivoexpert consumers.
- Do not touch teacher holds, locked paths, or a11y/contrast/ARIA/axe.
- Do not add `eslint-disable` or generic className escape hatches.
- Do not commit, reset, checkout, push, or alter branches.

## Workflow

Run a fresh inventory before editing. Partition by disjoint ownership:

1. `story-only-dead-props`
2. `clear-identity-hosts`
3. `live-prop-consumer-proof`
4. `heroui-boundary-classification`
5. `nivoexpert-boundaries`
6. `skeleton-and-teacher-hold-audit`

Every worker receives an exact manifest and writes:

`.artifacts/fe-refactor-audit/2026-08-08-b17-worker-<name>.json`

Required fields: `changed`, `skipped`, `holds`, `evidence`, `proposals`,
`verification`, and `regressions`.

Before removing any prop, prove that every consumer is absent. Before adding
identity, prove that the component is a declared root and use the existing
`CallerIdentity` contract. Keep Storybook and src twins aligned.

If a case requires a new named slot, new principle, API redesign, or behavior
interpretation, leave code unchanged and record the proposal as a hold.

## Coordinator checks

After all workers finish:

1. Verify zero overlapping edits.
2. Verify Storybook/src parity.
3. Verify no runtime namespaces or plural principle APIs return.
4. Verify no teacher-hold edits.
5. Aggregate worker statuses into:
   - `.artifacts/fe-refactor-audit/2026-08-08-b17-status.json`
   - `.artifacts/fe-refactor-audit/2026-08-08-b17-status.md`

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files>
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

Report safe fixes separately from contract proposals and holds. Do not claim
ambiguous or API-held findings as fixed. Do not commit.
