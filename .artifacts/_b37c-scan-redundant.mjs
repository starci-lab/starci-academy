/**
 * Audit-only scan: residual LabeledCard shells around self-labeled / self-framed
 * SurfaceCard members. Not an ESLint rule (ruleset freeze — B36+B37c).
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import { parse } from "@babel/parser"
import _traverse from "@babel/traverse"

const traverse = _traverse.default || _traverse

const roots = ["src", ".storybook/components", ".storybook/stories"]
const files = []

function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name)
    if (e.isDirectory()) {
      if (["node_modules", ".git", ".next", "dist", "nivo", "nivoexpert", "mia-mia"].includes(e.name)) {
        continue
      }
      walk(p)
    } else if (/\.(tsx|jsx)$/.test(e.name)) {
      files.push(p)
    }
  }
}

roots.forEach(walk)

const jsxName = (opening) => {
  const name = opening?.name
  if (!name) return null
  if (name.type === "JSXIdentifier") return name.name
  if (name.type === "JSXMemberExpression") {
    const obj = name.object?.type === "JSXIdentifier" ? name.object.name : null
    const prop = name.property?.type === "JSXIdentifier" ? name.property.name : null
    return obj && prop ? `${obj}.${prop}` : obj || prop || null
  }
  return null
}

const normalize = (raw) => {
  switch (raw) {
    case "SurfaceCardList":
    case "SurfaceCard.List":
      return "SurfaceCardList"
    case "SurfaceCardAccordion":
    case "SurfaceCard.Accordion":
      return "SurfaceCardAccordion"
    case "SurfaceListCard":
      return "SurfaceListCard"
    case "SurfaceCard":
    case "SurfaceCard.Base":
      return "SurfaceCard"
    case "SurfaceCardNested":
    case "SurfaceCard.Nested":
      return "SurfaceCardNested"
    case "SurfaceCardPressableGroup":
    case "SurfaceCard.PressableGroup":
      return "SurfaceCardPressableGroup"
    case "SurfaceCardSelectableGroup":
    case "SurfaceCard.SelectableGroup":
      return "SurfaceCardSelectableGroup"
    case "SurfaceCardCrossList":
    case "SurfaceCard.CrossList":
      return "SurfaceCardCrossList"
    case "SurfaceCardPlaceholder":
    case "SurfaceCard.Placeholder":
      return "SurfaceCardPlaceholder"
    default:
      return null
  }
}

const isStaticFalse = (attr) => {
  const v = attr.value
  if (v?.type === "JSXExpressionContainer") {
    const e = v.expression
    if (e?.type === "Literal" && e.value === false) return true
  }
  return false
}

const isFrameless = (opening) => {
  for (const attr of opening.attributes || []) {
    if (attr.type !== "JSXAttribute") continue
    if (attr.name?.name !== "frameless") continue
    if (isStaticFalse(attr)) return false
    return true
  }
  return false
}

const ALWAYS = new Set(["SurfaceCardList", "SurfaceCardAccordion"])
const FRAMELESS = new Set([
  "SurfaceListCard",
  "SurfaceCard",
  "SurfaceCardNested",
  "SurfaceCardPressableGroup",
  "SurfaceCardSelectableGroup",
  "SurfaceCardCrossList",
  "SurfaceCardPlaceholder",
])

const hits = []
for (const file of files) {
  let ast
  try {
    ast = parse(readFileSync(file, "utf8"), {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    })
  } catch {
    continue
  }
  traverse(ast, {
    JSXOpeningElement(path) {
      const child = normalize(jsxName(path.node))
      if (!child) return
      let cur = path.parentPath
      let labeled = null
      while (cur) {
        if (cur.isJSXElement()) {
          const n = jsxName(cur.node.openingElement)
          if (n === "LabeledCard") {
            labeled = cur.node
            break
          }
        }
        cur = cur.parentPath
      }
      if (!labeled) return
      const frameless = isFrameless(labeled.openingElement)
      if (ALWAYS.has(child) || (FRAMELESS.has(child) && frameless)) {
        hits.push({
          file: relative(process.cwd(), file).replace(/\\/g, "/"),
          child,
          frameless,
          pattern: ALWAYS.has(child)
            ? "LabeledCard wraps self-labeled SurfaceCard member"
            : "LabeledCard frameless wraps self-framed surface",
        })
      }
    },
  })
}

const out = {
  batch: "B36+B37c",
  generatedAt: new Date().toISOString(),
  note: "Audit-only residual redundant labeled-surface patterns. Not an ESLint rule (ruleset freeze).",
  count: hits.length,
  hits,
}

mkdirSync(".artifacts/fe-refactor-audit", { recursive: true })
writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b36-b37c-redundant-labeled-surface.json",
  JSON.stringify(out, null, 2),
)
console.log(JSON.stringify({ count: hits.length, files: [...new Set(hits.map((h) => h.file))] }, null, 2))
