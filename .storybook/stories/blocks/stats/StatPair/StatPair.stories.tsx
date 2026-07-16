import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, Label, Typography } from "@heroui/react"

import { StatPair } from "@/components/blocks/stats/StatPair"
import { STATS } from "./components"

const meta: Meta<typeof StatPair> = {
    title: "Primitives/DataDisplay/StatPair",
    component: StatPair,
    args: {
        value: "1,204",
        label: "Followers",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

/** A single stat: a large value (`h4`) above a muted label, left-aligned. This block is frameless — always place it inside the parent's card. */
export const Default: Story = {
    parameters: { usage: "A single stat: a large value above a muted label, left-aligned. Frameless — always place it inside the parent's card." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Single stat</Label>
                <Typography type="body-sm" color="muted">
                    A single stat: a large value above a muted label, left-aligned. Frameless — always place it inside the parent's card.
                </Typography>
            </div>
            <StatPair {...args} />
        </div>
    ),
}

/** Ribbon: 4 StatPairs in ONE horizontal row inside a single card, separated by vertical dividers — a hero / profile stat strip (wide). The parent handles the card + dividers. */
export const Row: Story = {
    parameters: { usage: "Ribbon: 4 StatPairs in one horizontal row inside a single card, separated by vertical dividers — a hero / profile stat strip. The parent handles the card + dividers." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Horizontal strip</Label>
                <Typography type="body-sm" color="muted">
                    Use when the width is generous: 4 StatPairs in one row, separated by vertical dividers — a hero / profile stat strip.
                </Typography>
            </div>
            <Card variant="default" className="w-fit">
                <div className="flex items-stretch divide-x divide-default">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
                            <StatPair value={stat.value} label={stat.label} />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    ),
}

/** 2-column grid: 4 StatPairs laid out in a grid inside a single card when the width is NARROW (sidebar / widget) — the same set of numbers, but there isn't room for a single row. The parent handles the card + spacing. */
export const Grid: Story = {
    parameters: { usage: "2-column grid: 4 StatPairs laid out in a grid inside a single card when the width is narrow (sidebar / widget). The parent handles the card + spacing." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>2-column grid</Label>
                <Typography type="body-sm" color="muted">
                    Use when the width is narrow (sidebar / widget): the same set of numbers, but laid out in a 2-column grid because there isn't room for a single row.
                </Typography>
            </div>
            <Card variant="default" className="w-[420px]">
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                    {STATS.map((stat) => (
                        <StatPair key={stat.label} value={stat.value} label={stat.label} />
                    ))}
                </div>
            </Card>
        </div>
    ),
}
