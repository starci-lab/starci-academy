import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"

import { SegmentedControl } from "./index"

const meta: Meta<typeof SegmentedControl> = {
    title: "Blocks/SegmentedControl",
    component: SegmentedControl,
}

export default meta

type Story = StoryObj<typeof SegmentedControl>

/** Pill segmented cho một lựa chọn loại-trừ nhỏ, drive LOCAL state (toggle tiền tệ, đổi view…) — KHÔNG đổi cả panel/route (đó là TabsCard). */
export const Default: Story = {
    parameters: { usage: "Pill segmented cho lựa chọn loại-trừ nhỏ drive local state — không đổi panel/route (đó là TabsCard)." },
    render: () => {
        const [v, setV] = useState("quarter")
        return (
            <SegmentedControl
                ariaLabel="Chu kỳ thanh toán"
                value={v}
                onChange={setV}
                items={[
                    { value: "month", label: "Tháng" },
                    { value: "quarter", label: "Quý" },
                    { value: "year", label: "Năm" },
                ]}
            />
        )
    },
}

/** 2 segment — trường hợp nhị phân (VD Lưới / Danh sách). */
export const TwoWay: Story = {
    parameters: { usage: "2 segment — nhị phân (Lưới / Danh sách)." },
    render: () => {
        const [v, setV] = useState("grid")
        return (
            <SegmentedControl
                ariaLabel="Kiểu hiển thị"
                value={v}
                onChange={setV}
                items={[
                    { value: "grid", label: "Lưới" },
                    { value: "list", label: "Danh sách" },
                ]}
            />
        )
    },
}

/** `size="sm"` — track co về `w-fit`, cho switch phụ trong panel/modal (không chiếm cả hàng). */
export const Small: Story = {
    parameters: { usage: "size=sm: track w-fit, cho switch phụ trong panel/modal (không chiếm cả hàng)." },
    render: () => {
        const [v, setV] = useState("vi")
        return (
            <SegmentedControl
                ariaLabel="Ngôn ngữ"
                size="sm"
                value={v}
                onChange={setV}
                items={[
                    { value: "vi", label: "Tiếng Việt" },
                    { value: "en", label: "English" },
                ]}
            />
        )
    },
}
