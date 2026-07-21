import type { Meta, StoryObj } from "@storybook/nextjs"
import { Spacer } from "./Spacer"

const meta: Meta<typeof Spacer> = {
    title: "Primitives/Layout/Spacer",
    component: Spacer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Spacer>

const DemoBlock = ({ label }: { label: string }) => (
    <div className="flex h-10 w-20 items-center justify-center rounded-md bg-accent-soft text-xs font-medium text-accent-soft-foreground">
        {label}
    </div>
)

/** No `x`/`y` set → width/height unset, the div collapses to 0 (a placeholder that takes no space). */
export const NotSet: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex items-center rounded-md border border-dashed border-default p-2">
                <DemoBlock label="A" />
                <Spacer />
                <DemoBlock label="B" />
            </div>
        </div>
    ),
}

/** `x=6` maps to 1.5rem — a horizontal gap between two neighbours whose parent has no flex `gap`. */
export const HorizontalStep: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex items-center rounded-md border border-dashed border-default p-2">
                <DemoBlock label="A" />
                <Spacer x={6} className="self-stretch border-x border-dashed border-default" />
                <DemoBlock label="B" />
            </div>
        </div>
    ),
}

/** `y=3` (0.75rem) inserted between two stacked direct children — the real `SubmissionAttemptCard` usage. */
export const VerticalStep: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex flex-col rounded-md border border-dashed border-default p-2">
                <DemoBlock label="Feedback" />
                <Spacer y={3} className="self-stretch border-y border-dashed border-default" />
                <DemoBlock label="Actions" />
            </div>
        </div>
    ),
}

/** Off-scale value (`x=7`) → falls back to `7 * 0.25rem = 1.75rem` instead of erroring or being dropped. */
export const OffScale: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex items-center rounded-md border border-dashed border-default p-2">
                <DemoBlock label="A" />
                <Spacer x={7} className="self-stretch border-x border-dashed border-default" />
                <DemoBlock label="B" />
            </div>
        </div>
    ),
}

/** Both axes at once — a fixed rectangular pad (e.g. holding a placeholder slot before content loads). */
export const TwoAxis: Story = {
    render: () => (
        <div className="p-8">
            <Spacer x={16} y={10} className="rounded-md border border-dashed border-default" />
        </div>
    ),
}

/** `className` passes straight through — tint it while building the layout to see the space it reserves. */
export const CustomClassName: Story = {
    render: () => (
        <div className="p-8">
            <Spacer x={20} y={8} className="rounded-md bg-accent-soft" />
        </div>
    ),
}
