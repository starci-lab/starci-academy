import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ProgressMeter } from "./index"

const meta: Meta<typeof ProgressMeter> = {
    title: "Core/Stat/ProgressMeter",
    component: ProgressMeter,
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
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Thanh trần</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi chỉ cần thanh tiến độ, không nhãn không số — chèn compact trong một hàng list.
                </Typography>
            </div>
            <div className="w-80">
                <ProgressMeter {...args} />
            </div>
        </div>
    ),
}

/**
 * Chọn tổ hợp nhãn/số theo mức chi tiết cần cho user: có label khi cần biết ĐÓ LÀ tiến độ gì, thêm showValue khi user cần biết CÒN BAO NHIÊU (%).
 */
export const LabelAndValueVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Chỉ nhãn</Label>
                    <Typography type="body-sm" color="muted">Dùng khi user cần biết đó là tiến độ gì, nhưng con số phần trăm không quan trọng bằng.</Typography>
                </div>
                <ProgressMeter value={62} label="Tiến độ khóa học" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Nhãn và số</Label>
                    <Typography type="body-sm" color="muted">Dùng khi user cần cả tên tiến độ lẫn phần trăm còn lại, ví dụ trang chi tiết khóa học.</Typography>
                </div>
                <ProgressMeter value={78} label="Hoàn thành module" showValue />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Chỉ số</Label>
                    <Typography type="body-sm" color="muted">Dùng khi ngữ cảnh xung quanh đã nói rõ đó là tiến độ gì, chỉ cần bổ sung con số phần trăm.</Typography>
                </div>
                <ProgressMeter value={33} showValue />
            </div>
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
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">Mặc định, dùng khi con số chỉ là tiến độ trung tính không mang ý nghĩa tốt hay xấu.</Typography>
                </div>
                <ProgressMeter value={45} label="Mặc định" showValue color="accent" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">Dùng khi con số báo đạt hoặc qua bài, ví dụ hoàn thành đủ hay điểm vượt ngưỡng.</Typography>
                </div>
                <ProgressMeter value={100} label="Bài kiểm tra" showValue color="success" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">Dùng khi con số cảnh báo sắp tới hạn, ví dụ thời gian còn lại đang cạn dần.</Typography>
                </div>
                <ProgressMeter value={55} label="Thời gian còn lại" showValue color="warning" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">Dùng khi con số báo mức nguy hiểm, ví dụ điểm thấp dưới ngưỡng đạt.</Typography>
                </div>
                <ProgressMeter value={12} label="Điểm số hiện tại" showValue color="danger" />
            </div>
        </div>
    ),
    parameters: {
        usage: "Đổi màu theo Ý NGHĨA của con số (mặc định trung tính, success khi đạt/qua bài, warning khi sắp hết hạn, danger khi điểm thấp) — không phải chọn màu tuỳ thích.",
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
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đơn vị đếm</Label>
                <Typography type="body-sm" color="muted">
                    Khi đơn vị không phải % — đếm theo tổng thật (7/10 bài) thay vì phần trăm.
                </Typography>
            </div>
            <div className="w-80">
                <ProgressMeter {...args} />
            </div>
        </div>
    ),
}
