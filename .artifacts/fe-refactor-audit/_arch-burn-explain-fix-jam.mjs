/**
 * Fix jammed attrs after explain="...": missing space before next attribute.
 * Also normalize indent of explain lines to match sibling attrs.
 */
import fs from "node:fs"

const r = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json", "utf8"),
)

let filesFixed = 0
let sites = 0

for (const file of r.files) {
    if (!fs.existsSync(file)) continue
    let src = fs.readFileSync(file, "utf8")
    const before = src

    // explain="..."className= / items= / justify= etc → insert space
    src = src.replace(
        /(explain=(["'])(?:\\.|(?!\2).)*\2)([A-Za-z_{])/g,
        (_, explain, _q, next) => {
            sites++
            return `${explain} ${next}`
        },
    )

    // Same for data-explain
    src = src.replace(
        /(data-explain=(["'])(?:\\.|(?!\2).)*\2)([A-Za-z_{])/g,
        (_, explain, _q, next) => {
            sites++
            return `${explain} ${next}`
        },
    )

    if (src !== before) {
        fs.writeFileSync(file, src)
        filesFixed++
    }
}

console.log(JSON.stringify({ filesFixed, sites }, null, 2))
