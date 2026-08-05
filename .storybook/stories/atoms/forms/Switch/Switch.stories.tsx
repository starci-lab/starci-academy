import type { Meta, StoryObj } from "@storybook/nextjs"
import { Switch } from "@sb-components/atoms/forms/Switch/Switch"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Switch> = {
    title: "Atoms/Forms/Switch/Switch",
    component: Switch,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Switch>

/** Vendor-boundary atom — chrome only, content handed in. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Switch"
                tier="atom"
                leaf="Default"
                reason="Smallest house wrap over the vendor primitive so composites never import the library."
                states={[{
                    name: "default",
                    why: "The atom is the vendor boundary. Appearance stays private; callers pass data or named slots.",
                    code: "<Switch />",
                    render: (<Switch aria-label="Enabled" isSelected onChange={() => {}} />),
                }]}
            />
        </div>
    ),
}
