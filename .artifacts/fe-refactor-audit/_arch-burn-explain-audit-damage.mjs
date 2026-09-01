/**
 * Detect + repair bad explain insertions from the burn script.
 * Strategy: git checkout corrupted product files, then re-apply with correct insertion.
 */
import fs from "node:fs"
import { execSync } from "node:child_process"

const r = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_arch-burn-explain-only-result.json", "utf8"),
)

const bad = []
for (const file of r.files) {
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, "utf8")
    const kinds = []
    if (/items=\{\[\s*\n\s*explain=/.test(src)) kinds.push("explain-in-items")
    if (/explain="[^"]+"\s*\n\s*explain="/.test(src)) kinds.push("dup-explain")
    if (/explain="[^"]+"\s*\n\s*\(\)\s*=>/.test(src)) kinds.push("explain-before-arrow")
    // explain sitting between attrs and items on next line with wrong indent inside brace
    if (/principle=["'][a-z0-9-]+["'][^\n]*\n\s*explain=["'][^"']+["']\s*\n\s*\(\)/.test(src))
        kinds.push("explain-then-child")
    if (kinds.length) bad.push({ file, kinds })
}
console.log(JSON.stringify({ badCount: bad.length, bad }, null, 2))
