/**
 * One-shot: drop redundant gap= when Grid principle owns it;
 * retune sibling-stack+gap4 peer grids → content-row;
 * strip dishonest PressableGroup principle; Form gap=6 → principle.
 */
import fs from "node:fs"
import path from "node:path"

const tokenStep = {
    "name-handle": 1,
    "icon-text": 2,
    "separator-dot": 2,
    "title-subtitle": 2,
    "flex-action": 3,
    "flex-action-center": 3,
    identity: 3,
    "identity-end": 3,
    "value-row": 3,
    "chip-row": 3,
    "sibling-stack": 3,
    "label-field": 4,
    "content-row": 4,
    "card-caption": 4,
    "group-boundary": 5,
    "block-boundary": 6,
    "layout-split": 7,
    "marketing-beat": 8,
}

function walk(d, a = []) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name)
        if (e.isDirectory() && e.name !== "node_modules") walk(f, a)
        else if (f.endsWith(".tsx") || f.endsWith(".ts")) a.push(f)
    }
    return a
}

const report = { droppedGap: [], retuned: [], pressableCleaned: [], formMigrated: [] }

function migrateGridTag(tag) {
    let next = tag
    const prin = (next.match(/principle\s*=\s*"([^"]+)"/) || [])[1]
    const gapM = next.match(/gap\s*=\s*\{(\d+)\}/)
    const gapExpr = next.match(/gap\s*=\s*\{([^}]+)\}/)

    // PressableGroup: variable gap={gap} + dishonest sibling-stack → drop principle only
    if (prin === "sibling-stack" && gapExpr && !gapM) {
        next = next.replace(/\s*principle\s*=\s*"sibling-stack"/, "")
        return { next, kind: "pressable" }
    }

    if (!prin || !gapM) return null
    const gs = Number(gapM[1])
    let principle = prin

    // Peer-card mismatch: sibling-stack + step 4 → content-row (preserves 12px)
    if (prin === "sibling-stack" && gs === 4) {
        next = next.replace(/principle\s*=\s*"sibling-stack"/, "principle=\"content-row\"")
        principle = "content-row"
    }

    const ts = tokenStep[principle]
    if (ts !== gs) return null

    // Drop gap={N} (and a trailing newline/indent if alone on a line later)
    next = next.replace(/\s*gap\s*=\s*\{\d+\}/, "")
    return { next, kind: principle !== prin ? "retune" : "drop", principle }
}

const roots = [".storybook/components", "src/components", ".storybook/stories"]
for (const root of roots) {
    if (!fs.existsSync(root)) continue
    for (const file of walk(root)) {
        let src = fs.readFileSync(file, "utf8")
        let changed = false

        // AcademySettingsForm Form gap={6} → principle="block-boundary"
        if (file.replace(/\\/g, "/").includes("AcademySettingsForm")) {
            const before = src
            src = src.replace(
                /(<Form\b[\s\S]*?)(\s+)gap=\{6\}/,
                "$1$2principle=\"block-boundary\"",
            )
            if (src !== before) {
                changed = true
                report.formMigrated.push(path.relative(".", file))
            }
        }

        src = src.replace(/<Grid\b([\s\S]*?)>/g, (full, attrs) => {
            if (attrs.includes("</")) return full
            const result = migrateGridTag(attrs)
            if (!result) return full
            changed = true
            const rel = path.relative(".", file)
            if (result.kind === "pressable") report.pressableCleaned.push(rel)
            else if (result.kind === "retune") report.retuned.push(`${rel} → ${result.principle}`)
            else report.droppedGap.push(rel)
            return `<Grid${result.next}>`
        })

        if (changed) fs.writeFileSync(file, src)
    }
}

console.log(JSON.stringify(report, null, 2))
console.log(
    "counts",
    Object.fromEntries(Object.entries(report).map(([k, v]) => [k, v.length])),
)
