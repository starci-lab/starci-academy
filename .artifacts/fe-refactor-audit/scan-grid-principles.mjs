import fs from "fs"
import path from "path"

function walk(d, a = []) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name)
        if (e.isDirectory() && e.name !== "node_modules") walk(f, a)
        else if (f.endsWith(".tsx")) a.push(f)
    }
    return a
}

const tokenStep = {
    "name-handle": 1,
    "icon-text": 2,
    "separator-dot": 2,
    "title-subtitle": 2,
    "flex-action": 3,
    "flex-action-center": 3,
    "identity": 3,
    "identity-end": 3,
    "value-row": 3,
    "chip-row": 3,
    "sibling-stack": 3,
    "label-field": 4,
    "content-row": 4,
    "card-caption": 4,
    "group-boundary": 5,
    "block-boundary": 6,
    "layout-split": 7,
    "marketing-beat": 8,
}

const files = [...walk(".storybook/components"), ...walk("src/components")]
for (const file of files) {
    const src = fs.readFileSync(file, "utf8")
    // multiline Grid tags
    const re = /<Grid\b([\s\S]*?)>/g
    let m
    while ((m = re.exec(src))) {
        const tag = m[1]
        if (tag.includes("</")) continue
        const prin = (tag.match(/principle\s*=\s*"([^"]+)"/) || [])[1]
        const gap = (tag.match(/gap\s*=\s*\{(\d+)\}/) || [])[1]
        if (!prin) continue
        const line = src.slice(0, m.index).split("\n").length
        const ts = tokenStep[prin]
        const gs = gap ? Number(gap) : null
        const match = gs == null ? "no-gap" : ts === gs ? "MATCH" : "MISMATCH"
        console.log(`${match}\t${path.relative(".", file)}:${line}\tprinciple=${prin}\tgap=${gap ?? "-"}\ttokenStep=${ts}`)
    }
}
