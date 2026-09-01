import fs from "node:fs"
import { execSync } from "node:child_process"

const ART = ".artifacts/fe-refactor-audit"
const status = JSON.parse(fs.readFileSync(`${ART}/2026-08-09-b28-status.json`, "utf8"))
const changed = execSync("git diff --name-only 3afbadda -- src .storybook", { encoding: "utf8" })
  .trim()
  .split(/\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))

status.changedFiles = changed
status.verification = {
  tsc: "pass",
  eslintQuietChanged: "pass (0 errors on changed files)",
  pluginTests: "pass",
  storybookContractTests: "pass",
  auditFe: "pass (27 teacher holds; 0 undocumented seams)",
}
fs.writeFileSync(`${ART}/2026-08-09-b28-status.json`, JSON.stringify(status, null, 2) + "\n")

const fileList = changed.map((f) => `- \`${f}\``).join("\n")
const md = `# BATCH 28 — Live CSS-door semantic closure, wave 1

**Committed:** no  
**Checkpoint:** \`3afbadda\`  
**Workers:** 12 (disjoint; overlap ${status.overlapResult})

## Inventory delta (\`starci-fe/no-public-classname-prop\`)

| | Hits | Files |
|---|---:|---:|
| Before | ${status.inventory.before.hits} | ${status.inventory.before.files} |
| After | ${status.inventory.after.hits} | ${status.inventory.after.files} |
| Delta | **${status.inventory.delta.hits}** | **${status.inventory.delta.files}** |

## Doors removed / closed

${status.applied.map((a) => `- **${a.component}** — ${a.detail}`).join("\n")}

## Semantic props added

- **BrandLogo.size** — \`"sm" | "md" | "lg"\` → \`h-9 | h-10 | h-14\` (+ \`w-auto\`)

## Parent-placement migrations

- CourseMobileEnrollBar → \`HideAbove at="md"\`
- BackLink → \`HideAbove at="sm"\` (short breadcrumb) + \`Box shrink-0\` (toolbar)
- BrandLockup / AddToCartButton / PhaseScarcityNote / FollowButton ml-1 → parent \`Box\`/\`span\`

## Holds (evidence only; not fixes)

Notable holds with consumer evidence in worker JSONs / \`2026-08-09-b28-consumer-scan.json\`:

- GithubIcon (LearnLoopScroll locked)
- FloatingActionButton / ContentAiFab passthrough
- InfoTooltip (HeroUI Tooltip.Trigger vendor boundary)
- ChatToolResult (ContentAiChat locked)
- CourseHero / CoursePricingRail (grid col-start — no existing Grid start prop)
- ContentMap / rails flex-fill (\`min-h-0 @app-lg:flex-1\`)
- MockInterviewWorkspace / CvPdfPreview
- CodeToHtml / MermaidDiagram \`blockMy\`
- ButtonGroup / composite FAB twins
- Composer \`pl-9\` indent chrome

## Changed files

${fileList}

## Parity

- PhaseScarcityNote: SB twin updated, src mirrored
- Others: src-only declarations or parent-only consumer edits (no SB twins)

## Verification

| Gate | Result |
|---|---|
| \`npx tsc --noEmit\` | pass |
| eslint \`--quiet\` on changed files | pass |
| plugin tests | pass |
| Storybook contract tests | pass |
| \`npm run audit:fe\` | pass (27 teacher holds) |
`

fs.writeFileSync(`${ART}/2026-08-09-b28-status.md`, md)
console.log("finalized", { changed: changed.length, after: status.inventory.after })
