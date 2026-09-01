/**
 * BATCH 25 — classify usage hits with surrounding JSX context.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const hits = JSON.parse(fs.readFileSync(path.join(ART, "_b25-classname-raw.json"), "utf8"))

const LOCKED_RE = [
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/resources\//,
  /\/(?:nivo|nivoexpert)\//i,
  /\/mia-mia\//i,
]

const LIVE_API = new Set([
  "Button",
  "Chip",
  "StackH",
  "StackV",
  "Stack",
  "Grid",
  "GridItem",
  "Box",
  "SurfaceCard",
  "SurfaceCardPressableGroupItem",
  "DrawerShell",
  "ModalShell",
  "ShowcaseMockup",
  "MiniCart",
  "CvPreview",
  "PDFView",
  "FieldFrame",
  "Spacer",
  "Divider",
])

const norm = (p) => String(p).replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

const uses = hits.filter((h) => /Do not pass/.test(h.msg))

function classifyWorker(file) {
  const f = norm(file)
  if (f.includes("/atoms/")) return "atoms"
  if (f.includes("/composites/")) return "composites"
  if (f.includes("/frames/")) return "frames"
  if (f.includes("/blocks/")) return "blocks"
  if (f.includes("/pages/")) {
    if (/\/(learn|learning|commerce|course|lesson|quiz|flashcard)/i.test(f))
      return "pages-learning-commerce"
    if (/\/(profile|dashboard)/i.test(f)) return "pages-profile-dashboard"
    return "pages-other"
  }
  // storybook-only if under .storybook and not mirrored paths above
  if (f.includes(".storybook/")) return "storybook-only"
  return "pages-other"
}

function extractPropValue(text, line1) {
  const lines = text.split("\n")
  const idx = line1 - 1
  // grab a window of lines around the hit
  const window = lines.slice(Math.max(0, idx - 2), Math.min(lines.length, idx + 8)).join("\n")
  // try to extract className= or classNames=
  const m =
    window.match(/classNames?=\{\s*([^}]{0,200})\s*\}/) ||
    window.match(/classNames?="([^"]*)"/) ||
    window.match(/classNames?=\{`([^`]*)`\}/)
  return { window: window.replace(/\s+/g, " ").slice(0, 240), value: m ? m[1] : null }
}

const classified = []
const byClass = {}
const byWorker = {}

for (const h of uses) {
  const file = norm(h.file)
  const abs = path.isAbsolute(h.file) ? h.file : path.join(ROOT, h.file)
  let text = ""
  try {
    text = fs.readFileSync(abs, "utf8")
  } catch {
    continue
  }
  const comp = (h.msg.match(/house component `(\w+)`/) || [])[1] || "?"
  const { window, value } = extractPropValue(text, h.line)
  let classification = "ambiguous"
  if (isLocked(file)) classification = "locked"
  else if (LIVE_API.has(comp)) classification = "live-prop"
  else if (/heroui|@heroui|HeroUI/i.test(window) || comp === "Box") classification = "vendor-boundary"
  else if (/teacher|Teacher/i.test(file)) classification = "teacher-hold"

  // Check for empty values
  if (
    value === "[]" ||
    value === "" ||
    value === "undefined" ||
    value === "null" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    classification = "safe-noop"
  }

  const worker = classifyWorker(file)
  const row = {
    file,
    line: h.line,
    component: comp,
    value,
    classification,
    worker,
    window,
  }
  classified.push(row)
  byClass[classification] = (byClass[classification] || 0) + 1
  byWorker[worker] = byWorker[worker] || { total: 0, byClass: {} }
  byWorker[worker].total++
  byWorker[worker].byClass[classification] =
    (byWorker[worker].byClass[classification] || 0) + 1
}

// Group values for non-live components — look for simple single-token placement
const simplePlacement = classified.filter((r) => {
  if (r.classification !== "ambiguous") return false
  if (!r.value) return false
  // single string literal-ish tokens
  const v = r.value.trim()
  if (/^["'`]?[a-z0-9_\[\]:.\-/]+["'`]?$/i.test(v)) return true
  if (/^\[\s*["'`][a-z0-9_\[\]:.\-/]+["'`]\s*\]$/i.test(v)) return true
  return false
})

// Count value frequencies for ambiguous simple
const valueFreq = {}
for (const r of simplePlacement) {
  const k = `${r.component} :: ${r.value}`
  valueFreq[k] = (valueFreq[k] || 0) + 1
}

const topValues = Object.entries(valueFreq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 40)

fs.writeFileSync(
  path.join(ART, "2026-08-09-b25-classified.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalUses: uses.length,
      byClass,
      byWorker,
      safeNoop: classified.filter((c) => c.classification === "safe-noop"),
      simplePlacementSample: simplePlacement.slice(0, 80),
      topValues,
      allAmbiguousFiles: [
        ...new Set(classified.filter((c) => c.classification === "ambiguous").map((c) => c.file)),
      ].sort(),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      byClass,
      byWorker,
      safeNoop: classified.filter((c) => c.classification === "safe-noop").length,
      ambiguous: byClass.ambiguous || 0,
      simplePlacement: simplePlacement.length,
      topValues: topValues.slice(0, 25),
      ambiguousFiles: [
        ...new Set(classified.filter((c) => c.classification === "ambiguous").map((c) => c.file)),
      ].length,
    },
    null,
    2,
  ),
)
