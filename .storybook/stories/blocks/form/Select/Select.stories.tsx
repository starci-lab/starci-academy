import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select, type SelectOption } from "./Select"

/**
 * Select is the single-select dropdown field — a controlled field composing
 * FieldShell (label / hint / error / skeleton) with HeroUI's real `Select`
 * compound (`Select.Root` → `Select.Trigger` → `Select.Value`/`Select.Indicator`
 * → `Select.Popover` → `ListBox.Root`/`ListBox.Item`). Bare `value`/`onValueChange`
 * in, all field scaffolding owned by the component.
 */
const meta: Meta<typeof Select> = {
    title: "Primitives/Forms/Select",
    component: Select,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Select>

const COURSE_OPTIONS: Array<SelectOption> = [
    { value: "fs", label: "Full-stack Mastery" },
    { value: "sd", label: "System Design Mastery" },
    { value: "devops", label: "DevOps Mastery" },
    { value: "ai", label: "AI/LLM Mastery" },
]

/** Local controlled wrapper so the field is pickable on the canvas. */
const Controlled = ({
    initialValue = null,
    label,
    description,
    errorMessage,
    placeholder,
    isDisabled,
}: {
    initialValue?: string | null
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    placeholder?: string
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState<string | null>(initialValue)
    return (
        <Select
            label={label}
            description={description}
            errorMessage={errorMessage}
            placeholder={placeholder}
            options={COURSE_OPTIONS}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
        />
    )
}

/** Default: a plain labelled dropdown with a placeholder. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Khoá học" placeholder="Chọn khoá học" />
        </div>
    ),
}

/** WithHint: a description under the label, plus a pre-selected value. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Khoá học"
                description="Dùng để lọc nội dung theo khoá bạn đang học."
                placeholder="Chọn khoá học"
                initialValue="fs"
            />
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Khoá học"
                placeholder="Chọn khoá học"
                errorMessage="Vui lòng chọn một khoá học."
            />
        </div>
    ),
}

/** Disabled: the field is not pickable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Khoá học" initialValue="devops" isDisabled />
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a select-shaped field skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Select
                label="Khoá học"
                options={COURSE_OPTIONS}
                value={null}
                onValueChange={() => {}}
                isSkeleton
            />
        </div>
    ),
}
