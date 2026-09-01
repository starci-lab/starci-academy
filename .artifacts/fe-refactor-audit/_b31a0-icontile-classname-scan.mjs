import fs from "fs"
import path from "path"
import { parse } from "@babel/parser"
import traverseMod from "@babel/traverse"

const traverse = traverseMod.default || traverseMod

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === ".artifacts") continue
      walk(p, acc)
    } else if (/\.tsx?$/.test(e.name)) acc.push(p)
  }
  return acc
}

const files = walk("src")
const hits = []
for (const file of files) {
  const src = fs.readFileSync(file, "utf8")
  if (!src.includes("IconTile")) continue
  let ast
  try {
    ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] })
  } catch {
    continue
  }
  const locals = new Set()
  traverse(ast, {
    ImportDeclaration(p) {
      const from = p.node.source.value.replace(/\\/g, "/")
      const isBlockIdentity =
        from.includes("blocks/identity/IconTile") ||
        from.endsWith("/identity/IconTile") ||
        from === "../../identity/IconTile" ||
        from === "../identity/IconTile"
      const isAtom = from.includes("atoms/display/IconTile")
      if (!isBlockIdentity || isAtom) return
      for (const s of p.node.specifiers) {
        if (s.imported && s.imported.name === "IconTile") locals.add(s.local.name)
        if (s.type === "ImportSpecifier" && s.local.name === "IconTile") locals.add("IconTile")
      }
    },
    JSXOpeningElement(p) {
      const n = p.node.name
      const tag = n.type === "JSXIdentifier" ? n.name : null
      if (!tag || !locals.has(tag)) return
      const attrs = {}
      for (const a of p.node.attributes || []) {
        if (a.type !== "JSXAttribute" || !a.name) continue
        const k = a.name.name
        if (k === "className" || k === "classNames") {
          attrs[k] = a.value ? src.slice(a.value.start, a.value.end) : true
        }
      }
      if (attrs.className || attrs.classNames) {
        hits.push({
          file: file.replace(/\\/g, "/"),
          line: p.node.loc.start.line,
          attrs,
        })
      }
    },
  })
}
console.log(JSON.stringify(hits, null, 2))
console.log("count", hits.length)
