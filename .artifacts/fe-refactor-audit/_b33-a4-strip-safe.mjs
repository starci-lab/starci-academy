/**
 * Safe strip: remove whole-line dead Stack props only when a principle= line
 * appears earlier in the same attribute block (before items=/body=).
 */
import fs from "node:fs"

const files = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json", "utf8"),
).manifests["agent-4-stack-flex-cluster"].files

const DEAD =
    /^\s*(gap|padding|align|justify|classNames)=(("[^"]*")|('[^']*')|(\{[^{}]*\}))\s*$/

let updated = 0
for (const f of files) {
    if (!fs.existsSync(f)) continue
    const lines = fs.readFileSync(f, "utf8").split(/\n/)
    const out = []
    let i = 0
    let changed = false

    while (i < lines.length) {
        if (!/^\s*<(StackH|StackV)\b/.test(lines[i])) {
            out.push(lines[i])
            i++
            continue
        }

        // Collect attribute lines until items=/body= or close
        const block = []
        let j = i
        let stopReason = "end"
        while (j < lines.length && j < i + 25) {
            block.push(lines[j])
            if (j > i && /\b(items|body)\s*=/.test(lines[j])) {
                stopReason = "items"
                break
            }
            if (j > i && /\/?>\s*$/.test(lines[j]) && !lines[j].includes("=>")) {
                stopReason = "close"
                break
            }
            j++
        }

        // Own attrs = all lines before items=/body=, or all if close
        const attrLines =
            stopReason === "items"
                ? block.slice(0, -1)
                : block
        const itemsLine = stopReason === "items" ? block[block.length - 1] : null
        const attrText = attrLines.join("\n")
        const hasPrinciple = /\bprinciple\s*=/.test(attrText)

        if (!hasPrinciple) {
            out.push(...block)
            i = j + 1
            continue
        }

        for (const line of attrLines) {
            if (DEAD.test(line)) {
                changed = true
                continue
            }
            out.push(line)
        }
        if (itemsLine != null) out.push(itemsLine)
        i = j + 1
    }

    if (changed) {
        fs.writeFileSync(f, out.join("\n"))
        console.log("stripped", f)
        updated++
    }
}
console.log("updated", updated)
