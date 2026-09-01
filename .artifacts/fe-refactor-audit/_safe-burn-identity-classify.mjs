/**
 * Classify require-identity-root findings into SAFE (single clear root frame)
 * vs hard-case (fragment / multi-root / host element / no identity-capable root).
 */
import fs from "node:fs"

const IDENTITY_CAPABLE = new Set([
    // frames
    "Box", "Cluster", "Container", "Flex", "Grid", "PinnedTrack", "RailShell",
    "ResponsiveCluster", "ResponsiveRow", "ScrollArea", "Split", "SplitWorkspace",
    "Stack", "StackH", "StackV", "Stage",
    // common composites that accept identity
    "SurfaceCard", "SurfaceCardNested", "SurfaceCardPressableGroup", "SurfaceCardList",
    "SurfaceCardAccordion", "SurfaceCardCrossList", "SurfaceCardPlaceholder",
    "SurfaceCardSelectableGroup",
    "Form", "FormActions", "FormSection", "FormActions",
    "AsyncContent", "AsyncContentEmpty", "AsyncContentError",
    "EmptyState", "ModalShell", "DrawerShell",
    "List", "AuthorByline", "KeyValueList", "KeyValueRow",
])

const lockedRes = [
    /MockInterviewSession/,
    /QuizSession/,
    /LearnLoopScroll/,
    /ContentAiChat/,
    /ArchitectureScene/,
    /BlockAnatomy/,
    /nivoexpert\//,
    /\/nivo\//,
]

const data = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07.json", "utf8"),
)

const files = new Set()
for (const f of data) {
    for (const m of f.messages || []) {
        if (m.ruleId !== "starci-fe/require-identity-root") continue
        const file = f.filePath.replace(/\\/g, "/").replace(/^.*starci-academy\//, "")
        if (lockedRes.some((r) => r.test(file))) continue
        files.add(file)
    }
}

function tierFromPath(file) {
    if (file.includes("/components/pages/")) return "page"
    if (file.includes("/components/layouts/")) return "layout"
    if (file.includes("/components/overlays/")) return "overlay"
    if (file.includes("/components/blocks/")) return "block"
    return null
}

function componentFromPath(file) {
    // .../Foo/index.tsx or .../Foo/component.tsx → Foo
    const parts = file.replace(/\\/g, "/").split("/")
    const base = parts[parts.length - 1]
    if (base === "index.tsx" || base === "component.tsx") {
        return parts[parts.length - 2]
    }
    return base.replace(/\.tsx$/, "")
}

/** Find top-level return JSX roots in the main exported component (heuristic). */
function findReturnRoots(src) {
    const roots = []
    // Match `return (` then optional whitespace/comments then `<Tag`
    const re = /return\s*(?:\(|)\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\/\/[^\n]*\n\s*)*<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
    let m
    while ((m = re.exec(src))) {
        roots.push({ tag: m[1], index: m.index })
    }
    // Also: return <Tag without paren
    const re2 = /return\s+<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
    while ((m = re2.exec(src))) {
        roots.push({ tag: m[1], index: m.index })
    }
    // Dedupe by index
    const seen = new Set()
    return roots.filter((r) => {
        if (seen.has(r.index)) return false
        seen.add(r.index)
        return true
    })
}

function alreadyHasIdentity(src) {
    return /\bidentity=\{/.test(src)
}

const safe = []
const hard = []

for (const file of [...files].sort()) {
    if (!fs.existsSync(file)) {
        hard.push({ file, reason: "missing-file" })
        continue
    }
    const src = fs.readFileSync(file, "utf8")
    if (alreadyHasIdentity(src)) {
    // rule should already be satisfied — skip
        hard.push({ file, reason: "already-has-identity-literal-maybe-false-positive" })
        continue
    }
    const tier = tierFromPath(file)
    const component = componentFromPath(file)
    if (!tier) {
        hard.push({ file, reason: "unknown-tier-path" })
        continue
    }

    const roots = findReturnRoots(src)
    if (roots.length === 0) {
        hard.push({ file, reason: "no-return-jsx-found" })
        continue
    }

    // Filter to PascalCase (components) — lowercase hosts are hard-case
    const hostRoots = roots.filter((r) => /^[a-z]/.test(r.tag))
    const compRoots = roots.filter((r) => /^[A-Z]/.test(r.tag))

    if (compRoots.length === 0) {
        hard.push({
            file,
            reason: "host-element-root",
            tags: [...new Set(hostRoots.map((r) => r.tag))],
        })
        continue
    }

    const tags = [...new Set(compRoots.map((r) => r.tag))]
    const capable = tags.filter((t) => IDENTITY_CAPABLE.has(t))
    const incapable = tags.filter((t) => !IDENTITY_CAPABLE.has(t))

    // SAFE: every component return root is the SAME identity-capable tag
    // (early returns of null/fragments already excluded by rule; we may still see AsyncContentError etc.)
    if (capable.length === 1 && incapable.length === 0 && tags.length === 1) {
        safe.push({ file, tier, component, rootTag: tags[0], rootCount: compRoots.length })
        continue
    }

    // Also SAFE: multiple returns but all capable and same tag
    if (capable.length === 1 && incapable.length === 0) {
        safe.push({ file, tier, component, rootTag: capable[0], rootCount: compRoots.length })
        continue
    }

    // SAFE-ish: all returns are identity-capable (maybe different tags) — skip as multi-root
    if (incapable.length === 0 && tags.length > 1) {
        hard.push({ file, reason: "multi-capable-roots", tags })
        continue
    }

    hard.push({
        file,
        reason: incapable.length ? "incapable-or-mixed-root" : "multi-root",
        tags,
        capable,
        incapable,
    })
}

console.log(JSON.stringify({
    totalUnlocked: files.size,
    safe: safe.length,
    hard: hard.length,
    safeByTag: safe.reduce((a, s) => ((a[s.rootTag] = (a[s.rootTag] || 0) + 1), a), {}),
    hardByReason: hard.reduce((a, h) => ((a[h.reason] = (a[h.reason] || 0) + 1), a), {}),
    safeSample: safe.slice(0, 15),
    hardSample: hard.slice(0, 20),
}, null, 2))

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-burn-identity-classify.json",
    JSON.stringify({ before: 703, unlocked: files.size, safe, hard }, null, 2),
)
