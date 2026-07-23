import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { StatusChip } from "./StatusChip"

const meta: Meta<typeof StatusChip> = {
    title: "Primitives/Chip/StatusChip",
    component: StatusChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatusChip>

/** Neutral (default): an undetermined / unhandled state — a draft, a pending entry. */
export const Neutral: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="neutral">Draft</StatusChip>
        </div>
    ),
}

/** Success: a done, verified, positive outcome. */
export const Success: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="success">Completed</StatusChip>
        </div>
    ),
}

/** Warning: needs attention, due soon — not yet an error. */
export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="warning">Due soon</StatusChip>
        </div>
    ),
}

/** Danger: a cancelled / error state that can't continue. */
export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="danger">Cancelled</StatusChip>
        </div>
    ),
}

/** Accent: highlighted / new — draws attention without meaning success or warning. */
export const Accent: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="accent">Highlighted</StatusChip>
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the pill shape (a plain shimmer chip). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="neutral" isSkeleton>
                Draft
            </StatusChip>
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
            <StatusChip tone="success" icon={<CheckCircleIcon aria-hidden focusable="false" />}>
                Verified
            </StatusChip>
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
            <StatusChip tone="accent" onCancel={() => {}} cancelLabel="Remove React filter">
                React
            </StatusChip>
            <StatusChip tone="accent" onCancel={() => {}} cancelLabel="Remove TypeScript filter">
                TypeScript
            </StatusChip>
            <StatusChip tone="neutral" onCancel={() => {}} cancelLabel="Remove Junior filter">
                Junior
            </StatusChip>
        </div>
    ),
}
