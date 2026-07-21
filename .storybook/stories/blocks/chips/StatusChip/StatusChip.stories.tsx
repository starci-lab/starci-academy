import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
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

/** Success + icon: a verified result — `CheckCircleIcon` leading, tone success, static. */
export const SuccessWithIcon: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="success" icon={<CheckCircleIcon />}>
                Verified
            </StatusChip>
        </div>
    ),
}

/** Error + icon: a failed result — `XCircleIcon` leading, tone danger, static. */
export const ErrorWithIcon: Story = {
    render: () => (
        <div className="p-8">
            <StatusChip tone="danger" icon={<XCircleIcon />}>
                Processing error
            </StatusChip>
        </div>
    ),
}

/**
 * Removable: `onCancel` renders a trailing × (the shared `ElementCloseButton`:
 * transparent at rest + tonal hover, like Callout). A removable chip carries a
 * cancel-X and NO leading icon — one or the other, never both.
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
