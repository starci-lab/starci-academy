/**
 * blocks-domain safe authoring burn — mechanical only, ~40-file cap.
 * Writes status to 2026-08-08-worker-blocks-domain.json
 */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { hasEmoji, VN_LETTER } from "../../plugins/eslint/authoring.mjs"

const ROOT = process.cwd()
const batch = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/_blocks-domain-burn-batch.json",
    "utf8",
  ),
)
const eslintRaw = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/_blocks-domain-eslint-batch.json",
    "utf8",
  ).replace(/^\uFEFF/, ""),
)

const SAFE = new Set([
  "starci-fe/require-export-jsdoc",
  "starci-fe/prefer-arrow-export",
  "starci-fe/handler-on-prefix",
  "starci-fe/no-inline-parameter-type",
  "starci-fe/no-emoji-in-source",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/require-identity-root",
  "starci-fe/no-inline-skeleton-branch",
  "starci-fe/no-runtime-namespace",
])

const PRODUCT_EMOJI = new Set([
  "src/components/blocks/community/Discussion/constants.ts",
  "src/components/blocks/feed/ReactionBar/index.tsx",
  "src/components/blocks/learn/ReactionButton/types.ts",
])

const IDENTITY_CAPABLE = new Set([
  "Box", "Cluster", "Container", "Flex", "Grid", "PinnedTrack", "RailShell",
  "ResponsiveCluster", "ResponsiveRow", "ScrollArea", "Split", "SplitWorkspace",
  "Stack", "StackH", "StackV", "Stage",
  "SurfaceCard", "SurfaceCardNested", "SurfaceCardPressableGroup", "SurfaceCardList",
  "SurfaceCardAccordion", "SurfaceCardCrossList", "SurfaceCardPlaceholder",
  "SurfaceCardSelectableGroup",
  "Form", "FormActions", "FormSection",
  "EmptyState", "ModalShell", "DrawerShell",
  "List", "AuthorByline", "KeyValueList", "KeyValueRow",
  "Page",
])

const ASYNC_NO_IDENTITY = new Set(["AsyncContent", "AsyncContentEmpty", "AsyncContentError"])

const norm = (p) => p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")

const hitsByFile = new Map()
for (const f of eslintRaw) {
  const rel = norm(f.filePath)
  const hits = (f.messages || []).filter((m) => SAFE.has(m.ruleId))
  if (hits.length) hitsByFile.set(rel, hits)
}

const scrubEmoji = (text) => {
  let out = text
  const map = [
    [/↔/g, "<->"],
    [/↕/g, "<->"],
    [/→/g, "->"],
    [/←/g, "<-"],
    [/⇒/g, "=>"],
    [/⭐/g, "*"],
    [/★/g, "*"],
    [/✨/g, "*"],
    [/⏳/g, "(pending)"],
    [/▶/g, ">"],
    [/©/g, "(c)"],
    [/⚠/g, "WARNING"],
    [/⚠️/g, "WARNING"],
    [/✅/g, "[ok]"],
    [/❌/g, "[x]"],
    [/⛔/g, "NO"],
    [/🔒/g, "(locked)"],
    [/✓/g, "[ok]"],
    [/✔/g, "[ok]"],
    [/🔥/g, ""],
    [/💡/g, ""],
    [/🎉/g, ""],
    [/🚀/g, ""],
    [/📌/g, ""],
    [/👉/g, "->"],
  ]
  for (const [re, rep] of map) out = out.replace(re, rep)
  out = out.replace(/\p{Extended_Pictographic}/gu, "")
  out = out.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
  out = out.replace(/[^\S\n]{2,}/g, " ")
  return out
}

const VN_PHRASES = [
  ["Đã kết bạn", "Already friends"],
  ["Kết bạn", "Add friend"],
  ["Hạng Vàng", "Gold rank"],
  ["Hỏi nhanh", "Quick quiz"],
  ["Học thẻ", "Flashcard study"],
  ["Ôn thẻ đến hạn", "Due-card review"],
  ["ôn thẻ đến hạn", "due-card review"],
  ["Ôn tập", "Review"],
  ["Học thử", "Trial learn"],
  ["Giao diện", "Appearance"],
  ["Tải PDF", "Download PDF"],
  ["Đang tải", "Loading"],
  ["Đã nộp", "Submitted"],
  ["Quay lại bài học", "Back to lesson"],
  ["Quay lại", "Back"],
  ["cần điểm CV", "requires CV score"],
  ["chỉ state", "state only"],
  ["đính chính", "clarification"],
  ["thầy chốt", "teacher ruling"],
  ["thầy:", "teacher:"],
  ["(thầy", "(teacher"],
  ["thầy ", "teacher "],
  ["giao diện y chang", "same UI"],
  ["Đề bài / Nộp bài", "Problem / Submit"],
  ["Câu N", "Question N"],
  ["50 câu", "50 questions"],
  ["[tháng]", "[month]"],
  ["tháng", "month"],
  ["LẪN", "AND"],
  ["CÙNG", "SAME"],
  ["KHÔNG", "does NOT"],
  ["hiện ở", "renders on"],
  ["Mọi trang khác", "Every other page"],
  ["có footer", "have a footer"],
  ["pill nổi", "raised pill"],
  ["bỏ padding-6 ở đây này", "drop padding-6 here"],
  ["bỏ deck đi, only session thôi", "drop the deck route; session only"],
  ["là bản ungated của", "is the ungated version of the"],
  ["user đã login xem ở đây", "signed-in users see it here"],
  ["skin-shape đậm", "heavy skin-shape"],
  ["Vì sao dùng composite này", "Why this composite"],
  ["Cấu thành (block + primitive)", "Composition (block + primitive)"],
]

const scrubVietnamese = (text) => {
  let out = text
  for (const [vi, en] of VN_PHRASES) out = out.replaceAll(vi, en)
  return out
}

const findReturnRoots = (src) => {
  const roots = []
  const re =
    /return\s*(?:\(|)\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\/\/[^\n]*\n\s*)*<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
  let m
  while ((m = re.exec(src))) roots.push({ tag: m[1], index: m.index })
  const re2 = /return\s+<([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*)/g
  while ((m = re2.exec(src))) roots.push({ tag: m[1], index: m.index })
  const seen = new Set()
  return roots.filter((r) => {
    if (seen.has(r.index)) return false
    seen.add(r.index)
    return true
  })
}

const tierFromPath = (file) => {
  if (file.includes("/components/pages/")) return "page"
  if (file.includes("/components/layouts/")) return "layout"
  if (file.includes("/components/overlays/")) return "overlay"
  if (file.includes("/components/blocks/")) return "block"
  if (file.includes("/.storybook/components/")) return "block"
  return null
}

const componentFromPath = (file) => {
  const parts = file.replace(/\\/g, "/").split("/")
  const base = parts[parts.length - 1]
  if (base === "index.tsx" || base === "component.tsx") return parts[parts.length - 2]
  return base.replace(/\.tsx$/, "")
}

const classifyIdentity = (rel, src) => {
  if (/\bidentity=\{/.test(src)) return { ok: false, reason: "already-has-identity" }
  if (/return\s*(?:\(|)\s*<>/.test(src) && !/return\s*(?:\(|)\s*<[A-Za-z]/.test(src)) {
    return { ok: false, reason: "fragment-root" }
  }
  const tier = tierFromPath(rel)
  const component = componentFromPath(rel)
  if (!tier) return { ok: false, reason: "unknown-tier-path" }
  const roots = findReturnRoots(src)
  if (!roots.length) return { ok: false, reason: "no-return-jsx-found" }
  const hostRoots = roots.filter((r) => /^[a-z]/.test(r.tag))
  const compRoots = roots.filter((r) => /^[A-Z]/.test(r.tag))
  if (!compRoots.length) return { ok: false, reason: "host-element-root", tags: hostRoots.map((r) => r.tag) }
  if (hostRoots.length) return { ok: false, reason: "mixed-host-and-component-roots", tags: roots.map((r) => r.tag) }
  const tags = [...new Set(compRoots.map((r) => r.tag))]
  if (tags.some((t) => ASYNC_NO_IDENTITY.has(t))) return { ok: false, reason: "AsyncContent-root", tags }
  const capable = tags.filter((t) => IDENTITY_CAPABLE.has(t))
  const incapable = tags.filter((t) => !IDENTITY_CAPABLE.has(t))
  if (capable.length === 1 && incapable.length === 0 && tags.length === 1) {
    return { ok: true, tier, component, rootTag: tags[0] }
  }
  return {
    ok: false,
    reason: incapable.length ? "incapable-or-mixed-root" : "multi-capable-roots",
    tags,
  }
}

const applyIdentity = (src, { tier, component, rootTag }) => {
  // Insert identity prop on first occurrence of <RootTag that is a return root and lacks identity=
  // Conservative: add to every opening <RootTag ...> that does not already have identity=
  const re = new RegExp(`<(${rootTag})(\\s|>)`, "g")
  let out = ""
  let last = 0
  let m
  let changed = false
  while ((m = re.exec(src))) {
    const start = m.index
    // find end of opening tag
    let i = start + 1
    let quote = null
    while (i < src.length) {
      const c = src[i]
      if (quote) {
        if (c === quote) quote = null
      } else if (c === '"' || c === "'" || c === "`") {
        quote = c
      } else if (c === ">") {
        break
      }
      i++
    }
    const open = src.slice(start, i)
    if (/\bidentity=\{/.test(open)) {
      continue
    }
    // Only mutate tags that appear after a return — cheap check in preceding 200 chars
    const prev = src.slice(Math.max(0, start - 200), start)
    if (!/\breturn\b/.test(prev) && !/=>\s*$/.test(prev.trimEnd()) && !/=>\s*\(\s*$/.test(prev)) {
      // also allow arrow implicit return `=> (` immediately before
      if (!/=>\s*\(?\s*$/.test(prev.split("\n").slice(-3).join("\n"))) {
        // still allow if this is the component's main export body — skip non-return uses
        // Keep conservative: only return-adjacent
        const nearby = prev.replace(/\s+/g, " ")
        if (!nearby.includes("return ") && !nearby.includes("return(")) continue
      }
    }
    const insert = ` identity={{ tier: "${tier}", component: "${component}" }}`
    out += src.slice(last, m.index + m[0].length - (m[2] === ">" ? 1 : 0))
    if (m[2] === ">") {
      out += insert + ">"
    } else {
      out += insert + " "
    }
    last = m[2] === ">" ? i + 1 : m.index + m[0].length
    // fix: when m[2] is space we already consumed through the space; need rest from last correctly
    if (m[2] === ">") {
      last = i + 1
    } else {
      last = m.index + m[0].length
    }
    changed = true
    // Only first clear root application per file to avoid over-tagging nested same-tag
    break
  }
  if (!changed) return null
  return out + src.slice(last)
}

const pascal = (s) =>
  s.replace(/(^|[-_\s]+)([a-zA-Z])/g, (_, __, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, "")

const uniqueName = (base, used) => {
  let name = base
  let n = 2
  while (used.has(name)) {
    name = `${base}${n}`
    n++
  }
  used.add(name)
  return name
}

const fixInlineParams = (rel, src) => {
  const kind = rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)
  const usedNames = new Set()
  const visitNames = (node) => {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) usedNames.add(node.name.text)
    ts.forEachChild(node, visitNames)
  }
  visitNames(sf)

  const enclosingName = (node) => {
    let cur = node.parent
    while (cur) {
      if (ts.isVariableDeclaration(cur) && ts.isIdentifier(cur.name)) return cur.name.text
      if (ts.isFunctionDeclaration(cur) && cur.name) return cur.name.text
      if (ts.isPropertyAssignment(cur) && ts.isIdentifier(cur.name)) return cur.name.text
      cur = cur.parent
    }
    return null
  }

  const edits = []
  const checkParams = (params, hint) => {
    for (const param of params || []) {
      if (!param.type || !ts.isTypeLiteralNode(param.type)) continue
      if (!ts.isObjectBindingPattern(param.name)) continue
      const keys = param.name.elements
        .map((el) => (ts.isBindingElement(el) && ts.isIdentifier(el.name) ? el.name.text : null))
        .filter(Boolean)
      let typeName
      if (hint) typeName = uniqueName(`${pascal(hint)}Props`, usedNames)
      else if (keys.length === 1) typeName = uniqueName(`${pascal(keys[0])}Prop`, usedNames)
      else if (keys.length <= 3) typeName = uniqueName(`${keys.map(pascal).join("")}Props`, usedNames)
      else typeName = uniqueName("InlineParamProps", usedNames)
      const typeText = src.slice(param.type.pos, param.type.end).trim()
      edits.push({
        insertPos: param.pos,
        typeText: `type ${typeName} = ${typeText}\n\n`,
        typeName,
        param,
      })
    }
  }

  const visit = (node) => {
    if (
      (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionDeclaration(node)) &&
      node.parameters
    ) {
      checkParams(node.parameters, enclosingName(node))
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  if (!edits.length) return null

  // Apply from end so positions stay valid
  let out = src
  const typeInserts = []
  for (const e of [...edits].reverse()) {
    const p = e.param
    const before = out.slice(0, p.type.pos)
    const after = out.slice(p.type.end)
    // replace `: { ... }` with `: TypeName`
    // p.type.pos may include leading whitespace; keep colon
    const colonIdx = before.lastIndexOf(":")
    const head = colonIdx >= 0 ? before.slice(0, colonIdx + 1) + " " : before
    out = head + e.typeName + after
    typeInserts.push(e)
  }
  // Insert type aliases before first export/const of interest — after imports
  const importEnd = (() => {
    const m = out.match(/^(?:(?:import[\s\S]*?;\s*)+)/)
    return m ? m[0].length : 0
  })()
  const aliasBlock = [...typeInserts]
    .reverse()
    .map((e) => e.typeText)
    .join("")
  out = out.slice(0, importEnd) + aliasBlock + out.slice(importEnd)
  return out
}

const fixHandlers = (src, hits) => {
  const renames = new Map()
  for (const h of hits) {
    const m = h.message.match(/`(\w+)` → rename to `(\w+)`/) || h.message.match(/`(\w+)` .{1,3} rename to `(\w+)`/)
    if (!m) {
      // mojibake arrow
      const m2 = h.message.match(/`(\w+)`[^\w]+rename to `(\w+)`/)
      if (m2) renames.set(m2[1], m2[2])
      continue
    }
    renames.set(m[1], m[2])
  }
  if (!renames.size) return null
  let out = src
  for (const [from, to] of renames) {
    // Prop collision: destructured `to` already exists — alias the prop
    const propRe = new RegExp(`\\b${to}\\s*(?:,|\\}|:)`)
    const localFrom = new RegExp(`\\b(?:const|let|function)\\s+${from}\\b`)
    if (propRe.test(out) && localFrom.test(out) && new RegExp(`\\b${to}\\b`).test(out)) {
      // Alias prop in destructure: `onSubmit,` -> `onSubmit: submitFromProp,` then rename handle->on
      // Prefer: onSubmit: submitAction
      const alias = `${to}Action`
      // common patterns in props destructure
      const patterns = [
        new RegExp(`(\\b${to})(\\s*,)`, "g"),
        new RegExp(`(\\b${to})(\\s*})`, "g"),
      ]
      // Only rewrite inside the component props destructure — first occurrence of `to,` after `(` of props
      let aliased = false
      out = out.replace(new RegExp(`(\\b${to})(\\s*[,}])`), (match, a, b, offset) => {
        // skip if already aliased
        if (out.slice(offset, offset + match.length + 10).includes(":")) return match
        // only first
        if (aliased) return match
        // ensure this looks like destructure (preceded by `{` within 200 chars)
        const prev = out.slice(Math.max(0, offset - 200), offset)
        if (!prev.includes("{")) return match
        aliased = true
        return `${to}: ${alias}${b}`
      })
      if (aliased) {
        // references to prop `to(` or `to?.` or `to ` as call — replace prop uses with alias BEFORE renaming handle
        // This is tricky. Simpler approach: rename handleXxx to onXxx and rename prop uses that call the callback
        // After alias, the local name `to` is free. Replace remaining prop identifier uses of `to` that are NOT the alias definition.
        // Actually after `onSubmit: onSubmitAction`, the identifier `onSubmit` is no longer bound — calls to onSubmit() break.
        // Replace calls: onSubmit( -> onSubmitAction( and onSubmit?. -> onSubmitAction?.
        out = out.replace(new RegExp(`\\b${to}\\(`, "g"), `${alias}(`)
        out = out.replace(new RegExp(`\\b${to}\\?\\.`, "g"), `${alias}?.`)
        // careful: the const handleSubmit body may call onSubmit — those should become alias
      }
    }
    const constTo = new RegExp(`\\b(?:const|let|function|var)\\s+${to}\\b`)
    const constFrom = new RegExp(`\\b(?:const|let|function|var)\\s+${from}\\b`)
    if (constTo.test(out) && constFrom.test(out)) {
      return { skipped: `handler collision ${from}->${to}` }
    }
    out = out.replace(new RegExp(`\\b${from}\\b`, "g"), to)
  }
  return out === src ? null : out
}

const addJsdoc = (src, exportName, role) => {
  const re = new RegExp(`(export\\s+(?:const|function|type|interface|class)\\s+${exportName}\\b)`)
  if (!re.test(src)) return null
  if (new RegExp(`/\\*\\*[\\s\\S]*?\\*/\\s*export\\s+(?:const|function|type|interface|class)\\s+${exportName}\\b`).test(src)) {
    return null
  }
  return src.replace(re, `/** ${role} */\n$1`)
}

const scrubAuthoringComments = (src) => {
  // Scrub emoji/VI only in comments and JSDoc — leave string literals alone.
  let out = src
  out = out.replace(/\/\*[\s\S]*?\*\//g, (block) => {
    let next = scrubEmoji(block)
    if (VN_LETTER.test(next)) next = scrubVietnamese(next)
    return next
  })
  out = out.replace(/(^|[^:])\/\/.*$/gm, (line) => {
    let next = scrubEmoji(line)
    if (VN_LETTER.test(next)) next = scrubVietnamese(next)
    return next
  })
  return out
}

const changed = []
const skipped = []
const holds = []
const regressions = []

const batchFiles = batch.files.map((f) => f.replace(/\\/g, "/"))

for (const rel of batchFiles) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) {
    skipped.push({ path: rel, rules: [], reason: "missing-file" })
    continue
  }
  const hits = hitsByFile.get(rel) || hitsByFile.get(rel.replace(/\//g, "\\")) || []
  // also try windows key
  let fileHits = hits
  if (!fileHits.length) {
    for (const [k, v] of hitsByFile) {
      if (k.replace(/\\/g, "/") === rel) {
        fileHits = v
        break
      }
    }
  }
  if (!fileHits.length) {
    skipped.push({ path: rel, rules: [], reason: "no-safe-hits-on-fresh-eslint" })
    continue
  }

  const rules = [...new Set(fileHits.map((h) => h.ruleId))]
  let src = fs.readFileSync(abs, "utf8")
  const original = src
  const applied = []
  const fileHolds = []
  const fileSkips = []

  // Product emoji hold
  if (PRODUCT_EMOJI.has(rel) && rules.includes("starci-fe/no-emoji-in-source")) {
    fileHolds.push({
      path: rel,
      rules: ["starci-fe/no-emoji-in-source"],
      reason: "product-ui-emoji-reaction-glyphs",
    })
  }

  // Emoji scrub (comments) — skip product files for emoji rule
  if (rules.includes("starci-fe/no-emoji-in-source") && !PRODUCT_EMOJI.has(rel)) {
    const next = scrubAuthoringComments(src)
    if (next !== src) {
      src = next
      applied.push("starci-fe/no-emoji-in-source")
    }
  }

  // Vietnamese in authoring
  if (rules.includes("starci-fe/no-vietnamese-in-source-authoring")) {
    const next = scrubAuthoringComments(src)
    // also scrub any remaining VI in comments via phrase map already in scrubAuthoringComments
    if (next !== src) {
      src = next
      applied.push("starci-fe/no-vietnamese-in-source-authoring")
    } else if (VN_LETTER.test(src)) {
      // try full-file phrase scrub on comments only already done — hold residual
      fileHolds.push({
        path: rel,
        rules: ["starci-fe/no-vietnamese-in-source-authoring"],
        reason: "residual-vietnamese-needs-manual-translation",
      })
    }
  }

  // Handlers
  if (rules.includes("starci-fe/handler-on-prefix")) {
    const handlerHits = fileHits.filter((h) => h.ruleId === "starci-fe/handler-on-prefix")
    const result = fixHandlers(src, handlerHits)
    if (result && typeof result === "object" && result.skipped) {
      fileSkips.push({ path: rel, rules: ["starci-fe/handler-on-prefix"], reason: result.skipped })
    } else if (typeof result === "string") {
      src = result
      applied.push("starci-fe/handler-on-prefix")
    }
  }

  // JSDoc
  if (rules.includes("starci-fe/require-export-jsdoc")) {
    for (const h of fileHits.filter((x) => x.ruleId === "starci-fe/require-export-jsdoc")) {
      const m = h.message.match(/export `(\w+)`/)
      if (!m) continue
      const name = m[1]
      const roles = {
        ScoreRow: "One labeled score meter row inside a mock-interview scorecard.",
        MessageRow: "One message row inside a Q&A bubble thread.",
      }
      // types.ts may have many exports — use generic
      const role = roles[name] || `Public export \`${name}\` for this module.`
      const next = addJsdoc(src, name, role)
      if (next) {
        src = next
        applied.push("starci-fe/require-export-jsdoc")
      }
    }
  }

  // Inline parameter types
  if (rules.includes("starci-fe/no-inline-parameter-type")) {
    const next = fixInlineParams(rel, src)
    if (next) {
      src = next
      applied.push("starci-fe/no-inline-parameter-type")
    } else {
      fileSkips.push({
        path: rel,
        rules: ["starci-fe/no-inline-parameter-type"],
        reason: "inline-param-not-auto-extractable",
      })
    }
  }

  // Identity root — clear only
  if (rules.includes("starci-fe/require-identity-root")) {
    const cls = classifyIdentity(rel, src)
    if (cls.ok) {
      const next = applyIdentity(src, cls)
      if (next) {
        src = next
        applied.push("starci-fe/require-identity-root")
      } else {
        fileHolds.push({
          path: rel,
          rules: ["starci-fe/require-identity-root"],
          reason: `clear-root-but-insert-failed:${cls.rootTag}`,
        })
      }
    } else {
      fileHolds.push({
        path: rel,
        rules: ["starci-fe/require-identity-root"],
        reason: `identity-not-clear:${cls.reason}`,
      })
    }
  }

  // Inline skeleton — always hold (semantic isSkeleton threading)
  if (rules.includes("starci-fe/no-inline-skeleton-branch")) {
    fileHolds.push({
      path: rel,
      rules: ["starci-fe/no-inline-skeleton-branch"],
      reason: "semantic-isSkeleton-threading-not-mechanical",
    })
  }

  if (src !== original) {
    fs.writeFileSync(abs, src)
    changed.push({
      path: rel,
      rules: [...new Set(applied)],
      reason: "safe-authoring-burn",
    })
  } else if (!fileHolds.length && !fileSkips.length) {
    skipped.push({ path: rel, rules, reason: "no-edit-applied" })
  }

  holds.push(...fileHolds)
  skipped.push(...fileSkips)
}

// Deferred remainder of manifest
const deferred = (batch.deferred || []).map((p) => ({
  path: p,
  rules: ["*"],
  reason: "deferred-batch-size",
}))

const status = {
  partition: "blocks-domain",
  changed,
  skipped: [...skipped, ...deferred],
  holds,
  verification: {
    batchSize: batchFiles.length,
    changedCount: changed.length,
    holdCount: holds.length,
    skippedCount: skipped.length,
    deferredCount: deferred.length,
    note: "fresh eslint re-check pending in post step",
  },
  regressions,
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-worker-blocks-domain.json",
  JSON.stringify(status, null, 2),
)

console.log(
  JSON.stringify(
    {
      changed: changed.length,
      holds: holds.length,
      skipped: skipped.length,
      deferred: deferred.length,
      changedPaths: changed.map((c) => c.path),
    },
    null,
    2,
  ),
)
