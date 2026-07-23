import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { NumberField } from "./NumberField"

/**
 * NumberField is the numeric input with +/- stepper buttons — a controlled
 * field composing FieldShell (label / hint / error / skeleton) with HeroUI's
 * NumberField compound (Group + Input + Increment/DecrementButton). It is the
 * template for numeric entry: bare `value`/`onValueChange` in, all field
 * scaffolding owned by the component.
 */
const meta: Meta<typeof NumberField> = {
    title: "Primitives/Form/NumberField",
    component: NumberField,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof NumberField>

/** Local controlled wrapper so the field is steppable on the canvas. */
const Controlled = ({
    initialValue = 0,
    label,
    description,
    errorMessage,
    minValue,
    maxValue,
    step,
    isDisabled,
}: {
    initialValue?: number
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    minValue?: number
    maxValue?: number
    step?: number
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <NumberField
            label={label}
            description={description}
            errorMessage={errorMessage}
            value={value}
            onValueChange={setValue}
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            isDisabled={isDisabled}
        />
    )
}

/** Default: a plain labelled numeric field. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Số lượng" initialValue={1} minValue={0} />
        </div>
    ),
}

/** WithHint: a description under the label. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Số học viên"
                description="Số lượng học viên tối đa trong một lớp."
                initialValue={20}
                minValue={1}
                maxValue={50}
            />
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Số lượng"
                initialValue={-5}
                minValue={0}
                errorMessage="Số lượng không được nhỏ hơn 0."
            />
        </div>
    ),
}

/** Disabled: the field is not editable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Số lượng" initialValue={3} isDisabled />
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a field-box skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <NumberField label="Số lượng" value={0} onValueChange={() => {}} isSkeleton />
        </div>
    ),
}
