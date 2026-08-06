# BATCH — Remove remaining runtime component namespaces

Repository:

`D:\Repositories\starci-academy`

Do not commit or push.

## Contract

The namespace rule is now active:

`starci-fe/no-runtime-namespace`

Component folders are filesystem groupings only. They do not create runtime objects.

Forbidden:

```ts
export const ButtonGroup = {
    Root: ButtonGroupRoot,
    Separator: ButtonGroupSeparator,
} as const
```

and:

```tsx
<Modal.Header />
<Select.Root />
<ListBox.Item />
```

Required shape:

```ts
export { ButtonGroupRoot, ButtonGroupSeparator }
```

Consumers import and use direct named exports.

## Phase 1 — inventory, no edits

Scan both trees for:

- exported object namespaces matching the component folder;
- `ButtonGroup.*`, `Modal.*`, `Drawer.*`, `Select.*`, `ListBox.*`, `AlertDialog.*`, `Table.*`, `Page.*` runtime usages;
- barrels and re-exports;
- Storybook stories, source twins, tests, and type-only references.

Do not treat these as runtime namespaces:

- `HeroModal.Header`, `HeroSelect.Root`, `HeroTable.Cell` vendor aliases inside atoms;
- prose strings and story anatomy metadata;
- ordinary config objects whose variable name is not the component folder name.

Write the inventory to:

`.artifacts/fe-refactor-audit/2026-08-08-runtime-namespace-report.md`

## Phase 2 — migrate in disjoint groups

Use Storybook first, then mirror src:

1. ButtonGroup;
2. Modal / Drawer;
3. Select / ListBox;
4. AlertDialog / Table;
5. Page;
6. barrels and consumer imports;
7. regression tests and lint fixtures.

No two agents may edit the same component or barrel.

For every group:

- remove the runtime object;
- preserve direct named exports;
- update all consumers from namespace members to named imports;
- preserve public behavior and TypeScript types;
- do not create a compatibility namespace;
- do not alter HeroUI vendor aliases;
- do not alter prose/anatomy metadata unless it documents the old public API incorrectly.

Update `export-matches-folder` if it currently expects a namespace object. Folder matching means that the folder has a direct named export family, not that it exports an object named after the folder.

## Verification

Run:

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed files>
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
npm run audit:fe
```

Run a final source scan proving there are no remaining runtime namespace exports/usages in `src` or `.storybook`. Ignore vendor aliases and prose metadata explicitly.

Do not run or modify a11y/axe checks.

Report files changed, before/after namespace counts, remaining holds, and exact verification results.

Do not commit or push.
