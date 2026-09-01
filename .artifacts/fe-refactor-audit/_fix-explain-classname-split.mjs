/**
 * Repair pattern-coverage raw holes caused by explain= landing on a different
 * line from principle/className. Keeps principle + className on one line;
 * explain may follow on the same line or the next.
 */
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const SPACING = /\b(gap-[1-9]|p-[1-9]|px-[1-9]|py-[1-9]|ml-auto|mt-auto|mx-auto)\b/
const ROOT = process.cwd()

const files = execSync("git diff --name-only HEAD", { encoding: "utf8" })
    .split(/\r?\n/)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\\/g, "/"))

let filesFixed = 0
let sites = 0

for (const rel of files) {
    const full = path.join(ROOT, rel)
    if (!fs.existsSync(full)) continue
    let src = fs.readFileSync(full, "utf8")
    const orig = src

    // Pattern A: principle="tok"\n explain="..." className="...spacing..."
    src = src.replace(
        /(\b(?:data-)?principle\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\2(?:\s*\})?)\s*\r?\n(\s*)((?:data-)?explain\s*=\s*(?:"[^"]*"|`[^`]*`|'[^']*')\s+)(className=(?:"[^"]*"|`[^`]*`))/g,
        (m, principle, _q, _tok, indent, explain, className) => {
            if (!SPACING.test(className) && !SPACING.test(m)) {
                // still merge — safer for gate even without spacing
            }
            sites++
            return `${principle} ${className}\n${indent}${explain.trim()}`
        },
    )

    // Pattern B: same but explain uses {"..."} or template spanning — skip for now

    // Pattern C: line is only explain=... className="spacing" — pull principle from prior line
    const lines = src.split(/\r?\n/)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        const prev = lines[i - 1]
        if (/\b(?:data-)?principle\b/.test(line)) continue
        if (!/className=(?:"|`)([^"`]*)(?:"|`)/.test(line)) continue
        const cm = line.match(/className=(?:"|`)([^"`]*)(?:"|`)/)
        if (!cm || !SPACING.test(cm[1])) continue
        if (!/\b(?:data-)?explain\s*=/.test(line)) continue
        const pm = prev.match(/\b((?:data-)?principle\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\2(?:\s*\})?)\s*$/)
        if (!pm) continue
        // move principle token onto this line; strip from prev if prev is only principle (+whitespace)
        const principleAttr = pm[1]
        lines[i] = line.replace(/\b((?:data-)?explain\s*=)/, `${principleAttr} $1`)
        if (/^\s*((?:data-)?principle\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\2(?:\s*\})?)\s*$/.test(prev)) {
            lines[i - 1] = null // drop pure principle line
        } else {
            lines[i - 1] = prev.replace(/\s*\b((?:data-)?principle\s*=\s*(?:\{\s*)?(["'`])([^"'`]+)\2(?:\s*\})?)\s*$/, "")
        }
        sites++
    }
    src = lines.filter((l) => l !== null).join("\n")

    if (src !== orig) {
        fs.writeFileSync(full, src)
        filesFixed++
    }
}

console.log({ filesFixed, sites })
