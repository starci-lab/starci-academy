/**
 * Count remaining require-frame-self-declare explain-only on unlocked files
 * by scanning source (no full eslint — faster verification).
 */
import fs from "node:fs"

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

const ledger = JSON.parse(fs.readFileSync(".claude/fe/decision-ledger.json", "utf8"))
const holdPaths = new Map()
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    for (const p of d.paths || (d.path ? [d.path] : [])) {
        holdPaths.set(String(p).replace(/\\/g, "/").replace(/:\d+$/, ""), d.id)
    }
}

const product = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-arch-burn-baseline.json", "utf8"),
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
    return { hasExplain: /\bexplain\s*=/.test(attrText) }
}

const baselineExplainOnly = []
for (const file of product) {
    const pathRel = rel(file.filePath)
    for (const m of file.messages || []) {
        if (m.ruleId !== "starci-fe/require-frame-self-declare") continue
        const msg = m.message || ""
        if (/neither/.test(msg)) continue
        if (!/no `explain`|but no `explain`/.test(msg)) continue
        baselineExplainOnly.push({ file: pathRel, line: m.line })
    }
}

const unlocked = baselineExplainOnly.filter((e) => !isLocked(e.file) && !holdId(e.file))
const stillMissing = []
const resolved = []
const dynamic = []

for (const e of unlocked) {
    if (!fs.existsSync(e.file)) {
        stillMissing.push({ ...e, reason: "missing-file" })
        continue
    }
    const src = fs.readFileSync(e.file, "utf8")
    const lines = src.split(/\n/)
    const winStart = Math.max(0, e.line - 3)
    const winEnd = Math.min(lines.length - 1, e.line + 25)
    let abs = 0
    for (let i = 0; i < winStart; i++) abs += lines[i].length + 1
    let found = false
    for (let i = winStart; i <= winEnd; i++) {
        const re = /principle=(["'])([a-z0-9-]+)\1/g
        let m
        while ((m = re.exec(lines[i]))) {
            const sc = scanOpening(src, abs + m.index)
            if (!sc) continue
            found = true
            if (sc.hasExplain) resolved.push(e)
            else stillMissing.push({ ...e, token: m[2] })
            break
        }
        if (found) break
        if (/principle=\{/.test(lines[i])) {
            // might be the target
        }
        abs += lines[i].length + 1
    }
    if (!found) {
        const win = lines.slice(winStart, winEnd + 1).join("\n")
        if (/principle=\{/.test(win)) dynamic.push(e)
        else stillMissing.push({ ...e, reason: "not-found" })
    }
}

console.log(
    JSON.stringify(
        {
            baselineExplainOnly: baselineExplainOnly.length,
            unlocked: unlocked.length,
            resolved: resolved.length,
            stillMissing: stillMissing.length,
            dynamic: dynamic.length,
            stillSample: stillMissing.slice(0, 20),
            dynamicSample: dynamic.slice(0, 10),
        },
        null,
        2,
    ),
)
