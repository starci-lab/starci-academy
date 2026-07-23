import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckboxField, type CheckboxFieldOption } from "./CheckboxField"

/**
 * CheckboxField is the boolean / multi-pick checkbox input. SINGLE mode is one
 * controlled boolean checkbox with an inline label; GROUP mode (pass `options`)
 * is a HeroUI `CheckboxGroup` of rows. Both compose FieldShell for the optional
 * group heading, hint, error, and loading skeleton.
 */
const meta: Meta<typeof CheckboxField> = {
    title: "Primitives/Form/CheckboxField",
    component: CheckboxField,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CheckboxField>

const TOPIC_OPTIONS: Array<CheckboxFieldOption> = [
    { value: "fe", label: "Frontend" },
    { value: "be", label: "Backend" },
    { value: "devops", label: "DevOps" },
]

/** Local controlled wrapper for the SINGLE boolean mode. */
const ControlledSingle = ({
    initialValue = false,
    checkboxLabel,
    description,
    errorMessage,
    isDisabled,
}: {
    initialValue?: boolean
    checkboxLabel: string
    description?: string
    errorMessage?: string
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <CheckboxField
            checkboxLabel={checkboxLabel}
            description={description}
            errorMessage={errorMessage}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
        />
    )
}

/** Local controlled wrapper for the GROUP multi-pick mode. */
const ControlledGroup = ({
    initialValue = [],
    label,
    description,
    errorMessage,
    isDisabled,
}: {
    initialValue?: Array<string>
    label?: string
    description?: string
    errorMessage?: string
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <CheckboxField
            label={label}
            description={description}
            errorMessage={errorMessage}
            options={TOPIC_OPTIONS}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
        />
    )
}

/** Default: a single labelled checkbox, unchecked. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <ControlledSingle checkboxLabel="Ghi nhớ đăng nhập" />
        </div>
    ),
}

/** WithHint: a checkbox GROUP with a heading + hint under it. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <ControlledGroup
                label="Chủ đề quan tâm"
                description="Chọn một hoặc nhiều mảng bạn muốn theo dõi."
                initialValue={["fe"]}
            />
        </div>
    ),
}

/** WithError: a required single checkbox left unchecked, with a fix-it error line. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <ControlledSingle
                checkboxLabel="Tôi đồng ý với điều khoản dịch vụ"
                errorMessage="Bạn cần đồng ý điều khoản để tiếp tục."
            />
        </div>
    ),
}

/** Disabled: neither the single checkbox nor the group rows can be toggled. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm flex flex-col gap-6">
            <ControlledSingle checkboxLabel="Ghi nhớ đăng nhập" initialValue isDisabled />
            <ControlledGroup label="Chủ đề quan tâm" initialValue={["be"]} isDisabled />
        </div>
    ),
}

/** Skeleton: the loading mirror — one Skeleton.Checkbox row per option (or one for single mode). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm flex flex-col gap-6">
            <CheckboxField checkboxLabel="" value={false} onValueChange={() => {}} isSkeleton />
            <CheckboxField
                label="Chủ đề quan tâm"
                options={TOPIC_OPTIONS}
                value={[]}
                onValueChange={() => {}}
                isSkeleton
            />
        </div>
    ),
}
