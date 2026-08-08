import type { Meta, StoryObj } from "@storybook/nextjs"
import { Measure } from "@sb-components/frames/Measure/Measure"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Measure` — caps readable/content width at a named Tailwind scale step.
 */

const meta: Meta<typeof Measure> = {
    title: "Frames/Measure/Measure",
    component: Measure,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Measure>

/** Demo body for the width cap. */
const BrandCopy = () => (
    <Typography
        size="sm"
        color="muted"
        text="Learn by building real systems with your own hands — ready for any technical interview."
    />
)

/** LEAF prop `size` — Footer brand column uses `sm` (`max-w-sm`). */
export const Size: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Measure"
                tier="frame"
                leaf="Prop `size`"
                parts={[]}
                reason="Owns max-w-sm|md|lg for readable content width. Distinct from Container's max-w-app-* tokens."
                states={[
                    {
                        name: "size = 'sm'",
                        why: "Footer brand column — max-w-sm.",
                        code: "<Measure size=\"sm\" body={BrandCopy} />",
                        render: <Measure size="sm" body={BrandCopy} />,
                    },
                ]}
            />
        </div>
    ),
}
