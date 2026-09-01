import fs from "node:fs"

const m = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json",
    "utf8",
  ),
)
const files = m.manifests["agent-1-button"].files

for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/)
  const interesting = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (
      /classNames?\s*=/.test(line) ||
      /<(Button|ButtonGroup|ButtonBase)\b/.test(line) ||
      /FillAvailable|ShowFrom|Measure|GridItem/.test(line)
    ) {
      interesting.push(`${String(i + 1).padStart(4)}|${line}`)
    }
  }
  if (interesting.length) {
    console.log("\n===", f, "===")
    console.log(interesting.join("\n"))
  }
}
