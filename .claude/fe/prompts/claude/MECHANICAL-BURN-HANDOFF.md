# Mechanical burn handoff

The local Codex pass removed inline destructured parameter types from these
StarCi files:

- `src/components/blocks/cv/CvBlocksWorkspace/CvHtmlDocument/index.tsx`
- `src/components/blocks/learn/ConceptMap/RootNode/index.tsx`
- `src/components/blocks/learn/ConceptMap/index.tsx`
- `src/components/blocks/learn/FoundationCategoryList/index.tsx`
- `src/components/blocks/learn/QuizCard/index.tsx`
- `src/components/pages/LeaguePage/WeeklyBoard/component.tsx`

The targeted `starci-fe/no-inline-parameter-type` findings are cleared in
these files. They still contain unrelated semantic warnings and must not be
claimed as zero-warning files until their owning architectural contracts are
resolved.

The same pass removed safe emoji/comment authoring markers from the CV editor,
leaderboard, AI scope, toolbar, challenge, skeleton, and architecture comments.
Current `src` measurement is **5,444 warnings / 0 errors**. Remaining targeted
authoring debt is **19 inline parameter findings**, all in locked
`ArchitectureScene`/`LearnLoopScroll`, and **18 emoji findings**, mostly product
glyph/data or locked content.

Remaining authoring findings are not all mechanical. Emoji in reaction maps,
product glyph data, rich content, and locked sessions must remain held unless
an equivalent icon/token contract is already proven. Do not replace those
values with arbitrary text.

Storybook, mia-mia, Nivo, and Nivoexpert were retired in commit
`cca3a2ff2`; all active FE work now targets `src` only.
