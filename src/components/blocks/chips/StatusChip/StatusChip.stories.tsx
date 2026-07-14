import type { Meta, StoryObj } from "@storybook/nextjs"

import { StatusChip } from "./index"
import type { StatusChipProps } from "./index"

const meta: Meta<typeof StatusChip> = {
    title: "Blocks/StatusChip",
    component: StatusChip,
    args: {
        children: "Đang hoạt động",
    },
}

export default meta

type Story = StoryObj<typeof StatusChip>

/**
 * Dùng cho trạng thái "chưa xác định/chưa xử lý" — bản nháp, item chờ nhập liệu — tông trung tính không gây chú ý.
 */
export const Default: Story = {
    args: {
        tone: "neutral",
        children: "Nháp",
    },
}

const TONES: { tone: NonNullable<StatusChipProps["tone"]>; label: string }[] = [
    { tone: "success", label: "Đã hoàn thành" },
    { tone: "warning", label: "Sắp hết hạn" },
    { tone: "danger", label: "Đã huỷ" },
    { tone: "accent", label: "Nổi bật" },
]

/**
 * Chọn tone theo Ý NGHĨA trạng thái thật trong app: success = đã xong, warning = sắp hết hạn/cần chú ý, danger = đã huỷ/lỗi, accent = nổi bật/mới — không chọn theo thẩm mỹ.
 */
export const Tones: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            {TONES.map(({ tone, label }) => (
                <StatusChip key={tone} tone={tone}>
                    {label}
                </StatusChip>
            ))}
        </div>
    ),
}

const CheckIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M13.5 4.5L6 12L2.5 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

/**
 * Thêm icon khi trạng thái cần xác nhận trực quan nhanh (đã xác minh, đã duyệt) — không dùng icon cho mọi chip, chỉ khi icon củng cố thêm ý nghĩa.
 */
export const WithIcon: Story = {
    args: {
        tone: "success",
        icon: <CheckIcon />,
        children: "Đã xác minh",
    },
}
