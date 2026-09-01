import { execFileSync } from "node:child_process"
import fs from "node:fs"

const { batch } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_pages-core-batch.json", "utf8"),
)
const out = ".artifacts/fe-refactor-audit/_pages-core-eslint-before.json"
try {
    execFileSync("npx", ["eslint", "--format", "json", "-o", out, ...batch], {
        stdio: "pipe",
        shell: true,
        maxBuffer: 50 * 1024 * 1024,
    })
} catch {
    // eslint non-zero when findings exist
}

const SAFE = new Set([
    "starci-fe/require-export-jsdoc",
    "starci-fe/prefer-arrow-export",
    "starci-fe/handler-on-prefix",
    "starci-fe/no-inline-parameter-type",
    "starci-fe/no-emoji-in-source",
    "starci-fe/no-vietnamese-in-source-authoring",
    "starci-fe/require-identity-root",
    "starci-fe/no-inline-skeleton-branch",
    "starci-fe/no-runtime-namespace",
])

const data = JSON.parse(fs.readFileSync(out, "utf8"))
const summary = []
for (const f of data) {
    const msgs = (f.messages || []).filter((m) => SAFE.has(m.ruleId))
    if (!msgs.length) continue
    const rel = f.filePath.replace(/\\/g, "/").replace(/^.*\/(src\/)/, "src/")
    summary.push({
        path: rel,
        messages: msgs.map((m) => ({
            line: m.line,
            col: m.column,
            rule: m.ruleId,
            message: m.message,
        })),
    })
}
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_pages-core-eslint-summary.json",
    JSON.stringify(summary, null, 2),
)
console.log("files with safe msgs", summary.length)
for (const s of summary) {
    console.log("\n==", s.path)
    for (const m of s.messages) {
        console.log(
            `  ${m.line}:${m.col} ${m.rule.replace("starci-fe/", "")} ${m.message.slice(0, 140)}`,
        )
    }
}
