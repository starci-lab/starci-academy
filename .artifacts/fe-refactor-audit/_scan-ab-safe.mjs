/**
 * Scan remaining A (identity-wrapper) and B (heroui) candidates for this burn pass.
 */
import fs from "node:fs"

const data = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07-final.json", "utf8"),
)

const locked = (rel) =>
    /MockInterviewSession|QuizSession|LearnLoopScroll|ContentAiChat|ArchitectureScene|BlockAnatomy|nivoexpert\/|\/nivo\/|\\nivo\\|components\/nivo\//.test(
        rel,
    ) || rel.includes("/resources/")

function relPath(filePath) {
    const p = filePath.replace(/\\/g, "/")
    const i = p.indexOf("starci-academy/")
    return i >= 0 ? p.slice(i + "starci-academy/".length) : p
}

const identity = []
const heroui = []

for (const file of data) {
    const rel = relPath(file.filePath)
    for (const m of file.messages || []) {
        if (m.ruleId === "starci-fe/no-identity-wrapper-div") {
            if (locked(rel)) continue
            identity.push({ file: rel, line: m.line, msg: m.message })
        }
        if (m.ruleId === "starci-fe/no-heroui-outside-vocabulary") {
            if (locked(rel)) continue
            heroui.push({ file: rel, line: m.line, msg: m.message })
        }
    }
}

console.log("=== A identity non-locked ===", identity.length)
for (const h of identity) console.log(`${h.file}:${h.line}`)

// Group heroui by imported symbol from message if present
console.log("\n=== B heroui unlocked ===", heroui.length)
const byFile = new Map()
for (const h of heroui) byFile.set(h.file, (byFile.get(h.file) || 0) + 1)
;[...byFile.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .forEach(([f, c]) => console.log(c, f))

console.log("\n=== B sample messages ===")
for (const h of heroui.slice(0, 25)) {
    console.log(`${h.file}:${h.line} | ${h.msg}`)
}

// Extract HeroUI import names from unlocked files that have heroui hits
const importHits = new Map()
for (const file of [...new Set(heroui.map((h) => h.file))]) {
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, "utf8")
    const re = /from\s+["']@heroui\/react["']/g
    // also collect named imports on previous lines
    const importBlocks = src.match(/import\s*\{[^}]+\}\s*from\s*["']@heroui\/react["']/gs) || []
    for (const block of importBlocks) {
        const names = [...block.matchAll(/\b([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1])
        for (const n of names) {
            if (n === "import") continue
            importHits.set(n, (importHits.get(n) || 0) + 1)
        }
    }
    // side-effect / default style
    if (/from\s+["']@heroui\/react["']/.test(src) && importBlocks.length === 0) {
        importHits.set("(other-import-style)", (importHits.get("(other-import-style)") || 0) + 1)
    }
}
console.log("\n=== HeroUI symbols in unlocked files ===")
;[...importHits.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([n, c]) => console.log(c, n))
