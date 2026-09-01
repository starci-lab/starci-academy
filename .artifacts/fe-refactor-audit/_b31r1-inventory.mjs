import fs from "fs"
import path from "path"
import { parse } from "@babel/parser"
import traverseMod from "@babel/traverse"

const traverse = traverseMod.default || traverseMod

function walk(d, acc = []) {
  if (!fs.existsSync(d)) return acc
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".artifacts"].includes(e.name)) continue
      walk(p, acc)
    } else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p)
  }
  return acc
}

function classifyPath(file) {
  const f = file.replace(/\\/g, "/")
  if (f.includes("LeaderboardListCard")) return "hold-leaderboard-list-card"
  if (f.includes("TopLearners")) return "hold-top-learners"
  if (f.includes("CommunityTab")) return "hold-community-tab"
  if (
    f.includes(".storybook/components/nivo/") ||
    f.includes(".storybook/components/nivoexpert/") ||
    f.includes(".storybook/stories/nivo/") ||
    f.includes(".storybook/stories/nivoexpert/")
  )
    return "hold-nivo"
  if (f.includes("src/components/pages/")) return "hold-page-folder"
  if (f.includes("src/components/blocks/") || f.includes("src/components/composites/"))
    return "migrate-candidate-identity"
  if (f.includes(".storybook/components/starci/") || f.includes(".storybook/stories/starci/"))
    return "migrate-candidate-storybook-starci"
  if (f.includes("src/components/atoms/")) return "atom-path-keep"
  if (f.includes(".storybook/components/atoms/") || f.includes(".storybook/stories/atoms/"))
    return "atom-path-keep"
  return "review"
}

function importKind(from) {
  const f = from.replace(/\\/g, "/")
  if (f.includes("atoms/display/IconTile") || f.includes("@sb-components/atoms/display/IconTile"))
    return "atom-IconTile"
  if (f.includes("blocks/identity/IconTile") || f.endsWith("/identity/IconTile"))
    return "block-IconTile"
  return null
}

const files = [...walk("src"), ...walk(".storybook")]
const rows = []

for (const file of files) {
  const rel = file.replace(/\\/g, "/")
  if (rel.includes("/blocks/identity/IconTile/")) continue
  if (rel.includes("/atoms/display/IconTile/")) continue
  const src = fs.readFileSync(file, "utf8")
  if (!src.includes("IconTile")) continue
  let ast
  try {
    ast = parse(src, { sourceType: "module", plugins: ["typescript", "jsx"], errorRecovery: true })
  } catch {
    continue
  }
  const locals = new Map()
  traverse(ast, {
    ImportDeclaration(p) {
      const kind = importKind(p.node.source.value)
      if (!kind) return
      for (const s of p.node.specifiers) {
        if (s.type === "ImportSpecifier" && s.imported.name === "IconTile") {
          locals.set(s.local.name, { kind, from: p.node.source.value })
        }
      }
    },
    JSXOpeningElement(p) {
      const tag = p.node.name.type === "JSXIdentifier" ? p.node.name.name : null
      if (!tag || !locals.has(tag)) return
      const meta = locals.get(tag)
      const attrs = {}
      for (const a of p.node.attributes || []) {
        if (a.type !== "JSXAttribute" || !a.name) continue
        const n = a.name.name
        if (!a.value) attrs[n] = true
        else if (a.value.type === "StringLiteral") attrs[n] = a.value.value
        else if (a.value.type === "JSXExpressionContainer") {
          const e = a.value.expression
          attrs[n] = e.type === "StringLiteral" ? e.value : src.slice(e.start, e.end)
        }
      }
      const status = classifyPath(rel)
      const semantic =
        meta.kind === "atom-IconTile"
          ? "glyph-IconTile"
          : attrs.src != null
            ? "identity-with-image"
            : "identity-entity-tile"
      rows.push({
        consumer: rel,
        line: p.node.loc?.start.line,
        oldImport: meta.from,
        oldKind: meta.kind,
        size: attrs.size ?? (meta.kind === "atom-IconTile" ? "sm(default)" : "md(default)"),
        hasSrc: attrs.src != null,
        semantic,
        action: status,
      })
    },
  })
}

const inventory = {
  batch: "B31r1",
  checkpoint: "18f84f5b",
  approvedContract: {
    IconTile: "atoms/display/IconTile — sm40/md64/lg80 rounded-full — KEEP",
    IdentityTile: "composites/identity/IdentityTile — sm48/xl md64/2xl lg80/2xl — NEW from block",
  },
  consumers: rows,
  summary: {
    total: rows.length,
    byAction: rows.reduce((a, r) => {
      a[r.action] = (a[r.action] || 0) + 1
      return a
    }, {}),
    byOldKind: rows.reduce((a, r) => {
      a[r.oldKind] = (a[r.oldKind] || 0) + 1
      return a
    }, {}),
    blockPathLive: rows.filter((r) => r.oldKind === "block-IconTile").length,
    migrateCandidates: rows.filter((r) => r.action.startsWith("migrate-candidate")).length,
    holds: rows.filter((r) => r.action.startsWith("hold-")).length,
  },
  deletionGate:
    "blocks/identity/IconTile may delete only when block-IconTile open-tag imports === 0",
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r1-inventory.json",
  JSON.stringify(inventory, null, 2),
)
console.log(JSON.stringify(inventory.summary, null, 2))
console.log(
  "migrate files",
  [
    ...new Set(
      rows.filter((r) => r.action.startsWith("migrate-candidate")).map((r) => r.consumer),
    ),
  ].join("\n"),
)
