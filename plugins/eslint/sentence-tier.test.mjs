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
      ],
    },
  )
})
