const fs = require("fs")
const path = require("path")
function walk(d, out) {
    out = out || []
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name)
        if (e.isDirectory()) {
            if (e.name === "node_modules" || e.name === ".git" || e.name === ".next") continue
            walk(p, out)
        } else if (/\.tsx?$/.test(e.name)) out.push(p)
    }
    return out
}
const files = walk("src").concat(walk(".storybook"))
let filesFixed = 0
const em = "\u2014"
const bad1 = " \uFFFD?\" "
const bad2 = "\uFFFD?\""
const bad3 = "\uFFFD\""
const bad4 = "\uFFFD?"
const bad5 = "\uFFFD"
for (const file of files) {
    let src = fs.readFileSync(file, "utf8")
    if (src.indexOf("explain=") < 0 && src.indexOf("\uFFFD") < 0) continue
    const before = src
    src = src.split(bad1).join(" " + em + " ")
    src = src.split(bad2).join(em)
    src = src.split(bad3).join(em)
    src = src.split(bad4).join(em)
    src = src.split(bad5).join(em)
    if (src !== before) {
        fs.writeFileSync(file, src)
        filesFixed++
    }
}
console.log(JSON.stringify({ filesFixed: filesFixed }))