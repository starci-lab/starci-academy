# BATCH 20 — Strict house-component CSS-door migration

Repo: `D:\Repositories\starci-academy`

The new ESLint rule `starci-fe/no-public-classname-prop` now covers the whole
house component tree:

- `src/components/**`
- `.storybook/components/**`

It rejects public `className`, `classNames`, and `WithClassNames` declarations,
destructured parameters, and internal consumer usage. HeroUI/vendor wrappers
and the documented Box foreign-mount remain boundaries.

The rule is currently `warn` because existing debt is large. Changed files are
run with `--max-warnings=0`, so this batch must not introduce new violations.

## Objective

Migrate the existing CSS doors to strict semantic contracts. Do not merely
rename the props or add an ESLint suppression.

## Classification required before editing

Classify every finding as exactly one of:

1. `dead` — zero consumers and no public behavior;
2. `parent-placement` — parent should own it via a principle or named wrapper;
3. `intrinsic-semantic` — repeated meaning that needs a typed variant;
4. `vendor-boundary` — HeroUI/foreign mount and explicitly allowed;
5. `locked-or-teacher-hold`;
6. `ambiguous`.

Write the fresh inventory before edits:

`.artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.json`
`.artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.md`

## Approved semantic contracts

Implement these exact contracts where their consumers are proven:

### DrawerShell

```ts
dialogWidth?: "default" | "cart"
footerVariant?: "default" | "stacked"
```

`cart` owns `sm:max-w-md`.
`stacked` owns the MiniCart footer layout.

### ModalShell

```ts
viewportFit?: "default" | "near-fullscreen"
```

`near-fullscreen` owns the existing CvPreview `92vh × 96vw` geometry.

### PDFView

```ts
height?: "compact" | "standard" | "tall" | "expanded" | "document" | "viewport"
```

Mappings remain private to PDFView:

- compact: 200px
- standard: 320px
- tall: 400px
- expanded: 420px
- document: 560px
- viewport: 84vh

## SurfaceCard rule

Do not add `bodyVariant` automatically. Only add it if the inventory proves
at least two identical semantic consumers. Otherwise:

- move parent placement to the parent frame/principle;
- move intrinsic child layout into the named `body` ComponentType;
- create a specialized composite only when the outer chrome genuinely differs;
- record one-off cases as holds.

## Parallel partitions

Use disjoint manifests. No worker may edit outside its manifest or touch a file
owned by another worker:

1. `atoms-display-forms`
2. `atoms-navigation-overlay`
3. `composites-layout-cards`
4. `composites-viewers-text`
5. `blocks-layout-domain`
6. `pages-and-overlays`
7. `storybook-only`
8. `vendor-and-hold-ledger`

Storybook and src twins belong to the same worker. Storybook first, then src.

Each worker writes:

`.artifacts/fe-refactor-audit/2026-08-08-b20-worker-<name>.json`

Required fields: `changed`, `skipped`, `holds`, `evidence`, `newVariants`,
`vendorBoundaries`, `verification`, and `regressions`.

## Migration rules

- Delete dead props only after a complete consumer search.
- For parent placement, use the parent `principle` or a named wrapper.
- For repeated intrinsic semantics, use a typed semantic prop, not CSS text.
- Do not pass `className`/`classNames` through a new prop name.
- Do not modify HeroUI wrappers, Box, Nivo/Nivoexpert, locked paths, or teacher
  holds unless the ledger explicitly allows it.
- Do not touch a11y, contrast, axe, ARIA, or keyboard behavior.
- Do not invent principles or arbitrary tokens.
- Do not add `eslint-disable`.
- Do not commit, reset, checkout, push, or alter branches.

## Coordinator aggregation

After all workers finish:

1. Assert zero overlapping edits.
2. Verify Storybook/src parity.
3. Verify no new `className`, `classNames`, or `WithClassNames` doors.
4. Verify all new variants have at least two evidence-backed consumers or are
   one of the three approved shell/viewer contracts.
5. Aggregate:

`.artifacts/fe-refactor-audit/2026-08-08-b20-status.json`
`.artifacts/fe-refactor-audit/2026-08-08-b20-status.md`

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <changed files>
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

Report resolved CSS doors separately from vendor boundaries, locked paths, and
ambiguous holds. Do not commit.
