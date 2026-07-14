import type { Meta, StoryObj } from "@storybook/nextjs"

import { ProgressMeter } from "./index"

const meta: Meta<typeof ProgressMeter> = {
    title: "Blocks/ProgressMeter",
    component: ProgressMeter,
    parameters: {
        layout: "padded",
    },
}

export default meta

type Story = StoryObj<typeof ProgressMeter>

/**
 * Dùng khi chỉ cần thanh tiến độ trần, không nhãn không số — ví dụ chèn compact trong 1 hàng list.
 */
export const Default: Story = {
    args: {
        value: 45,
    },
    parameters: {
        usage: "Dùng khi chỉ cần thanh tiến độ trần, không nhãn không số — ví dụ chèn compact trong 1 hàng list.",
    },
}

/**
 * Chọn tổ hợp nhãn/số theo mức chi tiết cần cho user: có label khi cần biết ĐÓ LÀ tiến độ gì, thêm showValue khi user cần biết CÒN BAO NHIÊU (%).
 */
export const LabelAndValueVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <ProgressMeter value={62} label="Tiến độ khóa học" />
            <ProgressMeter value={78} label="Hoàn thành module" showValue />
            <ProgressMeter value={33} showValue />
        </div>
    ),
    parameters: {
        usage: "Chọn tổ hợp nhãn/số theo mức chi tiết cần cho user: có label khi cần biết ĐÓ LÀ tiến độ gì, thêm showValue khi user cần biết CÒN BAO NHIÊU (%).",
    },
}

/**
 * Đổi màu theo Ý NGHĨA của con số (mặc định trung tính, success khi đạt/qua bài, warning khi sắp hết hạn, danger khi điểm thấp) — không phải chọn màu tuỳ thích.
 */
export const Tones: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <ProgressMeter value={45} label="Mặc định" showValue color="accent" />
            <ProgressMeter value={100} label="Bài kiểm tra" showValue color="success" />
            <ProgressMeter value={55} label="Thời gian còn lại" showValue color="warning" />
            <ProgressMeter value={12} label="Điểm số hiện tại" showValue color="danger" />
        </div>
    ),
    parameters: {
        usage: "Đổi màu theo Ý NGHĨA của con số (mặc định trung tính, success khi đạt/qua bài, warning khi sắp hết hạn, danger khi điểm thấp) — không phải chọn màu tuỳ thích.",
    },
}

/**
 * Dùng để kiểm tra 2 trạng thái biên (chưa bắt đầu 0% / đã hoàn thành 100%) render đúng, không vỡ thanh hay lệch số.
 */
export const States: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <ProgressMeter value={0} label="Chưa bắt đầu" showValue />
            <ProgressMeter value={100} label="Hoàn thành" showValue color="success" />
        </div>
    ),
    parameters: {
        usage: "Dùng để kiểm tra 2 trạng thái biên (chưa bắt đầu 0% / đã hoàn thành 100%) render đúng, không vỡ thanh hay lệch số.",
    },
}

/**
 * Dùng khi đơn vị đếm không phải %, ví dụ đếm bài học/câu hỏi hoàn thành trên tổng số (7/10) thay vì tỉ lệ phần trăm.
 */
export const CustomMax: Story = {
    args: {
        value: 7,
        max: 10,
        label: "7 / 10 bài học",
        showValue: true,
    },
    parameters: {
        usage: "Dùng khi đơn vị đếm không phải %, ví dụ đếm bài học/câu hỏi hoàn thành trên tổng số (7/10) thay vì tỉ lệ phần trăm.",
    },
}
