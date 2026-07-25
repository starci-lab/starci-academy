import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { StatusChip } from "@sb-components/atoms/chips/StatusChip/StatusChip"

const meta: Meta<typeof StatusChip.Base> = {
    title: "Atoms/Chips/StatusChip",
    component: StatusChip.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatusChip.Base>

/** Neutral (default): an undetermined / unhandled state — a draft, a pending entry. */
export const Neutral: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip.Base tone="neutral" text="Draft" />
        </div>
    ),
}

/** Success: a done, verified, positive outcome. */
export const Success: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip.Base tone="success" text="Completed" />
        </div>
    ),
}

/** Warning: needs attention, due soon — not yet an error. */
export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip.Base tone="warning" text="Due soon" />
        </div>
    ),
}

/** Danger: a cancelled / error state that can't continue. */
export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip.Base tone="danger" text="Cancelled" />
        </div>
    ),
}

/** Accent: highlighted / new — draws attention without meaning success or warning. */
export const Accent: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip.Base tone="accent" text="Highlighted" />
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the pill shape (a plain shimmer chip). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip.Base tone="neutral" isSkeleton text="Draft" />
        </div>
    ),
}

/**
 * WithLeadingIcon: `icon` renders a leading glyph before the label — passed
 * TRẦN (no `size-*`), the chip forces it to `size-3` to match the label scale.
 */
export const WithLeadingIcon: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip.Base tone="success" icon={<CheckCircleIcon aria-hidden focusable="false" />} text="Verified" />
        </div>
    ),
}

/**
 * Removable: `onCancel` renders a trailing × (chip's own compact scale:
 * transparent at rest + tonal hover, like Callout's close).
 */
export const Removable: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2 p-8">
            <StatusChip.Base tone="accent" onCancel={() => {}} cancelLabel="Remove React filter" text="React" />
            <StatusChip.Base tone="accent" onCancel={() => {}} cancelLabel="Remove TypeScript filter" text="TypeScript" />
            <StatusChip.Base tone="neutral" onCancel={() => {}} cancelLabel="Remove Junior filter" text="Junior" />
        </div>
    ),
}
