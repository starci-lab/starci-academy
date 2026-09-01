import fs from "node:fs"

for (const file of [
    "src/components/blocks/learn/KeepGoingPath/index.tsx",
    "src/components/pages/FlashcardsPage/FlashcardReviewModeModal/index.tsx",
]) {
    const src = fs.readFileSync(file, "utf8")
    const rootTag = file.includes("KeepGoing") ? "SurfaceCardList" : "ModalShell"
    const tagRe = new RegExp(`<${rootTag}(?=[\\s/>])`, "g")
    let m
    let n = 0
    while ((m = tagRe.exec(src))) {
        n++
        const look = src.slice(Math.max(0, m.index - 120), m.index)
        const isReturn2 =
            /return[\s\S]*$/.test(look) &&
            !/;\s*$/.test(look.trim()) &&
            (/return\s*\(\s*$/.test(look) ||
                /return\s*$/.test(look) ||
                /return\s*\(\s*(?:\/\/[^\n]*\n\s*)*$/.test(look) ||
                /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*$/.test(look))
        console.log({
            file,
            n,
            isReturn2,
            lookTail: JSON.stringify(look.slice(-60)),
            tests: {
                a: /return\s*\(\s*$/.test(look),
                b: /return\s*$/.test(look),
                hasReturn: /return[\s\S]*$/.test(look),
                endsSemi: /;\s*$/.test(look.trim()),
            },
        })
    }
    console.log(file, "hits", n)
}
