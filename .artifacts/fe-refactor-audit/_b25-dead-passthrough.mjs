/**
 * BATCH 25 — find wrappers that declare className/classNames but never
 * read/forward them (dead passthrough), AND call sites that pass props
 * the component ignores.
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
    } else if (/\.(tsx|ts)$/.test(ent.name) && !ent.name.includes(".stories.")) out.push(p)
  }
  return out
}

const roots = [
  path.join(ROOT, ".storybook/components"),
  path.join(ROOT, "src/components"),
]
const files = roots.flatMap((r) => walk(r))

/**
 * Heuristic: file declares `className` or `classNames` in props type/destructure
 * but body never references the identifier after destructure (except type).
 * This is soft — only flag clear cases.
 */
const deadPassthrough = []
const usedButMaybeRedundant = []

for (const abs of files) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  const rel = i >= 0 ? n.slice(i + 1) : n
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")

  // Skip if no public className/classNames in exported props
  const hasDecl =
    /\bclassNames\??\s*:/.test(text) ||
    /\bclassName\??\s*:/.test(text) ||
    /WithClassNames/.test(text)
  if (!hasDecl) continue

  // Destructure patterns
  const dest =
    text.match(/\(\s*\{([^}]{0,800})\}\s*(?::\s*\w+[^=]*)?\s*\)\s*(?:=>|\{)/) ||
    text.match(/function\s+\w+\s*\(\s*\{([^}]{0,800})\}/)
  if (!dest) continue
  const params = dest[1]
  const hasClassNames = /\bclassNames\b/.test(params)
  const hasClassName = /\bclassName\b/.test(params)
  if (!hasClassNames && !hasClassName) continue

  // Body after first function open — crude: whole file counts of identifier use
  // Count occurrences of classNames / className outside type positions
  const body = text
  const countId = (id) => {
    const re = new RegExp(`\\b${id}\\b`, "g")
    return (body.match(re) || []).length
  }
  // If only appears in type + destructure (≤3) and never in JSX/spread, likely dead
  if (hasClassNames) {
    const c = countId("classNames")
    // type decl + destructure + maybe WithClassNames = low count without usage
    const usedInJsx =
      /classNames=\{/.test(text) ||
      /\{\s*\.\.\..*classNames/.test(text) ||
      /cn\([^)]*classNames/.test(text) ||
      /twMerge\([^)]*classNames/.test(text) ||
      /clsx\([^)]*classNames/.test(text) ||
      /\.\.\.\s*classNames/.test(text) ||
      /className=\{[^}]*classNames/.test(text) ||
      /\[\s*\.\.\.\(classNames/.test(text) ||
      /\[\s*\.\.\.classNames/.test(text) ||
      /\(classNames\s*\?\?/.test(text) ||
      /classNames\s*&&/.test(text) ||
      /classNames\s*\.join/.test(text) ||
      /\[classNames\]/.test(text) ||
      /, classNames[,)}]/.test(text.replace(params, "")) // rest spread unlikely

    // More reliable: after removing type blocks, is classNames used in expressions?
    const stripped = text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/type\s+\w+[^=]*=[\s\S]*?(?=\n(?:export|type|const|function|interface))/g, "")
      .replace(/interface\s+\w+[^{]*\{[\s\S]*?\}/g, "")
    const exprUses = (stripped.match(/\bclassNames\b/g) || []).length
    // destructure always counts 1; need ≥2 for real use
    if (exprUses <= 1) {
      deadPassthrough.push({
        file: rel,
        prop: "classNames",
        exprUses,
        totalMentions: c,
      })
    }
  }
  if (hasClassName) {
    const stripped = text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/type\s+\w+[^=]*=[\s\S]*?(?=\n(?:export|type|const|function|interface))/g, "")
      .replace(/interface\s+\w+[^{]*\{[\s\S]*?\}/g, "")
    const exprUses = (stripped.match(/\bclassName\b/g) || []).length
    if (exprUses <= 1) {
      deadPassthrough.push({
        file: rel,
        prop: "className",
        exprUses,
        totalMentions: countId("className"),
      })
    }
  }
}

// Also: call sites passing className to components that B24 already deleted the door from
// Would show as TS excess property — scan for known deleted doors if we have a list
const b24 = path.join(ART, "2026-08-09-b24-status.json")
let deletedDoors = []
if (fs.existsSync(b24)) {
  try {
    const j = JSON.parse(fs.readFileSync(b24, "utf8"))
    deletedDoors = j.deletedDoors || j.applied || []
  } catch {}
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b25-dead-passthrough.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      deadPassthroughCount: deadPassthrough.length,
      deadPassthrough: deadPassthrough.slice(0, 100),
      note: "Heuristic — verify each before deleting prop or call-site",
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      deadPassthrough: deadPassthrough.length,
      sample: deadPassthrough.slice(0, 40),
    },
    null,
    2,
  ),
)
