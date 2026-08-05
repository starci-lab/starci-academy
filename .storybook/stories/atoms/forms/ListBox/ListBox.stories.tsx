import type { Meta, StoryObj } from "@storybook/nextjs"
import { ListBoxRoot } from "@sb-components/atoms/forms/ListBox/ListBox"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof ListBoxRoot> = {
    title: "Atoms/Forms/ListBoxRoot/ListBoxRoot",
    component: ListBoxRoot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof ListBoxRoot>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListBoxRoot"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<ListBoxRoot />",
                    render: (<ListBoxRoot aria-label="Options"><span data-tier="fixture">item</span></ListBoxRoot>),
                }]}
            />
        </div>
    ),
}
