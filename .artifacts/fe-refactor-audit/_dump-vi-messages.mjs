/**
 * Probe: dump Vietnamese ESLint messages for English rewrite.
 * Evidence only — not a product gate.
 */
import { readFileSync, writeFileSync } from "node:fs"

const plugin = readFileSync("plugins/eslint/index.mjs", "utf8")
const VN = /[À-ÃÈ-ÊÌÍÒ-ÕÙÚÝà-ãè-êìíò-õùúýĂăĐđĨĩŨũƠơƯưẠ-ỿ]/

const messages = []
for (const m of plugin.matchAll(/(\w+):\s*"((?:\\.|[^"\\])*)"/g)) {
    if (VN.test(m[2]) && plugin.slice(Math.max(0, m.index - 80), m.index).includes("messages")) {
        messages.push({ key: m[1], text: m[2] })
    }
}

// Also catch single-line message objects more carefully
const better = []
for (const block of plugin.matchAll(/messages:\s*\{([\s\S]*?)\n\s*\}/g)) {
    for (const m of block[1].matchAll(/(\w+):\s*"((?:\\.|[^"\\])*)"/g)) {
        if (VN.test(m[2])) better.push({ key: m[1], text: m[2] })
    }
}

writeFileSync(
    ".artifacts/fe-refactor-audit/vi-messages-dump.json",
    JSON.stringify(better, null, 2),
)
console.log("dumped", better.length)
