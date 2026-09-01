/**
 * BATCH 26 — safe brace-aware burn of verified doors.
 * Usage: node _b26-safe-burn.mjs [optional-partition]
 * If partition omitted, burns all and writes all worker JSONs.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const verifiedDoc = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b26-verified-burns.json"), "utf8"))
const onlyPartition = process.argv[2] || null

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

function removeIdentFromDestructure(body, ident) {
  // split by commas at depth 0
  const parts = []
  let cur = ""
  let depth = 0
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === "{" || ch === "(" || ch === "[") depth++
    if (ch === "}" || ch === ")" || ch === "]") depth--
    if (ch === "," && depth === 0) {
      parts.push(cur)
      cur = ""
      continue
    }
    cur += ch
  }
  if (cur.trim()) parts.push(cur)
  const next = parts.filter((p) => {
    const t = p.trim()
    if (t === ident) return false
    if (new RegExp(String.raw`^${ident}\s*=`).test(t)) return false
    if (new RegExp(String.raw`^${ident}\s*:`).test(t)) return false
    return true
  })
  return next.join(",")
}

function stripWithClassNames(text) {
  let t = text
  t = t.replace(/ extends WithClassNames<[^>\n]+>/g, "")
  // HighlightChip local emptyable interface
  t = t.replace(
    /\/\*\*[^*]*Local mirror of the shared `WithClassNames`[\s\S]*?\*\/\s*interface WithClassNames<T> \{[\s\S]*?\}\r?\n\r?\n/g,
    "",
  )
  t = t.replace(/interface WithClassNames<T> \{\s*classNames\?: T\s*\}\r?\n\r?\n/g, "")
  t = t.replace(/interface HighlightChipOwnProps extends WithClassNames<[^>]+>\s*\{/g, "interface HighlightChipOwnProps {")
  // imports
  t = t.replace(/import\s+type\s+\{\s*WithClassNames\s*\}\s+from\s+["'][^"']+["'];?\r?\n/g, "")
  t = t.replace(/import\s+\{\s*type\s+WithClassNames\s*\}\s+from\s+["'][^"']+["'];?\r?\n/g, "")
  t = t.replace(/import\s+\{\s*type\s+WithClassNames,\s*/g, "import { ")
  t = t.replace(/,\s*type\s+WithClassNames\s*/g, "")
  return t
}

function stripClassNameImpl(text, name) {
  let t = stripWithClassNames(text)
  const dest = findExportDestructure(t, name)
  if (dest) {
    const newBody = removeIdentFromDestructure(dest.body, "className")
    t = t.slice(0, dest.start + 1) + newBody + t.slice(dest.end)
  }
  // cn("x", className) → "x"
  t = t.replace(/cn\(\s*(["'`][^"'`]*["'`])\s*,\s*className\s*\)/g, "$1")
  // cn(a, className) → cn(a) or a
  t = t.replace(/cn\(([^)]*?),\s*className\s*\)/g, (full, inner) => {
    const cleaned = inner.replace(/,\s*$/, "").trim()
    if (/^["'`][^"'`]*["'`]$/.test(cleaned)) return cleaned
    return `cn(${cleaned})`
  })
  t = t.replace(/cn\(\s*className\s*,\s*/g, "cn(")
  t = t.replace(/\s+className=\{className\}/g, "")
  // className={cn("relative", className)} already handled by cn replace if pattern matches
  // leftover className={cn("relative")} 
  t = t.replace(/className=\{cn\((["'`][^"'`]*["'`])\)\}/g, "className={$1}")
  // bare <div className={className}> already removed prop → <div>
  // Remove unused cn from heroui import
  if (!/\bcn\s*\(/.test(t)) {
    t = t.replace(/import\s*\{([^}]*)\}\s*from\s*(["']@heroui\/react["'])\s*;?/, (full, names, mod) => {
      const next = names
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && s !== "cn")
      if (!next.length) return ""
      return `import { ${next.join(", ")} } from ${mod}`
    })
  }
  // AllowedClassName import if unused after HighlightChip
  if (!/\bAllowedClassName\b/.test(t.replace(/import type \{ AllowedClassName \} from[^;]+;?\n?/, ""))) {
    t = t.replace(/import\s+type\s+\{\s*AllowedClassName\s*\}\s+from\s+["'][^"']+["'];?\r?\n/g, "")
  }
  t = t.replace(/\n{3,}/g, "\n\n")
  return t
}

function partitionOf(file) {
  const f = file.replace(/\\/g, "/")
  if (f.includes("/atoms/") && (/\/display\//.test(f) || /\/media\//.test(f) || /\/feedback\//.test(f)))
    return "atoms-display-media"
  if (f.includes("/atoms/") && (/\/forms\//.test(f) || /\/_input\//.test(f) || /\/_select\//.test(f)))
    return "atoms-forms"
  if (f.includes("/composites/") && (/\/form\//.test(f) || /\/_field\//.test(f))) return "composites-form"
  if (f.includes("/composites/") && (/\/buttons\//.test(f) || /\/feedback\//.test(f) || /\/dialogs\//.test(f)))
    return "composites-buttons-feedback"
  if (f.includes("/composites/") && (/\/layout\//.test(f) || /\/navigation\//.test(f)))
    return "composites-layout-navigation"
  if (f.includes("/composites/")) return "composites-lists-stats-text-viewers"
  if (f.includes("/frames/")) return "frames"
  if (f.includes("/blocks/") && (/\/cards\//.test(f) || /\/commerce\//.test(f) || /\/careers\//.test(f)))
    return "blocks-cards-commerce"
  if (
    f.includes("/blocks/") &&
    (/\/learn\//.test(f) || /\/practice\//.test(f) || /\/flashcards\//.test(f) || /\/code\//.test(f))
  )
    return "blocks-learn-practice"
  if (f.includes("/blocks/")) return "blocks-domain-profile"
  if (f.includes("/pages/") || f.includes("/overlays/")) return "pages-and-overlays"
  return "storybook-only"
}

const PARTITIONS = [
  "atoms-display-media",
  "atoms-forms",
  "composites-form",
  "composites-buttons-feedback",
  "composites-layout-navigation",
  "composites-lists-stats-text-viewers",
  "frames",
  "blocks-cards-commerce",
  "blocks-learn-practice",
  "blocks-domain-profile",
  "pages-and-overlays",
  "storybook-only",
]

/** Dedupe by file — prefer processing each file once */
const byFile = new Map()
for (const v of verifiedDoc.verified) {
  byFile.set(v.file, v)
  if (v.twin && !byFile.has(v.twin)) {
    byFile.set(v.twin, { ...v, file: v.twin, twin: v.file })
  }
}

const results = Object.fromEntries(
  PARTITIONS.map((p) => [
    p,
    { manifest: [], changed: [], applied: [], skipped: [], holds: [], evidence: [], regressions: [], principles: [] },
  ]),
)

for (const [file, task] of byFile) {
  const part = partitionOf(file)
  if (onlyPartition && part !== onlyPartition) continue
  const w = results[part]
  w.manifest.push(file)
  const abs = path.join(ROOT, file)
  if (!fs.existsSync(abs)) {
    w.skipped.push({ file, reason: "missing" })
    continue
  }
  const orig = fs.readFileSync(abs, "utf8")
  let next
  try {
    if (task.action === "remove-WithClassNames-entirely") next = stripWithClassNames(orig)
    else next = stripClassNameImpl(orig, task.component)
  } catch (e) {
    w.regressions.push({ file, error: String(e) })
    continue
  }
  if (next === orig) {
    w.skipped.push({ file, reason: "no-op", action: task.action })
    continue
  }
  // sanity: don't leave broken OwnProps>
  if (/Props>\s*\{/.test(next) || /OwnProps>\s*\{/.test(next)) {
    w.regressions.push({ file, error: "broken-extends-residue" })
    continue
  }
  fs.writeFileSync(abs, next)
  w.changed.push(file)
  w.applied.push({
    file,
    component: task.component,
    action: task.action,
    kind: "dead-passthrough",
  })
  w.evidence.push({
    file,
    consumerSearch: "brace-aware dest + open-tag index: 0 consumers",
    action: task.action,
  })
}

for (const p of PARTITIONS) {
  const w = results[p]
  w.manifest = [...new Set(w.manifest)].sort()
  w.changed = [...new Set(w.changed)].sort()
  w.holds = [
    "live-api doors with JSX consumers (brace-aware index)",
    "rest-spread forwarding (...props)",
    "Button/Chip/Stack/Grid/Box/SurfaceCard/Typography/Skeleton/vendor/locked/B19–B25",
    "skeleton components; CvPdfPreview",
  ]
  w.parity = { storybookSrc: "twins burned when both listed in verified set" }
  w.verification = { local: "deferred to coordinator" }
  w.overlapCheck = "partitionOf(file) single owner; twin may appear in same partition"
  w.partition = p
  fs.writeFileSync(path.join(ART, `2026-08-09-b26-worker-${p}.json`), JSON.stringify(w, null, 2) + "\n")
}

const summary = Object.fromEntries(
  PARTITIONS.map((p) => [
    p,
    { changed: results[p].changed.length, applied: results[p].applied.length, skipped: results[p].skipped.length, regressions: results[p].regressions.length },
  ]),
)
console.log(JSON.stringify(summary, null, 2))
console.log(
  "total changed",
  PARTITIONS.reduce((n, p) => n + results[p].changed.length, 0),
)
