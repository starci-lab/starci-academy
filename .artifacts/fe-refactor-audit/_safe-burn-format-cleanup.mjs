import fs from "node:fs"

const result = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-explain-result.json", "utf8"),
)
const files = new Set([
    ...result.files,
    ...result.hardCases.map((h) => h.file),
    "src/components/blocks/cards/MediaCard/index.tsx",
    "src/components/blocks/learn/ContinueCard/index.tsx",
    "src/components/blocks/learn/VariantChip/index.tsx",
    "src/components/blocks/layout/shell/Navbar/AccountMenuDropdown/DarkLightMode/index.tsx",
    "src/components/blocks/learn/lesson/ContentBody/ContentBodyV2/Discussion/index.tsx",
    "src/components/blocks/learn/personal-project/TaskResult/index.tsx",
    "src/components/atoms/buttons/ButtonGroup/index.tsx",
    ".storybook/components/atoms/buttons/ButtonGroup/ButtonGroup.tsx",
])

let cleaned = 0
for (const file of files) {
    if (!fs.existsSync(file)) continue
    const before = fs.readFileSync(file, "utf8")
    let src = before
    src = src.replace(
        /(principle=["'][a-z0-9-]+["'])\n\s*\n(\s*explain=)/g,
        "$1\n$2",
    )
    src = src.replace(
        /(^(\s*)principle=["'][a-z0-9-]+["'])\n\s+(explain=)/gm,
        "$1\n$2$3",
    )
    if (src !== before) {
        fs.writeFileSync(file, src)
        cleaned++
    }
}
console.log("cleaned", cleaned, "of", files.size)
