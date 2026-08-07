/** Focused tests for public house-component CSS-door enforcement. */
import test from "node:test"
import { RuleTester } from "eslint"
import tsParser from "@typescript-eslint/parser"
import { noPublicClassNameProp } from "./public-contracts.mjs"

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

test("no-public-classname-prop closes public CSS doors and keeps vendor boundaries", () => {
  tester.run("no-public-classname-prop", noPublicClassNameProp, {
    valid: [
      {
        filename: "D:/repo/src/components/atoms/display/Badge/index.tsx",
        code: "type Props = { size: \"sm\" | \"md\" }\nexport const Badge = ({ size }: Props) => <span data-size={size} />",
      },
      {
        filename: "D:/repo/src/components/atoms/overlay/Modal/index.tsx",
        code: "import { Modal as HeroModal } from \"@heroui/react\"\nexport const ModalDialog = ({ className, ...props }) => <HeroModal.Dialog className={className} {...props} />",
      },
      {
        filename: "D:/repo/src/components/frames/Box/index.tsx",
        code: "export const Box = ({ className, children }) => <div className={className}>{children}</div>",
      },
      {
        filename: "D:/repo/src/components/blocks/example/Example.tsx",
        code: "type Props = { tone: \"quiet\" | \"loud\" }\nexport const Example = ({ tone }: Props) => <div data-tone={tone} />",
      },
      {
        filename: "D:/repo/src/components/composites/layout/DrawerShell/index.tsx",
        code: "import { DrawerDialog } from \"@/components/atoms/overlay/Drawer\"\nexport const Shell = () => <DrawerDialog className=\"sm:max-w-md\" />",
      },
      {
        filename: "D:/repo/src/components/pages/ExamplePage/index.tsx",
        code: "import { Box } from \"@/components/frames/Box\"\nexport const Page = () => <Box className=\"p-3\" />",
      },
    ],
    invalid: [
      {
        filename: "D:/repo/src/components/atoms/display/Badge/index.tsx",
        code: "interface BadgeProps { classNames?: string[] }\nexport const Badge = ({ classNames }: BadgeProps) => <span className={classNames?.join(\" \")} />",
        errors: [
          { messageId: "declaration" },
          { messageId: "declaration" },
        ],
      },
      {
        filename: "D:/repo/src/components/pages/ExamplePage/index.tsx",
        code: "import { Badge } from \"@/components/atoms/display/Badge\"\nexport const BadgeRow = () => <Badge classNames={[\"shrink-0\"]} />",
        errors: [{ messageId: "usage" }],
      },
    ],
  })
})
