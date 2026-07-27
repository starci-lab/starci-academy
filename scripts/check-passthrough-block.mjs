#!/usr/bin/env node
/**
 * GATE — a block must EARN its layer. No block that only forwards.
 *
 * WHY NOW. Deleting the design tier let a block import another block, which is the right
 * model (`block = knows the domain`, and one domain thing can be built from another). But it
 * removes the only thing that used to stop a chain: under the old rule a block could not wrap
 * a block, so depth was capped by the type system rather than by discipline.
 *
 * Without a replacement, nothing prevents `A` wrapping `B` wrapping `C`, each layer adding a
 * rename and nothing else. That shape already appeared twice in one session: `ContinueLearning`
 * existed only to assemble two sentences before handing them to `ContinueCard`, and
 * `AsyncContent.Empty` existed only to set a default icon before handing off to `Feedback.Empty`.
 * Both read as architecture and were bookkeeping.
 *
 * WHAT COUNTS AS EARNING IT. A block that renders exactly ONE child component must add
 * domain knowledge of its own: a business condition, a decision, or a rule. Formatting a
 * string is not enough on its own, because a formatter is presentation work that belongs to
 * whoever draws the thing.
 *
 * ⚠️ Heuristic, and deliberately loud rather than blocking: "adds domain knowledge" is a
 * judgement no regex settles. It exits 0 and reports, so a real passthrough gets argued about
 * instead of silently shipped.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(process.argv[2] ?? ".storybook")

const walk = (d, out = []) => {
    if (!fs.existsSync(d)) return out
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name)
        if (e.isDirectory()) { if (e.name !== "_legacy" && e.name !== "node_modules") walk(p, out) }
        else if (e.name.endsWith(".tsx") && !e.name.endsWith(".stories.tsx")) out.push(p)
    }
    return out
}
const rel = (f) => path.relative(process.cwd(), f).split(path.sep).join("/")

/** A real decision, not a rename: a branch on data, or a self-hide. */
const DECIDES = /return null|\bif\s*\(|\?\s*[A-Za-z"'`{]/

const rows = []
for (const file of walk(path.join(ROOT, "components", "blocks"))) {
    const raw = fs.readFileSync(file, "utf8")
    const code = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")
    if (/Object\.assign/.test(code) && !/<[A-Z]/.test(code)) continue // namespace index only

    const kids = [...new Set([...code.matchAll(/<([A-Z][\w.]*)[\s/>]/g)].map((m) => m[1].split(".")[0]))]
        .filter((n) => !["React", "Fragment"].includes(n))
    if (kids.length !== 1) continue

    const lines = code.split("\n").filter((l) => l.trim()).length
    const decides = DECIDES.test(code)
    // Template strings are FORMATTING, which is presentation. On their own they do not make a
    // layer worth existing, so a block whose only contribution is `${}` is still a passthrough.
    const onlyFormats = /`[^`]*\$\{/.test(code) && !decides

    if (!decides || onlyFormats) {
        rows.push({ f: rel(file), child: kids[0], lines, onlyFormats })
    }
}

console.log(`blocks that only forward to ONE child: ${rows.length}\n`)
for (const r of rows) {
    console.log(`  ${r.f}`)
    console.log(`     wraps <${r.child}>, ${r.lines} lines${r.onlyFormats ? ", contributes only string formatting" : ", contributes no decision"}`)
}
if (rows.length) console.log(`\nEither give it a decision of its own, or fold it into the child it wraps.`)
