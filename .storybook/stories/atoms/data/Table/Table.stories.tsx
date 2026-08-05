import type { Meta, StoryObj } from "@storybook/nextjs"
import { TableRoot } from "@sb-components/atoms/data/Table/Table"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof TableRoot> = {
    title: "Atoms/Data/TableRoot/TableRoot",
    component: TableRoot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof TableRoot>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TableRoot"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<TableRoot />",
                    render: (<TableRoot aria-label="Demo"><span data-tier="fixture">table</span></TableRoot>),
                }]}
            />
        </div>
    ),
}
