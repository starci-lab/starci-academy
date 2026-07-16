import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { Stepper } from "@/components/blocks/navigation/Stepper"
import { CHECKOUT_STEPS } from "./components"

const meta: Meta<typeof Stepper> = {
    title: "Core/Navigation/Stepper",
    component: Stepper,
}
export default meta
type Story = StoryObj<typeof Stepper>

/** Use for a horizontal multi-step flow on wide screens — showing completed steps (checkmark), the current step (highlighted) and upcoming steps on a single row. */
export const HorizontalMidFlow: Story = {
    parameters: { usage: "Use for a horizontal multi-step flow on wide screens (onboarding, CV submission, checkout). Completed steps show a checkmark, the current step stands out with an accent ring, and upcoming steps are muted. Set currentIndex to the step in progress." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Mid-flow</Label>
                    <Typography type="body-sm" color="muted">Three steps on one row with the user on the second: step one is done, step two is current, step three is upcoming.</Typography>
                </div>
                <Stepper steps={CHECKOUT_STEPS} currentIndex={1} />
            </div>
        </div>
    ),
}

/** Use for narrow screens or long step lists — stack vertically so each step has room for its label and description without crowding; completed steps are clickable when onStepPress is passed. */
export const Vertical: Story = {
    parameters: { usage: "Use for narrow/mobile screens or when the step list is long — stack vertically so each step has room for its label and description. Here onStepPress is passed, so completed steps are clickable to go back and edit." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Vertical</Label>
                    <Typography type="body-sm" color="muted">Steps stacked vertically with the connector running down the left axis; suited to narrow screens and flows with a description per step.</Typography>
                </div>
                <Stepper
                    steps={CHECKOUT_STEPS}
                    currentIndex={1}
                    orientation="vertical"
                    onStepPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Use to see the state when every step is complete — all indicators turn into checkmarks and every connector is filled with the success color. */
export const AllDone: Story = {
    parameters: { usage: "Use to check the end state: when currentIndex passes the last step, every step becomes a checkmark and every connector fills with success. Pass currentIndex equal to the step count to mark them all done." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>All done</Label>
                    <Typography type="body-sm" color="muted">Every step is complete: all indicators are checkmarks and all connectors are filled with the success color.</Typography>
                </div>
                <Stepper steps={CHECKOUT_STEPS} currentIndex={CHECKOUT_STEPS.length} />
            </div>
        </div>
    ),
}
