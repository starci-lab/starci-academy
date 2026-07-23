import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { RadioGroupField } from "./RadioGroupField"
import type { RadioGroupFieldOption } from "./RadioGroupField"

/**
 * RadioGroupField is a controlled single-select group — composing FieldShell
 * (group label / hint / error / skeleton) with HeroUI's RadioGroup + Radio.
 * Cloned from TextField: bare `value`/`onValueChange` in, all field scaffolding
 * owned by the component; each option's label sits beside its own radio dot.
 */
const meta: Meta<typeof RadioGroupField> = {
    title: "Primitives/Form/RadioGroupField",
    component: RadioGroupField,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RadioGroupField>

const PLAN_OPTIONS: Array<RadioGroupFieldOption> = [
    { value: "monthly", label: "Hàng tháng — 199.000đ/tháng" },
    { value: "yearly", label: "Hàng năm — 1.990.000đ/năm" },
    { value: "lifetime", label: "Trọn đời — 4.990.000đ" },
]

/** Local controlled wrapper so a row is pickable on the canvas. */
const Controlled = ({
    initialValue = "",
    label,
    description,
    errorMessage,
    isDisabled,
}: {
    initialValue?: string
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <RadioGroupField
            label={label}
            description={description}
            errorMessage={errorMessage}
            options={PLAN_OPTIONS}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
        />
    )
}

/** Default: a plain labelled group with a preselected option. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Gói đăng ký" initialValue="monthly" />
        </div>
    ),
}

/** WithHint: a description under the group label. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Gói đăng ký"
                description="Có thể đổi gói bất cứ lúc nào trong phần Cài đặt."
                initialValue="yearly"
            />
        </div>
    ),
}

/** WithError: an invalid group with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Gói đăng ký" errorMessage="Vui lòng chọn một gói để tiếp tục." />
        </div>
    ),
}

/** Disabled: every option is not selectable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Gói đăng ký" initialValue="lifetime" isDisabled />
        </div>
    ),
}

/** Skeleton: the loading mirror — group label bar over stacked radio-row skeletons. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <RadioGroupField
                label="Gói đăng ký"
                options={PLAN_OPTIONS}
                value=""
                onValueChange={() => {}}
                isSkeleton
            />
        </div>
    ),
}
