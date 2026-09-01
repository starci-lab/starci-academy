import fs from "node:fs"

const PRINCIPLE_RE = /(?<![\w-])principle=(["'])([a-z0-9-]+)\1/g

function scanOpening(src, from) {
    let depth = 0,
        inStr = null,
        end = -1,
        attrText = ""
    for (let j = from; j < src.length; j++) {
        const ch = src[j]
        if (inStr) {
            if (ch === "\\") {
                j++
                continue
            }
            if (ch === inStr) inStr = null
            if (depth === 0) attrText += ch
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") {
            inStr = ch
            if (depth === 0) attrText += ch
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
        if (depth === 0) attrText += ch
    }
    return {
        end,
        hasExplain: /(?<![\w-])explain\s*=/.test(attrText),
        attrLen: attrText.length,
        attrPreview: attrText.slice(0, 240).replace(/\n/g, "\\n"),
    }
}

const file = "src/components/pages/RewardsPage/RewardCatalog/index.tsx"
const src = fs.readFileSync(file, "utf8")
const targets = [170, 254, 269, 285, 318]
let m
const re = new RegExp(PRINCIPLE_RE.source, "g")
while ((m = re.exec(src))) {
    const line = src.slice(0, m.index).split(/\n/).length
    if (!targets.some((t) => Math.abs(t - line) <= 5)) continue
    const sc = scanOpening(src, m.index)
    // also check: does opening ever end?
    console.log({
        line,
        token: m[2],
        hasExplain: sc.hasExplain,
        end: sc.end,
        attrLen: sc.attrLen,
        preview: sc.attrPreview,
    })
}

// also Page and DueReviewHero and CourseContents
for (const f of [
    "src/components/composites/layout/Page/index.tsx",
    "src/components/pages/FlashcardsPage/DueReviewHero/component.tsx",
    "src/components/pages/CourseContents/component.tsx",
    "src/components/blocks/commerce/PriceTag/PriceTagBase.tsx",
]) {
    console.log("\n===", f)
    const s = fs.readFileSync(f, "utf8")
    const r = new RegExp(PRINCIPLE_RE.source, "g")
    let mm
    while ((mm = r.exec(s))) {
        const sc = scanOpening(s, mm.index)
        if (sc.hasExplain) continue
        const line = s.slice(0, mm.index).split(/\n/).length
        console.log("missing explain", { line, token: mm[2], end: sc.end, preview: sc.attrPreview })
    }
}
