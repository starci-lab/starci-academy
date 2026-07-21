import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stepper, type StepperStep } from "./Stepper"

const meta: Meta<typeof Stepper> = {
    title: "Primitives/Navigation/Stepper",
    component: Stepper,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stepper>

const CHECKOUT_STEPS: Array<StepperStep> = [
    { id: "info", label: "Details", description: "Fill in your info" },
    { id: "review", label: "Confirm", description: "Review everything" },
    { id: "done", label: "Complete", description: "Get your receipt" },
]

/** Horizontal, mid-flow: done = check, current = accent ring, upcoming = muted. */
export const HorizontalMidFlow: Story = {
    render: () => (
        <div className="p-8">
            <Stepper steps={CHECKOUT_STEPS} currentIndex={1} />
        </div>
    ),
}

/** Vertical stack (narrow shells / long lists); `onStepPress` makes done steps clickable. */
export const Vertical: Story = {
    render: () => (
        <div className="p-8">
            <Stepper steps={CHECKOUT_STEPS} currentIndex={1} orientation="vertical" onStepPress={() => {}} />
        </div>
    ),
}

/** All complete: `currentIndex === steps.length` → every step checked, all connectors success. */
export const AllComplete: Story = {
    render: () => (
        <div className="p-8">
            <Stepper steps={CHECKOUT_STEPS} currentIndex={CHECKOUT_STEPS.length} />
        </div>
    ),
}
