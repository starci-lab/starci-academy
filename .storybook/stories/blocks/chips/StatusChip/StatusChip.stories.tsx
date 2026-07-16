import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"

import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { TONES } from "./components"

const meta: Meta<typeof StatusChip> = {
    title: "Block/Chip/StatusChip",
    component: StatusChip,
    args: {
        children: "Active",
    },
}

export default meta

type Story = StoryObj<typeof StatusChip>

/**
 * Use for an "undetermined / unprocessed" status — a draft, an item awaiting input — a neutral tone that doesn't draw attention.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use for an \"undetermined / unprocessed\" status — a draft, an item awaiting input — a neutral tone that doesn't draw attention.",
    },
    args: {
        tone: "neutral",
        children: "Draft",
    },
}

/**
 * Pick the tone by the MEANING of the real status in the app: success = done, warning = due soon / needs attention, danger = cancelled / error, accent = highlighted / new — not by aesthetics.
 */
export const Tones: Story = {
    parameters: {
        usage:
            "Pick the tone by the MEANING of the real status in the app: success = done, warning = due soon / needs attention, danger = cancelled / error, accent = highlighted / new — not by aesthetics.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            {TONES.map(({ tone, name, label, desc }) => (
                <div key={tone} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>{name}</Label>
                        <Typography type="body-sm" color="muted">
                            {desc}
                        </Typography>
                    </div>
                    <StatusChip tone={tone}>{label}</StatusChip>
                </div>
            ))}
        </div>
    ),
}

/**
 * A chip WITH an icon = ONLY for the 2 DEFINITIVE statuses, icon LEADING, static:
 * - success / verified → the REAL Phosphor `CheckCircleIcon` (circle-check) + tone `success`.
 * - error / failure → `XCircleIcon` (circle-x) + tone `danger`.
 * NO bare `CheckIcon`/`XIcon`, NO hand-rolled SVG (icon.md §2 — pass/fail marks = circle).
 * Other tones (neutral/warning/accent) get NO icon. The component forces the icon to size-4.
 */
export const WithIcon: Story = {
    parameters: {
        usage:
            "A chip with an icon is only for the 2 definitive statuses: success = `CheckCircleIcon` (circle-check, tone success), error = `XCircleIcon` (circle-x, tone danger). Icon leading, static. Other tones get no icon.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">
                        A successful or verified result — use CheckCircleIcon with tone success, icon leading and static.
                    </Typography>
                </div>
                <StatusChip tone="success" icon={<CheckCircleIcon />}>
                    Verified
                </StatusChip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Error</Label>
                    <Typography type="body-sm" color="muted">
                        An error or failed result — use XCircleIcon with tone danger, icon leading and static.
                    </Typography>
                </div>
                <StatusChip tone="danger" icon={<XCircleIcon />}>
                    Processing error
                </StatusChip>
            </div>
        </div>
    ),
}

/**
 * A REMOVABLE chip (filter/tag): the `onCancel` prop → a TRAILING X button pressed to remove/dismiss the chip.
 * The X button = the shared **`ElementCloseButton`** block (wrapping HeroUI `CloseButton`): transparent
 * at rest + on hover fills the background by the chip's TONE — the SAME approach as `Callout`'s dismiss
 * (no more each place styling its hover differently). Rule: a chip with a remove-X has **NO leading status
 * icon** — one chip carries EITHER a status icon OR a remove-X, not both (passing both `icon` and
 * `onCancel` drops the icon).
 */
export const Removable: Story = {
    parameters: {
        usage:
            "A removable chip: `onCancel` renders a trailing X button = `ElementCloseButton` (shared block wrapping HeroUI `CloseButton`; transparent at rest + hover tint by the chip's tone, like Callout). A chip with a remove-X has NO leading icon (it carries EITHER a status icon OR a remove-X).",
    },
    render: () => (
        <div className="flex flex-wrap items-start gap-2">
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
