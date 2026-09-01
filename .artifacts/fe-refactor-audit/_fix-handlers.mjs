/**
 * SAFE mechanical burn for handler-on-prefix only.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const { byRule } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-authoring-eligible.json", "utf8"),
)

const changed = []
const skipped = []

const fixHandlerFile = (rel, hits) => {
    const abs = path.join(ROOT, rel)
    let src = fs.readFileSync(abs, "utf8")
    const renames = new Map()
    for (const h of hits) {
        const m = h.message.match(/`(\w+)` → rename to `(\w+)`/)
        if (!m) continue
        renames.set(m[1], m[2])
    }
    for (const [from, to] of renames) {
        const constTo = new RegExp(`\\b(?:const|let|function|var)\\s+${to}\\b`)
        const constFrom = new RegExp(`\\b(?:const|let|function|var)\\s+${from}\\b`)
        if (constTo.test(src) && constFrom.test(src)) {
            skipped.push({ file: rel, reason: `handler collision ${from}→${to}` })
            return
        }
        src = src.replace(new RegExp(`\\b${from}\\b`, "g"), to)
    }
    fs.writeFileSync(abs, src)
    changed.push(rel)
}

const handlerHits = byRule["starci-fe/handler-on-prefix"] || []
const byFile = {}
for (const h of handlerHits) {
    if (!byFile[h.file]) byFile[h.file] = []
    byFile[h.file].push(h)
}
for (const [file, hits] of Object.entries(byFile)) {
    fixHandlerFile(file, hits)
}

console.log(JSON.stringify({ changed, skipped }, null, 2))
