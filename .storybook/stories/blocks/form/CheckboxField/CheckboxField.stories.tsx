import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckboxField, type CheckboxFieldOption } from "@sb-components/blocks/form/CheckboxField/CheckboxField"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * CheckboxField is the boolean / multi-pick checkbox input. SINGLE mode is one
 * controlled boolean checkbox with an inline label; GROUP mode (pass `options`)
 * is a HeroUI `CheckboxGroup` of rows. Both compose FieldShell for the optional
 * group heading, hint, error, and loading skeleton.
 */
const meta: Meta<typeof CheckboxField> = {
    title: "Primitives/Forms/CheckboxField",
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
    showAnatomy,
}: {
    initialValue?: boolean
    checkboxLabel: string
    description?: string
    errorMessage?: string
    isDisabled?: boolean
    showAnatomy?: boolean
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
            showAnatomy={showAnatomy}
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
    showAnatomy,
}: {
    initialValue?: Array<string>
    label?: string
    description?: string
    errorMessage?: string
    isDisabled?: boolean
    showAnatomy?: boolean
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
            showAnatomy={showAnatomy}
        />
    )
}

// leaf SINGLE (Default/WithError): FieldShell (không label) bọc 1 Checkbox.
const SINGLE_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "khung mô tả · lỗi bao quanh control (không label, canon Checkbox/Switch)" },
    { name: "Checkbox", tier: "primitive", role: "checkbox đơn + nhãn cạnh (HeroUI Checkbox)" },
]

// leaf GROUP (WithHint/Disabled): FieldShell (có label nhóm) bọc CheckboxGroup, mỗi option 1 Checkbox.
const GROUP_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "khung tiêu đề nhóm · mô tả · lỗi" },
    { name: "CheckboxGroup", tier: "primitive", role: "khung nhóm HeroUI bọc các hàng" },
    { name: "Checkbox", tier: "primitive", role: "1 hàng mỗi option (value·label)" },
]

// leaf Skeleton: FieldShell tự vẽ label-bar + control mirror — Skeleton.Checkbox 1 hàng/option.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "khung skeleton (label bar + control mirror)" },
    { name: "Skeleton.Checkbox", tier: "primitive", role: "hàng checkbox placeholder, 1 mỗi option (hoặc 1 cho single)" },
]

/** Default: a single labelled checkbox, unchecked. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="CheckboxField" tier="primitive" leaf="Default" parts={SINGLE_PARTS}>
                <ControlledSingle checkboxLabel="Ghi nhớ đăng nhập" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a checkbox GROUP with a heading + hint under it. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="CheckboxField" tier="primitive" leaf="WithHint" parts={GROUP_PARTS}>
                <ControlledGroup
                    label="Chủ đề quan tâm"
                    description="Chọn một hoặc nhiều mảng bạn muốn theo dõi."
                    initialValue={["fe"]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** WithError: a required single checkbox left unchecked, with a fix-it error line. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="CheckboxField" tier="primitive" leaf="WithError" parts={SINGLE_PARTS} note="errorMessage → FieldShell render dòng lỗi bên trong (cùng node FieldShell).">
                <ControlledSingle
                    checkboxLabel="Tôi đồng ý với điều khoản dịch vụ"
                    errorMessage="Bạn cần đồng ý điều khoản để tiếp tục."
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: neither the single checkbox nor the group rows can be toggled. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm flex flex-col gap-6">
            <BlockAnatomy name="CheckboxField" tier="primitive" leaf="Disabled" parts={GROUP_PARTS} note="Cả hai mode (single + group) cùng lúc — hợp cả 3 part: FieldShell·CheckboxGroup·Checkbox.">
                <div className="flex flex-col gap-6">
                    <ControlledSingle checkboxLabel="Ghi nhớ đăng nhập" initialValue isDisabled showAnatomy />
                    <ControlledGroup label="Chủ đề quan tâm" initialValue={["be"]} isDisabled showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — one Skeleton.Checkbox row per option (or one for single mode). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm flex flex-col gap-6">
            <BlockAnatomy name="CheckboxField" tier="primitive" leaf="Skeleton" parts={SKELETON_PARTS}>
                <div className="flex flex-col gap-6">
                    <CheckboxField checkboxLabel="" value={false} onValueChange={() => {}} isSkeleton showAnatomy />
                    <CheckboxField
                        label="Chủ đề quan tâm"
                        options={TOPIC_OPTIONS}
                        value={[]}
                        onValueChange={() => {}}
                        isSkeleton
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
