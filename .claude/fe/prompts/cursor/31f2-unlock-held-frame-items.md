# BATCH 31f2 — Unlock held typed-frame items by blocker cluster

Repo: `D:\Repositories\starci-academy`

Checkpoint:

`0d0091c0 refactor(fe): close typed frame item contracts`

Read:

- `.claude/fe/contracts/frame-items.md`
- B31f inventory/status/worker artifacts
- current focused ESLint output for every remaining finding

B31f closed 137/344 findings. Approximately 207 findings across 73 files remain
because those files carry unrelated warnings. Do not rerun a fragment-only
sweep. Vertically close the blocker and frame-item debt together.

## Objective

For each selected file family:

1. inventory every ESLint warning;
2. close all warnings using existing approved contracts;
3. apply the Storybook frame-item blueprint to src where twins exist;
4. retain the family only at zero errors and zero warnings.

Do not optimize for raw finding count. Completion is measured by zero-warning
file/twin families.

## Blocker classification

Classify every remaining file by its dominant blocker:

### A — Public CSS doors

Rules include `no-public-classname-prop`, `no-classname-at-sentence-tier`, and
`no-cn-above-vocabulary`.

- remove only zero-consumer doors;
- move placement to the immediate parent using existing frames/contracts;
- keep intrinsic chrome in the vocabulary owner;
- never replace a public door with private raw CSS or a wrapper-only component.

Prioritize Storybook-held families such as SurfaceCard/Page/Footer/Navbar/
CollapsibleSidebar/ProfileLoading/ProfileLocked only when consumer evidence is
complete.

### B — Frame identity and raw shape

Rules include `require-frame-self-declare`, `require-identity-root`,
`no-raw-shape-at-sentence-tier`, and frame CSS-prop rules.

- root identity goes on the real semantic root, not a wrapper;
- child relationships use existing frames with one honest principle;
- fragment peers become item factories or an honest nested frame;
- do not add fake `explain`, fake principles, Box laundering, or arbitrary CSS.

### C — HeroUI vocabulary gaps

Replace HeroUI only when an existing house atom is behaviorally identical. If
no atom exists, hold the file and record the exact missing vocabulary; do not
create new vocabulary in this mass batch.

### D — Structural/locked holds

`page-folder-two-files-only`, QuizSession, Nivo/Nivoexpert, teacher holds,
parallel skeleton redesign, and locked paths remain out of scope. Do not edit
these files unless the only required change is already zero-warning and does
not cross the hold.

## Priority order

1. Storybook files held only by public CSS/handler/authoring debt.
2. Src twins whose Storybook frame-item version landed in B31f.
3. Src composites and blocks with no page-folder/locked blocker.
4. Pages only when already structurally clean.

Skip QuizSession and files with 20+ unrelated warnings unless every warning has
an existing mechanical contract and the family remains within one manifest.

## Parallel workers

Build exact disjoint manifests from the refreshed 207-hit inventory:

1. `sb-css-door-families`
2. `sb-navigation-profile-families`
3. `src-composites-twins`
4. `src-blocks-learn-a`
5. `src-blocks-learn-b`
6. `src-blocks-navigation-dashboard`
7. `src-blocks-profile-remaining`
8. `src-clean-pages`
9. `authoring-handler-only`
10. `hero-ui-gap-report`
11. `structural-locked-report`
12. `coordinator-parity-gates`

No file may occur in two edit manifests. Storybook first, then src. Workers
read outside manifests but edit only owned files. Coordinator alone writes the
ledger and aggregate artifacts.

## Frame-item law

One item factory builds one semantic item.

Allowed:

```tsx
items={[() => <Title />, () => <Body />]}
```

or an honest nested frame:

```tsx
items={[() => <StackH principle="icon-text" items={[() => <Icon />, () => <Text />]} />]}
```

Forbidden:

- multi-child fragment, directly or through a variable;
- raw div/Box/helper laundering;
- one-item array returning a component that exists only to hide siblings;
- changing item order, conditions, keys, skeleton count, event behavior, or DOM
  semantics.

## Ratchet

Every retained changed TS/TSX/MJS file must pass ESLint with zero warnings.
Atomicity is per twin/component family. If one blocker requires a new contract,
locked scope, page-folder move, or visual redesign, retract that family and
record the hold. Do not call pre-existing warnings acceptable.

## Forbidden

- no new principle/token/variant/slot/API;
- no className/classNames compatibility alias;
- no ESLint disable/config/severity/allowlist changes;
- no Nivo/Nivoexpert, QuizSession, teacher-hold, a11y/ARIA/keyboard/contrast,
  or unrelated loading/skeleton changes;
- no formatter or line-ending churn;
- no commit, reset, checkout, push, branch, or history operation.

## Artifacts

Write:

- `.artifacts/fe-refactor-audit/2026-08-09-b31f2-inventory.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31f2-worker-<name>.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31f2-status.json`
- `.artifacts/fe-refactor-audit/2026-08-09-b31f2-status.md`

Report before/after rule histogram, frame-item findings, zero-warning families,
retracted families, Storybook/src parity, vocabulary gaps, structural holds,
overlap, and exact gates.

## Verification

```text
npx tsc --noEmit
npx eslint --max-warnings=0 <all changed TS/TSX/MJS files in bounded chunks>
node --test plugins/eslint/frame-items.test.mjs
node --test plugins/eslint/public-contracts.test.mjs
node --test plugins/eslint/sentence-tier.test.mjs
node --test plugins/eslint/namespaces.test.mjs
node --test plugins/eslint/authoring.test.mjs
node --test plugins/eslint/contentpage.test.mjs
node --test .storybook/test-runner/principle-style.test.mjs
node --test .storybook/test-runner/semantic-contracts.test.mjs
npm run audit:fe
git diff --check
```

Do not commit. Do not claim held findings fixed.
