import type { Meta, StoryObj } from "@storybook/nextjs"
import { AccordionTree } from "@sb-components/atoms/navigation/AccordionTree/AccordionTree"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof AccordionTree> = {
    title: "Atoms/Navigation/AccordionTree/AccordionTree",
    component: AccordionTree,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof AccordionTree>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AccordionTree"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<AccordionTree />",
                    render: (<AccordionTree><span data-tier="fixture">panel</span></AccordionTree>),
                }]}
            />
        </div>
    ),
}
