import fs from "node:fs"
import { VN_LETTER } from "../../plugins/eslint/authoring.mjs"

const files = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_fix-vi-pass2.json", "utf8"),
).remaining.map((r) => r.file)

const uniq = [...new Set(files)]
for (const f of uniq) {
    const src = fs.readFileSync(f, "utf8")
    const lines = src.split(/\r?\n/)
    const hits = []
    for (let i = 0; i < lines.length; i++) {
        if (VN_LETTER.test(lines[i])) hits.push(`${i + 1}: ${lines[i].trim().slice(0, 160)}`)
    }
    console.log("\n" + f + (hits.length ? "" : " CLEAN"))
    hits.slice(0, 10).forEach((h) => console.log(" ", h))
}
