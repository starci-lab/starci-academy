import fs from "node:fs"

const effects = ["Bubbles", "Ember", "Fireflies", "Rain", "Snow", "Stars"]
for (const name of effects) {
    const rel = `src/components/blocks/layout/AmbientBackground/effects/${name}Effect.tsx`
    const raw = fs.readFileSync(rel, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    let descIdx = -1
    let propsIdx = -1
    let exportIdx = -1
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("/** ") && !lines[i].includes("Props for") && descIdx < 0) descIdx = i
        if (lines[i].includes("Props for") && lines[i].startsWith("/**")) propsIdx = i
        if (lines[i].startsWith(`export const ${name}Effect`)) exportIdx = i
    }
    console.log(name, { descIdx, propsIdx, exportIdx })
    if (descIdx >= 0 && propsIdx === descIdx + 1 && exportIdx > 0) {
        const descLine = lines[descIdx]
        lines.splice(descIdx, 1)
        exportIdx = lines.findIndex((l) => l.startsWith(`export const ${name}Effect`))
        lines.splice(exportIdx, 0, descLine)
        fs.writeFileSync(rel, lines.join(nl))
        console.log("  wrote", rel)
    }
}

{
    const rel = "src/components/blocks/rendering/MarkdownContent/TabsBlock/index.tsx"
    const raw = fs.readFileSync(rel, "utf8")
    const nl = raw.includes("\r\n") ? "\r\n" : "\n"
    const lines = raw.split(/\r?\n/)
    // Find block comment before interface TabPaneProps and move after interface
    let start = -1
    let end = -1
    let ifaceEnd = -1
    for (let i = 0; i < lines.length; i++) {
        if (start < 0 && lines[i].startsWith("/**") && lines[i + 1]?.includes("One pane inside")) start = i
        if (start >= 0 && end < 0 && lines[i].trim() === "*/") end = i
        if (lines[i].startsWith("interface TabPaneProps")) {
            // find closing }
            for (let j = i; j < lines.length; j++) {
                if (lines[j] === "}") {
                    ifaceEnd = j
                    break
                }
            }
            break
        }
    }
    if (start >= 0 && end >= 0 && ifaceEnd > end) {
        const block = lines.slice(start, end + 1)
        // remove block + following blank if any
        let removeEnd = end
        if (lines[end + 1] === "") removeEnd = end + 1
        lines.splice(start, removeEnd - start + 1)
        // recompute ifaceEnd
        ifaceEnd = lines.findIndex((l, idx) => idx > 0 && lines[idx - 1]?.startsWith("interface TabPaneProps") === false && false)
        const ifaceLine = lines.findIndex((l) => l.startsWith("interface TabPaneProps"))
        let close = ifaceLine
        for (let j = ifaceLine; j < lines.length; j++) {
            if (lines[j] === "}") {
                close = j
                break
            }
        }
        lines.splice(close + 1, 0, "", ...block)
        fs.writeFileSync(rel, lines.join(nl))
        console.log("fixed TabPane")
    } else {
        console.log("TabPane miss", { start, end, ifaceEnd })
    }
}
