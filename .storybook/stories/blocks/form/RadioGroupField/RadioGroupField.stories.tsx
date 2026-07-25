import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { RadioGroupField } from "@sb-components/blocks/form/RadioGroupField/RadioGroupField"
import type { RadioGroupFieldOption } from "@sb-components/blocks/form/RadioGroupField/RadioGroupField"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * RadioGroupField is a controlled single-select group — composing FieldShell
 * (group label / hint / error / skeleton) with HeroUI's RadioGroup + Radio.
 * Cloned from TextField: bare `value`/`onValueChange` in, all field scaffolding
 * owned by the component; each option's label sits beside its own radio dot.
 */
const meta: Meta<typeof RadioGroupField> = {
    title: "Primitives/Forms/RadioGroupField",
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
            showAnatomy
        />
    )
}

// FieldShell (label · hint · error · skeleton column, owned by a sibling file — can't
// be tagged from the inside, so RadioGroupField wraps it as ONE opaque marker) ⊃ Radio
// (each option row, dot + label beside it via Radio.Content) — same 3 options every leaf.
const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        name: "FieldShell",
        tier: "primitive",
        role: "khung group label/hint/error (sở hữu bởi FieldShell, không tự vẽ ở đây)",
        children: [{ name: "Radio", tier: "primitive", role: "mỗi option — dot + label cạnh dot (×3)" }],
    },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    {
        name: "FieldShell",
        tier: "primitive",
        role: "mirror label bar + Skeleton.RadioGroup — FieldShell tự vẽ toàn bộ, không lộ part con",
        state: "skeleton",
    },
]

/** Default: a plain labelled group with a preselected option. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="RadioGroupField" tier="primitive" leaf="Default" parts={CONTENT_PARTS}>
                <Controlled label="Gói đăng ký" initialValue="monthly" />
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a description under the group label. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="RadioGroupField" tier="primitive" leaf="WithHint" parts={CONTENT_PARTS}>
                <Controlled
                    label="Gói đăng ký"
                    description="Có thể đổi gói bất cứ lúc nào trong phần Cài đặt."
                    initialValue="yearly"
                />
            </BlockAnatomy>
        </div>
    ),
}

/** WithError: an invalid group with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="RadioGroupField" tier="primitive" leaf="WithError" parts={CONTENT_PARTS}>
                <Controlled label="Gói đăng ký" errorMessage="Vui lòng chọn một gói để tiếp tục." />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: every option is not selectable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="RadioGroupField" tier="primitive" leaf="Disabled" parts={CONTENT_PARTS}>
                <Controlled label="Gói đăng ký" initialValue="lifetime" isDisabled />
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — group label bar over stacked radio-row skeletons. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="RadioGroupField"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="FieldShell tự vẽ TOÀN BỘ mirror (label + Skeleton.RadioGroup) — không có part con để badge riêng."
            >
                <RadioGroupField
                    label="Gói đăng ký"
                    options={PLAN_OPTIONS}
                    value=""
                    onValueChange={() => {}}
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
