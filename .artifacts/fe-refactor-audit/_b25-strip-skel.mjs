import fs from "node:fs"

const files = [
  "src/components/blocks/commerce/TrialConversionStrip/component.tsx",
  "src/components/blocks/consultant/ConsultantProfileBody/index.tsx",
  "src/components/blocks/learn/ContinueCard/CardBody.tsx",
  "src/components/blocks/learn/FoundationHeader/index.tsx",
  "src/components/blocks/learn/LearnNudges/component.tsx",
  "src/components/blocks/learn/MockInterviewScorecard/index.tsx",
  "src/components/blocks/profile/ProfileLoadingState/index.tsx",
  "src/components/composites/lists/UserCell/index.tsx",
  "src/components/overlays/modals/PremiumGateModal/component.tsx",
  "src/components/pages/CommunityFeedPage/component.tsx",
  "src/components/pages/DashboardPage/DailyQuest/component.tsx",
  "src/components/pages/DashboardPage/StreakStrip/component.tsx",
]

let total = 0
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n")
  let n = 0
  const out = lines.map((line) => {
    if (line.includes("isSkeleton") && line.includes('classNames={["w-1/2"]}')) {
      const next = line.replace(/\s*classNames=\{\["w-1\/2"\]\}/, "")
      if (next !== line) n++
      return next
    }
    return line
  })
  if (n) {
    fs.writeFileSync(f, out.join("\n"))
    total += n
  }
  console.log(`${f}: ${n}`)
}
console.log("total", total)
