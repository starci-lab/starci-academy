import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { StackIcon } from "@phosphor-icons/react"
import { NestedCard } from "@/components/blocks/cards/NestedCard"
import { relatedSections } from "./components"

const meta: Meta<typeof NestedCard> = {
    title: "Core/Card/NestedCard",
    component: NestedCard,
    args: {
        title: "Related lessons",
        icon: <StackIcon aria-hidden focusable="false" className="size-4 shrink-0" />,
        bordered: true,
    },
}
export default meta
type Story = StoryObj<typeof NestedCard>

/**
 * ChatPanel tool-result: under a bubble, on a `bg-surface` panel
 * → surface-in-surface (`bordered`).
 */
export const SurfaceInSurface: Story = {
    args: { bordered: true },
    parameters: {
        usage: "In chat — a `bg-surface` panel, a tool-result under a bubble → `bordered` (surface-in-surface, no stacked fill). Only when rendered directly on `bg-background` do you omit `bordered` (see OnBackground).",
    },
    render: (args) => (
        <div className="flex w-[32rem] flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>In chat</Label>
                <Typography type="body-sm" color="muted">
                    A `bg-surface` panel — NestedCard `bordered`, no stacked fill.
                </Typography>
            </div>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface">
                <div className="flex flex-col gap-2 p-3">
                    <div className="max-w-[85%] rounded-2xl bg-surface-secondary px-3 py-2">
                        <Typography type="body-sm">
                            It's usually when you see data repeated across many rows, or a column that depends on a non-primary-key column.
                        </Typography>
                    </div>
                    <div className="max-w-[85%]">
                        <NestedCard {...args}>{relatedSections}</NestedCard>
                    </div>
                </div>
            </div>
        </div>
    ),
}

/** On `bg-background` (no parent surface): the card is its own surface. */
export const OnBackground: Story = {
    args: { bordered: false },
    parameters: {
        usage: "Rare — rendered directly on `bg-background`, with no parent surface at all. Omit `bordered` → `bg-surface shadow-surface`. Everywhere in chat/modal/page cards uses `bordered`.",
    },
    render: (args) => (
        <div className="flex w-[32rem] flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>On the page background</Label>
                <Typography type="body-sm" color="muted">
                    Not nested in a surface — NestedCard is itself a `bg-surface` card.
                </Typography>
            </div>
            <NestedCard {...args}>{relatedSections}</NestedCard>
        </div>
    ),
}
