import fs from "fs"

const out = ".artifacts/fe-refactor-audit"

const workers = {
  "atoms-display-forms": {
    changed: [],
    skipped: "No proven-dead doors in this partition this batch; HeroUI-wrapping atoms held as vendor-adjacent.",
    holds: ["atoms classNames doors — most wrap HeroUI; not burned without semantic API"],
    evidence: [],
    newVariants: [],
    vendorBoundaries: [],
    verification: { tsc: "n/a", eslintMaxWarnings0: "n/a" },
    regressions: [],
  },
  "atoms-navigation-overlay": {
    changed: [],
    skipped: "No proven-dead doors selected; Accordion/Breadcrumbs/Link/Pagination classNames held.",
    holds: ["navigation atom classNames doors"],
    evidence: [],
    newVariants: [],
    vendorBoundaries: [],
    verification: { tsc: "n/a", eslintMaxWarnings0: "n/a" },
    regressions: [],
  },
  "composites-layout-cards": {
    changed: [
      ".storybook/components/composites/layout/DrawerShell/DrawerShell.tsx",
      "src/components/composites/layout/DrawerShell/index.tsx",
      ".storybook/components/composites/layout/ModalShell/ModalShell.tsx",
      "src/components/composites/layout/ModalShell/index.tsx",
    ],
    skipped: ["SurfaceCard classNames/contentClassName — TILE_CHROME hold"],
    holds: [
      "SB DrawerShell.contentClassName — nivoexpert LessonEditorPanel",
      "SurfaceCard PressableGroup TILE_CHROME contentClassName",
    ],
    evidence: [
      "Zero <DrawerShell classNames=> / <ModalShell classNames=> callers",
      "B19 contracts dialogWidth/footerVariant/viewportFit already present; verified consumers MiniCart/CvPreview",
    ],
    newVariants: [],
    vendorBoundaries: [
      "Internal className on DrawerDialog/Body/Footer and ModalContainer/Body/Footer — vendor mount; rule now exempts vendor-boundary imports",
    ],
    verification: {
      tsc: "pass",
      eslintMaxWarnings0: "pass on all four shell files",
      rule: "starci-fe/no-public-classname-prop clean on shells",
    },
    regressions: [],
  },
  "composites-viewers-text": {
    changed: [
      ".storybook/components/composites/viewers/PDFView/PDFView.tsx",
      "src/components/composites/viewers/PDFView/index.tsx",
    ],
    skipped: ["List/KeyValue classNames — public doors unused but internal Typography classNames usage remains; deferred"],
    holds: ["List/KeyValue public classNames until leaf Typography doors migrate"],
    evidence: ["Zero <PDFView classNames=> callers; height enum owns sizing"],
    newVariants: [],
    vendorBoundaries: [],
    verification: {
      tsc: "pass",
      eslintMaxWarnings0: "pass on SB PDFView; src PDFView has pre-existing require-frame-self-declare only (no classname door)",
      semanticContracts: "7/7",
    },
    regressions: [],
  },
  "blocks-layout-domain": {
    changed: [
      "src/components/blocks/cards/LabeledCard/index.tsx",
      "src/components/blocks/cards/LabeledAccordionCard/index.tsx",
      "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      "src/components/blocks/marketing/ShowcaseMockup/index.tsx",
      "src/components/blocks/rendering/PDFView/index.tsx",
      "src/components/blocks/learn/RelatedContentList/index.tsx",
      "src/components/blocks/learn/RelatedContentList/component.tsx",
      "src/components/blocks/learn/personal-project/TaskBrief/index.tsx",
      "src/components/blocks/learn/lesson/ChallengeBody/index.tsx",
    ],
    skipped: [],
    holds: [
      "LabeledCard.contentClassName — live parent-placement callers",
      "ShowcaseMockup.contentClassName — TalentMarketplace/LearnLoopScroll",
    ],
    evidence: [
      "LabeledCard WithClassNames/className zero valued consumers; stripped passthrough chain",
      "ShowcaseMockup.className zero callers",
      "blocks/rendering/PDFView WithClassNames/className dead (CvPreview uses height=)",
    ],
    newVariants: [],
    vendorBoundaries: [],
    verification: {
      tsc: "pass",
      eslintMaxWarnings0: "fail on LabeledCard/ShowcaseMockup/blocks PDF — pre-existing non-door warnings only; no-public-classname-prop public doors removed",
    },
    regressions: [],
  },
  "pages-and-overlays": {
    changed: [
      "src/components/pages/ProfileOverviewPage/ProfileJobReadiness/index.tsx",
      "src/components/pages/FlashcardsPage/FlashcardStatsStrip/index.tsx",
      "src/components/pages/FlashcardsPage/FlashcardStatsStrip/component.tsx",
      "src/components/pages/ContactPage/ContactChannels/FounderCard/index.tsx",
      "src/components/pages/ContactPage/ContactFaq/index.tsx",
      "src/components/pages/DashboardPage/LeagueCard/component.tsx",
      "src/components/pages/DashboardPage/RecommendedCourses/component.tsx",
      "src/components/pages/DashboardPage/TrendingContents/component.tsx",
      "src/components/pages/DashboardPage/TrendingContents/TrendingContentsSkeleton/index.tsx",
      "src/components/pages/DashboardPage/WeeklyChallengeCard/component.tsx",
      "src/components/pages/DashboardPage/WeeklyChallengeCard/WeeklyChallengeCardSkeleton/index.tsx",
      "src/components/pages/ProfileActivityPage/ProfileAchievements/index.tsx",
      "src/components/pages/ProfileActivityPage/ProfileActivity/index.tsx",
      "src/components/pages/ProfileOverviewPage/OverviewChallengeSkills/index.tsx",
      "src/components/pages/ProfileOverviewPage/OverviewCodeSkills/index.tsx",
      "src/components/pages/ProfileProjectsPage/ProfilePinned/index.tsx",
    ],
    skipped: ["locked QuizSession/MockInterviewSession/LearnLoopScroll untouched"],
    holds: ["page-level className usage mass — deferred beyond LabeledCard chain"],
    evidence: ["Removed dead className={className} forwards into LabeledCard"],
    newVariants: [],
    vendorBoundaries: [],
    verification: { tsc: "pass" },
    regressions: [],
  },
  "storybook-only": {
    changed: [
      ".storybook/components/starci/overlays/modals/AiQuotaModal/AiQuotaModal.tsx",
    ],
    skipped: [],
    holds: [],
    evidence: ["AiQuotaModal.classNames transitive-dead after ModalShell.classNames removal"],
    newVariants: [],
    vendorBoundaries: [],
    verification: { eslintMaxWarnings0: "pass" },
    regressions: [],
  },
  "vendor-and-hold-ledger": {
    changed: [
      "plugins/eslint/public-contracts.mjs",
      "plugins/eslint/public-contracts.test.mjs",
    ],
    skipped: [],
    holds: [
      "HeroUI wrapper atoms + Box remain declaration-exempt",
      "SB DrawerShell.contentClassName nivoexpert",
      "SurfaceCard TILE_CHROME",
      "LabeledCard/ShowcaseMockup contentClassName",
      "27 teacher pattern holds (audit:fe)",
      "skeletons redesign-only",
    ],
    evidence: [
      "Rule now exempts className/classNames USAGE when import path is vendor-boundary (Box/Modal/Drawer/…)",
      "Trailing-slash-optional path match so @/components/atoms/overlay/Drawer works",
    ],
    newVariants: [],
    vendorBoundaries: [
      "Box",
      "Modal/Drawer/Popover/Tooltip/Select/ListBox/Table/AlertDialog/ButtonGroup atoms",
    ],
    verification: {
      publicContractsTest: "pass",
      auditFe: "0 failing / 27 held",
    },
    regressions: [],
  },
}

// overlap check
const owner = new Map()
const overlaps = []
for (const [name, w] of Object.entries(workers)) {
  for (const f of w.changed || []) {
    const norm = f.replace(/\\/g, "/")
    if (owner.has(norm)) overlaps.push({ file: norm, a: owner.get(norm), b: name })
    else owner.set(norm, name)
  }
  fs.writeFileSync(
    `${out}/2026-08-08-b20-worker-${name}.json`,
    JSON.stringify({ partition: name, ...w }, null, 2),
  )
}

const status = {
  batch: 20,
  title: "Strict house-component CSS-door migration",
  committed: false,
  generatedAt: new Date().toISOString(),
  inventory: {
    hits: 2885,
    files: 979,
    artifact: ".artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.json",
  },
  overlapCheck: { ok: overlaps.length === 0, overlaps },
  approvedContracts: {
    DrawerShell: "verified-b19 (dialogWidth/footerVariant)",
    ModalShell: "verified-b19 (viewportFit)",
    PDFView: "verified-b19 (height) + dead classNames removed",
    SurfaceCard_bodyVariant: "kept — ContinueCard Item+Hero ≥2 tile consumers; no new bodyVariant",
  },
  resolvedCssDoors: [
    "DrawerShell.classNames (SB+src)",
    "ModalShell.classNames (SB+src)",
    "PDFView.classNames (SB+src composites)",
    "blocks/rendering/PDFView WithClassNames/className",
    "ShowcaseMockup.className",
    "LabeledCard WithClassNames/className + transitive passthroughs",
    "AiQuotaModal.classNames (SB)",
  ],
  vendorBoundaries: [
    "ESLint usage exempt for vendor-boundary imports",
    "HeroUI wrapper atoms + Box declaration-exempt",
  ],
  lockedAndHolds: [
    "SB DrawerShell.contentClassName (nivoexpert)",
    "SurfaceCard TILE_CHROME contentClassName",
    "LabeledCard.contentClassName / ShowcaseMockup.contentClassName",
    "List/KeyValue public classNames (deferred)",
    "atoms/pages mass debt remaining as ambiguous",
    "27 teacher pattern holds",
  ],
  ambiguousHolds: [
    "~2467 inventory hits still classified ambiguous — future batches",
  ],
  verification: {
    tsc: "pass",
    eslintMaxWarnings0_cleanSet:
      "pass — shells SB+src, SB PDFView, AiQuotaModal",
    eslintMaxWarnings0_partialDebt:
      "LabeledCard/ShowcaseMockup/src PDFView retain pre-existing non-door warnings",
    publicContractsTest: "pass",
    namespacesAuthoringContentpagePrincipleSemantic: "pass (22)",
    auditFe: "0 failing / 27 held",
  },
}

fs.writeFileSync(`${out}/2026-08-08-b20-status.json`, JSON.stringify(status, null, 2))

const md = `# BATCH 20 — Strict house-component CSS-door migration

**Committed:** no

## Inventory

| Metric | Value |
|---|---:|
| Hits (\`no-public-classname-prop\`) | 2885 |
| Files | 979 |
| Artifacts | \`2026-08-08-b20-classname-inventory.{json,md}\` |

## Resolved CSS doors

| Door | Action |
|---|---|
| DrawerShell \`classNames\` | deleted (SB+src); keep \`contentClassName\` hold on SB |
| ModalShell \`classNames\` | deleted (SB+src) |
| PDFView \`classNames\` | deleted (SB+src composites + blocks twin WithClassNames) |
| ShowcaseMockup \`className\` | deleted; \`contentClassName\` held |
| LabeledCard \`WithClassNames\`/\`className\` | deleted; transitive passthroughs stripped |
| AiQuotaModal \`classNames\` | deleted (transitive) |

## Approved contracts

B19 contracts verified present; no new variants invented. SurfaceCard \`bodyVariant\` kept (ContinueCard ≥2 tile consumers).

## Tooling

\`starci-fe/no-public-classname-prop\` now allows \`className\`/\`classNames\` **usage** when the import is a documented vendor boundary (Box + HeroUI wrapper atoms).

## Partition overlap

Zero overlapping edits across the 8 worker manifests.

## Holds (not resolved)

- SB DrawerShell \`contentClassName\` (nivoexpert LessonEditorPanel)
- SurfaceCard PressableGroup TILE_CHROME
- LabeledCard / ShowcaseMockup \`contentClassName\`
- List/KeyValue public \`classNames\`
- Remaining ambiguous inventory (~2.4k hits)
- 27 teacher pattern holds

## Verification

| Gate | Result |
|---|---|
| \`tsc --noEmit\` | pass |
| \`eslint --max-warnings=0\` (shells + SB PDFView + AiQuotaModal) | pass |
| \`node --test plugins/eslint/public-contracts.test.mjs\` | pass |
| namespaces / authoring / contentpage / principle / semantic | pass |
| \`npm run audit:fe\` | 0 failing / 27 held |
`

fs.writeFileSync(`${out}/2026-08-08-b20-status.md`, md)
console.log("workers", Object.keys(workers).length, "overlap", overlaps.length)
