/**
 * BATCH 24 — accurate dead-door proof via file walk + open-tag prop scan.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const hits = JSON.parse(fs.readFileSync(path.join(ART, "_b24-classname-raw.json"), "utf8"))

const norm = (p) => p.replace(/\\/g, "/")

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

const HOLD_NAME = new Set([
  "DrawerShell",
  "ShowcaseMockup",
  "SurfaceCard",
  "MiniCart",
  "CvPreview",
  "PDFView",
  "Box",
  "ModalShell", // B19 contracts
])

const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "dist") continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const allFiles = [
  ...walk(path.join(ROOT, "src")),
  ...walk(path.join(ROOT, ".storybook")),
].map((f) => ({ abs: f, rel: norm(f).split("/starci-academy/")[1] || norm(f) }))

// Fix rel
for (const f of allFiles) {
  const n = norm(f.abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  f.rel = i >= 0 ? n.slice(i + 1) : n
}

const fileText = new Map()
function read(relOrAbs) {
  const abs = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(ROOT, relOrAbs)
  if (!fileText.has(abs)) {
    try {
      fileText.set(abs, fs.readFileSync(abs, "utf8"))
    } catch {
      fileText.set(abs, "")
    }
  }
  return fileText.get(abs)
}

/** Find JSX/TSX prop passes to <Name ... prop= within ~500 chars of open tag. */
function findConsumers(exportNames, prop, defineRels) {
  const defineSet = new Set(defineRels.map(norm))
  const consumers = []
  const names = Array.isArray(exportNames) ? exportNames : [exportNames]
  for (const f of allFiles) {
    if (defineSet.has(f.rel)) continue
    // skip locked product trees as "proof consumers" still count — they ARE consumers
    const text = read(f.abs)
    for (const name of names) {
      if (!text.includes(name)) continue
      const openRe = new RegExp(`<${name}\\b`, "g")
      let m
      while ((m = openRe.exec(text))) {
        const slice = text.slice(m.index, m.index + 500)
        // stop at tag end roughly
        const gt = slice.indexOf(">")
        const window = gt >= 0 ? slice.slice(0, gt + 1) : slice
        if (new RegExp(`\\b${prop}\\s*=`).test(window)) {
          consumers.push(f.rel)
          break
        }
      }
      if (consumers.includes(f.rel)) break
    }
  }
  return [...new Set(consumers)]
}

function componentFolder(file) {
  const parts = norm(file).split("/")
  const i = parts.findIndex((p) => /\.(tsx|ts)$/.test(p))
  return i > 0 ? parts[i - 1] : parts.at(-1)
}

function exportAliases(file, folder) {
  // Common patterns: ButtonBase still used as Button via re-export; check file exports
  const text = read(path.join(ROOT, file))
  const aliases = new Set([folder])
  for (const m of text.matchAll(/export\s+(?:const|function|class|type|interface)\s+(\w+)/g)) {
    aliases.add(m[1])
  }
  for (const m of text.matchAll(/export\s+\{\s*([^}]+)\}/g)) {
    for (const part of m[1].split(",")) {
      const as = part.trim().match(/(\w+)\s+as\s+(\w+)/)
      if (as) aliases.add(as[2])
      else {
        const id = part.trim().match(/^(\w+)/)
        if (id) aliases.add(id[1])
      }
    }
  }
  // Strip Prop/Props/Base noise for JSX tag search — keep Base variants
  return [...aliases].filter((a) => !/Props$|OwnProps$|meta$/.test(a))
}

function workerFor(file) {
  const f = norm(file)
  if (f.includes("/atoms/")) return "atoms"
  if (f.includes("/frames/")) return "frames"
  if (f.includes("/composites/")) return "composites"
  if (f.includes("/blocks/")) return "blocks"
  if (f.includes("/pages/")) {
    if (
      /\/(Dashboard|Flashcard|Course|Lesson|Cart|Checkout|Order|Wallet|Leaderboard|Profile|Learn|Commerce|Job)/i.test(
        f,
      )
    ) {
      return "pages-primary"
    }
    return "pages-secondary"
  }
  if (f.includes("/layouts/") || f.includes("/app/") || f.includes("/modules/") || f.includes("/utils/")) {
    return "layouts-and-app"
  }
  if (f.startsWith(".storybook/components/")) return "storybook-only"
  return "ambiguous"
}

const decls = hits.filter(
  (h) => /Public house component prop/.test(h.msg) || /WithClassNames/.test(h.msg),
)

// Collapse to unique file+prop
const doorMap = new Map()
for (const h of decls) {
  const file = norm(h.file).replace(/^.*?(src\/|\.storybook\/)/, (m) =>
    m.includes("storybook") ? ".storybook/" + norm(h.file).split("/.storybook/")[1] : "src/" + norm(h.file).split("/src/")[1],
  )
  // normalize file from hit
  let rel = norm(h.file)
  if (rel.includes("starci-academy/")) rel = rel.split("starci-academy/")[1]
  if (!rel.startsWith("src/") && !rel.startsWith(".storybook/")) {
    const i = Math.max(rel.indexOf("src/"), rel.indexOf(".storybook/"))
    if (i >= 0) rel = rel.slice(i)
  }
  if (isLocked(rel)) continue
  const prop = /WithClassNames/.test(h.msg)
    ? "WithClassNames"
    : (h.msg.match(/`(className|classNames)`/) || [, "unknown"])[1]
  const key = `${rel}::${prop}`
  if (!doorMap.has(key)) {
    doorMap.set(key, { file: rel, prop, line: h.line, component: componentFolder(rel) })
  }
}

// Prioritize SB contract sources under atoms/composites/frames (smaller surface, clearer twins)
const prioritized = [...doorMap.values()].filter((d) => {
  if (HOLD_NAME.has(d.component)) return false
  if (d.prop === "unknown") return false
  return (
    d.file.includes("/atoms/") ||
    d.file.includes("/composites/") ||
    d.file.includes("/frames/")
  )
})

console.log("doors to proof", prioritized.length)

const provenDead = []
const liveApi = []

let i = 0
for (const d of prioritized) {
  i++
  if (i % 25 === 0) console.log("progress", i, "/", prioritized.length, "dead", provenDead.length)
  const aliases = exportAliases(d.file, d.component)
  // For WithClassNames, search type usage
  let consumers
  if (d.prop === "WithClassNames") {
    consumers = []
    for (const f of allFiles) {
      if (f.rel === d.file) continue
      const t = read(f.abs)
      if (t.includes("WithClassNames") && t.includes(d.component)) {
        // loose — also check import from this module
        consumers.push(f.rel)
      }
    }
    // tighter: if file only defines WithClassNames on its own props type
    consumers = consumers.filter((c) => {
      const t = read(path.join(ROOT, c))
      return new RegExp(`WithClassNames<`).test(t) && t.includes(d.component)
    })
  } else {
    consumers = findConsumers(aliases, d.prop, [d.file])
    // Also check twin path as definition not consumer for door deletion decision —
    // twin having the same prop is expected; consumers are call sites.
    consumers = consumers.filter((c) => {
      // twin definition files still "use" the prop in their signature — exclude if it's the twin of same component folder
      const sameFolder = c.includes(`/${d.component}/`)
      const isDef =
        sameFolder &&
        (/\/index\.tsx$/.test(c) || c.endsWith(`/${d.component}.tsx`) || c.includes("Base.tsx"))
      return !isDef
    })
  }

  const row = {
    ...d,
    worker: workerFor(d.file),
    aliases: aliases.slice(0, 8),
    consumerCount: consumers.length,
    consumers: consumers.slice(0, 12),
  }
  if (consumers.length === 0) provenDead.push(row)
  else liveApi.push(row)
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b24-dead-proof.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      prioritized: prioritized.length,
      provenDeadCount: provenDead.length,
      liveApiCount: liveApi.length,
      provenDead,
      liveApiSample: liveApi.slice(0, 50),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      provenDead: provenDead.length,
      liveApi: liveApi.length,
      deadByWorker: provenDead.reduce((a, d) => ((a[d.worker] = (a[d.worker] || 0) + 1), a), {}),
      sample: provenDead.slice(0, 30).map((d) => `${d.prop} ${d.component} ${d.file}`),
    },
    null,
    2,
  ),
)
