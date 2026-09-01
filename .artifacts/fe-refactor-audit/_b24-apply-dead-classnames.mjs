/**
 * BATCH 24 — line-based removal of proven-dead classNames/className doors.
 * Avoids greedy regex that can eat interfaces.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const verified = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b24-verified-dead.json"), "utf8"))
const priorLog = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b24-apply-log.json"), "utf8"))

const HOLD_SUBSTR = [
  "/SurfaceCard/",
  "/DrawerShell/",
  "/ModalShell/",
  "/ShowcaseMockup/",
  "/MiniCart/",
  "/CvPreview/",
  "/PDFView/",
  "/Box/",
  "/Stack/",
  "/Grid/",
  "/nivo/",
  "/nivoexpert/",
  "/LearnLoopScroll/",
  "/Button/",
  "/Chip/",
  "/Avatar/",
  "/Typography/",
]

function twinOf(file) {
  const f = file.replace(/\\/g, "/")
  const m = f.match(/^\.storybook\/components\/(.+)\/([^/]+)\.tsx$/)
  if (!m) return null
  const dir = m[1]
  const candidate = "src/components/" + dir + "/index.tsx"
  return fs.existsSync(path.join(ROOT, candidate)) ? candidate : null
}

/**
 * Remove classNames/className door with line awareness.
 */
function stripDoor(source, prop) {
  const lines = source.split("\n")
  const out = []
  let i = 0
  let changed = false

  const isPropLine = (line) => {
    if (prop === "classNames") return /^\s*classNames\?:\s*Array<AllowedClassName>\s*$/.test(line)
    if (prop === "className") return /^\s*className\?:\s*string\s*$/.test(line)
    return false
  }

  const isPlacementJsdocStart = (line) =>
    /^\s*\/\*\*/.test(line) &&
    (lines[i + 1] || "").includes("Where this sits inside its parent")

  while (i < lines.length) {
    const line = lines[i]

    // Remove placement JSDoc immediately followed (after its close) by the prop line
    if (/^\s*\/\*\*/.test(line)) {
      let j = i
      const block = []
      while (j < lines.length) {
        block.push(lines[j])
        if (/\*\//.test(lines[j])) break
        j++
      }
      const blockText = block.join("\n")
      const after = lines[j + 1]
      if (
        blockText.includes("Where this sits inside its parent") &&
        after &&
        isPropLine(after)
      ) {
        // skip jsdoc + prop
        i = j + 2
        changed = true
        continue
      }
      // keep jsdoc as-is
      out.push(...block)
      i = j + 1
      continue
    }

    if (isPropLine(line)) {
      changed = true
      i++
      continue
    }

    // Destructuring / param lists: drop ", classNames" or "classNames," or lone classNames
    let next = line
    if (prop === "classNames") {
      const prev = next
      next = next.replace(/,\s*classNames\b/g, "")
      next = next.replace(/\bclassNames,\s*/g, "")
      // lone in { classNames } 
      next = next.replace(/\{\s*classNames\s*\}/g, "{}")
      // classNames={classNames}
      next = next.replace(/\s*classNames=\{classNames\}/g, "")
      if (next !== prev) changed = true
    } else if (prop === "className") {
      const prev = next
      next = next.replace(/,\s*className\b(?!\s*=)/g, "")
      next = next.replace(/\bclassName,\s*/g, "")
      next = next.replace(/\{\s*className\s*\}/g, "{}")
      next = next.replace(/\s*className=\{className\}/g, "")
      if (next !== prev) changed = true
    }

    // tidy cn( foo , ) 
    next = next.replace(/cn\(([^)\n]*),\s*\)/g, "cn($1)")

    out.push(next)
    i++
  }

  let s = out.join("\n")

  // Drop AllowedClassName import only if unused
  if (!/\bAllowedClassName\b/.test(s)) {
    const before = s
    s = s
      .split("\n")
      .filter((l) => !/import type \{ AllowedClassName \} from /.test(l))
      .join("\n")
    if (s !== before) changed = true
  }

  // collapse 3+ blank lines
  s = s.replace(/\n{4,}/g, "\n\n\n")

  return { next: s, changed }
}

const applyFiles = new Map()
for (const d of verified.items) {
  if (HOLD_SUBSTR.some((h) => d.file.includes(h))) continue
  applyFiles.set(d.file, d.prop)
  const twin = d.twinExists ? d.twin : twinOf(d.file)
  if (twin) applyFiles.set(twin, d.prop)
}

const shared = [
  [".storybook/components/atoms/forms/_input/types.ts", "classNames"],
  ["src/components/atoms/forms/_input/types.ts", "classNames"],
  [".storybook/components/atoms/forms/_select/types.ts", "classNames"],
  ["src/components/atoms/forms/_select/types.ts", "classNames"],
  [".storybook/components/atoms/forms/_input/FieldSkeleton.tsx", "classNames"],
  ["src/components/atoms/forms/_input/FieldSkeleton.tsx", "classNames"],
]
for (const [f, p] of shared) {
  if (fs.existsSync(path.join(ROOT, f))) applyFiles.set(f, p)
}

for (const name of [
  "InputText",
  "InputPassword",
  "InputTextarea",
  "InputSearch",
  "SelectSingle",
  "SelectMulti",
  "SelectCombobox",
]) {
  const sb = `.storybook/components/atoms/forms/${name}/${name}.tsx`
  const src = `src/components/atoms/forms/${name}/index.tsx`
  if (fs.existsSync(path.join(ROOT, sb))) applyFiles.set(sb, "classNames")
  if (fs.existsSync(path.join(ROOT, src))) applyFiles.set(src, "classNames")
}

const results = { changed: [], skipped: [], errors: [] }

for (const [rel, prop] of applyFiles) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) {
    results.skipped.push({ file: rel, reason: "missing" })
    continue
  }
  const src = fs.readFileSync(abs, "utf8")
  if (!new RegExp(`\\b${prop}\\b`).test(src)) {
    results.skipped.push({ file: rel, reason: "no-prop-token" })
    continue
  }
  try {
    const { next, changed } = stripDoor(src, prop)
    if (!changed) {
      results.skipped.push({ file: rel, reason: "noop" })
      continue
    }
    // sanity: file must still parse-ish — balanced braces roughly
    const opens = (next.match(/\{/g) || []).length
    const closes = (next.match(/\}/g) || []).length
    if (Math.abs(opens - closes) > 2) {
      results.errors.push({ file: rel, error: `brace imbalance ${opens}/${closes}` })
      continue
    }
    fs.writeFileSync(abs, next)
    results.changed.push({ file: rel, prop })
  } catch (e) {
    results.errors.push({ file: rel, error: String(e) })
  }
}

fs.writeFileSync(path.join(ART, "2026-08-09-b24-apply-log.json"), JSON.stringify(results, null, 2))
console.log(
  JSON.stringify(
    {
      changed: results.changed.length,
      skipped: results.skipped.length,
      errors: results.errors,
      sample: results.changed.slice(0, 15).map((c) => c.file),
    },
    null,
    2,
  ),
)
