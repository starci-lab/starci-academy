/**
 * Audit + repair damage from matching `principle=` inside `data-principle=`.
 */
import fs from "node:fs"
import { execSync } from "node:child_process"

const r = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json", "utf8"),
)

const issues = []
for (const file of r.files) {
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, "utf8")
    const kinds = []
    if (/explain="[^"]+"\s*>\s*\n\s*explain=/.test(src)) kinds.push("dup-explain-with-closer")
    if (/explain="[^"]+"\s*>\s*\n\s*explain="[^"]+"\s*>/.test(src)) kinds.push("double-closed-explain")
    if (/>>/.test(src)) kinds.push("double-gt")
    if (/data-principle=["'][^"']+["'][^\n]*\n\s*explain=/.test(src)) kinds.push("explain-after-data-principle")
    // orphan explain line that is only explain="..."> 
    if (/^\s*explain="[^"]+"\s*>\s*$/m.test(src)) kinds.push("orphan-explain-closer-line")
    if (kinds.length) issues.push({ file, kinds })
}
console.log(JSON.stringify({ issueCount: issues.length, issues }, null, 2))
