/**
 * Classify deferred blocks-layout manifest for clear safe burns.
 * Evidence only — no product edits.
 */
import fs from "node:fs"

const m = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/2026-08-08-deferred-manifest-blocks-layout.json",
    "utf8",
  ),
)

const IDENTITY_CAPABLE = new Set([
  "Box",
  "Cluster",
  "Container",
  "Flex",
  "Grid",
  "PinnedTrack",
  "RailShell",
  "ResponsiveCluster",
  "ResponsiveRow",
  "ScrollArea",
  "Split",
  "SplitWorkspace",
  "Stack",
  "StackH",
  "StackV",
  "Stage",
  "SurfaceCard",
  "SurfaceCardNested",
  "SurfaceCardPressableGroup",
  "SurfaceCardList",
  "SurfaceCardAccordion",
  "SurfaceCardCrossList",
  "SurfaceCardPlaceholder",
  "SurfaceCardSelectableGroup",
  "Form",
  "FormActions",
  "FormSection",
  "EmptyState",
  "ModalShell",
  "DrawerShell",
  "List",
  "AuthorByline",
  "KeyValueList",
  "KeyValueRow",
  "Page",
])

const ASYNC_NO_IDENTITY = new Set(["AsyncContent", "AsyncContentEmpty", "AsyncContentError"])

const findReturnRoots = (src) => {
  const roots = []
  const re =
    /return\s*(?:\(|)\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\/\/[^\n]*\n\s*)*<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
  let match
  while ((match = re.exec(src))) roots.push({ tag: match[1], index: match.index })
  const re2 = /return\s+<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
  while ((match = re2.exec(src))) roots.push({ tag: match[1], index: match.index })
  const seen = new Set()
  return roots.filter((r) => {
    if (seen.has(r.index)) return false
    seen.add(r.index)
    return true
  })
}

const classifyIdentity = (rel, src) => {
  if (/\bidentity=\{/.test(src)) return { ok: false, reason: "already-has-identity" }
  if (/return\s*(?:\(|)\s*<>/.test(src) && !/return\s*(?:\(|)\s*<[A-Za-z]/.test(src)) {
    return { ok: false, reason: "fragment-root" }
  }
  const roots = findReturnRoots(src)
  if (!roots.length) return { ok: false, reason: "no-return-jsx-found" }
  const hostRoots = roots.filter((r) => /^[a-z]/.test(r.tag))
  const compRoots = roots.filter((r) => /^[A-Z]/.test(r.tag))
  if (!compRoots.length) return { ok: false, reason: "host-element-root", tags: hostRoots.map((r) => r.tag) }
  if (hostRoots.length) {
    return { ok: false, reason: "mixed-host-and-component-roots", tags: roots.map((r) => r.tag) }
  }
  const tags = [...new Set(compRoots.map((r) => r.tag))]
  if (tags.some((t) => ASYNC_NO_IDENTITY.has(t))) return { ok: false, reason: "AsyncContent-root", tags }
  const capable = tags.filter((t) => IDENTITY_CAPABLE.has(t))
  const incapable = tags.filter((t) => !IDENTITY_CAPABLE.has(t))
  if (capable.length === 1 && incapable.length === 0 && tags.length === 1) {
    return { ok: true, rootTag: tags[0] }
  }
  return {
    ok: false,
    reason: incapable.length ? "incapable-or-mixed-root" : "multi-capable-roots",
    tags,
  }
}

const out = []
for (const f of m.files) {
  const src = fs.readFileSync(f.path, "utf8")
  const id = classifyIdentity(f.path, src)
  const mech = (f.messages || [])
    .filter((x) => x.classification === "safe-mechanical")
    .map((x) => `${x.rule}@${x.line}`)
  const holds = (f.messages || [])
    .filter((x) =>
      ["ambiguous", "semantic-hold", "vendor-hold", "teacher-hold", "locked-path"].includes(
        x.classification,
      ),
    )
    .map((x) => x.rule)
  const heroui = /from ["']@heroui\/react["']/.test(src)
  const herouiImports = [...src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']@heroui\/react["']/g)].map(
    (x) => x[1].replace(/\s+/g, " ").trim(),
  )
  const withClassNames = /WithClassNames</.test(src)
  const cnCount = (src.match(/\bcn\(/g) || []).length
  const divClass = (src.match(/<div[^>]*className=/g) || []).length
  out.push({
    path: f.path,
    idOk: id.ok,
    idReason: id.reason,
    idRoot: id.rootTag || null,
    idTags: id.tags || null,
    mech,
    holds: [...new Set(holds)],
    heroui,
    herouiImports,
    withClassNames,
    cnCount,
    divClass,
    cand: f.candidateCount,
  })
}

const clearId = out.filter((x) => x.idOk)
const mechOnly = out.filter((x) => x.mech.length)
console.log("CLEAR IDENTITY", clearId.length)
for (const x of clearId) console.log(" ", x.path, "->", x.idRoot)
console.log("MECHANICAL", mechOnly.length)
for (const x of mechOnly) console.log(" ", x.path, x.mech)
console.log(
  "HOST ROOT (identity hold)",
  out.filter((x) => x.idReason === "host-element-root").length,
)
console.log(
  "INCAPABLE ROOT",
  out.filter((x) => x.idReason === "incapable-or-mixed-root").length,
)
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/_blocks-layout-deferred-classify.json",
  JSON.stringify(out, null, 2),
)
console.log("wrote _blocks-layout-deferred-classify.json")
