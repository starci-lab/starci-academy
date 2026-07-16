import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Label, Typography } from "@heroui/react"

/**
 * Reference table for the HeroUI `Chip` — the base primitive behind every chip/pill/tag/badge
 * (all blocks in the `Core/Chip` family build on it). Kept here to look up "what each color looks
 * like" next to the sibling blocks, rather than splitting it into a separate branch.
 */
const meta: Meta<typeof Chip> = {
    title: "Primitives/DataDisplay/Chip",
    component: Chip,
}
export default meta
type Story = StoryObj<typeof Chip>

/** A chip is a status LABEL, not a button; pick the color by MEANING (accent = selected/next-step, success = done, warning = needs attention, danger = error, default = neutral). */
export const AllColors: Story = {
    parameters: {
        usage:
            "A chip is a status LABEL, NOT a button. Pick the color by MEANING: accent = selected / next-step · " +
            "success = done · warning = needs attention · danger = error · default = neutral. Always use " +
            "variant=\"soft\" for semantic tints (the native bg-<status>-soft + text-<status>-soft-foreground pair meets " +
            "contrast in both light and dark — the raw hue on a light tint falls short of 4.5:1). Outside this gallery, a " +
            "meta cluster may carry only ONE chip on ONE classification axis; leave the rest as plain text + icon.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">Use when the item is currently selected or is the next step in progress — something you want to draw the user's eye to.</Typography>
                </div>
                <Chip color="accent" variant="soft"><Chip.Label>In progress</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">Use when a task is complete and meets requirements, with no further action needed.</Typography>
                </div>
                <Chip color="success" variant="soft"><Chip.Label>Completed</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">Use when the user needs to pay attention but it is not yet an error — for example nearing a deadline or still in progress.</Typography>
                </div>
                <Chip color="warning" variant="soft"><Chip.Label>Due soon</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">Use when the outcome is an error or a failure — a state the user needs to fix.</Typography>
                </div>
                <Chip color="danger" variant="soft"><Chip.Label>Not passed</Chip.Label></Chip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Default</Label>
                    <Typography type="body-sm" color="muted">Use for a neutral label that carries no status meaning — for example a draft or an ordinary category.</Typography>
                </div>
                <Chip color="default" variant="soft"><Chip.Label>Draft</Chip.Label></Chip>
            </div>
        </div>
    ),
}
