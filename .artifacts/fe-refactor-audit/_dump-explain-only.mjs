import fs from "node:fs"

const d = JSON.parse(
    fs.readFileSync(
        new URL("./eslint-arch-burn-baseline.json", import.meta.url),
        "utf8",
    ),
)

const hits = []
for (const f of d) {
    if (!f.messages) continue
    for (const m of f.messages) {
        if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
        if (m.message.includes("declares `principle` but no `explain`")) {
            const rel = f.filePath.replace(/\\/g, "/").replace(/^.*starci-academy\//, "")
            hits.push({
                file: rel,
                line: m.line,
                col: m.column,
                tag: (m.message.match(/`<(\w+)>`/) || [])[1],
            })
        }
    }
}

console.log("count", hits.length)
const byFile = {}
for (const h of hits) byFile[h.file] = (byFile[h.file] || 0) + 1
Object.entries(byFile)
    .sort((a, b) => b[1] - a[1])
    .forEach(([f, c]) => console.log(c, f))
console.log("---ALL---")
hits.forEach((h) => console.log(`${h.file}:${h.line}:${h.col} ${h.tag}`))
fs.writeFileSync(
    new URL("./_explain-only-hits.json", import.meta.url),
    JSON.stringify(hits, null, 2),
)
