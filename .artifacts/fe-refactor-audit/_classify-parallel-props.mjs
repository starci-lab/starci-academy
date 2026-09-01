import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()
const debt = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/_skeleton-folder-debt.json"), "utf8"),
)
const props = debt["starci-fe/no-parallel-skeleton"].unlocked.filter((e) =>
    e.msg.startsWith("Prop"),
)

for (const e of props) {
    const src = readFileSync(resolve(ROOT, e.file), "utf8")
    const lines = src.split(/\r?\n/)
    const start = Math.max(0, e.line - 4)
    const snippet = lines.slice(start, e.line + 2).join(" | ")
    const kind = /AsyncContent/.test(snippet)
        ? "AsyncContent"
        : /skeleton=/.test(lines[e.line - 1] || "")
            ? "other-skeleton-prop"
            : "unknown"
    console.log(`${kind}\t${e.file}:${e.line}`)
}
