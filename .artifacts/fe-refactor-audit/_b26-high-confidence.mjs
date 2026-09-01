/**
 * BATCH 26 — high-confidence dead doors:
 * WithClassNames / className(s) in props type, but export does NOT destructure
 * the prop, AND zero JSX consumers pass it.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const proven = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b26-proven.json"), "utf8"))

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
  /\/MiniCart\b/,
  /\/CvPreview\b/,
  /\/PDFView\b/,
  /\/DrawerShell\b/,
  /\/ShowcaseMockup\b/,
]

const HOLD_COMP = new Set([
  "Button",
  "Chip",
  "Stack",
  "StackH",
  "StackV",
  "Grid",
  "GridItem",
  "Box",
  "SurfaceCard",
  "Typography",
  "Skeleton",
  "FieldFrame",
  "ModalShell",
  "Avatar",
  "UserAvatar",
  "PinnedTrack",
  "Cluster",
  "SurfaceListCard", // live placement in B24 restore path adjacency — verify carefully
])

const norm = (p) => String(p).replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (["node_modules", "dist", ".next"].includes(ent.name)) continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const allTsx = [
  ...walk(path.join(ROOT, "src")),
  ...walk(path.join(ROOT, ".storybook")),
].filter((p) => /\.(tsx|ts)$/.test(p))

function findConsumers(compName, prop) {
  const consumers = []
  const multiRe = new RegExp(`<${compName}\\b[\\s\\S]{0,350}?${prop}\\s*=`, "g")
  for (const abs of allTsx) {
    const n = norm(abs)
    const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
    const rel = i >= 0 ? n.slice(i + 1) : n
    if (isLocked(rel)) continue
    const text = fs.readFileSync(abs, "utf8")
    if (!text.includes(`<${compName}`)) continue
    // skip definition
    if (new RegExp(`export\\s+(const|function)\\s+${compName}\\b`).test(text) && !text.includes(`<${compName}`))
      continue
    multiRe.lastIndex = 0
    let m
    while ((m = multiRe.exec(text))) {
      consumers.push({
        file: rel,
        line: text.slice(0, m.index).split("\n").length,
        snippet: m[0].replace(/\s+/g, " ").slice(0, 140),
      })
    }
  }
  return consumers
}

function analyzeFile(rel) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) return null
  if (isLocked(rel)) return null
  const text = fs.readFileSync(abs, "utf8")
  const name =
    path.basename(rel) === "index.tsx" || path.basename(rel) === "index.ts"
      ? path.basename(path.dirname(rel))
      : path.basename(rel).replace(/\.(tsx|ts)$/, "")
  if (HOLD_COMP.has(name)) return { name, hold: true, reason: "live-api-hold-list" }

  const hasWith = /WithClassNames/.test(text)
  const hasClassNamesType = /\bclassNames\??\s*:/.test(text) || hasWith
  const hasClassNameType = /\bclassName\??\s*:/.test(text) || hasWith

  // Find main export destructure
  const exportFn =
    text.match(
      new RegExp(
        `export\\s+const\\s+${name}\\s*=\\s*(?:\\w+\\s*)?\\(\\s*\\{([^}]*)\\}`,
        "m",
      ),
    ) ||
    text.match(
      new RegExp(`export\\s+function\\s+${name}\\s*\\(\\s*\\{([^}]*)\\}`, "m"),
    ) ||
    text.match(/export\s+const\s+\w+\s*=\s*\(\s*\{([^}]*)\}/)

  const dest = exportFn ? exportFn[1] : ""
  const destHasClassNames = /\bclassNames\b/.test(dest)
  const destHasClassName = /\bclassName\b/.test(dest)

  const results = []
  for (const prop of ["classNames", "className"]) {
    const typed = prop === "classNames" ? hasClassNamesType : hasClassNameType
    if (!typed) continue
    // If only WithClassNames and the other prop — still both typed
    if (!hasWith && !new RegExp(`\\b${prop}\\??\\s*:`).test(text) && !new RegExp(`\\b${prop}\\b`).test(text))
      continue

    const destHas = prop === "classNames" ? destHasClassNames : destHasClassName
    const consumers = findConsumers(name, prop)

    // High confidence: typed, NOT destructured, zero consumers → delete door
    if (!destHas && consumers.length === 0) {
      results.push({
        kind: "dead-door",
        file: rel,
        component: name,
        prop,
        dest,
        consumers: 0,
        action: "remove-prop-from-type",
      })
    }
    // High confidence: typed, NOT destructured, has consumers → remove call-site props only; then door
    else if (!destHas && consumers.length > 0) {
      results.push({
        kind: "ignored-passthrough",
        file: rel,
        component: name,
        prop,
        dest,
        consumers: consumers.length,
        consumerList: consumers.slice(0, 15),
        action: "remove-call-sites-then-door",
      })
    }
  }
  return { name, results, dest, hasWith }
}

// Seed from previous appliable + ignored, unique files
const seedFiles = [
  ...new Set([
    ...proven.appliable.map((a) => a.file),
    ...proven.appliable
      .filter((a) => a.twin)
      .map((a) => a.twin),
  ]),
]

const highConfidence = []
const held = []
for (const file of seedFiles) {
  if (isLocked(file)) {
    held.push({ file, reason: "locked" })
    continue
  }
  const analysis = analyzeFile(file)
  if (!analysis) continue
  if (analysis.hold) {
    held.push({ file, reason: analysis.reason })
    continue
  }
  for (const r of analysis.results || []) highConfidence.push(r)
}

// Also scan ALL product files for WithClassNames + not destructured (broader)
const product = [
  ...walk(path.join(ROOT, "src/components")),
  ...walk(path.join(ROOT, ".storybook/components")),
].filter((p) => /\.(tsx|ts)$/.test(p) && !p.includes(".stories."))

const broader = []
for (const abs of product) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  const rel = i >= 0 ? n.slice(i + 1) : n
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  if (!/WithClassNames/.test(text) && !/\bclassNames\??\s*:/.test(text)) continue
  const analysis = analyzeFile(rel)
  if (!analysis || analysis.hold) continue
  for (const r of analysis.results || []) {
    if (!highConfidence.some((h) => h.file === r.file && h.prop === r.prop)) {
      broader.push(r)
    }
  }
}

const all = [...highConfidence, ...broader]
const deadDoors = all.filter((a) => a.kind === "dead-door")
const ignored = all.filter((a) => a.kind === "ignored-passthrough")

fs.writeFileSync(
  path.join(ART, "2026-08-09-b26-high-confidence.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      deadDoors: deadDoors.length,
      ignoredPassthrough: ignored.length,
      deadDoorsList: deadDoors,
      ignoredList: ignored,
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      deadDoors: deadDoors.length,
      ignored: ignored.length,
      ignoredDetail: ignored,
      deadSample: deadDoors.slice(0, 50).map((d) => ({
        file: d.file,
        prop: d.prop,
        component: d.component,
      })),
    },
    null,
    2,
  ),
)
