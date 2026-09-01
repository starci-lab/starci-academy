/**
 * BATCH 26 — brace-aware verified dead WithClassNames doors only.
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
]

const HOLD_NAME = new Set([
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
  "Logo",
  "Spinner",
  "PinnedTrack",
  "Cluster",
  "PressableCard",
  "SurfaceListCard",
  "DragScrollArea",
  "ResizableRail",
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
    } else if (/\.(tsx|ts)$/.test(ent.name) && !/\.stories\./.test(ent.name)) out.push(p)
  }
  return out
}

function relOf(abs) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  return i >= 0 ? n.slice(i + 1) : n
}

/** Extract balanced {...} after export const Name = ( */
function extractDestructure(text, name) {
  const re = new RegExp(String.raw`export\s+(?:const|function)\s+${name}\s*=\s*(?:\w+\s*)?\(`)
  const m = re.exec(text)
  if (!m) {
    const re2 = new RegExp(String.raw`export\s+function\s+${name}\s*\(`)
    const m2 = re2.exec(text)
    if (!m2) return null
    return extractBalanced(text, m2.index + m2[0].length)
  }
  return extractBalanced(text, m.index + m[0].length)
}

function extractBalanced(text, start) {
  // start at first {
  let i = start
  while (i < text.length && /\s/.test(text[i])) i++
  if (text[i] !== "{") return null
  let depth = 0
  const from = i
  for (; i < text.length; i++) {
    const ch = text[i]
    if (ch === "{" ) depth++
    else if (ch === "}") {
      depth--
      if (depth === 0) return text.slice(from + 1, i)
    }
  }
  return null
}

// usage index
const allTsx = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook"))]
const usageIndex = new Map()
const openTagRe = /<([A-Z][A-Za-z0-9]*)\b/g
// Index ALL product/app usages as consumers — locked files still count as consumers
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
        usageIndex.get(comp).push({ file: rel, prop })
      }
    }
  }
}

const product = [
  ...walk(path.join(ROOT, "src/components")),
  ...walk(path.join(ROOT, ".storybook/components")),
]

const verified = []
const held = []

for (const abs of product) {
  const rel = relOf(abs)
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  if (!/WithClassNames/.test(text)) continue

  const name =
    path.basename(rel) === "index.tsx" || path.basename(rel) === "index.ts"
      ? path.basename(path.dirname(rel))
      : path.basename(rel).replace(/\.(tsx|ts)$/, "")
  if (HOLD_NAME.has(name) || /Skeleton$/i.test(name) || name === "CvPdfPreview") {
    held.push({ file: rel, reason: "hold-name-or-skeleton", name })
    continue
  }

  const dest = extractDestructure(text, name)
  if (dest == null) {
    held.push({ file: rel, reason: "no-destructure", name })
    continue
  }
  if (/\.\.\.\w+/.test(dest)) {
    held.push({ file: rel, reason: "rest-spread-may-forward", name })
    continue
  }

  const destClassName = /\bclassName\b/.test(dest)
  const destClassNames = /\bclassNames\b/.test(dest)
  const cName = (usageIndex.get(name) || []).filter((u) => u.prop === "className" && u.file !== rel)
  const cNames = (usageIndex.get(name) || []).filter((u) => u.prop === "classNames" && u.file !== rel)

  // Case A: neither destructured, zero consumers either → remove WithClassNames entirely
  if (!destClassName && !destClassNames && cName.length === 0 && cNames.length === 0) {
    verified.push({
      file: rel,
      component: name,
      action: "remove-WithClassNames-entirely",
      dest: dest.replace(/\s+/g, " ").slice(0, 120),
    })
    continue
  }

  // Case B: className destructured+used path, classNames never destructured, 0 classNames consumers
  // → only remove dead classNames half by replacing WithClassNames with { className?: string }
  // SKIP if className has consumers (live API) — still can narrow type but coordinator holds live APIs' shape changes unless zero consumers of classNames only
  if (destClassName && !destClassNames && cNames.length === 0) {
    if (cName.length === 0) {
      // zero consumers of className too → full remove including className from impl
      verified.push({
        file: rel,
        component: name,
        action: "remove-className-door-and-impl",
        classNameConsumers: 0,
        dest: dest.replace(/\s+/g, " ").slice(0, 120),
      })
    } else {
      held.push({
        file: rel,
        reason: "live-className-api",
        name,
        classNameConsumers: cName.length,
      })
    }
    continue
  }

  held.push({
    file: rel,
    reason: "other",
    name,
    destClassName,
    destClassNames,
    cName: cName.length,
    cNames: cNames.length,
  })
}

// twin pairing
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

for (const v of verified) v.twin = twinOf(v.file, v.component)

fs.writeFileSync(
  path.join(ART, "2026-08-09-b26-verified-burns.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      verifiedCount: verified.length,
      heldCount: held.length,
      verified,
      heldSample: held.slice(0, 40),
      byAction: verified.reduce((a, v) => {
        a[v.action] = (a[v.action] || 0) + 1
        return a
      }, {}),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      verified: verified.length,
      byAction: verified.reduce((a, v) => {
        a[v.action] = (a[v.action] || 0) + 1
        return a
      }, {}),
      held: held.length,
      sample: verified.slice(0, 40).map((v) => `${v.action} ${v.component} @ ${v.file}`),
    },
    null,
    2,
  ),
)
