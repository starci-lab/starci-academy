import { execSync } from "node:child_process"
import fs from "node:fs"

const props = [
  "dialogClassName",
  "footerClassName",
  "containerClassName",
  "contentClassName",
  "heightClassName",
  "titleClassName",
  "bodyClassName",
  "chipClassName",
  "colorClassName",
]

const results = {}
for (const p of props) {
  try {
    const out = execSync(`rg -l -g "*.ts" -g "*.tsx" ${JSON.stringify(p)} src .storybook`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      shell: true,
    })
    results[p] = out
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((f) => f.replace(/\\/g, "/"))
  } catch {
    results[p] = []
  }
}
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-proven-per-part-scan.json",
  JSON.stringify(results, null, 2),
)
for (const [p, files] of Object.entries(results)) {
  console.log(p, files.length)
}
