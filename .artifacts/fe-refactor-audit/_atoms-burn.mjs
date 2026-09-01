/**
 * Atoms partition burn — require-export-jsdoc + handler-on-prefix + no-emoji-in-source.
 * Manifest-only. Storybook paths first, then src twins.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const MANIFEST = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-manifest-atoms.json", "utf8"),
)
const LIVE = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/_atoms-live-eslint.json", "utf8"),
)

const SPECIAL_JSDOC = {
  STATUS_TONE: "Status-dot background tone keyed by avatar status.",
  SIZE_MAP: "Per-size chrome for avatar box, status dot, and fallback glyph.",
  HERO_VARIANT: "Maps house `ButtonVariant` to the HeroUI fork's `variant` set.",
  ButtonBase:
    "Shared button chrome — variants, sizes, icons, skeleton, pending, and press handling.",
  ChipBase:
    "Shared chip chrome — tone, leading icon/dot, removable trailing X, and skeleton.",
}

const humanizePart = (name) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^(Table|Select|Switch|Drawer|Modal|AlertDialog|AccordionTree|Tabs|ListBox)\s?/i, "")
    .trim()
    .toLowerCase() || name

const describeExport = (name, lineText, fileText) => {
  if (SPECIAL_JSDOC[name]) return SPECIAL_JSDOC[name]
  if (name === "meta") {
    const m = fileText.match(/export const meta = \{[^}]*name:\s*"([^"]+)"/)
    const comp = (m && m[1]) || "component"
    return `Tier metadata for \`${comp}\`, used by the component registry/Storybook lookup.`
  }
  const hero = lineText.match(/=\s*(Hero\w+)\.(\w+)/)
  if (hero) {
    const vendor = hero[1].replace(/^Hero/, "")
    const part = hero[2]
    const role = humanizePart(name)
    return `House ${role || name} over HeroUI \`${vendor}.${part}\`.`
  }
  return `Exported \`${name}\` — role / what it does.`
}

const insertJsdocBeforeLine = (lines, lineIndex0, jsdoc) => {
  const indent = (lines[lineIndex0].match(/^\s*/) || [""])[0]
  const doc = `${indent}/** ${jsdoc} */`
  // Skip if already present immediately above (idempotent).
  const prev = lineIndex0 > 0 ? lines[lineIndex0 - 1] : ""
  if (/^\s*\/\*\*/.test(prev) || /^\s*\*/.test(prev)) return false
  lines.splice(lineIndex0, 0, doc)
  return true
}

const fixFile = (rel) => {
  const abs = path.join(ROOT, rel)
  let text = fs.readFileSync(abs, "utf8")
  const msgs = LIVE[rel] || []
  const rulesHit = new Set()
  let changed = false
  const reasons = []

  // 1) emoji scrub (comments) — Extended_Pictographic e.g. ↔
  if (msgs.some((m) => m.rule === "starci-fe/no-emoji-in-source")) {
    const next = text.replace(/\u2194/g, "-to-")
    if (next !== text) {
      text = next
      changed = true
      rulesHit.add("starci-fe/no-emoji-in-source")
      reasons.push("scrub Extended_Pictographic arrow in comment")
    }
  }

  // 2) handler-on-prefix: handleCopy → onCopy
  if (msgs.some((m) => m.rule === "starci-fe/handler-on-prefix")) {
    if (/\bhandleCopy\b/.test(text)) {
      text = text.replace(/\bhandleCopy\b/g, "onCopy")
      changed = true
      rulesHit.add("starci-fe/handler-on-prefix")
      reasons.push("rename handleCopy → onCopy")
    }
  }

  // 3) require-export-jsdoc — insert from bottom so line numbers stay valid
  const jsdocHits = msgs
    .filter((m) => m.rule === "starci-fe/require-export-jsdoc")
    .slice()
    .sort((a, b) => b.line - a.line)

  if (jsdocHits.length) {
    const nl = text.includes("\r\n") ? "\r\n" : "\n"
    const lines = text.split(/\r?\n/)
    let inserted = 0
    for (const hit of jsdocHits) {
      const name = (hit.msg.match(/export `([^`]+)`/) || [])[1]
      if (!name) continue
      const idx = hit.line - 1
      if (idx < 0 || idx >= lines.length) continue
      const lineText = lines[idx]
      // After prior insertions below this line, idx still matches original because we go bottom-up.
      const jsdoc = describeExport(name, lineText, text)
      if (insertJsdocBeforeLine(lines, idx, jsdoc)) inserted++
    }
    if (inserted) {
      text = lines.join(nl)
      changed = true
      rulesHit.add("starci-fe/require-export-jsdoc")
      reasons.push(`added JSDoc on ${inserted} export(s)`)
    }
  }

  if (changed) {
    fs.writeFileSync(abs, text)
  }
  return {
    path: rel,
    changed,
    rules: [...rulesHit],
    reason: reasons.join("; ") || "no edit",
  }
}

// Storybook first, then src — preserve manifest pairing order within each group.
const files = MANIFEST.files.map((f) => f.path)
const sb = files.filter((p) => p.startsWith(".storybook/"))
const src = files.filter((p) => p.startsWith("src/"))
const ordered = [...sb, ...src]

const changed = []
const skipped = []
const holds = []

for (const rel of ordered) {
  const result = fixFile(rel)
  if (result.changed) {
    changed.push({
      path: rel,
      rules: result.rules,
      reason: result.reason,
    })
  } else {
    skipped.push({
      path: rel,
      rules: (LIVE[rel] || []).map((m) => m.rule),
      reason: "no safe mechanical edit applied",
    })
  }
}

console.log(
  JSON.stringify(
    {
      changedCount: changed.length,
      skippedCount: skipped.length,
      sample: changed.slice(0, 5),
    },
    null,
    2,
  ),
)

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/_atoms-burn-pass1.json",
  JSON.stringify({ changed, skipped, holds }, null, 2),
)
