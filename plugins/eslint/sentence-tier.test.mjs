/** Regression tests for sentence-tier semantic ownership. */
import test from "node:test"
import { RuleTester } from "eslint"
import tsParser from "@typescript-eslint/parser"
import starciFe from "./index.mjs"

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

test("no-raw-shape-at-sentence-tier rejects private raw layout after a CSS door is removed", () => {
  tester.run(
    "no-raw-shape-at-sentence-tier",
    starciFe.rules["no-raw-shape-at-sentence-tier"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
          code: `
            import { StackV } from "@/components/frames/Stack"
            export const LeaderboardListCard = ({ items }) => (
              <StackV principle="sibling-stack" items={items} />
            )
          `,
        },
        {
          filename: "D:/repo/src/components/atoms/display/Badge/index.tsx",
          code: "export const Badge = () => <span className=\"inline-flex items-center\" />",
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = () => <span className=\"sr-only\">label</span>",
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = () => <span className=\"size-4\" />",
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = () => <div className=\"rounded-md bg-surface\" />",
        },
        {
          // componentTier() is src-only today — Storybook sentence files are out of scope.
          filename: "D:/repo/.storybook/components/starci/blocks/example/Example.tsx",
          code: "export const Example = () => <div className=\"flex gap-3\" />",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
          code: `
            export const LeaderboardListCard = ({ items }) => (
              <div className="flex flex-col gap-3">{items}</div>
            )
          `,
          errors: [{ messageId: "shape" }],
        },
        {
          filename: "D:/repo/src/components/pages/HomePage/component.tsx",
          code: "export const HomePage = () => <section className=\"grid gap-6\" />",
          errors: [{ messageId: "shape" }],
        },
        {
          filename: "D:\\repo\\src\\components\\layouts\\InnerLayout\\component.tsx",
          code: "export const InnerLayout = () => <div className=\"md:flex absolute inset-0\" />",
          errors: [{ messageId: "shape" }],
        },
        {
          filename: "D:/repo/src/components/overlays/modals/Confirm/index.tsx",
          code: "export const Confirm = () => <div className=\"items-center justify-between\" />",
          errors: [{ messageId: "shape" }],
        },
      ],
    },
  )
})
