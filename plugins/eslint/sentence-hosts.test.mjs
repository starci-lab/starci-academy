/** Regression tests for sentence-tier host ownership. */
import test from "node:test"
import { RuleTester } from "eslint"
import tsParser from "@typescript-eslint/parser"
import starciFe from "./index.mjs"
import { isSentenceTierFile } from "./sentence-hosts.mjs"

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

test("isSentenceTierFile matches src and Storybook sentence trees", () => {
  if (!isSentenceTierFile("D:/repo/src/components/blocks/navigation/Footer/index.tsx")) {
    throw new Error("expected src block")
  }
  if (!isSentenceTierFile("D:/repo/.storybook/components/starci/blocks/navigation/Footer/Footer.tsx")) {
    throw new Error("expected SB starci block")
  }
  if (!isSentenceTierFile("D:/repo/.storybook/components/nivo/blocks/landing/Footer/Footer.tsx")) {
    throw new Error("expected SB nivo block")
  }
  if (isSentenceTierFile("D:/repo/src/components/frames/FooterFrame/index.tsx")) {
    throw new Error("frames are vocabulary")
  }
  if (isSentenceTierFile("D:/repo/src/components/atoms/text/Typography/index.tsx")) {
    throw new Error("atoms are vocabulary")
  }
})

test("no-host-element-at-sentence-tier rejects raw structural hosts", () => {
  tester.run(
    "no-host-element-at-sentence-tier",
    starciFe.rules["no-host-element-at-sentence-tier"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/index.tsx",
          code: `
            import { FooterFrame } from "@/components/frames/FooterFrame"
            import { StackV } from "@/components/frames/Stack"
            export const Footer = () => (
              <FooterFrame
                identity={{ tier: "block", component: "Footer" }}
                body={() => <StackV principle="block-boundary" items={[]} />}
              />
            )
          `,
        },
        {
          filename: "D:/repo/src/components/frames/FooterFrame/index.tsx",
          code: "export const FooterFrame = () => <footer className=\"border-t\" />",
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/index.tsx",
          code: "export const Footer = () => <span className=\"inline-flex\">ok</span>",
        },
        {
          filename: "D:/repo/.storybook/components/starci/blocks/navigation/Footer/Footer.tsx",
          code: `
            import { FooterFrame } from "@sb-components/frames/FooterFrame/FooterFrame"
            export const Footer = () => <FooterFrame body={() => null} />
          `,
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/index.tsx",
          code: "export const Footer = () => <footer className=\"border-t bg-surface\" />",
          errors: [{ messageId: "host", data: { tag: "footer" } }],
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/index.tsx",
          code: "export const Footer = () => <div className=\"max-w-sm\" />",
          errors: [{ messageId: "host", data: { tag: "div" } }],
        },
        {
          filename: "D:/repo/.storybook/components/starci/blocks/navigation/Footer/Footer.tsx",
          code: "export const Footer = () => <div className=\"hidden @app-md:flex\" />",
          errors: [{ messageId: "host", data: { tag: "div" } }],
        },
        {
          filename: "D:/repo/src/components/pages/LeaderboardPage/component.tsx",
          code: "export const LeaderboardPage = () => <main><section /></main>",
          errors: [
            { messageId: "host", data: { tag: "main" } },
            { messageId: "host", data: { tag: "section" } },
          ],
        },
        {
          filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
          code: "export const InnerLayout = () => <aside />",
          errors: [{ messageId: "host", data: { tag: "aside" } }],
        },
        {
          filename: "D:/repo/src/components/overlays/modals/Confirm/index.tsx",
          code: "export const Confirm = () => <nav />",
          errors: [{ messageId: "host", data: { tag: "nav" } }],
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Navbar/index.tsx",
          code: "export const Navbar = () => <header />",
          errors: [{ messageId: "host", data: { tag: "header" } }],
        },
      ],
    },
  )
})
