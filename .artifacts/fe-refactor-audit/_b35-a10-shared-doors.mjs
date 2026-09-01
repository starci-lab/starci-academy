import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const findings = JSON.parse(
  fs.readFileSync(path.join(ART, "_b35-a10-slice-findings.json"), "utf8"),
)

const doorFiles = findings.classnameDoors.map((x) => x.file)
const sharedDoors = doorFiles.filter((f) =>
  /(^|\/)(atoms|frames|composites)\//.test(f),
)

const FORBIDDEN =
  /(\\|\/)(nivo|nivoexpert|mia-mia)(\\|\/)/i

function scanConsumers(propName, componentHints) {
  // rg for className= / classNames= near imports is expensive; use ripgrep for prop usage files
  const pattern =
    propName === "classNames"
      ? String.raw`\bclassNames\s*=`
      : String.raw`\bclassName\s*=`
  let out = ""
  try {
    out = execSync(
      `rg -l -g "*.tsx" -g "*.ts" -g "!**/node_modules/**" -g "!.artifacts/**" "${pattern}" src .storybook`,
      { cwd: ROOT, encoding: "utf8", maxBuffer: 20_000_000 },
    )
  } catch (e) {
    out = e.stdout || ""
  }
  return out
    .split(/\r?\n/)
    .map((s) => s.trim().replaceAll("\\", "/"))
    .filter(Boolean)
}

const report = {
  sharedDoorFiles: sharedDoors,
  notes: "Mission B candidates — shared vocab with public classname findings",
  files: sharedDoors.map((f) => {
    const entry = findings.classnameDoors.find((x) => x.file === f)
    return { file: f, count: entry?.count, rules: entry?.rules }
  }),
}

fs.writeFileSync(
  path.join(ART, "_b35-a10-shared-doors.json"),
  JSON.stringify(report, null, 2),
)
console.log(JSON.stringify(report, null, 2))
