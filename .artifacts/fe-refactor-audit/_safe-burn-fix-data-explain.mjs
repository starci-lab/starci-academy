/**
 * Fix false positives: regex matched inside `data-principle="…"`, inserting
 * invalid `explain=` on DOM nodes. Convert those to `data-explain=`.
 */
import fs from "node:fs"
import path from "node:path"

function walk(dir, out = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.name === "node_modules" || ent.name === ".git" || ent.name === ".next") continue
        const p = path.join(dir, ent.name)
        if (ent.isDirectory()) walk(p, out)
        else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) out.push(p)
    }
    return out
}

const roots = ["src/components", ".storybook/components"]
const files = roots.flatMap((r) => (fs.existsSync(r) ? walk(r) : []))

let fixed = 0
const changed = []

for (const file of files) {
    let src = fs.readFileSync(file, "utf8")
    const before = src

    // Case 1: data-principle="…" followed by explain="…" (same tag) → data-explain
    src = src.replace(
        /(data-principle=["'][a-z0-9-]+["'])(\s*)explain=/g,
        "$1$2data-explain=",
    )

    // Case 2: data-principle on previous line, explain on next
    src = src.replace(
        /(data-principle=["'][a-z0-9-]+["'])\n(\s*)explain=/g,
        "$1\n$2data-explain=",
    )

    if (src !== before) {
        fs.writeFileSync(file, src)
        fixed++
        changed.push(file.replace(/\\/g, "/"))
    }
}

console.log(JSON.stringify({ fixed, changed: changed.length, sample: changed.slice(0, 30) }, null, 2))
