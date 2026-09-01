import fs from "node:fs"

const file = "src/components/blocks/learn/KeepGoingPath/index.tsx"
const src = fs.readFileSync(file, "utf8")
const start = src.indexOf("<SurfaceCardList")
let depth = 0
let inStr = null
const events = []
for (let j = start; j < src.length && j < start + 5000; j++) {
    const ch = src[j]
    if (inStr) {
        if (ch === "\\") {
            j++
            continue
        }
        if (ch === inStr) {
            inStr = null
            events.push({ j, ch: "ENDSTR", depth })
        }
        continue
    }
    if (ch === "\"" || ch === "'" || ch === "`") {
        inStr = ch
        events.push({ j, ch: "STR" + ch, depth })
        continue
    }
    if (ch === "{") {
        depth++
        if (events.length < 40) events.push({ j, ch: "{", depth, ctx: JSON.stringify(src.slice(j - 10, j + 15)) })
        continue
    }
    if (ch === "}") {
        depth = Math.max(0, depth - 1)
        if (events.length < 80) events.push({ j, ch: "}", depth, ctx: JSON.stringify(src.slice(j - 10, j + 15)) })
        continue
    }
    if (depth === 0 && ch === ">") {
        events.push({ j, ch: ">", depth, DONE: true })
        break
    }
    if (depth === 0 && ch === "/" && src[j + 1] === ">") {
        events.push({ j, ch: "/>", depth, DONE: true })
        break
    }
}
console.log("final depth", depth, "events", events.length)
console.log(events.slice(0, 30))
console.log("...")
console.log(events.slice(-20))
// show if we ever hit depth 0 after start
let d = 0
let inS = null
let lastZero = start
for (let j = start + "<SurfaceCardList".length; j < src.length; j++) {
    const ch = src[j]
    if (inS) {
        if (ch === "\\") { j++; continue }
        if (ch === inS) inS = null
        continue
    }
    if (ch === "\"" || ch === "'" || ch === "`") { inS = ch; continue }
    if (ch === "{") d++
    if (ch === "}") d = Math.max(0, d - 1)
    if (d === 0) {
        lastZero = j
        if (ch === ">" || (ch === "/" && src[j+1] === ">")) {
            console.log("FOUND at", j, JSON.stringify(src.slice(j - 30, j + 5)))
            break
        }
    }
}
console.log("lastZero ctx", JSON.stringify(src.slice(lastZero - 40, lastZero + 40)))
