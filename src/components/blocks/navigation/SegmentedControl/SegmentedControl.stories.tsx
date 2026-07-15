import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { SegmentedControl } from "./index"
import type { SegmentedControlItem, SegmentedControlSize } from "./index"

const meta: Meta<typeof SegmentedControl> = {
    title: "Blocks/Navigation/SegmentedControl",
    component: SegmentedControl,
}
export default meta
type Story = StoryObj<typeof SegmentedControl>

const currencyItems: Array<SegmentedControlItem<"vnd" | "usd">> = [
    { value: "vnd", label: "VND" },
    { value: "usd", label: "USD" },
]

const viewItems: Array<SegmentedControlItem<"grid" | "list">> = [
    { value: "grid", label: "Lưới" },
    { value: "list", label: "Danh sách" },
]

const withDisabledItems: Array<SegmentedControlItem<"free" | "pro" | "enterprise">> = [
    { value: "free", label: "Miễn phí" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Doanh nghiệp", isDisabled: true },
]

const Controlled = <T extends string>({
    items,
    initialValue,
    ariaLabel,
    size,
}: {
    items: Array<SegmentedControlItem<T>>
    initialValue: T
    ariaLabel?: string
    size?: SegmentedControlSize
}) => {
    const [value, setValue] = useState<T>(initialValue)
    return (
        <SegmentedControl
            items={items}
            value={value}
            onChange={setValue}
            ariaLabel={ariaLabel}
            size={size}
        />
    )
}

/**
 * Dùng khi lựa chọn chỉ đổi MỘT setting gọn TẠI CHỖ, nội dung lớn bên dưới giữ nguyên (VND ⇆ USD,
 * Lưới ⇆ Danh sách). Trước khi chọn, tự hỏi: bấm xong có văng sang route/panel khác hẳn không? —
 * CÓ thì đó là TabsCard (underline), dù chỉ 2 lựa chọn; số lượng KHÔNG quyết định, THỨ nó điều
 * khiển mới quyết định. Lựa chọn giàu (icon + mô tả + badge) cần card to → SelectableCardGroup.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng khi lựa chọn chỉ đổi MỘT setting gọn TẠI CHỖ, nội dung lớn bên dưới giữ nguyên (VND ⇆ USD, " +
            "Lưới ⇆ Danh sách). Trước khi chọn, tự hỏi: bấm xong có văng sang route/panel khác hẳn không? — CÓ thì " +
            "đó là TabsCard (underline), dù chỉ 2 lựa chọn; số lượng KHÔNG quyết định, THỨ nó điều khiển mới quyết " +
            "định. Lựa chọn giàu (icon + mô tả + badge) cần card to → SelectableCardGroup.",
    },
    render: () => (
        <Controlled items={currencyItems} initialValue="vnd" ariaLabel="Đơn vị tiền tệ" />
    ),
}

/** Dùng size "sm" khi control chỉ là một lựa chọn phụ nằm trong modal hoặc panel hẹp, không nên chiếm hết chiều rộng hàng. */
export const Small: Story = {
    parameters: { usage: "Dùng size \"sm\" khi control chỉ là một lựa chọn phụ nằm trong modal hoặc panel hẹp, không nên chiếm hết chiều rộng hàng." },
    render: () => (
        <Controlled items={viewItems} initialValue="grid" ariaLabel="Kiểu hiển thị" size="sm" />
    ),
}

/** Dùng khi một lựa chọn tạm thời chưa khả dụng (ví dụ gói doanh nghiệp chưa mở bán) nhưng vẫn cần hiển thị để người dùng biết nó tồn tại. */
export const DisabledSegment: Story = {
    parameters: { usage: "Dùng khi một lựa chọn tạm thời chưa khả dụng (ví dụ gói doanh nghiệp chưa mở bán) nhưng vẫn cần hiển thị để người dùng biết nó tồn tại." },
    render: () => (
        <Controlled items={withDisabledItems} initialValue="free" ariaLabel="Gói dịch vụ" />
    ),
}
