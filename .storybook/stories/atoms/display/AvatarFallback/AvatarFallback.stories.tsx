import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarFallback } from "@sb-components/atoms/display/AvatarFallback/AvatarFallback"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof AvatarFallback> = {
    title: "Atoms/Display/AvatarFallback/AvatarFallback",
    component: AvatarFallback,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof AvatarFallback>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AvatarFallback"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<AvatarFallback />",
                    render: (<AvatarFallback>+3</AvatarFallback>),
                }]}
            />
        </div>
    ),
}
