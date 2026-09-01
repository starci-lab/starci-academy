import fs from "node:fs"

const m = JSON.parse(
  fs.readFileSync(
    ".artifacts/fe-refactor-audit/2026-08-08-manifest-blocks-domain.json",
    "utf8",
  ),
)

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

const MECHANICAL = new Set([
  "starci-fe/require-export-jsdoc",
  "starci-fe/prefer-arrow-export",
  "starci-fe/handler-on-prefix",
  "starci-fe/no-inline-parameter-type",
  "starci-fe/no-emoji-in-source",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/no-runtime-namespace",
  "starci-fe/no-inline-skeleton-branch",
])

const PRODUCT_EMOJI = new Set([
  "src/components/blocks/community/Discussion/constants.ts",
  "src/components/blocks/feed/ReactionBar/index.tsx",
  "src/components/blocks/learn/ReactionButton/types.ts",
])

const SKIP_RE =
  /nivo|nivoexpert|Mia-Mia|mia-mia|BlockAnatomy|MockInterviewSession|QuizSession|LearnLoopScroll|ContentAiChat|ArchitectureScene|\/resources\//i

const files = m.files
  .map((f) => ({
    path: f.path,
    safeRules: (f.safeRules || []).filter((r) => SAFE.has(r)),
    holdRules: f.holdRules || [],
    safeCount: f.safeCount,
  }))
  .filter((f) => f.safeRules.length && !SKIP_RE.test(f.path))

const sb = files.filter((f) => f.path.startsWith(".storybook"))
const srcMech = files.filter(
  (f) =>
    !f.path.startsWith(".storybook") &&
    f.safeRules.some((r) => MECHANICAL.has(r)),
)

const ranked = [...sb, ...srcMech]
const seen = new Set()
const pick = []
for (const f of ranked) {
  if (seen.has(f.path)) continue
  // Prefer product-emoji-only as hold later; still include if other mechanical rules present
  if (
    PRODUCT_EMOJI.has(f.path) &&
    f.safeRules.every((r) => r === "starci-fe/no-emoji-in-source")
  ) {
    continue
  }
  seen.add(f.path)
  pick.push(f)
  if (pick.length >= 40) break
}

const out = {
  files: pick.map((p) => p.path),
  details: pick,
  deferred: files
    .filter((f) => !seen.has(f.path))
    .map((f) => f.path),
  productEmojiHolds: [...PRODUCT_EMOJI],
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/_blocks-domain-burn-batch.json",
  JSON.stringify(out, null, 2),
)
console.log(
  JSON.stringify(
    {
      pick: pick.length,
      deferred: out.deferred.length,
      sb: pick.filter((p) => p.path.startsWith(".storybook")).length,
      paths: pick.map((p) => p.path),
    },
    null,
    2,
  ),
)
