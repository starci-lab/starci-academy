import fs from "fs"

const invPath = ".artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.json"
const inv = JSON.parse(fs.readFileSync(invPath, "utf8"))

/** Proven by JSX-accurate consumer search (BATCH 20 pre-edit). */
const DEAD = [
  {
    file: ".storybook/components/composites/layout/DrawerShell/DrawerShell.tsx",
    prop: "classNames",
    classification: "dead",
    evidence: "Zero <DrawerShell classNames=> callers in src or .storybook",
  },
  {
    file: "src/components/composites/layout/DrawerShell/index.tsx",
    prop: "classNames",
    classification: "dead",
    evidence: "Zero <DrawerShell classNames=> callers",
  },
  {
    file: ".storybook/components/composites/layout/ModalShell/ModalShell.tsx",
    prop: "classNames",
    classification: "dead",
    evidence: "Zero layout consumers; AiQuotaModal forward is transitive-dead",
  },
  {
    file: "src/components/composites/layout/ModalShell/index.tsx",
    prop: "classNames",
    classification: "dead",
    evidence: "Zero <ModalShell classNames=> callers",
  },
  {
    file: ".storybook/components/composites/viewers/PDFView/PDFView.tsx",
    prop: "classNames",
    classification: "dead",
    evidence: "Zero callers; height contract owns sizing",
  },
  {
    file: "src/components/composites/viewers/PDFView/index.tsx",
    prop: "classNames",
    classification: "dead",
    evidence: "Zero callers; height contract owns sizing",
  },
  {
    file: "src/components/blocks/marketing/ShowcaseMockup/index.tsx",
    prop: "className",
    classification: "dead",
    evidence: "Zero <ShowcaseMockup className=> callers; contentClassName still live (hold)",
  },
  {
    file: "src/components/blocks/cards/LabeledCard/index.tsx",
    prop: "classNames/WithClassNames + className",
    classification: "dead",
    evidence: "Zero classNames callers; className only unused passthrough chain",
  },
]

const HOLDS = [
  {
    file: ".storybook/components/composites/layout/DrawerShell/DrawerShell.tsx",
    prop: "contentClassName",
    classification: "locked-or-teacher-hold",
    evidence: "nivoexpert LessonEditorPanel w-full sm:max-w-[560px]",
  },
  {
    file: "SurfaceCard.contentClassName / PressableGroup TILE_CHROME",
    classification: "ambiguous",
    evidence: "B19 ledger hold — not bodyVariant",
  },
  {
    file: "LabeledCard.contentClassName",
    classification: "parent-placement",
    evidence: "Live callers; prefer children StackV/Grid — not deleting this batch",
  },
  {
    file: "ShowcaseMockup.contentClassName",
    classification: "parent-placement",
    evidence: "TalentMarketplace + LearnLoopScroll live",
  },
]

const APPROVED = [
  {
    contract: "DrawerShell.dialogWidth/footerVariant",
    status: "implemented-b19",
    consumers: ["MiniCartDrawer"],
  },
  {
    contract: "ModalShell.viewportFit",
    status: "implemented-b19",
    consumers: ["CvPreviewModal"],
  },
  {
    contract: "PDFView.height",
    status: "implemented-b19",
    consumers: ["CvPreviewModal", "PDFView.stories"],
  },
  {
    contract: "SurfaceCard.bodyVariant",
    status: "keep-from-b19",
    evidence: "ContinueCard Item + Hero (≥2 identical tile consumers)",
  },
]

// Reclassify file entries that match dead list
const deadFiles = new Set(DEAD.map((d) => d.file.replace(/\\/g, "/")))
for (const f of inv.files) {
  if (deadFiles.has(f.file.replace(/\\/g, "/"))) {
    f.classification = "dead"
    f.allClassifications = ["dead", ...(f.allClassifications || []).filter((c) => c !== "dead")]
    f.b20Action = "remove-dead-public-door"
  }
}

inv.summary.provenDead = DEAD
inv.summary.holds = HOLDS
inv.summary.approvedContracts = APPROVED
inv.summary.classificationNote =
  "Pre-edit: path heuristic left most hits as ambiguous. provenDead were consumer-searched and are the B20 burn set. contentClassName holds and vendor internal forwards remain."

fs.writeFileSync(invPath, JSON.stringify(inv, null, 2))

const md = fs.readFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.md",
  "utf8",
)
const appendix = `

## Proven dead doors (consumer-searched, pre-edit)

| File | Prop | Evidence |
|---|---|---|
${DEAD.map((d) => `| \`${d.file}\` | \`${d.prop}\` | ${d.evidence} |`).join("\n")}

## Holds (do not delete this batch)

| Target | Classification | Evidence |
|---|---|---|
${HOLDS.map((h) => `| \`${h.file}\` | \`${h.classification}\` | ${h.evidence} |`).join("\n")}

## Approved contracts

| Contract | Status | Consumers |
|---|---|---|
${APPROVED.map((a) => `| \`${a.contract}\` | ${a.status} | ${(a.consumers || [a.evidence]).join(", ")} |`).join("\n")}
`

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-b20-classname-inventory.md",
  md + appendix,
)
console.log("inventory refined; dead=", DEAD.length)
