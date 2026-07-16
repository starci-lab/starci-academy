import type { StatusChipProps } from "@/components/blocks/chips/StatusChip"

export const TONES: {
    tone: NonNullable<StatusChipProps["tone"]>
    name: string
    label: string
    desc: string
}[] = [
    {
        tone: "success",
        name: "Success",
        label: "Completed",
        desc: "A done, successful state — an item that's finished or verified, a positive outcome.",
    },
    {
        tone: "warning",
        name: "Warning",
        label: "Due soon",
        desc: "A state needing attention, due soon — remind the user to handle it before it's late, not yet an error.",
    },
    {
        tone: "danger",
        name: "Danger",
        label: "Cancelled",
        desc: "A cancelled or error state — a negative outcome that can't continue.",
    },
    {
        tone: "accent",
        name: "Accent",
        label: "Highlighted",
        desc: "A highlighted or new state — draws attention without meaning a warning or a success.",
    },
]
