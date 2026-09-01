/**
 * BATCH 27 — fresh inventory + classification + dead-door candidates.
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
  /\/ContentAiFab\b/,
  /\/ArchitectureScene\b/,
  /\/resources\//,
  /\/(?:nivo|nivoexpert)\//i,
  /\/mia-mia\//i,
  /\/MiniCart\b/,
  /\/CvPreview\b/,
  /\/PDFView\b/,
  /\/DrawerShell\b/,
  /\/ShowcaseMockup\b/,
  /\/LessonEditorPanel\b/,
]

const LIVE_KNOWN = new Set([
  "Button",
  "Chip",
  "Stack",
  "StackH",
  "StackV",
  "Grid",
  "GridItem",
  "Box",
  "SurfaceCard",
  "SurfaceCardPressableGroupItem",
  "Typography",
  "Skeleton",
  "FieldFrame",
  "ModalShell",
  "Avatar",
  "UserAvatar",
  "PinnedTrack",
  "Cluster",
  "Spacer",
  "Divider",
  "ProgressMeter",
  "TitledText",
  "EmptyState",
  "SimpleEmptyState",
  "EnumChip",
  "SurfaceListCard",
  "LabeledCard",
  "PressableCard",
  "DragScrollArea",
  "ResizableRail",
  "Logo",
  "Spinner",
  "EntityLink",
  "GithubLinkGate",
])

const norm = (p) => String(p).replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

console.log("Running eslint inventory…")
const eslint = spawnSync(
  "npx",
  ["eslint", "--no-error-on-unmatched-pattern", "-f", "json", "src/components", ".storybook/components"],
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
          msg: m.message,
        })
      }
    }
  }
} catch (e) {
  console.error("parse fail", e.message, (eslint.stderr || "").slice(0, 400))
  process.exit(1)
}

fs.writeFileSync(path.join(ART, "_b27-classname-raw.json"), JSON.stringify(hits, null, 2))

const uses = hits.filter((h) => /Do not pass/.test(h.msg))
const decls = hits.filter((h) => !/Do not pass/.test(h.msg))

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

function relOf(abs) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  return i >= 0 ? n.slice(i + 1) : n
}

function extractBalanced(text, start) {
  let i = start
  while (i < text.length && /\s/.test(text[i])) i++
  if (text[i] !== "{") return null
  let depth = 0
  const from = i
  for (; i < text.length; i++) {
    if (text[i] === "{") depth++
    else if (text[i] === "}") {
      depth--
      if (depth === 0) return { start: from, end: i, body: text.slice(from + 1, i) }
    }
  }
  return null
}

function findExportDestructure(text, name) {
  const re = new RegExp(String.raw`export\s+const\s+${name}\s*=\s*(?:\w+\s*)?\(`)
  const m = re.exec(text)
  if (!m) return null
  return extractBalanced(text, m.index + m[0].length)
}

// Build usage index across ALL trees (locked still count as consumers)
const allTsx = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook"))].filter((p) =>
  /\.(tsx|ts)$/.test(p),
)
const usageIndex = new Map()
const openTagRe = /<([A-Z][A-Za-z0-9]*)\b/g
for (const abs of allTsx) {
  const rel = relOf(abs)
  const text = fs.readFileSync(abs, "utf8")
  openTagRe.lastIndex = 0
  let m
  while ((m = openTagRe.exec(text))) {
    const comp = m[1]
    const slice = text.slice(m.index, m.index + 500)
    const close = slice.search(/\/?>/)
    const tag = close >= 0 ? slice.slice(0, close + 1) : slice
    for (const prop of ["classNames", "className"]) {
      if (new RegExp(`\\b${prop}\\s*=`).test(tag)) {
        if (!usageIndex.has(comp)) usageIndex.set(comp, [])
        usageIndex.get(comp).push({
          file: rel,
          prop,
          line: text.slice(0, m.index).split("\n").length,
          snippet: tag.replace(/\s+/g, " ").slice(0, 120),
        })
      }
    }
  }
}

function classifyWorker(file) {
  const f = norm(file)
  if (f.includes("/blocks/")) {
    if (/\/(auth|commerce|careers)\//.test(f)) return "blocks-auth-commerce"
    if (/\/(community|feed)\//.test(f)) return "blocks-community-feed"
    if (/\/(cv|grading)\//.test(f)) return "blocks-cv-grading"
    if (/\/(learn|practice|flashcards|code)\//.test(f)) return "blocks-learn-practice"
    if (/\/(layout|layouts|navigation|media|overlays)\//.test(f)) return "blocks-layout-navigation-media"
    if (/\/(profile|stats|marketing|dashboard)\//.test(f)) return "blocks-profile-stats-marketing"
    return "blocks-layout-navigation-media"
  }
  if (f.includes("/layouts/") || f.includes("/overlays/")) return "layouts-and-overlays"
  if (f.includes("/pages/")) {
    if (/\/(Dashboard|Learn|Learning|Course|Flashcard|Practice|CommunityFeed)/i.test(f))
      return "pages-dashboard-learning"
    return "pages-profile-admin-other"
  }
  return "storybook-only-and-residual"
}

function twinOf(rel, name) {
  if (rel.startsWith(".storybook/components/")) {
    let rest = rel.replace(/^\.storybook\/components\//, "").replace(/\/[^/]+\.(tsx|ts)$/, "")
    rest = rest.replace(/^starci\//, "")
    for (const c of [`src/components/${rest}/index.tsx`, `src/components/${rest}/${name}.tsx`]) {
      if (fs.existsSync(path.join(ROOT, c))) return c
    }
  } else if (rel.startsWith("src/components/")) {
    let rest = rel.replace(/^src\/components\//, "").replace(/\/index\.(tsx|ts)$/, "")
    for (const c of [
      `.storybook/components/${rest}/${name}.tsx`,
      `.storybook/components/starci/${rest}/${name}.tsx`,
    ]) {
      if (fs.existsSync(path.join(ROOT, c))) return c
    }
  }
  return null
}

// Classify each hit
const classified = []
const byClass = {}
for (const h of hits) {
  const file = norm(h.file)
  const isUse = /Do not pass/.test(h.msg)
  const comp =
    (h.msg.match(/house component `(\w+)`/) || h.msg.match(/`(\w+)`/) || [])[1] || "?"
  let classification = "ambiguous"
  if (isLocked(file)) classification = "locked"
  else if (comp === "Box" || /HeroUI|@heroui/i.test(h.msg)) classification = "vendor-boundary"
  else if (LIVE_KNOWN.has(comp)) classification = "live-api"
  else if (/Public house component prop|WithClassNames|classNames\??:|className\??:/.test(h.msg)) {
    classification = isUse ? "live-api" : "live-api" // default until proven dead
  } else if (isUse) {
    classification = "live-api"
  }
  classified.push({
    file,
    line: h.line,
    msg: h.msg,
    component: comp,
    isUse,
    classification,
    worker: classifyWorker(file),
  })
  byClass[classification] = (byClass[classification] || 0) + 1
}

// Scan product for remaining WithClassNames / className doors that may be dead
const product = [
  ...walk(path.join(ROOT, "src/components")),
  ...walk(path.join(ROOT, ".storybook/components")),
].filter((p) => !p.includes(".stories."))

const deadSafe = []
const liveApiMap = []
const proposals = []

for (const abs of product) {
  const rel = relOf(abs)
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  if (!/WithClassNames/.test(text) && !/\bclassNames\??\s*:/.test(text) && !/\bclassName\??\s*:/.test(text))
    continue

  const name =
    path.basename(rel) === "index.tsx" || path.basename(rel) === "index.ts"
      ? path.basename(path.dirname(rel))
      : path.basename(rel).replace(/\.(tsx|ts)$/, "")
  if (LIVE_KNOWN.has(name) || /Skeleton$/i.test(name)) {
    const cName = (usageIndex.get(name) || []).filter((u) => u.prop === "className")
    const cNames = (usageIndex.get(name) || []).filter((u) => u.prop === "classNames")
    liveApiMap.push({
      file: rel,
      component: name,
      classNameConsumers: cName.length,
      classNamesConsumers: cNames.length,
      sampleConsumers: [...cName, ...cNames].slice(0, 8),
      classification: "live-api",
      worker: classifyWorker(rel),
      twin: twinOf(rel, name),
    })
    continue
  }

  const destInfo = findExportDestructure(text, name)
  const dest = destInfo ? destInfo.body : null
  if (dest == null) continue
  if (/\.\.\.\w+/.test(dest)) {
    proposals.push({
      file: rel,
      component: name,
      classification: "ambiguous",
      reason: "rest-spread may forward className",
      worker: classifyWorker(rel),
    })
    continue
  }

  const destClassName = /\bclassName\b/.test(dest)
  const destClassNames = /\bclassNames\b/.test(dest)
  const hasWith = /WithClassNames/.test(text)
  const cName = (usageIndex.get(name) || []).filter((u) => u.prop === "className" && u.file !== rel)
  const cNames = (usageIndex.get(name) || []).filter((u) => u.prop === "classNames" && u.file !== rel)

  // Dead: WithClassNames / typed, neither used in dest, zero consumers
  if (hasWith && !destClassName && !destClassNames && cName.length === 0 && cNames.length === 0) {
    // Also check type alias = WithClassNames
    deadSafe.push({
      file: rel,
      component: name,
      action: "remove-WithClassNames-entirely",
      twin: twinOf(rel, name),
      worker: classifyWorker(rel),
      consumers: { className: 0, classNames: 0 },
    })
    continue
  }

  if (destClassName && !destClassNames && cName.length === 0 && cNames.length === 0 && hasWith) {
    deadSafe.push({
      file: rel,
      component: name,
      action: "remove-className-door-and-impl",
      twin: twinOf(rel, name),
      worker: classifyWorker(rel),
      consumers: { className: 0, classNames: 0 },
    })
    continue
  }

  if ((destClassName || destClassNames || hasWith) && (cName.length > 0 || cNames.length > 0)) {
    const effect = destClassName || destClassNames ? "parent-placement-or-chrome" : "declared-unused-half"
    proposals.push({
      file: rel,
      component: name,
      classification: "live-api",
      consumers: {
        className: cName.slice(0, 12),
        classNames: cNames.slice(0, 12),
        classNameCount: cName.length,
        classNamesCount: cNames.length,
      },
      effect,
      futureApi:
        "Named placement variant or parent-owned principle — do not invent in B27 without teacher-approved axis",
      whyNotB27: "Live consumers exist; requires semantic contract design, not mechanical burn",
      worker: classifyWorker(rel),
      twin: twinOf(rel, name),
    })
  } else if (hasWith || destClassName || destClassNames) {
    proposals.push({
      file: rel,
      component: name,
      classification: "ambiguous",
      reason: "door present but consumer/impl relationship unclear",
      destClassName,
      destClassNames,
      cName: cName.length,
      cNames: cNames.length,
      worker: classifyWorker(rel),
    })
  }
}

// Empty/noop scan
const emptyNoops = []
const emptyRes = [/classNames=\{\s*\[\s*\]\s*\}/g, /className=\{\s*undefined\s*\}/g, /className="\s*"/g]
for (const abs of product) {
  const rel = relOf(abs)
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  for (const re of emptyRes) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text))) {
      emptyNoops.push({ file: rel, match: m[0], line: text.slice(0, m.index).split("\n").length })
    }
  }
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b27-classified.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalHits: hits.length,
      files: new Set(hits.map((h) => h.file)).size,
      uses: uses.length,
      decls: decls.length,
      byClass,
      deadSafe,
      emptyNoops,
      liveApiMapSample: liveApiMap.slice(0, 40),
      liveApiMapCount: liveApiMap.length,
      proposals,
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
      deadSafe: deadSafe.length,
      emptyNoops: emptyNoops.length,
      liveApiKnown: liveApiMap.length,
      proposals: proposals.length,
      deadSample: deadSafe.slice(0, 25),
      proposalLiveSample: proposals.filter((p) => p.classification === "live-api").slice(0, 15),
    },
    null,
    2,
  ),
)
