/**
 * require-identity-root burn (2026-08-07).
 * Classify SAFE single-root identity-capable files from the arch baseline,
 * then apply `identity={{ tier, component }}` (Storybook twin first).
 * No principles, spacing, or authoring (no JSDoc) changes.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const BEFORE = 701

const IDENTITY_CAPABLE = new Set([
    // frames
    "Box", "Cluster", "Container", "Flex", "Grid", "PinnedTrack", "RailShell",
    "ResponsiveCluster", "ResponsiveRow", "ScrollArea", "Split", "SplitWorkspace",
    "Stack", "StackH", "StackV", "Stage",
    // composites that accept identity
    "SurfaceCard", "SurfaceCardNested", "SurfaceCardPressableGroup", "SurfaceCardList",
    "SurfaceCardAccordion", "SurfaceCardCrossList", "SurfaceCardPlaceholder",
    "SurfaceCardSelectableGroup",
    "Form", "FormActions", "FormSection",
    "EmptyState", "ModalShell", "DrawerShell",
    "List", "AuthorByline", "KeyValueList", "KeyValueRow",
    "Page",
])

// AsyncContent.Base does NOT accept identity — hard-case.
const ASYNC_NO_IDENTITY = new Set(["AsyncContent", "AsyncContentEmpty", "AsyncContentError"])

const LOCKED = [
    /MockInterviewSession/,
    /QuizSession/,
    /LearnLoopScroll/,
    /ContentAiChat/,
    /ArchitectureScene/,
    /BlockAnatomy/,
    /nivoexpert\//i,
    /\/nivo\//i,
    /\/src\/resources\//,
    /RagSourceGraph/, // documented hard-case — Box hard-codes frame identity
]

const ledger = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".claude/fe/decision-ledger.json"), "utf8"),
)
const holdPaths = new Map()
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) {
        const clean = String(p).replace(/\\/g, "/").replace(/:\d+$/, "")
        holdPaths.set(clean, d.id)
    }
}

function rel(p) {
    return p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")
}

function isLocked(f) {
    return LOCKED.some((re) => re.test(f))
}

function holdId(f) {
    const n = f.replace(/\\/g, "/")
    for (const [hp, id] of holdPaths) {
        if (n === hp || n.endsWith(hp) || n.includes(hp) || n.startsWith(hp + "/")) return id
    }
    return null
}

function tierFromPath(file) {
    if (file.includes("/components/pages/")) return "page"
    if (file.includes("/components/layouts/")) return "layout"
    if (file.includes("/components/overlays/")) return "overlay"
    if (file.includes("/components/blocks/")) return "block"
    return null
}

function componentFromPath(file) {
    const parts = file.replace(/\\/g, "/").split("/")
    const base = parts[parts.length - 1]
    if (base === "index.tsx" || base === "component.tsx") {
        return parts[parts.length - 2]
    }
    return base.replace(/\.tsx$/, "")
}

/** Return-root tags: `return (` / `return <Tag` with optional comments. */
function findReturnRoots(src) {
    const roots = []
    const re = /return\s*(?:\(|)\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\/\/[^\n]*\n\s*)*<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
    let m
    while ((m = re.exec(src))) {
        roots.push({ tag: m[1], index: m.index })
    }
    const re2 = /return\s+<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
    while ((m = re2.exec(src))) {
        roots.push({ tag: m[1], index: m.index })
    }
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

const baseline = JSON.parse(
    fs.readFileSync(
        path.join(ROOT, ".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json"),
        "utf8",
    ),
)

const files = new Set()
for (const f of baseline) {
    for (const msg of f.messages || []) {
        if (msg.ruleId !== "starci-fe/require-identity-root") continue
        files.add(rel(f.filePath))
    }
}

const safe = []
const hard = []
const skippedLocked = []
const skippedHold = []
const skippedAlready = []

for (const file of [...files].sort()) {
    if (isLocked(file)) {
        skippedLocked.push(file)
        hard.push({ file, reason: "locked-path" })
        continue
    }
    const hid = holdId(file)
    if (hid) {
        skippedHold.push({ file, hold: hid })
        hard.push({ file, reason: `teacher-hold:${hid}` })
        continue
    }
    if (!fs.existsSync(file)) {
        hard.push({ file, reason: "missing-file" })
        continue
    }
    const src = fs.readFileSync(file, "utf8")
    if (alreadyHasIdentity(src)) {
        skippedAlready.push(file)
        continue
    }
    const tier = tierFromPath(file)
    const component = componentFromPath(file)
    if (!tier) {
        hard.push({ file, reason: "unknown-tier-path" })
        continue
    }

    // Fragment bare returns: `return (<>` or `return <>`
    if (/return\s*(?:\(|)\s*<>/.test(src) && !/return\s*(?:\(|)\s*<[A-Za-z]/.test(src)) {
        hard.push({ file, reason: "fragment-root" })
        continue
    }

    const roots = findReturnRoots(src)
    if (roots.length === 0) {
        hard.push({ file, reason: "no-return-jsx-found" })
        continue
    }

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

    // Mixed host + component returns → hard
    if (hostRoots.length > 0) {
        hard.push({
            file,
            reason: "mixed-host-and-component-roots",
            tags: [...new Set(roots.map((r) => r.tag))],
        })
        continue
    }

    const tags = [...new Set(compRoots.map((r) => r.tag))]

    if (tags.some((t) => ASYNC_NO_IDENTITY.has(t))) {
        hard.push({ file, reason: "AsyncContent-root", tags })
        continue
    }

    const capable = tags.filter((t) => IDENTITY_CAPABLE.has(t))
    const incapable = tags.filter((t) => !IDENTITY_CAPABLE.has(t))

    // SAFE: every component return root is the SAME identity-capable tag
    if (capable.length === 1 && incapable.length === 0 && tags.length === 1) {
        safe.push({
            file,
            tier,
            component,
            rootTag: tags[0],
            rootCount: compRoots.length,
        })
        continue
    }

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

function findStorybookTwin(srcFile) {
    const f = srcFile.replace(/\\/g, "/")
    const candidates = []

    if (f.startsWith("src/components/blocks/")) {
        const rest = f
            .replace("src/components/blocks/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\/component\.tsx$/, "")
            .replace(/\.tsx$/, "")
        const parts = rest.split("/")
        const name = parts[parts.length - 1]
        const dir = parts.slice(0, -1).join("/")
        candidates.push(`.storybook/components/starci/blocks/${dir}/${name}/${name}.tsx`)
        candidates.push(`.storybook/components/starci/blocks/${dir}/${name}/index.tsx`)
        candidates.push(`.storybook/components/blocks/${dir}/${name}/${name}.tsx`)
    } else if (f.startsWith("src/components/pages/")) {
        const rest = f
            .replace("src/components/pages/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\/component\.tsx$/, "")
            .replace(/\.tsx$/, "")
        const parts = rest.split("/")
        const name = parts[parts.length - 1]
        const dir = parts.slice(0, -1).join("/")
        candidates.push(`.storybook/components/starci/pages/${dir}/${name}/${name}.tsx`)
        candidates.push(`.storybook/components/starci/pages/${dir}/${name}/index.tsx`)
        if (!dir) {
            candidates.push(`.storybook/components/starci/pages/${name}/${name}.tsx`)
        }
    } else if (f.startsWith("src/components/layouts/")) {
        const rest = f
            .replace("src/components/layouts/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\.tsx$/, "")
        candidates.push(`.storybook/components/starci/layouts/${rest}/${rest.split("/").at(-1)}.tsx`)
    } else if (f.startsWith("src/components/overlays/")) {
        const rest = f
            .replace("src/components/overlays/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\/component\.tsx$/, "")
            .replace(/\.tsx$/, "")
        candidates.push(`.storybook/components/starci/overlays/${rest}/${rest.split("/").at(-1)}.tsx`)
        candidates.push(`.storybook/components/overlays/${rest}/${rest.split("/").at(-1)}.tsx`)
    }

    return candidates.find((c) => fs.existsSync(c)) || null
}

/**
 * Insert identity on every return-root opening of rootTag that lacks identity.
 */
function applyIdentity(src, rootTag, tier, component) {
    const identityLit = `identity={{ tier: "${tier}", component: "${component}" }}`
    let count = 0

    const tagRe = new RegExp(`<${rootTag}(?=[\\s/>])`, "g")
    const matches = []
    let m
    while ((m = tagRe.exec(src))) {
        const look = src.slice(Math.max(0, m.index - 120), m.index)
        const isReturn2 =
            /return[\s\S]*$/.test(look) &&
            !/;\s*$/.test(look.trim()) &&
            (/return\s*\(\s*$/.test(look) ||
                /return\s*$/.test(look) ||
                /return\s*\(\s*(?:\/\/[^\n]*\n\s*)*$/.test(look) ||
                /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*$/.test(look))
        if (!isReturn2) continue

        let j = m.index
        let depth = 0
        let inStr = null
        let end = -1
        for (; j < src.length; j++) {
            const ch = src[j]
            if (inStr) {
                if (ch === "\\") {
                    j++
                    continue
                }
                if (ch === inStr) inStr = null
                continue
            }
            if (ch === "\"" || ch === "'" || ch === "`") {
                inStr = ch
                continue
            }
            if (ch === "{") {
                depth++
                continue
            }
            if (ch === "}") {
                depth = Math.max(0, depth - 1)
                continue
            }
            if (depth === 0 && ch === ">") {
                end = j
                break
            }
        }
        if (end < 0) continue
        const opening = src.slice(m.index, end + 1)
        if (/\bidentity=/.test(opening)) continue
        matches.push({ at: m.index + ("<" + rootTag).length, openingStart: m.index })
    }

    let result = src
    for (const hit of matches.sort((a, b) => b.at - a.at)) {
        const after = result.slice(hit.at, hit.at + 20)
        let insertion
        if (after.startsWith("\n")) {
            const lineStart = result.lastIndexOf("\n", hit.openingStart) + 1
            const baseIndent = result.slice(lineStart, hit.openingStart).match(/^\s*/)?.[0] ?? ""
            insertion = `\n${baseIndent}    ${identityLit}`
        } else {
            insertion = ` ${identityLit}`
        }
        result = result.slice(0, hit.at) + insertion + result.slice(hit.at)
        count++
    }
    return { src: result, count }
}

const mode = process.argv[2] || "classify" // classify | apply

const classifyReport = {
    before: BEFORE,
    unlocked: files.size,
    safe: safe.length,
    hard: hard.length,
    skippedLocked: skippedLocked.length,
    skippedHold: skippedHold.length,
    skippedAlready: skippedAlready.length,
    safeByTag: safe.reduce((a, s) => ((a[s.rootTag] = (a[s.rootTag] || 0) + 1), a), {}),
    hardByReason: hard.reduce((a, h) => {
        const key = h.reason.startsWith("teacher-hold:") ? "teacher-hold" : h.reason
        a[key] = (a[key] || 0) + 1
        return a
    }, {}),
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_identity-burn-classify.json"),
    JSON.stringify({ ...classifyReport, safe, hard, skippedLocked, skippedHold, skippedAlready }, null, 2),
)
console.log(JSON.stringify(classifyReport, null, 2))

if (mode !== "apply") {
    process.exit(0)
}

const changed = []
const hardExtra = []
let totalInserts = 0
let twinsUpdated = 0

for (const item of safe) {
    const { file, tier, component, rootTag } = item
    const twin = findStorybookTwin(file)
    const targets = []
    if (twin) targets.push({ path: twin, isTwin: true })
    targets.push({ path: file, isTwin: false })

    for (const t of targets) {
        if (!fs.existsSync(t.path)) continue
        let src = fs.readFileSync(t.path, "utf8")
        if (alreadyHasIdentity(src) && t.isTwin) {
            // twin may already carry identity under a different structure — leave
            continue
        }
        const applied = applyIdentity(src, rootTag, tier, component)
        if (applied.count === 0) {
            if (!t.isTwin) {
                hardExtra.push({ file, reason: "no-insert-site", rootTag })
            }
            continue
        }
        fs.writeFileSync(t.path, applied.src)
        totalInserts += applied.count
        changed.push(t.path)
        if (t.isTwin) twinsUpdated++
    }
}

const applyReport = {
    before: BEFORE,
    safeClassified: safe.length,
    inserts: totalInserts,
    filesChanged: [...new Set(changed)].length,
    twinsUpdated,
    hardFromClassify: hard.length,
    hardExtra,
    hardByReason: classifyReport.hardByReason,
    skippedLocked: skippedLocked.length,
    skippedHold: skippedHold.length,
    changed: [...new Set(changed)].sort(),
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_identity-burn-result.json"),
    JSON.stringify({ ...applyReport, hardAll: [...hard, ...hardExtra], skippedLocked, skippedHold }, null, 2),
)
console.log(JSON.stringify({
    ...applyReport,
    changedSample: applyReport.changed.slice(0, 20),
    hardExtraCount: hardExtra.length,
}, null, 2))
