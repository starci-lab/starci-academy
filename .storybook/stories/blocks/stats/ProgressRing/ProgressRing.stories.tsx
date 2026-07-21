import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressRing } from "./ProgressRing"

const meta: Meta<typeof ProgressRing> = {
    title: "Primitives/Stats/ProgressRing",
    component: ProgressRing,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ProgressRing>

export const SizeSmall: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={68} size="sm" />
        </div>
    ),
}

export const SizeMedium: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={68} size="md" />
        </div>
    ),
}

export const SizeLarge: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={68} size="lg" />
        </div>
    ),
}

export const Zero: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={0} size="lg" caption="Not started" />
        </div>
    ),
}

export const Full: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={100} size="lg" tone="success" caption="Completed" />
        </div>
    ),
}

export const ToneAccent: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={68} tone="accent" caption="Course progress" />
        </div>
    ),
}

export const ToneSuccess: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={92} tone="success" caption="Test score" />
        </div>
    ),
}

export const ToneWarning: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={45} tone="warning" caption="This week's progress" />
        </div>
    ),
}

export const ToneDanger: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={18} tone="danger" caption="Completion rate" />
        </div>
    ),
}

export const WithCaption: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={68} size="lg" caption="Course progress" />
        </div>
    ),
}

/** Custom label overrides the centered percentage with a fraction when the count reads clearer. */
export const CustomLabel: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={90} size="lg" tone="success" label="9/10" caption="Lessons completed" />
        </div>
    ),
}

export const WithoutCaption: Story = {
    render: () => (
        <div className="p-8">
            <ProgressRing value={68} size="lg" />
        </div>
    ),
}
