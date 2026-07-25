import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select, type SelectOption } from "@sb-components/blocks/form/Select/Select"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

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
    showAnatomy,
}: {
    initialValue?: string | null
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    placeholder?: string
    isDisabled?: boolean
    showAnatomy?: boolean
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
            showAnatomy={showAnatomy}
        />
    )
}

// FIELD — the two direct composed parts: FieldShell (label/hint/error/skeleton
// column, opaque here) + Control (the live HeroUI Select widget).
const FIELD_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "khung label/hint/error/skeleton dùng chung mọi input — xem story riêng FieldShell", storyId: "primitives-forms-fieldshell--default" },
    { name: "Control", tier: "primitive", role: "vùng chọn thật — HeroUI Select.Root (Trigger hiện value/placeholder; Popover+ListBox khi mở)" },
]

// SKELETON — FieldShell renders ONLY the label bar + control skeleton while
// `isSkeleton`; the real Control never mounts (FieldShell early-returns before
// its `children`), so this leaf's only badgeable part is FieldShell itself.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "label bar + Skeleton.Select mirror — Control thật không mount ở STATE loading" },
]

/** Default: a plain labelled dropdown with a placeholder. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Select"
                tier="primitive"
                leaf="Default"
                parts={FIELD_PARTS}
                reason="Select ghép FieldShell (label/hint/error/skeleton) với control chọn thật của HeroUI — chỉ 2 node TRỰC TIẾP, không đào sâu nội bộ FieldShell."
            >
                <Controlled label="Khoá học" placeholder="Chọn khoá học" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a description under the label, plus a pre-selected value. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Select"
                tier="primitive"
                leaf="WithHint"
                parts={FIELD_PARTS}
                note="CÙNG composition leaf Default; FieldShell thêm dòng description, Control có value đã chọn sẵn."
            >
                <Controlled
                    label="Khoá học"
                    description="Dùng để lọc nội dung theo khoá bạn đang học."
                    placeholder="Chọn khoá học"
                    initialValue="fs"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Select"
                tier="primitive"
                leaf="WithError"
                parts={FIELD_PARTS}
                note="CÙNG composition leaf Default; FieldShell thêm dòng error, Control render `isInvalid`."
            >
                <Controlled
                    label="Khoá học"
                    placeholder="Chọn khoá học"
                    errorMessage="Vui lòng chọn một khoá học."
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: the field is not pickable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Select"
                tier="primitive"
                leaf="Disabled"
                parts={FIELD_PARTS}
                note="CÙNG composition leaf Default; Control render `isDisabled`."
            >
                <Controlled label="Khoá học" initialValue="devops" isDisabled showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a select-shaped field skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Select"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="`isSkeleton` — FieldShell tự render label bar + `Skeleton.Select`; Control thật không mount ở STATE này."
            >
                <Select
                    label="Khoá học"
                    options={COURSE_OPTIONS}
                    value={null}
                    onValueChange={() => {}}
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
