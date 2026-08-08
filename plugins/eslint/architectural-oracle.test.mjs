/**
 * B32 oracle: positive/negative regression for priority architectural rules
 * that lived only in the index.mjs monolith without dedicated coverage.
 *
 *   node --test plugins/eslint/architectural-oracle.test.mjs
 */
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
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

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..")
const pageWithSiblingIndex = join(
  repoRoot,
  "src/components/pages/AiSubscriptionPage/index.tsx",
).replace(/\\/g, "/")

test("require-frame-self-declare demands principle + explain above atoms/frames", () => {
  tester.run(
    "require-frame-self-declare",
    starciFe.rules["require-frame-self-declare"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: `
            export const Example = () => (
              <StackV
                principle="block-boundary"
                explain="Owns the block body seam so header and content stay stacked when the card width collapses."
                items={[]}
              />
            )
          `,
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = () => <StackV {...frameProps} />",
        },
        {
          filename: "D:/repo/src/components/atoms/display/Badge/index.tsx",
          code: "export const Badge = () => <StackV items={[]} />",
        },
        {
          filename: "D:/repo/src/components/frames/Stack/index.tsx",
          code: "export const StackV = (props) => <div {...props} />",
        },
        {
          filename: "D:/repo/.storybook/components/frames/Stack/Stack.tsx",
          code: "export const Demo = () => <StackV items={[]} />",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = () => <StackV items={[]} />",
          errors: [{ messageId: "missing", data: { name: "StackV" } }],
        },
        {
          filename: "D:/repo/src/components/composites/layout/Shell/index.tsx",
          code: `
            export const Shell = () => (
              <Grid
                explain="Keeps the form and preview side by side until the preview overflows."
                items={[]}
              />
            )
          `,
          errors: [{ messageId: "noPrinciple", data: { name: "Grid" } }],
        },
        {
          filename: "D:/repo/src/components/pages/HomePage/component.tsx",
          code: `
            export const HomePage = () => (
              <StackH principle="layout-split" items={[]} />
            )
          `,
          errors: [{ messageId: "noExplain", data: { name: "StackH" } }],
        },
        {
          filename: "D:\\repo\\src\\components\\blocks\\example\\Example\\index.tsx",
          code: "export const Example = () => <Cluster items={[]} />",
          errors: [{ messageId: "missing", data: { name: "Cluster" } }],
        },
      ],
    },
  )
})

test("require-identity-root demands identity on sentence component.tsx / lone index.tsx", () => {
  tester.run(
    "require-identity-root",
    starciFe.rules["require-identity-root"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/component.tsx",
          code: `
            export const Footer = () => (
              <FooterFrame identity={{ tier: "block", component: "Footer" }} body={() => null} />
            )
          `,
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/index.tsx",
          code: `
            export const Footer = () => (
              <FooterFrame identity={{ tier: "block", component: "Footer" }} body={() => null} />
            )
          `,
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/map.ts",
          code: "export const map = () => null",
        },
        {
          filename: "D:/repo/src/components/atoms/display/Badge/index.tsx",
          code: "export const Badge = () => <span />",
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/component.tsx",
          code: "export const Footer = () => null",
        },
        {
          // Block-body bare fragment is correctly skipped (ReturnStatement path).
          filename: "D:/repo/src/components/blocks/navigation/Footer/component.tsx",
          code: "export const Footer = () => { return <></> }",
        },
        {
          // Real sibling: index.tsx is wiring when component.tsx owns identity.
          filename: pageWithSiblingIndex,
          code: "export { AiSubscriptionPage } from \"./component\"",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/component.tsx",
          code: `
            export const Footer = () => (
              <FooterFrame body={() => null} />
            )
          `,
          errors: [{ messageId: "identity" }],
        },
        {
          filename: "D:/repo/src/components/pages/HomePage/component.tsx",
          code: "export default function HomePage() { return <HomeShell /> }",
          errors: [{ messageId: "identity" }],
        },
        {
          filename: "D:\\repo\\src\\components\\layouts\\InnerLayout\\component.tsx",
          code: "export const InnerLayout = () => <InnerShell />",
          errors: [{ messageId: "identity" }],
        },
        {
          filename: "D:/repo/src/components/overlays/modals/Confirm/index.tsx",
          code: "export const Confirm = () => <ConfirmShell />",
          errors: [{ messageId: "identity" }],
        },
        {
          // Known false positive: expression-body `() => <></>` has JSXFragment but no
          // ReturnStatement, so the bare-return skip never runs.
          filename: "D:/repo/src/components/blocks/navigation/Footer/component.tsx",
          code: "export const Footer = () => <></>",
          errors: [{ messageId: "identity" }],
        },
      ],
    },
  )
})

test("no-heroui-outside-vocabulary bans vendor imports at sentence tier only", () => {
  tester.run(
    "no-heroui-outside-vocabulary",
    starciFe.rules["no-heroui-outside-vocabulary"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/atoms/buttons/Button/ButtonBase.tsx",
          code: "import { Button } from \"@heroui/react\"\nexport const ButtonBase = Button",
        },
        {
          filename: "D:/repo/src/components/frames/Stack/index.tsx",
          code: "import { Button } from \"@heroui/react\"\nexport const X = Button",
        },
        {
          filename: "D:/repo/src/components/composites/feedback/Callout/index.tsx",
          code: "import { Alert } from \"@heroui/react\"\nexport const Callout = Alert",
        },
        {
          filename: "D:/repo/src/hooks/useTheme.ts",
          code: "import { useTheme } from \"@heroui/react\"",
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/index.tsx",
          code: "import { FooterFrame } from \"@/components/frames/FooterFrame\"",
        },
        {
          // Storybook sentence trees are outside componentTier() today.
          filename: "D:/repo/.storybook/components/starci/blocks/navigation/Footer/Footer.tsx",
          code: "import { Button } from \"@heroui/react\"",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/index.tsx",
          code: "import { Button } from \"@heroui/react\"",
          errors: [{ messageId: "heroui" }],
        },
        {
          filename: "D:/repo/src/components/pages/HomePage/component.tsx",
          code: "import { Modal } from \"@heroui/react\"",
          errors: [{ messageId: "heroui" }],
        },
        {
          filename: "D:\\repo\\src\\components\\layouts\\InnerLayout\\component.tsx",
          code: "import { Navbar } from \"@heroui/react\"",
          errors: [{ messageId: "heroui" }],
        },
        {
          filename: "D:/repo/src/components/overlays/modals/Confirm/index.tsx",
          code: "import { Modal } from \"@heroui/react\"",
          errors: [{ messageId: "heroui" }],
        },
      ],
    },
  )
})

test("page-folder-two-files-only keeps screen folders to component.tsx + index.tsx", () => {
  tester.run(
    "page-folder-two-files-only",
    starciFe.rules["page-folder-two-files-only"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/pages/HomePage/component.tsx",
          code: "export const HomePage = () => null",
        },
        {
          filename: "D:/repo/src/components/pages/HomePage/index.tsx",
          code: "export { HomePage } from \"./component\"",
        },
        {
          filename: "D:/repo/src/components/layouts/InnerLayout/component.tsx",
          code: "export const InnerLayout = () => null",
        },
        {
          filename: "D:/repo/src/components/overlays/modals/Confirm/index.tsx",
          code: "export const Confirm = () => null",
        },
        {
          filename: "D:/repo/src/components/blocks/navigation/Footer/map.ts",
          code: "export const map = {}",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/pages/HomePage/map.ts",
          code: "export const map = {}",
          errors: [{
            messageId: "extra",
            data: { tier: "pages", name: "HomePage", rest: "map.ts" },
          }],
        },
        {
          filename: "D:/repo/src/components/layouts/InnerLayout/helpers.ts",
          code: "export const helpers = {}",
          errors: [{
            messageId: "extra",
            data: { tier: "layouts", name: "InnerLayout", rest: "helpers.ts" },
          }],
        },
        {
          filename: "D:\\repo\\src\\components\\overlays\\modals\\Confirm\\SignInSection\\index.tsx",
          code: "export const SignInSection = () => null",
          errors: [{
            messageId: "extra",
            data: { tier: "overlays", name: "Confirm", rest: "SignInSection/index.tsx" },
          }],
        },
      ],
    },
  )
})

test("no-parallel-skeleton rejects hand-kept skeleton trees", () => {
  tester.run(
    "no-parallel-skeleton",
    starciFe.rules["no-parallel-skeleton"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "import { Skeleton } from \"./Skeleton\"\nexport const Example = ({ isSkeleton }) => <Card isSkeleton={isSkeleton} />",
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "import { AccordionSkeleton } from \"@/components/blocks/skeleton/AccordionSkeleton\"",
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = ({ skeletonLabel }) => <span>{skeletonLabel}</span>",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = () => <Panel skeleton={<RowSkeleton />} />",
          errors: [{ messageId: "prop" }],
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "import { ExampleSkeleton } from \"./ExampleSkeleton\"",
          errors: [{ messageId: "import", data: { name: "ExampleSkeleton" } }],
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "import ExampleSkeleton from \"../ExampleSkeleton\"",
          errors: [{ messageId: "import", data: { name: "ExampleSkeleton" } }],
        },
      ],
    },
  )
})

test("no-inline-skeleton-branch rejects different elements under isSkeleton ternaries", () => {
  tester.run(
    "no-inline-skeleton-branch",
    starciFe.rules["no-inline-skeleton-branch"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = ({ isSkeleton }) => isSkeleton ? <Card isSkeleton /> : <Card />",
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = ({ isLoading }) => isLoading ? <Spinner /> : null",
        },
        {
          filename: "D:/repo/src/components/atoms/display/Badge/index.tsx",
          code: "export const Badge = ({ isSkeleton }) => isSkeleton ? <Skeleton /> : <BadgeInner />",
        },
        {
          filename: "D:/repo/.storybook/components/starci/blocks/example/Example.tsx",
          code: "export const Example = ({ isSkeleton }) => isSkeleton ? <A /> : <B />",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = ({ isSkeleton }) => isSkeleton ? <CardSkeleton /> : <Card />",
          errors: [{ messageId: "branch" }],
        },
        {
          filename: "D:/repo/src/components/pages/HomePage/component.tsx",
          code: "export const HomePage = ({ isLoading }) => isLoading ? <HomeSkeleton /> : <HomeBody />",
          errors: [{ messageId: "branch" }],
        },
        {
          filename: "D:\\repo\\src\\components\\composites\\feedback\\Callout\\index.tsx",
          code: "export const Callout = ({ isPending }) => isPending ? <>...</> : <CalloutBody />",
          errors: [{ messageId: "branch" }],
        },
      ],
    },
  )
})

test("no-skeleton-twin-component rejects hand-mirrored *Skeleton folders outside primitives", () => {
  tester.run(
    "no-skeleton-twin-component",
    starciFe.rules["no-skeleton-twin-component"],
    {
      valid: [
        {
          filename: "D:/repo/src/components/blocks/skeleton/AccordionSkeleton/index.tsx",
          code: "export const AccordionSkeleton = () => null",
        },
        {
          filename: "D:/repo/src/components/atoms/display/Skeleton/index.tsx",
          code: "export const Skeleton = () => null",
        },
        {
          filename: "D:/repo/src/components/blocks/example/Example/index.tsx",
          code: "export const Example = ({ isSkeleton }) => <Card isSkeleton={isSkeleton} />",
        },
        {
          filename: "D:/repo/.storybook/components/starci/blocks/example/ExampleSkeleton.tsx",
          code: "export const ExampleSkeleton = () => null",
        },
      ],
      invalid: [
        {
          filename: "D:/repo/src/components/blocks/example/ExampleSkeleton/index.tsx",
          code: "export const ExampleSkeleton = () => null",
          errors: [{ messageId: "twin", data: { name: "ExampleSkeleton" } }],
        },
        {
          filename: "D:/repo/src/components/pages/HomePage/HomeSkeleton.tsx",
          code: "export const HomeSkeleton = () => null",
          errors: [{ messageId: "twin", data: { name: "HomeSkeleton" } }],
        },
        {
          filename: "D:\\repo\\src\\components\\composites\\feedback\\CalloutSkeleton\\index.tsx",
          code: "export const CalloutSkeleton = () => null",
          errors: [{ messageId: "twin", data: { name: "CalloutSkeleton" } }],
        },
      ],
    },
  )
})
