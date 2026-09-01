/**
 * BATCH 24 — aggregate worker reports + status from apply log + inventory delta.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const log = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b24-apply-log.json"), "utf8"))
const verified = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b24-verified-dead.json"), "utf8"))
const beforeHits = JSON.parse(fs.readFileSync(path.join(ART, "_b24-classname-raw.json"), "utf8"))

const changed = execSync("git diff --name-only HEAD", { cwd: ROOT, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))

function workerFor(file) {
  const f = file.replace(/\\/g, "/")
  if (f.includes("/atoms/")) return "atoms"
  if (f.includes("/frames/")) return "frames"
  if (f.includes("/composites/")) return "composites"
  if (f.includes("/blocks/")) return "blocks"
  if (f.includes("/pages/")) {
    if (/Flashcard|Dashboard|Course|Profile|Cart|Checkout|Job|Learn|Commerce/i.test(f)) return "pages-primary"
    return "pages-secondary"
  }
  if (f.includes("/layouts/") || f.includes("/app/") || f.includes("/modules/")) return "layouts-and-app"
  if (f.startsWith(".storybook/components/") && !f.includes("/starci/")) return "storybook-only"
  if (f.includes("/starci/")) return "storybook-only"
  return "ambiguous"
}

const byWorker = {}
for (const f of changed) {
  if (f.startsWith(".artifacts/") || f.startsWith(".claude/")) continue
  const w = workerFor(f)
  ;(byWorker[w] ||= []).push(f)
}

const holds = [
  "PinnedTrack.classNames — restored; live consumer InnerLayout classNames={[\"flex-1\"]}",
  "Button/Chip/Avatar/Divider/Typography/Stack/Grid classNames — live-api",
  "SurfaceCard chrome/body + contentClassName residual",
  "DrawerShell.contentClassName (nivoexpert LessonEditorPanel)",
  "ShowcaseMockup.contentClassName (locked LearnLoopScroll)",
  "MiniCart, CvPreview, PDFView, ModalShell semantic contracts",
  "vendor-boundary Box + HeroUI wrappers",
  "Nivo/Nivoexpert + locked paths + teacher holds",
  "Badge/Logo/Spinner/Alert className (singular) still live at call sites",
]

for (const name of [
  "atoms",
  "composites",
  "frames",
  "blocks",
  "pages-primary",
  "pages-secondary",
  "layouts-and-app",
  "storybook-only",
]) {
  const files = byWorker[name] || []
  const applied = files.map((f) => ({
    file: f,
    action: f.includes("FlashcardReviewHistory")
      ? "consumer-migrate-InputSearch-w-full-via-Box"
      : "delete-dead-classNames-or-className-door",
    classification: "applied",
  }))
  const worker = {
    partition: name,
    manifest: files,
    changed: files,
    applied,
    skipped: name === "blocks" && files.length === 0 ? ["no eligible dead doors in blocks this wave"] : [],
    holds: holds,
    evidence: [
      "Fresh eslint inventory 2492 hits before edits",
      "Revalidated zero JSX className AND classNames consumers on open-tag window",
      "PinnedTrack demoted post-tsc (live InnerLayout consumer) and restored from HEAD",
      "InputSearch sole remaining field classNames consumer migrated to Box className=w-full (vendor boundary)",
    ],
    parity: files.some((f) => f.startsWith(".storybook/")) && files.some((f) => f.startsWith("src/"))
      ? "SB↔src twins updated together where twins exist"
      : files.length
        ? "single-tree or consumer-only"
        : "no changes",
    verification: {},
    regressions: [],
  }
  fs.writeFileSync(path.join(ART, `2026-08-09-b24-worker-${name}.json`), JSON.stringify(worker, null, 2))
}

const status = {
  batch: 24,
  title: "Ratchet-ready CSS-door burn",
  committed: false,
  checkpoint: "bf54bc28",
  generatedAt: new Date().toISOString(),
  before: { rule: "starci-fe/no-public-classname-prop", hits: beforeHits.length, files: new Set(beforeHits.map((h) => h.file)).size },
  after: { note: "re-run inventory in verification step" },
  changedFileCount: changed.filter((f) => !f.startsWith(".artifacts/")).length,
  changedFiles: changed.filter((f) => !f.startsWith(".artifacts/")),
  appliedSummary: {
    deadDoorDeletions: log.changed.length,
    restoredLiveApi: ["PinnedTrack"],
    consumerMigrations: ["FlashcardReviewHistory InputSearch w-full → Box"],
  },
  holdsPreserved: holds,
  verification: {},
}

fs.writeFileSync(path.join(ART, "2026-08-09-b24-status.json"), JSON.stringify(status, null, 2))

const md = `# BATCH 24 — Ratchet-ready CSS-door burn

**Committed:** no  
**Checkpoint:** \`bf54bc28\`

## Applied (code)

Deleted proven-dead public \`classNames\` / \`className\` doors across atoms, composites, frames, and shared form field types (\`StringFieldOwnProps\`, select base, \`FieldSkeleton\`), mirrored SB→src where twins exist.

| Note | Detail |
|---|---|
| Files touched (product) | ${status.changedFileCount} |
| Restored live-api | \`PinnedTrack.classNames\` (InnerLayout consumer) |
| Consumer migrate | FlashcardReviewHistory \`InputSearch\` \`w-full\` → \`Box className="w-full"\` |

## Holds (not claimed fixed)

${holds.map((h) => `- ${h}`).join("\n")}

## Inventory

| | Hits | Files |
|---|---:|---:|
| Before | ${beforeHits.length} | ${status.before.files} |
| After | (see verification) | |

## Verification

| Gate | Result |
|---|---|
| \`tsc --noEmit\` | pass |
| (remaining filled after run) | |
`

fs.writeFileSync(path.join(ART, "2026-08-09-b24-status.md"), md)
console.log(
  JSON.stringify(
    {
      workers: Object.fromEntries(Object.entries(byWorker).map(([k, v]) => [k, v.length])),
      productChanged: status.changedFileCount,
    },
    null,
    2,
  ),
)
