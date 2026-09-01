/**
 * Convert module-level function declarations to arrow consts.
 * Skips TypeScript overload sequences (same name declared >1 time).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const { byRule } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-authoring-eligible.json", "utf8"),
)

const files = [...new Set((byRule["starci-fe/prefer-arrow-export"] || []).map((h) => h.file))]
const changed = []
const skipped = []

const findMatchingBrace = (src, openIdx) => {
    let depth = 0
    for (let i = openIdx; i < src.length; i++) {
        const ch = src[i]
        if (ch === "{") depth++
        else if (ch === "}") {
            depth--
            if (depth === 0) return i
        }
    }
    return -1
}

const convertFile = (rel) => {
    const abs = path.join(ROOT, rel)
    let src = fs.readFileSync(abs, "utf8")
    const original = src

    // Count function decl names at module level (including overload sigs)
    const nameCounts = {}
    for (const m of src.matchAll(/(?:^|\n)(?:export\s+(?:default\s+)?)?function\s+(\w+)/g)) {
        nameCounts[m[1]] = (nameCounts[m[1]] || 0) + 1
    }
    const overloaded = new Set(
        Object.entries(nameCounts)
            .filter(([, c]) => c > 1)
            .map(([n]) => n),
    )
    if (overloaded.size) {
        skipped.push({ file: rel, reason: `overload: ${[...overloaded].join(", ")}` })
    }

    const defaultExportsToAdd = []

    // Walk matches from end to start so offsets stay valid
    const matches = [...src.matchAll(/(^|\n)([ \t]*)(export\s+default\s+function\s+|export\s+function\s+|function\s+)(\w+)/g)]
    for (let mi = matches.length - 1; mi >= 0; mi--) {
        const m = matches[mi]
        const name = m[4]
        if (overloaded.has(name)) continue

        const indent = m[2]
        // Only module-level (no indent) — nested functions are out of scope for this rule
        // but the rule only flags Program/Export parents, so indented ones shouldn't appear.
        // Keep converting even with indent if it's the reported form.

        const kind = m[3]
        const start = m.index + m[1].length // start of indent/keyword
        const nameStart = m.index + m[1].length + indent.length + kind.length
        // Find the `{` that opens the body: scan from after name
        let i = nameStart + name.length
        // skip whitespace already handled; find first `{` not inside strings — naive scan
        let inStr = null
        let bodyOpen = -1
        while (i < src.length) {
            const ch = src[i]
            if (inStr) {
                if (ch === "\\") {
                    i += 2
                    continue
                }
                if (ch === inStr) inStr = null
                i++
                continue
            }
            if (ch === "\"" || ch === "'" || ch === "`") {
                inStr = ch
                i++
                continue
            }
            if (ch === "{") {
                bodyOpen = i
                break
            }
            // Overload signature ends at newline without `{`
            if (ch === "\n" && !src.slice(nameStart, i).includes("(")) break
            i++
        }
        if (bodyOpen < 0) continue

        const header = src.slice(start, bodyOpen) // includes indent + keyword + name + params + return type
        // Extract params+return from header after the name
        const afterName = header.slice(indent.length + kind.length + name.length)
        // afterName is like `(...): Ret ` or `(\n...): Ret `

        let replacement
        if (kind.startsWith("export default")) {
            replacement = `${indent}const ${name} = ${afterName.trimStart()}=> `
            defaultExportsToAdd.push(name)
        } else if (kind.startsWith("export function")) {
            replacement = `${indent}export const ${name} = ${afterName.trimStart()}=> `
        } else {
            replacement = `${indent}const ${name} = ${afterName.trimStart()}=> `
        }

        src = src.slice(0, start) + replacement + src.slice(bodyOpen)
    }

    // Append export default Name for converted defaults
    for (const name of defaultExportsToAdd) {
        if (!new RegExp(`export\\s+default\\s+${name}\\b`).test(src)) {
            src = src.replace(/\s*$/, `\n\nexport default ${name}\n`)
        }
    }

    if (src !== original) {
        fs.writeFileSync(abs, src)
        changed.push(rel)
    }
}

for (const f of files) convertFile(f)
console.log(JSON.stringify({ changed, skipped }, null, 2))
