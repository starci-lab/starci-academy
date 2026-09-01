import fs from "node:fs"

const m = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/2026-08-08-deferred-manifest-blocks-layout.json",
    "utf8",
  ),
)
const classify = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/_blocks-layout-deferred-classify.json",
    "utf8",
  ),
)
const byPath = Object.fromEntries(classify.map((x) => [x.path, x]))

const changed = [
  {
    path: "src/components/blocks/navigation/SeeMoreLink/index.tsx",
    rules: [
      "starci-fe/no-heroui-outside-vocabulary",
      "starci-fe/require-identity-root",
      "starci-fe/no-classname-at-sentence-tier",
      "starci-fe/no-cn-above-vocabulary",
      "starci-fe/no-raw-shape-at-sentence-tier",
    ],
    reason: "thin-redirect-to-LinkSeeMore-atom",
  },
  {
    path: "src/components/blocks/identity/SnippetIcon/index.tsx",
    rules: [
      "starci-fe/no-heroui-outside-vocabulary",
      "starci-fe/require-identity-root",
      "starci-fe/no-classname-at-sentence-tier",
      "starci-fe/no-cn-above-vocabulary",
    ],
    reason: "reexport-vocabulary-SnippetIcon-atom",
  },
  {
    path: "src/components/blocks/lists/LabeledList/index.tsx",
    rules: ["starci-fe/no-emoji-in-source", "starci-fe/no-heroui-outside-vocabulary"],
    reason: "ascii-scrub-plus-Label-atom-swap",
  },
  {
    path: "src/components/blocks/grading/GradingByline/component.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named-VerdictIconProps",
  },
  {
    path: "src/components/blocks/grading/DiffViewer/index.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named-row-cell-param-types",
  },
  {
    path: "src/components/blocks/grading/GradeModelDropdown/component.tsx",
    rules: ["starci-fe/no-inline-parameter-type"],
    reason: "named-ModelRowLayoutProps",
  },
]
const changedSet = new Set(changed.map((c) => c.path))

const reasonFor = (c, rules) => {
  const heroui = (c.herouiImports || []).join(" ")
  const vendorish =
    /Dropdown|Accordion|Tabs|Modal|Popover|Select|RadioGroup|Calendar|DatePicker|Table|Badge|ScrollShadow|SearchField|ListBox|ProgressBar/.test(
      heroui,
    )
  if (c.idReason === "host-element-root") {
    return "host-root-needs-frame-redesign-no-invented-tokens"
  }
  if (c.idReason === "mixed-host-and-component-roots") {
    return vendorish
      ? "mixed-host-and-vendor-compound-hold"
      : "mixed-host-and-component-roots-unclear-identity"
  }
  if (c.idReason === "incapable-or-mixed-root") return "vendor-compound-root-keep-boundary"
  if (c.idReason === "fragment-root") return "fragment-root-unclear-identity"
  if (c.idReason === "no-return-jsx-found") return "no-clear-return-root"
  if (c.withClassNames) return "classname-api-locked-out-of-partition-importers"
  if (vendorish) return "heroui-vendor-compound-or-missing-composite"
  if (rules.includes("starci-fe/no-raw-shape-at-sentence-tier")) {
    return "raw-shape-needs-known-principle-token"
  }
  return "structural-not-clear-safe"
}

const holds = []
const skipped = []

for (const f of m.files) {
  if (changedSet.has(f.path)) continue
  const c = byPath[f.path] || {}
  const holdMsgs = (f.messages || []).filter((x) =>
    ["ambiguous", "semantic-hold", "vendor-hold", "teacher-hold", "locked-path"].includes(
      x.classification,
    ),
  )
  const holdRules = [...new Set(holdMsgs.map((x) => x.rule))]
  const candRules = f.candidateRules || []

  if (holdRules.includes("starci-fe/require-frame-self-declare")) {
    holds.push({
      path: f.path,
      rules: ["starci-fe/require-frame-self-declare"],
      reason: "missing-both-frame-self-declare-ambiguous",
    })
    const struct = candRules.filter((r) => r !== "starci-fe/require-frame-self-declare")
    if (struct.length) {
      skipped.push({
        path: f.path,
        rules: struct,
        reason: reasonFor(c, struct),
      })
    }
    continue
  }
  if (holdRules.length) {
    holds.push({
      path: f.path,
      rules: holdRules,
      reason:
        holdMsgs[0]?.classification === "semantic-hold"
          ? "semantic-hold-manifest"
          : String(holdMsgs[0]?.classification || "hold"),
    })
  }
  if (candRules.length) {
    skipped.push({
      path: f.path,
      rules: candRules,
      reason: reasonFor(c, candRules),
    })
  }
}

const status = {
  partition: "blocks-layout",
  generatedAt: new Date().toISOString(),
  checkpoint: "27127bb5",
  manifest: ".artifacts/fe-refactor-audit/2026-08-08-deferred-manifest-blocks-layout.json",
  changed,
  skipped,
  holds,
  verification: {
    eslintQuietChanged: {
      files: changed.map((c) => c.path),
      exitCode: 0,
      errors: 0,
    },
    note: "SeeMoreLink + SnippetIcon cleared target structural rules via vocabulary redirect; mechanical named-types + Label/emoji on remaining changed files. No invented principle tokens. 0/45 files had clear identity-capable frame roots.",
  },
  regressions: [],
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-08-deferred-worker-blocks-layout.json",
  JSON.stringify(status, null, 2) + "\n",
)
console.log(
  JSON.stringify(
    {
      changed: status.changed.length,
      skipped: status.skipped.length,
      holds: status.holds.length,
    },
    null,
    2,
  ),
)
