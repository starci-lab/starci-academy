import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { SegmentedControl } from "./index"
import type { SegmentedControlItem, SegmentedControlSize } from "./index"

const meta: Meta<typeof SegmentedControl> = {
    title: "Blocks/Navigation/SegmentedControl",
    component: SegmentedControl,
    parameters: { layout: "centered" },
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

/** Dùng khi cần một lựa chọn cục bộ, loại-trừ-lẫn-nhau đơn giản như chuyển đổi đơn vị tiền tệ, không phải điều hướng cả panel. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần một lựa chọn cục bộ, loại-trừ-lẫn-nhau đơn giản như chuyển đổi đơn vị tiền tệ, không phải điều hướng cả panel." },
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
