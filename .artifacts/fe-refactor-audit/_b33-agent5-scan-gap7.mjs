import fs from "node:fs"

const srcFiles = [
  "src/components/pages/ChallengeResultPage/component.tsx",
  "src/components/pages/CourseQaPage/component.tsx",
  "src/components/pages/FoundationResourcePage/component.tsx",
  "src/components/pages/FoundationsCategoryPage/component.tsx",
  "src/components/pages/FoundationsGridPage/component.tsx",
  "src/components/pages/HeadhuntingsPage/component.tsx",
  "src/components/pages/LeaderboardPage/component.tsx",
]

const sbFiles = [
  ".storybook/components/starci/pages/ChallengeResultPage/ChallengeResultPage.tsx",
  ".storybook/components/starci/pages/CourseQaPage/CourseQaPage.tsx",
  ".storybook/components/starci/pages/FoundationResourcePage/FoundationResourcePage.tsx",
  ".storybook/components/starci/pages/FoundationsCategoryPage/FoundationsCategoryPage.tsx",
  ".storybook/components/starci/pages/FoundationsGridPage/FoundationsGridPage.tsx",
  ".storybook/components/starci/pages/HeadhuntingsPage/HeadhuntingsPage.tsx",
  ".storybook/components/starci/pages/FlashcardReviewPage/FlashcardReviewPage.tsx",
  ".storybook/components/starci/pages/MockInterviewPage/MockInterviewPage.tsx",
  ".storybook/components/starci/pages/QuizPage/QuizPage.tsx",
]

for (const f of [...srcFiles, ...sbFiles]) {
  const s = fs.readFileSync(f, "utf8")
  const m = [...s.matchAll(/gap=\{7\}[\s\S]{0,200}?principle="([^"]+)"/g)]
  console.log(f, m.map((x) => x[1]).join(",") || "(none)")
}
