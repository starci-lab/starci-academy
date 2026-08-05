import type { Meta, StoryObj } from "@storybook/nextjs"
import { SelectRoot } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof SelectRoot> = {
    title: "Atoms/Forms/SelectRoot/SelectRoot",
    component: SelectRoot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof SelectRoot>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectRoot"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<SelectRoot />",
                    render: (<SelectRoot aria-label="Pick" selectedKey={null} onSelectionChange={() => {}}><span data-tier="fixture">closed</span></SelectRoot>),
                }]}
            />
        </div>
    ),
}
