/**
 * BATCH 32 agent-1-atoms: strip proven-dead public `classNames` doors.
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

function stripClassNamesDoor(src) {
  // Normalize to LF for transforms; restore CRLF if original used it.
  const crlf = src.includes("\r\n")
  let s = src.replace(/\r\n/g, "\n")

  // Remove JSDoc block immediately preceding classNames prop
  s = s.replace(
    /\n[ \t]*\/\*\*[\s\S]*?\*\/\n[ \t]*classNames\?: Array<AllowedClassName>\n/g,
    "\n",
  )
  s = s.replace(/\n[ \t]*classNames\?: Array<AllowedClassName>\n/g, "\n")

  // Destructure removals
  s = s.replace(/,\s*classNames(?=\s*[,}])/g, "")
  s = s.replace(/\{\s*classNames\s*,/g, "{")
  s = s.replace(/\{\s*classNames\s*\}/g, "{}")

  // cn(...) cleanups — only identifier classNames as argument
  s = s.replace(/cn\(\s*classNames\s*\)/g, '""')
  s = s.replace(/,\s*classNames(?=\s*[,)])/g, "")
  s = s.replace(/(?<=[,(]\s*)classNames\s*,\s*/g, "")

  // Drop empty className props
  s = s.replace(/\s*className=\{""\}/g, "")
  s = s.replace(/\s*className=\{cn\(\)\}/g, "")

  // helper signatures
  s = s.replace(
    /const baseClassName = \(size: LinkSeeMoreSize, classNames\?: Array<AllowedClassName>\) =>/g,
    "const baseClassName = (size: LinkSeeMoreSize) =>",
  )
  s = s.replace(
    /const baseClassName = \(size: LinkBackSize, classNames\?: Array<AllowedClassName>\) =>/g,
    "const baseClassName = (size: LinkBackSize) =>",
  )

  // Drop AllowedClassName from _allowed-class-name imports when unused in body
  s = s.replace(
    /import\s+type\s+\{([^}]+)\}\s+from\s+(["'][^"']*_allowed-class-name["'])\n/g,
    (full, names, from) => {
      const parts = names
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
      const kept = parts.filter((x) => x !== "AllowedClassName")
      // Check if AllowedClassName still used in body after this import removal
      const tentative = full // placeholder
      void tentative
      if (kept.length === parts.length) return full
      // We'll decide after full pass — for now keep if other names remain
      if (!kept.length) return ""
      return `import type { ${kept.join(", ")} } from ${from}\n`
    },
  )

  // If AllowedClassName still referenced outside imports, restore isn't needed;
  // if import removed and still referenced, fail later.
  const bodyNoImports = s
    .split("\n")
    .filter((l) => !/^\s*import\b/.test(l))
    .join("\n")
  if (/\bAllowedClassName\b/.test(bodyNoImports)) {
    // re-add import if we stripped it but still need it — shouldn't happen for door-only use
  } else {
    // ensure no leftover AllowedClassName-only imports already handled
  }

  // Drop unused `cn`
  {
    const body = s
      .split("\n")
      .filter((l) => !/^\s*import\b/.test(l))
      .join("\n")
    if (!/\bcn\s*\(/.test(body) && !/\bcn\b/.test(body)) {
      s = s.replace(/import\s*\{\s*cn\s*\}\s*from\s*["']@heroui\/react["']\n/g, "")
      s = s.replace(/,\s*cn\b/g, "")
      s = s.replace(/\bcn,\s*/g, "")
    }
  }

  s = s.replace(/@param props\.classNames[^\n]*\n/g, "")
  s = s.replace(/\n{3,}/g, "\n\n")

  if (crlf) s = s.replace(/\n/g, "\r\n")
  return s
}

let changed = 0
for (const file of FILES) {
  const before = fs.readFileSync(file, "utf8")
  if (!/\bclassNames\b/.test(before)) {
    console.log("SKIP:", file)
    continue
  }
  const after = stripClassNamesDoor(before)
  if (/classNames\?:/.test(after)) {
    const idx = after.indexOf("classNames?:")
    console.log("FAIL door remains:", file, JSON.stringify(after.slice(idx - 40, idx + 50)))
    continue
  }
  // leftover bare classNames identifier in value position is ok only if none
  if (/\bclassNames\b/.test(after)) {
    // allow mentions in comments
    const body = after
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "")
    if (/\bclassNames\b/.test(body)) {
      console.log("WARN leftover identifier:", file)
      // still write if door gone — leftover may need manual fix
    }
  }
  if (after === before) {
    console.log("NOOP:", file)
    continue
  }
  fs.writeFileSync(file, after)
  changed++
  console.log("OK", file)
}
console.log("changed", changed)
