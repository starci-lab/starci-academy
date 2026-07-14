import type { Meta, StoryObj } from "@storybook/nextjs"

import { StatPair } from "./index"

const meta: Meta<typeof StatPair> = {
    title: "Blocks/StatPair",
    component: StatPair,
    parameters: { layout: "centered" },
    args: {
        value: "1,204",
        label: "Người theo dõi",
        align: "start",
        size: "md",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

/** Dùng mặc định cho 1 số liệu đơn lẻ trong card/sidebar (VD: số người theo dõi). */
export const Default: Story = {
    parameters: { usage: "Dùng mặc định cho 1 số liệu đơn lẻ trong card/sidebar (VD: số người theo dõi)." },
}

/** Soi nhanh mọi tổ hợp canh lề × cỡ chữ cạnh nhau — dùng khi xếp nhiều StatPair trong 1 hàng thống kê (dashboard, hồ sơ). */
export const Variants: Story = {
    parameters: { usage: "Soi nhanh mọi tổ hợp canh lề × cỡ chữ cạnh nhau — dùng khi xếp nhiều StatPair trong 1 hàng thống kê (dashboard, hồ sơ)." },
    render: () => (
        <div className="grid grid-cols-2 gap-10">
            <StatPair value="1,204" label="Người theo dõi" align="start" size="md" />
            <StatPair value="87%" label="Tỉ lệ hoàn thành" align="center" size="md" />
            <StatPair value="12" label="Khóa học đã đăng ký" align="start" size="lg" />
            <StatPair value="4.9" label="Đánh giá trung bình" align="center" size="lg" />
        </div>
    ),
}

/** Kiểm tra khi nhãn cực ngắn (VD: "XP") — đảm bảo không bị co lại lệch với các ô số liệu khác trong cùng hàng. */
export const ShortLabel: Story = {
    args: { value: "320", label: "XP" },
    parameters: { usage: "Kiểm tra khi nhãn cực ngắn (VD: \"XP\") — đảm bảo không bị co lại lệch với các ô số liệu khác trong cùng hàng." },
}
