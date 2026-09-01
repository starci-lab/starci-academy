import fs from "node:fs"

const after = JSON.parse(
  fs.readFileSync(".artifacts/_b35-a7-eslint-after.json", "utf8"),
)
const beforeScan = JSON.parse(
  fs.readFileSync(".artifacts/_b35-a7-scan.json", "utf8"),
)

const normalize = (p) =>
  p.replace(/\\/g, "/").replace(/^.*?starci-academy\//, "")

const afterBy = {}
for (const r of after) {
  const key = normalize(r.filePath || "")
  const rules = {}
  for (const m of r.messages || []) {
    if (!m.ruleId || !String(m.ruleId).startsWith("starci-fe/")) continue
    rules[m.ruleId] = (rules[m.ruleId] || 0) + 1
  }
  afterBy[key] = rules
}

const beforeBy = Object.fromEntries(
  beforeScan.ranked.map((x) => [x.f, x.rules]),
)

const keys = [
  ...new Set([...Object.keys(beforeBy), ...Object.keys(afterBy)]),
].filter((k) =>
  [
    "ConsultantCard",
    "ConsultantDirectoryCompanySearch",
    "ConsultantDirectoryGrid",
    "ProfileLoadingState",
    "ProfileHero",
    "CvSubmission",
    "ProfileSectionGuard",
    "CvSplitFromTextModal",
    "CvTailorToJobModal",
    "CvTemplateGalleryModal",
    "AchievementBlockEditor",
    "PersonalBlockEditor",
    "GradeCreditCaption",
    "ShareProfileButton",
  ].some((n) => k.includes(n)),
)

const rows = []
for (const k of keys.sort()) {
  const b = beforeBy[k] || {}
  const a = afterBy[k] || {}
  const bt = Object.values(b).reduce((x, y) => x + y, 0)
  const at = Object.values(a).reduce((x, y) => x + y, 0)
  rows.push({ file: k, before: bt, after: at, delta: at - bt, beforeRules: b, afterRules: a })
}
fs.writeFileSync(".artifacts/_b35-a7-delta.json", JSON.stringify(rows, null, 2))
console.log(JSON.stringify(rows, null, 2))
