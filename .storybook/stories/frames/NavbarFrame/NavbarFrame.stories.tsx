import type { Meta, StoryObj } from "@storybook/nextjs"
import { NavbarFrame } from "@sb-components/frames/NavbarFrame/NavbarFrame"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `NavbarFrame` — semantic sticky nav landmark with border/surface chrome and
 * fixed 4rem primary row. Callers own content only via `primary` / `secondary`.
 */

const meta: Meta<typeof NavbarFrame> = {
    title: "Frames/NavbarFrame/NavbarFrame",
    component: NavbarFrame,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof NavbarFrame>

/** Demo primary bar content. */
const DemoPrimary = () => (
    <StackH
        principle="block-boundary"
        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
        items={[
            () => <Typography size="sm" weight="bold" text="Primary slot" />,
            () => <Typography size="xs" color="muted" text="Landmark + sticky chrome + h-16 belong to NavbarFrame." />,
        ]}
    />
)

/** Demo secondary region below the primary bar. */
const DemoSecondary = () => (
    <StackV
        principle="sibling-stack"
        explain="Same-kind peer stack of demo lines — not group-boundary, because these are repeating siblings rather than section groups."
        items={[
            () => <Typography size="xs" color="muted" text="Secondary slot (optional; does not change primary height)." />,
        ]}
    />
)

/** LEAF — landmark + chrome + fixed primary row; slots are the only caller API. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="bg-background">
            <BlockAnatomy
                name="NavbarFrame"
                tier="frame"
                leaf="Default"
                parts={[]}
                reason="FRAME landmark owner: `<nav>` + sticky/border/surface chrome + fixed `h-16 min-h-16` primary row. Sentence-tier Navbar blocks compose this frame; they must not render raw `<nav>` or restate the chrome classes."
                states={[
                    {
                        name: "primary only",
                        why: "Caller owns content only — landmark, sticky chrome, and primary row height stay on NavbarFrame.",
                        code: "<NavbarFrame primary={DemoPrimary} />",
                        render: <NavbarFrame primary={DemoPrimary} />,
                    },
                    {
                        name: "primary + secondary",
                        why: "Secondary sits below the primary row and does not change the fixed 4rem primary height.",
                        code: "<NavbarFrame primary={DemoPrimary} secondary={DemoSecondary} />",
                        render: <NavbarFrame primary={DemoPrimary} secondary={DemoSecondary} />,
                    },
                ]}
            />
        </div>
    ),
}
