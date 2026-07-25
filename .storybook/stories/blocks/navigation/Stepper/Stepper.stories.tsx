import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stepper, type StepperStep } from "@sb-components/layouts/navigation/Stepper/Stepper"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Stepper.Base> = {
    title: "Primitives/Navigation/Stepper",
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

// Same 4 parts across every leaf below: each step repeats Indicator/Label/Description,
// and a Connector sits between every pair of steps (all 3 checkout steps have a
// description, so Description is present in every leaf here too).
const STEPPER_PARTS: Array<AnatomyNode> = [
    { name: "Indicator", tier: "primitive", role: "step's circular badge — check icon when done, 1-based number otherwise (lặp ×N)" },
    { name: "Label", tier: "primitive", role: "step's short label text (lặp ×N)" },
    { name: "Description", tier: "primitive", role: "step's optional one-line description under the label (lặp ×N)" },
    { name: "Connector", tier: "primitive", role: "line between two adjacent steps, success-toned once passed" },
]

/** Horizontal, mid-flow: done = check, current = accent ring, upcoming = muted. */
export const HorizontalMidFlow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stepper"
                tier="primitive"
                leaf="HorizontalMidFlow"
                parts={STEPPER_PARTS}
                reason="Stepper gom indicator + label + description + connector của N bước thành MỘT track thay vì mỗi flow tự dàn tay — track ngang, bước giữa (currentIndex=1) nên có cả done/current/upcoming."
            >
                <Stepper.Base steps={CHECKOUT_STEPS} currentIndex={1} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Vertical stack (narrow shells / long lists); `onStepPress` makes done steps clickable. */
export const Vertical: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stepper"
                tier="primitive"
                leaf="Vertical"
                parts={STEPPER_PARTS}
                note={"orientation=\"vertical\" — CÙNG 4 part, chỉ đổi rail dọc; onStepPress khiến bước done trở thành <button> (không thêm part mới, chỉ đổi thẻ bọc)."}
            >
                <Stepper.Base steps={CHECKOUT_STEPS} currentIndex={1} orientation="vertical" onStepPress={() => {}} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** All complete: `currentIndex === steps.length` → every step checked, all connectors success. */
export const AllComplete: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stepper"
                tier="primitive"
                leaf="AllComplete"
                parts={STEPPER_PARTS}
                note="currentIndex === steps.length — CÙNG 4 part, mọi Indicator đều 'done' (check) và mọi Connector đều success."
            >
                <Stepper.Base steps={CHECKOUT_STEPS} currentIndex={CHECKOUT_STEPS.length} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
