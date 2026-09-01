import fs from "fs"

const FILES = [
  ".storybook/components/atoms/display/Badge/Badge.tsx",
  "src/components/atoms/display/Badge/index.tsx",
  ".storybook/components/atoms/display/Progress/Progress.tsx",
  "src/components/atoms/display/Progress/index.tsx",
  ".storybook/components/atoms/display/IconTile/IconTile.tsx",
  "src/components/atoms/display/IconTile/index.tsx",
  ".storybook/components/atoms/navigation/Breadcrumbs/Breadcrumbs.tsx",
  "src/components/atoms/navigation/Breadcrumbs/index.tsx",
  ".storybook/components/atoms/overlay/Menu/Menu.tsx",
  "src/components/atoms/overlay/Menu/index.tsx",
  ".storybook/components/atoms/navigation/Link/LinkBack.tsx",
  "src/components/atoms/navigation/Link/LinkBack.tsx",
  ".storybook/components/atoms/navigation/Link/LinkSeeMore.tsx",
  "src/components/atoms/navigation/Link/LinkSeeMore.tsx",
  ".storybook/components/atoms/media/QRCode/QRCode.tsx",
  "src/components/atoms/media/QRCode/index.tsx",
  ".storybook/components/atoms/navigation/Accordion/Accordion.tsx",
  "src/components/atoms/navigation/Accordion/index.tsx",
  ".storybook/components/atoms/navigation/Pagination/Pagination.tsx",
  "src/components/atoms/navigation/Pagination/index.tsx",
  ".storybook/components/atoms/navigation/Tabs/TabsBase.tsx",
  "src/components/atoms/navigation/Tabs/TabsBase.tsx",
]

for (const f of FILES) {
  let s = fs.readFileSync(f, "utf8")
  const before = s
  s = s.replace(/className=\{("(?:\\.|[^"\\])*")\}/g, "className=$1")
  if (s !== before) {
    fs.writeFileSync(f, s)
    console.log("literal", f)
  }
}
