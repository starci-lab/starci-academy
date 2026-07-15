import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ElementCloseButton } from "./index"

const meta: Meta<typeof ElementCloseButton> = {
    title: "Core/Button/ElementCloseButton",
    component: ElementCloseButton,
}
export default meta
type Story = StoryObj<typeof ElementCloseButton>

/** Dải năm tông màu đặt cạnh nhau để so sánh nhanh: chọn tông khớp với màu ngữ nghĩa của bề mặt đang đóng. */
export const AllTones: Story = {
    parameters: { usage: "Dải năm tông màu (neutral, accent, success, warning, danger) đặt cạnh nhau để so sánh nhanh; chọn tông khớp với màu ngữ nghĩa của bề mặt đang đóng." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Neutral</Label>
                    <Typography type="body-sm" color="muted">
                        Mặc định — chủ là banner/panel không mang màu ngữ nghĩa nào.
                    </Typography>
                </div>
                <ElementCloseButton label="Đóng banner" onPress={() => {}} tone="neutral" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">
                        Chủ là khối/chip accent — X ăn theo tông của chủ, không tự chọn màu.
                    </Typography>
                </div>
                <ElementCloseButton label="Đóng thẻ" onPress={() => {}} tone="accent" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">
                        Chủ là callout success (đã xong, đã lưu).
                    </Typography>
                </div>
                <ElementCloseButton label="Đóng thông báo" onPress={() => {}} tone="success" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">
                        Chủ là callout warning (cần chú ý, sắp hết hạn).
                    </Typography>
                </div>
                <ElementCloseButton label="Đóng cảnh báo" onPress={() => {}} tone="warning" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">
                        Chủ là callout danger (lỗi, hỏng).
                    </Typography>
                </div>
                <ElementCloseButton label="Đóng lỗi" onPress={() => {}} tone="danger" />
            </div>
        </div>
    ),
}
