/**
 * B35c scope reconciliation — exact ownership of every path differing from 02011807
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const CHECKPOINT = "02011807"

const PREDIRTY = new Set([
  "CLAUDE.md",
  ".claude/fe/decision-ledger.json",
  ".storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx",
  "src/components/blocks/learn/ReactionButton/types.ts",
])

const isForbidden = (f) =>
  /(?:^|\/)(nivo|nivoexpert|mia-mia)(?:\/|$)/.test(f.replace(/\\/g, "/"))

const CHATPANE_REPAIR = new Set([
  "src/components/pages/CommunityChatPage/ChatPane/index.tsx",
  "src/components/pages/CommunityChatPage/ChatPane/component.tsx",
  "src/components/pages/CommunityChatPage/index.tsx",
])

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim()
}

function loadManifests() {
  const m = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35-manifests.json", "utf8"),
  )
  return m.manifests
}

function loadWorkerChanged() {
  const dir = ".artifacts/fe-refactor-audit"
  const map = new Map()
  for (const file of fs.readdirSync(dir)) {
    if (!file.startsWith("2026-08-10-b35-worker-") || !file.endsWith(".json")) continue
    const key = file.replace("2026-08-10-b35-worker-", "").replace(".json", "")
    const j = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"))
    const changed = j.changed || j.filesChanged || j.filesEdited || j.edited || []
    const list = Array.isArray(changed) ? changed : []
    for (const f of list) {
      const pathStr =
        typeof f === "string"
          ? f
          : f && typeof f === "object" && typeof f.path === "string"
            ? f.path
            : f && typeof f === "object" && typeof f.file === "string"
              ? f.file
              : null
      if (!pathStr) continue
      const norm = pathStr.replace(/\\/g, "/")
      if (!map.has(norm)) map.set(norm, [])
      map.get(norm).push(key)
    }
  }
  return map
}

function resolveOwner(norm, phase0Owner, workerChanged) {
  if (CHATPANE_REPAIR.has(norm)) return "ChatPane skeleton repair"
  const workers = [...new Set(workerChanged.get(norm) || [])]
  if (workers.length > 1) return "DUAL:" + workers.join("+")
  if (workers.length === 1) return workers[0]
  if (phase0Owner.has(norm)) return phase0Owner.get(norm)
  if (
    norm.startsWith("src/hooks/") ||
    norm.startsWith("src/modules/") ||
    norm.startsWith("src/app/") ||
    norm.startsWith("src/components/pages/")
  )
    return "pages-and-filing"
  if (norm.includes("test-runner") || norm.includes("plugins/eslint") || norm.endsWith(".test.mjs"))
    return "test/oracle repair"
  return null
}

const modified = sh(`git diff --name-only ${CHECKPOINT} -- .storybook src .claude CLAUDE.md`)
  .split(/\r?\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))
const untracked = sh("git ls-files --others --exclude-standard -- .storybook src")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))
const deleted = sh(`git diff --diff-filter=D --name-only ${CHECKPOINT} -- .storybook src`)
  .split(/\r?\n/)
  .filter(Boolean)
  .map((f) => f.replace(/\\/g, "/"))
const statusNew = new Set(
  sh(`git diff --diff-filter=A --name-only ${CHECKPOINT} -- .storybook src`)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((f) => f.replace(/\\/g, "/")),
)

const allPaths = [...new Set([...modified, ...untracked, ...deleted])]
const manifests = loadManifests()
const workerChanged = loadWorkerChanged()
const phase0Owner = new Map()
for (const [agent, spec] of Object.entries(manifests)) {
  for (const f of spec.files || []) phase0Owner.set(f.replace(/\\/g, "/"), agent)
}

const retainedProduct = []
const excludedPredirty = []
const excludedForbiddenDirty = []
const unowned = []
const dualOwned = []
const forbiddenB35Changes = []
const byOwner = {}
const byClass = {}

for (const norm of allPaths.sort()) {
  if (PREDIRTY.has(norm)) {
    excludedPredirty.push(norm)
    byClass["pre-B35 dirty"] = (byClass["pre-B35 dirty"] || 0) + 1
    continue
  }
  if (isForbidden(norm)) {
    excludedForbiddenDirty.push(norm)
    byClass["forbidden pre-existing dirty"] = (byClass["forbidden pre-existing dirty"] || 0) + 1
    // Only count as forbidden B35 change if it was a *tracked* modification of forbidden product
    // (untracked nivo leftovers are excluded, not B35 work)
    if (modified.includes(norm) && !untracked.includes(norm)) forbiddenB35Changes.push(norm)
    continue
  }
  if (!norm.startsWith(".storybook/") && !norm.startsWith("src/")) {
    byClass["out-of-product-scope"] = (byClass["out-of-product-scope"] || 0) + 1
    continue
  }

  const owner = resolveOwner(norm, phase0Owner, workerChanged)
  if (!owner) {
    unowned.push(norm)
    continue
  }
  if (owner.startsWith("DUAL:")) {
    dualOwned.push({ path: norm, owners: owner })
    continue
  }

  let kind = "B35 product change"
  if (deleted.includes(norm)) kind = "B35 deletion/move"
  else if (untracked.includes(norm) || statusNew.has(norm)) kind = "B35 new file"

  byClass[kind] = (byClass[kind] || 0) + 1
  byOwner[owner] = (byOwner[owner] || 0) + 1
  retainedProduct.push({ path: norm, owner, kind })
}

const scope = {
  batch: "B35c",
  checkpoint: CHECKPOINT,
  generatedAt: new Date().toISOString(),
  counts: {
    allDiffPaths: allPaths.length,
    retainedProduct: retainedProduct.length,
    unowned: unowned.length,
    dualOwned: dualOwned.length,
    forbiddenB35Changes: forbiddenB35Changes.length,
    preDirty: excludedPredirty.length,
    forbiddenPreExistingDirty: excludedForbiddenDirty.length,
  },
  required: {
    unowned: 0,
    dualOwned: 0,
    forbiddenB35Changes: 0,
    pass:
      unowned.length === 0 &&
      dualOwned.length === 0 &&
      forbiddenB35Changes.length === 0,
  },
  byClass,
  byOwner,
  unowned,
  dualOwned,
  forbiddenB35Changes,
  excludedPredirty,
  excludedForbiddenDirty,
  deleted,
  retainedProduct,
  commitManifest: retainedProduct.map((r) => r.path).sort(),
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b35c-scope.json",
  JSON.stringify(scope, null, 2),
)
console.log(
  JSON.stringify(
    {
      pass: scope.required.pass,
      retainedProduct: scope.counts.retainedProduct,
      unowned: scope.unowned,
      dualOwned: scope.dualOwned,
      forbiddenB35: scope.forbiddenB35Changes,
      byOwner: scope.byOwner,
      byClass: scope.byClass,
    },
    null,
    2,
  ),
)
