import fs from "node:fs"
import { execSync } from "node:child_process"

const out = execSync("git status --porcelain", { encoding: "utf8" })
const files = out
    .split(/\r?\n/)
    .map((l) => l.slice(3).trim().replace(/^"|"$/g, ""))
    .filter(
        (f) =>
            /\.(tsx?|jsx?|mjs)$/.test(f) &&
      !f.startsWith(".artifacts/") &&
      !f.startsWith("plugins/") &&
      !f.includes("_fix-") &&
      !f.includes("_safe-") &&
      !f.includes("_dump") &&
      !f.includes("_collect") &&
      !f.includes("_inventory") &&
      !f.includes("_scan") &&
      !f.includes("_show") &&
      !f.includes("_english-") &&
      !f.includes("_bucket-") &&
      !f.includes("_classify-") &&
      !f.includes("_probe-") &&
      !f.includes("_migrate-") &&
      !f.includes("_check-") &&
      !f.includes("_partition-") &&
      !f.includes("_finish-") &&
      !f.includes("_normalize-") &&
      !f.includes("_profile-") &&
      !f.includes("_remaining-") &&
      !f.includes("_src-") &&
      !f.includes("scripts/_pattern"),
    )

fs.writeFileSync(".artifacts/fe-refactor-audit/_changed-for-eslint.txt", files.join("\n"))
console.log("candidate files", files.length)
files.forEach((f) => console.log(f))
