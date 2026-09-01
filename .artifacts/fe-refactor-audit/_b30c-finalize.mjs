/**
 * BATCH 30c — worker artifacts + status after retract/keep partition.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const retracted = [
  "src/components/blocks/commerce/TierCardBase/index.tsx",
  "src/components/blocks/commerce/TierCard/index.tsx",
  "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
  "src/components/blocks/feedback/ReadinessChecklist/index.tsx",
  "src/components/blocks/lists/ListRow/index.tsx",
  "src/components/blocks/lists/ListRow/README.md",
  "src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx",
  "src/components/blocks/navigation/SidebarNavItem/index.tsx",
  "src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx",
  "src/components/pages/FlashcardsPage/index.tsx",
  "src/components/pages/NotificationsPage/index.tsx",
  "src/components/pages/DashboardPage/TopLearners/component.tsx",
]

const kept = [
  "src/components/blocks/lists/LabeledList/index.tsx",
  "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
  "plugins/eslint/sentence-tier.test.mjs",
]

const workers = {
  "tier-card": {
    manifest: [
      "src/components/blocks/commerce/TierCardBase/index.tsx",
      "src/components/blocks/commerce/TierCard/index.tsx",
    ],
    warningsBefore: { TierCardBase: 11, TierCard: 3 },
    warningsAfter: { TierCardBase: "retracted-to-checkpoint", TierCard: "retracted-to-checkpoint" },
    introducedByB30: ["isFeatured", "className door burn"],
    preExistingInTouchedFile: [
      "no-heroui-outside-vocabulary",
      "no-raw-shape-at-sentence-tier",
      "no-inline-skeleton-branch",
      "no-cn-above-vocabulary",
      "require-identity-root",
    ],
    fixed: [],
    retractedB30Changes: [
      "TierCardBase.isFeatured + className door burn",
      "TierCard isFeatured migration",
    ],
    holds: ["TierCardBase.className door restored (checkpoint)"],
    parity: "n/a retracted",
    verification: { action: "git checkout 8c13fd52" },
    regressions: [],
    overlapCheck: "pass",
  },
  "list-row-readiness": {
    manifest: [
      "src/components/blocks/lists/ListRow/index.tsx",
      "src/components/blocks/lists/ListRow/README.md",
      "src/components/blocks/feedback/ReadinessChecklist/index.tsx",
    ],
    warningsBefore: { ListRow: 6, ReadinessChecklist: 1 },
    warningsAfter: "retracted-to-checkpoint",
    introducedByB30: ["density prop", "ReadinessChecklist density=comfortable"],
    preExistingInTouchedFile: [
      "no-heroui-outside-vocabulary",
      "no-raw-shape-at-sentence-tier",
      "no-cn-above-vocabulary",
      "require-identity-root",
    ],
    fixed: [],
    retractedB30Changes: ["ListRow.density", "ReadinessChecklist density migration", "ListRow.className door burn"],
    holds: ["ListRow.className door restored"],
    parity: "n/a retracted",
    verification: { action: "git checkout 8c13fd52" },
    regressions: [],
    overlapCheck: "pass",
  },
  "leaderboard-labeled-list": {
    manifest: [
      "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      "src/components/blocks/lists/LabeledList/index.tsx",
      "src/components/pages/DashboardPage/TopLearners/component.tsx",
    ],
    warningsBefore: { LeaderboardListCard: 11, LabeledList: 1, TopLearners: 6 },
    warningsAfter: {
      LeaderboardListCard: "retracted-to-checkpoint",
      LabeledList: 0,
      TopLearners: "retracted-to-checkpoint",
    },
    introducedByB30: [
      "LeaderboardListCard className door burn + B30b StackV",
      "LabeledList className door burn + Stack frames",
      "TopLearners className passthrough removal",
    ],
    preExistingInTouchedFile: [
      "Leaderboard: heroui/raw-shape/emoji",
      "TopLearners: page-folder-two-files-only + Skeleton className",
    ],
    fixed: [
      {
        file: "src/components/blocks/lists/LabeledList/index.tsx",
        action: "StackV sibling-stack flatten (label + rows + action); door stays closed; 0 warnings",
      },
    ],
    retractedB30Changes: [
      "LeaderboardListCard door burn + B30b StackV shared content (zero-warn blocked by className door law + TopLearners page-folder + Box self-declare vs escape hatch)",
      "TopLearners passthrough removal",
    ],
    holds: [
      "LeaderboardListCard.className restored (checkpoint)",
      "B30b Leaderboard StackV repair retracted — cannot preserve under zero-warning ratchet without forbidden contracts",
    ],
    parity: { LabeledList: "src-only" },
    verification: { LabeledList: "eslint --max-warnings=0 pass" },
    regressions: [],
    overlapCheck: "pass",
  },
  "navigation-flex-wrap-sidebar": {
    manifest: [
      "src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx",
      "src/components/blocks/navigation/SidebarNavItem/index.tsx",
    ],
    warningsBefore: { FlexWrapButtonRadio: 5, SidebarNavItem: 4 },
    warningsAfter: "retracted-to-checkpoint",
    introducedByB30: [
      "FlexWrap → ButtonGroupRoot/Separator",
      "SidebarNavItem.className door burn",
    ],
    preExistingInTouchedFile: [
      "no-heroui-outside-vocabulary",
      "require-identity-root",
      "no-cn-above-vocabulary",
      "no-classname-at-sentence-tier",
      "no-public-classname-prop",
    ],
    fixed: [],
    retractedB30Changes: [
      "FlexWrapButtonRadio atom migration",
      "SidebarNavItem.className door burn",
    ],
    holds: ["HeroUI ButtonGroup className usage restored in FlexWrap", "SidebarNavItem.className restored"],
    parity: "n/a retracted",
    verification: { action: "git checkout 8c13fd52" },
    regressions: [],
    overlapCheck: "pass",
  },
  "pages-consumers-a": {
    manifest: [
      "src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx",
      "src/components/pages/FlashcardsPage/index.tsx",
    ],
    warningsBefore: { ArchitectureMap: 6, FlashcardsPage: 9 },
    warningsAfter: "retracted-to-checkpoint",
    introducedByB30: ["TabsCard parent Box wrappers"],
    preExistingInTouchedFile: [
      "page-folder-two-files-only",
      "no-parallel-skeleton",
      "no-heroui-outside-vocabulary",
      "no-raw-shape-at-sentence-tier",
      "require-identity-root",
      "require-frame-self-declare",
    ],
    fixed: [],
    retractedB30Changes: ["ArchitectureMap TabsCard Box wrap", "FlashcardsPage TabsCard Box wrap"],
    holds: ["TabsCard className consumers restored on these pages"],
    parity: "n/a retracted",
    verification: { action: "git checkout 8c13fd52" },
    regressions: [],
    overlapCheck: "pass",
  },
  "pages-consumers-b": {
    manifest: [
      "src/components/pages/NotificationsPage/index.tsx",
      "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
    ],
    warningsBefore: { NotificationsPage: 8, ContentTabBar: 1 },
    warningsAfter: { NotificationsPage: "retracted-to-checkpoint", ContentTabBar: 0 },
    introducedByB30: [
      "NotificationsPage TabsCard → Box reel",
      "ContentTabBar TabsCard → Container size=md",
    ],
    preExistingInTouchedFile: [
      "Notifications: no-retired-async-content, no-parallel-skeleton, heroui, classname",
      "ContentTabBar: require-identity-root",
    ],
    fixed: [
      {
        file: "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
        action: "Container identity root; dropped redundant w-full wrapper; 0 warnings",
      },
    ],
    retractedB30Changes: ["NotificationsPage TabsCard Box wrap"],
    holds: ["NotificationsPage TabsCard className=overflow-x-auto restored"],
    parity: { ContentTabBar: "src-only" },
    verification: { ContentTabBar: "eslint --max-warnings=0 pass" },
    regressions: [],
    overlapCheck: "pass",
  },
  "authoring-jsdoc-imports": {
    manifest: ["plugins/eslint/sentence-tier.test.mjs"],
    warningsBefore: { "sentence-tier.test.mjs": 0 },
    warningsAfter: { "sentence-tier.test.mjs": 0 },
    introducedByB30: ["coordinator regression test (untracked)"],
    preExistingInTouchedFile: [],
    fixed: [],
    retractedB30Changes: [],
    holds: [],
    parity: "n/a test",
    verification: { eslint: "pass", nodeTest: "pending-coordinator" },
    regressions: [],
    overlapCheck: "pass",
  },
}

// overlap on manifests (edit ownership)
const owner = new Map()
const overlaps = []
for (const [name, data] of Object.entries(workers)) {
  for (const f of data.manifest) {
    if (owner.has(f)) overlaps.push({ file: f, a: owner.get(f), b: name })
    else owner.set(f, name)
  }
}

const coordinator = {
  manifest: [
    ".artifacts/fe-refactor-audit/2026-08-09-b30c-status.json",
    ".artifacts/fe-refactor-audit/2026-08-09-b30c-status.md",
    ".artifacts/fe-refactor-audit/2026-08-09-b30-status.md",
    ".claude/fe/decision-ledger.json",
  ],
  warningsBefore: { changedSet: 72 },
  warningsAfter: { changedSetProduct: 0 },
  introducedByB30: [],
  preExistingInTouchedFile: [],
  fixed: ["LabeledList", "ContentTabBar"],
  retractedB30Changes: retracted,
  holds: [
    "Most B30 door burns restored via checkpoint retract",
    "TabsCard residual consumers restored on retracted pages; QuizSession unchanged",
    "LeaderboardListCard B30b StackV repair retracted",
  ],
  parity: {
    kept: "LabeledList + ContentTabBar src-only",
    ButtonGroupAtoms: "unchanged (FlexWrap retract restores HeroUI usage)",
  },
  verification: {},
  regressions: [],
  overlapCheck: overlaps.length ? "fail" : "pass",
  overlaps,
}

for (const [name, data] of Object.entries(workers)) {
  data.overlapCheck = overlaps.length ? "fail" : "pass"
  fs.writeFileSync(path.join(ART, `2026-08-09-b30c-worker-${name}.json`), JSON.stringify(data, null, 2) + "\n")
}
fs.writeFileSync(
  path.join(ART, "2026-08-09-b30c-worker-coordinator-lint-parity.json"),
  JSON.stringify(coordinator, null, 2) + "\n",
)

const status = {
  batch: "30c",
  title: "Touched-file zero-warning closure",
  complete: true,
  checkpoint: "8c13fd52",
  generatedAt: new Date().toISOString(),
  strategy: "Retract B30 edits in files that cannot reach zero warnings without forbidden contracts; keep only zero-warning survivors.",
  kept,
  retracted,
  doorsRestoredViaRetract: [
    "TierCardBase.className",
    "ListRow.className",
    "LeaderboardListCard.className",
    "SidebarNavItem.className",
    "LabeledList.className — NOT restored (kept closed via Stack frames)",
    "FlexWrap HeroUI ButtonGroup/Separator className",
    "TabsCard consumer classNames on ArchitectureMap/Flashcards/Notifications",
  ],
  semanticContractsRetained: [
    "LabeledList StackV sibling-stack (door closed)",
    "ContentTabBar Container size=md parent placement",
  ],
  semanticContractsLost: [
    "TierCardBase.isFeatured",
    "ListRow.density",
    "LeaderboardListCard B30b shared StackV",
    "FlexWrap → ButtonGroupRoot migration",
  ],
  overlapResult: overlaps.length ? "fail" : "pass",
  b30AggregateNote: "B30 is NOT complete as originally claimed; 30c retracts uncleanable door burns. See 30c status.",
}

fs.writeFileSync(path.join(ART, "2026-08-09-b30c-status.json"), JSON.stringify(status, null, 2) + "\n")

const md = `# BATCH 30c — Touched-file zero-warning closure

**Complete:** yes (under retract-or-fix law)  
**Checkpoint:** \`8c13fd52\`

## Outcome

B30b reported 72 warnings on the changed set. Zero-warning ratchet required either closing every finding or retracting uncleanable B30 edits.

### Kept (0 warnings)
${kept.map((f) => `- \`${f}\``).join("\n")}

### Retracted to checkpoint (B30/B30b product edits undone)
${retracted.map((f) => `- \`${f}\``).join("\n")}

## Why retract (not suppress)

| Area | Blockers under scope |
|---|---|
| TierCard* | HeroUI Card, cn, raw-shape, inline skeleton — no equivalent atom rewrite in-scope |
| ListRow / ReadinessChecklist | HeroUI Typography + cn + raw-shape |
| LeaderboardListCard | HeroUI + 9 raw-shape; B30c rewrite hit \`className\` door law, Typography \`classNames\`, Box self-declare vs escape; TopLearners \`page-folder-two-files-only\` |
| FlexWrap / SidebarNavItem | HeroUI imports + cn |
| ArchitectureMap / Flashcards / Notifications / TopLearners | page-folder, parallel-skeleton, retired AsyncContent — forbidden to change |

## Retained semantic work
- **LabeledList** — public \`className\` stays closed; \`StackV principle="sibling-stack"\` owns label/rows/action
- **ContentTabBar** — \`Container size="md"\` owns measure; identity on Container

## Lost vs original B30 claim
- \`isFeatured\`, \`density\`, Leaderboard StackV, FlexWrap atom migration, most door burns

## Overlap
\`${status.overlapResult}\`
`

fs.writeFileSync(path.join(ART, "2026-08-09-b30c-status.md"), md)

// Patch B30 status header to not claim completion
const b30md = path.join(ART, "2026-08-09-b30-status.md")
if (fs.existsSync(b30md)) {
  let text = fs.readFileSync(b30md, "utf8")
  if (!text.includes("## 30c supersession")) {
    text = text.replace(
      "**Committed:** no",
      "**Committed:** no  \n**30c status:** NOT complete as originally claimed — see `2026-08-09-b30c-status.md` (zero-warning ratchet; most door burns retracted)",
    )
    text += `

## 30c supersession

Changed-set ESLint zero-warning ratchet failed at 72 warnings. BATCH 30c retracted uncleanable B30/B30b product edits back to \`${status.checkpoint}\` and retained only zero-warning survivors (LabeledList Stack frames, ContentTabBar Container). Do not treat the original B30 door-burn inventory as landed.
`
    fs.writeFileSync(b30md, text)
  }
}

console.log(JSON.stringify({ kept, retractedCount: retracted.length, overlap: status.overlapResult }, null, 2))
