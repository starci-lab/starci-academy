/**
 * BATCH 25 — write worker + status artifacts, then re-inventory.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const emptyWorker = (name, notes) => ({
  partition: name,
  manifest: [],
  changed: [],
  applied: [],
  skipped: [],
  holds: [
    "live-prop Button/Chip/Stack/Grid/Box/SurfaceCard/Typography/Skeleton placement APIs",
    "vendor-boundary / HeroUI / foreign mounts",
    "DrawerShell / ShowcaseMockup / MiniCart / CvPreview / PDFView / B19–B24 contracts",
    "Nivo / Nivoexpert / locked paths / teacher holds / skeleton ComponentType slots",
    "no new principles, variants, slots, Box escape hatches, or eslint-disable",
  ],
  evidence: notes,
  principles: [],
  parity: { storybookSrc: "n/a — no edits" },
  verification: { local: "deferred to aggregate" },
  regressions: [],
})

const workers = {
  atoms: emptyWorker("atoms", {
    note: "No safe-noop or exact parent-placement in atoms trees. Typography skeleton default already includes w-1/2; call-site burns live in consumers.",
  }),
  frames: emptyWorker("frames", {
    note: "No proven call-site burns in frames. PinnedTrack/Cluster classNames remain live.",
  }),
  "storybook-only": emptyWorker("storybook-only", {
    note: "Storybook already omits redundant Typography isSkeleton classNames={[\"w-1/2\"]}; no SB-only burns this wave. LabeledAccordionCard is src-only (no SB component twin).",
  }),
}

workers.composites = {
  partition: "composites",
  manifest: ["src/components/composites/lists/UserCell/index.tsx"],
  changed: ["src/components/composites/lists/UserCell/index.tsx"],
  applied: [
    {
      kind: "safe-noop",
      file: "src/components/composites/lists/UserCell/index.tsx",
      change: "Removed classNames={[\"w-1/2\"]} from Typography isSkeleton — duplicate of Typography skeleton default `inline-block w-1/2 rounded`",
      consumerSearch: "rg 'isSkeleton.*classNames=\\{\\[\"w-1/2\"\\]\\}' src .storybook → only these sites; SB twins already omit",
      owningFrame: "Typography (atoms) skeleton branch",
      principle: null,
    },
  ],
  skipped: [],
  holds: [
    "Other Typography/Skeleton/ProgressMeter classNames on composites stay live-prop (no width/flex principle)",
  ],
  evidence: {
    typographySkeletonDefault:
      'cn("inline-block w-1/2 rounded", SKEL_H[size], classNames) in SB+src Typography',
  },
  principles: [],
  parity: {
    storybookSrc:
      "SB UserCell twin already without redundant w-1/2; src aligned to SB contract",
  },
  verification: { local: "deferred to aggregate" },
  regressions: [],
}

workers.blocks = {
  partition: "blocks",
  manifest: [
    "src/components/blocks/cards/LabeledAccordionCard/index.tsx",
    "src/components/blocks/commerce/TrialConversionStrip/component.tsx",
    "src/components/blocks/consultant/ConsultantProfileBody/index.tsx",
    "src/components/blocks/learn/ContinueCard/CardBody.tsx",
    "src/components/blocks/learn/FoundationHeader/index.tsx",
    "src/components/blocks/learn/LearnNudges/component.tsx",
    "src/components/blocks/learn/MockInterviewScorecard/index.tsx",
    "src/components/blocks/learn/personal-project/TaskCriteriaList/index.tsx",
    "src/components/blocks/profile/ProfileLoadingState/index.tsx",
  ],
  changed: [
    "src/components/blocks/cards/LabeledAccordionCard/index.tsx",
    "src/components/blocks/commerce/TrialConversionStrip/component.tsx",
    "src/components/blocks/consultant/ConsultantProfileBody/index.tsx",
    "src/components/blocks/learn/ContinueCard/CardBody.tsx",
    "src/components/blocks/learn/FoundationHeader/index.tsx",
    "src/components/blocks/learn/LearnNudges/component.tsx",
    "src/components/blocks/learn/MockInterviewScorecard/index.tsx",
    "src/components/blocks/learn/personal-project/TaskCriteriaList/index.tsx",
    "src/components/blocks/profile/ProfileLoadingState/index.tsx",
  ],
  applied: [
    {
      kind: "safe-noop",
      files: [
        "src/components/blocks/commerce/TrialConversionStrip/component.tsx",
        "src/components/blocks/consultant/ConsultantProfileBody/index.tsx",
        "src/components/blocks/learn/ContinueCard/CardBody.tsx",
        "src/components/blocks/learn/FoundationHeader/index.tsx",
        "src/components/blocks/learn/LearnNudges/component.tsx",
        "src/components/blocks/learn/MockInterviewScorecard/index.tsx",
        "src/components/blocks/profile/ProfileLoadingState/index.tsx (7 sites)",
      ],
      change: "Removed Typography isSkeleton classNames={[\"w-1/2\"]} duplicates",
      count: 13,
    },
    {
      kind: "redundant-passthrough",
      file: "src/components/blocks/learn/personal-project/TaskCriteriaList/index.tsx",
      change: "Removed className={className} on LabeledAccordionCard (prop never forwarded)",
      consumerSearch:
        "LabeledAccordionCardProps extended WithClassNames but export never destructured/forwarded className; TaskCriteriaList empty path still uses Box className",
    },
    {
      kind: "redundant-passthrough",
      file: "src/components/blocks/cards/LabeledAccordionCard/index.tsx",
      change: "Dropped WithClassNames from LabeledAccordionCardProps after zero remaining JSX consumers",
      consumerSearch:
        "rg className= on LabeledAccordionCard call sites → 0 after TaskCriteriaList/CourseOutline/CourseMilestoneOutline edits",
    },
  ],
  skipped: [],
  holds: [
    "TaskCriteriaList WithClassNames retained (empty Box still consumes className; zero external callers today but door not burned this wave)",
    "ProgressMeter/Skeleton/Typography non-duplicate placement stays live-prop",
  ],
  evidence: {
    labeledAccordionDeadDoor:
      "export const LabeledAccordionCard = ({ label, labelEnd, action, items, ... }) — no className",
  },
  principles: [],
  parity: {
    storybookSrc:
      "LabeledAccordionCard src-only; Typography skeleton dupes had no SB call sites",
  },
  verification: { local: "deferred to aggregate" },
  regressions: [],
}

workers["pages-learning-commerce"] = {
  partition: "pages-learning-commerce",
  manifest: [
    "src/components/pages/LearningHistoryPage/CourseOutline/index.tsx",
    "src/components/pages/LearningHistoryPage/CourseMilestoneOutline/index.tsx",
  ],
  changed: [
    "src/components/pages/LearningHistoryPage/CourseOutline/index.tsx",
    "src/components/pages/LearningHistoryPage/CourseMilestoneOutline/index.tsx",
  ],
  applied: [
    {
      kind: "redundant-passthrough",
      files: [
        "src/components/pages/LearningHistoryPage/CourseOutline/index.tsx",
        "src/components/pages/LearningHistoryPage/CourseMilestoneOutline/index.tsx",
      ],
      change: "Removed className={className} on LabeledAccordionCard; skeleton path still uses cn(ACCORDION_CARD_SKELETON, className)",
      consumerSearch:
        "CourseDetail mounts <CourseOutline search/> / <CourseMilestoneOutline search/> with no className; LabeledAccordionCard ignored the prop",
    },
  ],
  skipped: [],
  holds: [
    "CourseOutline/CourseMilestoneOutline WithClassNames retained (skeleton path)",
    "locked LearnLoopScroll / QuizSession / etc.",
  ],
  evidence: {},
  principles: [],
  parity: { storybookSrc: "n/a — page trees" },
  verification: { local: "deferred to aggregate" },
  regressions: [],
}

workers["pages-profile-dashboard"] = {
  partition: "pages-profile-dashboard",
  manifest: [
    "src/components/pages/DashboardPage/DailyQuest/component.tsx",
    "src/components/pages/DashboardPage/StreakStrip/component.tsx",
  ],
  changed: [
    "src/components/pages/DashboardPage/DailyQuest/component.tsx",
    "src/components/pages/DashboardPage/StreakStrip/component.tsx",
  ],
  applied: [
    {
      kind: "safe-noop",
      files: [
        "src/components/pages/DashboardPage/DailyQuest/component.tsx",
        "src/components/pages/DashboardPage/StreakStrip/component.tsx",
      ],
      change: "Removed Typography isSkeleton classNames={[\"w-1/2\"]} duplicates",
      count: 2,
    },
  ],
  skipped: [],
  holds: [
    "Button/Chip classNames={['self-start']} on DailyQuest remain live-prop",
    "ProfileSectionGuard className live on private branch",
  ],
  evidence: {},
  principles: [],
  parity: { storybookSrc: "n/a — page trees" },
  verification: { local: "deferred to aggregate" },
  regressions: [],
}

workers["pages-other"] = {
  partition: "pages-other",
  manifest: [
    "src/components/pages/CommunityFeedPage/component.tsx",
    "src/components/overlays/modals/PremiumGateModal/component.tsx",
  ],
  changed: [
    "src/components/pages/CommunityFeedPage/component.tsx",
    "src/components/overlays/modals/PremiumGateModal/component.tsx",
  ],
  applied: [
    {
      kind: "safe-noop",
      files: [
        "src/components/pages/CommunityFeedPage/component.tsx",
        "src/components/overlays/modals/PremiumGateModal/component.tsx",
      ],
      change: "Removed Typography isSkeleton classNames={[\"w-1/2\"]} duplicates",
      count: 2,
      note: "PremiumGateModal assigned here as remaining eligible non-page tree outside locked/Nivo",
    },
  ],
  skipped: [],
  holds: ["All ambiguous width/flex placement without exact principle"],
  evidence: {},
  principles: [],
  parity: { storybookSrc: "n/a" },
  verification: { local: "deferred to aggregate" },
  regressions: [],
}

for (const [name, body] of Object.entries(workers)) {
  fs.writeFileSync(
    path.join(ART, `2026-08-09-b25-worker-${name}.json`),
    JSON.stringify(body, null, 2) + "\n",
  )
}

const before = JSON.parse(fs.readFileSync(path.join(ART, "_b25-classname-raw.json"), "utf8"))
const beforeHits = before.length
const beforeFiles = new Set(before.map((h) => h.file.replace(/\\/g, "/"))).size

// Fresh inventory
const eslint = spawnSync(
  "npx",
  [
    "eslint",
    "--no-error-on-unmatched-pattern",
    "-f",
    "json",
    "src/components",
    ".storybook/components",
  ],
  {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    shell: true,
  },
)

let afterHits = []
try {
  const results = JSON.parse(eslint.stdout || "[]")
  for (const file of results) {
    for (const m of file.messages || []) {
      if (m.ruleId === "starci-fe/no-public-classname-prop") {
        afterHits.push({
          file: path.relative(ROOT, file.filePath).replace(/\\/g, "/"),
          line: m.line,
          msg: m.message,
        })
      }
    }
  }
} catch (e) {
  console.error("eslint parse failed", e.message, eslint.stderr?.slice(0, 500))
}

fs.writeFileSync(path.join(ART, "_b25-classname-after.json"), JSON.stringify(afterHits, null, 2))

const afterFiles = new Set(afterHits.map((h) => h.file)).size
const classified = fs.existsSync(path.join(ART, "2026-08-09-b25-classified.json"))
  ? JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b25-classified.json"), "utf8"))
  : null

const changedFiles = [
  ...new Set(Object.values(workers).flatMap((w) => w.changed)),
].sort()

const status = {
  batch: 25,
  title: "Call-site CSS-door closure",
  committed: false,
  checkpoint: "a7052eee",
  generatedAt: new Date().toISOString(),
  inventory: {
    rule: "starci-fe/no-public-classname-prop",
    before: { hits: beforeHits, files: beforeFiles },
    after: { hits: afterHits.length, files: afterFiles },
    delta: {
      hits: afterHits.length - beforeHits,
      files: afterFiles - beforeFiles,
    },
  },
  classificationBefore: classified?.byClass || null,
  appliedSummary: {
    safeNoopTypographySkeletonW12: 18,
    redundantLabeledAccordionClassNameCallSites: 3,
    labeledAccordionWithClassNamesDoorRemoved: 1,
    parentPlacement: 0,
    totalCallSiteFixes: 21,
  },
  changedFiles,
  holdsPreserved: [
    "Button/Chip/Stack/Grid/Box/SurfaceCard live APIs and call-site CSS without exact principle",
    "Typography/Skeleton/ProgressMeter non-duplicate placement (w-full, flex-1, shrink-0, fraction widths on live text)",
    "DrawerShell / ShowcaseMockup / MiniCart / CvPreview / PDFView / B19–B24",
    "vendor HeroUI / Box foreign mounts",
    "Nivo / Nivoexpert / locked paths / teacher holds / skeleton ComponentType slots",
    "FieldFrame classNames live-api",
    "no new principles / variants / slots / eslint-disable",
  ],
  parity: {
    storybookAlreadyOmittedSkeletonW12: true,
    labeledAccordionSrcOnly: true,
    srcMirroredWhereApplicable: true,
  },
  workers: Object.keys(workers),
  verification: {
    pending: [
      "npx tsc --noEmit",
      "npx eslint --max-warnings=0 <changed>",
      "node --test plugins/eslint/*.test.mjs (listed)",
      "node --test .storybook/test-runner/{principle-style,semantic-contracts}.test.mjs",
      "npm run audit:fe",
    ],
  },
  regressions: [],
}

fs.writeFileSync(path.join(ART, "2026-08-09-b25-status.json"), JSON.stringify(status, null, 2) + "\n")

const md = `# BATCH 25 — Call-site CSS-door closure

**Committed:** no  
**Checkpoint:** \`a7052eee\`

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${beforeHits} | ${beforeFiles} |
| After | ${afterHits.length} | ${afterFiles} |
| Delta | **${afterHits.length - beforeHits}** | **${afterFiles - beforeFiles}** |

## Classification (usage hits, pre-edit)

| Class | Count |
|---|---:|
${Object.entries(classified?.byClass || {})
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join("\n")}

## Applied (counted fixes only)

| Kind | Count | Notes |
|---|---:|---|
| safe-noop Typography \`isSkeleton\` + \`classNames={["w-1/2"]}\` | 18 | Duplicate of skeleton default \`inline-block w-1/2 rounded\` |
| redundant \`className\` → \`LabeledAccordionCard\` | 3 | Prop declared via \`WithClassNames\` but never forwarded |
| dead \`WithClassNames\` on \`LabeledAccordionCard\` | 1 | After zero remaining consumers |
| parent-placement | 0 | No exact existing principle for width/flex/shrink |

### Files changed (${changedFiles.length})

${changedFiles.map((f) => `- \`${f}\``).join("\n")}

## Holds (not claimed fixed)

- Button / Chip / Stack / Grid / Box / SurfaceCard live APIs
- Typography / Skeleton / ProgressMeter placement without matching principle
- DrawerShell, ShowcaseMockup, MiniCart, CvPreview, PDFView, B19–B24 contracts
- Vendor HeroUI / Box; Nivo / locked / teacher holds; skeleton \`ComponentType\` slots
- CourseOutline / CourseMilestoneOutline / TaskCriteriaList own \`className\` doors (still consumed on empty/skeleton paths)

## Parity

- Storybook already omitted the redundant Typography skeleton \`w-1/2\` call sites
- \`LabeledAccordionCard\` is src-only (no SB component twin)

## Workers

\`atoms\` · \`composites\` · \`frames\` · \`blocks\` · \`pages-learning-commerce\` · \`pages-profile-dashboard\` · \`pages-other\` · \`storybook-only\`

## Verification

See aggregate run (fill after gates).
`

fs.writeFileSync(path.join(ART, "2026-08-09-b25-status.md"), md)
console.log(
  JSON.stringify(
    {
      before: { hits: beforeHits, files: beforeFiles },
      after: { hits: afterHits.length, files: afterFiles },
      changed: changedFiles.length,
      applied: status.appliedSummary,
    },
    null,
    2,
  ),
)
