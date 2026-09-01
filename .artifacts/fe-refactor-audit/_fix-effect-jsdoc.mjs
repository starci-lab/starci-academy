import fs from "node:fs"

const effects = ["Bubbles", "Ember", "Fireflies", "Rain", "Snow", "Stars"]
for (const name of effects) {
    const rel = `src/components/blocks/layout/AmbientBackground/effects/${name}Effect.tsx`
    let src = fs.readFileSync(rel, "utf8")
    const descRe = /\/\*\* ([^*]+) \*\/\n\/\*\* Props for/
    const m = src.match(descRe)
    if (!m) {
        console.log("skip", rel)
        continue
    }
    const desc = m[1]
    src = src.replace(descRe, "/** Props for")
    src = src.replace(
        new RegExp(`export const ${name}Effect =`),
        `/** ${desc} */\nexport const ${name}Effect =`,
    )
    fs.writeFileSync(rel, src)
    console.log("fixed", rel)
}
