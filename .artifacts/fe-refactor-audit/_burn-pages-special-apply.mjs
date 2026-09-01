/** Scrub emoji + extract inline param types for pages-special clear authoring. */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { hasEmoji } from "../../plugins/eslint/authoring.mjs"

const ROOT = process.cwd()

const scrub = (text) => {
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
    [/⚠️/g, "WARNING"],
    [/⚠/g, "WARNING"],
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

const emojiFiles = [
  "src/components/pages/LandingPage/KnowledgeGraph/index.tsx",
  "src/components/pages/DashboardPage/index.tsx",
  "src/components/pages/DashboardPage/FlashcardReview/component.tsx",
  "src/components/pages/CourseDetailPage/CourseFaq/component.tsx",
  "src/components/pages/FlashcardsPage/useFlashcardNav.ts",
]

for (const f of emojiFiles) {
  let src = fs.readFileSync(f, "utf8")
  if (!hasEmoji(src)) {
    console.log("emoji-clean", f)
    continue
  }
  const re = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/g
  src = src.replace(re, (m) => (hasEmoji(m) ? scrub(m) : m))
  if (hasEmoji(src)) src = scrub(src)
  fs.writeFileSync(f, src)
  console.log("emoji-scrubbed", f, "left=", hasEmoji(fs.readFileSync(f, "utf8")))
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

const inlineFiles = [
  "src/components/pages/ArchitecturePage/ArchitectureRail/index.tsx",
  "src/components/pages/ArchitecturePage/ArchitectureRail/ArchitectureMobileNav/index.tsx",
  "src/components/pages/LandingPage/TalentMarketplace/index.tsx",
  "src/components/pages/CvGalleryPage/CvGallery/component.tsx",
  "src/components/pages/ProfileOverviewPage/ProfileJobReadiness/index.tsx",
  "src/components/pages/MindMapPage/component.tsx",
  "src/components/pages/ProfileProjectsPage/ProfilePinned/index.tsx",
  "src/components/pages/DashboardPage/ChangelogList/component.tsx",
  "src/components/pages/FlashcardsPage/FlashcardQuizResult/recapBlocks.tsx",
  "src/components/pages/PlaygroundPreparePage/component.tsx",
  "src/components/pages/ProfilePublicCvPage/index.tsx",
  "src/components/pages/FlashcardsPage/FlashcardQuizResult/component.tsx",
]

const fixInline = (rel) => {
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

  const edits = []
  const checkParams = (params, hint) => {
    for (const param of params) {
      if (!param.name || !ts.isObjectBindingPattern(param.name)) continue
      if (!param.type || param.type.kind !== ts.SyntaxKind.TypeLiteral) continue
      const typeText = original.slice(param.type.getStart(sf), param.type.end).trim()
      const typeName = typeNameFor(param.name, hint)
      edits.push({ typeStart: param.type.getStart(sf), typeEnd: param.type.end, typeText, typeName })
    }
  }
  const visit = (node) => {
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
      checkParams(node.parameters, node.name && ts.isIdentifier(node.name) ? node.name.text : enclosingName(node))
    } else if (ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
      checkParams(node.parameters, enclosingName(node))
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  if (!edits.length) {
    console.log("inline-noop", rel)
    return false
  }

  let out = original
  const aliases = []
  for (const edit of [...edits].reverse()) {
    out = out.slice(0, edit.typeStart) + edit.typeName + out.slice(edit.typeEnd)
    aliases.unshift(`type ${edit.typeName} = ${edit.typeText}`)
  }

  const importRe = /^import[\s\S]*?;\s*$/gm
  let last = 0
  let m
  while ((m = importRe.exec(out))) last = m.index + m[0].length
  const block = `\n${aliases.map((a) => `${a}\n`).join("")}`
  out = out.slice(0, last) + block + out.slice(last)
  fs.writeFileSync(abs, out)
  console.log("inline-fixed", rel, aliases.length)
  return true
}

for (const f of inlineFiles) fixInline(f)

// Clear identity root: FlashcardReviewPage — all Box returns
{
  const rel = "src/components/pages/FlashcardReviewPage/index.tsx"
  let src = fs.readFileSync(rel, "utf8")
  const identity = `identity={{ tier: "page", component: "FlashcardReviewPage" }}`
  if (!/\bidentity=\{/.test(src)) {
    // Insert on return-root <Box ...>
    const re = /return\s*\(\s*\n(\s*)<Box\b/g
    src = src.replace(re, (full, indent) => `return (\n${indent}<Box ${identity}`)
    // also `return (\n        <Box` already handled; check single-line
    src = src.replace(/return\s+<Box\b/g, `return <Box ${identity}`)
    fs.writeFileSync(rel, src)
    console.log("identity-fixed", rel, (src.match(/identity=\{\{/g) || []).length)
  } else {
    console.log("identity-already", rel)
  }
}
