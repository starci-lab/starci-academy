/**
 * B33 agent-4: strip dead StackH/StackV escapes when the SAME tag declares principle.
 * Attribute scan stops at items=/body= so nested frames cannot leak ownership.
 */
import fs from "node:fs"

const files = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json", "utf8"),
).manifests["agent-4-stack-flex-cluster"].files

const DEAD_LINE =
    /^\s*(gap|padding|align|justify|classNames)=(("[^"]*")|('[^']*')|(\{[^{}]*\}))\s*$/

function stripInline(line) {
    return line.replace(
        /\s(gap|padding|align|justify|classNames)=(("[^"]*")|('[^']*')|(\{[^{}]*\}))/g,
        "",
    )
}

function emitAttrs(lines, indexes, out) {
    let changed = false
    for (const idx of indexes) {
        const line = lines[idx]
        if (DEAD_LINE.test(line)) {
            changed = true
            continue
        }
        const cleaned = stripInline(line)
        if (cleaned !== line) changed = true
        if (cleaned.trim() === "" && line.trim() !== "") continue
        out.push(cleaned)
    }
    return changed
}

function processFile(src) {
    const lines = src.split(/\n/)
    const out = []
    let i = 0
    let changed = false

    while (i < lines.length) {
        if (!/^\s*<(StackH|StackV)\b/.test(lines[i])) {
            out.push(lines[i])
            i++
            continue
        }

        let j = i
        let hasPrinciple = false
        const ownAttrIndexes = []

        while (j < lines.length && j < i + 30) {
            const line = lines[j]
            const itemsIdx = line.search(/\b(items|body)\s*=/)

            if (itemsIdx >= 0) {
                // Attribute fragment before items=/body=
                const before = line.slice(0, itemsIdx)
                if (/\bprinciple\s*=/.test(before) || ownAttrIndexes.some((idx) => /\bprinciple\s*=/.test(lines[idx])) || /\bprinciple\s*=/.test(lines[i])) {
                    hasPrinciple = true
                }
                // Also detect principle on earlier collected lines
                for (const idx of ownAttrIndexes) {
                    if (/\bprinciple\s*=/.test(lines[idx])) hasPrinciple = true
                }
                if (/\bprinciple\s*=/.test(lines[i])) hasPrinciple = true
                if (/\bprinciple\s*=/.test(before)) hasPrinciple = true

                if (hasPrinciple) {
                    if (emitAttrs(lines, ownAttrIndexes, out)) changed = true
                    // opening line is in ownAttrIndexes if we pushed it — ensure i was pushed
                } else {
                    for (const idx of ownAttrIndexes) out.push(lines[idx])
                }

                if (hasPrinciple) {
                    const cleanedBefore = stripInline(before)
                    if (cleanedBefore !== before) changed = true
                    // Drop whole-line dead prop that somehow sat before items=
                    if (DEAD_LINE.test(before.trim()) && before.trim().length > 0) {
                        changed = true
                        out.push(line.slice(itemsIdx))
                    } else {
                        out.push(cleanedBefore + line.slice(itemsIdx))
                    }
                } else {
                    out.push(line)
                }
                i = j + 1
                break
            }

            if (/\bprinciple\s*=/.test(line)) hasPrinciple = true
            ownAttrIndexes.push(j)

            // Close without items/body
            if (j > i && /\/?>\s*$/.test(line) && !line.includes("=>")) {
                if (hasPrinciple) {
                    if (emitAttrs(lines, ownAttrIndexes, out)) changed = true
                } else {
                    for (const idx of ownAttrIndexes) out.push(lines[idx])
                }
                i = j + 1
                break
            }

            j++
            if (j === i + 30) {
                // give up — copy opening line only and advance one
                out.push(lines[i])
                i++
                break
            }
        }

        // If loop exhausted without break from items/close — safety
        if (j >= i + 30 && out[out.length - 1] !== lines[i] && !ownAttrIndexes.length) {
            out.push(lines[i])
            i++
        }
    }

    return { text: out.join("\n"), changed }
}

let n = 0
for (const f of files) {
    if (!fs.existsSync(f)) continue
    const src = fs.readFileSync(f, "utf8")
    if (!/<(StackH|StackV)\b/.test(src) || !/\bprinciple=/.test(src)) continue
    const { text, changed } = processFile(src)
    if (changed && text !== src) {
        fs.writeFileSync(f, text)
        console.log("stripped", f)
        n++
    }
}
console.log("updated", n)
