import fs from "fs"
import path from "path"
import { parse } from "@babel/parser"
import traverseMod from "@babel/traverse"

const traverse = traverseMod.default || traverseMod

const SIZE_MAPS = {
  atom: {
    sm: { box: "size-10", px: 40, radius: "rounded-full" },
    md: { box: "size-16", px: 64, radius: "rounded-full" },
    lg: { box: "size-20", px: 80, radius: "rounded-full" },
  },
  block: {
    sm: { box: "size-12", px: 48, radius: "rounded-xl" },
    md: { box: "size-16", px: 64, radius: "rounded-2xl" },
    lg: { box: "size-20", px: 80, radius: "rounded-2xl" },
  },
  proposedCanonical: {
    sm: { box: "size-10", px: 40, radius: "rounded-full" },
    md: { box: "size-12", px: 48, radius: "rounded-xl" },
    lg: { box: "size-16", px: 64, radius: "rounded-2xl" },
  },
}

function walk(d, acc = []) {
  if (!fs.existsSync(d)) return acc
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".artifacts", "dist"].includes(e.name)) continue
      walk(p, acc)
    } else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) acc.push(p)
  }
  return acc
}

function classifyImport(from) {
  const f = from.replace(/\\/g, "/")
  if (f.includes("atoms/display/IconTile") || f.includes("@sb-components/atoms/display/IconTile"))
    return "atom"
  if (f.includes("blocks/identity/IconTile") || f.endsWith("/identity/IconTile")) return "block"
  return null
}

function isLockedPath(file) {
  const f = file.replace(/\\/g, "/")
  return (
    f.includes("/.storybook/components/nivo/") ||
    f.includes("/.storybook/components/nivoexpert/") ||
    f.includes("/.storybook/stories/nivo/") ||
    f.includes("/.storybook/stories/nivoexpert/")
  )
}

function isPagePath(file) {
  return /\/src\/components\/pages\//.test(file.replace(/\\/g, "/"))
}

function attrValue(src, attr) {
  if (!attr.value) return true
  if (attr.value.type === "StringLiteral") return attr.value.value
  if (attr.value.type === "JSXExpressionContainer") {
    const e = attr.value.expression
    if (e.type === "StringLiteral") return e.value
    if (e.type === "Identifier") return `{${e.name}}`
    if (e.type === "BooleanLiteral") return e.value
    return src.slice(e.start, e.end)
  }
  return src.slice(attr.value.start, attr.value.end)
}

const files = [...walk("src"), ...walk(".storybook")]
const consumers = []

for (const file of files) {
  const rel = file.replace(/\\/g, "/")
  if (rel.includes("/IconTile/IconTile.tsx") && rel.includes("/atoms/display/")) continue
  if (rel.endsWith("/atoms/display/IconTile/index.tsx")) continue
  if (rel.endsWith("/blocks/identity/IconTile/index.tsx")) continue
  const src = fs.readFileSync(file, "utf8")
  if (!src.includes("IconTile")) continue
  let ast
  try {
    ast = parse(src, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: true,
    })
  } catch {
    continue
  }
  const locals = new Map() // localName -> kind
  traverse(ast, {
    ImportDeclaration(p) {
      const kind = classifyImport(p.node.source.value)
      if (!kind) return
      for (const s of p.node.specifiers) {
        if (s.type === "ImportSpecifier") {
          const imported = s.imported.name
          if (imported === "IconTile" || imported === "IconComponent" || imported === "IconTileTone" || imported === "IconTileSize" || imported === "IconTileProps") {
            locals.set(s.local.name, { kind, imported, from: p.node.source.value })
          }
        }
      }
    },
    JSXOpeningElement(p) {
      const name = p.node.name
      const tag = name.type === "JSXIdentifier" ? name.name : null
      if (!tag) return
      const meta = locals.get(tag)
      if (!meta || meta.imported !== "IconTile") return
      const attrs = {}
      for (const a of p.node.attributes || []) {
        if (a.type !== "JSXAttribute" || !a.name) continue
        attrs[a.name.name] = attrValue(src, a)
      }
      const size = attrs.size === true ? "sm" : attrs.size || (meta.kind === "atom" ? "sm" : "md")
      // defaults: atom default size="sm" in impl; block default size="md"
      const sizeKey =
        typeof size === "string" && !size.startsWith("{")
          ? size
          : size === true
            ? meta.kind === "atom"
              ? "sm"
              : "md"
            : "dynamic"
      const map = SIZE_MAPS[meta.kind]
      const expectation =
        sizeKey !== "dynamic" && map[sizeKey]
          ? map[sizeKey]
          : { box: "dynamic", px: null, radius: "dynamic", note: `size=${size}` }
      const proposed =
        sizeKey !== "dynamic" && SIZE_MAPS.proposedCanonical[sizeKey]
          ? SIZE_MAPS.proposedCanonical[sizeKey]
          : null
      let migrationNote = null
      if (meta.kind === "block" && sizeKey === "sm") {
        migrationNote =
          "block sm is 48px/rounded-xl → must become canonical size=\"md\" (not sm)"
      } else if (meta.kind === "atom" && sizeKey === "md") {
        migrationNote =
          "atom md is 64px/round → canonical md is 48px/rounded-xl — CONFLICT / hold unless remapped to lg"
      } else if (meta.kind === "atom" && sizeKey === "lg") {
        migrationNote =
          "atom lg is 80px/round → canonical lg is 64px/rounded-2xl — CONFLICT"
      } else if (meta.kind === "block" && sizeKey === "md") {
        migrationNote =
          "block md is 64px/rounded-2xl → canonical md is 48px/rounded-xl — CONFLICT; likely needs lg"
      } else if (meta.kind === "block" && sizeKey === "lg") {
        migrationNote =
          "block lg is 80px/rounded-2xl → canonical lg is 64px/rounded-2xl — CONFLICT (px)"
      }

      const locked = isLockedPath(rel)
      const page = isPagePath(rel)
      consumers.push({
        consumer: rel,
        line: p.node.loc?.start.line,
        oldImportPath: meta.from,
        oldKind: meta.kind,
        sizeProp: size,
        sizeKey,
        actualRenderedBoxExpectation: expectation,
        radiusExpectation: expectation.radius,
        tone: attrs.tone ?? null,
        src: attrs.src != null,
        alt: attrs.alt ?? null,
        isSkeleton: attrs.isSkeleton === true || attrs.isSkeleton === "{true}" || String(attrs.isSkeleton || "").includes("isSkeleton"),
        iconPresent: attrs.icon != null,
        lockedVendorPageStatus: locked
          ? "nivo-or-nivoexpert-locked"
          : page
            ? "page-folder-likely"
            : "unlocked-candidate",
        migrationNote,
        proposedCanonicalIfLiteral: proposed,
        storybookTwinStory: rel.includes(".storybook/") ? rel : null,
      })
    },
  })
}

// type-only / JSDoc imports without JSX
const typeOnly = []
for (const file of files) {
  const rel = file.replace(/\\/g, "/")
  const src = fs.readFileSync(file, "utf8")
  if (!src.includes("IconTile")) continue
  if (consumers.some((c) => c.consumer === rel)) continue
  if (/from ["'][^"']*IconTile/.test(src) || /identity\/IconTile/.test(src) || /atoms\/display\/IconTile/.test(src)) {
    const m = src.match(/from ["']([^"']*IconTile[^"']*)["']/)
    typeOnly.push({
      consumer: rel,
      oldImportPath: m ? m[1] : "unknown",
      note: "import without open-tag IconTile JSX in this scan pass",
      lockedVendorPageStatus: isLockedPath(rel)
        ? "nivo-or-nivoexpert-locked"
        : isPagePath(rel)
          ? "page-folder-likely"
          : "unlocked-candidate",
    })
  }
}

const conflicts = consumers.filter((c) => c.migrationNote && c.migrationNote.includes("CONFLICT"))
const blockSmToMd = consumers.filter((c) => c.oldKind === "block" && c.sizeKey === "sm")
const locked = consumers.filter((c) => c.lockedVendorPageStatus === "nivo-or-nivoexpert-locked")
const pages = consumers.filter((c) => c.lockedVendorPageStatus === "page-folder-likely")

const inventory = {
  batch: "B31r-contract",
  phase: 1,
  editsAllowed: false,
  checkpoint: "18f84f5b",
  sizeMaps: SIZE_MAPS,
  proposedCanonicalMap: SIZE_MAPS.proposedCanonical,
  storybookIsBlueprint: true,
  storybookBlueprintNote:
    "SB atom IconTile uses size-10/16/20 + rounded-full for all sizes. Proposed map changes md/lg radius and remaps px — conflicts with both trees for md/lg.",
  consumerCount: consumers.length,
  typeOnlyOrProseImports: typeOnly.length,
  consumers,
  typeOnly,
  summary: {
    byOldKind: {
      atom: consumers.filter((c) => c.oldKind === "atom").length,
      block: consumers.filter((c) => c.oldKind === "block").length,
    },
    bySizeKey: consumers.reduce((acc, c) => {
      acc[c.sizeKey] = (acc[c.sizeKey] || 0) + 1
      return acc
    }, {}),
    lockedNivo: locked.length,
    pageFolderLikely: pages.length,
    blockSmMustBecomeMd: blockSmToMd.length,
    sizeMapConflicts: conflicts.length,
  },
  completionForecast: {
    canDeleteOldPaths: false,
    primaryBlockers: [
      "Nivo/Nivoexpert locked consumers of atom IconTile — cannot migrate; cannot delete atom path while live",
      "Proposed canonical md/lg disagree with BOTH current atom and block maps (px and/or radius) — many CONFLICT consumers",
      "Page-folder consumers of block IconTile cannot hit 0 warnings if edited for import/size remaps",
      "Atomic deletion impossible under no-forwarder + locked holds → batch must block/retract",
    ],
  },
  canonicalPathProposed: "src/components/composites/identity/IconTile (+ SB twin)",
  oldPaths: [
    "src/components/atoms/display/IconTile",
    ".storybook/components/atoms/display/IconTile",
    ".storybook/stories/atoms/display/IconTile",
    "src/components/blocks/identity/IconTile",
  ],
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b31r-contract-inventory.json",
  JSON.stringify(inventory, null, 2),
)
console.log(
  JSON.stringify(
    {
      consumers: consumers.length,
      locked: locked.length,
      pages: pages.length,
      conflicts: conflicts.length,
      blockSm: blockSmToMd.length,
      byKind: inventory.summary.byOldKind,
      bySize: inventory.summary.bySizeKey,
    },
    null,
    2,
  ),
)
