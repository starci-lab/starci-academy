/**
 * Dump Vietnamese + emoji hits with surrounding source line for triage.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const { byRule } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-authoring-eligible.json", "utf8"),
)

const dump = (ruleId) => {
    const hits = byRule[ruleId] || []
    const out = []
    for (const h of hits) {
        const abs = path.join(ROOT, h.file)
        let lineText = ""
        try {
            const lines = fs.readFileSync(abs, "utf8").split(/\r?\n/)
            lineText = lines[h.line - 1] || ""
        } catch {
            lineText = "<unreadable>"
        }
        const kind =
      /^\s*\/\//.test(lineText) || /^\s*\*/.test(lineText) || /^\s*\/\*/.test(lineText)
          ? "comment"
          : /["'`]/.test(lineText)
              ? "stringish"
              : "other"
        out.push({ ...h, lineText: lineText.slice(0, 200), kind })
    }
    return out
}

const vi = dump("starci-fe/no-vietnamese-in-source-authoring")
const emoji = dump("starci-fe/no-emoji-in-source")

const viByKind = { comment: 0, stringish: 0, other: 0 }
for (const h of vi) viByKind[h.kind]++
const emojiByKind = { comment: 0, stringish: 0, other: 0 }
for (const h of emoji) emojiByKind[h.kind]++

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-authoring-vi-emoji-dump.json",
    JSON.stringify({ viByKind, emojiByKind, vi, emoji }, null, 2),
)
console.log({ vi: vi.length, viByKind, emoji: emoji.length, emojiByKind })
console.log("\n--- VI comments sample ---")
for (const h of vi.filter((x) => x.kind === "comment").slice(0, 15)) {
    console.log(h.file + ":" + h.line, h.lineText.trim())
}
console.log("\n--- VI stringish sample ---")
for (const h of vi.filter((x) => x.kind === "stringish").slice(0, 20)) {
    console.log(h.file + ":" + h.line, h.lineText.trim())
}
console.log("\n--- emoji stringish sample ---")
for (const h of emoji.filter((x) => x.kind === "stringish").slice(0, 25)) {
    console.log(h.file + ":" + h.line, h.lineText.trim())
}
