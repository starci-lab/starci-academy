/**
 * BATCH 13 — write heroui-boundaries worker status + seededDecisions.
 * No product source edits.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const scan = JSON.parse(fs.readFileSync(path.join(ART, "_heroui-boundary-scan.json"), "utf8"))
const manifestPath = path.join(ART, "2026-08-08-contract-manifest-heroui-boundaries.json")
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

/** Exact mismatch reasons keyed by HeroUI symbol. */
const MISMATCH = {
  cn: "cn is vocabulary-tier only; no sentence-tier atom/redirect — importing cn from @heroui/react cannot be swapped without redesign",
  Button:
    "Button atom requires `label` (or isIconOnly+prefixIcon+ariaLabel); forbids public className. HeroUI Button uses children and/or className — non-identical",
  Chip:
    "ChipBase hard-hold: atom uses `text`/`tone`/`dotColor|dotClassName`; HeroUI uses Chip.Label compound + children + color/variant — no ChipBase redesign",
  Typography:
    "Typography atom uses `text` + `size` axis; HeroUI Typography uses children + `type` (+ className) — non-identical",
  Card:
    "Card atom strips className/classNames and exports Card/CardContent only; HeroUI Card.Content/Footer compound + className — non-identical",
  Accordion:
    "Accordion atom is data-driven `items[]` over DisclosureGroup; HeroUI Accordion.* compound (Item/Heading/Trigger/Panel/Body) — vendor compound redesign forbidden",
  Alert:
    "Alert atom is Alert.* data props (title/description/body); HeroUI Alert.Indicator/Content/Title/Description compound + className — non-identical",
  Modal:
    "Modal is vendor compound (Backdrop/Container/Dialog/Header/Body); no identical non-compound atom drop-in — compound redesign forbidden",
  CloseButton:
    "No CloseButton atom; ElementCloseButton wraps HeroUI CloseButton with className — cannot migrate without new atom",
  ScrollShadow:
    "No ScrollShadow atom; HeroUI ScrollShadow + className has no identical vocabulary wrap",
  Tooltip:
    "Tooltip atom is Tooltip.Base with `label` + children trigger; HeroUI Tooltip.Trigger/Content compound + className — non-identical",
  Tabs:
    "Tabs atom is data-driven TabsBase/TabsExtended; HeroUI Tabs.ListContainer/List/Tab/Indicator compound — vendor compound redesign forbidden",
  ProgressBar:
    "Progress atom is Progress.Bar with value/max/color (Track/Fill internal); HeroUI ProgressBar.Track/Fill compound + className — non-identical",
  Spinner:
    "Spinner atom uses size/tone/label + classNames array; usage co-imported with non-identical Button/Typography/ProgressBar — cannot clear heroui import by Spinner alone",
}

function reasonFor(named, usages, pathRel) {
  const names = named.map((n) => String(n).split(" as ")[0])
  const parts = []

  if (names.length === 1 && names[0] === "cn") {
    return MISMATCH.cn
  }

  for (const n of names) {
    if (MISMATCH[n]) parts.push(`${n}: ${MISMATCH[n]}`)
    else if (n === "CloseButton") parts.push(MISMATCH.CloseButton)
    else parts.push(`${n}: no proven identical atom API`)
  }

  // ChipBase hard-hold callout
  if (names.includes("Chip") || /ChipBase|chips\//i.test(pathRel)) {
    if (!parts.some((p) => p.startsWith("Chip:"))) {
      parts.push(MISMATCH.Chip)
    }
  }

  // Compound evidence
  const compounds = usages.flatMap((u) => u.compounds || [])
  if (compounds.length) {
    parts.push(`compound usage observed: ${[...new Set(compounds)].slice(0, 12).join(", ")}`)
  }

  return parts.join(" | ")
}

const decisions = []
const holds = []

for (const row of scan) {
  const named = row.named
  const imports = named.map((n) => n.split(" as ")[0])
  const reason = reasonFor(named, row.usages, row.path)
  const id = `heroui-boundary:${row.path.replace(/^src\//, "").replace(/\//g, ".")}`

  decisions.push({
    id,
    classification: "vendor-boundary",
    path: row.path,
    imports,
    apply: false,
    reason,
  })

  holds.push({
    path: row.path,
    classification: "vendor-boundary",
    imports,
    reason,
  })

  // Co-located record-only messages stay held (other lanes)
  const fileEntry = manifest.files.find((f) => f.path === row.path)
  if (fileEntry) {
    const other = [
      ...new Set(
        fileEntry.messages
          .map((m) => m.classification)
          .filter((c) => c && c !== "vendor-boundary"),
      ),
    ]
    for (const c of other) {
      holds.push({
        path: row.path,
        classification: c,
        reason: `Co-located ${c} on heroui-boundaries file — record-only; no apply in this partition (identity/skeleton/ambiguous lanes)`,
      })
    }
  }
}

const worker = {
  partition: "heroui-boundaries",
  batch: 13,
  changed: [],
  skipped: [],
  holds,
  decisions,
  verification: {
    eslintQuiet: "skipped — no product code changes (Edit ONLY manifest files; 0 safe-consumer-migration)",
    safeConsumerMigrationCount: 0,
    vendorBoundaryCount: decisions.length,
    note: "BATCH 12 already proved HeroUI→atom APIs mostly non-identical. Re-audited all 30 files; every @heroui/react import has an exact API mismatch (children vs label/text, compound vs data-driven, cn vocabulary-only, ChipBase hard-hold, or missing atom). No ChipBase redesign; no vendor compound namespace redesign; no eslint-disable.",
  },
  regressions: [],
}

fs.writeFileSync(
  path.join(ART, "2026-08-08-contract-worker-heroui-boundaries.json"),
  JSON.stringify(worker, null, 2) + "\n",
)

manifest.seededDecisions = decisions.map((d) => ({
  id: d.id,
  classification: d.classification,
  path: d.path,
  imports: d.imports,
  reason: d.reason,
}))
manifest.generatedAt = new Date().toISOString()
manifest.workerClosedAt = new Date().toISOString()
manifest.closure = {
  batch: 13,
  apply: [],
  recordOnly: ["vendor-boundary"],
  changedCount: 0,
  decisionCount: decisions.length,
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n")

console.log("decisions", decisions.length)
console.log("holds", holds.length)
console.log("sample reasons:")
for (const d of decisions.slice(0, 5)) {
  console.log("-", d.path)
  console.log(" ", d.reason.slice(0, 160))
}
