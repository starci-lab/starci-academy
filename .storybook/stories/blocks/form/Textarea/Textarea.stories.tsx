import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Textarea } from "./Textarea"

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
        />
    )
}

/** Default: a plain labelled multi-line field with a placeholder. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Giới thiệu bản thân" placeholder="Vài dòng về bạn…" />
        </div>
    ),
}

/** WithHint: a description under the label. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Phản hồi"
                description="Càng chi tiết, đội ngũ càng dễ hỗ trợ."
                placeholder="Bạn gặp vấn đề gì?"
            />
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Mô tả lỗi"
                initialValue="a"
                placeholder="Mô tả chi tiết lỗi bạn gặp phải"
                errorMessage="Mô tả quá ngắn — cần tối thiểu 20 ký tự."
            />
        </div>
    ),
}

/** Disabled: the field is not editable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Ghi chú nội bộ"
                initialValue="Đã xử lý, không cần chỉnh sửa thêm."
                isDisabled
            />
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a row-matched field-box skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Textarea label="Giới thiệu bản thân" value="" onValueChange={() => {}} isSkeleton />
        </div>
    ),
}
