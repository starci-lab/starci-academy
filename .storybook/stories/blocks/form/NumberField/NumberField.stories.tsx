import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { NumberField } from "@sb-components/blocks/form/NumberField/NumberField"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * NumberField is the numeric input with +/- stepper buttons — a controlled
 * field composing FieldShell (label / hint / error / skeleton) with HeroUI's
 * NumberField compound (Group + Input + Increment/DecrementButton). It is the
 * template for numeric entry: bare `value`/`onValueChange` in, all field
 * scaffolding owned by the component.
 */
const meta: Meta<typeof NumberField> = {
    title: "Primitives/Forms/NumberField",
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
    showAnatomy,
}: {
    initialValue?: number
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    minValue?: number
    maxValue?: number
    step?: number
    isDisabled?: boolean
    showAnatomy?: boolean
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
            showAnatomy={showAnatomy}
        />
    )
}

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div className="p-8 max-w-sm">{node}</div>

// Live leaf: FieldShell scaffold (label/hint/error, whichever are passed) + the
// stepper Group control — NumberField's two direct compose nodes.
const LIVE_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "design", role: "label · hint · error do FieldShell dựng (chỉ hiện khi truyền prop tương ứng)" },
    { name: "Group", tier: "primitive", role: "khối stepper Decrement/Input/Increment (HeroUI compound)" },
]

// Skeleton leaf: FieldShell swaps its own inside for a label bar + Skeleton.Input —
// the Group control never mounts (FieldShell's isSkeleton branch returns early).
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "design", role: "vạch nhãn + Skeleton.Input mirror khối stepper" },
]

/** Default: a plain labelled numeric field. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NumberField"
                tier="primitive"
                leaf="Default"
                parts={LIVE_PARTS}
                reason="NumberField compose FieldShell (label/hint/error/skeleton column, canon §4/§8) với HeroUI NumberField compound — bare value/onValueChange vào, mọi scaffolding field do component sở hữu."
            >
                <Controlled label="Số lượng" initialValue={1} minValue={0} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** WithHint: a description under the label. */
export const WithHint: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NumberField"
                tier="primitive"
                leaf="WithHint"
                parts={LIVE_PARTS}
                note="Cùng composition với leaf Default — `description` chỉ thêm nội dung BÊN TRONG FieldShell, không thêm part mới."
            >
                <Controlled
                    label="Số học viên"
                    description="Số lượng học viên tối đa trong một lớp."
                    initialValue={20}
                    minValue={1}
                    maxValue={50}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NumberField"
                tier="primitive"
                leaf="WithError"
                parts={LIVE_PARTS}
                note="Cùng composition với leaf Default — `errorMessage` thêm dòng lỗi BÊN TRONG FieldShell + đánh dấu control invalid."
            >
                <Controlled
                    label="Số lượng"
                    initialValue={-5}
                    minValue={0}
                    errorMessage="Số lượng không được nhỏ hơn 0."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Disabled: the field is not editable. */
export const Disabled: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NumberField"
                tier="primitive"
                leaf="Disabled"
                parts={LIVE_PARTS}
                note="Cùng composition với leaf Default — chỉ đổi tone nhãn/khoá control, không đổi cây parts."
            >
                <Controlled label="Số lượng" initialValue={3} isDisabled showAnatomy />
            </BlockAnatomy>,
        ),
}

/** Skeleton: the loading mirror — label bar over a field-box skeleton. */
export const Skeleton: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NumberField"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="`isSkeleton` → FieldShell tự swap sang label bar + Skeleton.Input; Group không mount (FieldShell trả sớm khi isSkeleton)."
            >
                <NumberField label="Số lượng" value={0} onValueChange={() => {}} isSkeleton showAnatomy />
            </BlockAnatomy>,
        ),
}
