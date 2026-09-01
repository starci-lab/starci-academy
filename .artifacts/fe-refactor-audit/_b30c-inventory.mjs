/**
 * B30c — exact warning inventory for changed-set ratchet.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

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
  "plugins/eslint/sentence-tier.test.mjs",
]

const eslint = spawnSync("npx", ["eslint", "-f", "json", ...FILES], {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
  shell: true,
})

const results = JSON.parse((eslint.stdout || "").slice((eslint.stdout || "").indexOf("[")) || "[]")
const inventory = []

for (const file of results) {
  const rel = path.relative(ROOT, file.filePath).replace(/\\/g, "/")
  for (const m of file.messages || []) {
    inventory.push({
      file: rel,
      line: m.line,
      column: m.column,
      severity: m.severity === 2 ? "error" : "warning",
      ruleId: m.ruleId,
      message: m.message,
    })
  }
}

// Also eslint checkpoint versions via temp? Skip — classify ownership via git blame / diff heuristics.
const byFile = {}
for (const row of inventory) {
  byFile[row.file] ??= { count: 0, rules: {} }
  byFile[row.file].count++
  byFile[row.file].rules[row.ruleId] = (byFile[row.file].rules[row.ruleId] || 0) + 1
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b30c-warning-inventory.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), total: inventory.length, byFile, inventory }, null, 2) + "\n",
)

console.log("total", inventory.length)
for (const [f, s] of Object.entries(byFile).sort()) {
  console.log(`\n${f} (${s.count})`)
  console.log(" ", JSON.stringify(s.rules))
}
