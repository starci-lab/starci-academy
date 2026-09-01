/**
 * BATCH 32 Phase 0 — fresh product ESLint inventory + AST-deduped clusters +
 * 10 disjoint manifests. Telemetry only until manifests are frozen.
 */
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const RAW = path.join(ART, "_b32-eslint-raw.json")
const OUT_INV = path.join(ART, "2026-08-10-b32-inventory.json")
const OUT_CLUSTERS = path.join(ART, "2026-08-10-b32-clusters.md")
const OUT_MANIFESTS = path.join(ART, "2026-08-10-b32-manifests.json")

const norm = (p) => String(p || "").replace(/\\/g, "/")
const rel = (abs) => {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"))
  if (i >= 0) return n.slice(i + 1)
  return n.replace(/^.*starci-academy\//, "")
}

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

const A11Y_RE = /^jsx-a11y\//
const STARCI_RE = /^starci-fe\//

const isLocked = (file) => LOCKED_RE.some((re) => re.test(file))

/** Tier from path. */
const tierOf = (file) => {
  const f = norm(file)
  const m =
    f.match(/\/(?:src|\.storybook)\/components\/(?:[^/]+\/)?(atoms|frames|composites|blocks|pages|layouts|overlays)\//) ||
    f.match(/\/src\/(app|modules|resources|hooks)\//)
  return m ? m[1] : "other"
}

/** Agent partition for a product file. */
const agentOf = (file) => {
  const f = norm(file)
  if (f.includes("/plugins/eslint") || f.endsWith("eslint.config.mjs") || f.includes("/.storybook/test-runner/")) {
    return "agent-10-eslint-oracle"
  }
  if (f.includes("/components/atoms/")) return "agent-1-atoms"
  if (f.includes("/components/frames/")) return "agent-2-frames"
  if (f.includes("/components/composites/")) return "agent-3-composites"
  if (
    f.includes("/components/layouts/") ||
    f.includes("/components/overlays/") ||
    /\/components\/(?:starci\/)?blocks\/navigation\/(?:Navbar|Footer)\b/.test(f) ||
    /\/layouts\/InnerLayout\b/.test(f)
  ) {
    return "agent-4-shells"
  }
  if (
    f.includes("/blocks/shared/") ||
    f.includes("/blocks/layout/") ||
    f.includes("/blocks/skeleton/") ||
    f.includes("/blocks/feedback/") ||
    f.includes("/blocks/form/") ||
    f.includes("/blocks/chips/") ||
    f.includes("/blocks/stats/") ||
    f.includes("/blocks/lists/") ||
    f.includes("/blocks/cards/") ||
    f.includes("/blocks/buttons/") ||
    f.includes("/blocks/identity/") ||
    f.includes("/blocks/media/") ||
    f.includes("/blocks/rendering/") ||
    f.includes("/blocks/navigation/") // remaining nav (not Navbar/Footer — those are agent-4)
  ) {
    // Navbar/Footer already claimed above
    if (/\/blocks\/navigation\/(?:Navbar|Footer)\b/.test(f)) return "agent-4-shells"
    return "agent-5-shared-blocks"
  }
  // Domain A: course/learn/catalog/content/commerce
  if (
    /\/blocks\/(?:learn|course|catalog|content|commerce|cart|payment|ai|consultant)\//.test(f) ||
    /\/starci\/blocks\/(?:learn|course|catalog|content|commerce|cart|payment|ai|consultant)\//.test(f)
  ) {
    return "agent-6-domain-a"
  }
  // Domain B: community/league/challenge/flashcard/dashboard/profile
  if (
    /\/blocks\/(?:community|league|challenge|flashcard|dashboard|profile|feed|grading|jobs|blog)\//.test(f) ||
    /\/starci\/blocks\/(?:community|league|challenge|flashcard|dashboard|profile|feed|grading|jobs|blog)\//.test(f)
  ) {
    return "agent-7-domain-b"
  }
  // Remaining blocks → shared
  if (f.includes("/components/blocks/") || f.includes("/starci/blocks/")) return "agent-5-shared-blocks"
  if (f.includes("/components/pages/") || f.includes("/starci/pages/") || f.includes("/nivo/pages/")) {
    return "agent-8-pages"
  }
  if (f.includes("/src/app/") || f.includes("/src/modules/") || f.includes("/src/resources/") || f.includes("/src/hooks/")) {
    return "agent-9-app-modules"
  }
  return "agent-5-shared-blocks"
}

const ARCH_RULES = new Set([
  "starci-fe/no-host-element-at-sentence-tier",
  "starci-fe/no-public-classname-prop",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/require-frame-self-declare",
  "starci-fe/require-identity-root",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/page-folder-two-files-only",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-frame-fragment-item",
  "starci-fe/no-parallel-skeleton",
  "starci-fe/no-helper-folder-in-components",
  "starci-fe/no-inline-skeleton-branch",
  "starci-fe/no-skeleton-twin-component",
  "starci-fe/no-retired-async-content",
  "starci-fe/no-per-part-classname-prop",
  "starci-fe/no-css-door-type-laundering",
  "starci-fe/no-identity-wrapper-div",
  "starci-fe/no-runtime-namespace",
  "starci-fe/no-hardcoded-user-text-in-vocabulary",
  "starci-fe/presentational-purity",
  "starci-fe/no-public-frame-css-props",
  "starci-fe/explain-justifies-token-choice",
  "starci-fe/no-contentpage-box-classname",
])

const AUTHORING_RULES = new Set([
  "starci-fe/no-inline-parameter-type",
  "starci-fe/no-emoji-in-source",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/prefer-arrow-export",
  "starci-fe/require-export-jsdoc",
  "starci-fe/handler-on-prefix",
  "starci-fe/export-matches-folder",
  "starci-fe/no-arbitrary-token",
  "starci-fe/no-hero-heading-class",
  "starci-fe/no-anatomy-overlay",
  "starci-fe/no-fractional-spacing",
  "starci-fe/no-adjacent-chip",
  "starci-fe/no-modal-title-classname",
])

console.log("Running full-product ESLint JSON (this takes several minutes)...")
const targets = ["src", ".storybook"]
const proc = spawnSync(
  "npx",
  ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", ...targets],
  {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    shell: true,
  },
)

let results
try {
  // ESLint may print warnings to stderr; stdout should be JSON (or JSON with leading noise)
  const out = proc.stdout || ""
  const start = out.indexOf("[")
  results = JSON.parse(start >= 0 ? out.slice(start) : out)
} catch (err) {
  fs.writeFileSync(path.join(ART, "_b32-eslint-stdout.txt"), proc.stdout || "")
  fs.writeFileSync(path.join(ART, "_b32-eslint-stderr.txt"), proc.stderr || "")
  throw new Error(`Failed to parse ESLint JSON: ${err.message}`)
}

fs.writeFileSync(RAW, JSON.stringify(results))

const messages = []
for (const file of results) {
  const fileRel = rel(file.filePath)
  for (const msg of file.messages || []) {
    messages.push({
      file: fileRel,
      abs: norm(file.filePath),
      rule: msg.ruleId || "unknown",
      severity: msg.severity,
      line: msg.line,
      column: msg.column,
      endLine: msg.endLine ?? msg.line,
      endColumn: msg.endColumn ?? msg.column,
      message: msg.message,
    })
  }
}

const byRule = {}
const byFile = {}
for (const m of messages) {
  byRule[m.rule] = (byRule[m.rule] || 0) + 1
  byFile[m.file] = (byFile[m.file] || 0) + 1
}

/** Cluster key: file + line + column (AST root proxy) — collapses multi-rule hits on same node. */
const clusterMap = new Map()
for (const m of messages) {
  if (A11Y_RE.test(m.rule)) continue
  if (!STARCI_RE.test(m.rule) && m.rule !== "unknown") {
    // keep non-starci non-a11y as authoring/other telemetry
  }
  const key = `${m.file}::${m.line}:${m.column}`
  let c = clusterMap.get(key)
  if (!c) {
    c = {
      id: `c-${clusterMap.size + 1}`,
      file: m.file,
      line: m.line,
      column: m.column,
      rules: new Set(),
      messages: [],
      tier: tierOf(m.file),
      agent: agentOf(m.file),
      locked: isLocked(m.file),
    }
    clusterMap.set(key, c)
  }
  c.rules.add(m.rule)
  c.messages.push(m)
}

const clusters = [...clusterMap.values()].map((c) => {
  const rules = [...c.rules]
  const hasArch = rules.some((r) => ARCH_RULES.has(r))
  const hasAuth = rules.some((r) => AUTHORING_RULES.has(r))
  let classification = "actionable"
  if (c.locked) classification = "locked"
  else if (!hasArch && hasAuth) classification = "actionable-authoring"
  else if (!hasArch && !hasAuth) classification = "observed-other"
  // vendor/hold heuristics
  if (/\/atoms\/.*\/(?:Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup)\b/.test(c.file)) {
    if (rules.includes("starci-fe/no-public-classname-prop")) classification = "vendor"
  }
  return {
    id: c.id,
    file: c.file,
    line: c.line,
    column: c.column,
    rules,
    ruleCount: rules.length,
    rawMessages: c.messages.length,
    tier: c.tier,
    agent: c.agent,
    locked: c.locked,
    classification,
    semanticOwner: c.file,
    rootFile: c.file,
  }
})

const actionable = clusters.filter((c) => c.classification === "actionable" || c.classification === "actionable-authoring")

/** Build disjoint manifests: actionable clusters only, capped for worker capacity. */
const manifests = {
  "agent-1-atoms": [],
  "agent-2-frames": [],
  "agent-3-composites": [],
  "agent-4-shells": [],
  "agent-5-shared-blocks": [],
  "agent-6-domain-a": [],
  "agent-7-domain-b": [],
  "agent-8-pages": [],
  "agent-9-app-modules": [],
  "agent-10-eslint-oracle": [],
}

const fileOwners = new Map()
const CAP = {
  "agent-1-atoms": 40,
  "agent-2-frames": 40,
  "agent-3-composites": 45,
  "agent-4-shells": 35,
  "agent-5-shared-blocks": 45,
  "agent-6-domain-a": 45,
  "agent-7-domain-b": 45,
  "agent-8-pages": 40,
  "agent-9-app-modules": 50,
  "agent-10-eslint-oracle": 30,
}

/** Prefer files with fewer raw messages (closable under ratchet) and arch clusters. */
const fileScore = new Map()
for (const c of actionable) {
  if (c.locked) continue
  const prev = fileScore.get(c.file) || { file: c.file, agent: c.agent, clusters: 0, raw: 0, arch: 0 }
  prev.clusters += 1
  prev.raw += c.rawMessages
  if (c.rules.some((r) => ARCH_RULES.has(r))) prev.arch += 1
  fileScore.set(c.file, prev)
}

const ranked = [...fileScore.values()].sort((a, b) => {
  // Prefer high arch density with lower raw debt (closable)
  const sa = a.arch / Math.max(1, a.raw) - a.raw / 1000
  const sb = b.arch / Math.max(1, b.raw) - b.raw / 1000
  return sb - sa
})

for (const entry of ranked) {
  const agent = entry.agent
  if (!manifests[agent]) continue
  if (manifests[agent].length >= CAP[agent]) continue
  if (fileOwners.has(entry.file)) continue
  // Skip extremely dirty files for workers 1-8 (leave for later) unless shells
  if (entry.raw > 25 && !["agent-4-shells", "agent-9-app-modules", "agent-10-eslint-oracle"].includes(agent)) {
    continue
  }
  fileOwners.set(entry.file, agent)
  manifests[agent].push(entry.file)
}

// Agent 10 always owns plugin/test files explicitly
const oracleExtras = [
  "plugins/eslint/index.mjs",
  "plugins/eslint/css-door-laundering.mjs",
  "plugins/eslint/css-door-laundering.test.mjs",
  "eslint.config.mjs",
]
for (const f of oracleExtras) {
  if (!fileOwners.has(f) && fs.existsSync(path.join(ROOT, f))) {
    fileOwners.set(f, "agent-10-eslint-oracle")
    if (!manifests["agent-10-eslint-oracle"].includes(f)) {
      manifests["agent-10-eslint-oracle"].push(f)
    }
  }
}

// Prove disjoint
const overlap = []
const seen = new Map()
for (const [agent, files] of Object.entries(manifests)) {
  for (const f of files) {
    if (seen.has(f)) overlap.push({ file: f, agents: [seen.get(f), agent] })
    else seen.set(f, agent)
  }
}

const classCounts = {}
for (const c of clusters) {
  classCounts[c.classification] = (classCounts[c.classification] || 0) + 1
}

const inventory = {
  batch: "B32",
  title: "Topology-driven ESLint closure",
  checkpoint: "9e86cbdf",
  generatedAt: new Date().toISOString(),
  telemetry: {
    rawMessages: messages.length,
    affectedFiles: Object.keys(byFile).length,
    errors: messages.filter((m) => m.severity === 2).length,
    warnings: messages.filter((m) => m.severity === 1).length,
    byRule,
    starciMessages: messages.filter((m) => STARCI_RE.test(m.rule)).length,
    a11yMessages: messages.filter((m) => A11Y_RE.test(m.rule)).length,
  },
  clusters: {
    total: clusters.length,
    actionable: actionable.length,
    byClassification: classCounts,
    byAgent: Object.fromEntries(
      Object.keys(manifests).map((a) => [a, clusters.filter((c) => c.agent === a).length]),
    ),
  },
  manifests: Object.fromEntries(
    Object.entries(manifests).map(([k, files]) => [
      k,
      { fileCount: files.length, files },
    ]),
  ),
  overlap,
  overlapOk: overlap.length === 0,
  notes: [
    "Raw message totals are telemetry; migration unit is AST-deduped cluster.",
    "Manifests prioritize lower-debt files for zero/new-warning ratchet.",
    "Locked/Nivo/mia-mia paths classified locked and excluded from manifests.",
    "A11y excluded from clusters (observed-non-actionable).",
  ],
}

fs.writeFileSync(OUT_INV, JSON.stringify(inventory, null, 2))
fs.writeFileSync(
  path.join(ART, "2026-08-10-b32-clusters.json"),
  JSON.stringify(clusters.slice(0, 5000), null, 2),
)

const md = [
  "# B32 cluster inventory",
  "",
  `Checkpoint: \`9e86cbdf\``,
  `Generated: ${inventory.generatedAt}`,
  "",
  "## Telemetry",
  "",
  `| Metric | Count |`,
  `|---|---:|`,
  `| Raw messages | ${inventory.telemetry.rawMessages} |`,
  `| Affected files | ${inventory.telemetry.affectedFiles} |`,
  `| Errors | ${inventory.telemetry.errors} |`,
  `| StarCi messages | ${inventory.telemetry.starciMessages} |`,
  `| A11y messages (observed) | ${inventory.telemetry.a11yMessages} |`,
  `| Deduped clusters | ${inventory.clusters.total} |`,
  `| Actionable clusters | ${inventory.clusters.actionable} |`,
  "",
  "## Top rules (raw)",
  "",
  ...Object.entries(byRule)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([r, n]) => `- \`${r}\`: ${n}`),
  "",
  "## Manifests (disjoint)",
  "",
  ...Object.entries(manifests).map(
    ([k, files]) => `### ${k} (${files.length} files)\n\n${files.map((f) => `- \`${f}\``).join("\n") || "_empty_"}\n`,
  ),
  "",
  `Overlap check: **${overlap.length === 0 ? "PASS" : "FAIL " + JSON.stringify(overlap)}**`,
  "",
]

fs.writeFileSync(OUT_CLUSTERS, md.join("\n"))
fs.writeFileSync(
  OUT_MANIFESTS,
  JSON.stringify(
    {
      batch: "B32",
      frozen: true,
      frozenAt: inventory.generatedAt,
      checkpoint: "9e86cbdf",
      overlapOk: overlap.length === 0,
      agents: manifests,
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      raw: inventory.telemetry.rawMessages,
      files: inventory.telemetry.affectedFiles,
      clusters: inventory.clusters.total,
      actionable: inventory.clusters.actionable,
      manifestSizes: Object.fromEntries(Object.entries(manifests).map(([k, v]) => [k, v.length])),
      overlapOk: overlap.length === 0,
    },
    null,
    2,
  ),
)
