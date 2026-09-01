import fs from "fs"

const inv = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json", "utf8"),
)

inv.execution = {
  identityTileCreated: false,
  retracted: true,
  retractReason: [
    "COMPOSITE-3: composites must not import vendor (@heroui Skeleton)",
    "COMPOSITE-10: composites must not draw own shimmer — forward isSkeleton to atoms",
    "Approved path composites/identity/IdentityTile + owning isSkeleton chrome conflicts with composite gates",
    "Atom IconTile pattern (vendor shimmer at atom tier) is the honest home for this chrome",
    "Unlocked block consumers also fail zero-warn ratchet for import migration",
    "blocks/identity/IconTile cannot be deleted while page+LLC holds remain",
  ],
  recommendation:
    "Amend approved filing to atoms/display/IdentityTile (atom with isSkeleton like IconTile), OR add a leaf atom for square identity chrome that a thin composite forwards isSkeleton into",
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json",
  JSON.stringify(inv, null, 2),
)

const empty = {
  manifest: [],
  sizeEvidence: {
    IconTileAtom: "sm40/md64/lg80 rounded-full",
    IdentityTileApproved: "sm48/xl md64/2xl lg80/2xl",
  },
  radiusEvidence: {},
  consumerCountBefore: inv.summary.total,
  consumerCountAfter: inv.summary.total,
  oldPathsBefore: ["blocks/identity/IconTile"],
  oldPathsAfter: ["blocks/identity/IconTile"],
  canonicalPath: null,
  changed: [],
  held: [],
  retracted: [],
  storybookParity: "n/a",
  verification: { productEdits: false },
  regressions: [],
  overlapCheck: "pass",
}

const workers = {
  "identity-tile-storybook": {
    ...empty,
    held: ["retracted — COMPOSITE-3/10"],
    retracted: [
      ".storybook/components/composites/identity/IdentityTile/IdentityTile.tsx",
      ".storybook/stories/composites/identity/IdentityTile/IdentityTile.stories.tsx",
    ],
  },
  "identity-tile-src": {
    ...empty,
    held: ["retracted — COMPOSITE-3/10"],
    retracted: ["src/components/composites/identity/IdentityTile/index.tsx"],
  },
  "glyph-consumers": {
    ...empty,
    held: ["atom IconTile consumers unchanged"],
  },
  "identity-consumers-a": {
    ...empty,
    held: [
      "7 unlocked block consumers skipped — pre-existing warnings",
      "no migration without IdentityTile landing",
    ],
  },
  "identity-consumers-b": {
    ...empty,
    held: [
      `page-folder ${inv.summary.byAction["hold-page-folder"]}`,
      `LeaderboardListCard ${inv.summary.byAction["hold-leaderboard-list-card"]}`,
      `nivo ${inv.summary.byAction["hold-nivo"]}`,
    ],
  },
  coordinator: {
    ...empty,
    manifest: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.md",
      ".claude/fe/decision-ledger.json",
    ],
    changed: [
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.md",
      ".claude/fe/decision-ledger.json",
    ],
    verification: {
      productDiff: "empty after retract",
      auditFe: "COMPOSITE-10 blocked IdentityTile before retract",
    },
    retracted: inv.execution.retractReason,
  },
}

for (const [name, body] of Object.entries(workers)) {
  fs.writeFileSync(
    `.artifacts/fe-refactor-audit/2026-08-09-b31r1-worker-${name}.json`,
    JSON.stringify(body, null, 2),
  )
}

const status = {
  batch: "B31r1",
  complete: false,
  status: "blocked",
  checkpoint: "18f84f5b",
  productEdits: false,
  retracted: true,
  blockers: inv.execution.retractReason,
  recommendation: inv.execution.recommendation,
  inventorySummary: inv.summary,
  atomIconTile: "unchanged",
  blockIconTile: "unchanged — still live",
  identityTile: "not landed",
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.json",
  JSON.stringify(status, null, 2),
)

const md = `# BATCH 31r1 — IconTile / IdentityTile split

**Status:** blocked (product edits retracted)  
**Checkpoint:** \`18f84f5b\`

## Verdict

Approved destination \`composites/identity/IdentityTile\` **cannot** own \`isSkeleton\` chrome under the composite gates:

- **COMPOSITE-3** — no vendor imports (\`@heroui\` Skeleton)
- **COMPOSITE-10** — composite forwards \`isSkeleton\`; atoms draw shimmer shape

\`audit:fe\` failed COMPOSITE-10 on the draft composite. Draft SB/src/stories files were **retracted**.

## Inventory (still valid)

| Bucket | Count |
|---|---|
| open-tag IconTile consumers | ${inv.summary.total} |
| block path (identity chrome) | ${inv.summary.blockPathLive} |
| unlocked migrate candidates (warnings) | 7 |
| page-folder holds | ${inv.summary.byAction["hold-page-folder"] || 0} |
| LeaderboardListCard hold | ${inv.summary.byAction["hold-leaderboard-list-card"] || 0} |
| nivo holds | ${inv.summary.byAction["hold-nivo"] || 0} |

## Recommendation

Amend filing to **\`atoms/display/IdentityTile\`** (same pattern as atom \`IconTile\`: vendor shimmer at atom tier, size map sm48/xl · md64/2xl · lg80/2xl), **or** introduce a leaf atom for square identity chrome and a thin composite that only forwards \`isSkeleton\`.

Then migrate unlocked consumers and delete \`blocks/identity/IconTile\` when imports hit zero.
`

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.md", md)

const ledgerPath = ".claude/fe/decision-ledger.json"
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"))
const id = "b31r1-identity-tile-split-2026-08-09"
const existing = ledger.decisions.find((d) => d.id === id)
const entry = {
  id,
  date: "2026-08-09",
  status: "blocked",
  summary:
    "BATCH 31r1: Retracted composites/identity/IdentityTile draft. COMPOSITE-3/10 forbid vendor shimmer in a composite; approved path conflicts with gates. Atom IconTile + blocks/identity/IconTile unchanged. Consumer migration not started.",
  reason:
    "Composite must forward isSkeleton to atoms; IdentityTile chrome+shimmer is atom work (like IconTile).",
  artifact: ".artifacts/fe-refactor-audit/2026-08-09-b31r1-status.md",
  next: "Amend to atoms/display/IdentityTile (or leaf atom + thin composite), then migrate and delete blocks/identity/IconTile",
}
if (existing) Object.assign(existing, entry)
else ledger.decisions.push(entry)
fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n")

console.log("B31r1 blocked+retracted")
