/**
 * BATCH 26 — single-pass high-confidence dead door finder.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

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

function relOf(abs) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  return i >= 0 ? n.slice(i + 1) : n
}

const t0 = Date.now()
const allTsx = [
  ...walk(path.join(ROOT, "src")),
  ...walk(path.join(ROOT, ".storybook")),
].filter((p) => /\.(tsx|ts)$/.test(p) && !p.includes("node_modules"))

const product = [
  ...walk(path.join(ROOT, "src/components")),
  ...walk(path.join(ROOT, ".storybook/components")),
].filter((p) => !p.includes(".stories."))

// Index: for each file, find JSX open tags with className/classNames in following ~400 chars
/** @type {Map<string, Array<{file:string,line:number,prop:string,snippet:string}>>} */
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
    const start = m.index
    // find end of opening tag or next 500 chars
    const slice = text.slice(start, start + 500)
    const close = slice.search(/\/?>/)
    const tag = close >= 0 ? slice.slice(0, close + 1) : slice
    for (const prop of ["classNames", "className"]) {
      if (new RegExp(`\\b${prop}\\s*=`).test(tag)) {
        if (!usageIndex.has(comp)) usageIndex.set(comp, [])
        usageIndex.get(comp).push({
          file: rel,
          line: text.slice(0, start).split("\n").length,
          prop,
          snippet: tag.replace(/\s+/g, " ").slice(0, 140),
        })
      }
    }
  }
}

console.log(`indexed usages in ${Date.now() - t0}ms`)

const candidates = []
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
  if (HOLD_COMP.has(name)) continue

  const exportFn =
    text.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*(?:\\w+\\s*)?\\(\\s*\\{([^}]{0,1500})\\}`, "m")) ||
    text.match(new RegExp(`export\\s+function\\s+${name}\\s*\\(\\s*\\{([^}]{0,1500})\\}`, "m"))

  if (!exportFn) continue
  const dest = exportFn[1]
  const hasWith = /WithClassNames/.test(text)

  for (const prop of ["classNames", "className"]) {
    const explicitlyTyped = new RegExp(`\\b${prop}\\??\\s*:`).test(text)
    if (!hasWith && !explicitlyTyped) continue
    // WithClassNames implies both; only flag prop if either WithClassNames or explicit
    if (!explicitlyTyped && hasWith) {
      // only emit once per WithClassNames — check both props but require not destructured
    }
    if (new RegExp(`\\b${prop}\\b`).test(dest)) continue

    // If WithClassNames only and prop never appears elsewhere in file except type import, both are candidates
    const usages = (usageIndex.get(name) || []).filter((u) => u.prop === prop && u.file !== rel)
    // Also filter usages inside the component's own folder definition stories
    const external = usages.filter((u) => {
      if (u.file === rel) return false
      // definition twin
      if (u.file.includes(`/${name}/`) && /export\s+(const|function)\s+/.test(fs.readFileSync(path.join(ROOT, u.file), "utf8").slice(0, 500))) {
        // might be consumer in same folder — keep
      }
      return true
    })

    candidates.push({
      file: rel,
      component: name,
      prop,
      dest: dest.replace(/\s+/g, " ").slice(0, 100),
      consumers: external.length,
      consumerList: external.slice(0, 10),
      kind: external.length === 0 ? "dead-door" : "ignored-passthrough",
    })
  }
}

const deadDoors = candidates.filter((c) => c.kind === "dead-door")
const ignored = candidates.filter((c) => c.kind === "ignored-passthrough")

// Twin pairing: prefer Storybook as owner when both exist
function twinOf(rel, name) {
  if (rel.startsWith(".storybook/components/")) {
    let rest = rel.replace(/^\.storybook\/components\//, "")
    rest = rest.replace(/\/[^/]+\.(tsx|ts)$/, "")
    rest = rest.replace(/^starci\//, "")
    const cands = [`src/components/${rest}/index.tsx`, `src/components/${rest}/${name}.tsx`]
    for (const c of cands) if (fs.existsSync(path.join(ROOT, c))) return c
  } else if (rel.startsWith("src/components/")) {
    let rest = rel.replace(/^src\/components\//, "").replace(/\/index\.(tsx|ts)$/, "")
    const cands = [
      `.storybook/components/${rest}/${name}.tsx`,
      `.storybook/components/starci/${rest}/${name}.tsx`,
      `.storybook/components/starci/blocks/${rest.replace(/^blocks\//, "")}/${name}.tsx`,
    ]
    for (const c of cands) if (fs.existsSync(path.join(ROOT, c))) return c
  }
  return null
}

for (const c of candidates) {
  c.twin = twinOf(c.file, c.component)
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b26-high-confidence.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      elapsedMs: Date.now() - t0,
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
      elapsedMs: Date.now() - t0,
      deadDoors: deadDoors.length,
      ignored: ignored.length,
      ignoredDetail: ignored,
      deadSample: deadDoors.slice(0, 40).map((d) => ({
        c: d.component,
        p: d.prop,
        f: d.file,
        twin: d.twin,
      })),
    },
    null,
    2,
  ),
)
