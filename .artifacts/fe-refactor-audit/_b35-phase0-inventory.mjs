/**
 * B35 Phase 0 — inventory + ranked overlap clusters + 10 disjoint agent manifests.
 * Telemetry / planning only. Does not edit product code.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const CHECKPOINT = "02011807"
const ESLINT_CANDIDATES = [
  "2026-08-10-b35-eslint-before.json",
  "2026-08-10-b34c-eslint-after.json",
  "2026-08-10-b34-eslint-after.json",
]
const BASELINE_CLAIM = { warnings: 6872, files: 1232, errors: 0, a11y: 11 }

const OUT_INV = path.join(ART, "2026-08-10-b35-inventory.json")
const OUT_CLUSTERS = path.join(ART, "2026-08-10-b35-ranked-clusters.md")
const OUT_MANIFESTS = path.join(ART, "2026-08-10-b35-manifests.json")
const OUT_BRIEF = path.join(ART, "2026-08-10-b35-worker-brief.md")

const norm = (p) => String(p || "").replace(/\\/g, "/")
const rel = (abs) => {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"))
  if (i >= 0) return n.slice(i + 1)
  return n.replace(/^.*starci-academy\//i, "")
}

const FORBIDDEN_PATH_RE = [
  /\/(?:nivo|nivoexpert)\//i,
  /\/mia-mia\//i,
  /(^|\/)CLAUDE\.md$/i,
  /\.claude\/fe\/decision-ledger\.json$/i,
  /\.storybook\/stories\/mia-mia\/blocks\/marketing\/SiteFooter\/SiteFooter\.stories\.tsx$/i,
  /src\/components\/blocks\/learn\/ReactionButton\/types\.ts$/i,
]

const LOCKED_HOLD_RE = [
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/BlockAnatomy\b/i,
]

const A11Y_RE = /^jsx-a11y\//
const STARCI_RE = /^starci-fe\//

/** Overlap scoring categories (distinct category hits → score). */
const OVERLAP_CATEGORIES = [
  {
    key: "host",
    rules: ["starci-fe/no-host-element-at-sentence-tier"],
  },
  {
    key: "raw-shape",
    rules: ["starci-fe/no-raw-shape-at-sentence-tier"],
  },
  {
    key: "classname-family",
    rules: [
      "starci-fe/no-classname-at-sentence-tier",
      "starci-fe/no-cn-above-vocabulary",
      "starci-fe/no-public-classname-prop",
    ],
  },
  {
    key: "identity-root",
    rules: ["starci-fe/require-identity-root"],
  },
  {
    key: "frame-self-declare",
    rules: ["starci-fe/require-frame-self-declare"],
  },
  {
    key: "heroui",
    rules: ["starci-fe/no-heroui-outside-vocabulary"],
  },
  {
    key: "frame-fragment",
    rules: ["starci-fe/no-frame-fragment-item"],
  },
  {
    key: "page-two-files",
    rules: ["starci-fe/page-folder-two-files-only"],
  },
]

const SCORE_RULES = new Set(OVERLAP_CATEGORIES.flatMap((c) => c.rules))

const AGENT_KEYS = [
  "navigation-shells-layouts",
  "overlays-modals-drawers",
  "learn-course-content",
  "playground-practice-interview",
  "commerce-account-settings",
  "community-feed-blog-league",
  "profile-cv-careers-consultant",
  "dashboard-admin-system-architecture",
  "pages-and-filing",
  "shared-consumer-chains-coordinator",
]

const AGENT_FOCUS = {
  "navigation-shells-layouts":
    "Navigation blocks, Navbar/Footer/sidebar, layouts, route shells (StarCi + src)",
  "overlays-modals-drawers":
    "Overlays, modals, drawers, auth overlays (StarCi)",
  "learn-course-content":
    "Learn/course/content blocks excluding playground/practice/interview/quiz/challenge/submission",
  "playground-practice-interview":
    "Playground, practice, interview, quiz, challenge, submission (locked MockInterview/Quiz listed as holds)",
  "commerce-account-settings":
    "Commerce, cart, payment, account, settings",
  "community-feed-blog-league":
    "Community, feed, discussion, blog, league",
  "profile-cv-careers-consultant":
    "Profile, CV, careers, consultant, grading",
  "dashboard-admin-system-architecture":
    "Dashboard, admin, system/status, architecture, AI panels",
  "pages-and-filing":
    "ALL src/components/pages/** and .storybook/**/pages/** (and page stories)",
  "shared-consumer-chains-coordinator":
    "Leftover StarCi blocks + shared atoms/frames/composites with findings; owns gates later",
}

const isForbidden = (file) => FORBIDDEN_PATH_RE.some((re) => re.test(file))
const isLockedHold = (file) => LOCKED_HOLD_RE.some((re) => re.test(file))

const isPagePath = (file) => {
  const f = norm(file)
  return (
    /\/components\/(?:starci\/)?pages\//.test(f) ||
    /\/stories\/(?:starci\/)?pages\//.test(f) ||
    /\/\.storybook\/stories\/starci\/pages\//.test(f)
  )
}

/** Editable StarCi product candidate (manifest-eligible path families). */
const isEditableCandidate = (file) => {
  const f = norm(file)
  if (isForbidden(f)) return false
  if (f.startsWith(".storybook/components/starci/")) return true
  if (f.startsWith(".storybook/stories/starci/")) return true
  if (f.startsWith("src/components/")) {
    // exclude vendor trees under src if any
    if (/\/(?:nivo|nivoexpert|mia-mia)\//i.test(f)) return false
    return true
  }
  // Shared vocabulary only for agent 10 when they have findings
  if (
    f.startsWith(".storybook/components/atoms/") ||
    f.startsWith(".storybook/components/frames/") ||
    f.startsWith(".storybook/components/composites/") ||
    f.startsWith(".storybook/stories/atoms/") ||
    f.startsWith(".storybook/stories/frames/") ||
    f.startsWith(".storybook/stories/composites/")
  ) {
    return true
  }
  return false
}

const isSharedVocabulary = (file) => {
  const f = norm(file)
  return (
    /\/components\/(?:atoms|frames|composites)\//.test(f) ||
    /\/stories\/(?:atoms|frames|composites)\//.test(f)
  )
}

const LEARN_EXCLUDED = /(?:playground|practice|interview|quiz|challenge|submission)/i
const LEARN_INCLUDED =
  /\/(?:blocks\/)?(?:learn|course|content|catalog|flashcard|foundation|module|lesson|mind-?map|leaderboard|personal-project|qa|enroll)\b/i

/**
 * Disjoint domain assignment. Pages always → agent 9.
 * Shared vocab → agent 10.
 * Domain blocks/layouts/overlays by path keywords.
 */
const agentOf = (file) => {
  const f = norm(file)

  if (isPagePath(f)) return "pages-and-filing"
  if (isSharedVocabulary(f)) return "shared-consumer-chains-coordinator"

  // Layouts / navigation shells
  if (
    /\/components\/(?:starci\/)?layouts\//.test(f) ||
    /\/stories\/(?:starci\/)?layouts\//.test(f) ||
    /\/blocks\/navigation\//.test(f) ||
    /\/(?:Navbar|Footer|sidebar|Sidebar|CollapsibleSidebar|NavigationRail|WorkSessionHeader|InnerLayout)\b/.test(
      f,
    )
  ) {
    return "navigation-shells-layouts"
  }

  // Overlays
  if (
    /\/(?:overlays|modals|drawers)\//.test(f) ||
    /\/blocks\/auth\//.test(f) ||
    /AuthenticationModal|CookieConsent|PremiumGate|AiQuotaModal|E2eResultDrawer|SubmissionAttemptsDrawer/.test(
      f,
    )
  ) {
    return "overlays-modals-drawers"
  }

  // Playground / practice / interview / quiz / challenge / submission FIRST
  // (before learn-course so excluded families land correctly)
  if (
    /\/blocks\/(?:learn\/)?(?:playground|practice|interview|quiz|challenge|submission)\b/i.test(f) ||
    /\/(?:Playground|Practice|MockInterview|Quiz|Challenge|Submission|TaskSubmission)\b/.test(f) ||
    /\/learn\/(?:playground|practice|interview|quiz|challenge|submission)/i.test(f) ||
    /\/blocks\/challenge\//i.test(f)
  ) {
    return "playground-practice-interview"
  }

  // Commerce / account / settings
  if (
    /\/(?:commerce|cart|payment|account|settings|pricing|tier|subscription|billing)\b/i.test(f) ||
    /\/blocks\/(?:commerce|cart|payment|account|settings)\//.test(f) ||
    /\/layouts\/SettingsLayout\b/.test(f)
  ) {
    return "commerce-account-settings"
  }

  // Community / feed / blog / league
  if (
    /\/(?:community|feed|discussion|blog|league)\b/i.test(f) ||
    /\/blocks\/(?:community|feed|blog|league)\//.test(f)
  ) {
    return "community-feed-blog-league"
  }

  // Profile / CV / careers / consultant / grading
  if (
    /\/(?:profile|cv|careers|consultant|grading|jobs)\b/i.test(f) ||
    /\/blocks\/(?:profile|cv|careers|consultant|grading|jobs)\//.test(f)
  ) {
    return "profile-cv-careers-consultant"
  }

  // Dashboard / admin / system / architecture / AI
  if (
    /\/(?:dashboard|admin|system|architecture|status)\b/i.test(f) ||
    /\/blocks\/(?:dashboard|admin|ai|system)\//.test(f) ||
    /\/AiQuota|Changelog|WeeklyGoals|DailyQuest|JobReadiness|ArchitectureScene\b/.test(f)
  ) {
    return "dashboard-admin-system-architecture"
  }

  // Learn / course / content (excluding playground families)
  if (LEARN_INCLUDED.test(f) && !LEARN_EXCLUDED.test(f)) {
    return "learn-course-content"
  }
  // Remaining learn-* that matched excluded keywords already handled; leftover learn → learn
  if (/\/blocks\/learn\//.test(f) || /\/starci\/blocks\/learn\//.test(f)) {
    if (LEARN_EXCLUDED.test(f)) return "playground-practice-interview"
    return "learn-course-content"
  }

  // Shared / leftover blocks (async, chips, cards, form, skeleton, feedback, etc.)
  if (
    /\/blocks\//.test(f) ||
    /\/starci\/blocks\//.test(f) ||
    /\/components\/(?:starci\/)?/.test(f)
  ) {
    return "shared-consumer-chains-coordinator"
  }

  return "shared-consumer-chains-coordinator"
}

const familyKey = (file) => {
  const f = norm(file)
  // Normalize SB twin ↔ src twin into one family for clustering display
  let m =
    f.match(
      /(?:\.storybook\/components\/starci|src\/components)\/(blocks|pages|layouts|overlays)\/(.+?)\/(?:[^/]+)$/,
    ) ||
    f.match(/\.storybook\/stories\/starci\/(blocks|pages|layouts|overlays)\/(.+?)\/(?:[^/]+)$/) ||
    f.match(/(?:\.storybook\/components|src\/components)\/(atoms|frames|composites)\/(.+?)\/(?:[^/]+)$/)
  if (m) return `${m[1]}/${m[2]}`
  // folder-level
  m = f.match(/\/(blocks|pages|layouts|overlays|atoms|frames|composites)\/(.+?)(?:\/|$)/)
  if (m) return `${m[1]}/${m[2].split("/").slice(0, 3).join("/")}`
  return f
}

const exportedComponentName = (file) => {
  const base = path.basename(file).replace(/\.(tsx|ts|jsx|js)$/, "")
  if (base === "index" || base === "component") {
    const parts = norm(file).split("/")
    return parts[parts.length - 2] || base
  }
  return base
}

const scoreRules = (ruleSet) => {
  const hit = []
  for (const cat of OVERLAP_CATEGORIES) {
    if (cat.rules.some((r) => ruleSet.has(r))) hit.push(cat.key)
  }
  return hit
}

// --- load eslint ---
const eslintFile = ESLINT_CANDIDATES.map((n) => path.join(ART, n)).find((p) => fs.existsSync(p))
if (!eslintFile) throw new Error("No ESLint JSON found among candidates")

console.log("Loading", path.basename(eslintFile), "...")
const results = JSON.parse(fs.readFileSync(eslintFile, "utf8"))

const messages = []
for (const file of results) {
  const fileRel = rel(file.filePath)
  for (const msg of file.messages || []) {
    messages.push({
      file: fileRel,
      rule: msg.ruleId || "unknown",
      severity: msg.severity,
      line: msg.line,
      column: msg.column,
      message: msg.message,
    })
  }
}

const byRuleFull = {}
const byRuleStarci = {}
const byFile = {}
let errors = 0
let warnings = 0
let a11y = 0
let starciCount = 0
let forbiddenMessages = 0
const predirtyFiles = new Set()

for (const m of messages) {
  byRuleFull[m.rule] = (byRuleFull[m.rule] || 0) + 1
  byFile[m.file] = (byFile[m.file] || 0) + 1
  if (m.severity === 2) errors++
  if (m.severity === 1) warnings++
  if (A11Y_RE.test(m.rule)) a11y++
  if (STARCI_RE.test(m.rule)) {
    starciCount++
    byRuleStarci[m.rule] = (byRuleStarci[m.rule] || 0) + 1
  }
  if (isForbidden(m.file)) {
    forbiddenMessages++
    predirtyFiles.add(m.file)
  }
}

const affectedFiles = Object.keys(byFile).filter((f) => byFile[f] > 0).length

/** Per-file rule sets for overlap scoring (StarCi arch score rules only; a11y ignored). */
const fileMeta = new Map()
for (const m of messages) {
  if (A11Y_RE.test(m.rule)) continue
  if (!isEditableCandidate(m.file)) continue
  let meta = fileMeta.get(m.file)
  if (!meta) {
    meta = {
      file: m.file,
      rules: new Set(),
      raw: 0,
      starciRaw: 0,
      scoreRules: new Set(),
      agent: agentOf(m.file),
      family: familyKey(m.file),
      component: exportedComponentName(m.file),
      locked: isLockedHold(m.file),
      forbidden: isForbidden(m.file),
      isPage: isPagePath(m.file),
      isShared: isSharedVocabulary(m.file),
    }
    fileMeta.set(m.file, meta)
  }
  meta.rules.add(m.rule)
  meta.raw++
  if (STARCI_RE.test(m.rule)) meta.starciRaw++
  if (SCORE_RULES.has(m.rule)) meta.scoreRules.add(m.rule)
}

for (const meta of fileMeta.values()) {
  meta.categories = scoreRules(meta.scoreRules)
  meta.overlapScore = meta.categories.length
}

/** Actionable StarCi files = editable candidates with ≥1 starci-fe finding (excl a11y-only). */
const actionableFiles = [...fileMeta.values()].filter(
  (m) => m.starciRaw > 0 && !m.forbidden,
)

/** Family-level clusters for ranking (group twins + related files). */
const familyMap = new Map()
for (const meta of actionableFiles) {
  const key = `${meta.family}::${meta.component}`
  let fam = familyMap.get(key)
  if (!fam) {
    fam = {
      id: key,
      family: meta.family,
      component: meta.component,
      files: [],
      categories: new Set(),
      raw: 0,
      agents: new Set(),
      locked: false,
    }
    familyMap.set(key, fam)
  }
  fam.files.push(meta.file)
  fam.raw += meta.raw
  for (const c of meta.categories) fam.categories.add(c)
  fam.agents.add(meta.agent)
  if (meta.locked) fam.locked = true
}

const rankedFamilies = [...familyMap.values()]
  .map((f) => ({
    ...f,
    categories: [...f.categories].sort(),
    overlapScore: f.categories.size,
    agents: [...f.agents],
    files: [...new Set(f.files)].sort(),
  }))
  .sort((a, b) => {
    if (b.overlapScore !== a.overlapScore) return b.overlapScore - a.overlapScore
    if (b.raw !== a.raw) return b.raw - a.raw
    return a.id.localeCompare(b.id)
  })

/** Build disjoint manifests: every actionable editable file exactly once. */
const manifests = Object.fromEntries(
  AGENT_KEYS.map((k) => [
    k,
    {
      focus: AGENT_FOCUS[k],
      files: [],
      lockedHolds: [],
      fileCount: 0,
    },
  ]),
)

const ownership = new Map()
const assignmentConflicts = []

for (const meta of actionableFiles) {
  let agent = meta.agent
  // Hard law: pages only in agent 9
  if (meta.isPage) agent = "pages-and-filing"
  // Shared vocab → agent 10
  if (meta.isShared) agent = "shared-consumer-chains-coordinator"

  if (ownership.has(meta.file)) {
    assignmentConflicts.push({
      file: meta.file,
      first: ownership.get(meta.file),
      second: agent,
    })
    continue
  }
  ownership.set(meta.file, agent)
  manifests[agent].files.push(meta.file)
  if (meta.locked) {
    manifests[agent].lockedHolds.push({
      path: meta.file,
      reason: "Locked product path (MockInterview/Quiz/LearnLoop/ContentAiChat/ArchitectureScene/BlockAnatomy) — own but hold edits",
    })
  }
}

for (const k of AGENT_KEYS) {
  manifests[k].files.sort()
  manifests[k].fileCount = manifests[k].files.length
}

// Prove disjoint
const seen = new Map()
const overlaps = []
for (const [agent, body] of Object.entries(manifests)) {
  for (const f of body.files) {
    if (seen.has(f)) overlaps.push({ file: f, agents: [seen.get(f), agent] })
    else seen.set(f, agent)
  }
}

// Page law: no page file outside agent 9
const pageLeak = []
for (const [agent, body] of Object.entries(manifests)) {
  if (agent === "pages-and-filing") continue
  for (const f of body.files) {
    if (isPagePath(f)) pageLeak.push({ file: f, agent })
  }
}

const overlapPass = overlaps.length === 0 && pageLeak.length === 0 && assignmentConflicts.length === 0

// Sanity: every actionable file assigned
const unassigned = actionableFiles.filter((m) => !ownership.has(m.file))

const byFamilyBucket = {}
for (const m of actionableFiles) {
  const bucket = m.isPage
    ? "pages"
    : m.isShared
      ? "shared-vocab"
      : m.file.includes("/layouts/")
        ? "layouts"
        : m.file.includes("/overlays/")
          ? "overlays"
          : m.file.includes("/blocks/")
            ? "blocks"
            : "other"
  byFamilyBucket[bucket] = (byFamilyBucket[bucket] || 0) + 1
}

const starciScopedFiles = new Set(
  messages.filter((m) => STARCI_RE.test(m.rule) && isEditableCandidate(m.file)).map((m) => m.file),
)

const inventory = {
  batch: "B35",
  phase: 0,
  checkpoint: CHECKPOINT,
  generatedAt: new Date().toISOString(),
  source: path.basename(eslintFile),
  baselineClaim: BASELINE_CLAIM,
  measured: {
    rawMessages: messages.length,
    warnings,
    errors,
    a11y,
    affectedFiles,
    starciMessages: starciCount,
    forbiddenMessages,
  },
  baselineMatch: {
    warnings: warnings === BASELINE_CLAIM.warnings,
    files: affectedFiles === BASELINE_CLAIM.files,
    errors: errors === BASELINE_CLAIM.errors,
    a11y: a11y === BASELINE_CLAIM.a11y,
  },
  byRuleFull: Object.fromEntries(Object.entries(byRuleFull).sort((a, b) => b[1] - a[1])),
  byRuleStarci: Object.fromEntries(Object.entries(byRuleStarci).sort((a, b) => b[1] - a[1])),
  starciScoped: {
    actionableFiles: actionableFiles.length,
    filesWithStarciFindings: starciScopedFiles.size,
    byBucket: byFamilyBucket,
  },
  predirty: {
    note: "Forbidden / pre-dirty paths excluded from all edit manifests",
    files: [...predirtyFiles].sort(),
    messageCount: forbiddenMessages,
  },
  forbidden: [
    "nivo",
    "nivoexpert",
    "mia-mia",
    "CLAUDE.md",
    ".claude/fe/decision-ledger.json",
    ".storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx",
    "src/components/blocks/learn/ReactionButton/types.ts",
    "a11y (observed only)",
  ],
  overlapScoring: {
    categories: OVERLAP_CATEGORIES.map((c) => ({ key: c.key, rules: c.rules })),
    maxScore: OVERLAP_CATEGORIES.length,
    note: "Overlap score = count of distinct categories with ≥1 finding on that file/family",
  },
  topClusters: rankedFamilies.slice(0, 40).map((c) => ({
    id: c.id,
    overlapScore: c.overlapScore,
    categories: c.categories,
    raw: c.raw,
    locked: c.locked,
    agents: c.agents,
    files: c.files,
  })),
  agentFileCounts: Object.fromEntries(AGENT_KEYS.map((k) => [k, manifests[k].fileCount])),
  overlapPass,
  overlaps,
  pageLeak,
  unassigned: unassigned.map((u) => u.file),
}

fs.writeFileSync(OUT_INV, JSON.stringify(inventory, null, 2))

const md = [
  "# B35 ranked clusters (overlap score)",
  "",
  `Checkpoint: \`${CHECKPOINT}\` · Source: \`${path.basename(eslintFile)}\` · Generated: ${inventory.generatedAt}`,
  "",
  "## Scoring",
  "",
  "Overlap score = distinct high-frequency architectural categories with ≥1 finding on the exported component / file family:",
  "",
  "| Category | Rules |",
  "|---|---|",
  ...OVERLAP_CATEGORIES.map((c) => `| ${c.key} | ${c.rules.map((r) => `\`${r}\``).join(", ")} |`),
  "",
  `Max score: **${OVERLAP_CATEGORIES.length}**`,
  "",
  "## Totals",
  "",
  `| Metric | Count |`,
  `|---|---:|`,
  `| Raw warnings | ${warnings} |`,
  `| Affected files | ${affectedFiles} |`,
  `| Errors | ${errors} |`,
  `| A11y (observed) | ${a11y} |`,
  `| StarCi messages | ${starciCount} |`,
  `| StarCi actionable editable files | ${actionableFiles.length} |`,
  `| Ranked families | ${rankedFamilies.length} |`,
  "",
  "## Top 40 families by overlap score",
  "",
]

for (const [i, c] of rankedFamilies.slice(0, 40).entries()) {
  md.push(`### ${i + 1}. \`${c.component}\` — score **${c.overlapScore}** (raw ${c.raw})${c.locked ? " · LOCKED HOLD" : ""}`)
  md.push("")
  md.push(`- Family: \`${c.family}\``)
  md.push(`- Categories: ${c.categories.map((x) => `\`${x}\``).join(", ") || "_none_"}`)
  md.push(`- Agents (pre-assign): ${c.agents.join(", ")}`)
  md.push(`- Files:`)
  for (const f of c.files) md.push(`  - \`${f}\``)
  md.push("")
}

md.push("## Score histogram (families)")
md.push("")
const hist = {}
for (const c of rankedFamilies) hist[c.overlapScore] = (hist[c.overlapScore] || 0) + 1
md.push("| Score | Families |")
md.push("|---:|---:|")
for (const s of Object.keys(hist)
  .map(Number)
  .sort((a, b) => b - a)) {
  md.push(`| ${s} | ${hist[s]} |`)
}
md.push("")

md.push("## Agent file counts (disjoint)")
md.push("")
md.push("| Agent | Files |")
md.push("|---|---:|")
for (const k of AGENT_KEYS) md.push(`| ${k} | ${manifests[k].fileCount} |`)
md.push("")
md.push(`overlapPass: **${overlapPass}**`)
md.push("")

fs.writeFileSync(OUT_CLUSTERS, md.join("\n"))

const manifestsOut = {
  batch: "B35",
  phase: 0,
  checkpoint: CHECKPOINT,
  generatedAt: inventory.generatedAt,
  source: path.basename(eslintFile),
  overlapPass,
  totalActionableFiles: actionableFiles.length,
  agentFileCounts: inventory.agentFileCounts,
  manifests: Object.fromEntries(
    AGENT_KEYS.map((k) => [
      k,
      {
        focus: manifests[k].focus,
        fileCount: manifests[k].fileCount,
        files: manifests[k].files,
        ...(manifests[k].lockedHolds.length
          ? { lockedHolds: manifests[k].lockedHolds }
          : {}),
      },
    ]),
  ),
  proof: {
    overlaps,
    pageLeak,
    assignmentConflicts,
    unassignedCount: unassigned.length,
  },
}

fs.writeFileSync(OUT_MANIFESTS, JSON.stringify(manifestsOut, null, 2))

const brief = [
  "# B35 worker brief (Phase 0 → burn)",
  "",
  `Checkpoint: \`${CHECKPOINT}\` · Branch: \`mtp\` · **Do not commit**`,
  "",
  "## Standing constraints",
  "",
  "- Edit **only** files in your agent key under `.artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json`.",
  "- Every editable candidate appears in exactly one manifest (`overlapPass` must stay true).",
  "- Page files are owned **only** by `pages-and-filing` (agent 9).",
  "- Shared atoms/frames/composites + leftover blocks: `shared-consumer-chains-coordinator` (agent 10).",
  "- Forbidden / pre-dirty (never edit): nivo, nivoexpert, mia-mia, `CLAUDE.md`, `.claude/fe/decision-ledger.json`,",
  "  `.storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx`,",
  "  `src/components/blocks/learn/ReactionButton/types.ts`.",
  "- Locked holds (list in manifest but do not burn): MockInterviewSession, QuizSession, LearnLoopScroll, ContentAiChat, ArchitectureScene, BlockAnatomy.",
  "- A11y is observed only — outside architectural burn unless explicitly requested.",
  "- No new vocabulary, fake principles, CSS-shaped public props, eslint-disable, or severity changes.",
  "- Twin parity: Storybook first when both exist; keep src mirrored.",
  "- Prefer vertical closes on high overlap-score clusters (see `2026-08-10-b35-ranked-clusters.md`).",
  "- Touched-file law: tsc clean; no introduced lint on retained changes; zero warnings in clusters claimed closed.",
  "- Agent 10 also owns aggregate gates later (`npm run audit:fe`, focused eslint, story anatomy gates).",
  "",
  "## Read before editing",
  "",
  "- Backend FE canon: `../starci-academy-backend/.claude/canon/fe/README.md`",
  "- Local topology: `.claude/fe/TOPOLOGY.md`",
  "- ESLint ruleset: `.claude/fe/ESLINT-RULESET.md`",
  "- Inventory: `.artifacts/fe-refactor-audit/2026-08-10-b35-inventory.json`",
  "- Manifests: `.artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json`",
  "",
  "## Report path",
  "",
  "`.artifacts/fe-refactor-audit/2026-08-10-b35-worker-<agentKey>.json`",
  "",
].join("\n")

fs.writeFileSync(OUT_BRIEF, brief)

console.log(
  JSON.stringify(
    {
      source: path.basename(eslintFile),
      measured: inventory.measured,
      baselineMatch: inventory.baselineMatch,
      actionableFiles: actionableFiles.length,
      agentFileCounts: inventory.agentFileCounts,
      overlapPass,
      overlaps: overlaps.length,
      pageLeak: pageLeak.length,
      unassigned: unassigned.length,
      top10: rankedFamilies.slice(0, 10).map((c) => ({
        id: c.id,
        score: c.overlapScore,
        raw: c.raw,
        categories: c.categories,
      })),
    },
    null,
    2,
  ),
)
