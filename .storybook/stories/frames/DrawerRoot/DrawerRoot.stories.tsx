import type { Meta, StoryObj } from "@storybook/nextjs"
import { DrawerRoot } from "@sb-components/frames/DrawerRoot/DrawerRoot"

const meta: Meta<typeof DrawerRoot> = {
    title: "Frames/DrawerRoot/DrawerRoot",
    component: DrawerRoot,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DrawerRoot>

/** Bare identity root — emits `data-tier="drawer"` + the caller's `data-component`. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <DrawerRoot data-component="ExampleDrawer">
                <div data-tier="fixture" className="rounded-xl border border-default bg-surface p-3 text-sm text-foreground">
                    Drawer content placeholder
                </div>
            </DrawerRoot>
        </div>
    ),
}
