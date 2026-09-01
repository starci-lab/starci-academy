/**
 * Architectural burn: require-frame-self-declare explain-only (pass 2).
 * principle already present — add English explain= only.
 * Keeps principle + spacing className on the SAME line; explain on next line.
 *
 * Important: ignore nested explain= inside {...} attribute expressions (items, body, etc.).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const EXPLAIN = JSON.parse(
    fs.readFileSync(
        path.join(ROOT, ".artifacts/fe-refactor-audit/_safe-burn-explain-templates.json"),
        "utf8",
    ),
).EXPLAIN

const PRINCIPLE_FAMILIES = [
    ["cell-pad", "card-padding", "row-pad", "control-pad", "page-pad", "pill-pad"],
    ["sibling-stack", "group-boundary", "block-boundary", "layout-split", "marketing-beat"],
    ["title-subtitle", "label-field", "name-handle", "icon-text"],
]

function validateExplain(token, text) {
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (words.length < 6) return "tooShort"
    const tokenWords = new Set(token.split("-"))
    const carriesOwnWords = words.every((w) =>
        tokenWords.has(w.toLowerCase().replace(/[^a-z]/g, "")),
    )
    if (carriesOwnWords) return "restates"
    const family = PRINCIPLE_FAMILIES.find((f) => f.includes(token))
    if (family) {
        const siblings = family.filter((t) => t !== token)
        const normalized = text.toLowerCase()
        if (!siblings.some((s) => normalized.includes(s))) return "noAlternative:" + siblings.join(",")
    }
    return null
}

for (const [token, text] of Object.entries(EXPLAIN)) {
    const err = validateExplain(token, text)
    if (err) {
        console.error("BAD TEMPLATE", token, err)
        process.exit(1)
    }
}

const LOCKED = [
    /MockInterviewPage\/MockInterviewSession\//,
    /FlashcardsPage\/QuizSession\//,
    /LandingPage\/LearnLoopScroll\//,
    /blocks\/learn\/ContentAiChat\//,
    /blocks\/marketing\/ArchitectureScene\//,
    /\.storybook\/utils\/BlockAnatomy\//,
    /\/nivoexpert\//,
    /\/nivo\//,
    /src\/resources\//,
]

const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, ".claude/fe/decision-ledger.json"), "utf8"))
const holdPaths = new Map()
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) {
        const hp = String(p).replace(/\\/g, "/").replace(/:\d+$/, "")
        holdPaths.set(hp, d.id)
    }
}

const product = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json"), "utf8"),
)

const rel = (p) => p.replace(/\\/g, "/").replace(/^.*starci-academy\//, "")

function holdId(file) {
    const f = file.replace(/\\/g, "/")
    for (const [hp, id] of holdPaths) {
        if (f === hp || f.startsWith(hp + "/") || f.includes(hp)) return id
    }
    return null
}

function isLocked(file) {
    return LOCKED.some((re) => re.test(file))
}

function sortKey(file) {
    if (file.startsWith(".storybook/")) return "0:" + file
    return "1:" + file
}

/**
 * Scan forward from `from` (index of `principle=`) to the end of the opening tag.
 * Returns { end, attrText, hasExplain } where attrText is depth-0 attribute text only.
 */
function scanOpening(src, from) {
    let depth = 0
    let inStr = null
    let end = -1
    let attrText = ""
    for (let j = from; j < src.length; j++) {
        const ch = src[j]
        if (inStr) {
            if (ch === "\\") {
                j++
                continue
            }
            if (ch === inStr) inStr = null
            if (depth === 0) attrText += ch
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") {
            inStr = ch
            if (depth === 0) attrText += ch
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
        if (depth === 0) attrText += ch
    }
    if (end < 0) return null
    return {
        end,
        attrText,
        hasExplain: /\bexplain\s*=/.test(attrText),
        hasDynamicPrinciple: /principle\s*=\s*\{/.test(attrText),
    }
}

const explainOnly = []
let missingBoth = 0
for (const file of product) {
    const pathRel = rel(file.filePath)
    for (const m of file.messages || []) {
        if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
        const msg = m.message || ""
        if (/neither/.test(msg)) {
            missingBoth++
            continue
        }
        if (/no `explain`|but no `explain`/.test(msg)) {
            explainOnly.push({
                file: pathRel,
                line: m.line,
                col: m.column,
                message: msg.slice(0, 140),
            })
        }
    }
}

const unlocked = []
const skipped = { locked: [], hold: [] }
for (const e of explainOnly) {
    if (isLocked(e.file)) {
        skipped.locked.push(e)
        continue
    }
    const hid = holdId(e.file)
    if (hid) {
        skipped.hold.push({ ...e, hold: hid })
        continue
    }
    unlocked.push(e)
}

const byFile = new Map()
for (const e of unlocked) {
    if (!byFile.has(e.file)) byFile.set(e.file, [])
    byFile.get(e.file).push(e)
}

let fixed = 0
const hardCases = []
const changedFiles = []
const tokenCounts = new Map()

const fileList = [...byFile.keys()].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

for (const file of fileList) {
    const findings = byFile.get(file)
    if (!fs.existsSync(file)) {
        for (const f of findings) hardCases.push({ ...f, reason: "file-missing" })
        continue
    }

    let src = fs.readFileSync(file, "utf8")
    let fileFixed = 0
    const sorted = [...findings].sort((a, b) => b.line - a.line || b.col - a.col)

    for (const finding of sorted) {
        const lines = src.split(/\n/)
        const lineIdx = finding.line - 1
        const winStart = Math.max(0, lineIdx - 2)
        const winEnd = Math.min(lines.length - 1, lineIdx + 25)

        let principlePos = -1
        let principleToken = null
        let quote = "\""

        let absOffset = 0
        for (let i = 0; i < winStart; i++) absOffset += lines[i].length + 1

        for (let i = winStart; i <= winEnd; i++) {
            const line = lines[i]
            const re = /principle=(["'])([a-z0-9-]+)\1/g
            let m
            while ((m = re.exec(line))) {
                const abs = absOffset + m.index
                const scanned = scanOpening(src, abs)
                if (!scanned) continue
                if (scanned.hasExplain) continue
                principlePos = abs
                principleToken = m[2]
                quote = m[1]
                break
            }
            if (principleToken) break
            absOffset += line.length + 1
        }

        // Also try dynamic — skip
        if (!principleToken) {
            // Check if there's only a dynamic principle nearby
            const winText = lines.slice(winStart, winEnd + 1).join("\n")
            if (/principle=\{/.test(winText) && !/principle=["'][a-z0-9-]+["']/.test(winText)) {
                hardCases.push({ ...finding, reason: "dynamic-principle" })
            } else if (/principle=["'][a-z0-9-]+["']/.test(winText)) {
                hardCases.push({ ...finding, reason: "static-but-has-explain-or-unscannable" })
            } else {
                hardCases.push({ ...finding, reason: "no-static-principle" })
            }
            continue
        }

        const explain = EXPLAIN[principleToken]
        if (!explain) {
            hardCases.push({ ...finding, reason: "no-template:" + principleToken })
            continue
        }

        const principleLit = `principle=${quote}${principleToken}${quote}`
        const insertAt = principlePos + principleLit.length
        if (src.slice(principlePos, insertAt) !== principleLit) {
            hardCases.push({ ...finding, reason: "principle-literal-mismatch" })
            continue
        }

        // Re-verify no explain at depth 0 (may have been added by earlier edit in this pass)
        const recheck = scanOpening(src, principlePos)
        if (!recheck || recheck.hasExplain) {
            hardCases.push({ ...finding, reason: "already-has-explain" })
            continue
        }

        const lineStart = src.lastIndexOf("\n", principlePos) + 1
        const indent = src.slice(lineStart).match(/^\s*/)[0]
        const explainLit = `explain=${quote}${explain}${quote}`
        const lineEnd = src.indexOf("\n", insertAt)
        const endIdx = lineEnd === -1 ? src.length : lineEnd
        const afterPrincipleOnLine = src.slice(insertAt, endIdx)
        const closerMatch = afterPrincipleOnLine.match(/(\s*\/?\s*>)\s*$/)

        if (closerMatch) {
            const beforeCloser = afterPrincipleOnLine.slice(0, -closerMatch[1].length)
            src =
        src.slice(0, insertAt) +
        beforeCloser +
        `\n${indent}${explainLit}` +
        closerMatch[1] +
        src.slice(endIdx)
        } else {
            src = src.slice(0, endIdx) + `\n${indent}${explainLit}` + src.slice(endIdx)
        }
        fileFixed++
        fixed++
        tokenCounts.set(principleToken, (tokenCounts.get(principleToken) || 0) + 1)
    }

    if (fileFixed > 0) {
        fs.writeFileSync(file, src)
        changedFiles.push({ file, fixed: fileFixed })
    }
}

const report = {
    before: {
        explainOnly: explainOnly.length,
        missingBoth,
        unlocked: unlocked.length,
        locked: skipped.locked.length,
        hold: skipped.hold.length,
    },
    fixed,
    hardCaseCount: hardCases.length,
    hardCasesByReason: hardCases.reduce((acc, h) => {
        acc[h.reason] = (acc[h.reason] || 0) + 1
        return acc
    }, {}),
    hardCases: hardCases.slice(0, 60),
    changedFiles: changedFiles.length,
    files: changedFiles.map((c) => c.file),
    tokenCounts: Object.fromEntries([...tokenCounts.entries()].sort((a, b) => b[1] - a[1])),
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json"),
    JSON.stringify({ ...report, hardCasesAll: hardCases, skippedHold: skipped.hold, skippedLocked: skipped.locked }, null, 2),
)
console.log(JSON.stringify(report, null, 2))
