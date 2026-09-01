#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"

const repo = process.argv[2] ?? "."
const result = spawnSync(
    "rg",
    ["-l", String.raw`principles=\{\[`, "--glob", "*.tsx", "--glob", "*.ts", ".storybook", "src"],
    { cwd: repo, encoding: "utf8", shell: true },
)
const files = (result.stdout || "").split(/\r?\n/).filter(Boolean)
let singles = 0
const multi = []

for (const file of files) {
    let src = readFileSync(file, "utf8")
    const next = src.replace(/principles=\{\["([^"]+)"\]\}/g, (_m, token) => {
        singles += 1
        return `principles="${token}"`
    })
    if (next !== src) {
        src = next
        writeFileSync(file, src)
    }
    const multiRe = /principles=\{\["([^"]+)"(?:\s*,\s*"[^"]+")+\]\}/g
    let match
    while ((match = multiRe.exec(src))) {
        multi.push(`${file}:${src.slice(0, match.index).split(/\n/).length}:${match[0]}`)
    }
}

console.log(`single-token conversions: ${singles}`)
console.log(`multi-token remaining: ${multi.length}`)
for (const row of multi) console.log(`  ${row}`)
