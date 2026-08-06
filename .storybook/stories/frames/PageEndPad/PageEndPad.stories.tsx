import type { Meta, StoryObj } from "@storybook/nextjs"
import { PageEndPad } from "@sb-components/frames/PageEndPad/PageEndPad"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PageEndPad` — trailing page-end breathing (`pb-6`) under a flush cluster.
 */

const meta: Meta<typeof PageEndPad> = {
    title: "Frames/PageEndPad/PageEndPad",
    component: PageEndPad,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PageEndPad>

/** Demo footer block. */
const FooterBlock = () => (
    <div data-tier="fixture" className="rounded-xl border border-default bg-surface p-3 text-sm">
        Footer cluster
    </div>
)

/** Default — trailing air under the body. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PageEndPad"
                tier="frame"
                leaf="Default"
                parts={[]}
                reason="padding.md refuses single-edge pads; a zero-gap reading∥footer track cannot take a sibling seam without inventing space. This frame names trailing-only page-end air so ContentPage never reaches for Box className."
                states={[
                    {
                        name: "Trailing pb-6",
                        why: "Body sits flush with what is above; only the bottom edge breathes.",
                        code: "<PageEndPad body={FooterBlock} />",
                        render: (
                            <div data-tier="fixture" className="border border-dashed border-default">
                                <PageEndPad body={FooterBlock} />
                                <div data-tier="fixture" className="bg-default/40 text-xs p-1">after pad</div>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
