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

for (const file of FILES) {
  let s = fs.readFileSync(file, "utf8")
  const before = s

  // Un-glue last interface/type prop from closing brace: `foo?: bar}` → `foo?: bar\n}`
  s = s.replace(/^([ \t]+[A-Za-z_][\w]*\??: .+)\}$/gm, "$1\n}")

  // Ensure blank line after import block before file header when missing
  s = s.replace(/(from\s+["'][^"']+["']\s*)\n(\/\*\*)/g, "$1\n\n$2")

  // Logo: drop unused AllowedClassName import; keep JSDoc mention without import
  if (file.includes("/Logo/")) {
    s = s.replace(/import type \{ AllowedClassName \} from ["'][^"']+_allowed-class-name["']\s*\n/g, "")
    s = s.replace(
      /`h-8`\/`h-10` are not in \{@link AllowedClassName\}\./g,
      "`h-8`/`h-10` are not placement utilities.",
    )
  }

  // Simplify cn("single") → "single" for className= only when one string literal arg
  s = s.replace(/className=\{cn\(("(?:\\.|[^"\\])*")\)\}/g, "className={$1}")

  if (s !== before) {
    fs.writeFileSync(file, s)
    console.log("fixed", file)
  } else {
    console.log("ok", file)
  }
}
