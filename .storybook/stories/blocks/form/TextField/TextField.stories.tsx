import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnvelopeIcon } from "@phosphor-icons/react"
import { TextField } from "./TextField"

/**
 * TextField is the golden single-line text input — a controlled field composing
 * FieldShell (label / hint / error / skeleton) with HeroUI's TextField + Input.
 * It is the template every other form input clones: bare `value`/`onValueChange`
 * in, all field scaffolding owned by the component.
 */
const meta: Meta<typeof TextField> = {
    title: "Primitives/Forms/TextField",
    component: TextField,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TextField>

/** Local controlled wrapper so the field is typeable on the canvas. */
const Controlled = ({
    initialValue = "",
    label,
    description,
    errorMessage,
    placeholder,
    isDisabled,
    leadingIcon,
}: {
    initialValue?: string
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    placeholder?: string
    isDisabled?: boolean
    leadingIcon?: typeof EnvelopeIcon
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <TextField
            label={label}
            description={description}
            errorMessage={errorMessage}
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
            leadingIcon={leadingIcon}
        />
    )
}

/** Default: a plain labelled field with a placeholder. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Họ và tên" placeholder="Nguyễn Văn A" />
        </div>
    ),
}

/** WithHint: a description under the label, plus a leading icon. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Email"
                description="Dùng để đăng nhập và nhận thông báo."
                placeholder="ban@vidu.com"
                leadingIcon={EnvelopeIcon}
            />
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Email"
                initialValue="ban@@vidu"
                placeholder="ban@vidu.com"
                errorMessage="Email không hợp lệ — kiểm tra lại định dạng."
            />
        </div>
    ),
}

/** Disabled: the field is not editable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Mã giới thiệu" initialValue="STARCI-2026" isDisabled />
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a field-box skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <TextField label="Họ và tên" value="" onValueChange={() => {}} isSkeleton />
        </div>
    ),
}
