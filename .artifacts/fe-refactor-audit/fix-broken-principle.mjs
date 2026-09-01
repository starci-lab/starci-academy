import fs from "node:fs"
import path from "node:path"

function walk(d, a = []) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name)
        if (e.isDirectory() && e.name !== "node_modules" && e.name !== ".git") walk(f, a)
        else if (/\.(tsx|ts)$/.test(e.name)) a.push(f)
    }
    return a
}

let fixed = 0
for (const file of [...walk(".storybook"), ...walk("src")]) {
    let s = fs.readFileSync(file, "utf8")
    if (!s.includes("/ principle=")) continue
    const before = s
    // ' / principle="tok">' -> ' principle="tok" />'
    s = s.replace(/ \/ principle="([^"]+)">/g, " principle=\"$1\" />")
    if (s !== before) {
        fs.writeFileSync(file, s)
        fixed++
        console.log("fixed", path.relative(".", file))
    }
}
console.log("files", fixed)

// remaining?
for (const file of [...walk(".storybook"), ...walk("src")]) {
    const s = fs.readFileSync(file, "utf8")
    if (s.includes("/ principle=")) console.log("STILL", path.relative(".", file))
}
