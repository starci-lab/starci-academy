import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card } from "@heroui/react"

import { StatPair } from "./index"

const meta: Meta<typeof StatPair> = {
    title: "Blocks/StatPair",
    component: StatPair,
    args: {
        value: "1,204",
        label: "Người theo dõi",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

/** The four stats reused across the layout stories below. */
const STATS = [
    { value: "1,204", label: "Người theo dõi" },
    { value: "87%", label: "Tỉ lệ hoàn thành" },
    { value: "12", label: "Khóa học đã đăng ký" },
    { value: "4.9", label: "Đánh giá trung bình" },
]

/** Một số liệu đơn lẻ: value lớn (`h4`) trên nhãn mờ, canh trái. Block này frameless — luôn đặt trong card của parent. */
export const Default: Story = {
    parameters: { usage: "Một số liệu đơn lẻ: value lớn trên nhãn mờ, canh trái. Frameless — luôn đặt trong card của parent." },
}

/** Ribbon: 4 StatPair thẳng MỘT hàng ngang trong 1 card, ngăn nhau bằng divider dọc — dải thống kê hero / hồ sơ (bề ngang rộng). Parent lo card + divider. */
export const Row: Story = {
    parameters: { usage: "Ribbon: 4 StatPair thẳng một hàng ngang trong 1 card, ngăn nhau bằng divider dọc — dải thống kê hero / hồ sơ. Parent lo card + divider." },
    render: () => (
        <Card variant="default" className="w-fit">
            <div className="flex items-stretch divide-x divide-default">
                {STATS.map((stat) => (
                    <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
                        <StatPair value={stat.value} label={stat.label} />
                    </div>
                ))}
            </div>
        </Card>
    ),
}

/** Grid 2 cột: 4 StatPair xếp lưới trong 1 card khi bề ngang HẸP (sidebar / widget) — cùng bộ số nhưng không đủ chỗ cho 1 hàng. Parent lo card + khoảng cách. */
export const Grid: Story = {
    parameters: { usage: "Grid 2 cột: 4 StatPair xếp lưới trong 1 card khi bề ngang hẹp (sidebar / widget). Parent lo card + khoảng cách." },
    render: () => (
        <Card variant="default" className="w-[420px]">
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                {STATS.map((stat) => (
                    <StatPair key={stat.label} value={stat.value} label={stat.label} />
                ))}
            </div>
        </Card>
    ),
}

/** Nhãn cực ngắn ("XP") — value+label vẫn dính chặt (`gap-0`), canh trái, không lệch với các ô khác trong cùng hàng. */
export const ShortLabel: Story = {
    args: { value: "320", label: "XP" },
    parameters: { usage: "Nhãn cực ngắn (VD \"XP\") — value+label vẫn dính chặt, canh trái, không lệch với các ô khác cùng hàng." },
}
