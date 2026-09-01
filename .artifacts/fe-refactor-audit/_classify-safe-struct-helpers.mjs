/**
 * Classify no-helper-folder-in-components targets for SAFE moves only.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, basename, relative } from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const targets = JSON.parse(
    readFileSync(".artifacts/fe-refactor-audit/_safe-struct-targets.json", "utf8"),
)
const helpers = [
    ...new Set(
        targets["starci-fe/no-helper-folder-in-components"].map((h) =>
            h.file.replace(/\\/g, "/").replace(/^.*?(src\/)/, "$1"),
        ),
    ),
]

const LOCKED = [
    "MockInterviewSession",
    "QuizSession",
    "LearnLoopScroll",
    "ContentAiChat",
    "ArchitectureScene",
    "BlockAnatomy",
    "nivo",
    "nivoexpert",
    // resources as path segment under components is rare; ArchitecturePage hooks stay
]

function isLocked(f) {
    return LOCKED.some((L) => f.includes(`/${L}/`) || f.includes(`/${L}.`))
}

function rg(args) {
    try {
        return execSync(`rg ${args}`, { encoding: "utf8", cwd: ROOT, stdio: ["pipe", "pipe", "pipe"] })
    } catch (e) {
        return e.stdout || ""
    }
}

const groups = new Map()
for (const f of helpers) {
    if (isLocked(f)) continue
    // ArchitecturePage is adjacent to locked ArchitectureScene — skip its hooks
    if (f.includes("/ArchitecturePage/")) continue
    const m = f.match(/^(.*?\/(?:constants|utils|types|hooks))(?:\/|$)/)
    if (!m) continue
    const key = m[1]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(f)
}

const results = []
for (const [dir, files] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const kind = basename(dir)
    const parent = dirname(dir)
    const absAlias = `@/${parent.replace(/^src\//, "")}/${kind}`

    // Absolute alias importers anywhere
    const absHits = rg(`-l ${JSON.stringify(absAlias)} src --glob "*.{ts,tsx}"`)
        .trim()
        .split(/\n/)
        .filter(Boolean)
        .map((p) => p.replace(/\\/g, "/"))

    // Relative imports of ./hooks ./types etc from parent tree
    const relHits = rg(
        `-n "from [\\"'](\\.\\./)*${kind}(/|\\"|')" ${JSON.stringify(parent)} --glob "*.{ts,tsx}"`,
    )
        .trim()
        .split(/\n/)
        .filter(Boolean)

    // Also search exported symbol names outside parent
    const nonBarrel = files.filter((f) => !f.endsWith("/index.ts") && !f.endsWith("/index.tsx"))
    const peek = nonBarrel.map((f) => {
        const src = readFileSync(f, "utf8")
        const exports = [
            ...src.matchAll(
                /export (?:const|function|type|interface|enum|class|async function) ([A-Za-z0-9_]+)/g,
            ),
        ].map((m) => m[1])
        const hasReact = /from ["']react["']|use[A-Z][A-Za-z]+/.test(src)
        const hasFetch = /useSWR|fetch\(|graphql|mutate[A-Z]|useQuery/.test(src)
        const hasDom = /document\.|window\.|HTMLElement|addEventListener/.test(src)
        return {
            file: f,
            lines: src.split(/\n/).length,
            hasReact,
            hasFetch,
            hasDom,
            exports: exports.slice(0, 12),
            head: src.slice(0, 240).replace(/\s+/g, " "),
        }
    })

    // Outside-parent absolute importers
    const outsideAbs = absHits.filter((h) => !h.startsWith(parent + "/") && h !== parent)

    // Heuristic verdict
    let verdict = "SKIP"
    let reason = "unclear home / co-located with component"
    let dest = null

    const allPureUtil =
        kind === "utils" &&
        peek.length > 0 &&
        peek.every((p) => !p.hasReact && !p.hasFetch && !p.hasDom)
    const allPureTypes = kind === "types" && peek.every((p) => !p.hasReact && !p.hasFetch)
    const allConstants = kind === "constants" && peek.every((p) => !p.hasReact && !p.hasFetch)
    const localOnly = outsideAbs.length === 0

    // SAFE: pure utils with clear generic name, local-only or few abs
    if (allPureUtil && localOnly) {
        // Prefer modules/utils/<name>.ts when single file with clear export
        if (nonBarrel.length === 1) {
            const name = basename(nonBarrel[0]).replace(/\.ts$/, "")
            dest = `src/modules/utils/${name}.ts`
            verdict = "SAFE-CANDIDATE"
            reason = "pure util, local-only importers"
        } else if (nonBarrel.length <= 2) {
            dest = `src/modules/utils/<from-${basename(parent)}>/`
            verdict = "SAFE-CANDIDATE"
            reason = "pure utils folder, local-only"
        }
    } else if (allConstants && localOnly && nonBarrel.length <= 2) {
        // constants often belong in resources or stay — only if clearly config/copy
        const names = nonBarrel.map((f) => basename(f))
        if (names.some((n) => /url|path|tab|language|pdf|size|format/i.test(n))) {
            dest = `src/resources/ or keep colocated → SKIP unless trivial`
            verdict = "MAYBE"
            reason = "constants local-only; destination ambiguous (resources vs modules)"
        } else {
            verdict = "SKIP"
            reason = "component-local constants without clear resources home"
        }
    } else if (kind === "hooks") {
        // hooks go to src/hooks/ only when reusable/fetch; page-local SWR hooks are gray
        if (localOnly && peek.every((p) => p.hasFetch || p.hasReact)) {
            verdict = "MAYBE"
            reason = "hook local-only; move to src/hooks/ only if not page-private wiring"
            dest = `src/hooks/<name>.ts`
        } else if (outsideAbs.length > 0) {
            verdict = "MAYBE"
            reason = "hook already imported outside parent — move to src/hooks/ may be clean"
            dest = `src/hooks/<name>.ts`
        } else {
            verdict = "SKIP"
            reason = "page/block-private hook; risky without clear shared home"
        }
    } else if (allPureTypes && localOnly) {
        verdict = "SKIP"
        reason = "component-private types; modules/types home unclear without domain entity"
    } else if (!localOnly) {
        verdict = "MAYBE"
        reason = "imported outside parent — check if move is mechanical"
    }

    results.push({
        dir,
        kind,
        fileCount: files.length,
        nonBarrel: nonBarrel.length,
        outsideAbs,
        absHits,
        relHitCount: relHits.length,
        verdict,
        reason,
        dest,
        peek,
    })
}

const summary = {
    SAFE: results.filter((r) => r.verdict === "SAFE-CANDIDATE"),
    MAYBE: results.filter((r) => r.verdict === "MAYBE"),
    SKIP: results.filter((r) => r.verdict === "SKIP"),
}

writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-struct-helper-classify.json",
    JSON.stringify({ summaryCounts: { SAFE: summary.SAFE.length, MAYBE: summary.MAYBE.length, SKIP: summary.SKIP.length }, results }, null, 2),
)

console.log(
    JSON.stringify(
        {
            counts: {
                SAFE: summary.SAFE.length,
                MAYBE: summary.MAYBE.length,
                SKIP: summary.SKIP.length,
            },
            SAFE: summary.SAFE.map((r) => ({ dir: r.dir, dest: r.dest, reason: r.reason, peek: r.peek })),
            MAYBE: summary.MAYBE.map((r) => ({
                dir: r.dir,
                dest: r.dest,
                reason: r.reason,
                outsideAbs: r.outsideAbs,
                exports: r.peek.flatMap((p) => p.exports),
            })),
        },
        null,
        2,
    ),
)
