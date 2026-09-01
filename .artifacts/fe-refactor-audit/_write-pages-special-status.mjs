/** Write pages-special worker status JSON. */
import fs from "node:fs"

const manifest = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-manifest-pages-special.json", "utf8"),
)
const inv = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-parallel-burn-inventory.json", "utf8"),
)
const part = inv.partitions["pages-special"]
const byPath = new Map(part.files.map((f) => [f.path.replace(/\\/g, "/"), f]))
const SAFE = new Set(inv.safeRuleAllowlist)

const changed = [
  {
    path: ".storybook/components/starci/pages/CourseContents/_shared.tsx",
    rules: ["starci-fe/no-emoji-in-source"],
    reason: "scrubbed authoring emoji arrows",
  },
  {
    path: ".storybook/components/starci/pages/CourseQaPage/CourseQaPage.tsx",
    rules: ["starci-fe/handler-on-prefix"],
    reason: "handleAskQuestion -> onAskQuestion with prop alias",
  },
  {
    path: "src/components/pages/PracticeProblemPage/index.tsx",
    rules: ["starci-fe/handler-on-prefix"],
    reason: "handleBlur -> onBlur",
  },
  {
    path: "src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx",
    rules: ["starci-fe/handler-on-prefix"],
    reason: "handleSelect -> onSelect",
  },
  {
    path: "src/components/pages/FlashcardsPage/DueReviewHero/index.tsx",
    rules: ["starci-fe/handler-on-prefix"],
    reason: "handlePressStart -> onPressStart",
  },
  {
    path: "src/components/pages/FlashcardsPage/DueReview/index.tsx",
    rules: ["starci-fe/handler-on-prefix"],
    reason: "merged handleRate into onRate",
  },
  {
    path: "src/components/pages/LandingPage/KnowledgeGraph/index.tsx",
    rules: ["starci-fe/no-emoji-in-source"],
    reason: "scrubbed authoring emoji",
  },
  {
    path: "src/components/pages/DashboardPage/index.tsx",
    rules: ["starci-fe/no-emoji-in-source"],
    reason: "scrubbed authoring emoji",
  },
  {
    path: "src/components/pages/DashboardPage/FlashcardReview/component.tsx",
    rules: ["starci-fe/no-emoji-in-source"],
    reason: "scrubbed authoring emoji",
  },
  {
    path: "src/components/pages/CourseDetailPage/CourseFaq/component.tsx",
    rules: ["starci-fe/no-emoji-in-source"],
    reason: "scrubbed authoring emoji",
  },
  {
    path: "src/components/pages/FlashcardsPage/useFlashcardNav.ts",
    rules: ["starci-fe/no-emoji-in-source"],
    reason: "scrubbed authoring emoji",
  },
  {
    path: "src/components/pages/ArchitecturePage/ArchitectureRail/index.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named ComponentRowProps/ModuleRowProps",
  },
  {
    path: "src/components/pages/ArchitecturePage/ArchitectureRail/ArchitectureMobileNav/index.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named chip props types",
  },
  {
    path: "src/components/pages/LandingPage/TalentMarketplace/index.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named inline param types",
  },
  {
    path: "src/components/pages/CvGalleryPage/CvGallery/component.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named card props types",
  },
  {
    path: "src/components/pages/ProfileOverviewPage/ProfileJobReadiness/index.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named inline param type",
  },
  {
    path: "src/components/pages/MindMapPage/component.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named MindMapWorkspaceEmptyProps; handleSide held",
  },
  {
    path: "src/components/pages/ProfileProjectsPage/ProfilePinned/index.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named ProfilePinnedActionProps",
  },
  {
    path: "src/components/pages/DashboardPage/ChangelogList/component.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named inline param type",
  },
  {
    path: "src/components/pages/FlashcardsPage/FlashcardQuizResult/recapBlocks.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named inline param type",
  },
  {
    path: "src/components/pages/PlaygroundPreparePage/component.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named inline param type",
  },
  {
    path: "src/components/pages/ProfilePublicCvPage/index.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named inline param type",
  },
  {
    path: "src/components/pages/FlashcardsPage/FlashcardQuizResult/component.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named inline param type",
  },
  {
    path: "src/components/pages/FlashcardReviewPage/index.tsx",
    rules: ["starci-fe/require-identity-root"],
    reason: "clear Box roots got identity",
  },
]

const holds = [
  {
    path: ".storybook/components/starci/pages/MindMapPage/MindMapPage.tsx",
    rules: ["starci-fe/handler-on-prefix"],
    reason: "handleSide is ResizableRail JSX API prop — outside rename scope",
  },
  {
    path: "src/components/pages/MindMapPage/component.tsx",
    rules: ["starci-fe/handler-on-prefix"],
    reason: "handleSide is ResizableRail JSX API prop — outside rename scope",
  },
]

const SKIP_CLOSED = /ContentPage|ContentArticle/
const SKIP_LOCKED = /MockInterview|QuizSession|LearnLoop|ContentAiChat|ArchitectureScene/
const changedSet = new Set(changed.map((c) => c.path))

const IDENTITY_CAPABLE = new Set([
  "Box",
  "Cluster",
  "Container",
  "Flex",
  "Grid",
  "PinnedTrack",
  "RailShell",
  "ResponsiveCluster",
  "ResponsiveRow",
  "ScrollArea",
  "Split",
  "SplitWorkspace",
  "Stack",
  "StackH",
  "StackV",
  "Stage",
  "SurfaceCard",
  "SurfaceCardNested",
  "SurfaceCardPressableGroup",
  "SurfaceCardList",
  "SurfaceCardAccordion",
  "SurfaceCardCrossList",
  "SurfaceCardPlaceholder",
  "SurfaceCardSelectableGroup",
  "Form",
  "FormActions",
  "FormSection",
  "EmptyState",
  "ModalShell",
  "DrawerShell",
  "List",
  "AuthorByline",
  "KeyValueList",
  "KeyValueRow",
  "Page",
])
const ASYNC_NO = new Set(["AsyncContent", "AsyncContentEmpty", "AsyncContentError"])

function findReturnRoots(src) {
  const roots = []
  const re =
    /return\s*(?:\(|)\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\/\/[^\n]*\n\s*)*<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
  let m
  while ((m = re.exec(src))) roots.push(m[1])
  return roots
}

const skipped = []
const holdKeys = new Set(holds.map((h) => `${h.path}::${h.rules.join(",")}`))

for (const f of manifest.files) {
  const rel = f.path.replace(/\\/g, "/")
  const meta = byPath.get(rel) || f
  const msgs = (meta.messages || []).filter((m) => SAFE.has(m.rule))
  const rules = [...new Set(msgs.map((m) => m.rule).concat(meta.safeRules || []))]
  if (!rules.length && !(meta.safeCount > 0)) continue

  if (SKIP_CLOSED.test(rel)) {
    skipped.push({ path: rel, rules, reason: "closed-contentpage-box" })
    continue
  }
  if (SKIP_LOCKED.test(rel)) {
    skipped.push({ path: rel, rules, reason: "locked-path" })
    continue
  }

  if (rules.includes("starci-fe/no-inline-skeleton-branch")) {
    const key = `${rel}::starci-fe/no-inline-skeleton-branch`
    if (!holdKeys.has(key)) {
      holds.push({
        path: rel,
        rules: ["starci-fe/no-inline-skeleton-branch"],
        reason: "skeleton-branch-needs-leaf-isSkeleton",
      })
      holdKeys.add(key)
    }
  }

  if (rules.includes("starci-fe/require-identity-root") && rel !== "src/components/pages/FlashcardReviewPage/index.tsx") {
    let reason = "unclear-identity-root"
    if (fs.existsSync(rel)) {
      const src = fs.readFileSync(rel, "utf8")
      const tags = [...new Set(findReturnRoots(src))]
      const host = tags.filter((t) => /^[a-z]/.test(t))
      const capable = tags.filter((t) => IDENTITY_CAPABLE.has(t))
      const incapable = tags.filter((t) => /^[A-Z]/.test(t) && !IDENTITY_CAPABLE.has(t))
      if (host.length && !capable.length) reason = `host-root:${host.join(",")}`
      else if (host.length) reason = `mixed-host:${tags.join(",")}`
      else if (tags.some((t) => ASYNC_NO.has(t))) reason = "async-root"
      else if (incapable.length) reason = `incapable-root:${incapable.join(",")}`
      else if (capable.length > 1) reason = `multi-capable-roots:${capable.join(",")}`
      else reason = `unclear-identity-root:${tags.join(",")}`
    }
    const key = `${rel}::starci-fe/require-identity-root`
    if (!holdKeys.has(key)) {
      holds.push({ path: rel, rules: ["starci-fe/require-identity-root"], reason })
      holdKeys.add(key)
    }
  }

  if (changedSet.has(rel)) continue

  const remainingAuthoring = rules.filter(
    (r) =>
      r !== "starci-fe/require-identity-root" &&
      r !== "starci-fe/no-inline-skeleton-branch" &&
      !(r === "starci-fe/handler-on-prefix" && rel.includes("MindMapPage")),
  )
  if (remainingAuthoring.length) {
    skipped.push({ path: rel, rules: remainingAuthoring, reason: "deferred-batch-size" })
  } else if (
    rules.every(
      (r) =>
        r === "starci-fe/require-identity-root" ||
        r === "starci-fe/no-inline-skeleton-branch" ||
        (r === "starci-fe/handler-on-prefix" && rel.includes("MindMapPage")),
    )
  ) {
    // fully accounted as holds — no skip entry needed
  } else {
    skipped.push({ path: rel, rules, reason: "deferred-batch-size" })
  }
}

const status = {
  partition: "pages-special",
  changed,
  skipped,
  holds,
  verification: {
    eslintOnChanged: {
      cleared: [
        "no-emoji-in-source",
        "no-inline-parameter-type",
        "handler-on-prefix (except ResizableRail handleSide)",
        "require-identity-root on FlashcardReviewPage",
      ],
      remainOnChangedFiles: {
        "starci-fe/require-identity-root": 8,
        "starci-fe/handler-on-prefix": 1,
        note: "hard identity roots + handleSide API prop — recorded as holds",
      },
    },
    tsc: {
      result: "preexisting-error-outside-partition",
      detail:
        "src/components/blocks/marketing/MicroservicesScene/index.tsx TS1382 — not in this manifest",
    },
  },
  regressions: [],
  counts: {
    changed: changed.length,
    skipped: skipped.length,
    holds: holds.length,
    cap: 40,
  },
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-worker-pages-special.json",
  JSON.stringify(status, null, 2),
)
console.log(JSON.stringify(status.counts, null, 2))
