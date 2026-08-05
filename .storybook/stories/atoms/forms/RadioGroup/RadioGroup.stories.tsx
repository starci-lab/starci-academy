import type { Meta, StoryObj } from "@storybook/nextjs"
import { RadioGroup } from "@sb-components/atoms/forms/RadioGroup/RadioGroup"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof RadioGroup> = {
    title: "Atoms/Forms/RadioGroup/RadioGroup",
    component: RadioGroup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof RadioGroup>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RadioGroup"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<RadioGroup />",
                    render: (<RadioGroup aria-label="Choice" value="a" onChange={() => {}}><span data-tier="fixture">a</span></RadioGroup>),
                }]}
            />
        </div>
    ),
}
