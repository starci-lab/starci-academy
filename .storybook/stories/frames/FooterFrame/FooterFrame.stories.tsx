import type { Meta, StoryObj } from "@storybook/nextjs"
import { FooterFrame } from "@sb-components/frames/FooterFrame/FooterFrame"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FooterFrame` — semantic site-footer landmark with border/surface chrome and
 * canonical xl measure. Callers own content only via `body`.
 */

const meta: Meta<typeof FooterFrame> = {
    title: "Frames/FooterFrame/FooterFrame",
    component: FooterFrame,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FooterFrame>

/** Demo body for the footer measure. */
const DemoBody = () => (
    <StackV
        gap={3}
        principle="sibling-stack"
        explain="Same-kind peer stack of demo lines — not group-boundary, because these are repeating siblings rather than section groups."
        items={[
            () => <Typography size="sm" text="Footer body slot" />,
            () => <Typography size="xs" color="muted" text="Chrome and xl measure belong to FooterFrame." />,
        ]}
    />
)

/** LEAF — landmark + chrome + measure; body is the only caller slot. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="bg-background">
            <BlockAnatomy
                name="FooterFrame"
                tier="frame"
                leaf="Default"
                parts={[]}
                reason="FRAME landmark owner: `<footer>` + border/surface chrome + Container size=xl padding=6. Sentence-tier Footer blocks compose this frame; they must not render raw `<footer>` or restate the chrome classes."
                states={[
                    {
                        name: "body slot",
                        why: "Caller owns content only — landmark, border, background, and measure stay on FooterFrame.",
                        code: "<FooterFrame body={DemoBody} />",
                        render: <FooterFrame body={DemoBody} />,
                    },
                ]}
            />
        </div>
    ),
}
