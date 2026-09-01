/**
 * BATCH 32c Phase 2 — identical ESLint inventory at checkpoint vs worktree.
 * Uses a temporary git worktree for before; does not mutate branch history.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync, spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const CHECKPOINT = "9e86cbdf"
const WORKTREE = path.join(ROOT, ".artifacts", "_b32c-worktree-9e86cbdf")
const TARGETS = ["src", ".storybook"]

const LOCKED_RE = [
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/resources\//,
  /\/(?:nivo|nivoexpert)\//i,
  /\/mia-mia\//i,
]

const norm = (p) => String(p || "").replace(/\\/g, "/")
const rel = (abs, root) => {
  const n = norm(abs)
  const r = norm(root).replace(/\/$/, "")
  if (n.startsWith(r + "/")) return n.slice(r.length + 1)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"))
  if (i >= 0) return n.slice(i + 1)
  return n
}

const pathFamily = (file) => {
  const f = norm(file)
  if (f.startsWith("src/components/atoms/")) return "src-atoms"
  if (f.startsWith("src/components/frames/")) return "src-frames"
  if (f.startsWith("src/components/composites/")) return "src-composites"
  if (f.startsWith("src/components/blocks/")) return "src-blocks"
  if (f.startsWith("src/components/pages/")) return "src-pages"
  if (f.startsWith("src/components/layouts/")) return "src-layouts"
  if (f.startsWith("src/components/overlays/")) return "src-overlays"
  if (f.startsWith("src/app/")) return "src-app"
  if (f.startsWith("src/modules/")) return "src-modules"
  if (f.startsWith("src/hooks/")) return "src-hooks"
  if (f.startsWith(".storybook/components/atoms/")) return "sb-atoms"
  if (f.startsWith(".storybook/components/frames/")) return "sb-frames"
  if (f.startsWith(".storybook/components/composites/")) return "sb-composites"
  if (f.startsWith(".storybook/components/starci/")) return "sb-starci"
  if (f.startsWith(".storybook/components/nivo/")) return "sb-nivo"
  if (f.startsWith(".storybook/components/nivoexpert/")) return "sb-nivoexpert"
  if (f.startsWith(".storybook/components/mia-mia/")) return "sb-mia-mia"
  if (f.startsWith(".storybook/")) return "sb-other"
  if (f.startsWith("plugins/")) return "plugins"
  return "other"
}

const classifyHold = (file, rule) => {
  if (!rule) return "unknown"
  if (rule.startsWith("jsx-a11y/")) return "a11y-observed"
  if (LOCKED_RE.some((re) => re.test(file))) return "locked"
  if (/\/atoms\/.*\/(?:Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup)\b/.test(file)) {
    if (rule === "starci-fe/no-public-classname-prop") return "vendor"
  }
  return "actionable"
}

function runEslint(cwd) {
  const proc = spawnSync(
    "npx",
    ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", ...TARGETS],
    {
      cwd,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      shell: true,
    },
  )
  const out = proc.stdout || ""
  const start = out.indexOf("[")
  if (start < 0) {
    fs.writeFileSync(path.join(ART, `_b32c-eslint-fail-${path.basename(cwd)}.txt`), out + "\n" + (proc.stderr || ""))
    throw new Error(`ESLint JSON parse failed in ${cwd}`)
  }
  return JSON.parse(out.slice(start))
}

function summarize(results, root) {
  const messages = []
  for (const file of results) {
    const fileRel = rel(file.filePath, root)
    for (const msg of file.messages || []) {
      messages.push({
        file: fileRel,
        rule: msg.ruleId || "unknown",
        severity: msg.severity,
        line: msg.line,
        column: msg.column,
        endLine: msg.endLine ?? msg.line,
        endColumn: msg.endColumn ?? msg.column,
        message: msg.message,
        family: pathFamily(fileRel),
        holdClass: classifyHold(fileRel, msg.ruleId),
      })
    }
  }
  const byRule = {}
  const byFamily = {}
  const byHold = {}
  const byFile = {}
  for (const m of messages) {
    byRule[m.rule] = (byRule[m.rule] || 0) + 1
    byFamily[m.family] = (byFamily[m.family] || 0) + 1
    byHold[m.holdClass] = (byHold[m.holdClass] || 0) + 1
    byFile[m.file] = (byFile[m.file] || 0) + 1
  }
  return {
    command: `npx eslint --format json --no-error-on-unmatched-pattern ${TARGETS.join(" ")}`,
    rawMessages: messages.length,
    affectedFiles: Object.keys(byFile).length,
    errors: messages.filter((m) => m.severity === 2).length,
    warnings: messages.filter((m) => m.severity === 1).length,
    starciMessages: messages.filter((m) => String(m.rule).startsWith("starci-fe/")).length,
    a11yMessages: messages.filter((m) => String(m.rule).startsWith("jsx-a11y/")).length,
    byRule,
    byFamily,
    byHoldClass: byHold,
    messages,
  }
}

// Ensure worktree
if (fs.existsSync(WORKTREE)) {
  try {
    execSync(`git worktree remove --force "${WORKTREE}"`, { cwd: ROOT, stdio: "ignore" })
  } catch {
    fs.rmSync(WORKTREE, { recursive: true, force: true })
  }
}
execSync(`git worktree add --detach "${WORKTREE}" ${CHECKPOINT}`, { cwd: ROOT, stdio: "inherit" })

console.log("ESLint BEFORE (checkpoint worktree)...")
const beforeRaw = runEslint(WORKTREE)
const before = summarize(beforeRaw, WORKTREE)
before.checkpoint = CHECKPOINT
before.root = WORKTREE
fs.writeFileSync(path.join(ART, "2026-08-10-b32c-eslint-before.json"), JSON.stringify(before))

console.log("ESLint AFTER (active worktree)...")
const afterRaw = runEslint(ROOT)
const after = summarize(afterRaw, ROOT)
after.checkpoint = "WORKTREE"
after.root = ROOT
after.head = execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim()
fs.writeFileSync(path.join(ART, "2026-08-10-b32c-eslint-after.json"), JSON.stringify(after))

// Delta
const rules = new Set([...Object.keys(before.byRule), ...Object.keys(after.byRule)])
const ruleDelta = [...rules]
  .map((r) => ({
    rule: r,
    before: before.byRule[r] || 0,
    after: after.byRule[r] || 0,
    delta: (after.byRule[r] || 0) - (before.byRule[r] || 0),
  }))
  .sort((a, b) => a.delta - b.delta)

const families = new Set([...Object.keys(before.byFamily), ...Object.keys(after.byFamily)])
const familyDelta = [...families]
  .map((f) => ({
    family: f,
    before: before.byFamily[f] || 0,
    after: after.byFamily[f] || 0,
    delta: (after.byFamily[f] || 0) - (before.byFamily[f] || 0),
  }))
  .sort((a, b) => a.delta - b.delta)

const md = [
  "# B32c ESLint delta (normalized)",
  "",
  `Command: \`${before.command}\``,
  `Before: checkpoint \`${CHECKPOINT}\` via worktree \`${WORKTREE}\``,
  `After: active worktree HEAD \`${after.head}\``,
  "",
  "## Totals",
  "",
  "| Metric | Before | After | Delta |",
  "|---|---:|---:|---:|",
  `| Raw messages | ${before.rawMessages} | ${after.rawMessages} | ${after.rawMessages - before.rawMessages} |`,
  `| Affected files | ${before.affectedFiles} | ${after.affectedFiles} | ${after.affectedFiles - before.affectedFiles} |`,
  `| Errors | ${before.errors} | ${after.errors} | ${after.errors - before.errors} |`,
  `| Warnings | ${before.warnings} | ${after.warnings} | ${after.warnings - before.warnings} |`,
  `| StarCi | ${before.starciMessages} | ${after.starciMessages} | ${after.starciMessages - before.starciMessages} |`,
  `| A11y (observed) | ${before.a11yMessages} | ${after.a11yMessages} | ${after.a11yMessages - before.a11yMessages} |`,
  "",
  "## Hold classes",
  "",
  "| Class | Before | After | Delta |",
  "|---|---:|---:|---:|",
  ...[...new Set([...Object.keys(before.byHoldClass), ...Object.keys(after.byHoldClass)])].map((k) => {
    const b = before.byHoldClass[k] || 0
    const a = after.byHoldClass[k] || 0
    return `| ${k} | ${b} | ${a} | ${a - b} |`
  }),
  "",
  "## Rule delta (sorted by improvement)",
  "",
  ...ruleDelta.filter((r) => r.delta !== 0).map((r) => `- \`${r.rule}\`: ${r.before} → ${r.after} (${r.delta >= 0 ? "+" : ""}${r.delta})`),
  "",
  "## Path family delta",
  "",
  ...familyDelta.filter((f) => f.delta !== 0).map((f) => `- \`${f.family}\`: ${f.before} → ${f.after} (${f.delta >= 0 ? "+" : ""}${f.delta})`),
  "",
  "## Freeze-audit reconciliation",
  "",
  "Freeze audit claimed 7,347 / 1,358. B32 inventory claimed 7,428 / 1,434.",
  `Normalized checkpoint remeasure: **${before.rawMessages} / ${before.affectedFiles}**.`,
  "Use this normalized pair for all B32c claims; discard prior mismatched baselines.",
  "",
]

fs.writeFileSync(path.join(ART, "2026-08-10-b32c-eslint-delta.md"), md.join("\n"))

console.log(
  JSON.stringify(
    {
      before: { raw: before.rawMessages, files: before.affectedFiles, errors: before.errors },
      after: { raw: after.rawMessages, files: after.affectedFiles, errors: after.errors },
      delta: after.rawMessages - before.rawMessages,
    },
    null,
    2,
  ),
)
