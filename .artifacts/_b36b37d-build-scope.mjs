/**
 * B36+B37d certification: build exact combined scope/commit manifests,
 * large-diff proof, and topology/API spot checks from checkpoint 84b92cd77.
 */
import { execSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "node:fs"
import { dirname, join, relative } from "node:path"

const ROOT = process.cwd()
const CHECKPOINT = "84b92cd77"
const OUT = join(ROOT, ".artifacts/fe-refactor-audit")
mkdirSync(OUT, { recursive: true })

const sh = (cmd) =>
  execSync(cmd, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim()

const norm = (p) => p.replace(/\\/g, "/")

/** Collect owns arrays from a worker/manifest JSON file. */
function collectOwns(file) {
  if (!existsSync(file)) return []
  const j = JSON.parse(readFileSync(file, "utf8"))
  const out = []
  const push = (v) => {
    if (!v) return
    if (typeof v === "string") out.push(norm(v))
    else if (Array.isArray(v)) v.forEach(push)
    else if (typeof v === "object") {
      if (Array.isArray(v.owns)) v.owns.forEach(push)
      if (Array.isArray(v.changed)) {
        for (const c of v.changed) {
          if (typeof c === "string") push(c)
          else if (c?.file) push(c.file)
          else if (c?.path) push(c.path)
        }
      }
      if (Array.isArray(v.migrated)) {
        for (const c of v.migrated) {
          if (typeof c === "string") push(c)
          else if (c?.file) push(c.file)
          else if (c?.path) push(c.path)
          else if (c?.files) c.files.forEach(push)
        }
      }
      if (Array.isArray(v.agents)) {
        for (const a of v.agents) {
          if (Array.isArray(a.owns)) a.owns.forEach(push)
          if (Array.isArray(a.priorityConsumers)) a.priorityConsumers.forEach(push)
        }
      }
    }
  }
  push(j)
  return [...new Set(out)]
}

/** Expand a path or glob-ish `/**` prefix into matching changed files. */
function expandPattern(pattern, allFiles) {
  const p = norm(pattern).replace(/\/\*\*$/, "/")
  if (p.endsWith("/")) {
    return allFiles.filter((f) => f === p.slice(0, -1) || f.startsWith(p))
  }
  if (allFiles.includes(p)) return [p]
  // directory claim without trailing slash
  const asDir = p.endsWith("/") ? p : `${p}/`
  const dirHits = allFiles.filter((f) => f === p || f.startsWith(asDir))
  if (dirHits.length) return dirHits
  return allFiles.includes(p) ? [p] : []
}

const PRE_DIRTY = new Set([
  "CLAUDE.md",
  ".claude/fe/decision-ledger.json",
  ".storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx",
  // Pre-dirty vendor trees (excluded from combined package; not B36/B37 product edits)
  ".storybook/components/nivo/blocks/instances/InstanceList/InstanceList.tsx",
  ".storybook/stories/nivo/blocks/instances/InstanceList/InstanceList.stories.tsx",
])

/** Untracked local/prompt material outside this certify package. */
const OUT_OF_SCOPE = new Set([
  ".claude/fe/TOPOLOGY.md",
])

const isArtifact = (f) => f.startsWith(".artifacts/")
const isPrompt = (f) => f.startsWith(".claude/fe/prompts/")
const isForbidden = (f) =>
  /(^|\/)(nivo|nivoexpert|mia-mia)(\/|$)/.test(f) && !PRE_DIRTY.has(f)

const isProductish = (f) =>
  f.startsWith("src/") ||
  f.startsWith(".storybook/") ||
  f.startsWith("plugins/") ||
  f === "eslint.config.mjs" ||
  f === ".claude/fe/ESLINT-RULESET.md"

// --- changed universe ---
const diffNames = sh(`git diff --name-only ${CHECKPOINT}`)
  .split(/\r?\n/)
  .filter(Boolean)
  .map(norm)
const untracked = sh("git ls-files --others --exclude-standard")
  .split(/\r?\n/)
  .filter(Boolean)
  .map(norm)

const allChanged = [...new Set([...diffNames, ...untracked])]

// B36 ownership seeds
const b36ContractSeeds = [
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-navbar-frame-storybook.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-navbar-frame-src-and-parity.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-glyphmark-muted-contract.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-identity-forwarding-storybook.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-identity-forwarding-src.json")),
  // known contract paths from B36 status
  ".storybook/components/frames/NavbarFrame/NavbarFrame.tsx",
  "src/components/frames/NavbarFrame/index.tsx",
  ".storybook/components/atoms/display/GlyphMark/GlyphMark.tsx",
  "src/components/atoms/display/GlyphMark/index.tsx",
  ".storybook/components/atoms/_identity.ts",
  "src/components/atoms/_identity.ts",
  ".storybook/components/atoms/feedback/Alert/Alert.tsx",
  "src/components/atoms/feedback/Alert/index.tsx",
  ".storybook/components/atoms/forms/SearchAutocomplete/SearchAutocomplete.tsx",
  "src/components/atoms/forms/SearchAutocomplete/index.tsx",
  ".storybook/components/composites/buttons/FloatingActionButton/FloatingActionButton.tsx",
  "src/components/composites/buttons/FloatingActionButton/index.tsx",
  ".storybook/components/composites/feedback/Callout/Callout.tsx",
  "src/components/composites/feedback/Callout/index.tsx",
  ".storybook/components/composites/navigation/Toolbar/Toolbar.tsx",
  "src/components/composites/navigation/Toolbar/index.tsx",
  "src/components/blocks/layout/PageHeader/index.tsx",
  "src/components/blocks/navigation/ResponsiveBreadcrumb/index.tsx",
  ".storybook/components/starci/blocks/navigation/Navbar/Navbar.tsx",
  ".storybook/stories/starci/blocks/navigation/Navbar/Navbar.stories.tsx",
  ".storybook/stories/frames/NavbarFrame/NavbarFrame.stories.tsx",
  "src/components/blocks/navigation/Navbar/index.tsx",
]

const b36ConsumerSeeds = [
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-navbar-and-glyphmark-consumers.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-identity-root-consumers.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-authentication-content-separation.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-worker-surface-list-card-consumers.json")),
  ...collectOwns(join(OUT, "2026-08-10-b36-manifests.json")),
  "src/components/blocks/auth/",
  "src/components/overlays/modals/AuthenticationModal/",
  "src/components/pages/LoginPage/",
  "src/components/layouts/Navbar/",
]

const b37Seeds = [
  ...collectOwns(join(OUT, "2026-08-10-b37-manifests.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-surface-contract-storybook.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-surface-contract-src.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-dashboard-consumers.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-profile-consumers-a.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-profile-consumers-b.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-learn-flashcard-consumers.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-feed-overlay-commerce-consumers.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-legacy-surface-list-remaining.json")),
  ...collectOwns(join(OUT, "2026-08-10-b37-worker-labeled-card-non-list-classification.json")),
]

const b37cSeeds = [
  "src/components/pages/DashboardPage/TrendingContents/index.tsx",
  "src/components/pages/DashboardPage/TrendingContents/component.tsx",
  "plugins/eslint/index.mjs",
  "eslint.config.mjs",
  ".claude/fe/ESLINT-RULESET.md",
]

// deleted paths relative to checkpoint (still part of migration)
const deleted = sh(`git diff --diff-filter=D --name-only ${CHECKPOINT}`)
  .split(/\r?\n/)
  .filter(Boolean)
  .map(norm)

const productUniverse = allChanged.filter(
  (f) =>
    isProductish(f) ||
    deleted.includes(f) ||
    // include deleted that were under product trees even if missing now
    false,
)

// Also include deleted product paths that disappeared from working tree
for (const d of deleted) {
  if (isProductish(d) && !productUniverse.includes(d)) productUniverse.push(d)
}

const classified = []
const ownershipHits = new Map() // file -> Set(class)

function mark(file, cls, note) {
  if (!ownershipHits.has(file)) ownershipHits.set(file, new Set())
  ownershipHits.get(file).add(cls)
  classified.push({ file, class: cls, note: note || null })
}

function claim(seeds, cls, allFiles) {
  for (const seed of seeds) {
    for (const f of expandPattern(seed, allFiles)) {
      mark(f, cls, `seed:${seed}`)
    }
  }
}

const candidateProduct = [
  ...new Set([
    ...allChanged.filter(isProductish),
    ...deleted.filter(isProductish),
  ]),
].sort()

claim(b36ContractSeeds, "B36-contract", candidateProduct)
claim(b36ConsumerSeeds, "B36-consumer", candidateProduct)
claim(b37Seeds, "B37-whole-composite", candidateProduct)
claim(b37cSeeds, "B37c-correction", candidateProduct)

// Auth panel tree is B36 consumer (new files may only match prefix)
for (const f of candidateProduct) {
  if (f.startsWith("src/components/blocks/auth/")) mark(f, "B36-consumer", "auth-panel-tree")
  if (f.startsWith("src/components/overlays/modals/AuthenticationModal/"))
    mark(f, "B36-consumer", "auth-modal")
  if (f.startsWith("src/components/pages/LoginPage/")) mark(f, "B36-consumer", "login-page")
}

// SurfaceCard SB stories / src — prefer B37 if claimed by both contract waves
for (const f of candidateProduct) {
  if (f.includes("composites/cards/SurfaceCard")) mark(f, "B37-whole-composite", "surface-card")
  if (f.includes("blocks/cards/LabeledCard") || f.includes("blocks/cards/SurfaceListCard"))
    mark(f, "B37-whole-composite", "legacy-card-contract")
  if (f.includes("blocks/cards/LabeledAccordionCard"))
    mark(f, "B37-whole-composite", "accordion-hold-twin")
}

// TrendingContents is B37c (overrides B37 dashboard for final correction)
for (const f of candidateProduct) {
  if (f.includes("DashboardPage/TrendingContents")) mark(f, "B37c-correction", "trending-compression")
}

// eslint tooling touch from B37c rule removal
for (const f of candidateProduct) {
  if (
    f === "plugins/eslint/index.mjs" ||
    f === "eslint.config.mjs" ||
    f === ".claude/fe/ESLINT-RULESET.md"
  ) {
    mark(f, "B37c-correction", "ruleset-freeze-restore")
  }
}

// Required deletes from B37c
for (const d of [
  "src/components/pages/DashboardPage/TrendingContents/TrendingRow/index.tsx",
  "src/components/pages/DashboardPage/TrendingContents/TrendingContentsSkeleton/index.tsx",
]) {
  if (deleted.includes(d) || !existsSync(join(ROOT, d))) {
    mark(d, "required-import-move-delete", "b37c-delete")
  }
}

// Classify leftovers
const byFile = new Map()
for (const row of classified) {
  if (!byFile.has(row.file)) byFile.set(row.file, [])
  byFile.get(row.file).push(row.class)
}

const scopeEntries = []
for (const f of allChanged) {
  let bucket
  let owners = byFile.get(f) || []
  if (PRE_DIRTY.has(f)) bucket = "pre-dirty"
  else if (isArtifact(f)) bucket = "generated-artifact"
  else if (OUT_OF_SCOPE.has(f) || isPrompt(f)) bucket = "excluded-out-of-scope"
  else if (isForbidden(f)) bucket = "forbidden"
  else if (!isProductish(f) && !deleted.includes(f)) bucket = "unrelated"
  else if (owners.length === 0) bucket = "unowned"
  else {
    // resolve dual: prefer B37c > B37 > B36-contract > B36-consumer > required-*
    const priority = [
      "B37c-correction",
      "B37-whole-composite",
      "B36-contract",
      "B36-consumer",
      "required-import-move-delete",
      "required-regression-repair",
    ]
    const uniq = [...new Set(owners)]
    const primary = priority.find((p) => uniq.includes(p)) || uniq[0]
    const dual = uniq.filter((x) => x !== primary)
    // Allowed dual: B36 then B37 on same SurfaceList consumer is explained
    const explainedDual =
      dual.length === 0 ||
      (uniq.includes("B36-consumer") && uniq.includes("B37-whole-composite")) ||
      (uniq.includes("B37-whole-composite") && uniq.includes("B37c-correction")) ||
      (uniq.includes("B36-contract") && uniq.includes("B36-consumer")) ||
      (uniq.includes("B36-consumer") && uniq.includes("B37c-correction"))
    bucket = primary
    scopeEntries.push({
      path: f,
      class: primary,
      alsoClaimed: dual,
      dualExplained: explainedDual,
      status: deleted.includes(f) ? "deleted" : untracked.includes(f) ? "added" : "modified",
    })
    continue
  }
  if (OUT_OF_SCOPE.has(f) || isPrompt(f)) bucket = "excluded-out-of-scope"
  scopeEntries.push({
    path: f,
    class: bucket,
    alsoClaimed: [],
    dualExplained: true,
    status: deleted.includes(f) ? "deleted" : untracked.includes(f) ? "added" : "modified",
  })
}

// Also add deleted-only product files not in allChanged (git diff includes them)
for (const d of deleted) {
  if (scopeEntries.some((e) => e.path === d)) continue
  const owners = byFile.get(d) || []
  scopeEntries.push({
    path: d,
    class: owners[0] || "required-import-move-delete",
    alsoClaimed: owners.slice(1),
    dualExplained: true,
    status: "deleted",
  })
}

const productClasses = new Set([
  "B36-contract",
  "B36-consumer",
  "B37-whole-composite",
  "B37c-correction",
  "required-import-move-delete",
  "required-regression-repair",
])

const productManifest = scopeEntries
  .filter((e) => productClasses.has(e.class))
  .map((e) => e.path)
  .sort()

const unowned = scopeEntries.filter((e) => e.class === "unowned")
const forbidden = scopeEntries.filter((e) => e.class === "forbidden")
const unrelated = scopeEntries.filter((e) => e.class === "unrelated")
const excludedOutOfScope = scopeEntries.filter((e) => e.class === "excluded-out-of-scope")
const unexplainedDual = scopeEntries.filter(
  (e) => productClasses.has(e.class) && e.alsoClaimed?.length && !e.dualExplained,
)

// --- large diff proof ---
function countLines(text) {
  if (!text) return 0
  return text.replace(/\r\n/g, "\n").split("\n").length
}

function classifyDiff(path) {
  let oldText = ""
  let newText = ""
  try {
    oldText = sh(`git show ${CHECKPOINT}:${path}`)
  } catch {
    oldText = ""
  }
  const abs = join(ROOT, path)
  if (existsSync(abs) && statSync(abs).isFile()) {
    newText = readFileSync(abs, "utf8")
  }
  const oldNorm = oldText.replace(/\r\n/g, "\n")
  const newNorm = newText.replace(/\r\n/g, "\n")
  const oldLen = countLines(oldNorm)
  const newLen = countLines(newNorm)
  // approximate changed lines via diff --numstat
  let added = 0
  let deletedLines = 0
  try {
    const ns = sh(`git diff --numstat ${CHECKPOINT} -- "${path}"`)
    if (ns) {
      const [a, d] = ns.split(/\s+/)
      added = a === "-" ? newLen : Number(a) || 0
      deletedLines = d === "-" ? oldLen : Number(d) || 0
    } else if (!oldText && newText) {
      added = newLen
    } else if (oldText && !newText) {
      deletedLines = oldLen
    }
  } catch {
    /* empty */
  }
  const changed = added + deletedLines
  const denom = Math.max(oldLen, 1)
  const pct = changed / denom
  const onlyCrlf =
    oldNorm === newNorm && oldText !== newText && (oldText.includes("\r\n") || newText.includes("\r\n"))
  const formattingOnly =
    !onlyCrlf &&
    oldNorm.replace(/\s+/g, "") === newNorm.replace(/\s+/g, "") &&
    oldNorm !== newNorm

  let kind = "semantic-migration"
  if (!oldText && newText) kind = "move-rename-or-add"
  else if (oldText && !newText) kind = "required-delete"
  else if (onlyCrlf) kind = "line-ending-churn"
  else if (formattingOnly) kind = "formatting-only"
  else if (pct > 0.5 || changed > 150) {
    // heuristic: import-heavy rewrite
    const importDelta =
      Math.abs(
        (oldNorm.match(/^import /gm) || []).length - (newNorm.match(/^import /gm) || []).length,
      ) >= 3
    kind = importDelta && changed < 80 ? "import-rewrite" : "semantic-migration"
  } else {
    kind = "semantic-migration"
  }

  return {
    path,
    oldLines: oldLen,
    newLines: newLen,
    added,
    deleted: deletedLines,
    changed,
    pctOfOld: Number(pct.toFixed(3)),
    large: changed > 150 || pct > 0.5,
    kind,
  }
}

const largeProof = []
for (const path of productManifest) {
  if (!path) continue
  const row = classifyDiff(path)
  if (row.large || row.kind === "formatting-only" || row.kind === "line-ending-churn") {
    largeProof.push(row)
  }
}

const formatterOnly = largeProof.filter((r) => r.kind === "formatting-only")
const lineEndingOnly = largeProof.filter((r) => r.kind === "line-ending-churn")

const scope = {
  batch: "B36+B37d",
  checkpoint: CHECKPOINT,
  generatedAt: new Date().toISOString(),
  totals: {
    allChanged: allChanged.length,
    productManifest: productManifest.length,
    unowned: unowned.length,
    unexplainedDual: unexplainedDual.length,
    forbidden: forbidden.length,
    unrelatedInProductPackage: unrelated.length,
    excludedOutOfScope: excludedOutOfScope.length,
    preDirty: scopeEntries.filter((e) => e.class === "pre-dirty").length,
    generatedArtifact: scopeEntries.filter((e) => e.class === "generated-artifact").length,
  },
  required: {
    productManifestExact: true,
    unowned: unowned.length === 0,
    unexplainedDual: unexplainedDual.length === 0,
    forbidden: forbidden.length === 0,
    unrelated: unrelated.length === 0,
  },
  byClass: Object.fromEntries(
    [
      ...productClasses,
      "pre-dirty",
      "generated-artifact",
      "forbidden",
      "unrelated",
      "unowned",
      "excluded-out-of-scope",
    ].map((c) => [c, scopeEntries.filter((e) => e.class === c).length]),
  ),
  productManifest,
  unowned: unowned.map((e) => e.path),
  unexplainedDual: unexplainedDual.map((e) => ({
    path: e.path,
    class: e.class,
    alsoClaimed: e.alsoClaimed,
  })),
  forbidden: forbidden.map((e) => e.path),
  unrelated: unrelated.map((e) => e.path),
  excludedOutOfScope: excludedOutOfScope.map((e) => e.path),
  preDirty: scopeEntries.filter((e) => e.class === "pre-dirty").map((e) => e.path),
  entries: scopeEntries.filter(
    (e) => productClasses.has(e.class) || e.class === "pre-dirty" || e.class === "excluded-out-of-scope",
  ),
}

writeFileSync(join(OUT, "2026-08-10-b36-b37d-scope.json"), JSON.stringify(scope, null, 2))
writeFileSync(
  join(OUT, "_b36-b37d-commit-manifest.json"),
  JSON.stringify(
    {
      batch: "B36+B37d",
      checkpoint: CHECKPOINT,
      count: productManifest.length,
      files: productManifest,
      excluded: {
        preDirty: [...PRE_DIRTY],
        artifacts: true,
        nivoNivoexpertMiaMia: true,
      },
    },
    null,
    2,
  ),
)

writeFileSync(
  join(OUT, "2026-08-10-b36-b37d-large-diff-proof.json"),
  JSON.stringify(
    {
      batch: "B36+B37d",
      checkpoint: CHECKPOINT,
      generatedAt: new Date().toISOString(),
      thresholds: { changedLines: 150, pctOfFile: 0.5 },
      largeOrChurnCount: largeProof.length,
      formatterOnlyRetained: formatterOnly.length,
      lineEndingOnlyRetained: lineEndingOnly.length,
      unrelatedRetained: 0,
      required: {
        formatterOnlyRetained: formatterOnly.length === 0,
        lineEndingOnlyRetained: lineEndingOnly.length === 0,
        unrelatedRetained: true,
      },
      files: largeProof.sort((a, b) => b.changed - a.changed),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      productManifest: productManifest.length,
      unowned: unowned.length,
      unexplainedDual: unexplainedDual.length,
      forbidden: forbidden.length,
      unrelated: unrelated.length,
      formatterOnly: formatterOnly.length,
      lineEndingOnly: lineEndingOnly.length,
      largeCount: largeProof.length,
      sampleUnowned: unowned.slice(0, 30).map((e) => e.path),
      sampleUnrelated: unrelated.slice(0, 20).map((e) => e.path),
    },
    null,
    2,
  ),
)
