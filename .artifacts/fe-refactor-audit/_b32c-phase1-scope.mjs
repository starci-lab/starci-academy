/**
 * BATCH 32c Phase 1 — scope reconciliation.
 * Maps every worktree product/plugin diff vs checkpoint to an owner.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const CHECKPOINT = "9e86cbdf"

const norm = (p) => String(p || "").replace(/\\/g, "/")

const diffNames = execSync(`git diff --name-only ${CHECKPOINT}`, { encoding: "utf8" })
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean)
  .map(norm)

const untracked = execSync(
  "git ls-files --others --exclude-standard -- src .storybook plugins eslint.config.mjs",
  { encoding: "utf8" },
)
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean)
  .map(norm)

const manifests = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32-manifests.json"), "utf8"))
const status = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32-status.json"), "utf8"))

const AGENTS = Object.keys(manifests.agents)

const asArray = (v) => {
  if (v == null) return []
  if (Array.isArray(v)) return v
  if (typeof v === "object") {
    if (Array.isArray(v.items)) return v.items
    if (Array.isArray(v.list)) return v.list
    return Object.values(v).flatMap((x) => (Array.isArray(x) ? x : [x]))
  }
  return [v]
}

const extractFiles = (w) => {
  const out = new Set()
  for (const key of ["changedFiles", "changed", "edited", "filesChanged", "closed", "closures", "applied", "fixed"]) {
    for (const item of asArray(w[key])) {
      if (typeof item === "string" && (item.includes("/") || /\.(tsx?|mjs|cjs|js)$/.test(item))) {
        out.add(norm(item))
      }
      if (item?.file) out.add(norm(item.file))
      if (item?.path) out.add(norm(item.path))
      for (const f of asArray(item?.files || item?.changed || item?.changedFiles)) {
        if (typeof f === "string") out.add(norm(f))
      }
    }
  }
  return [...out]
}

const workerOwned = new Map() // file -> [agents]
for (const agent of AGENTS) {
  const p = path.join(ART, `2026-08-10-b32-worker-${agent}.json`)
  if (!fs.existsSync(p)) continue
  const w = JSON.parse(fs.readFileSync(p, "utf8"))
  for (const f of extractFiles(w)) {
    if (!workerOwned.has(f)) workerOwned.set(f, [])
    workerOwned.get(f).push(agent)
  }
  // also claim frozen manifest files that worker was assigned (even if not edited)
  for (const f of manifests.agents[agent] || []) {
    const n = norm(f)
    if (!workerOwned.has(n)) workerOwned.set(n, [])
    if (!workerOwned.get(n).includes(agent)) workerOwned.get(n).push(`${agent}:manifest`)
  }
}

/** Known coordinator-repair files from B32 handoff / conversation. */
const COORDINATOR_REPAIR = new Set([
  ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
  "src/components/composites/cards/SurfaceCard/index.tsx",
  ".storybook/components/nivoexpert/blocks/studio/ConfirmDialog/ConfirmDialog.tsx",
  ".storybook/components/nivoexpert/overlays/modals/RefundOrderModal/RefundOrderModal.tsx",
  ".storybook/components/starci/blocks/learn/ContentAiFab/ContentAiFab.tsx",
  ".storybook/components/starci/blocks/learn/LeaderboardCategoryNav/LeaderboardCategoryNav.tsx",
  ".storybook/components/starci/blocks/learn/TaskLockedAlert/TaskLockedAlert.tsx",
  "src/components/blocks/learn/LeaderboardCategoryNav/index.tsx",
  "src/components/blocks/learn/TaskLockedAlert/index.tsx",
  "src/components/pages/MindMapPage/component.tsx",
  "src/components/pages/PracticeHubPage/CodingLeaderboard/index.tsx",
  "src/components/blocks/community/CommunityCommentItem/component.tsx",
  "src/components/blocks/community/CommunityCommentThread/component.tsx",
  ".storybook/components/composites/form/_field/FieldFrame.tsx",
  "src/components/composites/form/_field/FieldFrame.tsx",
  "plugins/eslint/index.mjs",
  "plugins/eslint/architectural-oracle.test.mjs",
  "plugins/eslint/css-door-laundering.mjs",
  "plugins/eslint/css-door-laundering.test.mjs",
  "plugins/eslint/frame-items.test.mjs",
  "plugins/eslint/sentence-hosts.test.mjs",
  "plugins/eslint/sentence-tier.test.mjs",
  "eslint.config.mjs",
].map(norm))

/** Pre-B32 dirty files observed at B32 start (from coordinator status). */
const PRE_B32_DIRTY = new Set([
  ".storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx",
  "CLAUDE.md",
  "src/components/blocks/community/Discussion/constants.ts",
  "src/components/blocks/learn/ReactionButton/types.ts",
].map(norm))

/** Unrelated untracked / locked trees not owned by B32. */
const UNRELATED_LOCKED = new Set([
  ".storybook/components/nivo/blocks/instances/InstanceList/InstanceList.tsx",
  ".storybook/stories/nivo/blocks/instances/InstanceList/InstanceList.stories.tsx",
].map(norm))

const PRODUCT_RE = /^(src\/|\.storybook\/|plugins\/eslint|eslint\.config\.mjs)/

const entries = []
const allDiffs = [...new Set([...diffNames, ...untracked])]

for (const file of allDiffs.sort()) {
  const isProduct = PRODUCT_RE.test(file) || file.startsWith("plugins/")
  const owners = workerOwned.get(file) || []
  const workerAgents = [...new Set(owners.map((o) => o.replace(/:manifest$/, "")).filter((o) => !o.includes(":")))]
  const inManifest = owners.some((o) => String(o).includes(":manifest")) ||
    AGENTS.some((a) => (manifests.agents[a] || []).map(norm).includes(file))

  let classification = "unclassified"
  let owner = null

  if (file.startsWith(".artifacts/")) {
    classification = "generated-artifact"
    owner = "artifacts"
  } else if (UNRELATED_LOCKED.has(file)) {
    classification = "unrelated-locked-or-nivo"
    owner = "unrelated-locked"
  } else if (
    /\/(?:nivo|nivoexpert|mia-mia)\//i.test(file) &&
    !COORDINATOR_REPAIR.has(file) &&
    workerAgents.length === 0 &&
    !inManifest
  ) {
    classification = "unrelated-locked-or-nivo"
    owner = "unrelated-locked"
  } else if (PRE_B32_DIRTY.has(file) && !inManifest && workerAgents.length === 0) {
    classification = "pre-b32-dirty"
    owner = "pre-b32"
  } else if (COORDINATOR_REPAIR.has(file)) {
    classification = "coordinator-repair"
    owner = "coordinator-repair"
  } else if (workerAgents.length > 0 || inManifest) {
    classification = "b32-worker"
    owner = workerAgents[0] || AGENTS.find((a) => (manifests.agents[a] || []).map(norm).includes(file)) || "b32-worker"
  } else if (file.startsWith("plugins/eslint/") || file === "eslint.config.mjs") {
    classification = "coordinator-repair"
    owner = "agent-10-eslint-oracle"
  } else if (!isProduct) {
    classification = "unrelated-non-product"
    owner = "unrelated"
  } else {
    classification = "unowned-product-diff"
    owner = null
  }

  // dual ownership: worker + coordinator repair
  const dual = COORDINATOR_REPAIR.has(file) && (workerAgents.length > 0 || inManifest)

  entries.push({
    file,
    tracked: diffNames.includes(file),
    untracked: untracked.includes(file),
    classification,
    owner,
    workerAgents,
    inManifest,
    dualOwnership: dual,
    requiresOwner: isProduct && classification !== "generated-artifact",
  })
}

const productEntries = entries.filter((e) => e.requiresOwner)
const unowned = productEntries.filter((e) => !e.owner)
const byClass = {}
for (const e of entries) {
  byClass[e.classification] = (byClass[e.classification] || 0) + 1
}

const b32ProductFiles = productEntries
  .filter((e) => e.classification === "b32-worker" || e.classification === "coordinator-repair" || e.dualOwnership)
  .map((e) => e.file)
  .sort()

const scope = {
  batch: "B32c",
  phase: 1,
  checkpoint: CHECKPOINT,
  generatedAt: new Date().toISOString(),
  totals: {
    diffVsCheckpoint: diffNames.length,
    untrackedProductish: untracked.length,
    entries: entries.length,
    productEntries: productEntries.length,
    unownedProduct: unowned.length,
  },
  byClassification: byClass,
  ownershipOk: unowned.length === 0,
  unownedFiles: unowned.map((e) => e.file),
  b32CertifyManifest: b32ProductFiles,
  preB32Dirty: [...PRE_B32_DIRTY].filter((f) => allDiffs.includes(f)),
  coordinatorRepair: [...COORDINATOR_REPAIR].filter((f) => allDiffs.includes(f) || fs.existsSync(path.join(ROOT, f))),
  entries,
  notes: [
    "Pre-B32 dirty files must not be absorbed into B32 certify claims.",
    "Coordinator repair includes cross-partition classNames consumer migrations after dead-door burns.",
    "Every product/plugin file in the certify manifest must have an owner.",
  ],
}

fs.writeFileSync(path.join(ART, "2026-08-10-b32c-scope.json"), JSON.stringify(scope, null, 2))
console.log(
  JSON.stringify(
    {
      ownershipOk: scope.ownershipOk,
      unowned: unowned.length,
      byClass,
      certifyManifest: b32ProductFiles.length,
      preB32: scope.preB32Dirty,
    },
    null,
    2,
  ),
)
