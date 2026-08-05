import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label } from "@sb-components/atoms/forms/Label/Label"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Label> = {
    title: "Atoms/Forms/Label/Label",
    component: Label,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Label>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Label"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<Label />",
                    render: (<Label>Section</Label>),
                }]}
            />
        </div>
    ),
}
