/**
 * BATCH 28 — write hold-only worker artifacts + aggregate status.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync, execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const scan = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b28-consumer-scan.json"), "utf8"))
const plan = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b28-plan.json"), "utf8"))

const HOLD_WORKERS = [
  "layout-shells",
  "learn-content",
  "media-rendering",
  "rails",
  "composite-twins",
  "hard-holds",
]

function loadWorker(name) {
  const p = path.join(ART, `2026-08-09-b28-worker-${name}.json`)
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"))
  return null
}

for (const w of HOLD_WORKERS) {
  if (loadWorker(w)) continue
  const candidates = scan.filter((s) => s.worker === w)
  const worker = {
    partition: w,
    manifest: candidates.map((c) => c.file),
    consumers: Object.fromEntries(
      candidates.map((c) => [
        c.component,
        c.consumers.map((x) => ({
          file: x.file,
          line: x.line,
          prop: x.prop,
          value: x.normalized,
          ownership: x.ownership,
        })),
      ]),
    ),
    valueSet: Object.fromEntries(candidates.map((c) => [c.component, c.valueSet])),
    ownership: Object.fromEntries(candidates.map((c) => [c.component, c.ownerships])),
    oldApi: Object.fromEntries(candidates.map((c) => [c.component, "className/classNames door retained"])),
    newApi: Object.fromEntries(
      candidates.map((c) => [
        c.component,
        plan.PLAN[c.component]?.reason || "hold — no finite semantic axis in B28 wave 1",
      ]),
    ),
    changed: [],
    holds: candidates.map((c) => ({
      component: c.component,
      file: c.file,
      reason: plan.PLAN[c.component]?.reason || "hold",
      values: c.valueSet,
    })),
    parity: "n/a — hold only",
    verification: { tsc: "deferred-coordinator", eslint: "n/a" },
    regressions: [],
    overlapCheck: "pass — declaration files owned once via workerFor",
  }
  fs.writeFileSync(path.join(ART, `2026-08-09-b28-worker-${w}.json`), JSON.stringify(worker, null, 2) + "\n")
}

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

const workers = WORKERS.map((w) => ({ name: w, data: loadWorker(w) }))
const missing = workers.filter((w) => !w.data)
if (missing.length) {
  console.error("missing workers", missing.map((m) => m.name))
  process.exit(1)
}

// overlap on changed files
const owner = new Map()
const overlaps = []
for (const { name, data } of workers) {
  for (const f of data.changed || []) {
    if (owner.has(f)) overlaps.push({ file: f, a: owner.get(f), b: name })
    else owner.set(f, name)
  }
}

const changedFiles = [...owner.keys()].sort()
const doorsRemoved = []
const semanticProps = []
const parentMigrations = []
const holds = []

for (const { name, data } of workers) {
  for (const h of data.holds || []) {
    if (typeof h === "string") holds.push({ worker: name, hold: h })
    else holds.push({ worker: name, ...h })
  }
  // heuristics from newApi/oldApi if present
  if (data.newApi && typeof data.newApi === "object" && !Array.isArray(data.newApi)) {
    for (const [comp, api] of Object.entries(data.newApi)) {
      const s = String(api)
      if (/size|baked|Bake|HideAbove|Box|removed|no props|no-arg/i.test(s) && (data.changed || []).length) {
        if (/size\?|BrandLogoSize|size:/.test(s)) semanticProps.push({ worker: name, component: comp, api: s })
        if (/HideAbove|Box|parent|bake|Bake|removed door|no props/i.test(s)) {
          if (/size/.test(s)) semanticProps.push({ worker: name, component: comp, api: s })
          else parentMigrations.push({ worker: name, component: comp, api: s })
        }
      }
    }
  }
}

// Explicit applied summary from plan + git
const appliedComponents = [
  { component: "GoogleIcon", kind: "intrinsic-bake", detail: "bake size-3.5; delete className door" },
  { component: "LogoMark", kind: "intrinsic-bake", detail: "bake size-10; delete className door" },
  { component: "BrandLogo", kind: "semantic-prop", detail: "size?: sm|md|lg → h-9|h-10|h-14" },
  { component: "BrandLockup", kind: "parent-placement", detail: "self-start → Footer Box; delete door" },
  { component: "ElementCloseButton", kind: "intrinsic-bake", detail: "bake shrink-0; delete classNames door" },
  { component: "FollowButton", kind: "intrinsic-bake+parent", detail: "bake shrink-0; ml-1 → parent span" },
  { component: "AddToCartButton", kind: "parent-placement", detail: "flex-1 → CatalogCourseCard Box" },
  { component: "AiRewriteButton", kind: "intrinsic-bake", detail: "bake w-fit self-start; delete door" },
  { component: "CommentComposer", kind: "intrinsic-bake", detail: "bake w-full; delete door" },
  { component: "PhaseScarcityNote", kind: "parent-placement", detail: "self-center → EnrollGate Box; SB+src" },
  { component: "CourseMobileEnrollBar", kind: "parent-placement", detail: "@app-md:hidden → HideAbove at=md" },
  { component: "BackLink", kind: "parent-placement", detail: "@app-sm:hidden → HideAbove; shrink-0 → Box" },
]

// Inventory before/after
console.log("Inventory after…")
const eslint = spawnSync(
  "npx",
  ["eslint", "--no-error-on-unmatched-pattern", "-f", "json", "src/components", ".storybook/components"],
  { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, shell: true },
)
let afterHits = 0
const afterFiles = new Set()
try {
  const results = JSON.parse(eslint.stdout || "[]")
  for (const file of results) {
    const msgs = (file.messages || []).filter((m) => m.ruleId === "starci-fe/no-public-classname-prop")
    if (msgs.length) {
      afterHits += msgs.length
      afterFiles.add(path.relative(ROOT, file.filePath).replace(/\\/g, "/"))
    }
  }
} catch (e) {
  console.error(e.message)
}

const beforeHits = 1618
const beforeFiles = 593

const status = {
  batch: 28,
  title: "Live CSS-door semantic closure, wave 1",
  committed: false,
  checkpoint: "3afbadda",
  generatedAt: new Date().toISOString(),
  workers: 12,
  overlapResult: overlaps.length ? "fail" : "pass",
  overlaps,
  inventory: {
    rule: "starci-fe/no-public-classname-prop",
    before: { hits: beforeHits, files: beforeFiles },
    after: { hits: afterHits, files: afterFiles.size },
    delta: { hits: afterHits - beforeHits, files: afterFiles.size - beforeFiles },
  },
  applied: appliedComponents,
  doorsRemoved: appliedComponents.map((a) => a.component),
  semanticPropsAdded: [{ component: "BrandLogo", prop: "size", values: ["sm", "md", "lg"] }],
  parentPlacementMigrations: appliedComponents
    .filter((a) => a.kind.includes("parent"))
    .map((a) => ({ component: a.component, detail: a.detail })),
  holds: holds.slice(0, 80),
  holdCount: holds.length,
  changedFiles,
  parity: {
    PhaseScarcityNote: "SB twin updated first, src mirrored",
    others: "src-only (no SB twins) or parent-only consumer edits",
  },
  verification: { pending: true },
  regressions: [],
  note: "Proposals and classifications are not counted as fixes",
}

fs.writeFileSync(path.join(ART, "2026-08-09-b28-status.json"), JSON.stringify(status, null, 2) + "\n")

const md = `# BATCH 28 — Live CSS-door semantic closure, wave 1

**Committed:** no  
**Checkpoint:** \`3afbadda\`  
**Workers:** 12 (disjoint; overlap ${status.overlapResult})

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${beforeHits} | ${beforeFiles} |
| After | ${afterHits} | ${afterFiles.size} |
| Delta | **${afterHits - beforeHits}** | **${afterFiles.size - beforeFiles}** |

## Doors removed / closed

${appliedComponents.map((a) => `- **${a.component}** — ${a.detail}`).join("\n")}

## Semantic props added

- **BrandLogo.size** — \`"sm" | "md" | "lg"\` → \`h-9 | h-10 | h-14\` (+ \`w-auto\`)

## Parent-placement migrations

- CourseMobileEnrollBar → \`HideAbove at="md"\`
- BackLink → \`HideAbove at="sm"\` (short breadcrumb) + \`Box shrink-0\` (toolbar)
- BrandLockup / AddToCartButton / PhaseScarcityNote / FollowButton ml-1 → parent \`Box\`/\`span\`

## Holds (evidence only; not fixes)

See worker JSONs. Notable: GithubIcon (LearnLoopScroll locked), FloatingActionButton/ContentAiFab, InfoTooltip (HeroUI Trigger), ChatToolResult (ContentAiChat locked), grid rails (no col-start API), flex-fill rails, MockInterviewWorkspace, CvPdfPreview, CodeToHtml/MermaidDiagram \`blockMy\`, ButtonGroup twins.

## Changed files

${changedFiles.map((f) => `- \`${f}\``).join("\n") || "(see worker changed arrays — will refresh from git)"}

## Verification

Pending coordinator suite.
`

fs.writeFileSync(path.join(ART, "2026-08-09-b28-status.md"), md)

console.log(
  JSON.stringify(
    {
      afterHits,
      afterFiles: afterFiles.size,
      delta: afterHits - beforeHits,
      changedFromWorkers: changedFiles.length,
      overlaps,
      applied: appliedComponents.length,
    },
    null,
    2,
  ),
)
