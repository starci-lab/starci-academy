import fs from "fs"

const FILES = [
  ".storybook/components/atoms/media/QRCode/QRCode.tsx",
  "src/components/atoms/media/QRCode/index.tsx",
  ".storybook/components/atoms/navigation/Accordion/Accordion.tsx",
  "src/components/atoms/navigation/Accordion/index.tsx",
  ".storybook/components/atoms/navigation/Pagination/Pagination.tsx",
  "src/components/atoms/navigation/Pagination/index.tsx",
  ".storybook/components/atoms/navigation/Tabs/TabsBase.tsx",
  "src/components/atoms/navigation/Tabs/TabsBase.tsx",
]

for (const file of FILES) {
  let s = fs.readFileSync(file, "utf8")
  // drop cn from heroui imports
  s = s.replace(/import\s*\{\s*cn,\s*/g, "import { ")
  s = s.replace(/,\s*cn\s*\}/g, " }")
  s = s.replace(/,\s*cn\s*,/g, ",")
  // className={"literal"} → className="literal"
  s = s.replace(/className=\{("(?:\\.|[^"\\])*")\}/g, "className=$1")
  // stale classNames leaf docs
  s = s.replace(
    / `classNames` gets no leaf either: it only places the atom inside its parent, never changing\r?\n \* how the atom looks\.\r?\n \*/g,
    "\n */",
  )
  fs.writeFileSync(file, s)
  console.log("cleaned", file)
}
