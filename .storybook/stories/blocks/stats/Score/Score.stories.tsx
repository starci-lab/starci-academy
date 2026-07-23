import type { Meta, StoryObj } from "@storybook/nextjs"
import { Score } from "./Score"

const meta: Meta<typeof Score> = {
    title: "Design/Stats/Score",
    component: Score,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Score>

/** Canonical usage — default threshold (0.7), whole-number current/max. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <Score current={70} max={100} />
        </div>
    ),
}

/** Ratio 0.3 < half-threshold (0.35) → danger. */
export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <Score current={3} max={10} />
        </div>
    ),
}

/** Ratio 0.5 sits between half-threshold (0.35) and threshold (0.7) → warning. */
export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <Score current={5} max={10} />
        </div>
    ),
}

/** Ratio 0.8 ≥ threshold (0.7) → success. */
export const Success: Story = {
    render: () => (
        <div className="p-8">
            <Score current={8} max={10} />
        </div>
    ),
}

/** Same 0.8 ratio, but a stricter threshold (0.9) demotes it to warning. */
export const CustomThreshold: Story = {
    render: () => (
        <div className="p-8">
            <Score current={8} max={10} threshold={0.9} />
        </div>
    ),
}

/** Decimals are rounded to at most 2 fraction digits. */
export const Decimal: Story = {
    render: () => (
        <div className="p-8">
            <Score current={8.756} max={10} />
        </div>
    ),
}

/** `max <= 0` (or non-finite) can't yield a ratio → defensively falls back to danger. */
export const InvalidMax: Story = {
    render: () => (
        <div className="p-8">
            <Score current={5} max={0} />
        </div>
    ),
}
