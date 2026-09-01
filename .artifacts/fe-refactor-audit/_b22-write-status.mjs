import fs from "fs"

const out = ".artifacts/fe-refactor-audit"

const workers = {
  "surface-card-chrome": {
    changed: [
      ".storybook/components/composites/_semantic-contracts.ts",
      ".storybook/components/composites/_semantic-contracts.mjs",
      "src/components/composites/_semantic-contracts.ts",
      "src/components/composites/_semantic-contracts.mjs",
      ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
      "src/components/composites/cards/SurfaceCard/index.tsx",
      ".storybook/test-runner/semantic-contracts.test.mjs",
    ],
    skipped: [],
    holds: [
      "contentClassName retained for verdict band + item.classNames (span proposal)",
    ],
    evidence: [
      "chromeVariant tile → rounded-2xl shadow-field (former TILE_CHROME)",
      "PressableGroup Base now chromeVariant=\"tile\"; TILE_CHROME stripped from contentClassName",
      "bodyVariant axis unchanged and independent",
    ],
    proposals: [],
    verification: { tsc: "pass", semanticContracts: "8/8" },
    regressions: [],
  },
  "continue-card-twins": {
    changed: [],
    skipped: [
      "ContinueCard Item/Hero keep bodyVariant=\"tile\" only — default surface chrome preserved (not TILE_CHROME consumers)",
    ],
    holds: [],
    evidence: [
      "SB+src ContinueCardItem/Hero both bodyVariant=\"tile\", no chromeVariant",
      "Axes independent: body layout vs outer chrome",
    ],
    proposals: [],
    verification: { parity: "SB/src ContinueCard twins match" },
    regressions: [],
  },
  "pressable-group-audit": {
    changed: [],
    skipped: ["No span API invented this batch"],
    holds: [
      "item.classNames funnel for ContentPager col-span-2 + stories",
    ],
    evidence: [
      "src/components/blocks/learn/ContentPager/index.tsx:129 classNames:[\"col-span-2\"]",
      "SB ContentPager + SurfaceCardPressableGroup stories same pattern",
      "Grid already has span?: 1|2 on GridItem — proposal is PressableGroupItem.span forwarding",
    ],
    proposals: [
      {
        id: "pressable-group-item-span",
        summary: "Add PressableGroupItem.span?: 1 | 2 → Grid item span; stop routing col-span via classNames/contentClassName",
        notClaimedFixed: true,
      },
    ],
    verification: { edits: "none — audit only" },
    regressions: [],
  },
  "nivoexpert-boundary-report": {
    changed: [],
    skipped: [".storybook/components/nivoexpert/** — mandatory non-edit"],
    holds: [
      "SB DrawerShell.contentClassName sole consumer LessonEditorPanel w-full sm:max-w-[560px]",
    ],
    evidence: [
      ".storybook/components/nivoexpert/blocks/studio/LessonEditorPanel/LessonEditorPanel.tsx:150",
    ],
    proposals: [
      {
        id: "lesson-editor-dialogWidth",
        summary: "Migrate LessonEditorPanel off contentClassName onto DrawerShell dialogWidth (new token or existing) in a nivo-allowed batch, then delete SB contentClassName if zero consumers",
        notClaimedFixed: true,
      },
    ],
    verification: { edits: "none" },
    regressions: [],
  },
  "showcase-locked-report": {
    changed: [],
    skipped: ["LearnLoopScroll locked — no ShowcaseMockup/LearnLoopScroll edits"],
    holds: [
      "ShowcaseMockup.contentClassName — LearnLoopScroll + TalentMarketplace",
    ],
    evidence: [
      "LearnLoopScroll: contentClassName={cn(\"flex flex-col p-4\", justify…)}",
      "TalentMarketplace: contentClassName=\"flex flex-col gap-3 p-4\" (parent-placement candidate after unlock)",
    ],
    proposals: [
      {
        id: "showcase-content-parent-placement",
        summary: "After LearnLoopScroll unlock: move padding/justify into children StackV; then delete ShowcaseMockup.contentClassName if zero consumers",
        notClaimedFixed: true,
      },
    ],
    verification: { edits: "none" },
    regressions: [],
  },
  "storybook-parity": {
    changed: [
      ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
      "src/components/composites/cards/SurfaceCard/index.tsx",
      ".storybook/components/composites/_semantic-contracts.ts",
      "src/components/composites/_semantic-contracts.ts",
      ".storybook/components/composites/_semantic-contracts.mjs",
      "src/components/composites/_semantic-contracts.mjs",
    ],
    skipped: [],
    holds: [],
    evidence: [
      "chromeVariant API + PressableGroup migration mirrored SB→src",
      "semantic-contracts table identity test includes SURFACE_CARD_CHROME_VARIANT",
    ],
    proposals: [],
    verification: { semanticContracts: "SB/src tables identical" },
    regressions: [],
  },
}

for (const [name, w] of Object.entries(workers)) {
  fs.writeFileSync(
    `${out}/2026-08-09-b22-worker-${name}.json`,
    JSON.stringify({ partition: name, ...w }, null, 2),
  )
}

const status = {
  batch: 22,
  title: "Chrome axis and remaining boundary closure",
  committed: false,
  checkpoint: "90009dc5",
  generatedAt: new Date().toISOString(),
  chromeAxis: {
    api: "chromeVariant?: \"default\" | \"tile\"",
    tileOwns: "rounded-2xl shadow-field",
    bodyVariantUnchanged: true,
    migrated: "SurfaceCardPressableGroup → chromeVariant=\"tile\"",
    continueCard: "unchanged bodyVariant=\"tile\" only (preserves default surface chrome)",
  },
  proposalsNotClaimedFixed: [
    "pressable-group-item-span",
    "lesson-editor-dialogWidth",
    "showcase-content-parent-placement",
  ],
  verification: {
    tsc: "pass",
    eslintChangedContracts: "pass (SurfaceCard classNames warnings pre-exist; not introduced)",
    pluginAndPrincipleTests: "24/24",
    semanticContracts: "8/8",
    auditFe: "pass (27 teacher holds)",
  },
}

fs.writeFileSync(`${out}/2026-08-09-b22-status.json`, JSON.stringify(status, null, 2))

const md = `# BATCH 22 — Chrome axis and remaining boundary closure

**Committed:** no  
**Checkpoint:** \`90009dc5\`

## Chrome axis (implemented)

| API | Mapping |
|---|---|
| \`chromeVariant?: "default" \\| "tile"\` | \`tile\` → \`rounded-2xl shadow-field\` |
| \`bodyVariant\` | unchanged — body layout only |

- PressableGroup tiles: \`chromeVariant="tile"\` (TILE_CHROME removed from \`contentClassName\`)
- ContinueCard Item/Hero: still \`bodyVariant="tile"\` only — **not** chrome consumers; visuals preserved
- Axes independent — no compound variant
- Skeleton tile chrome reads \`resolveSurfaceCardChromeVariant("tile")\`

## Boundary proposals (not fixed)

1. **DrawerShell \`contentClassName\`** → LessonEditorPanel (nivoexpert) — migrate to \`dialogWidth\` later
2. **ShowcaseMockup \`contentClassName\`** → LearnLoopScroll locked — parent-placement after unlock
3. **PressableGroupItem \`span\`** → replace \`classNames: ["col-span-2"]\`

## Verification

| Gate | Result |
|---|---|
| \`tsc --noEmit\` | pass |
| eslint on contracts + test | pass |
| plugin + principle + semantic tests | 24/24 |
| \`npm run audit:fe\` | pass (27 teacher holds) |
| locked/vendor holds claimed fixed | **no** |
`

fs.writeFileSync(`${out}/2026-08-09-b22-status.md`, md)
console.log("b22 workers + status written")
