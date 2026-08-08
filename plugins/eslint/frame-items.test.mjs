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
      {
        // One child inside a fragment is still one typed item.
        code: "const View = () => <StackH items={[() => <><Title /></>]} />",
      },
      {
        code: "const View = () => <Grid items={[() => <Title />, () => <Body />]} />",
      },
      {
        // Documented gap: React.Fragment JSX member is not a JSXFragment node.
        code: "const View = () => <StackV items={[() => <React.Fragment><Title /><Body /></React.Fragment>]} />",
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
      {
        code: "const View = () => <StackH items={[() => <><Left /><Right /></>]} />",
        errors: [{ messageId: "fragment" }],
      },
      {
        code: "const pair = <><A /><B /></>; const View = () => <StackV items={[() => pair]} />",
        errors: [{ messageId: "fragment" }],
      },
    ],
  })
})
