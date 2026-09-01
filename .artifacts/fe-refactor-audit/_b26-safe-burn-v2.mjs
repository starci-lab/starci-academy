/**
 * BATCH 26 — fixed safe burn (newline-preserving, multi-extends aware).
 * Usage: node _b26-safe-burn-v2.mjs <partition>|all
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const verifiedDoc = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b26-verified-burns.json"), "utf8"))
const arg = process.argv[2] || "all"

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
  return parts
    .filter((p) => {
      const t = p.trim()
      if (t === ident) return false
      if (new RegExp(String.raw`^${ident}\s*=`).test(t)) return false
      if (new RegExp(String.raw`^${ident}\s*:`).test(t)) return false
      return true
    })
    .join(",")
}

function stripWithClassNames(text) {
  let t = text
  // type alias: export type X = WithClassNames<...>
  t = t.replace(
    /export\s+type\s+(\w+)\s*=\s*WithClassNames<[^>\n]+>\s*(?:&\s*(\{[\s\S]*?\}))?/g,
    (full, name, obj) => {
      if (obj) return `export type ${name} = ${obj}`
      return `export type ${name} = Record<string, never>`
    },
  )
  // simpler: export type X = WithClassNames<undefined>
  t = t.replace(/export\s+type\s+(\w+)\s*=\s*WithClassNames<[^>\n]+>\s*\r?\n/g, "export type $1 = Record<string, never>\n")
  // multi-extends: extends WithClassNames<X>, Other → extends Other
  t = t.replace(/extends\s+WithClassNames<[^>\n]+>\s*,\s*/g, "extends ")
  // intersection on interface: extends WithClassNames<X> & Other → extends Other
  t = t.replace(/extends\s+WithClassNames<[^>\n]+>\s*&\s*/g, "extends ")
  // sole: extends WithClassNames<X>
  t = t.replace(/\s+extends\s+WithClassNames<[^>\n]+>/g, "")
  // local HighlightChip mirror
  t = t.replace(
    /\/\*\*[^*]*Local mirror of the shared `WithClassNames`[\s\S]*?\*\/\r?\ninterface WithClassNames<T> \{[\s\S]*?\}\r?\n\r?\n/g,
    "",
  )
  t = t.replace(
    /interface HighlightChipOwnProps extends WithClassNames<[^>]+>\s*\{/g,
    "interface HighlightChipOwnProps {",
  )
  // Only remove import if no remaining WithClassNames references
  if (!/\bWithClassNames\b/.test(t.replace(/import[\s\S]*?from\s+["'][^"']+["'];?/g, ""))) {
    t = t.replace(/import\s+type\s+\{\s*WithClassNames\s*\}\s+from\s+["'][^"']+["'];?\r?\n/g, "")
    t = t.replace(/import\s+\{\s*type\s+WithClassNames\s*\}\s+from\s+["'][^"']+["'];?\r?\n/g, "")
    t = t.replace(/import\s+\{\s*type\s+WithClassNames\s*,\s*/g, "import { ")
    t = t.replace(/,\s*type\s+WithClassNames(?=\s*[,}])/g, "")
  }
  return t
}

function stripCnFromImport(text) {
  return text.replace(
    /import\s*\{([^}]*)\}\s*from\s*(["']@heroui\/react["'])\s*;?/g,
    (full, names, mod) => {
      if (!/\bcn\b/.test(names)) return full
      if (/\bcn\s*\(/.test(text.replace(full, ""))) return full // still used elsewhere — wait, text still has old cn calls
      return full // handled after cn call removal
    },
  )
}

function removeUnusedCnImport(text) {
  if (/\bcn\s*\(/.test(text)) return text
  return text.replace(
    /import\s*\{([^}]*)\}\s*from\s*(["']@heroui\/react["'])\s*;?\r?\n?/g,
    (full, names, mod) => {
      if (!/\bcn\b/.test(names)) return full
      const next = names
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && s !== "cn")
      if (!next.length) return "" // remove whole line including newline via \r?\n? in match
      return `import { ${next.join(", ")} } from ${mod}\n`
    },
  )
}

function stripClassNameImpl(text, name) {
  let t = stripWithClassNames(text)
  const dest = findExportDestructure(t, name)
  if (dest) {
    const newBody = removeIdentFromDestructure(dest.body, "className")
    t = t.slice(0, dest.start + 1) + newBody + t.slice(dest.end)
  }
  t = t.replace(/cn\(\s*(["'`][^"'`]*["'`])\s*,\s*className\s*\)/g, "$1")
  t = t.replace(/cn\(\s*className\s*\)/g, '""')
  // multiline: cn(\n  expr,\n  className,\n)
  t = t.replace(/cn\(\s*([\s\S]*?),\s*className\s*,?\s*\)/g, (full, inner) => {
    const cleaned = inner.replace(/,\s*$/, "").trim()
    if (/^["'`][^"'`]*["'`]$/.test(cleaned)) return cleaned
    if (!cleaned) return '""'
    return `cn(${cleaned})`
  })
  t = t.replace(/cn\(([^)]*?),\s*className\s*\)/g, (full, inner) => {
    const cleaned = inner.replace(/,\s*$/, "").trim()
    if (/^["'`][^"'`]*["'`]$/.test(cleaned)) return cleaned
    return `cn(${cleaned})`
  })
  t = t.replace(/cn\(\s*className\s*,\s*/g, "cn(")
  t = t.replace(/\s+className=\{className\}/g, "")
  t = t.replace(/\s+className=\{cn\(className\)\}/g, "")
  t = t.replace(/className=\{cn\((["'`][^"'`]*["'`])\)\}/g, "className={$1}")
  // leftover identifier references in JSX attrs — strip className={className} already done
  // Drop lines that are only `className,` inside cn — handled by multiline
  t = t.replace(/,\s*className\s*(?=[,\)])/g, "")
  t = removeUnusedCnImport(t)
  if (!/\bAllowedClassName\b/.test(t.replace(/import type \{ AllowedClassName \} from[^;\n]+;?\r?\n?/, ""))) {
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
  if (f.includes("/pages/") || f.includes("/overlays/") || f.includes("/layouts/")) return "pages-and-overlays"
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

const byFile = new Map()
for (const v of verifiedDoc.verified) {
  // SCOPE: only remove-WithClassNames-entirely for v2 first wave safety,
  // PLUS remove-className when partition requested as className-capable.
  // Default `all` does BOTH with fixed transforms.
  byFile.set(v.file, v)
}

const targets = [...byFile.values()].filter((t) => arg === "all" || partitionOf(t.file) === arg)

const results = Object.fromEntries(
  PARTITIONS.map((p) => [
    p,
    {
      partition: p,
      manifest: [],
      changed: [],
      applied: [],
      skipped: [],
      holds: [],
      evidence: [],
      regressions: [],
      principles: [],
      parity: {},
      verification: {},
      overlapCheck: "single partitionOf owner",
    },
  ]),
)

for (const task of targets) {
  const part = partitionOf(task.file)
  const w = results[part]
  w.manifest.push(task.file)
  const abs = path.join(ROOT, task.file)
  if (!fs.existsSync(abs)) {
    w.skipped.push({ file: task.file, reason: "missing" })
    continue
  }
  const orig = fs.readFileSync(abs, "utf8")
  let next
  try {
    next =
      task.action === "remove-WithClassNames-entirely"
        ? stripWithClassNames(orig)
        : stripClassNameImpl(orig, task.component)
  } catch (e) {
    w.regressions.push({ file: task.file, error: String(e) })
    continue
  }
  if (next === orig) {
    w.skipped.push({ file: task.file, reason: "no-op", action: task.action })
    continue
  }
  if (/Props>\s*\{/.test(next) || /OwnProps>\s*\{/.test(next) || /interface \w+,\s*\w+/.test(next)) {
    w.regressions.push({ file: task.file, error: "broken-type-residue", preview: next.slice(0, 200) })
    continue
  }
  // refuse concatenated imports
  if (/from ["'][^"']+["']import /.test(next)) {
    w.regressions.push({ file: task.file, error: "concatenated-imports" })
    continue
  }
  fs.writeFileSync(abs, next)
  w.changed.push(task.file)
  w.applied.push({ file: task.file, component: task.component, action: task.action, kind: "dead-passthrough" })
  w.evidence.push({ file: task.file, consumerSearch: "brace-aware + open-tag 0 consumers", action: task.action })
}

for (const p of PARTITIONS) {
  const w = results[p]
  w.manifest = [...new Set(w.manifest)].sort()
  w.changed = [...new Set(w.changed)].sort()
  w.holds = [
    "live-api with JSX consumers",
    "rest-spread forwarding",
    "Button/Chip/Stack/Grid/Box/SurfaceCard/Typography/Skeleton/vendor/locked/B19–B25",
    "skeleton components; CvPdfPreview",
  ]
  w.parity = { storybookSrc: "SB HighlightChip twin included when present" }
  w.verification = { local: "deferred" }
  fs.writeFileSync(path.join(ART, `2026-08-09-b26-worker-${p}.json`), JSON.stringify(w, null, 2) + "\n")
}

console.log(
  JSON.stringify(
    {
      arg,
      totalChanged: PARTITIONS.reduce((n, p) => n + results[p].changed.length, 0),
      totalRegressions: PARTITIONS.reduce((n, p) => n + results[p].regressions.length, 0),
      per: Object.fromEntries(
        PARTITIONS.map((p) => [
          p,
          {
            c: results[p].changed.length,
            s: results[p].skipped.length,
            r: results[p].regressions.length,
          },
        ]),
      ),
    },
    null,
    2,
  ),
)
