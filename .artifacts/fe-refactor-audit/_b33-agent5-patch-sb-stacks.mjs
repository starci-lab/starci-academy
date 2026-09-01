import fs from "node:fs"

const files = [
  ".storybook/components/starci/pages/ChallengeResultPage/ChallengeResultPage.tsx",
  ".storybook/components/starci/pages/CourseQaPage/CourseQaPage.tsx",
  ".storybook/components/starci/pages/FlashcardReviewPage/FlashcardReviewPage.tsx",
  ".storybook/components/starci/pages/FoundationResourcePage/FoundationResourcePage.tsx",
  ".storybook/components/starci/pages/FoundationsCategoryPage/FoundationsCategoryPage.tsx",
  ".storybook/components/starci/pages/FoundationsGridPage/FoundationsGridPage.tsx",
  ".storybook/components/starci/pages/HeadhuntingsPage/HeadhuntingsPage.tsx",
  ".storybook/components/starci/pages/MockInterviewPage/MockInterviewPage.tsx",
  ".storybook/components/starci/pages/PlaygroundHubPage/PlaygroundHubPage.tsx",
  ".storybook/components/starci/pages/PlaygroundPreparePage/PlaygroundPreparePage.tsx",
  ".storybook/components/starci/pages/QuizPage/QuizPage.tsx",
  ".storybook/components/starci/pages/ContentPage/ContentPage.tsx",
  ".storybook/components/starci/pages/ModulePage/ModulePage.tsx",
]

for (const f of files) {
  let s = fs.readFileSync(f, "utf8")
  const before = s

  // Normalize page-pad explain indent to match principle indent
  s = s.replace(
    /(^[ \t]*)principle="page-pad"\r?\n[ \t]+explain=/gm,
    `$1principle="page-pad"\n$1explain=`,
  )

  // Insert layout-split after gap={7} when next non-empty attrs lack principle
  s = s.replace(
    /(<StackV\r?\n)([ \t]*)gap=\{7\}(\r?\n)(?![^<]*principle=)/g,
    `$1$2gap={7}$3$2principle="layout-split"$3$2explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."$3`,
  )

  s = s.replace(
    /(<StackV\r?\n)([ \t]*)gap=\{6\}(\r?\n)(?![^<]*principle=)/g,
    `$1$2gap={6}$3$2principle="block-boundary"$3$2explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."$3`,
  )

  if (s !== before) {
    fs.writeFileSync(f, s)
    console.log("updated", f)
  } else {
    console.log("no change", f)
  }
}
