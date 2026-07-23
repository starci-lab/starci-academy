import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { Disclosure } from "./Disclosure"

/**
 * Disclosure is the generic collapsible: a trigger row (leading caret +
 * title) toggling a content region below it. Ground truth: MockInterview­
 * Session's "Tùy chỉnh phiên" green-room row (leading `CaretDownIcon` rotated
 * 180° on open, `text-muted hover:text-foreground`, `w-fit` trigger).
 */
const meta: Meta<typeof Disclosure> = {
    title: "Primitives/Layout/Disclosure",
    component: Disclosure,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Disclosure>

const SampleContent = () => (
    <Typography type="body-sm" color="muted">
        Chọn số câu, cách trả lời và ngôn ngữ cho phiên phỏng vấn.
    </Typography>
)

/** Default: uncontrolled, closed on mount — click the trigger to expand it. */
export const Default: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <Disclosure title="Tùy chỉnh phiên">
                <SampleContent />
            </Disclosure>
        </div>
    ),
}

/** Open: `defaultOpen` starts expanded — the caret rotates 180° and the content region is visible. */
export const Open: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <Disclosure title="Tùy chỉnh phiên" defaultOpen>
                <SampleContent />
            </Disclosure>
        </div>
    ),
}

/** Local controlled wrapper so the toggle actually flips `isOpen` on the canvas. */
const ControlledExample = () => {
    const [open, setOpen] = useState(false)
    return (
        <Disclosure title="Tùy chỉnh phiên" isOpen={open} onOpenChange={setOpen}>
            <SampleContent />
        </Disclosure>
    )
}

/** Controlled: `isOpen`+`onOpenChange` — the parent owns the expanded state. */
export const Controlled: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <ControlledExample />
        </div>
    ),
}

/** Disabled: the trigger cannot toggle — dimmed, `cursor-not-allowed`, not focusable. */
export const Disabled: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <Disclosure title="Tùy chỉnh phiên" isDisabled>
                <SampleContent />
            </Disclosure>
        </div>
    ),
}

/** Skeleton: the loading mirror — a trigger-row placeholder (`Skeleton.Disclosure`). */
export const Skeleton: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <Disclosure title="Tùy chỉnh phiên" isSkeleton>
                <SampleContent />
            </Disclosure>
        </div>
    ),
}
