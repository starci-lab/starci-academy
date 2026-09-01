/**
 * Phase 1 classifier for ESLint architectural burn-down (2026-08-07).
 * Evidence only — writes JSON + markdown summary inputs. No product edits.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()
const product = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/eslint-product-2026-08-07.json"), "utf8"),
)
const tooling = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/eslint-tooling-2026-08-07.json"), "utf8"),
)
const ledger = JSON.parse(readFileSync(resolve(ROOT, ".claude/fe/decision-ledger.json"), "utf8"))

const A11Y = /^jsx-a11y\//
const ARCH = new Set([
    "starci-fe/require-frame-self-declare",
    "starci-fe/require-identity-root",
    "starci-fe/no-identity-wrapper-div",
    "starci-fe/no-raw-shape-at-sentence-tier",
    "starci-fe/no-classname-at-sentence-tier",
    "starci-fe/no-per-part-classname-prop",
    "starci-fe/no-heroui-outside-vocabulary",
    "starci-fe/no-cn-above-vocabulary",
    "starci-fe/no-public-frame-css-props",
    "starci-fe/page-folder-two-files-only",
    "starci-fe/no-helper-folder-in-components",
    "starci-fe/export-matches-folder",
    "starci-fe/no-parallel-skeleton",
    "starci-fe/no-inline-skeleton-branch",
    "starci-fe/no-skeleton-twin-component",
    "starci-fe/no-retired-async-content",
    "starci-fe/no-anatomy-overlay",
])
const AUTHORING = new Set([
    "starci-fe/no-inline-parameter-type",
    "starci-fe/no-emoji-in-source",
    "starci-fe/no-vietnamese-in-source-authoring",
    "starci-fe/require-export-jsdoc",
    "starci-fe/prefer-arrow-export",
    "starci-fe/handler-on-prefix",
    "starci-fe/no-arbitrary-token",
    "starci-fe/no-hero-heading-class",
    "starci-fe/no-hardcoded-user-text-in-vocabulary",
])

const HIGH_RISK = [
    /\.storybook\/utils\/BlockAnatomy\/BlockAnatomy\.tsx$/,
    /MockInterviewPage\/MockInterviewSession\//,
    /FlashcardsPage\/QuizSession\//,
    /LandingPage\/LearnLoopScroll\//,
    /blocks\/learn\/ContentAiChat\//,
    /blocks\/marketing\/ArchitectureScene\//,
    /\.storybook\/main\.ts$/,
    /\.storybook\/preview\.tsx$/,
    /\.storybook\/test-runner\.ts$/,
    /src\/resources\//,
    /src\/modules\/api\//,
    /\/nivo\//i,
    /\/nivoexpert\//i,
    /\/mia-?mia\//i,
    /MiaMia/,
]

const CONTENT_ALLOW = [
    /\/messages\/(en|vi)\.json$/i,
    /PlaygroundSessionProvider\/content\//,
    /\/__fixtures?__\//,
    /\/fixtures?\//,
    /\.fixture\.(ts|tsx|js|mjs)$/i,
    /\.test\.(ts|tsx|js|mjs)$/i,
    /\.spec\.(ts|tsx|js|mjs)$/i,
    /src\/resources\//,
]

const SCOPE_BUG_CANDIDATES = [
    // storybook harness / config — not sentence-tier components
    /\.storybook\/(main|preview|test-runner)\./,
    /\.storybook\/test-runner\//,
    /\.storybook\/utils\//,
    // app routes / modules outside component tiers often false-hit identity/frame rules
    /src\/app\//,
    /src\/modules\//,
    /src\/hooks\//,
    /src\/i18n\//,
    /src\/zustand\//,
    /src\/providers\//,
]

const holdPaths = new Map()
for (const d of ledger.decisions || []) {
    if (d.status !== "open") continue
    const paths = d.paths || (d.path ? [d.path] : [])
    for (const p of paths) {
        const norm = String(p).replace(/\\/g, "/")
        holdPaths.set(norm, d.id)
    }
}

const normPath = (p) => p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")

function tierOf(file) {
    const f = file.replace(/\\/g, "/")
    const m = f.match(/\/(?:src|\.storybook)\/components\/([^/]+)\//) || f.match(/\/src\/components\/([^/]+)\//)
    if (!m) {
        if (f.includes("/.storybook/stories/")) return "stories"
        if (f.includes("/.storybook/")) return "storybook-extra"
        if (f.includes("/src/app/")) return "app-route"
        if (f.includes("/src/modules/")) return "modules"
        if (f.includes("/src/resources/")) return "resources"
        return "other"
    }
    return m[1]
}

function classify(file, rule, msg) {
    const f = file.replace(/\\/g, "/")
    if (A11Y.test(rule || "")) {
        return {
            class: "out-of-scope-a11y",
            note: "jsx-a11y explicitly excluded from this batch",
        }
    }
    for (const [hp, id] of holdPaths) {
        if (f.endsWith(hp) || f.includes(hp)) {
            return { class: "teacher-hold", note: `ledger:${id}` }
        }
    }
    if (
        (rule === "starci-fe/no-emoji-in-source" || rule === "starci-fe/no-vietnamese-in-source-authoring") &&
    CONTENT_ALLOW.some((re) => re.test(f))
    ) {
        return { class: "content-allowlist", note: "locale/fixture/resources path — allowlist candidate" }
    }
    if (HIGH_RISK.some((re) => re.test(f))) {
        return { class: "hard-case", note: "known high-risk area — manual review required before repair" }
    }
    if (SCOPE_BUG_CANDIDATES.some((re) => re.test(f))) {
    // identity/frame/raw-shape on non-component trees often scope bugs
        if (
            [
                "starci-fe/require-identity-root",
                "starci-fe/require-frame-self-declare",
                "starci-fe/no-raw-shape-at-sentence-tier",
                "starci-fe/no-classname-at-sentence-tier",
                "starci-fe/page-folder-two-files-only",
                "starci-fe/export-matches-folder",
            ].includes(rule)
        ) {
            return { class: "scope-bug", note: "rule likely scanning non-tier / harness / route file" }
        }
    }
    // page-folder-two-files-only on files that ARE the extra files → confirmed structural
    if (rule === "starci-fe/page-folder-two-files-only") {
        return { class: "confirmed", note: "extra file inside page/layout/overlay folder" }
    }
    if (rule === "starci-fe/no-helper-folder-in-components") {
        return { class: "confirmed", note: "constants/utils/types/hooks under components/" }
    }
    if (ARCH.has(rule) || AUTHORING.has(rule)) {
        return { class: "confirmed", note: "architectural/authoring debt in component tree" }
    }
    if (!rule) {
        return { class: "hard-case", note: "parse/other — inspect manually" }
    }
    return { class: "confirmed", note: "default architectural/authoring" }
}

function collect(results, scope) {
    const findings = []
    for (const file of results) {
        const rel = normPath(file.filePath)
        for (const m of file.messages || []) {
            const rule = m.ruleId || "(other)"
            const c = classify(rel, rule, m)
            findings.push({
                scope,
                file: rel,
                line: m.line,
                column: m.column,
                rule,
                severity: m.severity,
                message: m.message,
                tier: tierOf(rel),
                classification: c.class,
                note: c.note,
            })
        }
    }
    return findings
}

const findings = [...collect(product, "product"), ...collect(tooling, "tooling")]

// overlap: same file+line with multiple rules
const byLoc = new Map()
for (const f of findings) {
    const k = `${f.file}:${f.line}`
    if (!byLoc.has(k)) byLoc.set(k, [])
    byLoc.get(k).push(f)
}
const overlapLocs = [...byLoc.entries()].filter(([, arr]) => new Set(arr.map((a) => a.rule)).size > 1)

// mark overlap classification on secondary rules when co-located with className/cn/heroui/raw-shape clusters
const OVERLAP_CLUSTER = new Set([
    "starci-fe/no-classname-at-sentence-tier",
    "starci-fe/no-cn-above-vocabulary",
    "starci-fe/no-raw-shape-at-sentence-tier",
    "starci-fe/no-heroui-outside-vocabulary",
    "starci-fe/no-per-part-classname-prop",
    "starci-fe/require-frame-self-declare",
    "starci-fe/require-identity-root",
    "starci-fe/no-identity-wrapper-div",
])
let overlapMarked = 0
for (const [, arr] of byLoc) {
    const rules = new Set(arr.map((a) => a.rule))
    const cluster = [...rules].filter((r) => OVERLAP_CLUSTER.has(r))
    if (cluster.length < 2) continue
    // keep first as confirmed, mark rest overlap if they were confirmed
    let kept = false
    for (const f of arr) {
        if (!OVERLAP_CLUSTER.has(f.rule)) continue
        if (f.classification === "hard-case" || f.classification === "teacher-hold" || f.classification === "scope-bug")
            continue
        if (!kept) {
            kept = true
            f.note = `${f.note}; primary in overlap cluster [${cluster.join(", ")}]`
            continue
        }
        f.classification = "overlap"
        f.note = `same line as ${cluster[0]} — fix once`
        overlapMarked++
    }
}

const byRule = {}
const byClass = {}
const byTier = {}
for (const f of findings) {
    byRule[f.rule] = (byRule[f.rule] || 0) + 1
    byClass[f.classification] = (byClass[f.classification] || 0) + 1
    byTier[f.tier] = (byTier[f.tier] || 0) + 1
}

const highRiskDetail = findings.filter((f) => HIGH_RISK.some((re) => re.test(f.file.replace(/\\/g, "/"))))

const out = {
    generated: "2026-08-07",
    productFiles: product.length,
    toolingFiles: tooling.length,
    totalFindings: findings.length,
    byRule: Object.fromEntries(Object.entries(byRule).sort((a, b) => b[1] - a[1])),
    byClass,
    byTier: Object.fromEntries(Object.entries(byTier).sort((a, b) => b[1] - a[1])),
    overlapLocations: overlapLocs.length,
    overlapMarked,
    highRiskFindingCount: highRiskDetail.length,
    openHoldsInLedger: [...holdPaths.keys()].length,
    samples: {
        scopeBug: findings.filter((f) => f.classification === "scope-bug").slice(0, 40),
        contentAllowlist: findings.filter((f) => f.classification === "content-allowlist").slice(0, 40),
        teacherHold: findings.filter((f) => f.classification === "teacher-hold").slice(0, 40),
        hardCase: findings.filter((f) => f.classification === "hard-case").slice(0, 80),
        a11y: findings.filter((f) => f.classification === "out-of-scope-a11y"),
        confirmedByRule: Object.fromEntries(
            [...ARCH, ...AUTHORING].map((r) => [
                r,
                findings.filter((f) => f.rule === r && f.classification === "confirmed").length,
            ]),
        ),
    },
}

writeFileSync(
    resolve(ROOT, ".artifacts/fe-refactor-audit/2026-08-07-eslint-architectural-classify.json"),
    JSON.stringify(out, null, 2),
)

// per-file summary for partitions
const byFile = {}
for (const f of findings) {
    if (f.classification === "out-of-scope-a11y") continue
    if (!byFile[f.file]) byFile[f.file] = { file: f.file, tier: f.tier, counts: {}, classes: {} }
    byFile[f.file].counts[f.rule] = (byFile[f.file].counts[f.rule] || 0) + 1
    byFile[f.file].classes[f.classification] = (byFile[f.file].classes[f.classification] || 0) + 1
}
writeFileSync(
    resolve(ROOT, ".artifacts/fe-refactor-audit/2026-08-07-eslint-architectural-by-file.json"),
    JSON.stringify(Object.values(byFile).sort((a, b) => {
        const sa = Object.values(a.counts).reduce((x, y) => x + y, 0)
        const sb = Object.values(b.counts).reduce((x, y) => x + y, 0)
        return sb - sa
    }), null, 2),
)

console.log(
    JSON.stringify(
        {
            total: findings.length,
            byClass,
            byRuleTop: Object.entries(byRule)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 35),
            overlapLocations: overlapLocs.length,
            overlapMarked,
            highRiskFindingCount: highRiskDetail.length,
            toolingFindings: findings.filter((f) => f.scope === "tooling").length,
        },
        null,
        2,
    ),
)
