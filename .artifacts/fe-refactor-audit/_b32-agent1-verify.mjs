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

for (const f of FILES) {
  const s = fs.readFileSync(f, "utf8")
  const issues = []
  if (/classNames\?:/.test(s)) issues.push("door")
  if (/:\s*\w+\}$/m.test(s) || /\|\s*"[^"]+"\}$/m.test(s)) issues.push("glued-brace?")
  const code = s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "")
  if (/\bclassNames\b/.test(code)) issues.push("classNames-ident")
  if (/AllowedClassName/.test(code) && !/AllowedClassName/.test(s.match(/import[\s\S]*?_allowed-class-name.*/)?.[0] || "")) {
    // referenced in code without import
  }
  if (/import type \{ AllowedClassName \}/.test(s) && !/\bAllowedClassName\b/.test(code.replace(/import type \{ AllowedClassName \} from .*/, ""))) {
    issues.push("unused-AllowedClassName-import")
  }
  // glued prop}
  if (/^[ \t]+\w+\??: .+\}$/m.test(s)) issues.push("glued-prop")
  console.log(issues.length ? `ISSUE ${f}: ${issues.join(",")}` : `clean ${f}`)
}
