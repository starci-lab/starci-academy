import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRightIcon, XIcon } from "@phosphor-icons/react"
import { ButtonGroup } from "./ButtonGroup"

const meta: Meta<typeof ButtonGroup> = {
    title: "Primitives/Button/ButtonGroup",
    component: ButtonGroup,
    tags: ["autodocs", "news"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ButtonGroup>

/** 2 action, `align="stretch"` (mặc định) — dọc-full-width ở hẹp → ngang-auto từ `@app-sm`. */
export const TwoActions: Story = {
    name: "2 action (stretch)",
    parameters: {
        usage:
            "GENERIC container (§6c) — caller truyền `actions[]`, mỗi action tự chọn `variant`/thứ tự. " +
            "`align=\"stretch\"` (mặc định): dọc-full-width ở hẹp → ngang-auto từ `@app-sm` (thu hẹp panel để thấy).",
    },
    render: () => (
        <div className="max-w-md p-8">
            <ButtonGroup
                actions={[
                    { label: "Tiếp tục học", icon: <ArrowRightIcon aria-hidden /> },
                    { label: "Xem khóa học", variant: "secondary" },
                ]}
            />
        </div>
    ),
}

/** Footer dialog điển hình — `align="end"` canh phải, huỷ (tertiary) + xác nhận (danger). */
export const DialogFooter: Story = {
    name: "Footer dialog (align=end)",
    parameters: {
        usage:
            "`align=\"end\"` canh cụm về PHẢI, auto-width mọi breakpoint — dùng cho footer dialog/modal. " +
            "Thứ tự + variant do caller chọn: huỷ (tertiary) trước, xác nhận (danger) sau — container không áp vai.",
    },
    render: () => (
        <div className="max-w-lg border border-default-200 p-6">
            <ButtonGroup
                align="end"
                actions={[
                    { label: "Huỷ", variant: "tertiary" },
                    { label: "Xoá khoá học", variant: "danger" },
                ]}
            />
        </div>
    ),
}

/** 1 action duy nhất — container vẫn hợp lệ với mảng 1 phần tử. */
export const SingleAction: Story = {
    name: "1 action",
    parameters: {
        usage: "`actions` chỉ 1 phần tử vẫn render đúng — container không ép tối thiểu 2 nút.",
    },
    render: () => (
        <div className="max-w-md p-8">
            <ButtonGroup actions={[{ label: "Tiếp tục học", icon: <ArrowRightIcon aria-hidden /> }]} />
        </div>
    ),
}

/** STATE `isPending` trên 1 action — action kia vẫn bấm được bình thường. */
export const Pending: Story = {
    name: "Pending (1 action)",
    parameters: {
        usage: "`isPending` đặt LẺ trên từng action (không phải cả cụm) — action đang chờ hiện Spinner + khoá press, action còn lại vẫn tương tác được.",
    },
    render: () => (
        <div className="max-w-md p-8">
            <ButtonGroup
                align="end"
                actions={[
                    { label: "Huỷ", variant: "tertiary" },
                    { label: "Đang xoá", variant: "danger", isPending: true },
                ]}
            />
        </div>
    ),
}

/** STATE loading — `isSkeleton` tự render skeleton mirror cho MỌI action (đúng số nút + size). */
export const Skeleton: Story = {
    name: "Đang tải",
    parameters: {
        usage: "Truyền `isSkeleton` — container tự vẽ skeleton mirror cho từng action (đúng số nút + size). Không dựng Skeleton rời ngoài.",
    },
    render: () => (
        <div className="max-w-md p-8">
            <ButtonGroup
                isSkeleton
                actions={[{ label: "Tiếp tục học" }, { label: "Xem khóa học", variant: "secondary" }]}
            />
        </div>
    ),
}

/** SHAPE dọc + full-width — ép mọi breakpoint (khi cụm luôn hẹp), vd sidebar hẹp hoặc icon-only stack. */
export const Vertical: Story = {
    name: "Dọc (full-width)",
    parameters: {
        usage: "Ép `vertical` khi cụm LUÔN hẹp (cột hẹp cố định) — mọi action giãn full-width, xếp dọc, bỏ qua `align`.",
    },
    render: () => (
        <div className="w-56 p-8">
            <ButtonGroup
                vertical
                actions={[
                    { label: "Tiếp tục học", icon: <ArrowRightIcon aria-hidden /> },
                    { label: "Xem khóa học", variant: "secondary" },
                    { label: "Đóng", variant: "ghost", icon: <XIcon aria-hidden /> },
                ]}
            />
        </div>
    ),
}
