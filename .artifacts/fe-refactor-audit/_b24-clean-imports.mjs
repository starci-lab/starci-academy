import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const files = execSync("git diff --name-only HEAD", { encoding: "utf8" })
  .split(/\r?\n/)
  .filter((f) => /\.(tsx|ts)$/.test(f))

let n = 0
for (const rel of files) {
  const abs = path.join(process.cwd(), rel)
  if (!fs.existsSync(abs)) continue
  let s = fs.readFileSync(abs, "utf8")
  if (!/import type \{ AllowedClassName \}/.test(s)) continue
  const withoutImport = s.replace(/import type \{ AllowedClassName \} from ["'][^"']+["'];?\r?\n?/g, "")
  if (/\bAllowedClassName\b/.test(withoutImport)) continue
  const next = withoutImport.replace(/\n{3,}/g, "\n\n")
  if (next !== s) {
    fs.writeFileSync(abs, next)
    n++
    console.log("cleaned", rel)
  }
}
console.log("cleaned count", n)
