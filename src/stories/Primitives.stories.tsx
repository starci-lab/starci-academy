/* eslint-disable starci-fe/no-adjacent-chip -- file story demo: Chips gallery cố ý bày nhiều Chip cạnh nhau */
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"

/**
 * Seed story — verifies the Storybook harness (HeroUI provider + Tailwind v4 + theme +
 * axe a11y) renders StarCi primitives. Block stories (SurfaceListCard, UserCell, Callout…)
 * follow this same shape. See `.claude/fe/methodology/enforcement.md` §visual tier.
 */
const meta: Meta = {
    title: "Primitives/Button & Chip",
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj

export const Buttons: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" isDisabled>Disabled</Button>
            </div>
        </div>
    ),
}

export const Chips: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Chip color="accent" variant="soft"><Chip.Label>Accent</Chip.Label></Chip>
            <Chip color="success" variant="soft"><Chip.Label>Success</Chip.Label></Chip>
            <Chip color="warning" variant="soft"><Chip.Label>Warning</Chip.Label></Chip>
            <Chip color="danger" variant="soft"><Chip.Label>Danger</Chip.Label></Chip>
        </div>
    ),
}
