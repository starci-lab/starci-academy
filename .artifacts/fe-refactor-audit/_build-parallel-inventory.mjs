import fs from "node:fs"

const data = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-parallel-burn-eslint-raw.json", "utf8"),
)

const LOCKED_RE = [
  /\/BlockAnatomy\//i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/nivo\//i,
  /\/nivoexpert\//i,
  /\/Mia-Mia\//i,
  /\/resources\//,
]

const norm = (p) => p.replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test(p))

function partitionFor(fp) {
  const p = norm(fp)
  if (p.includes("/plugins/eslint/") || p.includes("/scripts/")) return "tooling-docs"
  if (isLocked(p)) return "HOLD-LOCKED"

  if (/\/(src\/components\/atoms\/|\.storybook\/components\/atoms\/)/.test(p)) return "atoms"
  if (/\/\.storybook\/stories\/atoms\//.test(p)) return "atoms"

  if (/\/(src\/components\/frames\/|\.storybook\/components\/frames\/)/.test(p)) return "frames"
  if (/\/\.storybook\/stories\/frames\//.test(p)) return "frames"

  if (/\/(src\/components\/composites\/|\.storybook\/components\/composites\/)/.test(p)) return "composites"
  if (/\/\.storybook\/stories\/composites\//.test(p)) return "composites"

  const pageName =
    p.match(/\/pages\/([^/]+)\//)?.[1] ||
    p.match(/\/starci\/pages\/([^/]+)\//)?.[1] ||
    ""
  if (pageName || /\/pages\//.test(p) || /\/starci\/pages\//.test(p)) {
    if (/MockInterview|QuizSession|LearnLoop/.test(pageName)) return "HOLD-LOCKED"
    const special =
      /^(Profile|EditProfile|Cv|Learn|Content|Practice|Dashboard|Flashcard|MockInterview|Quiz|Challenge|Membership|Cart|Job|Landing|Architecture|Leaderboard|PersonalProject|Playground|Foundation|Course|Module|MindMap|Contact|Community|Ai|Session|Headhunting|Kpi)/i
    if (special.test(pageName)) return "pages-special"
    return "pages-core"
  }

  if (
    /\/(src\/components\/blocks\/|\.storybook\/components\/starci\/blocks\/|\.storybook\/stories\/starci\/blocks\/)/.test(
      p,
    ) ||
    /\/\.storybook\/components\/[^/]+\/blocks\//.test(p)
  ) {
    if (
      /\/(form|layout|navigation|feedback|async|skeleton|rendering)\//i.test(p) ||
      /\/blocks\/(form|layout|navigation|feedback|cards|buttons|chips)\//i.test(p)
    ) {
      return "blocks-layout"
    }
    return "blocks-domain"
  }

  if (/\/src\/components\/(overlays|layouts)\//.test(p)) return "blocks-layout"
  if (/\/\.storybook\/components\/starci\/(overlays|layouts)\//.test(p)) return "blocks-layout"
  if (/\/\.storybook\/stories\/starci\/(overlays|layouts)\//.test(p)) return "blocks-layout"

  if (p.includes("/.storybook/")) return "storybook-only"
  if (p.includes("/src/")) return "pages-core"
  return "tooling-docs"
}

const SAFE_RULES = new Set([
  "starci-fe/require-export-jsdoc",
  "starci-fe/prefer-arrow-export",
  "starci-fe/handler-on-prefix",
  "starci-fe/no-inline-parameter-type",
  "starci-fe/no-emoji-in-source",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/export-matches-folder",
  "starci-fe/require-identity-root",
  "starci-fe/no-inline-skeleton-branch",
  "starci-fe/no-runtime-namespace",
])

const HOLD_RULES = new Set([
  "starci-fe/require-frame-self-declare",
  "starci-fe/page-folder-two-files-only",
  "starci-fe/no-helper-folder-in-components",
  "starci-fe/no-retired-async-content",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-parallel-skeleton",
  "starci-fe/no-skeleton-twin-component",
  "starci-fe/no-per-part-classname-prop",
  "starci-fe/no-identity-wrapper-div",
])

const partitions = {}
const byRule = {}
let total = 0
let a11y = 0
let lockedFileMsgs = 0

const relPath = (fp) => {
  const p = norm(fp)
  const idx = Math.max(p.indexOf("/src/"), p.indexOf("/.storybook/"), p.indexOf("/plugins/"))
  return idx >= 0 ? p.slice(idx + 1) : p
}

for (const f of data) {
  const fp = norm(f.filePath)
  for (const m of f.messages || []) {
    if (!m.ruleId) continue
    if (m.ruleId.startsWith("jsx-a11y/")) {
      a11y++
      continue
    }
    if (!m.ruleId.startsWith("starci-fe/")) continue
    total++
    byRule[m.ruleId] = (byRule[m.ruleId] || 0) + 1
    const part = partitionFor(fp)
    if (part === "HOLD-LOCKED") lockedFileMsgs++
    if (!partitions[part]) {
      partitions[part] = { files: new Map(), ruleCounts: {}, msgCount: 0, safeMsgCount: 0 }
    }
    const bucket = partitions[part]
    bucket.msgCount++
    bucket.ruleCounts[m.ruleId] = (bucket.ruleCounts[m.ruleId] || 0) + 1
    if (SAFE_RULES.has(m.ruleId)) bucket.safeMsgCount++
    if (!bucket.files.has(fp)) bucket.files.set(fp, [])
    bucket.files.get(fp).push({
      rule: m.ruleId,
      line: m.line,
      message: m.message,
      severity: m.severity,
    })
  }
}

const exportsStructure = { files: new Map(), ruleCounts: {}, msgCount: 0, safeMsgCount: 0 }
for (const [part, bucket] of Object.entries(partitions)) {
  if (part === "HOLD-LOCKED" || part === "tooling-docs") continue
  for (const [fp, msgs] of [...bucket.files.entries()]) {
    const other = msgs.filter(
      (m) =>
        m.rule !== "starci-fe/export-matches-folder" &&
        m.rule !== "starci-fe/no-helper-folder-in-components",
    )
    const hasStruct = msgs.some(
      (m) =>
        m.rule === "starci-fe/export-matches-folder" ||
        m.rule === "starci-fe/no-helper-folder-in-components",
    )
    if (!hasStruct || other.length > 0) continue
    bucket.files.delete(fp)
    bucket.msgCount -= msgs.length
    for (const m of msgs) {
      bucket.ruleCounts[m.rule] -= 1
      if (SAFE_RULES.has(m.rule)) bucket.safeMsgCount -= 1
    }
    exportsStructure.files.set(fp, msgs)
    exportsStructure.msgCount += msgs.length
    for (const m of msgs) {
      exportsStructure.ruleCounts[m.rule] = (exportsStructure.ruleCounts[m.rule] || 0) + 1
      if (SAFE_RULES.has(m.rule)) exportsStructure.safeMsgCount++
    }
  }
}
if (exportsStructure.files.size) partitions["exports-structure"] = exportsStructure

const inventory = {
  generatedAt: new Date().toISOString(),
  checkpoint: "04bf3f14",
  totals: {
    starciFeMessages: total,
    a11yUntouched: a11y,
    lockedPathMessages: lockedFileMsgs,
  },
  byRule,
  holdsRecorded: [
    "27 pattern-coverage teacher holds (audit:fe)",
    "Locked paths: BlockAnatomy, MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, nivo/nivoexpert, Mia-Mia, src/resources",
    "missing-both require-frame-self-declare — no invented tokens",
    "page-folder-two-files-only / most helper-folder — non-mechanical",
    "no-retired-async-content API mismatch",
    "ragsourcegraph-data-tier-div-2026-08-07",
    "HeroUI vendor namespaces remain allowed",
    "a11y out of scope",
  ],
  safeRuleAllowlist: [...SAFE_RULES],
  holdRuleHints: [...HOLD_RULES],
  partitions: {},
}

for (const [part, bucket] of Object.entries(partitions)) {
  const files = [...bucket.files.entries()]
    .map(([path, messages]) => ({
      path: relPath(path),
      absolutePath: path,
      messageCount: messages.length,
      safeCount: messages.filter((m) => SAFE_RULES.has(m.rule)).length,
      rules: [...new Set(messages.map((m) => m.rule))],
      messages: messages.slice(0, 40),
    }))
    .sort((a, b) => b.safeCount - a.safeCount || b.messageCount - a.messageCount)

  inventory.partitions[part] = {
    fileCount: files.length,
    messageCount: bucket.msgCount,
    safeMessageCount: bucket.safeMsgCount,
    ruleCounts: bucket.ruleCounts,
    files,
  }
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-parallel-burn-inventory.json",
  JSON.stringify(inventory, null, 2),
)

const lines = [
  "# Parallel FE architectural burn — inventory 2026-08-08",
  "",
  "Checkpoint: `04bf3f14`. Fresh ESLint JSON: `2026-08-08-parallel-burn-eslint-raw.json`.",
  "",
  "## Totals",
  "",
  "| Metric | Count |",
  "|---|---:|",
  `| starci-fe messages | ${total} |`,
  `| a11y (untouched) | ${a11y} |`,
  `| messages on locked/nivo paths | ${lockedFileMsgs} |`,
  "",
  "## By rule",
  "",
  "| Rule | Count |",
  "|---|---:|",
]
for (const [k, v] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
  lines.push(`| \`${k}\` | ${v} |`)
}
lines.push("", "## Holds (recorded before dispatch)", "")
for (const h of inventory.holdsRecorded) lines.push(`- ${h}`)
lines.push("", "## Partitions (disjoint file ownership)", "")
for (const [part, meta] of Object.entries(inventory.partitions).sort(
  (a, b) => b[1].safeMessageCount - a[1].safeMessageCount,
)) {
  lines.push(`### \`${part}\``)
  lines.push("")
  lines.push(
    `- files: **${meta.fileCount}** · messages: **${meta.messageCount}** · safe-candidate msgs: **${meta.safeMessageCount}**`,
  )
  lines.push(
    `- top rules: ${Object.entries(meta.ruleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([r, c]) => `\`${r.replace("starci-fe/", "")}(${c})\``)
      .join(", ")}`,
  )
  lines.push("")
}
fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-08-parallel-burn-inventory.md", lines.join("\n"))

console.log("wrote inventory")
for (const [part, meta] of Object.entries(inventory.partitions).sort(
  (a, b) => b[1].safeMessageCount - a[1].safeMessageCount,
)) {
  console.log(part, "files", meta.fileCount, "msgs", meta.messageCount, "safe", meta.safeMessageCount)
}
