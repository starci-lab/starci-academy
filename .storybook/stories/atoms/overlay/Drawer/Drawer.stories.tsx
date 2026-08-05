import type { Meta, StoryObj } from "@storybook/nextjs"
import { DrawerRoot } from "@sb-components/atoms/overlay/Drawer/Drawer"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof DrawerRoot> = {
    title: "Atoms/Overlay/DrawerRoot/DrawerRoot",
    component: DrawerRoot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof DrawerRoot>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DrawerRoot"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<DrawerRoot />",
                    render: (<DrawerRoot isOpen={false} onOpenChange={() => {}}><span data-tier="fixture">closed</span></DrawerRoot>),
                }]}
            />
        </div>
    ),
}
