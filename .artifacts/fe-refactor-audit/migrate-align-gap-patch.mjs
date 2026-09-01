/**
 * Migrate FormActions align → principle; PressableGroup gap → principle.
 */
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

const ALIGN_TO_PRINCIPLE = {
    between: "flex-action-between",
    end: "flex-action-end",
    start: "flex-action-start",
}

const report = { formActions: [], pressable: [] }

for (const file of [...walk(".storybook"), ...walk("src")]) {
    let src = fs.readFileSync(file, "utf8")
    let changed = false

    src = src.replace(/<FormActions\b([\s\S]*?)>/g, (full, attrs) => {
        if (attrs.includes("</")) return full
        const m = attrs.match(/\salign\s*=\s*"(between|end|start)"/)
        if (!m) return full
        const principle = ALIGN_TO_PRINCIPLE[m[1]]
        let next = attrs.replace(/\salign\s*=\s*"(between|end|start)"/, ` principle="${principle}"`)
        changed = true
        report.formActions.push(`${path.relative(".", file)}: ${m[1]} → ${principle}`)
        return `<FormActions${next}>`
    })

    // PressableGroup: remove gap={N|gap}, set principle
    src = src.replace(/<SurfaceCardPressableGroup\b([\s\S]*?)>/g, (full, attrs) => {
        if (attrs.includes("</")) return full
        const gapLit = (attrs.match(/\sgap\s*=\s*\{(\d+)\}/) || [])[1]
        const gapVar = /\sgap\s*=\s*\{gap\}/.test(attrs)
        if (!gapLit && !gapVar && !/\sgap\s*=/.test(attrs)) {
            // no gap — ensure principle for default content-row if missing
            if (!/\bprinciple\s*=/.test(attrs)) {
                changed = true
                report.pressable.push(`${path.relative(".", file)}: (default) → content-row`)
                return `<SurfaceCardPressableGroup${attrs} principle="content-row">`
            }
            return full
        }
        let principle = "content-row"
        if (gapLit === "3") principle = "sibling-stack"
        else if (gapLit === "2") principle = "sibling-stack" // MegaMenu denser peers — honest retune 4→8
        else if (gapLit === "4" || gapVar) principle = "content-row"
        let next = attrs
            .replace(/\sgap\s*=\s*\{[^}]+\}/, "")
            .replace(/\sprinciple\s*=\s*"[^"]+"/, "")
        next += ` principle="${principle}"`
        changed = true
        report.pressable.push(`${path.relative(".", file)}: gap=${gapLit ?? "var"} → ${principle}`)
        return `<SurfaceCardPressableGroup${next}>`
    })

    if (changed) fs.writeFileSync(file, src)
}

console.log(JSON.stringify(report, null, 2))
