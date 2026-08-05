import type { Meta, StoryObj } from "@storybook/nextjs"
import { Radio } from "@sb-components/atoms/forms/Radio/Radio"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Radio> = {
    title: "Atoms/Forms/Radio/Radio",
    component: Radio,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Radio>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Radio"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<Radio />",
                    render: (<Radio value="a">Option</Radio>),
                }]}
            />
        </div>
    ),
}
