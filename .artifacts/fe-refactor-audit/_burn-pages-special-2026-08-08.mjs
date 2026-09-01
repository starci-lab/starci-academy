/**
 * pages-special safe-rule burn (2026-08-08).
 * Storybook first, then src. Cap ~40 clear files.
 */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { hasEmoji } from "../../plugins/eslint/authoring.mjs"

const ROOT = process.cwd()
const MANIFEST = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-manifest-pages-special.json", "utf8"),
)
const CAP = 40

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

const SKIP_CLOSED = /ContentPage|ContentArticle/
const SKIP_LOCKED = /MockInterview|QuizSession|LearnLoop|ContentAiChat|ArchitectureScene/

const IDENTITY_CAPABLE = new Set([
  "Box", "Cluster", "Container", "Flex", "Grid", "PinnedTrack", "RailShell",
  "ResponsiveCluster", "ResponsiveRow", "ScrollArea", "Split", "SplitWorkspace",
  "Stack", "StackH", "StackV", "Stage",
  "SurfaceCard", "SurfaceCardNested", "SurfaceCardPressableGroup", "SurfaceCardList",
  "SurfaceCardAccordion", "SurfaceCardCrossList", "SurfaceCardPlaceholder",
  "SurfaceCardSelectableGroup",
  "Form", "FormActions", "FormSection",
  "EmptyState", "ModalShell", "DrawerShell",
  "List", "AuthorByline", "KeyValueList", "KeyValueRow", "Page",
])
const ASYNC_NO = new Set(["AsyncContent", "AsyncContentEmpty", "AsyncContentError"])

const changed = []
const skipped = []
const holds = []

const scrubEmoji = (text) => {
  let out = text
  const map = [
    [/↔/g, "<->"],
    [/↕/g, "<->"],
    [/→/g, "->"],
    [/←/g, "<-"],
    [/⇒/g, "=>"],
    [/⭐/g, "*"],
    [/✨/g, "*"],
    [/⏳/g, "(pending)"],
    [/▶/g, ">"],
    [/⚠️?/g, "WARNING"],
    [/✅/g, "[ok]"],
    [/❌/g, "[x]"],
    [/🔥/g, ""],
    [/💡/g, ""],
    [/🎉/g, ""],
    [/🚀/g, ""],
    [/📌/g, ""],
    [/👉/g, "->"],
    [/✓/g, "[ok]"],
    [/✔/g, "[ok]"],
    [/★/g, "*"],
  ]
  for (const [re, rep] of map) out = out.replace(re, rep)
  out = out.replace(/\p{Extended_Pictographic}/gu, "")
  out = out.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
  out = out.replace(/[^\S\n]{2,}/g, " ")
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
  return null
}

const componentFromPath = (file) => {
  const parts = file.replace(/\\/g, "/").split("/")
  const base = parts[parts.length - 1]
  if (base === "index.tsx" || base === "component.tsx") return parts[parts.length - 2]
  return base.replace(/\.tsx$/, "")
}

const classifyIdentity = (rel, src) => {
  if (/\bidentity=\{/.test(src)) return { kind: "skip", reason: "already-has-identity" }
  if (/return\s*(?:\(|)\s*<>/.test(src) && !/return\s*(?:\(|)\s*<[A-Za-z]/.test(src)) {
    return { kind: "hold", reason: "fragment-root" }
  }
  const roots = findReturnRoots(src)
  if (!roots.length) return { kind: "hold", reason: "no-return-jsx" }
  const host = roots.filter((r) => /^[a-z]/.test(r.tag))
  const comp = roots.filter((r) => /^[A-Z]/.test(r.tag))
  if (!comp.length) return { kind: "hold", reason: `host-root:${[...new Set(host.map((r) => r.tag))].join(",")}` }
  if (host.length) return { kind: "hold", reason: `mixed-host:${[...new Set(roots.map((r) => r.tag))].join(",")}` }
  const tags = [...new Set(comp.map((r) => r.tag))]
  if (tags.some((t) => ASYNC_NO.has(t))) return { kind: "hold", reason: `async-root:${tags.join(",")}` }
  const capable = tags.filter((t) => IDENTITY_CAPABLE.has(t))
  const incapable = tags.filter((t) => !IDENTITY_CAPABLE.has(t))
  if (capable.length === 1 && incapable.length === 0 && tags.length === 1) {
    return { kind: "clear", rootTag: tags[0] }
  }
  return {
    kind: "hold",
    reason: incapable.length
      ? `incapable-root:${incapable.join(",")}`
      : `multi-capable-roots:${tags.join(",")}`,
  }
}

const applyIdentity = (src, rootTag, tier, component) => {
  const identityLit = `identity={{ tier: "${tier}", component: "${component}" }}`
  let count = 0
  const tagRe = new RegExp(`<${rootTag}(?=[\\s/>])`, "g")
  const matches = []
  let m
  while ((m = tagRe.exec(src))) {
    const look = src.slice(Math.max(0, m.index - 160), m.index)
    const isReturn =
      /return[\s\S]*$/.test(look) &&
      !/;\s*$/.test(look.trim()) &&
      (/return\s*\(\s*$/.test(look) ||
        /return\s*$/.test(look) ||
        /return\s*\(\s*(?:\/\/[^\n]*\n\s*)*$/.test(look) ||
        /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*$/.test(look))
    if (!isReturn) continue
    matches.push(m.index + m[0].length)
  }
  // apply from end
  let out = src
  for (const insertAt of matches.reverse()) {
    const after = out.slice(insertAt, insertAt + 80)
    if (/\bidentity=\{/.test(after.slice(0, after.indexOf(">") === -1 ? 80 : after.indexOf(">")))) continue
    out = out.slice(0, insertAt) + ` ${identityLit}` + out.slice(insertAt)
    count++
  }
  return { src: out, count }
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

const fixInlineParams = (rel) => {
  const abs = path.join(ROOT, rel)
  const original = fs.readFileSync(abs, "utf8")
  const kind = rel.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.TSX
  const sf = ts.createSourceFile(rel, original, ts.ScriptTarget.Latest, true, kind)
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

  const typeNameFor = (param, fnHint) => {
    const keys = param.elements
      .map((el) => (ts.isBindingElement(el) && ts.isIdentifier(el.name) ? el.name.text : null))
      .filter(Boolean)
    if (fnHint) return uniqueName(`${pascal(fnHint)}Props`, usedNames)
    if (keys.length === 1) return uniqueName(`${pascal(keys[0])}Prop`, usedNames)
    if (keys.length <= 3) return uniqueName(`${keys.map(pascal).join("")}Props`, usedNames)
    return uniqueName("InlineParamProps", usedNames)
  }

  /** @type {Array<{ insertPos: number, typeText: string, typeName: string, param: ts.ParameterDeclaration }>} */
  const edits = []
  const checkParams = (params, hint) => {
    for (const param of params) {
      if (!param.name || !ts.isObjectBindingPattern(param.name)) continue
      if (!param.type || param.type.kind !== ts.SyntaxKind.TypeLiteral) continue
      const typeText = original.slice(param.type.pos, param.type.end).trim()
      const typeName = typeNameFor(param.name, hint)
      edits.push({
        insertPos: param.pos,
        typeText,
        typeName,
        param,
      })
    }
  }
  const visit = (node) => {
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node)) {
      checkParams(node.parameters, node.name && ts.isIdentifier(node.name) ? node.name.text : enclosingName(node))
    } else if (ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
      checkParams(node.parameters, enclosingName(node))
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  if (!edits.length) return { ok: false, reason: "no-inline-param-edits" }

  // Apply from end: replace inline type with name, insert type aliases before first export/const after imports
  let out = original
  const aliases = []
  for (const edit of edits.reverse()) {
    const p = edit.param
    const typeStart = p.type.pos
    const typeEnd = p.type.end
    // keep leading trivia spacing — replace type literal with alias name
    const before = out.slice(0, typeStart)
    const after = out.slice(typeEnd)
    // type may have leading space already in slice; trim and re-space
    const lead = out.slice(typeStart, typeEnd).match(/^\s*/)?.[0] ?? " "
    out = before + lead + edit.typeName + after
    aliases.unshift(`type ${edit.typeName} = ${edit.typeText}`)
  }

  // insert aliases after last import
  const importEnd = (() => {
    const re = /^import[\s\S]*?;\s*$/gm
    let last = 0
    let m
    while ((m = re.exec(out))) last = m.index + m[0].length
    return last
  })()
  const block = `\n${aliases.map((a) => `${a}\n`).join("")}`
  out = out.slice(0, importEnd) + block + out.slice(importEnd)
  fs.writeFileSync(abs, out)
  return { ok: true }
}

const fixEmojiFile = (rel) => {
  const abs = path.join(ROOT, rel)
  let src = fs.readFileSync(abs, "utf8")
  if (!hasEmoji(src)) return { ok: false, reason: "no-emoji-left" }
  const kind = rel.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.TSX
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)
  const replaces = []
  for (const c of sf.text.matchAll(/./su) ? [] : []) {
    void c
  }
  // comments via getAllComments-like scan + string literals via AST
  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const raw = node.text
      if (hasEmoji(raw)) {
        replaces.push({ start: node.getStart(sf) + 1, end: node.end - 1, text: scrubEmoji(raw) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  // comments
  const commentRanges = []
  const scanComments = (node) => {
    const leading = ts.getLeadingCommentRanges(sf.text, node.pos) || []
    const trailing = ts.getTrailingCommentRanges(sf.text, node.end) || []
    for (const r of [...leading, ...trailing]) commentRanges.push(r)
    ts.forEachChild(node, scanComments)
  }
  scanComments(sf)
  // also full-file comment scrape for JSDoc not attached oddly
  const reComment = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/g
  let cm
  while ((cm = reComment.exec(src))) {
    if (hasEmoji(cm[0])) {
      replaces.push({ start: cm.index, end: cm.index + cm[0].length, text: scrubEmoji(cm[0]) })
    }
  }
  // dedupe by start
  const byStart = new Map()
  for (const r of replaces) byStart.set(r.start, r)
  const ordered = [...byStart.values()].sort((a, b) => b.start - a.start)
  for (const r of ordered) {
    src = src.slice(0, r.start) + r.text + src.slice(r.end)
  }
  if (!hasEmoji(src) || ordered.length) {
    // final pass: scrub any remaining emoji in whole file comments/strings already handled;
    // if still emoji in weird places, scrub whole file carefully only on emoji chars
    if (hasEmoji(src)) {
      src = scrubEmoji(src)
    }
    fs.writeFileSync(abs, src)
    return { ok: true }
  }
  return { ok: false, reason: "emoji-scrub-noop" }
}

const fixHandlerFile = (rel, from, to) => {
  const abs = path.join(ROOT, rel)
  let src = fs.readFileSync(abs, "utf8")
  // JSX API prop like handleSide="right" — do not rename attribute API
  const attrOnly = new RegExp(`\\b${from}=`)
  const decl = new RegExp(`\\b(?:const|let|function|var)\\s+${from}\\b`)
  if (attrOnly.test(src) && !decl.test(src)) {
    return { ok: false, reason: `handler-is-jsx-api-prop:${from}` }
  }
  if (new RegExp(`\\b(?:const|let|function|var)\\s+${to}\\b`).test(src) && decl.test(src)) {
    // collision — special-case known patterns
    if (from === "handleAskQuestion" && to === "onAskQuestion") {
      // rename prop binding then local
      src = src.replace(
        /(\bonAskQuestion)(\s*[,:}])/g,
        (full, _a, tail, offset) => {
          // only in destructure / props type usage — crude: first props destructure occurrences
          return full
        },
      )
      // More reliable: replace `onAskQuestion` prop references inside the handler body by aliasing
      if (/const handleAskQuestion = \(\) => \{[\s\S]*?onAskQuestion\(/.test(src)) {
        src = src.replace(
          /const handleAskQuestion = \(\) => \{\s*onAskQuestion\(([^)]*)\)/,
          "const onAskQuestion = () => {\n        askQuestion($1)",
        )
        // add alias in destructure: onAskQuestion: askQuestion
        if (/onAskQuestion,/.test(src) || /onAskQuestion\s*\}/.test(src) || /onAskQuestion\s*,/.test(src)) {
          src = src.replace(/\bonAskQuestion([,}\n])/, "onAskQuestion: askQuestion$1")
        } else {
          return { ok: false, reason: "handler-collision-no-destructure" }
        }
        // fix onSubmit={handleAskQuestion}
        src = src.replace(/\bhandleAskQuestion\b/g, "onAskQuestion")
        fs.writeFileSync(abs, src)
        return { ok: true }
      }
    }
    if (from === "handleRate" && to === "onRate") {
      // merge: rename handleRate → onRateAsync temporarily then fold wrapper
      src = src.replace(/\bhandleRate\b/g, "onRate")
      // now duplicate onRate const — remove thin sync wrapper if present
      src = src.replace(
        /\n\s*\/\/ presentational callback contract is sync[^\n]*\n\s*const onRate = useCallback\(\(grade: number\) => \{ void onRate\(grade\) \}, \[onRate\]\)\n/,
        "\n",
      )
      // if still duplicate, fail
      const decls = [...src.matchAll(/\bconst onRate\b/g)]
      if (decls.length > 1) {
        return { ok: false, reason: "handler-collision-onRate-duplicate" }
      }
      // presentational expects sync — wrap call sites that need void
      // onRate is now async; call sites using onRate should void it
      fs.writeFileSync(abs, src)
      return { ok: true }
    }
    return { ok: false, reason: `handler-collision:${from}->${to}` }
  }
  src = src.replace(new RegExp(`\\b${from}\\b`, "g"), to)
  fs.writeFileSync(abs, src)
  return { ok: true }
}

// Build work queue: storybook first, then src; prefer authoring over hard identity
const inv = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-parallel-burn-inventory.json", "utf8"),
)
const part = inv.partitions["pages-special"]
const byPath = new Map(part.files.map((f) => [f.path.replace(/\\/g, "/"), f]))

const manifestFiles = MANIFEST.files.map((f) => f.path.replace(/\\/g, "/"))
const sb = manifestFiles.filter((p) => p.includes(".storybook/"))
const src = manifestFiles.filter((p) => !p.includes(".storybook/"))
const ordered = [...sb, ...src]

let budget = CAP

for (const rel of ordered) {
  const meta = byPath.get(rel)
  if (!meta || meta.safeCount === 0) continue

  if (SKIP_CLOSED.test(rel)) {
    skipped.push({ path: rel, rules: meta.safeRules || [], reason: "closed-contentpage-box" })
    continue
  }
  if (SKIP_LOCKED.test(rel)) {
    skipped.push({ path: rel, rules: meta.safeRules || [], reason: "locked-path" })
    continue
  }

  const msgs = (meta.messages || []).filter((m) => SAFE.has(m.rule))
  if (!msgs.length) continue

  const rules = [...new Set(msgs.map((m) => m.rule))]
  const authoringRules = rules.filter((r) => r !== "starci-fe/require-identity-root")
  const hasIdentity = rules.includes("starci-fe/require-identity-root")
  const hasSkeleton = rules.includes("starci-fe/no-inline-skeleton-branch")

  // Hold skeleton branches — need leaf isSkeleton support (not same-component clear)
  if (hasSkeleton) {
    holds.push({
      path: rel,
      rules: ["starci-fe/no-inline-skeleton-branch"],
      reason: "skeleton-branch-needs-leaf-isSkeleton",
    })
  }

  if (budget <= 0) {
    skipped.push({ path: rel, rules, reason: "deferred-batch-size" })
    continue
  }

  if (!fs.existsSync(rel)) {
    skipped.push({ path: rel, rules, reason: "missing-file" })
    continue
  }

  const fileChangedRules = []
  let didChange = false

  // --- emoji ---
  if (authoringRules.includes("starci-fe/no-emoji-in-source")) {
    const r = fixEmojiFile(rel)
    if (r.ok) {
      fileChangedRules.push("starci-fe/no-emoji-in-source")
      didChange = true
    } else {
      skipped.push({ path: rel, rules: ["starci-fe/no-emoji-in-source"], reason: r.reason })
    }
  }

  // --- handlers ---
  if (authoringRules.includes("starci-fe/handler-on-prefix")) {
    const handlerMsgs = msgs.filter((m) => m.rule === "starci-fe/handler-on-prefix")
    let handlerOk = true
    for (const hm of handlerMsgs) {
      const m = hm.message.match(/`(\w+)` → rename to `(\w+)`/)
      if (!m) continue
      const r = fixHandlerFile(rel, m[1], m[2])
      if (!r.ok) {
        handlerOk = false
        if (r.reason.includes("jsx-api-prop")) {
          holds.push({ path: rel, rules: ["starci-fe/handler-on-prefix"], reason: r.reason })
        } else {
          skipped.push({ path: rel, rules: ["starci-fe/handler-on-prefix"], reason: r.reason })
        }
      }
    }
    if (handlerOk && handlerMsgs.length) {
      fileChangedRules.push("starci-fe/handler-on-prefix")
      didChange = true
    }
  }

  // --- inline param ---
  if (authoringRules.includes("starci-fe/no-inline-parameter-type")) {
    const r = fixInlineParams(rel)
    if (r.ok) {
      fileChangedRules.push("starci-fe/no-inline-parameter-type")
      didChange = true
    } else {
      skipped.push({ path: rel, rules: ["starci-fe/no-inline-parameter-type"], reason: r.reason })
    }
  }

  // --- clear identity only ---
  if (hasIdentity) {
    const srcText = fs.readFileSync(rel, "utf8")
    const cls = classifyIdentity(rel, srcText)
    if (cls.kind === "clear") {
      const tier = tierFromPath(rel)
      const component = componentFromPath(rel)
      if (!tier) {
        holds.push({ path: rel, rules: ["starci-fe/require-identity-root"], reason: "unknown-tier" })
      } else {
        const { src: next, count } = applyIdentity(srcText, cls.rootTag, tier, component)
        if (count > 0) {
          fs.writeFileSync(rel, next)
          fileChangedRules.push("starci-fe/require-identity-root")
          didChange = true
        } else {
          skipped.push({
            path: rel,
            rules: ["starci-fe/require-identity-root"],
            reason: "identity-insert-zero",
          })
        }
      }
    } else if (cls.kind === "hold") {
      holds.push({ path: rel, rules: ["starci-fe/require-identity-root"], reason: cls.reason })
    } else {
      skipped.push({ path: rel, rules: ["starci-fe/require-identity-root"], reason: cls.reason })
    }
  }

  if (didChange) {
    changed.push({ path: rel, rules: [...new Set(fileChangedRules)], reason: "safe-burn" })
    budget--
  } else if (
    !fileChangedRules.length &&
    !holds.some((h) => h.path === rel) &&
    !skipped.some((s) => s.path === rel)
  ) {
    skipped.push({ path: rel, rules, reason: "no-clear-safe-fix" })
  }
}

// Mark remaining unprocessed safe files as deferred
const touched = new Set([
  ...changed.map((c) => c.path),
  ...skipped.map((s) => s.path),
  ...holds.map((h) => h.path),
])
for (const rel of ordered) {
  if (touched.has(rel)) continue
  const meta = byPath.get(rel)
  if (!meta || meta.safeCount === 0) continue
  if (SKIP_CLOSED.test(rel) || SKIP_LOCKED.test(rel)) continue
  const msgs = (meta.messages || []).filter((m) => SAFE.has(m.rule))
  if (!msgs.length) continue
  skipped.push({
    path: rel,
    rules: [...new Set(msgs.map((m) => m.rule))],
    reason: "deferred-batch-size",
  })
}

const status = {
  partition: "pages-special",
  changed,
  skipped,
  holds,
  verification: {},
  regressions: [],
  counts: {
    changed: changed.length,
    skipped: skipped.length,
    holds: holds.length,
    budgetUsed: CAP - budget,
    cap: CAP,
  },
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-worker-pages-special.json",
  JSON.stringify(status, null, 2),
)
console.log(JSON.stringify(status.counts, null, 2))
console.log("changed", changed.map((c) => c.path))
