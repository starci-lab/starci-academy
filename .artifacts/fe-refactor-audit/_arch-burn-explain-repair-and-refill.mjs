/**
 * Repair damage from bad explain insertion (explain landed inside items={[}),
 * then re-apply missing explains with insert-immediately-after-principle.
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

const SPACING_CN =
  /\b(gap-[1-9]\d*|p-[1-9]\d*|px-[1-9]\d*|py-[1-9]\d*|pt-[1-9]\d*|pb-[1-9]\d*|pl-[1-9]\d*|pr-[1-9]\d*|m-[1-9]\d*|mx-auto|ml-auto|mt-auto|mb-auto)\b/

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
        holdPaths.set(String(p).replace(/\\/g, "/").replace(/:\d+$/, ""), d.id)
    }
}

const product = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json"), "utf8"),
)
const prev = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json"), "utf8"),
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
    }
}

/** Pull spacing className onto the principle line; leave explain on its own line. */
function fixPrincipleClassNameSplit(src) {
    // A: principle="tok"\n explain="..." className="spacing..."
    src = src.replace(
        /(\b(?:data-)?principle\s*=\s*(["'`])([^"'`]+)\2)\s*\r?\n(\s*)((?:data-)?explain\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`)\s+)(className=(?:"[^"]*"|`[^`]*`|'[^']*'))/g,
        (m, principle, _q, _tok, indent, explain, className) => {
            return `${principle} ${className}\n${indent}${explain.trim()}`
        },
    )
    return src
}

/**
 * Repair: principle="tok" ...items={[\n explain="..."\n [explain dup]\n child
 * → principle="tok"\n explain="..."\n ...items={[\n child
 */
function repairMisplacedExplains(src) {
    let out = src
    let guarded = 0

    // Collapse duplicate consecutive identical explain lines
    out = out.replace(
        /(\n\s*explain=(["'])([^"']*)\2)\s*\1/g,
        "$1",
    )

    // Misplaced: attrs ending with items={[ or body={() => ( then explain on next line(s)
    out = out.replace(
        /(principle=(["'])([a-z0-9-]+)\2)([^\n]*)\n(\s*)explain=(["'])([^"']*)\6\s*(?:\n\5explain=\6\7\6\s*)?/g,
        (m, principle, q, token, rest, indent, eq, text) => {
            // If rest already has explain, leave alone
            if (/\bexplain\s*=/.test(rest)) return m
            // If explain text doesn't match template for token, still keep it (already written)
            const explainLit = `explain=${eq}${text}${eq}`
            // Split rest: keep spacing className with principle; other attrs after explain
            const classNameMatch = rest.match(/\s+className=(?:"[^"]*"|`[^`]*`|'[^']*')/)
            let principleLine = principle
            let otherRest = rest
            if (classNameMatch && SPACING_CN.test(classNameMatch[0])) {
                principleLine = principle + classNameMatch[0]
                otherRest = rest.replace(classNameMatch[0], "")
            }
            guarded++
            // Trim leading space from otherRest for clean next line
            otherRest = otherRest.replace(/^\s+/, " ")
            if (otherRest.trim()) {
                return `${principleLine}\n${indent}${explainLit}\n${indent}${otherRest.trimStart()}`
            }
            return `${principleLine}\n${indent}${explainLit}`
        },
    )

    return { src: out, repairs: guarded }
}

function sortKey(file) {
    if (file.startsWith(".storybook/")) return "0:" + file
    return "1:" + file
}

// --- Phase 1: repair all previously touched files ---
const touchSet = new Set(prev.files || [])
let repairFiles = 0
let repairOps = 0
for (const file of touchSet) {
    if (!fs.existsSync(file)) continue
    const before = fs.readFileSync(file, "utf8")
    const { src, repairs } = repairMisplacedExplains(before)
    let next = fixPrincipleClassNameSplit(src)
    if (next !== before) {
        fs.writeFileSync(file, next)
        repairFiles++
        repairOps += repairs
    }
}
console.log(JSON.stringify({ phase: "repair", repairFiles, repairOps }, null, 2))

// --- Phase 2: re-scan baseline unlocked explain-only and fill remaining ---
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
            explainOnly.push({ file: pathRel, line: m.line, col: m.column, message: msg.slice(0, 140) })
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

for (const file of [...byFile.keys()].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))) {
    const findings = byFile.get(file)
    if (!fs.existsSync(file)) {
        for (const f of findings) hardCases.push({ ...f, reason: "file-missing" })
        continue
    }

    let src = fs.readFileSync(file, "utf8")
    let fileFixed = 0

    // Work from end of file by absolute positions of unmatched static principles
    // Collect all candidate principle sites first (current src), then apply descending
    const sites = []
    const re = /principle=(["'])([a-z0-9-]+)\1/g
    let m
    while ((m = re.exec(src))) {
        const scanned = scanOpening(src, m.index)
        if (!scanned) continue
        if (scanned.hasExplain) continue
        const token = m[2]
        if (!EXPLAIN[token]) {
            sites.push({ index: m.index, token, quote: m[1], skip: "no-template" })
            continue
        }
        sites.push({ index: m.index, token, quote: m[1], lit: m[0] })
    }

    // Only fix sites that fall near a baseline finding line (avoid inventing on unrelated frames)
    const lineStarts = [0]
    for (let i = 0; i < src.length; i++) if (src[i] === "\n") lineStarts.push(i + 1)
    function lineOf(idx) {
        let lo = 0
        let hi = lineStarts.length - 1
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1
            if (lineStarts[mid] <= idx) lo = mid
            else hi = mid - 1
        }
        return lo + 1
    }

    const findingLines = new Set(findings.map((f) => f.line))
    const toFix = sites
        .filter((s) => !s.skip)
        .filter((s) => {
            const ln = lineOf(s.index)
            // allow principle a few lines below the eslint-reported open tag
            for (let d = 0; d <= 8; d++) if (findingLines.has(ln - d)) return true
            return false
        })
        .sort((a, b) => b.index - a.index)

    for (const s of toFix) {
    // re-scan in case earlier edit shifted — we go descending so OK
        const scanned = scanOpening(src, s.index)
        if (!scanned || scanned.hasExplain) continue
        const principleLit = `principle=${s.quote}${s.token}${s.quote}`
        if (src.slice(s.index, s.index + principleLit.length) !== principleLit) continue

        const explain = EXPLAIN[s.token]
        const insertAt = s.index + principleLit.length
        const lineStart = src.lastIndexOf("\n", s.index) + 1
        const indent = src.slice(lineStart).match(/^\s*/)[0]
        const explainLit = `explain=${s.quote}${explain}${s.quote}`

        // ALWAYS insert immediately after principle literal (newline + explain).
        // className that follows stays after principle on the same physical line until
        // fixPrincipleClassNameSplit runs — wait, inserting newline AFTER principle
        // pushes className to the explain line. So: insert explain AFTER the full
        // principle+spacing-className cluster when className is adjacent.

        const after = src.slice(insertAt)
        const cnMatch = after.match(/^\s+(className=(?:"[^"]*"|`[^`]*`|'[^']*'))/)
        if (cnMatch && SPACING_CN.test(cnMatch[1])) {
            // principle className stay together; explain on next line; remainder after
            const cnEnd = insertAt + cnMatch[0].length
            const lineStart2 = src.lastIndexOf("\n", s.index) + 1
            const ind = src.slice(lineStart2).match(/^\s*/)[0]
            // If closer immediately after className on same line, split it
            const afterCn = src.slice(cnEnd)
            const closerOnLine = afterCn.match(/^(\s*\/?\s*>)(?=\s*(?:\n|$))/)
            if (closerOnLine) {
                src =
          src.slice(0, cnEnd) +
          `\n${ind}${explainLit}` +
          closerOnLine[1] +
          src.slice(cnEnd + closerOnLine[1].length)
            } else {
                src = src.slice(0, cnEnd) + `\n${ind}${explainLit}` + src.slice(cnEnd)
            }
        } else {
            // No spacing className right after principle — insert explain next, keep rest
            const lineEnd = src.indexOf("\n", insertAt)
            const endIdx = lineEnd === -1 ? src.length : lineEnd
            const restOnLine = src.slice(insertAt, endIdx)
            const closerMatch = restOnLine.match(/(\s*\/?\s*>)\s*$/)
            if (closerMatch && restOnLine.trim() === closerMatch[1].trim()) {
                // only closer on rest
                src =
          src.slice(0, insertAt) +
          `\n${indent}${explainLit}` +
          closerMatch[1] +
          src.slice(endIdx)
            } else if (closerMatch && /^\s*$/.test(restOnLine.slice(0, -closerMatch[1].length))) {
                src =
          src.slice(0, insertAt) +
          `\n${indent}${explainLit}` +
          closerMatch[1] +
          src.slice(endIdx)
            } else {
                // Other attrs on same line (gap=, items=, etc.) — put explain on next line
                // BEFORE those attrs by splitting: principle\n explain\n indent+restAttrs
                // Actually keep gap etc with the tag; put explain after principle only:
                // `<Stack principle="x" gap={3}` → `<Stack principle="x"\n explain=... gap={3}`
                // Better canonical:
                // principle\n explain\n (moved rest that was after principle on same line)
                const rest = restOnLine
                const closerOnly = rest.match(/(\s*\/?\s*>)\s*$/)
                let main = rest
                let closer = ""
                if (closerOnly) {
                    // only peel closer if the rest is ONLY whitespace+closer OR attrs+closer
                    closer = closerOnly[1]
                    main = rest.slice(0, -closer.length)
                }
                if (main.trim()) {
                    // Move remaining same-line attrs to after explain
                    src =
            src.slice(0, insertAt) +
            `\n${indent}${explainLit}` +
            (main.startsWith("\n") ? "" : `\n${indent}`) +
            main.trimStart() +
            closer +
            src.slice(endIdx)
                } else {
                    src =
            src.slice(0, insertAt) +
            `\n${indent}${explainLit}` +
            closer +
            src.slice(endIdx)
                }
            }
        }

        fileFixed++
        fixed++
        tokenCounts.set(s.token, (tokenCounts.get(s.token) || 0) + 1)
    }

    // Mark findings that still lack explain
    for (const finding of findings) {
        const lines = src.split(/\n/)
        const win = lines.slice(Math.max(0, finding.line - 3), Math.min(lines.length, finding.line + 20)).join("\n")
        const staticM = win.match(/principle=(["'])([a-z0-9-]+)\1/)
        if (!staticM) {
            if (/principle=\{/.test(win)) hardCases.push({ ...finding, reason: "dynamic-principle" })
            else hardCases.push({ ...finding, reason: "no-static-principle" })
            continue
        }
        // find this principle in full src near line — approximate check via window scanOpening
        let abs = 0
        for (let i = 0; i < Math.max(0, finding.line - 3); i++) abs += lines[i].length + 1
        let foundOk = false
        const wre = /principle=(["'])([a-z0-9-]+)\1/g
        const winStart = Math.max(0, finding.line - 3)
        const winEnd = Math.min(lines.length - 1, finding.line + 20)
        abs = 0
        for (let i = 0; i < winStart; i++) abs += lines[i].length + 1
        for (let i = winStart; i <= winEnd; i++) {
            let mm
            const lr = /principle=(["'])([a-z0-9-]+)\1/g
            while ((mm = lr.exec(lines[i]))) {
                const sc = scanOpening(src, abs + mm.index)
                if (sc && sc.hasExplain) {
                    foundOk = true
                    break
                }
                if (sc && !sc.hasExplain) {
                    hardCases.push({ ...finding, reason: "still-missing:" + mm[2] })
                    foundOk = true
                    break
                }
            }
            if (foundOk) break
            abs += lines[i].length + 1
        }
        if (!foundOk) hardCases.push({ ...finding, reason: "unresolved" })
    }

    src = fixPrincipleClassNameSplit(src)
    if (fileFixed > 0 || touchSet.has(file)) {
    // Always write if we fixed; also rewrite repaired files already done in phase1
        if (fileFixed > 0) {
            fs.writeFileSync(file, src)
            changedFiles.push({ file, fixed: fileFixed })
        }
    }
}

// Final damage audit
const auditBad = []
for (const file of new Set([...touchSet, ...changedFiles.map((c) => c.file)])) {
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, "utf8")
    const kinds = []
    if (/items=\{\[\s*\n\s*explain=/.test(src)) kinds.push("explain-in-items")
    if (/explain="[^"]+"\s*\n\s*explain="/.test(src)) kinds.push("dup-explain")
    if (/explain="[^"]+"\s*\n\s*\(\)\s*=>/.test(src)) kinds.push("explain-before-arrow")
    if (kinds.length) auditBad.push({ file, kinds })
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
    changedFiles: changedFiles.length,
    files: [...new Set([...touchSet, ...changedFiles.map((c) => c.file)])].sort(),
    tokenCounts: Object.fromEntries([...tokenCounts.entries()].sort((a, b) => b[1] - a[1])),
    auditBad,
    hardCases: hardCases.slice(0, 40),
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json"),
    JSON.stringify({ ...report, hardCasesAll: hardCases, skippedHold: skipped.hold, skippedLocked: skipped.locked }, null, 2),
)
console.log(JSON.stringify(report, null, 2))
