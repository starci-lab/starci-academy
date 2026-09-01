import fs from "node:fs"
const m = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/2026-08-08-deferred-manifest-blocks-layout.json",
    "utf8",
  ),
)
for (const f of m.files) {
  const src = fs.readFileSync(f.path, "utf8")
  const imports = [...src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']@heroui\/react["']/g)].map(
    (x) => x[1].replace(/\s+/g, " ").trim(),
  )
  if (!imports.length) {
    console.log(f.path.split("/").slice(-3).join("/"), "=> (none)")
    continue
  }
  console.log(f.path.split("/").slice(-3).join("/"), "=>", imports.join(" | "))
}
