import fs from "node:fs"

function findOpeningEnd(src, start, rootTag) {
    let j = start
    let depth = 0
    let inStr = null
    let end = -1
    for (; j < src.length; j++) {
        const ch = src[j]
        if (inStr) {
            if (ch === "\\") {
                j++
                continue
            }
            if (ch === inStr) inStr = null
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") {
            inStr = ch
            continue
        }
        if (ch === "{") {
            depth++
            continue
        }
        if (ch === "}") {
            depth = Math.max(0, depth - 1)
            continue
        }
        if (depth === 0 && ch === ">") {
            end = j
            break
        }
    }
    return { end, slice: end >= 0 ? src.slice(start, Math.min(end + 1, start + 200)) : null, len: end >= 0 ? end - start : -1 }
}

for (const [file, rootTag] of [
    ["src/components/blocks/learn/KeepGoingPath/index.tsx", "SurfaceCardList"],
    ["src/components/pages/FlashcardsPage/FlashcardReviewModeModal/index.tsx", "ModalShell"],
]) {
    const src = fs.readFileSync(file, "utf8")
    const idx = src.indexOf(`<${rootTag}`)
    const r = findOpeningEnd(src, idx, rootTag)
    console.log(file, r)
    if (r.end >= 0) {
        const opening = src.slice(idx, r.end + 1)
        console.log("has identity", /\bidentity=/.test(opening))
        console.log("opening head", JSON.stringify(opening.slice(0, 120)))
        console.log("opening tail", JSON.stringify(opening.slice(-80)))
    }
}
