/**
 * BATCH 28 — write 12 disjoint manifests from consumer scan + apply plan.
 */
import fs from "node:fs"
import path from "node:path"

const ART = path.join(process.cwd(), ".artifacts/fe-refactor-audit")
const scan = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b28-consumer-scan.json"), "utf8"))

const WORKERS = [
  "buttons-actions",
  "cards-commerce",
  "community-feed",
  "identity-svg",
  "layout-shells",
  "learn-content",
  "lists-navigation",
  "media-rendering",
  "rails",
  "course-pages",
  "composite-twins",
  "hard-holds",
]

/** Coordinator apply plan — only proven finite cases. */
const PLAN = {
  // intrinsic size axes
  GoogleIcon: { action: "apply-intrinsic", prop: "size", reason: "single consumer size-3.5 → bake default, delete door" },
  LogoMark: { action: "apply-intrinsic", prop: "size", reason: "single consumer size-10 → bake default, delete door" },
  BrandLogo: {
    action: "apply-intrinsic",
    prop: "size",
    reason: "finite h-9|h-10|h-14 → size sm|md|lg",
  },
  // parent placement via existing HideAbove
  CourseMobileEnrollBar: {
    action: "apply-parent-hideabove",
    reason: "@app-md:hidden → HideAbove at=md",
  },
  BackLink: {
    action: "apply-parent-mixed",
    reason: "@app-sm:hidden → HideAbove; shrink-0 → parent Box classNames",
  },
  // parent placement via Box AllowedClassName wrappers
  ElementCloseButton: { action: "apply-parent-box", reason: "shrink-0 → StatusChip Box/wrapper" },
  FollowButton: { action: "apply-parent-box", reason: "shrink-0 / ml-1 shrink-0 → parent wrappers" },
  AddToCartButton: { action: "apply-parent-box", reason: "flex-1 → parent" },
  CommentComposer: { action: "apply-parent-box", reason: "w-full → parent" },
  PhaseScarcityNote: { action: "apply-parent-box", reason: "self-center → parent EnrollGate" },
  AiRewriteButton: { action: "apply-parent-box", reason: "w-fit self-start → parent editors" },
  BrandLockup: { action: "apply-parent-box", reason: "self-start → Footer Box" },
  // holds
  GithubIcon: { action: "hold", reason: "LearnLoopScroll locked consumer blocks door deletion" },
  ChatToolResult: { action: "hold", reason: "ContentAiChat locked consumer" },
  FloatingActionButton: { action: "hold", reason: "passthrough from ContentAiFab (locked) / dynamic" },
  CodeConsole: { action: "hold", reason: "arbitrary h-[42%] — no finite token" },
  MockInterviewWorkspace: { action: "hold", reason: "hard-holds evidence only" },
  CvPdfPreview: { action: "hold", reason: "CvPreview-family; zero consumers" },
  InfoTooltip: { action: "hold", reason: "className lands on HeroUI Tooltip.Trigger — vendor boundary" },
  Composer: { action: "hold", reason: "pl-9 is thread indent chrome; needs indentLevel teacher axis" },
  MetricsInline: { action: "hold", reason: "text-xs text-muted mixes type+tone; bake risk without typography prop design" },
  IconTile: { action: "hold", reason: "size-5 text-accent mixes size+tone on IconTile which already has size" },
  BadgeImage: { action: "hold", reason: "dynamic cn() scale/opacity — ambiguous" },
  CourseHero: { action: "hold", reason: "grid col-start/row-start not on Grid API" },
  CoursePricingRail: { action: "hold", reason: "grid placement — no existing start prop" },
  ContentMap: { action: "hold", reason: "min-h-0 @app-lg:flex-1 — no exact existing flex-fill principle" },
  LeaderboardCategoryRail: { action: "hold", reason: "same flex-fill hold" },
  MilestoneOutline: { action: "hold", reason: "same flex-fill hold" },
  PlaygroundRagWorkspace: { action: "hold", reason: "h-full parent fill — hold without named fill wrapper" },
  ArchitectureRail: { action: "hold", reason: "flex-fill hold" },
  PracticeRail: { action: "hold", reason: "flex-fill hold" },
  OutlineRail: { action: "hold", reason: "needs value re-check / likely flex-fill" },
  CollapsibleSidebar: { action: "hold", reason: "multi-consumer / twin; not finite in wave 1" },
  SectionCard: { action: "hold", reason: "dynamic classNames passthrough" },
  TierCardBase: { action: "hold", reason: "mixed intrinsic tokens" },
  LeaderboardListCard: { action: "hold", reason: "dynamic" },
  Discussion: { action: "hold", reason: "dynamic passthrough" },
  ListRow: { action: "hold", reason: "multi-value / re-check" },
  LabeledList: { action: "hold", reason: "self-start — apply only if parent Box migration clean; deferred if twin risk" },
  TabsCard: { action: "hold", reason: "multi consumers" },
  SidebarNavItem: { action: "hold", reason: "multi consumers" },
  MpegDash: { action: "hold", reason: "media fill — re-check" },
  Standard: { action: "hold", reason: "media fill" },
  Youtube: { action: "hold", reason: "media fill" },
  CodeToHtml: { action: "hold", reason: "blockMy AllowedClassName — markdown spacing contract" },
  MermaidDiagram: { action: "hold", reason: "blockMy markdown spacing" },
  ButtonGroup: { action: "hold", reason: "composite twin; multi door" },
  RankDeltaCaret: { action: "hold", reason: "w-8 justify-end mixes width+align" },
  TierLevelIcon: { action: "hold", reason: "re-check consumers" },
  AmbientBackground: { action: "hold", reason: "layout shell" },
  PageHeader: { action: "hold", reason: "layout shell" },
  StickyBottomBar: { action: "hold", reason: "layout shell" },
}

const byWorker = Object.fromEntries(WORKERS.map((w) => [w, []]))
const owned = new Map()

for (const row of scan) {
  const w = row.worker
  const file = row.file
  if (owned.has(file)) {
    console.error("OVERLAP file", file, owned.get(file), w)
    process.exitCode = 1
  }
  owned.set(file, w)
  byWorker[w].push({
    component: row.component,
    file,
    plan: PLAN[row.component] || { action: "hold", reason: "not in wave-1 apply set" },
    consumerCount: row.consumerCount,
    valueSet: row.valueSet,
    ownerships: row.ownerships,
  })
}

// Also claim consumer files for apply targets under same worker (twin rule: declaration owns)
const manifests = {}
for (const w of WORKERS) {
  const entries = byWorker[w]
  const manifest = [...new Set(entries.map((e) => e.file))].sort()
  manifests[w] = {
    worker: w,
    manifest,
    candidates: entries,
  }
  fs.writeFileSync(path.join(ART, `2026-08-09-b28-manifest-${w}.json`), JSON.stringify(manifests[w], null, 2) + "\n")
}

fs.writeFileSync(path.join(ART, "2026-08-09-b28-plan.json"), JSON.stringify({ PLAN, manifests: Object.fromEntries(WORKERS.map((w) => [w, manifests[w].manifest])) }, null, 2) + "\n")

const apply = Object.entries(PLAN).filter(([, v]) => v.action.startsWith("apply"))
console.log(JSON.stringify({ workers: WORKERS.length, apply: apply.map(([k, v]) => k + ":" + v.action), hold: Object.entries(PLAN).filter(([, v]) => v.action === "hold").length, overlap: "pass" }, null, 2))
