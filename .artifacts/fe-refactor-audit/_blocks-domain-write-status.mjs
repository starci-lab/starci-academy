import fs from "node:fs"
import { execSync } from "node:child_process"

const batch = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/_blocks-domain-burn-batch.json",
    "utf8",
  ),
)
const remain = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/_blocks-domain-remain.json",
    "utf8",
  ),
)

const detailMap = new Map(
  (batch.details || []).map((d) => [d.path.replace(/\\/g, "/"), d]),
)

const remainByFile = new Map()
for (const [k, v] of Object.entries(remain.byFile || {})) {
  remainByFile.set(k.replace(/\\/g, "/"), [...new Set(v)])
}

const PRODUCT_EMOJI = new Set([
  "src/components/blocks/community/Discussion/constants.ts",
  "src/components/blocks/feed/ReactionBar/index.tsx",
  "src/components/blocks/learn/ReactionButton/types.ts",
])

const INLINE_PARAM_REVERT = new Set([
  "src/components/blocks/grading/DiffViewer/index.tsx",
  "src/components/blocks/grading/GradeModelDropdown/component.tsx",
  "src/components/blocks/learn/ConceptMap/index.tsx",
  "src/components/blocks/learn/SubmissionFindingsList/index.tsx",
  "src/components/blocks/learn/personal-project/TaskResult/index.tsx",
  "src/components/blocks/marketing/SitePreview/index.tsx",
])

const isDirty = (rel) => {
  try {
    execSync(`git -C D:/Repositories/starci-academy diff --quiet -- ${JSON.stringify(rel)}`, {
      stdio: "ignore",
    })
    return false
  } catch {
    return true
  }
}

const changed = []
const skipped = []
const holds = []

for (const rel0 of batch.files) {
  const rel = rel0.replace(/\\/g, "/")
  const dirty = isDirty(rel)
  const rr = remainByFile.get(rel) || []
  const orig = detailMap.get(rel)?.safeRules || []

  if (
    PRODUCT_EMOJI.has(rel) &&
    (orig.includes("starci-fe/no-emoji-in-source") ||
      rr.includes("starci-fe/no-emoji-in-source"))
  ) {
    holds.push({
      path: rel,
      rules: ["starci-fe/no-emoji-in-source"],
      reason: "product-ui-emoji-reaction-glyphs",
    })
  }

  if (INLINE_PARAM_REVERT.has(rel)) {
    holds.push({
      path: rel,
      rules: ["starci-fe/no-inline-parameter-type"],
      reason: "inline-param-auto-extract-corrupted-jsdoc-reverted",
    })
  }

  if (rr.includes("starci-fe/require-identity-root")) {
    holds.push({
      path: rel,
      rules: ["starci-fe/require-identity-root"],
      reason: "identity-not-clear-root",
    })
  }

  if (rr.includes("starci-fe/no-inline-skeleton-branch")) {
    holds.push({
      path: rel,
      rules: ["starci-fe/no-inline-skeleton-branch"],
      reason: "semantic-isSkeleton-threading-not-mechanical",
    })
  }

  if (
    rr.includes("starci-fe/no-inline-parameter-type") &&
    !INLINE_PARAM_REVERT.has(rel)
  ) {
    holds.push({
      path: rel,
      rules: ["starci-fe/no-inline-parameter-type"],
      reason: "inline-param-held-after-corruption-risk",
    })
  }

  if (rr.includes("starci-fe/no-emoji-in-source") && !PRODUCT_EMOJI.has(rel)) {
    holds.push({
      path: rel,
      rules: ["starci-fe/no-emoji-in-source"],
      reason: "residual-emoji-not-safe-to-scrub",
    })
  }

  if (dirty) {
    const applied = orig.filter(
      (r) =>
        !rr.includes(r) &&
        r !== "starci-fe/require-identity-root" &&
        r !== "starci-fe/no-inline-skeleton-branch" &&
        !(PRODUCT_EMOJI.has(rel) && r === "starci-fe/no-emoji-in-source") &&
        !(INLINE_PARAM_REVERT.has(rel) && r === "starci-fe/no-inline-parameter-type"),
    )
    changed.push({
      path: rel,
      rules: [...new Set(applied.length ? applied : ["safe-authoring"])],
      reason: "safe-authoring-burn",
    })
  } else if (rr.length) {
    skipped.push({
      path: rel,
      rules: rr,
      reason: "held-only-no-safe-mechanical-edit",
    })
  } else {
    skipped.push({
      path: rel,
      rules: orig,
      reason: "already-clean-or-reverted-no-safe-edit",
    })
  }
}

const seen = new Set()
const holdsD = []
for (const h of holds) {
  const k = `${h.path}|${h.rules.join("|")}`
  if (seen.has(k)) continue
  seen.add(k)
  holdsD.push(h)
}

const deferred = (batch.deferred || []).map((p) => ({
  path: p,
  rules: ["*"],
  reason: "deferred-batch-size",
}))

const safeAfter = Object.values(remain.byRule || {}).reduce((a, b) => a + b, 0)

const status = {
  partition: "blocks-domain",
  changed,
  skipped: [...skipped, ...deferred],
  holds: holdsD,
  verification: {
    batchSize: batch.files.length,
    changedCount: changed.length,
    holdCount: holdsD.length,
    skippedInBatch: skipped.length,
    deferredCount: deferred.length,
    safeHitsBeforeBatch: 119,
    safeHitsAfterBatch: safeAfter,
    remainingByRule: remain.byRule,
    note:
      "Storybook-first then src twins; product reaction emoji, unclear identity roots, inline-skeleton threading, and risky inline-param extracts held; nivo/Mia-Mia/locked absent from this partition.",
  },
  regressions: [],
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-worker-blocks-domain.json",
  JSON.stringify(status, null, 2),
)

console.log(
  JSON.stringify(
    {
      changed: changed.length,
      holds: holdsD.length,
      skippedInBatch: skipped.length,
      deferred: deferred.length,
      remainingByRule: remain.byRule,
    },
    null,
    2,
  ),
)
