import type { Meta, StoryObj } from "@storybook/nextjs"
import { ElementCloseButton } from "./index"

const meta: Meta<typeof ElementCloseButton> = {
    title: "Blocks/Button/ElementCloseButton",
    component: ElementCloseButton,
}
export default meta
type Story = StoryObj<typeof ElementCloseButton>

/** Nút X trung tính, dùng để đóng một banner hoặc panel không mang màu sắc ngữ nghĩa riêng. */
export const Default: Story = {
    parameters: { usage: "Nút X trung tính, dùng để đóng một banner hoặc panel không mang màu sắc ngữ nghĩa riêng." },
    render: () => <ElementCloseButton label="Đóng" onPress={() => {}} />,
}

/** Dải năm tông màu đặt cạnh nhau để so sánh nhanh: chọn tông khớp với màu ngữ nghĩa của bề mặt đang đóng. */
export const AllTones: Story = {
    parameters: { usage: "Dải năm tông màu (neutral, accent, success, warning, danger) đặt cạnh nhau để so sánh nhanh; chọn tông khớp với màu ngữ nghĩa của bề mặt đang đóng." },
    render: () => (
        <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-2">
                <ElementCloseButton label="Đóng banner" onPress={() => {}} tone="neutral" />
                <span className="text-xs text-muted">neutral</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <ElementCloseButton label="Đóng thẻ" onPress={() => {}} tone="accent" />
                <span className="text-xs text-muted">accent</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <ElementCloseButton label="Đóng thông báo" onPress={() => {}} tone="success" />
                <span className="text-xs text-muted">success</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <ElementCloseButton label="Đóng cảnh báo" onPress={() => {}} tone="warning" />
                <span className="text-xs text-muted">warning</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <ElementCloseButton label="Đóng lỗi" onPress={() => {}} tone="danger" />
                <span className="text-xs text-muted">danger</span>
            </div>
        </div>
    ),
}
