/**
 * BATCH 26 — classify WithClassNames into:
 * A) fully dead (neither prop destructured, 0 consumers either)
 * B) classNames-half-dead (className live/destructured, classNames never used, 0 classNames consumers)
 * C) ignored call-sites
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const hc = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b26-high-confidence.json"), "utf8"))

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

function relOf(abs) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  return i >= 0 ? n.slice(i + 1) : n
}

// Build usage index once
const allTsx = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook"))].filter(
  (p) => /\.(tsx|ts)$/.test(p),
)
const usageIndex = new Map()
const openTagRe = /<([A-Z][A-Za-z0-9]*)\b/g
for (const abs of allTsx) {
  const rel = relOf(abs)
  if (isLocked(rel)) continue
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
        usageIndex.get(comp).push({ file: rel, prop, line: text.slice(0, m.index).split("\n").length })
      }
    }
  }
}

function consumers(comp, prop) {
  return (usageIndex.get(comp) || []).filter((u) => u.prop === prop)
}

const byFile = new Map()
for (const d of [...hc.deadDoorsList, ...hc.ignoredList]) {
  if (!byFile.has(d.file)) byFile.set(d.file, { component: d.component, twin: d.twin, props: new Set() })
  byFile.get(d.file).props.add(d.prop)
}

const fullyDead = []
const classNamesHalfDead = []
const classNameHalfDead = []
const hold = []

for (const [file, info] of byFile) {
  if (isLocked(file)) {
    hold.push({ file, reason: "locked" })
    continue
  }
  const text = fs.readFileSync(path.join(ROOT, file), "utf8")
  const name = info.component
  const m =
    text.match(new RegExp(String.raw`export\s+const\s+${name}\s*=\s*(?:\w+\s*)?\(\s*\{([^}]{0,1500})\}`)) ||
    text.match(new RegExp(String.raw`export\s+function\s+${name}\s*\(\s*\{([^}]{0,1500})\}`))
  if (!m) {
    hold.push({ file, reason: "no-export-match" })
    continue
  }
  const dest = m[1]
  const destNames = /\bclassNames\b/.test(dest)
  const destName = /\bclassName\b/.test(dest)
  const cNames = consumers(name, "classNames")
  const cName = consumers(name, "className")

  // Skeleton / loading hold
  if (/Skeleton|isSkeleton|skeleton/i.test(name) && /Skeleton/.test(name)) {
    hold.push({ file, reason: "skeleton-hold", name })
    continue
  }

  if (!destNames && !destName && cNames.length === 0 && cName.length === 0) {
    fullyDead.push({
      file,
      component: name,
      twin: info.twin,
      action: "remove-WithClassNames-and-both-props",
      hasWith: /WithClassNames/.test(text),
    })
  } else if (!destNames && destName && cNames.length === 0) {
    classNamesHalfDead.push({
      file,
      component: name,
      twin: info.twin,
      action: "narrow-WithClassNames-to-className-only",
      classNameConsumers: cName.length,
    })
  } else if (destNames && !destName && cName.length === 0) {
    classNameHalfDead.push({
      file,
      component: name,
      twin: info.twin,
      action: "narrow-to-classNames-only",
      classNamesConsumers: cNames.length,
    })
  } else {
    hold.push({
      file,
      reason: "live-or-ambiguous",
      destNames,
      destName,
      cNames: cNames.length,
      cName: cName.length,
    })
  }
}

// Ignored passthrough call sites from hc
const ignoredCallSites = hc.ignoredList

fs.writeFileSync(
  path.join(ART, "2026-08-09-b26-actionable.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      fullyDead: fullyDead.length,
      classNamesHalfDead: classNamesHalfDead.length,
      classNameHalfDead: classNameHalfDead.length,
      hold: hold.length,
      ignoredCallSites,
      fullyDeadList: fullyDead,
      classNamesHalfDeadList: classNamesHalfDead,
      classNameHalfDeadList: classNameHalfDead,
      holdSample: hold.slice(0, 30),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      fullyDead: fullyDead.length,
      classNamesHalfDead: classNamesHalfDead.length,
      classNameHalfDead: classNameHalfDead.length,
      hold: hold.length,
      ignoredCallSites: ignoredCallSites.length,
      fullyDeadSample: fullyDead.slice(0, 40).map((f) => f.file),
      halfDeadSample: classNamesHalfDead.slice(0, 20).map((f) => `${f.component} (className consumers=${f.classNameConsumers})`),
      ignored: ignoredCallSites,
    },
    null,
    2,
  ),
)
