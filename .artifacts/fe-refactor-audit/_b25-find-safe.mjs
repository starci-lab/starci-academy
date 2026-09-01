/**
 * BATCH 25 — find safe-noop and parent-placement call-site candidates.
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

const HOLD_COMPONENTS = new Set([
  "DrawerShell",
  "ShowcaseMockup",
  "SurfaceCard",
  "MiniCart",
  "CvPreview",
  "PDFView",
  "Box",
  "ModalShell",
  "Button",
  "Chip",
  "StackH",
  "StackV",
  "Grid",
])

const norm = (p) => String(p).replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

const uses = hits.filter((h) => /Do not pass/.test(h.msg) && !isLocked(h.file))

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "node_modules") continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const files = [...walk(path.join(ROOT, "src/components")), ...walk(path.join(ROOT, ".storybook/components"))]

/** Scan for empty / noop className(s) at JSX call sites. */
const safeNoop = []
const parentPlacementCandidates = []
const emptyPatterns = [
  /classNames=\{\s*\[\s*\]\s*\}/g,
  /classNames=\{\s*\}\s*/g,
  /className=\{\s*undefined\s*\}/g,
  /className=\{\s*""\s*\}/g,
  /className="\s*"/g,
  /classNames=\{\s*\[\s*""\s*\]\s*\}/g,
]

// Known exact principle mappings (class → principle token) — only when meaning is identical
const PRINCIPLE_MAP = {
  "gap-3": null, // too many principles use gap-3; need more context
  "gap-2": null,
  "gap-1": null,
  "gap-6": null,
  "p-6": "page-pad", // only if principle is padding page-pad
}

for (const abs of files) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  const rel = i >= 0 ? n.slice(i + 1) : n
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")

  for (const re of emptyPatterns) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text))) {
      const line = text.slice(0, m.index).split("\n").length
      // context window
      const start = Math.max(0, m.index - 120)
      const ctx = text.slice(start, m.index + m[0].length + 40)
      safeNoop.push({ file: rel, line, match: m[0], ctx: ctx.replace(/\s+/g, " ").slice(0, 160) })
    }
  }
}

// Also find classNames={undefined} / conditional that resolves empty
const conditionalEmpty = []
for (const abs of files) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  const rel = i >= 0 ? n.slice(i + 1) : n
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  const re = /classNames=\{\s*([^}]{1,80})\s*\}/g
  let m
  while ((m = re.exec(text))) {
    const expr = m[1].trim()
    if (
      expr === "undefined" ||
      expr === "null" ||
      /^[\w.]+\s*\?\s*\[\s*\]\s*:\s*undefined$/.test(expr) ||
      /^[\w.]+\s*\?\s*undefined\s*:\s*\[\s*\]$/.test(expr)
    ) {
      const line = text.slice(0, m.index).split("\n").length
      conditionalEmpty.push({ file: rel, line, expr })
    }
  }
}

// Usage hits that pass only shrink-0 / min-w-0 / w-full / self-* — common placement
// These are usually live parent-placement on Button/Stack — HOLD unless parent owns them.
const placementOnly = []
for (const h of uses) {
  const comp = (h.msg.match(/house component `(\w+)`/) || [])[1]
  if (HOLD_COMPONENTS.has(comp)) {
    placementOnly.push({ ...h, component: comp, classification: "live-prop" })
    continue
  }
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b25-candidates.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalHits: hits.length,
      useHitsEligible: uses.length,
      safeNoop,
      conditionalEmpty,
      livePropSample: placementOnly.slice(0, 30),
      note: "Only safeNoop/conditionalEmpty are eligible without new principles",
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      safeNoop: safeNoop.length,
      conditionalEmpty: conditionalEmpty.length,
      livePropHeld: placementOnly.length,
      noopSample: safeNoop.slice(0, 20),
      emptySample: conditionalEmpty.slice(0, 15),
    },
    null,
    2,
  ),
)
