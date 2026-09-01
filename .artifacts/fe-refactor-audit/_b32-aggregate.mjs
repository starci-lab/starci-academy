/**
 * BATCH 32 — defensive aggregate across heterogeneous worker report schemas.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const AGENTS = [
  "agent-1-atoms",
  "agent-2-frames",
  "agent-3-composites",
  "agent-4-shells",
  "agent-5-shared-blocks",
  "agent-6-domain-a",
  "agent-7-domain-b",
  "agent-8-pages",
  "agent-9-app-modules",
  "agent-10-eslint-oracle",
]

const asArray = (v) => {
  if (v == null) return []
  if (Array.isArray(v)) return v
  if (typeof v === "object") {
    if (Array.isArray(v.items)) return v.items
    if (Array.isArray(v.list)) return v.list
    if (typeof v.count === "number") return [`count:${v.count}`]
    return Object.entries(v).map(([k, val]) => ({ id: k, detail: val }))
  }
  return [v]
}

const extractChanged = (w) => {
  const out = new Set()
  for (const key of ["changedFiles", "changed", "edited", "filesChanged"]) {
    for (const f of asArray(w[key])) {
      if (typeof f === "string") out.add(f.replace(/\\/g, "/"))
      else if (f?.file) out.add(String(f.file).replace(/\\/g, "/"))
      else if (f?.path) out.add(String(f.path).replace(/\\/g, "/"))
    }
  }
  // agent-3/5 nested
  for (const key of ["closed", "closures", "applied", "fixed"]) {
    for (const item of asArray(w[key])) {
      if (typeof item === "string" && (item.includes("/") || item.endsWith(".tsx") || item.endsWith(".ts"))) {
        out.add(item.replace(/\\/g, "/"))
      }
      if (item?.file) out.add(String(item.file).replace(/\\/g, "/"))
      if (item?.path) out.add(String(item.path).replace(/\\/g, "/"))
      for (const f of asArray(item?.files || item?.changed || item?.changedFiles)) {
        if (typeof f === "string") out.add(f.replace(/\\/g, "/"))
      }
    }
  }
  return [...out]
}

const extractClosed = (w) => {
  const keys = ["clustersClosed", "closed", "closures", "applied", "fixed"]
  const out = []
  for (const k of keys) {
    for (const c of asArray(w[k])) out.push(c)
  }
  return out
}

const extractHolds = (w) => {
  const out = []
  for (const k of ["holds", "held", "skipped"]) {
    for (const h of asArray(w[k])) out.push(h)
  }
  return out
}

const extractProposals = (w) => {
  const out = []
  for (const k of ["proposedContracts", "proposals", "proposeAgent10"]) {
    for (const p of asArray(w[k])) out.push(p)
  }
  return out
}

const manifests = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32-manifests.json"), "utf8"))
const baseline = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32-inventory.json"), "utf8"))

const workers = {}
const missing = []
for (const a of AGENTS) {
  const p = path.join(ART, `2026-08-10-b32-worker-${a}.json`)
  if (!fs.existsSync(p)) {
    missing.push(a)
    continue
  }
  workers[a] = JSON.parse(fs.readFileSync(p, "utf8"))
}

const changed = new Set()
const closed = []
const holds = []
const proposals = []
const perAgent = {}

for (const [name, w] of Object.entries(workers)) {
  const files = extractChanged(w)
  for (const f of files) changed.add(f)
  const c = extractClosed(w)
  const h = extractHolds(w)
  const p = extractProposals(w)
  for (const x of c) closed.push({ agent: name, item: x })
  for (const x of h) holds.push({ agent: name, item: x })
  for (const x of p) proposals.push({ agent: name, item: x })
  perAgent[name] = {
    changedCount: files.length,
    closedCount: c.length,
    holdCount: h.length,
    proposalCount: p.length,
    summary: w.summary || w.status || w.testResult || null,
    eslint: w.eslint || w.raw || w.rules || w.focusDelta || w.before || w.after || null,
  }
}

const ownedBy = new Map()
for (const [agent, files] of Object.entries(manifests.agents)) {
  for (const f of files) ownedBy.set(f.replace(/\\/g, "/"), agent)
}
const ownershipViolations = []
for (const f of changed) {
  const owner = ownedBy.get(f)
  if (!owner && !f.startsWith("plugins/eslint/") && !f.includes("/test-runner/") && !f.startsWith(".artifacts/")) {
    // twin paths sometimes reported without being in ranked manifests — flag soft
    ownershipViolations.push({ file: f, reason: "changed but not in frozen ranked manifest (may be SB/src twin of owned file)" })
  }
}

// Collect changed TS/TSX/MJS that exist for gate chunking
const gateFiles = [...changed].filter((f) => {
  const abs = path.join(ROOT, f)
  return fs.existsSync(abs) && /\.(tsx?|mjs|cjs|js)$/.test(f)
})

const status = {
  batch: "B32",
  title: "Topology-driven ESLint closure",
  checkpoint: "9e86cbdf",
  committed: false,
  generatedAt: new Date().toISOString(),
  workersPresent: Object.keys(workers),
  workersMissing: missing,
  baselineTelemetry: {
    rawMessages: baseline.telemetry.rawMessages,
    affectedFiles: baseline.telemetry.affectedFiles,
    errors: baseline.telemetry.errors,
    starciMessages: baseline.telemetry.starciMessages,
    clusters: baseline.clusters.total,
    actionableClusters: baseline.clusters.actionable,
  },
  perAgent,
  changedFiles: [...changed].sort(),
  changedCount: changed.size,
  gateCandidateFiles: gateFiles,
  clustersClosedClaimed: closed.length,
  holdsClaimed: holds.length,
  proposedContracts: proposals,
  overlapOk: manifests.overlapOk,
  ownershipViolations,
  notes: [
    "Worker report schemas varied; counts are best-effort extractions.",
    "Ownership violations may include legitimate SB/src twins of ranked files.",
    "Raw warning reduction is not claimed as architectural closure without cluster proof.",
  ],
}

fs.writeFileSync(path.join(ART, "2026-08-10-b32-status.json"), JSON.stringify(status, null, 2))

const md = [
  "# B32 status",
  "",
  `Checkpoint: \`9e86cbdf\` · Committed: **no**`,
  `Workers: **${status.workersPresent.length}/10** · Missing: ${missing.join(", ") || "none"}`,
  `Changed files (extracted): **${status.changedCount}**`,
  `Closed claims (heterogeneous): **${closed.length}** · Holds: **${holds.length}** · Proposals: **${proposals.length}**`,
  `Manifest overlap: **${manifests.overlapOk ? "PASS" : "FAIL"}**`,
  "",
  "## Per-agent",
  "",
  "| Agent | Changed | Closed claims | Holds |",
  "|---|---:|---:|---:|",
  ...AGENTS.map((a) => {
    const p = perAgent[a] || { changedCount: 0, closedCount: 0, holdCount: 0 }
    return `| ${a} | ${p.changedCount} | ${p.closedCount} | ${p.holdCount} |`
  }),
  "",
  "## Changed files",
  "",
  ...[...changed].sort().map((f) => `- \`${f}\``),
  "",
  "## Proposed contracts",
  "",
  ...(proposals.length
    ? proposals.slice(0, 40).map((p) => `- **${p.agent}**: \`${JSON.stringify(p.item).slice(0, 200)}\``)
    : ["_none_"]),
  "",
]

fs.writeFileSync(path.join(ART, "2026-08-10-b32-status.md"), md.join("\n"))
console.log(
  JSON.stringify(
    {
      missing,
      changed: changed.size,
      gateFiles: gateFiles.length,
      closedClaims: closed.length,
      holds: holds.length,
      proposals: proposals.length,
      ownershipViolations: ownershipViolations.length,
    },
    null,
    2,
  ),
)
