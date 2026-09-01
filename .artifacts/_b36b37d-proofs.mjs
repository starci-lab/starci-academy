/**
 * B36+B37d proofs: topology, TrendingContents shape, API retention, changed-file ESLint.
 */
import { execSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const OUT = join(ROOT, ".artifacts/fe-refactor-audit")
const CHECKPOINT = "84b92cd77"
const manifest = JSON.parse(readFileSync(join(OUT, "_b36-b37d-commit-manifest.json"), "utf8"))
const beforeRep = JSON.parse(readFileSync(join(OUT, "2026-08-10-b36-b37d-eslint-before.json"), "utf8"))
const afterRep = JSON.parse(readFileSync(join(OUT, "2026-08-10-b36-b37d-eslint-after.json"), "utf8"))

const norm = (p) => p.replace(/\\/g, "/").replace(/^D:\/Repositories\/starci-academy\//i, "")

function indexReport(rep, rootPrefix) {
  const map = new Map()
  for (const row of rep) {
    let fp = norm(row.filePath)
    if (rootPrefix && fp.includes(rootPrefix)) {
      fp = fp.split(rootPrefix)[1] || fp
    }
    // strip absolute prefixes
    const idx = fp.indexOf("src/")
    const idx2 = fp.indexOf(".storybook/")
    const cut = idx >= 0 ? idx : idx2 >= 0 ? idx2 : -1
    if (cut >= 0) fp = fp.slice(cut)
    const key = fp.replace(/\\/g, "/")
    const msgs = (row.messages || []).map((m) => ({
      ruleId: m.ruleId,
      line: m.line,
      column: m.column,
      severity: m.severity,
      message: m.message,
    }))
    map.set(key, msgs)
  }
  return map
}

const beforeMap = indexReport(beforeRep, "_b36b37d-wt/")
const afterMap = indexReport(afterRep, "starci-academy/")

// Also try basename path matching for worktree abs paths
function msgsFor(map, file) {
  if (map.has(file)) return map.get(file)
  for (const [k, v] of map) {
    if (k.endsWith(file) || k.replace(/\\/g, "/").endsWith(file)) return v
  }
  return []
}

/** Map extracted Auth panel paths back to pre-B36 AuthenticationModal sources. */
function ancestorSources(file) {
  const sources = [file]
  if (file.startsWith("src/components/blocks/auth/AuthenticationPanel/")) {
    sources.push(
      file.replace(
        "src/components/blocks/auth/AuthenticationPanel/",
        "src/components/overlays/modals/AuthenticationModal/",
      ),
    )
  }
  if (file === "src/components/pages/LoginPage/component.tsx") {
    sources.push("src/components/pages/LoginPage/index.tsx")
  }
  return sources
}

const introduced = []
const closed = []
const preexisting = []
const relocated = []
for (const file of manifest.files) {
  if (!existsSync(join(ROOT, file))) continue // deleted
  const ancestors = ancestorSources(file)
  const b = ancestors.flatMap((src) => msgsFor(beforeMap, src))
  const a = msgsFor(afterMap, file)
  const bKeys = new Set(b.map((m) => `${m.ruleId}@${m.line}:${m.column}`))
  const aKeys = new Set(a.map((m) => `${m.ruleId}@${m.line}:${m.column}`))
  for (const m of a) {
    const k = `${m.ruleId}@${m.line}:${m.column}`
    if (!bKeys.has(k)) {
      const soft = b.some((x) => x.ruleId === m.ruleId && x.message === m.message)
      if (soft) {
        const fromModal = ancestors.some((src) => src.includes("AuthenticationModal"))
        if (fromModal && file.includes("AuthenticationPanel")) {
          relocated.push({ file, ...m, note: "relocated from AuthenticationModal" })
        } else {
          preexisting.push({ file, ...m, note: "pre-existing soft-match" })
        }
      } else if (!msgsFor(beforeMap, file).length && b.length) {
        // brand-new path but ancestor had same rule noise
        const softAncestor = b.some((x) => x.ruleId === m.ruleId)
        if (softAncestor) relocated.push({ file, ...m, note: "relocated-debt soft rule" })
        else introduced.push({ file, ...m })
      } else {
        introduced.push({ file, ...m })
      }
    } else preexisting.push({ file, ...m })
  }
  for (const m of msgsFor(beforeMap, file)) {
    const k = `${m.ruleId}@${m.line}:${m.column}`
    if (!aKeys.has(k)) {
      const soft = a.some((x) => x.ruleId === m.ruleId && x.message === m.message)
      if (!soft) closed.push({ file, ...m })
    }
  }
}

const introducedErrors = introduced.filter((m) => m.severity === 2)
const introducedWarnings = introduced.filter((m) => m.severity === 1)

// Topology inventory
function countToken(re) {
  const roots = ["src", ".storybook"]
  let n = 0
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name)
      if (e.isDirectory()) {
        if (["node_modules", ".git", ".next", "dist"].includes(e.name)) continue
        walk(p)
      } else if (/\.(tsx?|jsx?)$/.test(e.name)) {
        try {
          if (re.test(readFileSync(p, "utf8"))) n++
        } catch {
          /* empty */
        }
      }
    }
  }
  roots.forEach(walk)
  return n
}

const topology = {
  beforeExpected: { LabeledCard: 97, frameless: 54, SurfaceListCard: 87, SurfaceCardList: 111 },
  afterMeasured: {
    LabeledCard: countToken(/\bLabeledCard\b/),
    frameless: countToken(/\bframeless\b/),
    SurfaceListCard: countToken(/\bSurfaceListCard\b/),
    SurfaceCardList: countToken(/\bSurfaceCardList\b|\bSurfaceCard\.List\b/),
  },
}

const trendingComp = readFileSync(
  "src/components/pages/DashboardPage/TrendingContents/component.tsx",
  "utf8",
)
const trendingIndex = readFileSync(
  "src/components/pages/DashboardPage/TrendingContents/index.tsx",
  "utf8",
)
const trendingProof = {
  hasTrendingContentsSurface: /TrendingContentsSurface/.test(trendingComp + trendingIndex),
  hasTrendingRowImport: /from ["']\.\/TrendingRow/.test(trendingComp + trendingIndex),
  trendingRowExists: existsSync("src/components/pages/DashboardPage/TrendingContents/TrendingRow"),
  skeletonFolderExists: existsSync(
    "src/components/pages/DashboardPage/TrendingContents/TrendingContentsSkeleton",
  ),
  componentMountsSurfaceCardList: /<SurfaceCardList[\s>]/.test(trendingComp),
  noLabeledCardJsx: !/<LabeledCard[\s>]/.test(trendingComp),
  noSurfaceListCardJsx: !/<SurfaceListCard[\s>]/.test(trendingComp),
  identityPresent: /component:\s*["']TrendingContents["']/.test(trendingComp),
}

// API retention
const labeledCard = readFileSync("src/components/blocks/cards/LabeledCard/index.tsx", "utf8")
const surfaceList = readFileSync("src/components/blocks/cards/SurfaceListCard/index.tsx", "utf8")
const apiProof = {
  labeledCardFramelessStillPresent: /\bframeless\b/.test(labeledCard),
  surfaceListCardModulePresent: existsSync("src/components/blocks/cards/SurfaceListCard/index.tsx"),
  surfaceListCardExports: /\bexport\b/.test(surfaceList),
}

const residual = JSON.parse(
  readFileSync(join(OUT, "2026-08-10-b36-b37c-redundant-labeled-surface.json"), "utf8"),
)

const eslintChanged = {
  introducedErrors: introducedErrors.length,
  introducedWarnings: introducedWarnings.length,
  closedCount: closed.length,
  preexistingOnManifest: preexisting.length,
  relocatedDebt: relocated.length,
  introducedSample: introduced.slice(0, 40),
  relocatedSample: relocated.slice(0, 20),
  pass: introducedErrors.length === 0 && introducedWarnings.length === 0,
}

writeFileSync(
  join(OUT, "2026-08-10-b36-b37d-proofs.json"),
  JSON.stringify(
    {
      topology,
      trendingProof,
      apiProof,
      residualLabeledSurface: residual,
      eslintChangedFileCertification: eslintChanged,
      closedSample: closed.slice(0, 30),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      topology: topology.afterMeasured,
      trendingProof,
      apiProof,
      eslintChanged: {
        introducedErrors: eslintChanged.introducedErrors,
        introducedWarnings: eslintChanged.introducedWarnings,
        closedCount: eslintChanged.closedCount,
        pass: eslintChanged.pass,
      },
      introducedSample: introduced.slice(0, 10),
    },
    null,
    2,
  ),
)
