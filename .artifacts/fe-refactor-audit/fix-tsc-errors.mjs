import fs from "node:fs"

const buttonGroupFiles = [
    ".storybook/components/composites/feedback/ConfirmDialog/ConfirmDialog.tsx",
    "src/components/composites/feedback/ConfirmDialog/index.tsx",
    ".storybook/components/nivoexpert/blocks/studio/ConfirmDialog/ConfirmDialog.tsx",
    ".storybook/components/nivoexpert/overlays/modals/RefundOrderModal/RefundOrderModal.tsx",
]
for (const f of buttonGroupFiles) {
    let s = fs.readFileSync(f, "utf8")
    const before = s
    s = s.replace(/<ButtonGroup(\s+)align="end"/g, "<ButtonGroup$1principle=\"flex-action-end\"")
    s = s.replace(/<ButtonGroup(\s+)align="start"/g, "<ButtonGroup$1principle=\"flex-action-start\"")
    s = s.replace(/<ButtonGroup(\s+)align="between"/g, "<ButtonGroup$1principle=\"flex-action-between\"")
    if (s !== before) {
        fs.writeFileSync(f, s)
        console.log("buttonGroup", f)
    }
}

for (const f of [
    ".storybook/components/composites/form/Form/Form.tsx",
    "src/components/composites/form/Form/index.tsx",
]) {
    let s = fs.readFileSync(f, "utf8")
    s = s.replace(/\n\s*explain="[^"]*"/g, "")
    fs.writeFileSync(f, s)
    console.log("stripped explain", f)
}
