/**
 * SAFE mechanical burn for handler-on-prefix + prefer-arrow-export.
 * Does not touch locked/held paths (already filtered in eligible JSON).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const { byRule } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-authoring-eligible.json", "utf8"),
)

const changed = new Set()
const skipped = []

/** Rename handleXxx → onXxx with word boundaries; skip if target already declared. */
const fixHandlerFile = (rel, hits) => {
    const abs = path.join(ROOT, rel)
    let src = fs.readFileSync(abs, "utf8")
    const renames = new Map()
    for (const h of hits) {
        const m = h.message.match(/`(\w+)` → rename to `(\w+)`/)
        if (!m) continue
        renames.set(m[1], m[2])
    }
    for (const [from, to] of renames) {
    // Collision: existing binding named `to` that isn't the rename target
        const toRe = new RegExp(`\\b${to}\\b`)
        const fromRe = new RegExp(`\\b${from}\\b`, "g")
        if (toRe.test(src) && !fromRe.test(src.replace(fromRe, "<<<RENAMED>>>"))) {
            // If `to` already exists independently, still OK if it's the prop being called —
            // only skip when renaming would create duplicate const declarations.
            const constTo = new RegExp(`\\b(?:const|let|function|var)\\s+${to}\\b`)
            const constFrom = new RegExp(`\\b(?:const|let|function|var)\\s+${from}\\b`)
            if (constTo.test(src) && constFrom.test(src)) {
                skipped.push({ file: rel, reason: `handler collision ${from}→${to}` })
                return false
            }
        }
        src = src.replace(fromRe, to)
    }
    fs.writeFileSync(abs, src)
    changed.add(rel)
    return true
}

/**
 * Convert module-level `function Name(...) {` / `export function` / `export default function`
 * to arrow const. Skips overload sequences (two+ FunctionDeclarations with same name).
 */
const convertFunctionDecls = (rel) => {
    const abs = path.join(ROOT, rel)
    let src = fs.readFileSync(abs, "utf8")
    const original = src

    // Detect overload: export function foo(...): T  (no body) followed by another
    // Simple heuristic: lines matching `^export function Name` appearing >1 time for same name
    const nameCounts = {}
    for (const m of src.matchAll(/^(?:export\s+(?:default\s+)?)?function\s+(\w+)/gm)) {
        nameCounts[m[1]] = (nameCounts[m[1]] || 0) + 1
    }
    const overloaded = new Set(Object.entries(nameCounts).filter(([, c]) => c > 1).map(([n]) => n))
    if (overloaded.size) {
        skipped.push({
            file: rel,
            reason: `prefer-arrow-export overload(s): ${[...overloaded].join(", ")}`,
        })
    }

    // Process from bottom to top via match positions to keep offsets stable
    const re =
    /^(export\s+default\s+function\s+(\w+)\s*(\([^)]*\))\s*(?::\s*[^{\n]+)?\s*\{)|(export\s+function\s+(\w+)\s*(\([^)]*\))\s*(?::\s*[^{\n]+)?\s*\{)|(function\s+(\w+)\s*(\([^)]*\))\s*(?::\s*[^{\n]+)?\s*\{)/gm

    // Simpler line-oriented conversion for common patterns
    const lines = src.split("\n")
    const out = []
    let i = 0
    while (i < lines.length) {
        const line = lines[i]
        const trimmed = line.trimStart()
        const indent = line.slice(0, line.length - trimmed.length)

        // Skip overload signature lines (no `{` on the signature line / ends with type only)
        const overloadSig =
      /^(export\s+)?function\s+(\w+)\s*\([^)]*\)\s*:\s*.+$/.test(trimmed) &&
      !trimmed.includes("{")
        if (overloadSig) {
            out.push(line)
            i++
            continue
        }

        let m
        if ((m = trimmed.match(/^export\s+default\s+function\s+(\w+)\s*(\([\s\S]*)$/))) {
            const name = m[1]
            if (overloaded.has(name)) {
                out.push(line)
                i++
                continue
            }
            // Find rest of signature until `{`
            let sig = trimmed
            let j = i
            while (!sig.includes("{") && j + 1 < lines.length) {
                j++
                sig += "\n" + lines[j]
            }
            const sm = sig.match(
                /^export\s+default\s+function\s+(\w+)\s*(\([\s\S]*?\))\s*(:\s*[\s\S]+?)?\s*\{([\s\S]*)$/,
            )
            if (!sm) {
                out.push(line)
                i++
                continue
            }
            const params = sm[2]
            const ret = sm[3] || ""
            const afterBrace = sm[4] || ""
            // Collect body until matching brace — we rewrite only the header line(s)
            out.push(`${indent}const ${name} = ${params}${ret} => {${afterBrace}`)
            // skip consumed lines
            for (let k = i + 1; k <= j; k++) {
                /* consumed into sig */
            }
            i = j + 1
            // close: need export default at end — mark for post-pass
            // We'll add `export default Name` after the function body if not present
            continue
        }

        if ((m = trimmed.match(/^export\s+function\s+(\w+)\s*/))) {
            const name = m[1]
            if (overloaded.has(name)) {
                out.push(line)
                i++
                continue
            }
            let sig = trimmed
            let j = i
            while (!sig.includes("{") && j + 1 < lines.length) {
                j++
                sig += "\n" + lines[j]
            }
            const sm = sig.match(
                /^export\s+function\s+(\w+)\s*(\([\s\S]*?\))\s*(:\s*[\s\S]+?)?\s*\{([\s\S]*)$/,
            )
            if (!sm) {
                out.push(line)
                i++
                continue
            }
            out.push(`${indent}export const ${sm[1]} = ${sm[2]}${sm[3] || ""} => {${sm[4] || ""}`)
            i = j + 1
            continue
        }

        if ((m = trimmed.match(/^function\s+(\w+)\s*/))) {
            const name = m[1]
            if (overloaded.has(name)) {
                out.push(line)
                i++
                continue
            }
            // Only convert if this is at module level (indent is empty or we're not inside a block)
            // Heuristic: indent length 0
            if (indent.length > 0) {
                out.push(line)
                i++
                continue
            }
            let sig = trimmed
            let j = i
            while (!sig.includes("{") && j + 1 < lines.length) {
                j++
                sig += "\n" + lines[j]
            }
            const sm = sig.match(
                /^function\s+(\w+)\s*(\([\s\S]*?\))\s*(:\s*[\s\S]+?)?\s*\{([\s\S]*)$/,
            )
            if (!sm) {
                out.push(line)
                i++
                continue
            }
            out.push(`${indent}const ${sm[1]} = ${sm[2]}${sm[3] || ""} => {${sm[4] || ""}`)
            i = j + 1
            continue
        }

        out.push(line)
        i++
    }

    src = out.join("\n")

    // For export default function conversions, ensure `export default Name` exists
    // Detect names we converted from export default
    if (original.includes("export default function")) {
        const defNames = [...original.matchAll(/export\s+default\s+function\s+(\w+)/g)].map(
            (x) => x[1],
        )
        for (const name of defNames) {
            if (overloaded.has(name)) continue
            if (src.includes(`export default function ${name}`)) continue
            if (new RegExp(`export\\s+default\\s+${name}\\b`).test(src)) continue
            // append before end if const Name exists
            if (new RegExp(`const\\s+${name}\\s*=`).test(src)) {
                src = src.replace(/\s*$/, `\n\nexport default ${name}\n`)
            }
        }
    }

    if (src !== original) {
        fs.writeFileSync(abs, src)
        changed.add(rel)
        return true
    }
    return false
}

// ── handlers ──
const handlerHits = byRule["starci-fe/handler-on-prefix"] || []
const byFile = {}
for (const h of handlerHits) {
    if (!byFile[h.file]) byFile[h.file] = []
    byFile[h.file].push(h)
}
for (const [file, hits] of Object.entries(byFile)) {
    fixHandlerFile(file, hits)
}

// ── prefer-arrow-export ──
const arrowHits = byRule["starci-fe/prefer-arrow-export"] || []
const arrowFiles = [...new Set(arrowHits.map((h) => h.file))]
for (const file of arrowFiles) {
    convertFunctionDecls(file)
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-authoring-pass1.json",
    JSON.stringify({ changed: [...changed].sort(), skipped }, null, 2),
)
console.log("changed", changed.size)
console.log("skipped", skipped)
