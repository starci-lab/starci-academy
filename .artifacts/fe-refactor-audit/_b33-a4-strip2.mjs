/**
 * Improved strip: remove dead Stack props on principle-owned StackH/StackV.
 * Treats `=>` as not a tag closer.
 */
import fs from "node:fs"

const files = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json", "utf8"),
).manifests["agent-4-stack-flex-cluster"].files

function findOpenTagEnd(lines, start) {
    let depth = 0
    for (let li = start; li < Math.min(lines.length, start + 60); li++) {
        const line = lines[li]
        for (let j = 0; j < line.length; j++) {
            const c = line[j]
            const next = line[j + 1]
            if (c === "{") depth++
            else if (c === "}") depth--
            else if (c === ">" && depth === 0) {
                // skip `=>`
                if (j > 0 && line[j - 1] === "=") continue
                return { endLine: li, endCol: j }
            } else if (c === "/" && next === ">" && depth === 0) {
                return { endLine: li, endCol: j + 1 }
            }
        }
    }
    return null
}

function stripFile(source) {
    const lines = source.split(/\n/)
    const out = []
    let i = 0
    let changed = false

    while (i < lines.length) {
        if (!/<(StackH|StackV)\b/.test(lines[i])) {
            out.push(lines[i])
            i++
            continue
        }
        // Only process if this line opens the tag (not a mention in a comment)
        if (!/^\s*<(StackH|StackV)\b/.test(lines[i])) {
            out.push(lines[i])
            i++
            continue
        }

        const end = findOpenTagEnd(lines, i)
        if (!end) {
            out.push(lines[i])
            i++
            continue
        }

        const block = lines.slice(i, end.endLine + 1)
        const joined = block.join("\n")
        if (!/\bprinciple=/.test(joined)) {
            out.push(...block)
            i = end.endLine + 1
            continue
        }

        for (let li = i; li <= end.endLine; li++) {
            let line = lines[li]
            const before = line
            // Remove whole-line dead props
            if (/^\s*(gap|padding|align|justify|classNames)=/.test(line) && !/<(StackH|StackV)\b/.test(line)) {
                // if the line is ONLY that prop (optional trailing comment)
                if (/^\s*(gap|padding|align|justify|classNames)=(("[^"]*")|('[^']*')|(\{[\s\S]*\}))\s*$/.test(line.trim()) ||
                    /^\s*(gap|padding|align|justify|classNames)=\{/.test(line) && !line.includes(">") && !line.includes("principle")) {
                    // carefully: for `{...}` may be multi-token on one line
                    const only = line.match(/^\s*(gap|padding|align|justify|classNames)=(("[^"]*")|('[^']*')|(\{[^{}]*\}))\s*$/)
                    if (only) {
                        changed = true
                        continue
                    }
                }
            }
            // Inline removals on the opening line or mixed lines
            line = line.replace(/\s(gap|padding|align|justify|classNames)=(("[^"]*")|('[^']*')|(\{[^{}]*\}))/g, "")
            if (line !== before) changed = true
            // Skip now-empty attribute lines
            if (line.trim() === "" && before.trim() !== "") {
                changed = true
                continue
            }
            out.push(line)
        }
        i = end.endLine + 1
    }

    return { text: out.join("\n"), changed }
}

let n = 0
for (const f of files) {
    if (!fs.existsSync(f)) continue
    // Only tsx with Stack
    const src = fs.readFileSync(f, "utf8")
    if (!/<Stack[HV]\b/.test(src) || !/\bprinciple=/.test(src)) continue
    const { text, changed } = stripFile(src)
    if (changed && text !== src) {
        fs.writeFileSync(f, text)
        console.log("stripped", f)
        n++
    }
}
console.log("updated", n)
