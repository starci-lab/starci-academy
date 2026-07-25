import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Textarea } from "@sb-components/blocks/form/Textarea/Textarea"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * Textarea is the multi-line text input — a controlled field composing
 * FieldShell (label / hint / error / skeleton) with HeroUI's TextField +
 * TextArea. Cloned from the golden TextField: bare `value`/`onValueChange` in,
 * all field scaffolding owned by the component.
 */
const meta: Meta<typeof Textarea> = {
    title: "Primitives/Forms/Textarea",
    component: Textarea,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Textarea>

/** Local controlled wrapper so the field is typeable on the canvas. */
const Controlled = ({
    initialValue = "",
    label,
    description,
    errorMessage,
    placeholder,
    isDisabled,
    rows,
}: {
    initialValue?: string
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    placeholder?: string
    isDisabled?: boolean
    rows?: number
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <Textarea
            label={label}
            description={description}
            errorMessage={errorMessage}
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
            rows={rows}
            showAnatomy
        />
    )
}

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `Textarea` composes `FieldShell` — a SHARED foreign file (`form/FieldShell`,
 * outside this story's folder) that owns label/hint/error/skeleton — so it's
 * tagged as ONE opaque node via a plain wrapping `data-anat-part` (no `anatPart`
 * prop of FieldShell's own is touched). `Control` (the HeroUI TextField+TextArea
 * box Textarea itself renders as FieldShell's `children`) nests inside it —
 * matches the real DOM: FieldShell wraps everything, including the control.
 */
const FIELD_PARTS: Array<AnatomyNode> = [
    {
        name: "FieldShell",
        tier: "primitive",
        role: "label/hint/error/skeleton (shared field-wrapper, không riêng của Textarea)",
        children: [
            { name: "Control", tier: "primitive", role: "ô nhập nhiều dòng (HeroUI TextField + TextArea)" },
        ],
    },
]
const SKELETON_FIELD_PARTS: Array<AnatomyNode> = [
    {
        name: "FieldShell",
        tier: "primitive",
        role: "label bar + skeleton control (nhánh isSkeleton của FieldShell)",
        state: "loading",
        children: [
            { name: "Skeleton", tier: "primitive", role: "mirror khung TextArea theo rows", state: "skeleton" },
        ],
    },
]

/** Default: a plain labelled multi-line field with a placeholder. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Textarea"
                tier="primitive"
                leaf="Default"
                parts={FIELD_PARTS}
                reason="Clone của TextField golden: field nhiều dòng vẫn composes FieldShell (label/hint/error/skeleton) + HeroUI TextField/TextArea, chỉ đổi control 1-dòng thành nhiều-dòng."
            >
                <Controlled label="Giới thiệu bản thân" placeholder="Vài dòng về bạn…" />
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a description under the label. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Textarea"
                tier="primitive"
                leaf="WithHint"
                parts={FIELD_PARTS}
                note="description → FieldShell thêm dòng hint dưới label, bên trong node FieldShell (không tách riêng vì không thuộc Textarea)."
            >
                <Controlled
                    label="Phản hồi"
                    description="Càng chi tiết, đội ngũ càng dễ hỗ trợ."
                    placeholder="Bạn gặp vấn đề gì?"
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
                name="Textarea"
                tier="primitive"
                leaf="WithError"
                parts={FIELD_PARTS}
                note="errorMessage → FieldShell thêm dòng lỗi + Control nhận isInvalid, composition không đổi."
            >
                <Controlled
                    label="Mô tả lỗi"
                    initialValue="a"
                    placeholder="Mô tả chi tiết lỗi bạn gặp phải"
                    errorMessage="Mô tả quá ngắn — cần tối thiểu 20 ký tự."
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: the field is not editable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Textarea"
                tier="primitive"
                leaf="Disabled"
                parts={FIELD_PARTS}
                note="isDisabled chỉ đổi style label + Control isDisabled, composition không đổi."
            >
                <Controlled
                    label="Ghi chú nội bộ"
                    initialValue="Đã xử lý, không cần chỉnh sửa thêm."
                    isDisabled
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a row-matched field-box skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="Textarea"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_FIELD_PARTS}
                note="isSkeleton → FieldShell tự chuyển nhánh loading; Control thật biến mất, thay bằng Skeleton.TextArea theo đúng rows."
            >
                <Textarea label="Giới thiệu bản thân" value="" onValueChange={() => {}} isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
