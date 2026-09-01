/**
 * BATCH 24 — find proven-dead public className/classNames/WithClassNames doors.
 * Does not edit product code. Emits candidate list for workers.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const hits = JSON.parse(fs.readFileSync(path.join(ART, "_b24-classname-raw.json"), "utf8"))

const norm = (p) => String(p).replace(/\\/g, "/")

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

const HOLD_COMPONENTS = [
  "DrawerShell",
  "ShowcaseMockup",
  "SurfaceCard",
  "MiniCart",
  "CvPreview",
  "PDFView",
  "Box",
]

const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

const decls = hits.filter(
  (h) =>
    /Public house component prop/.test(h.msg) || /WithClassNames/.test(h.msg),
)

const uses = hits.filter((h) => /Do not pass/.test(h.msg))

/** Extract component-ish folder name from path. */
const componentHint = (file) => {
  const parts = norm(file).split("/")
  // .../ComponentName/ComponentName.tsx or .../ComponentName/index.tsx
  const idx = parts.findIndex((p) => p.endsWith(".tsx") || p.endsWith(".ts"))
  if (idx > 0) return parts[idx - 1]
  return parts.at(-1)?.replace(/\.(tsx|ts)$/, "") || file
}

const propFromMsg = (msg) => {
  const m = msg.match(/`(className|classNames)`/)
  if (m) return m[1]
  if (/WithClassNames/.test(msg)) return "WithClassNames"
  return "unknown"
}

/** rg for consumers of Component with prop — returns match count outside the defining file. */
function consumerCount(component, prop, defineFile) {
  if (prop === "WithClassNames") {
    // type usages
    try {
      const out = execSync(
        `rg -l --glob "*.{ts,tsx}" "WithClassNames" src .storybook`,
        { cwd: ROOT, encoding: "utf8" },
      )
      return out
        .split(/\r?\n/)
        .filter(Boolean)
        .map(norm)
        .filter((f) => !f.includes(norm(defineFile).replace(/^.*?(src\/|\.storybook\/)/, "")))
        .length
    } catch {
      return 0
    }
  }
  // JSX prop usage: className= or classNames= near the component name is hard.
  // Practical proof: search `<ComponentName` files that also contain `className`/`classNames`
  // is too loose. Instead search patterns:
  //   <Component ... className=
  //   <ComponentName className=
  // and ComponentName={{ ... classNames
  try {
    const patterns = [
      `<${component}[^>]*\\b${prop}=`,
      `${component}[\\s\\S]{0,200}\\b${prop}=`,
    ]
    // Use simple: files containing both component open tag and prop assignment nearby via rg
    const out = execSync(
      `rg -l --glob "*.{ts,tsx}" "<${component}[\\\\s/>]" src .storybook`,
      { cwd: ROOT, encoding: "utf8" },
    )
    const files = out.split(/\r?\n/).filter(Boolean).map(norm)
    const defineNorm = norm(defineFile).replace(/\\/g, "/")
    let count = 0
    const consumers = []
    for (const f of files) {
      const rel = f.includes("src/") || f.includes(".storybook/")
        ? f.slice(Math.max(f.indexOf("src/"), f.indexOf(".storybook/")))
        : f
      if (rel.replace(/\\/g, "/") === defineNorm || f.replace(/\\/g, "/").endsWith(defineNorm)) {
        continue
      }
      // skip if this is the twin defining file of the same component
      const base = path.basename(defineNorm)
      if (f.replace(/\\/g, "/").endsWith("/" + base) && /SurfaceCard|ContentPager/.test(component)) {
        // still count twin as definition not consumer for door-on-API
      }
      const text = fs.readFileSync(path.isAbsolute(f) ? f : path.join(ROOT, f), "utf8")
      // Match prop passed to this component: <Comp ... prop= or multiline
      const re = new RegExp(`<${component}\\b[\\s\\S]*?\\b${prop}\\s*=`, "g")
      // Limit window: only first 800 chars after each open tag
      let matched = false
      const openRe = new RegExp(`<${component}\\b`, "g")
      let m
      while ((m = openRe.exec(text))) {
        const slice = text.slice(m.index, m.index + 600)
        if (new RegExp(`\\b${prop}\\s*=`).test(slice) && !slice.includes(`</${component}`)) {
          matched = true
          break
        }
        // self-closing / props before >
        if (new RegExp(`\\b${prop}\\s*=`).test(slice)) {
          matched = true
          break
        }
      }
      if (matched) {
        count++
        consumers.push(rel.replace(/\\/g, "/"))
      }
    }
    return { count, consumers: consumers.slice(0, 8) }
  } catch (e) {
    return { count: 0, consumers: [], error: String(e.message || e) }
  }
}

const VENDOR_RE = [
  /\/components\/frames\/Box(?:\/|$)/,
  /\/components\/atoms\/.*\/(?:Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup)(?:\/|$)/,
]

function workerFor(file) {
  const f = norm(file)
  if (f.includes("/atoms/")) return "atoms"
  if (f.includes("/frames/")) return "frames"
  if (f.includes("/composites/")) return "composites"
  if (f.includes("/blocks/")) return "blocks"
  if (f.includes("/pages/")) {
    if (/\/(learn|commerce|profile|dashboard|Course|Lesson|Flashcard|Cart|Checkout|Order|Wallet|Leaderboard)/i.test(f)) {
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

// Focus on declaration sites first — dead doors
const declCandidates = []
const seen = new Set()

for (const h of decls) {
  const file = norm(h.file)
  if (isLocked(file)) continue
  if (VENDOR_RE.some((r) => r.test("/" + file))) continue
  const prop = propFromMsg(h.msg)
  const comp = componentHint(file)
  if (HOLD_COMPONENTS.includes(comp)) continue
  const key = `${file}:${prop}:${h.line}`
  if (seen.has(key)) continue
  seen.add(key)

  declCandidates.push({
    file,
    line: h.line,
    prop,
    component: comp,
    worker: workerFor(file),
    msg: h.msg.slice(0, 120),
  })
}

// Sample scan: only scan a manageable set — prioritize atoms/composites/frames with few decls
const byWorker = {}
for (const c of declCandidates) {
  ;(byWorker[c.worker] ||= []).push(c)
}

console.log(
  JSON.stringify(
    {
      totalHits: hits.length,
      decls: decls.length,
      uses: uses.length,
      declCandidatesEligible: declCandidates.length,
      byWorker: Object.fromEntries(Object.entries(byWorker).map(([k, v]) => [k, v.length])),
    },
    null,
    2,
  ),
)

// Deep-scan first 80 atom/composite/frame decls for zero consumers
const scanPool = [
  ...(byWorker.atoms || []).slice(0, 40),
  ...(byWorker.composites || []).slice(0, 40),
  ...(byWorker.frames || []).slice(0, 30),
  ...(byWorker.blocks || []).slice(0, 20),
]

const provenDead = []
const liveApi = []
const ambiguous = []

for (const c of scanPool) {
  const result = consumerCount(c.component, c.prop, c.file)
  const count = typeof result === "number" ? result : result.count
  const consumers = typeof result === "number" ? [] : result.consumers || []
  const row = { ...c, consumerCount: count, consumers }
  if (count === 0) provenDead.push(row)
  else if (count > 0) liveApi.push(row)
  else ambiguous.push(row)
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b24-inventory.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalHits: hits.length,
      decls: decls.length,
      uses: uses.length,
      declCandidatesEligible: declCandidates.length,
      byWorker: Object.fromEntries(Object.entries(byWorker).map(([k, v]) => [k, v.length])),
      scanned: scanPool.length,
      provenDead,
      liveApiSample: liveApi.slice(0, 40),
      holdNote: "HOLD_COMPONENTS + locked/nivo skipped",
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      scanned: scanPool.length,
      provenDead: provenDead.length,
      liveApi: liveApi.length,
      deadSample: provenDead.slice(0, 25).map((d) => `${d.worker} ${d.component}.${d.prop} @ ${d.file}:${d.line}`),
    },
    null,
    2,
  ),
)
