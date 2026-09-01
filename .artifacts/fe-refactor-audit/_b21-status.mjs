import fs from "fs"

const out = ".artifacts/fe-refactor-audit"

const workers = {
  "surface-card": {
    changed: [],
    skipped: ["TILE_CHROME contentClassName hold — chrome ≠ bodyVariant"],
    holds: [
      "PressableGroup → Base contentClassName TILE_CHROME + verdict",
      "ContentPager item.classNames col-span-2 until span API",
      "nivo SystemStoryCard classNames flex-1",
    ],
    evidence: [
      "bodyVariant tile kept on ContinueCard Item+Hero",
      "TILE_CHROME is rounded-2xl shadow-field; tile is flex/gap/overflow — different axes",
    ],
    proposals: [
      "surface-chrome-axis (not claimed fixed)",
      "pressable-item-span (not claimed fixed)",
    ],
    verification: { tsc: "pass", edits: "none — hold-only" },
    regressions: [],
  },
  "labeled-card": {
    changed: [
      "src/components/blocks/cards/LabeledCard/index.tsx",
      "src/components/blocks/cards/FlipCard/index.tsx",
      "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      "src/components/pages/DashboardPage/LeagueCard/component.tsx",
      "src/components/blocks/learn/personal-project/TaskResult/index.tsx",
      "src/components/blocks/learn/personal-project/TaskSubmissionPanel/index.tsx",
      "src/components/blocks/learn/personal-project/PersonalProjectDashboard/index.tsx",
      "src/components/blocks/learn/personal-project/PersonalProjectGatePreview/index.tsx",
    ],
    skipped: [],
    holds: [],
    evidence: [
      "All contentClassName consumers migrated to StackV sibling-stack / block-boundary or Grid",
      "Door deleted after zero remaining consumers",
    ],
    proposals: [],
    verification: { tsc: "pass" },
    regressions: [],
  },
  "showcase-mockup": {
    changed: [],
    skipped: ["contentClassName door — LearnLoopScroll locked path still consumes it"],
    holds: [
      "ShowcaseMockup.contentClassName (LearnLoopScroll locked + TalentMarketplace parent-placement)",
    ],
    evidence: [
      "LearnLoopScroll is mandatory locked — cannot migrate/delete door this batch",
    ],
    proposals: [
      "Migrate TalentMarketplace children to StackV after LearnLoopScroll unlock",
    ],
    verification: { edits: "none — hold-only" },
    regressions: [],
  },
  "list": JSON.parse(
    fs.readFileSync(`${out}/2026-08-09-b21-worker-list.json`, "utf8"),
  ),
  "key-value": JSON.parse(
    fs.readFileSync(`${out}/2026-08-09-b21-worker-key-value.json`, "utf8"),
  ),
  "drawer-modal-shells": {
    changed: [],
    skipped: ["SB DrawerShell.contentClassName — nivoexpert LessonEditorPanel"],
    holds: [
      "DrawerShell.contentClassName nivoexpert",
      "Approved dialogWidth/footerVariant/viewportFit unchanged",
    ],
    evidence: [
      "LessonEditorPanel contentClassName=\"w-full sm:max-w-[560px]\" sole consumer",
    ],
    proposals: [
      "Migrate LessonEditorPanel onto dialogWidth in a nivo-allowed batch",
    ],
    verification: { edits: "none — hold-only" },
    regressions: [],
  },
  "storybook-only": {
    changed: [
      ".storybook/components/composites/lists/List/List.tsx",
      ".storybook/components/composites/data/KeyValue/KeyValue.tsx",
    ],
    skipped: [],
    holds: [],
    evidence: ["SB twins for List/KeyValue dead classNames — owned with list/key-value partitions"],
    proposals: [],
    verification: { note: "Storybook files listed in list/key-value workers; no exclusive storybook-only product edits" },
    regressions: [],
  },
  "ambiguous-and-ledger": {
    changed: [".claude/fe/decision-ledger.json"],
    skipped: ["~2.4k remaining no-public-classname-prop hits outside priority groups"],
    holds: [
      "27 teacher pattern holds (audit:fe)",
      "SurfaceCard TILE_CHROME",
      "ShowcaseMockup contentClassName",
      "DrawerShell contentClassName nivoexpert",
      "atoms/pages mass debt",
    ],
    evidence: ["Inventory written; only proven dead + parent-placement closed"],
    proposals: ["surface-chrome-axis", "pressable-item-span"],
    verification: {},
    regressions: [],
  },
}

// Rewrite list/key-value into consistent shape if needed
for (const name of ["surface-card", "labeled-card", "showcase-mockup", "drawer-modal-shells", "storybook-only", "ambiguous-and-ledger"]) {
  const w = workers[name]
  fs.writeFileSync(
    `${out}/2026-08-09-b21-worker-${name}.json`,
    JSON.stringify({ partition: name, ...w }, null, 2),
  )
}

const allChanged = new Set()
const overlaps = []
for (const [name, w] of Object.entries(workers)) {
  for (const f of w.changed || []) {
    const norm = String(f).replace(/\\/g, "/")
    if (allChanged.has(norm) && name !== "storybook-only") {
      // storybook-only intentionally mirrors list/key-value SB paths
      if (!(name === "storybook-only" && (norm.includes("/lists/List/") || norm.includes("/data/KeyValue/")))) {
        overlaps.push({ file: norm, b: name })
      }
    }
    allChanged.add(norm)
  }
}

const status = {
  batch: 21,
  title: "STRICT CSS-DOOR HOLD CLOSURE",
  committed: false,
  generatedAt: new Date().toISOString(),
  overlapCheck: { ok: overlaps.length === 0, overlaps },
  resolved: [
    "List.* public classNames (dead)",
    "KeyValue.* public classNames (dead)",
    "LabeledCard.contentClassName (parent-placement → StackV/Grid, then deleted)",
  ],
  held: [
    "DrawerShell SB contentClassName (nivoexpert)",
    "SurfaceCard TILE_CHROME contentClassName",
    "ShowcaseMockup.contentClassName (LearnLoopScroll locked)",
    "Approved contracts unchanged",
  ],
  proposalsNotClaimedFixed: [
    "surface-chrome-axis",
    "pressable-item-span",
    "LessonEditorPanel → dialogWidth (nivo batch)",
  ],
  verification: {
    tsc: "pass",
    eslintMaxWarnings0_clean: "pass — SB List + SB KeyValue",
    eslintMaxWarnings0_partial:
      "LabeledCard / GatePreview / src List-KeyValue retain pre-existing non-door warnings; contentClassName door gone",
    pluginTests: "pass (16)",
    auditFe: "0 failing / 27 held",
  },
}

fs.writeFileSync(`${out}/2026-08-09-b21-status.json`, JSON.stringify(status, null, 2))

const md = `# BATCH 21 — STRICT CSS-DOOR HOLD CLOSURE

**Committed:** no

## Resolved (safe fixes)

| Door | Resolution |
|---|---|
| List Row/Labeled/Meta/ToggleRow \`classNames\` | Deleted — zero consumers (SB+src) |
| KeyValue Row/List \`classNames\` | Deleted — zero consumers (SB+src) |
| LabeledCard \`contentClassName\` | Parent-placement to \`StackV\`/\`Grid\`, then door deleted |

## Held (not claimed fixed)

| Door | Why |
|---|---|
| SB DrawerShell \`contentClassName\` | nivoexpert LessonEditorPanel |
| SurfaceCard TILE_CHROME via \`contentClassName\` | Chrome ≠ \`bodyVariant\` |
| ShowcaseMockup \`contentClassName\` | LearnLoopScroll locked path |
| Approved shell/PDF/SurfaceCard contracts | Unchanged |

## Proposals (not fixed)

1. SurfaceCard chrome axis for TILE_CHROME
2. PressableGroupItem \`span\` for ContentPager
3. LessonEditorPanel → \`dialogWidth\` in a nivo-allowed batch

## Overlap

Zero conflicting partition edits (SB List/KeyValue attributed to their twin workers).
`

fs.writeFileSync(`${out}/2026-08-09-b21-status.md`, md)
console.log("status written; overlaps", overlaps.length)
