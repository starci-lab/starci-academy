import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stepper, type StepperStep } from "@sb-components/composites/navigation/Stepper/Stepper"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Stepper.Base> = {
    title: "Composites/Navigation/Stepper",
    component: Stepper.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stepper.Base>

const CHECKOUT_STEPS: Array<StepperStep> = [
    { id: "info", label: "Details", description: "Fill in your info" },
    { id: "review", label: "Confirm", description: "Review everything" },
    { id: "done", label: "Complete", description: "Get your receipt" },
]

// Stepper's own circular indicator and connector line are internal geometry it draws itself
// (§13z) with no dedicated sub-story to link to, so — unlike Typography.Base below — they carry
// no badge (a link-less node is worse than no node at all). Only the two repeated
// Typography.Base nodes (label/description) get badged, once per step.
const STEPPER_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Base", tier: "atom", role: "the step's short label text (repeats per step)", storyId: "atoms-text-typography-typography-base--plain" },
    { name: "Typography.Base", tier: "atom", role: "the step's optional one-line description under the label (repeats per step)", storyId: "atoms-text-typography-typography-base--plain" },
]

/** Horizontal, mid-flow: done = check, current = accent ring, upcoming = muted. */
export const HorizontalMidFlow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stepper"
                tier="composite"
                leaf="HorizontalMidFlow"
                parts={STEPPER_PARTS}
                reason="Stepper bundles the indicator, label, description, and connector of N steps into ONE shared track instead of every flow hand-rolling its own. The track direction and the current position are both props, so a checkout flow and a long vertical wizard can share the exact same component."
                states={[
                    {
                        name: "currentIndex = 1 (mid-flow)",
                        why: "The track lays three Indicator/Label/Description groups end to end with a Connector between each pair, and with `currentIndex=1` the first step shows its done check, the second carries the current accent ring, and the third stays muted as upcoming. Showing all three states together in one track lets a reader compare done, current, and upcoming without switching leaves.",
                        code: "<Stepper.Base steps={CHECKOUT_STEPS} currentIndex={1} />",
                        render: <Stepper.Base steps={CHECKOUT_STEPS} currentIndex={1} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Vertical stack (narrow shells / long lists); `onStepPress` makes done steps clickable. */
export const Vertical: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stepper"
                tier="composite"
                leaf="Vertical"
                parts={STEPPER_PARTS}
                states={[
                    {
                        name: "orientation = \"vertical\", onStepPress set",
                        why: "The same four parts stack along a vertical rail instead of a horizontal track, and passing `onStepPress` turns the done step into a `<button>` without adding a new part. A vertical stepper fits a narrow shell or a long step list where a horizontal track would run out of width.",
                        code: "<Stepper.Base steps={CHECKOUT_STEPS} currentIndex={1} orientation=\"vertical\" onStepPress={handleStepPress} />",
                        render: (
                            <Stepper.Base
                                steps={CHECKOUT_STEPS}
                                currentIndex={1}
                                orientation="vertical"
                                onStepPress={() => {}}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** All complete: `currentIndex === steps.length` → every step checked, all connectors success. */
export const AllComplete: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stepper"
                tier="composite"
                leaf="AllComplete"
                parts={STEPPER_PARTS}
                states={[
                    {
                        name: "currentIndex = steps.length",
                        why: "Every Indicator switches to its done check and every Connector turns success-toned, because `currentIndex` has moved past the last step. This is the terminal state a checkout flow reaches right before it hands the learner off to a receipt or confirmation screen.",
                        code: "<Stepper.Base steps={CHECKOUT_STEPS} currentIndex={CHECKOUT_STEPS.length} />",
                        render: <Stepper.Base steps={CHECKOUT_STEPS} currentIndex={CHECKOUT_STEPS.length} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
