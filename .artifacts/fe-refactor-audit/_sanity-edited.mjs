import fs from "node:fs"

const files = [
    "src/components/blocks/commerce/PhaseScarcityNote/component.tsx",
    "src/components/blocks/blog/PostRow/index.tsx",
    "src/components/blocks/course/CourseTrialChip/index.tsx",
    "src/components/pages/BlogListPage/FeaturedPost/index.tsx",
    "src/components/blocks/dashboard/JobReadinessWidget/index.tsx",
    "src/components/blocks/dashboard/WeeklyGoals/index.tsx",
    "src/components/blocks/learn/ChallengeScoreCard/index.tsx",
    "src/components/layouts/LearnShellLayout/index.tsx",
    "src/components/pages/SepayCheckoutPage/index.tsx",
    "src/components/pages/AdminUploadVideoPage/map.tsx",
    "src/components/pages/AdminUploadVideoPage/LoadingScreen/index.tsx",
]

for (const f of files) {
    const s = fs.readFileSync(f, "utf8")
    const badJoin = /Skeleton"import|Skeleton'import/.test(s)
    const heroui = /@heroui\/react/.test(s)
    const bareCn = heroui && /\bcn\b/.test(s)
    console.log(JSON.stringify({ f, heroui, bareCn, badJoin }))
}
