/**
 * BATCH 26 coordinator — fresh inventory + classify + candidate scan.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
fs.mkdirSync(ART, { recursive: true })

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
  "Typography",
  "Skeleton",
  "Avatar",
  "UserAvatar",
  "ProgressMeter",
  "TitledText",
  "EmptyState",
  "SimpleEmptyState",
  "EnumChip",
  "SurfaceListCard",
  "LabeledCard",
  "PinnedTrack",
  "Cluster",
  "ResizableRail",
  "DragScrollArea",
])

const HOLD_CONTRACT = [
  /MiniCart/,
  /CvPreview/,
  /PDFView/,
  /DrawerShell/,
  /ShowcaseMockup/,
  /LearnLoopScroll/,
  /LessonEditorPanel/,
]

const norm = (p) => String(p).replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))
const isHoldContract = (p) => HOLD_CONTRACT.some((r) => r.test(norm(p)))

console.log("Running eslint inventory…")
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
  { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, shell: true },
)

let hits = []
try {
  const results = JSON.parse(eslint.stdout || "[]")
  for (const file of results) {
    for (const m of file.messages || []) {
      if (m.ruleId === "starci-fe/no-public-classname-prop") {
        hits.push({
          file: path.relative(ROOT, file.filePath).replace(/\\/g, "/"),
          line: m.line,
          column: m.column,
          msg: m.message,
          severity: m.severity,
        })
      }
    }
  }
} catch (e) {
  console.error("parse fail", e.message, (eslint.stderr || "").slice(0, 400))
  process.exit(1)
}

fs.writeFileSync(path.join(ART, "_b26-classname-raw.json"), JSON.stringify(hits, null, 2))

const uses = hits.filter((h) => /Do not pass/.test(h.msg))
const decls = hits.filter((h) => !/Do not pass/.test(h.msg))

function extractValue(abs, line1) {
  try {
    const text = fs.readFileSync(abs, "utf8")
    const lines = text.split("\n")
    const window = lines.slice(Math.max(0, line1 - 3), Math.min(lines.length, line1 + 6)).join("\n")
    const m =
      window.match(/classNames?=\{\s*([^}]{0,200})\s*\}/) ||
      window.match(/classNames?="([^"]*)"/) ||
      window.match(/classNames?=\{`([^`]*)`\}/)
    return { window: window.replace(/\s+/g, " ").slice(0, 220), value: m ? m[1] : null, text }
  } catch {
    return { window: "", value: null, text: "" }
  }
}

function classifyHit(h) {
  const file = norm(h.file)
  const abs = path.join(ROOT, h.file)
  const comp = (h.msg.match(/house component `(\w+)`/) || h.msg.match(/`(\w+)`/) || [])[1] || "?"
  const isUse = /Do not pass/.test(h.msg)
  const { window, value, text } = isUse ? extractValue(abs, h.line) : { window: "", value: null, text: "" }

  let classification = "ambiguous"
  if (isLocked(file) || isHoldContract(file)) classification = "locked"
  else if (/teacher|Teacher/i.test(file) && /hold/i.test(h.msg)) classification = "teacher-hold"
  else if (LIVE_API.has(comp) || /Public house component prop/.test(h.msg) || /WithClassNames/.test(h.msg)) {
    // declarations of live APIs
    if (!isUse && (LIVE_API.has(comp) || /WithClassNames|classNames\??:|className\??:/.test(h.msg))) {
      classification = "live-api"
    } else if (isUse && LIVE_API.has(comp)) {
      classification = "live-api"
    } else if (!isUse) {
      classification = "live-api" // default for public prop decls until proven dead
    }
  }

  // Empty / noop values at call sites
  if (
    isUse &&
    (value === "[]" ||
      value === "" ||
      value === "undefined" ||
      value === "null" ||
      (typeof value === "string" && value.trim() === '""') ||
      (typeof value === "string" && /^\[\s*\]$/.test(value.trim())) ||
      (typeof value === "string" && /^\[\s*""\s*\]$/.test(value.trim())))
  ) {
    classification = "safe-noop"
  }

  // Vendor
  if (comp === "Box" || /@heroui/.test(window)) {
    if (classification === "ambiguous" || classification === "live-api") {
      if (comp === "Box") classification = "vendor-boundary"
    }
  }

  return {
    file,
    line: h.line,
    msg: h.msg,
    component: comp,
    isUse,
    value,
    window,
    classification,
  }
}

const classified = hits.map(classifyHit)
const byClass = {}
for (const c of classified) byClass[c.classification] = (byClass[c.classification] || 0) + 1

// Dead passthrough scan: WithClassNames / className in props but never used in body
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (["node_modules", "dist", ".next"].includes(ent.name)) continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name) && !ent.name.includes(".stories.")) out.push(p)
  }
  return out
}

const productFiles = [
  ...walk(path.join(ROOT, ".storybook/components")),
  ...walk(path.join(ROOT, "src/components")),
]

const deadPassthroughCandidates = []
for (const abs of productFiles) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  const rel = i >= 0 ? n.slice(i + 1) : n
  if (isLocked(rel) || isHoldContract(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  if (!/\bclassNames?\??\s*:/.test(text) && !/WithClassNames/.test(text)) continue

  // Skip known live API files by basename component folder
  const base = path.basename(path.dirname(abs))
  if (LIVE_API.has(base)) continue

  const stripped = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/interface\s+\w+[^{]*\{[\s\S]*?\}/g, "")
    .replace(/type\s+\w+[^=]*=[\s\S]*?(?=\n(?:export|type|const|function|interface))/g, "")

  for (const prop of ["classNames", "className"]) {
    if (!new RegExp(`\\b${prop}\\b`).test(text)) continue
    const exprUses = (stripped.match(new RegExp(`\\b${prop}\\b`, "g")) || []).length
    // Heuristic: ≤1 means only destructure leftover or type-only — verify manually
    if (exprUses <= 1 && /WithClassNames|classNames\??:|className\??:/.test(text)) {
      // Check if prop appears in destructure of export
      if (
        new RegExp(`\\{\\s*[^}]*\\b${prop}\\b`).test(text) ||
        /WithClassNames/.test(text)
      ) {
        deadPassthroughCandidates.push({ file: rel, prop, exprUses })
      }
    }
  }
}

// Duplicate Typography isSkeleton w-1/2 (should be 0 after B25)
const typoDupes = []
for (const abs of productFiles) {
  const text = fs.readFileSync(abs, "utf8")
  const lines = text.split("\n")
  lines.forEach((line, idx) => {
    if (line.includes("isSkeleton") && /classNames=\{\["w-1\/2"\]\}/.test(line)) {
      const n = norm(abs)
      const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
      typoDupes.push({ file: i >= 0 ? n.slice(i + 1) : n, line: idx + 1 })
    }
  })
}

// Empty className patterns
const emptyPatterns = []
const emptyRes = [
  /classNames=\{\s*\[\s*\]\s*\}/g,
  /className=\{\s*undefined\s*\}/g,
  /className="\s*"/g,
  /classNames=\{\s*undefined\s*\}/g,
]
for (const abs of productFiles) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  const rel = i >= 0 ? n.slice(i + 1) : n
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  for (const re of emptyRes) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text))) {
      emptyPatterns.push({
        file: rel,
        match: m[0],
        line: text.slice(0, m.index).split("\n").length,
      })
    }
  }
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b26-classified.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalHits: hits.length,
      useHits: uses.length,
      declHits: decls.length,
      files: new Set(hits.map((h) => h.file)).size,
      byClass,
      safeNoop: classified.filter((c) => c.classification === "safe-noop"),
      emptyPatterns,
      typoDupes,
      deadPassthroughCandidates: deadPassthroughCandidates.slice(0, 80),
      deadPassthroughCount: deadPassthroughCandidates.length,
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      totalHits: hits.length,
      files: new Set(hits.map((h) => h.file)).size,
      uses: uses.length,
      decls: decls.length,
      byClass,
      safeNoop: classified.filter((c) => c.classification === "safe-noop").length,
      emptyPatterns: emptyPatterns.length,
      typoDupes: typoDupes.length,
      deadPassthrough: deadPassthroughCandidates.length,
      deadSample: deadPassthroughCandidates.slice(0, 25),
      emptySample: emptyPatterns.slice(0, 15),
    },
    null,
    2,
  ),
)
