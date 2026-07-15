import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { OtpInput } from "."

/**
 * `OtpInput` — ô nhập mã một lần (2FA / xác minh email) dựng trên HeroUI
 * `InputOTP`. Controlled: `value` + `onChange` do call-site giữ; block chỉ render
 * `length` ô (mặc định 6), nhãn phía trên và dòng lỗi phía dưới khi `isInvalid`.
 * Tier-3 thuần trình bày — không store, không fetch.
 */
const meta: Meta<typeof OtpInput> = {
    title: "Core/Form/OtpInput",
    component: OtpInput,
}
export default meta
type Story = StoryObj<typeof OtpInput>

/** Bọc controlled cho demo — giữ `value` bằng useState để gõ được vào các ô. */
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
    errorMessage?: React.ReactNode
    label?: React.ReactNode
}) => {
    const [value, setValue] = React.useState(initialValue)
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

/** Mã 6 số bình thường + trạng thái lỗi, mỗi cái kèm Label và mô tả ngắn. */
export const Default: Story = {
    parameters: {
        usage:
            "Ô nhập mã một lần cho 2FA / xác minh email — `length` mặc định 6, controlled qua `value`/`onChange`. " +
            "Đặt kèm một `Label` (\"Mã xác minh\") và câu hướng dẫn ngắn nói mã đến từ đâu. Trạng thái lỗi bật " +
            "`isInvalid` + `errorMessage` mách CÁCH sửa (\"nhập lại mã trong email\"), không chỉ báo 'sai'.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Mặc định</Label>
                    <Typography type="body-sm" color="muted">
                        Sáu ô trống — mã vừa gửi tới email, người dùng gõ từng số.
                    </Typography>
                </div>
                <Controlled
                    label="Mã xác minh"
                    initialValue="12"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Lỗi validate</Label>
                    <Typography type="body-sm" color="muted">
                        Mã nhập không khớp — viền đỏ và dòng lỗi hiện dưới các ô.
                    </Typography>
                </div>
                <Controlled
                    label="Mã xác minh"
                    initialValue="482913"
                    isInvalid
                    errorMessage="Mã không đúng — kiểm tra lại email và nhập mã mới nhất."
                />
            </div>
        </div>
    ),
}
