/**
 * BATCH 28 — consumer value scan (file-walk; Windows-safe).
 * Starts from B27 liveApiProposals + classified consumer hints.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const status = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b27-status.json"), "utf8"))
const classified = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b27-classified.json"), "utf8"))

const SKIP_DIR = new Set(["node_modules", ".git", ".next", "dist", "coverage", ".artifacts", "out"])

function walk(dir, acc = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".storybook") continue
    if (SKIP_DIR.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p)
  }
  return acc
}

function extractJsxOpens(src, component) {
  const hits = []
  const re = new RegExp(`<${component}\\b`, "g")
  let m
  while ((m = re.exec(src))) {
    const start = m.index
    let i = start + m[0].length
    let depth = 0
    let quote = null
    let tag = m[0]
    for (; i < src.length; i++) {
      const ch = src[i]
      tag += ch
      if (quote) {
        if (ch === "\\" && quote !== "`") {
          if (i + 1 < src.length) tag += src[++i]
          continue
        }
        if (ch === quote) quote = null
        continue
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch
        continue
      }
      if (ch === "{") {
        depth++
        continue
      }
      if (ch === "}") {
        depth = Math.max(0, depth - 1)
        continue
      }
      if (depth === 0 && ch === ">") break
    }
    hits.push({ start, tag, line: src.slice(0, start).split(/\n/).length })
  }
  return hits
}

function propValue(tag, prop) {
  const named = new RegExp(`\\b${prop}\\s*=\\s*`)
  const m = named.exec(tag)
  if (!m) return null
  let i = m.index + m[0].length
  if (tag[i] === '"' || tag[i] === "'") {
    const q = tag[i]
    let j = i + 1
    let out = ""
    while (j < tag.length && tag[j] !== q) out += tag[j++]
    return { kind: "string", value: out }
  }
  if (tag[i] === "{") {
    let depth = 0
    let j = i
    for (; j < tag.length; j++) {
      if (tag[j] === "{") depth++
      else if (tag[j] === "}") {
        depth--
        if (depth === 0) {
          j++
          break
        }
      }
    }
    return { kind: "expr", value: tag.slice(i + 1, j - 1).trim() }
  }
  return null
}

function normalizeExpr(value) {
  let v = String(value || "").replace(/\s+/g, " ").trim()
  // unwrap cn("a", "b") / cn(["a"], x)
  const cn = /^cn\((.*)\)$/s.exec(v)
  if (cn) v = cn[1]
  // array literal
  if (v.startsWith("[") && v.endsWith("]")) {
    const parts = [...v.matchAll(/["'`]([^"'`]+)["'`]/g)].map((m) => m[1])
    if (parts.length) return parts.join(" ")
  }
  // string literals joined
  const strs = [...v.matchAll(/["'`]([^"'`]+)["'`]/g)].map((m) => m[1])
  if (strs.length && !/[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/.test(v.replace(/^cn/, ""))) {
    return strs.join(" ")
  }
  return v
}

function classifyValue(raw) {
  const v = normalizeExpr(raw)
  const tokens = v.split(/\s+/).filter(Boolean)
  if (!tokens.length) return { ownership: "empty", tokens: [] }

  const placementRe =
    /^(w-|min-w-|max-w-|h-|min-h-|max-h-|m[trblxyse]?-| -?m[trblxyse]?-|flex-1|flex-none|grow|shrink|basis-|col-span|row-span|order-|self-|justify-|items-|place-|sticky|fixed|absolute|relative|inset-|top-|left-|right-|bottom-|z-|@app-|hidden|block|inline|sr-only|pointer-events-|overflow-|truncate$)/
  // also bare flex/grid participation
  const placementExact = new Set([
    "flex",
    "flex-1",
    "flex-none",
    "grow",
    "shrink",
    "min-w-0",
    "w-full",
    "h-full",
    "hidden",
    "contents",
  ])
  const intrinsicRe =
    /^(size-|text-|font-|bg-|border-|rounded-|shadow-|opacity-|ring-|fill-|stroke-|object-|aspect-|animate-|transition-|scale-|rotate-|from-|to-|via-|underline|line-clamp-|leading-|tracking-|whitespace-|break-|decoration-|gap-|p[trblxyse]?-|space-[xy]-)/

  const kinds = new Set()
  const tokensOut = []
  for (const t of tokens) {
    tokensOut.push(t)
    if (placementExact.has(t) || placementRe.test(t) || t.includes("@app-")) kinds.add("parent-placement")
    else if (intrinsicRe.test(t)) kinds.add("intrinsic")
    else if (/^[a-zA-Z_$]/.test(t) && !t.includes("-")) kinds.add("dynamic")
    else kinds.add("ambiguous")
  }
  let ownership = "ambiguous"
  if (kinds.size === 1) ownership = [...kinds][0]
  else if (kinds.has("dynamic")) ownership = "dynamic"
  else if (kinds.has("ambiguous")) ownership = "ambiguous"
  else ownership = "mixed"
  return { ownership, tokens: tokensOut, normalized: v }
}

function workerFor(proposal) {
  const f = proposal.file.replace(/\\/g, "/")
  const name = proposal.component
  if (name === "FloatingActionButton") {
    if (f.includes("/composites/") || f.includes(".storybook/")) return "composite-twins"
    return "buttons-actions"
  }
  if (name === "CodeToHtml" || name === "MermaidDiagram") {
    if (f.includes("/blocks/rendering/")) return "media-rendering"
    return "composite-twins"
  }
  if (name === "ButtonGroup") return "composite-twins"
  if (name === "CollapsibleSidebar") return "rails"
  const map = {
    ElementCloseButton: "buttons-actions",
    AddToCartButton: "buttons-actions",
    FollowButton: "buttons-actions",
    AiRewriteButton: "buttons-actions",
    InfoTooltip: "buttons-actions",
    SectionCard: "cards-commerce",
    PhaseScarcityNote: "cards-commerce",
    TierCardBase: "cards-commerce",
    LeaderboardListCard: "cards-commerce",
    CommentComposer: "community-feed",
    Discussion: "community-feed",
    Composer: "community-feed",
    BadgeImage: "identity-svg",
    BrandLockup: "identity-svg",
    BrandLogo: "identity-svg",
    IconTile: "identity-svg",
    GithubIcon: "identity-svg",
    GoogleIcon: "identity-svg",
    LogoMark: "identity-svg",
    TierLevelIcon: "identity-svg",
    RankDeltaCaret: "identity-svg",
    AmbientBackground: "layout-shells",
    PageHeader: "layout-shells",
    StickyBottomBar: "layout-shells",
    ChatToolResult: "learn-content",
    ContentMap: "learn-content",
    LeaderboardCategoryRail: "learn-content",
    MilestoneOutline: "learn-content",
    PlaygroundRagWorkspace: "learn-content",
    CodeConsole: "learn-content",
    LabeledList: "lists-navigation",
    ListRow: "lists-navigation",
    BackLink: "lists-navigation",
    SidebarNavItem: "lists-navigation",
    TabsCard: "lists-navigation",
    MpegDash: "media-rendering",
    Standard: "media-rendering",
    Youtube: "media-rendering",
    OutlineRail: "rails",
    ArchitectureRail: "rails",
    PracticeRail: "rails",
    MetricsInline: "course-pages",
    CourseHero: "course-pages",
    CourseMobileEnrollBar: "course-pages",
    CoursePricingRail: "course-pages",
    MockInterviewWorkspace: "hard-holds",
    CvPdfPreview: "hard-holds",
  }
  return map[name] || "hard-holds"
}

console.log("Walking source trees…")
const files = [
  ...walk(path.join(ROOT, "src")),
  ...walk(path.join(ROOT, ".storybook")),
]
console.log("files", files.length)

const fileCache = new Map()
function read(file) {
  if (!fileCache.has(file)) fileCache.set(file, fs.readFileSync(file, "utf8"))
  return fileCache.get(file)
}

const proposals = [...status.liveApiProposals]
// ensure CvPdfPreview
if (!proposals.some((p) => p.component === "CvPdfPreview")) {
  proposals.push({
    component: "CvPdfPreview",
    file: "src/components/blocks/cv/CvBlocksWorkspace/CvPdfPreview/index.tsx",
  })
}

const results = []
for (const p of proposals) {
  const component = p.component
  const consumers = []
  for (const abs of files) {
    const src = read(abs)
    if (!src.includes(`<${component}`)) continue
    const rel = path.relative(ROOT, abs).replace(/\\/g, "/")
    for (const open of extractJsxOpens(src, component)) {
      const className = propValue(open.tag, "className")
      const classNames = propValue(open.tag, "classNames")
      if (!className && !classNames) continue
      const raw = className || classNames
      const classifiedVal = classifyValue(raw.value)
      consumers.push({
        file: rel,
        line: open.line,
        prop: className ? "className" : "classNames",
        kind: raw.kind,
        value: raw.value,
        normalized: classifiedVal.normalized,
        tokens: classifiedVal.tokens,
        ownership: classifiedVal.ownership,
        snippet: open.tag.replace(/\s+/g, " ").slice(0, 220),
      })
    }
  }

  const valueSet = [...new Set(consumers.map((c) => c.normalized))]
  const ownerships = [...new Set(consumers.map((c) => c.ownership))]
  const allTokens = [...new Set(consumers.flatMap((c) => c.tokens))]

  // merge classified evidence if scan missed
  const fromClassified = (classified.proposals || []).find(
    (x) => x.component === component && x.file.replace(/\\/g, "/") === p.file.replace(/\\/g, "/"),
  )

  results.push({
    component,
    file: p.file.replace(/\\/g, "/"),
    worker: workerFor(p),
    consumerCount: consumers.length,
    consumers,
    valueSet,
    ownerships,
    allTokens,
    classifiedHint: fromClassified
      ? {
          classNameCount: fromClassified.consumers?.classNameCount,
          classNamesCount: fromClassified.consumers?.classNamesCount,
          sample: [
            ...(fromClassified.consumers?.className || []),
            ...(fromClassified.consumers?.classNames || []),
          ].slice(0, 5),
        }
      : null,
  })
}

fs.writeFileSync(path.join(ART, "2026-08-09-b28-consumer-scan.json"), JSON.stringify(results, null, 2) + "\n")

const applyCandidates = results.filter((r) => {
  if (r.consumerCount === 0) return false
  if (r.ownerships.some((o) => o === "dynamic" || o === "ambiguous" || o === "mixed")) return false
  // finite: small value set OR single ownership axis with small token vocabulary
  const uniqueNorm = r.valueSet.filter((v) => v && !v.includes("("))
  return uniqueNorm.length > 0 && uniqueNorm.length <= 6
})

console.log(
  JSON.stringify(
    {
      scanned: results.length,
      withConsumers: results.filter((r) => r.consumerCount > 0).length,
      applyCandidates: applyCandidates.map((r) => ({
        c: r.component,
        w: r.worker,
        n: r.consumerCount,
        own: r.ownerships,
        values: r.valueSet,
      })),
      zeroConsumer: results.filter((r) => r.consumerCount === 0).map((r) => r.component + "@" + r.file),
      sampleNonEmpty: results
        .filter((r) => r.consumerCount > 0)
        .slice(0, 12)
        .map((r) => ({ c: r.component, n: r.consumerCount, own: r.ownerships, v: r.valueSet })),
    },
    null,
    2,
  ),
)
