import fs from "fs"

function stripUseClient(src) {
  return src.replace(/^["']use client["'];?\r?\n\r?\n?/, "")
}

function splitImportsAndBody(src) {
  const lines = src.split(/\r?\n/)
  const imports = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (
      trimmed.startsWith("import ") ||
      (imports.length &&
        !imports[imports.length - 1].includes(" from ") &&
        (trimmed.startsWith("{") ||
          trimmed.startsWith("}") ||
          trimmed.startsWith("type ") ||
          trimmed.endsWith(",") ||
          /^[A-Za-z0-9_,\s]+$/.test(trimmed)))
    ) {
      let block = line
      // gather until statement complete (has from "..."; or side-effect import done)
      while (
        i + 1 < lines.length &&
        (!/from\s+["']/.test(block) ||
          ((block.match(/{/g) || []).length > (block.match(/}/g) || []).length))
      ) {
        // side-effect import: import "x"
        if (/^import\s+["']/.test(block.trim()) && block.includes(";")) break
        if (/from\s+["'][^"']+["']\s*;?\s*$/.test(block) && (block.match(/{/g) || []).length <= (block.match(/}/g) || []).length)
          break
        i++
        block += "\n" + lines[i]
      }
      imports.push(block)
      i++
      continue
    }
    if (trimmed === "" && imports.length) {
      i++
      continue
    }
    break
  }
  return { imports, body: lines.slice(i).join("\n").replace(/^\n+/, "") }
}

function mergeChildren(parentPath, children, removeImportRes) {
  const parentRaw = fs.readFileSync(parentPath, "utf8")
  const hasClient = /^["']use client["']/.test(parentRaw)
  let parent = stripUseClient(parentRaw)
  for (const re of removeImportRes) parent = parent.replace(re, "")
  const parentParts = splitImportsAndBody(parent)

  const importMap = new Map()
  const add = (list) => {
    for (const imp of list) {
      const key = imp.replace(/\s+/g, " ").trim()
      if (!importMap.has(key)) importMap.set(key, imp)
    }
  }
  add(parentParts.imports)

  const bodies = []
  for (const childPath of children) {
    const raw = stripUseClient(fs.readFileSync(childPath, "utf8"))
    const parts = splitImportsAndBody(raw)
    add(parts.imports)
    bodies.push(parts.body.trimEnd())
    fs.unlinkSync(childPath)
    console.log("deleted", childPath)
    const dir = childPath.replace(/\\/g, "/").replace(/\/[^/]+$/, "")
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir)
      console.log("rmdir", dir)
    }
  }

  const out =
    (hasClient ? '"use client"\n\n' : "") +
    [...importMap.values()].join("\n") +
    "\n\n" +
    bodies.join("\n\n") +
    "\n\n" +
    parentParts.body.trimStart()
  fs.writeFileSync(parentPath, out.replace(/\n{3,}/g, "\n\n"))
  console.log("wrote", parentPath)
}

mergeChildren(
  "src/components/pages/CvEditorPage/index.tsx",
  ["src/components/pages/CvEditorPage/CvEditorToolbarBar/index.tsx"],
  [/import\s*\{[\s\S]*?\}\s*from\s*["']\.\/CvEditorToolbarBar["'];?\r?\n/],
)

mergeChildren(
  "src/components/pages/AiUsagePage/index.tsx",
  ["src/components/pages/AiUsagePage/AiUsageHistory/index.tsx"],
  [/import\s*\{[\s\S]*?\}\s*from\s*["']\.\/AiUsageHistory["'];?\r?\n/],
)

mergeChildren(
  "src/components/pages/ProfileActivityPage/index.tsx",
  [
    "src/components/pages/ProfileActivityPage/ProfileAchievements/index.tsx",
    "src/components/pages/ProfileActivityPage/ProfileActivity/index.tsx",
  ],
  [
    /import\s*\{[\s\S]*?\}\s*from\s*["']\.\/ProfileAchievements["'];?\r?\n/,
    /import\s*\{[\s\S]*?\}\s*from\s*["']\.\/ProfileActivity["'];?\r?\n/,
  ],
)

console.log("collapses done")
