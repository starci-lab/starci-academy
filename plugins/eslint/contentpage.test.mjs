/**
 * Focused tests for ContentPage Box layout regression rule.
 *
 *   node --test plugins/eslint/contentpage.test.mjs
 */
import assert from "node:assert/strict"
import test from "node:test"
import { RuleTester } from "eslint"
import tsParser from "@typescript-eslint/parser"
import {
  isContentPageProductFile,
  noContentPageBoxClassName,
} from "./contentpage.mjs"

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

test("isContentPageProductFile matches ContentPage and ContentArticle product paths only", () => {
  assert.equal(
    isContentPageProductFile("src/components/pages/ContentPage/component.tsx"),
    true,
  )
  assert.equal(
    isContentPageProductFile(
      ".storybook/components/starci/pages/ContentPage/ContentPage.tsx",
    ),
    true,
  )
  assert.equal(
    isContentPageProductFile(
      "src/components/blocks/learn/ContentArticle/index.tsx",
    ),
    true,
  )
  assert.equal(
    isContentPageProductFile(
      ".storybook/components/starci/blocks/learn/ContentArticle/ContentArticle.tsx",
    ),
    true,
  )
  assert.equal(
    isContentPageProductFile(
      ".storybook/stories/starci/pages/ContentPage/ContentPage.stories.tsx",
    ),
    false,
  )
  assert.equal(
    isContentPageProductFile(
      ".storybook/stories/starci/blocks/learn/ContentArticle/ContentArticle.stories.tsx",
    ),
    false,
  )
  assert.equal(
    isContentPageProductFile("src/components/pages/OtherPage/component.tsx"),
    false,
  )
})

test("no-contentpage-box-classname rejects Box className on ContentPage/ContentArticle product files", () => {
  tester.run("no-contentpage-box-classname", noContentPageBoxClassName, {
    valid: [
      {
        filename: "src/components/pages/ContentPage/component.tsx",
        code: "const X = () => <Container size=\"md\" padding={6} body={() => null} />",
      },
      {
        filename: "src/components/pages/ContentPage/component.tsx",
        code: "const X = () => <Box principle=\"page-pad\" />",
      },
      {
        filename: "src/components/blocks/learn/ContentArticle/index.tsx",
        code: "const X = () => <LockedContentMask isLocked body={() => null} />",
      },
      {
        filename:
          ".storybook/stories/starci/pages/ContentPage/ContentPage.stories.tsx",
        code: "const X = () => <div className=\"p-8\"><Box className=\"pb-6\" /></div>",
      },
      {
        filename:
          ".storybook/stories/starci/blocks/learn/ContentArticle/ContentArticle.stories.tsx",
        code: "const X = () => <div className=\"p-8\"><Box className=\"relative\" /></div>",
      },
      {
        filename: "src/components/pages/OtherPage/component.tsx",
        code: "const X = () => <Box className=\"pb-6\" />",
      },
    ],
    invalid: [
      {
        filename: "src/components/pages/ContentPage/component.tsx",
        code: "const X = () => <Box className=\"pb-6\" />",
        errors: [{ messageId: "boxClass" }],
      },
      {
        filename:
          ".storybook/components/starci/pages/ContentPage/ContentPage.tsx",
        code: "const X = () => <Box className=\"@app-lg:hidden\" />",
        errors: [{ messageId: "boxClass" }],
      },
      {
        filename: "src/components/pages/ContentPage/component.tsx",
        code: "const X = () => <Box classNames={[\"w-full\"]} />",
        errors: [{ messageId: "boxClass" }],
      },
      {
        filename: "src/components/blocks/learn/ContentArticle/index.tsx",
        code: "const X = () => <Box className=\"select-none\" />",
        errors: [{ messageId: "boxClass" }],
      },
      {
        filename:
          ".storybook/components/starci/blocks/learn/ContentArticle/ContentArticle.tsx",
        code: "const X = () => <Box className=\"relative\" />",
        errors: [{ messageId: "boxClass" }],
      },
    ],
  })
})
