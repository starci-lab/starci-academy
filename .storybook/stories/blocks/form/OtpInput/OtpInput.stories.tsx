import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { OtpInput } from "./OtpInput"

const meta: Meta<typeof OtpInput> = {
    title: "Primitives/Form/OtpInput",
    component: OtpInput,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof OtpInput>

/** Local controlled wrapper — holds `value` so the boxes are typeable on the canvas. */
const Controlled = ({
    initialValue = "",
    length = 6,
    isInvalid,
    errorMessage,
    label,
}: {
    initialValue?: string
    length?: number
    isInvalid?: boolean
    errorMessage?: ReactNode
    label?: ReactNode
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <OtpInput
            length={length}
            value={value}
            onChange={setValue}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            label={label}
        />
    )
}

/** Default: code just sent, user typing digit-by-digit — no error yet. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <Controlled label="Mã xác minh" initialValue="12" />
        </div>
    ),
}

/** Invalid: the entered code did not match — error border + a fix-it error line below. */
export const Invalid: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                label="Mã xác minh"
                initialValue="482913"
                isInvalid
                errorMessage="Mã không đúng — kiểm tra email và nhập lại mã mới nhất."
            />
        </div>
    ),
}

/** Bare field: no label above the slots. */
export const NoLabel: Story = {
    render: () => (
        <div className="p-8">
            <Controlled initialValue="12" />
        </div>
    ),
}

/** Loading mirror: label bar + N cell-shaped squares, same footprint as the real field. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <OtpInput length={6} value="" onChange={() => {}} label="Mã xác minh" isSkeleton />
        </div>
    ),
}
