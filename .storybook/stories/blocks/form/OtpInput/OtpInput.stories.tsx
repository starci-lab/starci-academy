import type { Meta, StoryObj } from "@storybook/nextjs"
import { OtpInput } from "@/components/blocks/form/OtpInput"
import { Gallery, Variant } from "../../../../story-kit"
import { Controlled } from "./components"

/**
 * `OtpInput` — a one-time-code input (2FA / email verification) built on HeroUI
 * `InputOTP`. Controlled: `value` + `onChange` held by the call-site; the block just
 * renders `length` boxes (default 6), a label above and an error line below when
 * `isInvalid`. Tier-3, purely presentational — no store, no fetch.
 */
const meta: Meta<typeof OtpInput> = {
    title: "Primitives/Form/OtpInput",
    component: OtpInput,
}
export default meta
type Story = StoryObj<typeof OtpInput>

/**
 * Toàn bộ trạng thái của OtpInput: mặc định (đang gõ mã, chưa lỗi) và trạng thái
 * lỗi xác thực (viền đỏ + dòng lỗi bên dưới). Dùng để tra khi nào cần kèm Label
 * mô tả nguồn mã và cách viết error message.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Mã vừa được gửi tới email, người dùng gõ từng số vào các ô — chưa có lỗi."
            >
                <Controlled label="Mã xác minh" initialValue="12" />
            </Variant>
            <Variant
                label="Lỗi xác thực"
                hint="Mã đã nhập không khớp — viền đỏ và dòng thông báo lỗi hiện ngay dưới các ô, nói rõ cách sửa chứ không chỉ báo sai."
            >
                <Controlled
                    label="Mã xác minh"
                    initialValue="482913"
                    isInvalid
                    errorMessage="Mã không đúng — kiểm tra email và nhập lại mã mới nhất."
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của OtpInput: mặc định (đang gõ mã, chưa lỗi) và trạng thái lỗi xác thực " +
            "(viền đỏ + dòng lỗi bên dưới). Ghép với Label mô tả nguồn mã (\"Mã xác minh\") và error message " +
            "nói cách sửa (\"nhập lại mã từ email\"), không chỉ báo \"sai\".",
    },
}
