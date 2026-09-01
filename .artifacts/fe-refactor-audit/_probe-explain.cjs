const fs = require("fs")
const s = fs.readFileSync("src/components/blocks/learn/RatingBar/index.tsx", "utf8")
let idx = 0; let n = 0
while ((idx = s.indexOf("explain=", idx)) >= 0 && n < 3) {
    const slice = s.slice(idx, idx + 140)
    console.log("---", n, JSON.stringify(slice))
    idx += 8; n++
}
// count suspicious
const suspicious = (s.match(/\uFFFD/g) || []).length
console.log("fffd", suspicious)
const dash = (s.match(/\u2014/g) || []).length
console.log("emdash", dash)