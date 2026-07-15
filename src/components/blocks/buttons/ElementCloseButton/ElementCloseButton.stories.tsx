import type { Meta, StoryObj } from "@storybook/nextjs"
import { ElementCloseButton } from "./index"

const meta: Meta<typeof ElementCloseButton> = {
    title: "Blocks/ElementCloseButton",
    component: ElementCloseButton,
}
export default meta
type Story = StoryObj<typeof ElementCloseButton>

/** Nút X trung tính, dùng để đóng một banner hoặc panel không mang màu sắc ngữ nghĩa riêng. */
export const Default: Story = {
    parameters: { usage: "Nút X trung tính, dùng để đóng một banner hoặc panel không mang màu sắc ngữ nghĩa riêng." },
    render: () => <ElementCloseButton label="Đóng" onPress={() => {}} />,
}

/** Tông accent để đóng một chip hoặc callout đang mang màu nhấn của thương hiệu. */
export const AccentTone: Story = {
    parameters: { usage: "Tông accent để đóng một chip hoặc callout đang mang màu nhấn của thương hiệu." },
    render: () => <ElementCloseButton label="Đóng thẻ" onPress={() => {}} tone="accent" />,
}

/** Tông success để đóng một thông báo xác nhận thành công, giữ màu X đồng bộ với banner. */
export const SuccessTone: Story = {
    parameters: { usage: "Tông success để đóng một thông báo xác nhận thành công, giữ màu X đồng bộ với banner." },
    render: () => <ElementCloseButton label="Đóng thông báo" onPress={() => {}} tone="success" />,
}

/** Tông warning cho banner cảnh báo, còn tông danger cho callout lỗi nghiêm trọng — cùng đặt cạnh nhau để so sánh. */
export const WarningAndDangerTone: Story = {
    parameters: { usage: "Tông warning cho banner cảnh báo, còn tông danger cho callout lỗi nghiêm trọng — cùng đặt cạnh nhau để so sánh." },
    render: () => (
        <div className="flex items-center gap-4">
            <ElementCloseButton label="Đóng cảnh báo" onPress={() => {}} tone="warning" />
            <ElementCloseButton label="Đóng lỗi" onPress={() => {}} tone="danger" />
        </div>
    ),
}
