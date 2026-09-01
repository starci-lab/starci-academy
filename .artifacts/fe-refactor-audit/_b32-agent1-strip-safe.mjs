/**
 * Safe strip: only remove the immediate classNames door + its adjacent JSDoc,
 * then clean destructure/cn usages. Never match across the whole file.
 */
import fs from "fs"

const FILES = [
  ".storybook/components/atoms/display/Badge/Badge.tsx",
  "src/components/atoms/display/Badge/index.tsx",
  ".storybook/components/atoms/display/IconTile/IconTile.tsx",
  "src/components/atoms/display/IconTile/index.tsx",
  ".storybook/components/atoms/display/Logo/Logo.tsx",
  "src/components/atoms/display/Logo/index.tsx",
  ".storybook/components/atoms/display/Spinner/Spinner.tsx",
  "src/components/atoms/display/Spinner/index.tsx",
  ".storybook/components/atoms/media/QRCode/QRCode.tsx",
  "src/components/atoms/media/QRCode/index.tsx",
  ".storybook/components/atoms/navigation/Accordion/Accordion.tsx",
  "src/components/atoms/navigation/Accordion/index.tsx",
  ".storybook/components/atoms/navigation/Breadcrumbs/Breadcrumbs.tsx",
  "src/components/atoms/navigation/Breadcrumbs/index.tsx",
  ".storybook/components/atoms/navigation/Link/LinkBack.tsx",
  "src/components/atoms/navigation/Link/LinkBack.tsx",
  ".storybook/components/atoms/navigation/Link/LinkSeeMore.tsx",
  "src/components/atoms/navigation/Link/LinkSeeMore.tsx",
  ".storybook/components/atoms/navigation/Pagination/Pagination.tsx",
  "src/components/atoms/navigation/Pagination/index.tsx",
  ".storybook/components/atoms/navigation/Tabs/TabsBase.tsx",
  "src/components/atoms/navigation/Tabs/TabsBase.tsx",
  ".storybook/components/atoms/overlay/Menu/Menu.tsx",
  "src/components/atoms/overlay/Menu/index.tsx",
  ".storybook/components/atoms/display/Progress/Progress.tsx",
  "src/components/atoms/display/Progress/index.tsx",
]

function removePropDoors(s) {
  // Remove each `classNames?: Array<AllowedClassName>` and its immediately
  // preceding JSDoc if that JSDoc ends right before the prop.
  const propRe = /[ \t]*classNames\?: Array<AllowedClassName>\r?\n/g
  let out = ""
  let last = 0
  let m
  while ((m = propRe.exec(s))) {
    const propStart = m.index
    // Look back for `/** ... */` ending with only whitespace before prop
    const before = s.slice(0, propStart)
    const jsdocEnd = before.lastIndexOf("*/")
    let removeFrom = propStart
    if (jsdocEnd !== -1) {
      const between = before.slice(jsdocEnd + 2)
      if (/^\s*$/.test(between)) {
        const jsdocStart = before.lastIndexOf("/**", jsdocEnd)
        if (jsdocStart !== -1) {
          // Only strip if this JSDoc is short (door docs), not a huge header
          const jsdoc = before.slice(jsdocStart, jsdocEnd + 2)
          if (jsdoc.length < 600 && /className|classNames|Where this sits|Position within the parent|additional positioning/i.test(jsdoc)) {
            removeFrom = jsdocStart
            // include leading newline/indent on the JSDoc line
            while (removeFrom > 0 && (s[removeFrom - 1] === " " || s[removeFrom - 1] === "\t")) removeFrom--
            if (s[removeFrom - 1] === "\n") removeFrom--
            if (s[removeFrom - 1] === "\r") removeFrom--
          }
        }
      }
    }
    out += s.slice(last, removeFrom)
    last = propStart + m[0].length
  }
  out += s.slice(last)
  return out
}

function cleanUsages(s) {
  // Destructure: `, classNames` or `classNames,` or sole
  s = s.replace(/,\s*\r?\n(\s*)classNames(?=\s*[,}])/g, "")
  s = s.replace(/,\s*classNames(?=\s*[,}])/g, "")
  s = s.replace(/(\{)\s*classNames\s*,\s*/g, "$1")
  s = s.replace(/\{\s*classNames\s*\}/g, "{}")

  // cn(classNames) → remove className prop entirely when it's the only arg
  s = s.replace(/\s*className=\{cn\(classNames\)\}/g, "")
  // cn("...", classNames) / cn(classNames, "...")
  s = s.replace(/cn\(([^)]*?),\s*classNames\s*\)/g, "cn($1)")
  s = s.replace(/cn\(\s*classNames\s*,\s*([^)]*?)\)/g, "cn($1)")

  // helper param
  s = s.replace(
    /const baseClassName = \(size: (LinkSeeMoreSize|LinkBackSize), classNames\?: Array<AllowedClassName>\) =>/g,
    "const baseClassName = (size: $1) =>",
  )
  // call sites baseClassName(size, classNames) → baseClassName(size)
  s = s.replace(/baseClassName\(([^,)]+),\s*classNames\)/g, "baseClassName($1)")

  // @param props.classNames lines
  s = s.replace(/[ \t]*\* @param props\.classNames[^\n]*\r?\n/g, "")

  return s
}

function cleanImports(s) {
  // Remove AllowedClassName from type imports when unused in body
  const body = s.replace(/import\s+type\s+\{[^}]+\}\s+from\s+["'][^"']+_allowed-class-name["']\s*;?\s*/g, "")
  const needsAllowed = /\bAllowedClassName\b/.test(body)
  if (!needsAllowed) {
    s = s.replace(
      /import\s+type\s+\{([^}]+)\}\s+from\s+(["'][^"']*_allowed-class-name["'])\s*;?\s*\r?\n/g,
      (_, names, from) => {
        const kept = names
          .split(",")
          .map((x) => x.trim())
          .filter((x) => x && x !== "AllowedClassName")
        if (!kept.length) return ""
        return `import type { ${kept.join(", ")} } from ${from}\n`
      },
    )
  }

  // Remove unused cn
  const noImportBody = s
    .split(/\r?\n/)
    .filter((l) => !/^\s*import\b/.test(l))
    .join("\n")
  if (!/\bcn\s*\(/.test(noImportBody)) {
    s = s.replace(/import\s*\{\s*cn\s*\}\s*from\s*["']@heroui\/react["']\s*;?\s*\r?\n/g, "")
    // from multi-import
    s = s.replace(/,\s*cn\b/g, "")
    s = s.replace(/\bcn,\s*/g, "")
  }

  return s
}

let changed = 0
for (const file of FILES) {
  const before = fs.readFileSync(file, "utf8")
  let after = removePropDoors(before)
  after = cleanUsages(after)
  after = cleanImports(after)
  // collapse excessive blank lines (keep max 2)
  after = after.replace(/(\r?\n){3,}/g, "\n\n")

  if (/classNames\?:/.test(after)) {
    console.log("FAIL door:", file)
    continue
  }
  const code = after.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "")
  if (/\bclassNames\b/.test(code)) {
    console.log("WARN leftover classNames ident:", file)
  }
  if (after === before) {
    console.log("NOOP", file)
    continue
  }
  // sanity: file should still contain key export markers
  if (file.includes("Spinner") && !/SpinnerBase|export \{ Spinner/.test(after) && !/export \{ SpinnerBase/.test(after)) {
    console.log("FAIL spinner broken", file)
    continue
  }
  if (file.includes("Progress") && !/ProgressBar/.test(after)) {
    console.log("FAIL progress broken", file)
    continue
  }
  fs.writeFileSync(file, after)
  changed++
  console.log("OK", file, before.length, "->", after.length)
}
console.log("changed", changed)
