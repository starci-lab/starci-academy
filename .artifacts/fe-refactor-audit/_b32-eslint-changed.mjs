/**
 * Run eslint --max-warnings=0 on B32 changed files in chunks.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ART = path.join(process.cwd(), ".artifacts/fe-refactor-audit")
const status = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32-status.json"), "utf8"))
const files = (status.gateCandidateFiles || []).filter((f) => fs.existsSync(f))
const CHUNK = 25
const results = []

for (let i = 0; i < files.length; i += CHUNK) {
  const chunk = files.slice(i, i + CHUNK)
  const proc = spawnSync("npx", ["eslint", "--max-warnings=0", ...chunk], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: true,
    maxBuffer: 32 * 1024 * 1024,
  })
  results.push({
    index: Math.floor(i / CHUNK) + 1,
    files: chunk.length,
    exit: proc.status,
    stderr: (proc.stderr || "").slice(-2000),
    stdout: (proc.stdout || "").slice(-4000),
  })
  console.log(`chunk ${results.at(-1).index}: exit=${proc.status} files=${chunk.length}`)
}

fs.writeFileSync(path.join(ART, "_b32-eslint-changed-chunks.json"), JSON.stringify(results, null, 2))
const failed = results.filter((r) => r.exit !== 0)
console.log(JSON.stringify({ chunks: results.length, failed: failed.length }, null, 2))
process.exit(failed.length ? 1 : 0)
