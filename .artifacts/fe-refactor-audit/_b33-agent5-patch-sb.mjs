import fs from "node:fs"

const PAGE_PAD_ATTRS = `principle="page-pad"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."`

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

  s = s.replace(
    /return <Container size="(md|xl)" padding=\{6\} body=\{\(\) => ([^}]+)\} \/>/g,
    (_m, size, body) =>
      `return (
        <Container
            size="${size}"
            padding={6}
            ${PAGE_PAD_ATTRS}
            body={() => ${body}}
        />
    )`,
  )

  s = s.replace(
    /return <Container size="(md|xl)" padding=\{6\} isSkeleton=\{isSkeleton\} body=\{([^}]+)\} \/>/g,
    (_m, size, body) =>
      `return (
        <Container
            size="${size}"
            padding={6}
            ${PAGE_PAD_ATTRS}
            isSkeleton={isSkeleton}
            body={${body}}
        />
    )`,
  )

  s = s.replace(
    /<Container size="xl" padding=\{6\} body=\{\(\) => resultBody\} \/>/g,
    `<Container
                size="xl"
                padding={6}
                ${PAGE_PAD_ATTRS}
                body={() => resultBody}
            />`,
  )

  // Multiline openings: insert page-pad after padding={6} when principle absent nearby
  s = s.replace(
    /<Container(\r?\n\s*)size="(md|xl)"(\r?\n\s*)padding=\{6\}(?![\s\S]{0,120}?principle=)/g,
    (_m, a, size, b) =>
      `<Container${a}size="${size}"${b}padding={6}${a}${PAGE_PAD_ATTRS}`,
  )

  if (s !== before) {
    fs.writeFileSync(f, s)
    console.log("updated", f)
  } else {
    console.log("no change", f)
  }
}
