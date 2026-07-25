import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { MultiSelect } from "@sb-components/blocks/form/MultiSelect/MultiSelect"
import type { MultiSelectOption } from "@sb-components/blocks/form/MultiSelect/MultiSelect"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * MultiSelect is a searchable multi-select field composing FieldShell (label /
 * hint / error / skeleton) with a HeroUI ComboBox search-and-pick anatomy.
 * Chosen options render as removable chips above the field; picking a row
 * appends its id to the controlled `value` array and clears the search text.
 */
const meta: Meta<typeof MultiSelect> = {
    title: "Primitives/Forms/MultiSelect",
    component: MultiSelect,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MultiSelect>

const SKILL_OPTIONS: Array<MultiSelectOption> = [
    { id: "ts", label: "TypeScript", description: "Ngôn ngữ chính của FE + BE" },
    { id: "react", label: "React", description: "Thư viện UI" },
    { id: "nestjs", label: "NestJS", description: "Framework backend" },
    { id: "postgres", label: "PostgreSQL", description: "Cơ sở dữ liệu quan hệ" },
    { id: "docker", label: "Docker", description: "Đóng gói + triển khai" },
    { id: "graphql", label: "GraphQL", description: "Lớp API" },
]

// DOM thật: FieldShell (label·hint·error·skeleton, khung chung mọi field) ⊃
// ChosenChips (hàng chip đã chọn, CHỈ render khi có ≥1 lựa chọn) + ComboBox (ô
// tìm kiếm + dropdown HeroUI). Skeleton leaf khác hẳn: FieldShell tự vẽ mirror,
// ChosenChips/ComboBox KHÔNG render (children bị bỏ qua).
const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        name: "FieldShell",
        tier: "primitive",
        role: "khung label · hint · error (canon §4/§8)",
        children: [
            { name: "ChosenChips", tier: "primitive", role: "hàng chip đã chọn (removable) — chỉ hiện khi có lựa chọn" },
            { name: "ComboBox", tier: "primitive", role: "ô tìm kiếm + dropdown chọn thêm (HeroUI ComboBox)" },
        ],
    },
]

const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "tự vẽ mirror: label bar + Skeleton.Select — bỏ qua children thật" },
]

/** Local controlled wrapper so the field is pickable on the canvas. */
const Controlled = ({
    initialValue = [],
    label,
    description,
    errorMessage,
    isDisabled,
    leaf,
    note,
}: {
    initialValue?: Array<string>
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    isDisabled?: boolean
    leaf: string
    note?: ReactNode
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <BlockAnatomy name="MultiSelect" tier="primitive" leaf={leaf} parts={CONTENT_PARTS} note={note}>
            <MultiSelect
                label={label}
                description={description}
                errorMessage={errorMessage}
                options={SKILL_OPTIONS}
                value={value}
                onValueChange={setValue}
                isDisabled={isDisabled}
                showAnatomy
            />
        </BlockAnatomy>
    )
}

/** Default: a plain labelled field with a couple of options already picked. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Kỹ năng" initialValue={["ts", "react"]} leaf="Default" />
        </div>
    ),
}

/** WithHint: a description under the label, nothing picked yet. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Kỹ năng"
                description="Chọn các công nghệ bạn tự tin sử dụng."
                leaf="WithHint"
                note="Chưa chọn gì → ChosenChips không render, chỉ FieldShell + ComboBox."
            />
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Kỹ năng"
                errorMessage="Chọn ít nhất một kỹ năng."
                leaf="WithError"
            />
        </div>
    ),
}

/** Disabled: existing chips can't be removed and no new pick can be made. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Kỹ năng" initialValue={["ts", "nestjs"]} isDisabled leaf="Disabled" />
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a select-box skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="MultiSelect"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="isSkeleton: FieldShell tự vẽ label bar + Skeleton.Select — ChosenChips/ComboBox không tồn tại trong DOM."
            >
                <MultiSelect
                    label="Kỹ năng"
                    options={SKILL_OPTIONS}
                    value={[]}
                    onValueChange={() => {}}
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
