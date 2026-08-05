import type { Meta, StoryObj } from "@storybook/nextjs"
import { ModalRoot } from "@sb-components/atoms/overlay/Modal/Modal"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof ModalRoot> = {
    title: "Atoms/Overlay/ModalRoot/ModalRoot",
    component: ModalRoot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof ModalRoot>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModalRoot"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<ModalRoot />",
                    render: (<ModalRoot isOpen={false} onOpenChange={() => {}}><span data-tier="fixture">closed</span></ModalRoot>),
                }]}
            />
        </div>
    ),
}
