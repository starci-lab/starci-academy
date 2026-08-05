import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent } from "@sb-components/atoms/display/Card/Card"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Card> = {
    title: "Atoms/Display/Card/Card",
    component: Card,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Card>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Card"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<Card />",
                    render: (<Card><CardContent>Card</CardContent></Card>),
                }]}
            />
        </div>
    ),
}
