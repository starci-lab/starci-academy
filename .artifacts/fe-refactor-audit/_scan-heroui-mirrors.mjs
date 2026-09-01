/**
 * Find src sentence-tier files with @heroui/react where a Storybook twin
 * already imports house atoms instead (safe mirror candidates).
 */
import fs from "node:fs"
import path from "node:path"

const data = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07-final.json", "utf8"),
)

const locked = (rel) =>
    /MockInterviewSession|QuizSession|LearnLoopScroll|ContentAiChat|ArchitectureScene|BlockAnatomy|nivoexpert\/|components\/nivo\/|\/resources\//.test(
        rel,
    )

function relPath(filePath) {
    const p = filePath.replace(/\\/g, "/")
    const i = p.indexOf("starci-academy/")
    return i >= 0 ? p.slice(i + "starci-academy/".length) : p
}

function extractHerouiNames(src) {
    const blocks = src.match(/import\s*\{[^}]+\}\s*from\s*["']@heroui\/react["']/gs) || []
    const names = new Set()
    for (const block of blocks) {
        for (const m of block.matchAll(/\b([A-Z][A-Za-z0-9]*)\b/g)) names.add(m[1])
    }
    return [...names]
}

function hasHouseAtomImport(src) {
    return /from\s*["']@\/components\/atoms\//.test(src) || /from\s*["']@sb-components\/atoms\//.test(src)
}

function hasHeroui(src) {
    return /from\s*["']@heroui\/react["']/.test(src)
}

/** Map src path → possible storybook twin paths. */
function twinCandidates(srcFile) {
    // src/components/blocks/foo/Bar/index.tsx
    // → .storybook/components/starci/blocks/foo/Bar/Bar.tsx
    // → .storybook/components/starci/blocks/foo/Bar/index.tsx
    const p = srcFile.replace(/\\/g, "/")
    const m = p.match(/^src\/components\/(blocks|pages|layouts|overlays|composites)\/(.+)\/(index|component)\.tsx$/)
    if (!m) return []
    const [, tier, rest, base] = m
    const parts = rest.split("/")
    const name = parts[parts.length - 1]
    const stem = `.storybook/components/starci/${tier}/${rest}`
    return [
        `${stem}/${name}.tsx`,
        `${stem}/index.tsx`,
        `${stem}/component.tsx`,
        // also non-starci storybook mirrors occasionally
        `.storybook/components/${tier}/${rest}/${name}.tsx`,
        `.storybook/components/${tier}/${rest}/index.tsx`,
    ]
}

const srcFiles = new Set()
for (const file of data) {
    const rel = relPath(file.filePath)
    if (locked(rel)) continue
    for (const m of file.messages || []) {
        if (m.ruleId === "starci-fe/no-heroui-outside-vocabulary") srcFiles.add(rel)
    }
}

const mirrors = []
const noTwin = []
const twinStillHeroui = []
const twinMissing = []

for (const file of [...srcFiles].sort()) {
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, "utf8")
    const symbols = extractHerouiNames(src).filter((n) => n !== "cn")
    // cn-only not atom mirror
    if (symbols.length === 0) continue

    const twins = twinCandidates(file).filter((t) => fs.existsSync(t))
    if (twins.length === 0) {
        noTwin.push({ file, symbols })
        continue
    }
    // Prefer twin that no longer uses heroui for those symbols
    let found = null
    for (const t of twins) {
        const tsrc = fs.readFileSync(t, "utf8")
        if (!hasHeroui(tsrc) && hasHouseAtomImport(tsrc)) {
            found = t
            break
        }
    }
    if (found) {
        mirrors.push({ file, twin: found, symbols })
    } else {
        const still = twins.filter((t) => hasHeroui(fs.readFileSync(t, "utf8")))
        if (still.length) twinStillHeroui.push({ file, twins: still, symbols })
        else twinMissing.push({ file, twins, symbols })
    }
}

console.log("src heroui (non-cn) files considered:", [...srcFiles].filter((f) => {
    if (!fs.existsSync(f)) return false
    const s = fs.readFileSync(f, "utf8")
    return extractHerouiNames(s).some((n) => n !== "cn")
}).length)
console.log("SAFE mirrors (SB twin already on atoms):", mirrors.length)
for (const m of mirrors) console.log(m.symbols.join(","), "|", m.file, "←", m.twin)

console.log("\ntwin still heroui:", twinStillHeroui.length)
console.log("twin exists but no atom import:", twinMissing.length)
console.log("no twin:", noTwin.length)
