/**
 * Compare eslint on checkpoint (8c13fd52) vs working tree for B30 product files.
 */
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { spawnSync, execSync } from "node:child_process"

const ROOT = process.cwd()
const CHECKPOINT = "8c13fd52"
const FILES = [
  "src/components/blocks/commerce/TierCard/index.tsx",
  "src/components/blocks/commerce/TierCardBase/index.tsx",
  "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
  "src/components/blocks/feedback/ReadinessChecklist/index.tsx",
  "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
  "src/components/blocks/lists/LabeledList/index.tsx",
  "src/components/blocks/lists/ListRow/index.tsx",
  "src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx",
  "src/components/blocks/navigation/SidebarNavItem/index.tsx",
  "src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx",
  "src/components/pages/DashboardPage/TopLearners/component.tsx",
  "src/components/pages/FlashcardsPage/index.tsx",
  "src/components/pages/NotificationsPage/index.tsx",
]

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "b30c-cp-"))
const mapped = []
for (const f of FILES) {
  let content
  try {
    content = execSync(`git show ${CHECKPOINT}:${f}`, { cwd: ROOT, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 })
  } catch {
    console.log("missing at checkpoint", f)
    continue
  }
  const dest = path.join(tmp, f.replace(/\//g, "__"))
  fs.writeFileSync(dest, content)
  mapped.push({ orig: f, dest })
}

const eslint = spawnSync("npx", ["eslint", "-f", "json", ...mapped.map((m) => m.dest)], {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
  shell: true,
})

const results = JSON.parse((eslint.stdout || "").slice((eslint.stdout || "").indexOf("[")) || "[]")
const byOrig = {}
for (const file of results) {
  const dest = file.filePath
  const hit = mapped.find((m) => path.resolve(m.dest) === path.resolve(dest) || dest.endsWith(path.basename(m.dest)))
  const orig = hit?.orig || dest
  byOrig[orig] = {
    count: (file.messages || []).length,
    rules: {},
  }
  for (const m of file.messages || []) {
    byOrig[orig].rules[m.ruleId] = (byOrig[orig].rules[m.ruleId] || 0) + 1
  }
}

console.log("checkpoint warnings by file:")
for (const [f, s] of Object.entries(byOrig).sort()) {
  console.log(`${f}: ${s.count} ${JSON.stringify(s.rules)}`)
}
fs.writeFileSync(
  path.join(ROOT, ".artifacts/fe-refactor-audit/2026-08-09-b30c-checkpoint-warnings.json"),
  JSON.stringify({ checkpoint: CHECKPOINT, byOrig }, null, 2) + "\n",
)
console.log("tmp", tmp)
