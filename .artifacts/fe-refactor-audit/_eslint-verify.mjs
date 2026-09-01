import fs from "node:fs"
import { spawnSync } from "node:child_process"

const sets = [
    ".artifacts/fe-refactor-audit/_fix-emoji-result.json",
    ".artifacts/fe-refactor-audit/_fix-vi-result.json",
    ".artifacts/fe-refactor-audit/_fix-vi-pass2.json",
    ".artifacts/fe-refactor-audit/_fix-inline-param-result.json",
]

const files = new Set()

// handlers
try {
    // from earlier console — re-derive from eligible + check git diff for handle→on
} catch {}

for (const p of sets) {
    if (!fs.existsSync(p)) continue
    const j = JSON.parse(fs.readFileSync(p, "utf8"))
    for (const c of j.changed || []) {
        files.add(typeof c === "string" ? c : c.file)
    }
}

// handlers from eligible (we changed all except collision)
const { byRule } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-authoring-eligible.json", "utf8"),
)
for (const h of byRule["starci-fe/handler-on-prefix"] || []) {
    if (h.file !== "src/components/pages/FlashcardsPage/DueReview/index.tsx") files.add(h.file)
}
for (const h of byRule["starci-fe/prefer-arrow-export"] || []) {
    if (h.file !== "src/modules/utils/computations/pow-10.ts") files.add(h.file)
}

// manual extras
;[
    "src/app/[locale]/error.tsx",
    "src/app/[locale]/not-found.tsx",
    ".storybook/utils/AnatomyOverlay/AnatomyOverlay.tsx",
    ".storybook/utils/AnatomyOverlay/anatomy-context.tsx",
    "src/components/layouts/LearnShellLayout/index.tsx",
].forEach((f) => files.add(f))

const list = [...files].filter((f) => fs.existsSync(f)).sort()
fs.writeFileSync(".artifacts/fe-refactor-audit/_eslint-targets.txt", list.join("\n"))
console.log("eslint targets", list.length)

// Run eslint in chunks to avoid command line length limits
const chunkSize = 40
let failed = 0
const failures = []
for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize)
    console.log(`\n=== eslint chunk ${i / chunkSize + 1} (${chunk.length} files) ===`)
    const r = spawnSync("npx", ["eslint", "--max-warnings=0", ...chunk], {
        encoding: "utf8",
        shell: true,
        maxBuffer: 20 * 1024 * 1024,
    })
    if (r.status !== 0) {
        failed++
        failures.push({ chunk: i / chunkSize + 1, status: r.status, out: (r.stdout || "") + (r.stderr || "") })
        console.log(r.stdout?.slice(0, 4000))
        console.log(r.stderr?.slice(0, 2000))
    } else {
        console.log("ok")
    }
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_eslint-verify.json",
    JSON.stringify({ targetCount: list.length, failedChunks: failed, failures: failures.map((f) => ({ chunk: f.chunk, status: f.status, out: f.out.slice(0, 8000) })) }, null, 2),
)
console.log("\nDONE failedChunks", failed)
