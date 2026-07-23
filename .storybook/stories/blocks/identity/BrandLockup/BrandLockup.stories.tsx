import type { Meta, StoryObj } from "@storybook/nextjs"
import { BrandLockup } from "./BrandLockup"

const meta: Meta<typeof BrandLockup> = {
    title: "Design/Identity/BrandLockup",
    component: BrandLockup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof BrandLockup>

export const IconAndWordmark: Story = {
    render: () => (
        <div className="p-8">
            {/* container ≥ 48rem → wordmark shows */}
            <div className="@container w-full">
                <BrandLockup />
            </div>
        </div>
    ),
}

export const IconOnly: Story = {
    render: () => (
        <div className="p-8">
            {/* container narrower than @app-md → wordmark hides, icon-only.
                Container query measures the nearest @container ancestor, not the
                viewport — so a narrow @container reproduces the mobile state. */}
            <div className="@container w-20">
                <BrandLockup />
            </div>
        </div>
    ),
}

export const SelfStartInFlexCol: Story = {
    render: () => (
        <div className="p-8">
            {/* a flex-col parent stretches children horizontally; className="self-start"
                keeps the lockup only as wide as its content, per the block's JSDoc. */}
            <div className="@container flex w-64 flex-col rounded-lg border border-default bg-default/40 p-4">
                <BrandLockup className="self-start" />
            </div>
        </div>
    ),
}
