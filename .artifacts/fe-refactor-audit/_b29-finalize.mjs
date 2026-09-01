import fs from "node:fs"
import { execSync } from "node:child_process"

const ART = ".artifacts/fe-refactor-audit"
const status = JSON.parse(fs.readFileSync(`${ART}/2026-08-09-b29-status.json`, "utf8"))
const changed = execSync("git diff --name-only e6066358 -- src .storybook", { encoding: "utf8" })
  .trim()
  .split(/\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))

status.changedFiles = changed
status.verification = {
  tsc: "pass",
  eslintQuietChanged: "pass",
  pluginTests: "pass",
  storybookContractTests: "pass",
  auditFe: "pass (29 teacher holds; 0 undocumented seams; ATOM-5 ModalBody fixed)",
}
fs.writeFileSync(`${ART}/2026-08-09-b29-status.json`, JSON.stringify(status, null, 2) + "\n")

const fileList = changed.map((f) => `- \`${f}\``).join("\n")
const md = `# BATCH 29 — Fill, media, and markdown contract closure

**Committed:** no  
**Checkpoint:** \`e6066358\`  
**Workers:** 8 (overlap ${status.overlapResult})

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${status.inventory.before.hits} | ${status.inventory.before.files} |
| After | ${status.inventory.after.hits} | ${status.inventory.after.files} |
| Delta | **${status.inventory.delta.hits}** | **${status.inventory.delta.files}** |

## Primary contracts

### 1. FillAvailable + \`flex-fill\`
- New frame (SB → src) with \`at="lg"\` → private \`min-h-0 @app-lg:flex-1\` (proven consumer string)
- Migrated: ContentMap, LeaderboardCategoryRail, MilestoneOutline, ArchitectureRail, PracticeRail
- Removed those five public className doors
- \`at="base"\` not added

### 2. VideoRenderer
- Deleted VideoRenderer / MpegDash / Standard / Youtube public CSS doors (zero consumers)
- Intrinsic aspect/chrome baked

### 3. Markdown block spacing
- \`blockMy\` owned by map wrapper \`<div>\` (src blocks aligned to composites)
- Removed CodeToHtml / MermaidDiagram className/classNames doors (SB + src)
- Mermaid zoom \`ModalBody\` padding moved to \`Box principle="page-pad"\` (ATOM-5)

## Secondary candidates
**Applied:** none  
**Held:** SectionCard, TierCardBase, LeaderboardListCard, LabeledList, ListRow, SidebarNavItem, TabsCard, ButtonGroup

## Changed files

${fileList}

## Verification

| Gate | Result |
|---|---|
| \`npx tsc --noEmit\` | pass |
| eslint \`--quiet\` on changed files | pass |
| plugin tests | pass |
| principle/semantic tests | pass |
| \`npm run audit:fe\` | pass (29 teacher holds) |
`

fs.writeFileSync(`${ART}/2026-08-09-b29-status.md`, md)
console.log({ after: status.inventory.after, files: changed.length })
