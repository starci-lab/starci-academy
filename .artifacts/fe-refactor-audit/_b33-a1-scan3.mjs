import fs from "node:fs"
import path from "node:path"

const m = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/2026-08-10-b33-manifests.json",
    "utf8",
  ),
)
const files = m.manifests["agent-1-button"].files

function isHouseButtonImport(text) {
  return /from\s+["'](@\/components\/atoms\/buttons\/Button|@sb-components\/atoms\/buttons\/Button)/.test(
    text,
  )
}

for (const f of files) {
  const text = fs.readFileSync(f, "utf8")
  const house = isHouseButtonImport(text)
  const lines = text.split(/\r?\n/)
  const hits = []
  for (let i = 0; i < lines.length; i++) {
    if (/<(Button|ButtonGroup)\b/.test(lines[i])) {
      // look ahead 12 lines for className
      const window = lines.slice(i, i + 12).join("\n")
      const cn = window.match(/classNames?\s*=\s*(\{[\s\S]*?\}|"[^"]*"|'[^']*')/)
      if (cn) {
        hits.push({
          line: i + 1,
          prop: cn[0].replace(/\s+/g, " ").slice(0, 140),
        })
      }
    }
  }
  console.log(
    JSON.stringify({
      f,
      houseButtonImport: house,
      heroUiButtonImport: /from\s+["']@heroui\/react["']/.test(text) && /Button/.test(text.match(/import[\s\S]*?from\s+["']@heroui\/react["']/)?.[0] || ""),
      buttonClassHits: hits,
    }),
  )
}
