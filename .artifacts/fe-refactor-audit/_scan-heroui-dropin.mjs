/**
 * Find heroui usages that already match house atom APIs (drop-in switch).
 */
import fs from "node:fs"

const data = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07-final.json", "utf8"),
)

function rel(p) {
    p = p.replace(/\\/g, "/")
    const i = p.indexOf("starci-academy/")
    return i >= 0 ? p.slice(i + "starci-academy/".length) : p
}

const locked = (r) =>
    /MockInterviewSession|QuizSession|LearnLoopScroll|ContentAiChat|ArchitectureScene|BlockAnatomy|nivoexpert\/|components\/nivo\/|\/resources\//.test(
        r,
    )

const files = new Set()
for (const f of data) {
    for (const m of f.messages || []) {
        if (m.ruleId !== "starci-fe/no-heroui-outside-vocabulary") continue
        const r = rel(f.filePath)
        if (!locked(r)) files.add(r)
    }
}

function symbols(src) {
    const blocks = src.match(/import\s*\{[^}]+\}\s*from\s*["']@heroui\/react["']/gs) || []
    const names = new Set()
    for (const b of blocks) {
        for (const m of b.matchAll(/\b([A-Z][A-Za-z0-9]*)\b/g)) names.add(m[1])
    }
    return [...names].filter((n) => n !== "cn")
}

const spinnerOnly = []
for (const file of [...files].sort()) {
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, "utf8")
    const sym = symbols(src)
    if (sym.length === 1 && sym[0] === "Spinner") spinnerOnly.push(file)
}

console.log("spinner-only", spinnerOnly.length)
for (const f of spinnerOnly) {
    const src = fs.readFileSync(f, "utf8")
    const usages = [...src.matchAll(/<Spinner\b[^>]*>/g)].map((m) => m[0])
    console.log(f)
    for (const u of usages) console.log(" ", u)
}

// FloatingActionButton-like thin wrappers: only Button (+cn)
console.log("\nButton(+cn)-only files:")
for (const file of [...files].sort()) {
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, "utf8")
    const sym = symbols(src)
    if (sym.length === 1 && sym[0] === "Button") {
        console.log(file)
    }
}
