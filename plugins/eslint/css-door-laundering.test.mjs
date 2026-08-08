/** Regression tests for CSS-door type-laundering enforcement. */
import test from "node:test"
import { RuleTester } from "eslint"
import tsParser from "@typescript-eslint/parser"
import { isLayoutOrPageFile, noCssDoorTypeLaundering } from "./css-door-laundering.mjs"

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

test("isLayoutOrPageFile matches layout and page trees", () => {
  if (!isLayoutOrPageFile("D:/repo/src/components/layouts/InnerLayout/component.tsx")) {
    throw new Error("expected src layout")
  }
  if (!isLayoutOrPageFile("D:/repo/.storybook/components/starci/layouts/InnerLayout/InnerLayout.tsx")) {
    throw new Error("expected SB layout")
  }
  if (!isLayoutOrPageFile("D:/repo/src/components/pages/HomePage/index.tsx")) {
    throw new Error("expected src page")
  }
  if (isLayoutOrPageFile("D:/repo/src/components/blocks/navigation/Navbar/index.tsx")) {
    throw new Error("blocks are not layout/page")
  }
})

test("no-css-door-type-laundering rejects utility hiding and shell inheritance", () => {
  tester.run("no-css-door-type-laundering", noCssDoorTypeLaundering, {
    valid: [
      {
        filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
        code: `
          import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
          export interface InnerLayoutProps {
            navbar: ComponentTypeWithSkeleton
            body: ComponentTypeWithSkeleton
            footer?: ComponentTypeWithSkeleton
            showFooter: boolean
          }
        `,
      },
      {
        filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
        code: `
          export const Shell = ({ navbar: NavbarSlot }: { navbar: () => null }) => (
            <div><NavbarSlot /></div>
          )
        `,
      },
      {
        filename: "D:/repo/src/components/blocks/navigation/Navbar/index.tsx",
        code: `
          export interface NavbarProps { onLogoPress: () => void }
          export const Navbar = (props: NavbarProps) => <nav />
        `,
      },
      {
        filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
        code: `
          type Keys = "id" | "label"
          export type Row = Pick<{ id: string; label: string; onPress: () => void }, Keys>
        `,
      },
    ],
    invalid: [
      {
        filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
        code: `
          import type { NavbarProps } from "@/components/blocks/navigation/Navbar"
          import type { FooterProps } from "@/components/blocks/navigation/Footer"
          export interface InnerLayoutProps extends Omit<NavbarProps, "className">, Omit<FooterProps, "className"> {
            showFooter: boolean
          }
        `,
        errors: [
          { messageId: "utilityHide" },
          { messageId: "shellInherit" },
          { messageId: "utilityHide" },
          { messageId: "shellInherit" },
        ],
      },
      {
        filename: "D:/repo/src/components/atoms/forms/Switch/index.tsx",
        code: `
          import type { ComponentProps } from "react"
          export type SwitchProps = Omit<ComponentProps<"button">, "className" | "classNames">
        `,
        errors: [{ messageId: "utilityHide" }],
      },
      {
        filename: "D:/repo/.storybook/components/starci/layouts/InnerLayout/InnerLayout.tsx",
        code: `
          import type { NavbarProps } from "@sb-components/starci/blocks/navigation/Navbar/Navbar"
          export interface InnerLayoutProps extends NavbarProps {
            showFooter: boolean
          }
        `,
        errors: [{ messageId: "shellInherit" }],
      },
      {
        filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
        code: `
          import type { NavbarProps } from "@/components/blocks/navigation/Navbar"
          export interface InnerLayoutProps {
            navbar: NavbarProps
            showFooter: boolean
          }
        `,
        errors: [{ messageId: "shellInherit" }],
      },
      {
        filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
        code: `
          export const Shell = (props: { bag: object }) => <Navbar {...props.bag} />
        `,
        errors: [{ messageId: "shellSpread" }],
      },
      {
        filename: "D:/repo/src/components/pages/HomePage/index.tsx",
        code: "type Safe = Omit<{ className?: string; label: string }, \"className\">",
        errors: [{ messageId: "utilityHide" }],
      },
      {
        filename: "D:/repo/src/components/blocks/example/Example.tsx",
        code: "type Safe = Omit<{ classNames?: string[]; label: string }, \"classNames\">",
        errors: [{ messageId: "utilityHide" }],
      },
    ],
  })
})
