import type { Meta, StoryObj } from "@storybook/nextjs"
import { DotChip } from "./DotChip"

const meta: Meta<typeof DotChip> = {
    title: "Primitives/Chips/DotChip",
    component: DotChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DotChip>

/** Tailwind class dot: colour supplied as a `bg-*` palette class via `dotClassName`. */
export const TailwindClass: Story = {
    render: () => (
        <div className="flex flex-col gap-2 p-8">
            <DotChip dotClassName="bg-emerald-500" label="Beginner" />
            <DotChip dotClassName="bg-amber-500" label="Intermediate" />
            <DotChip dotClassName="bg-orange-500" label="Advanced" />
            <DotChip dotClassName="bg-rose-500" label="Insane" />
        </div>
    ),
}

/** Raw hex dot: colour supplied as an external brand hex via `dotColor` (inline style). */
export const RawHex: Story = {
    render: () => (
        <div className="flex flex-col gap-2 p-8">
            <DotChip dotColor="#3178c6" label="TypeScript" />
            <DotChip dotColor="#f1e05a" label="JavaScript" />
            <DotChip dotColor="#00add8" label="Go" />
        </div>
    ),
}

/** Trạng thái loading: dot + nhãn được thay bằng skeleton khớp hình, không giật layout khi resolve. */
export const Loading: Story = {
    render: () => (
        <div className="flex flex-col gap-2 p-8">
            <DotChip isSkeleton dotClassName="bg-emerald-500" label="Beginner" />
            <DotChip isSkeleton dotClassName="bg-amber-500" label="Intermediate" />
            <DotChip isSkeleton dotClassName="bg-orange-500" label="Advanced" />
        </div>
    ),
}
