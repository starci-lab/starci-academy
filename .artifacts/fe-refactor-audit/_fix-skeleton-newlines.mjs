import fs from "node:fs"

const j = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_overlap-skeleton-apply.json", "utf8"),
)
let fixed = 0
for (const file of j.changed) {
    let src = fs.readFileSync(file, "utf8")
    const before = src
    src = src.replace(
        /from "(@\/components\/blocks\/skeleton\/Skeleton)"import /g,
        'from "$1"\nimport ',
    )
    src = src.replace(
        /from '(@\/components\/blocks\/skeleton\/Skeleton)'import /g,
        "from '$1'\nimport ",
    )
    if (src !== before) {
        fs.writeFileSync(file, src)
        fixed++
        console.log("fixed", file)
    } else if (src.includes('Skeleton"import') || src.includes("Skeleton'import")) {
        console.log("STILL BAD", file)
    } else {
        console.log("clean", file)
    }
}
console.log("fixed", fixed)
