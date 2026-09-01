/**
 * Repair corrupted JSX where an opening tag was closed too early:
 *   <div>
 *     className={...}
 *   >
 * → <div
 *     className={...}
 *   >
 *
 * Also fixes a few known literal corruptions (em-dash in key compare, double >>).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = process.cwd()
const roots = [
    join(ROOT, "src"),
    join(ROOT, ".storybook", "components"),
]

function walk(dir, out = []) {
    for (const name of readdirSync(dir)) {
        if (name === "node_modules" || name === ".next") continue
        const p = join(dir, name)
        const st = statSync(p)
        if (st.isDirectory()) walk(p, out)
        else if (/\.(tsx|jsx)$/.test(name)) out.push(p)
    }
    return out
}

const files = roots.flatMap((r) => walk(r))
let changed = 0
const samples = []

for (const file of files) {
    let src = readFileSync(file, "utf8")
    const before = src

    // <TagName>\n  attr=  → <TagName\n  attr=
    // Only when next non-empty line looks like a JSX attribute start.
    src = src.replace(
        /<([A-Za-z][A-Za-z0-9.]*)>\r?\n([ \t]+)([A-Za-z_][A-Za-z0-9_-]*=)/g,
        "<$1\n$2$3",
    )

    // em-dash corruption in space key check
    src = src.replace(/event\.key === — "/g, "event.key === \" \"")

    // accidental double closing on ternary success lines
    src = src.replace(/: "success">>/g, ": \"success\"")

    if (src !== before) {
        writeFileSync(file, src)
        changed++
        if (samples.length < 15) samples.push(relative(ROOT, file).replace(/\\/g, "/"))
    }
}

console.log(JSON.stringify({ changed, samples }, null, 2))
