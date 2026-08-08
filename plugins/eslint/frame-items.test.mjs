/** Tests for typed frame item integrity. */
import test from "node:test"
import { RuleTester } from "eslint"
import tsParser from "@typescript-eslint/parser"
import { noFrameFragmentItem } from "./frame-items.mjs"

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

test("no-frame-fragment-item rejects fragment laundering", () => {
  tester.run("no-frame-fragment-item", noFrameFragmentItem, {
    valid: [
      {
        code: "const View = () => <StackV items={[() => <Title />, () => <Body />]} />",
      },
      {
        code: "const View = () => <StackV items={[() => <StackV items={[() => <Title />, () => <Body />]} />]} />",
      },
    ],
    invalid: [
      {
        code: "const View = () => <StackV items={[() => <><Title /><Body /></>]} />",
        errors: [{ messageId: "fragment" }],
      },
      {
        code: "const offer = <><Title /><Body /></>; const View = () => <Grid items={[() => offer]} />",
        errors: [{ messageId: "fragment" }],
      },
    ],
  })
})
