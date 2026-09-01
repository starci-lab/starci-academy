/**
 * BATCH 13 — scan heroui-boundaries for HeroUI imports (fixed regex).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const manifest = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-08-contract-manifest-heroui-boundaries.json"), "utf8"),
)

function extractHeroImports(src) {
  const out = []
  // Match only the import clause that ends at @heroui/react
  const re = /import\s+((?:type\s+)?(?:[\w*{}\s,]+))\s+from\s+["']@heroui\/react["']/g
  let m
  while ((m = re.exec(src))) {
    out.push(m[1].replace(/\s+/g, " ").trim())
  }
  // Fallback: multiline with newlines inside braces
  const re2 = /import\s+([\s\S]*?)\s+from\s+["']@heroui\/react["']/g
  const found = []
  while ((m = re2.exec(src))) {
    const clause = m[1]
    // Reject if clause contains another `from "` (crossed imports)
    if (/from\s+["']/.test(clause)) continue
    found.push(clause.replace(/\s+/g, " ").trim())
  }
  return found.length ? found : out
}

function namedImports(spec) {
  const names = []
  if (/\*\s+as\s+(\w+)/.test(spec)) {
    names.push({ name: "*", local: RegExp.$1 })
  }
  const brace = spec.match(/\{([^}]*)\}/)
  if (brace) {
    for (const item of brace[1].split(",")) {
      const t = item.trim().replace(/^type\s+/, "")
      if (!t) continue
      const as = t.split(/\s+as\s+/)
      names.push({ name: as[0].trim(), local: (as[1] || as[0]).trim() })
    }
  }
  return names
}

function roughJsxProps(src, local) {
  const tags = []
  const re = new RegExp(`<${local}([.\\w]*)(\\s[^>]*)?>`, "g")
  let m
  while ((m = re.exec(src))) {
    const suffix = m[1] || ""
    const attrs = m[2] || ""
    const props = [...attrs.matchAll(/\b([A-Za-z_][\w]*)\s*=/g)].map((x) => x[1])
    tags.push({
      tag: local + suffix,
      props: [...new Set(props)],
      childrenLikely: !attrs.trimEnd().endsWith("/"),
    })
  }
  return tags
}

const ATOM_NOTES = {
  Button: "atom requires `label` (no children); HeroUI uses children + often className/fullWidth",
  Chip: "ChipBase hard-hold — atom uses label/tone/dotColor; HeroUI Chip.Label compound + children",
  Typography: "atom uses `text` + `size`; HeroUI uses children + `type`",
  Spinner: "atom size/tone/label; often nested differently than HeroUI Spinner",
  Accordion: "atom is data-driven items[]; HeroUI Accordion.* compound namespace",
  Card: "atom strips className/classNames; HeroUI Card often uses className + Card.Content compound",
  Link: "atom namespace is LinkBack/LinkSeeMore only — no general href Link",
  cn: "cn is vocabulary-only utility; no sentence-tier redirect/atom",
  CloseButton: "no CloseButton atom — ElementCloseButton wraps vendor CloseButton",
  ScrollShadow: "no ScrollShadow atom",
  Tooltip: "check Tooltip atom — often non-identical trigger/content API",
  Tabs: "HeroUI Tabs compound vs data-driven Tabs atom if any",
  ProgressBar: "HeroUI ProgressBar vs Progress atom — not drop-in",
  Modal: "Modal compound namespace — no identical atom swap",
  Alert: "check Alert atom API",
}

const rows = []
for (const f of manifest.files) {
  const abs = path.join(ROOT, f.path)
  const src = fs.readFileSync(abs, "utf8")
  const importSpecs = extractHeroImports(src)
  const named = importSpecs.flatMap(namedImports)
  const usages = named.map((n) => ({
    ...n,
    jsx: n.name === "*" ? [] : roughJsxProps(src, n.local),
    compounds:
      n.name === "*"
        ? [...new Set([...src.matchAll(new RegExp(`\\b${n.local}\\.(\\w+)`, "g"))].map((x) => x[0]))]
        : [...new Set([...src.matchAll(new RegExp(`\\b${n.local}\\.(\\w+)`, "g"))].map((x) => x[0]))],
  }))
  rows.push({
    path: f.path,
    importSpecs,
    named: named.map((n) => (n.name === n.local ? n.name : `${n.name} as ${n.local}`)),
    usages,
  })
}

fs.writeFileSync(path.join(ART, "_heroui-boundary-scan.json"), JSON.stringify(rows, null, 2))
for (const r of rows) {
  console.log(r.path)
  console.log("  ", r.named.join(", ") || "(NO HEROUI IMPORT — false positive?)")
  for (const u of r.usages) {
    if (u.compounds?.length) console.log("    compounds:", u.compounds.join(", "))
    for (const j of u.jsx || []) {
      console.log(`    <${j.tag}> props=[${j.props.join(",")}] children=${j.childrenLikely}`)
    }
  }
}
