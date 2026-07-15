import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlusIcon, ChatCircleIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "./index"

const meta: Meta<typeof FloatingActionButton> = {
    title: "Blocks/FloatingActionButton",
    component: FloatingActionButton,
}
export default meta
type Story = StoryObj<typeof FloatingActionButton>

/** Dùng khi cần một nút nổi ở góc dưới-phải để mở hành động chính của trang, ví dụ tạo mới nhanh. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần một nút nổi ở góc dưới-phải để mở hành động chính của trang, ví dụ tạo mới nhanh." },
    render: () => (
        <FloatingActionButton onPress={() => {}} ariaLabel="Tạo mới">
            <PlusIcon />
        </FloatingActionButton>
    ),
}

/** Dùng biểu tượng trò chuyện khi nút nổi mở một khung chat hoặc trợ lý hỗ trợ. */
export const ChatAction: Story = {
    parameters: { usage: "Dùng biểu tượng trò chuyện khi nút nổi mở một khung chat hoặc trợ lý hỗ trợ." },
    render: () => (
        <FloatingActionButton onPress={() => {}} ariaLabel="Mở trò chuyện hỗ trợ">
            <ChatCircleIcon />
        </FloatingActionButton>
    ),
}

/** Dùng biểu tượng bút khi nút nổi dẫn tới hành động chỉnh sửa nội dung đang xem. */
export const EditAction: Story = {
    parameters: { usage: "Dùng biểu tượng bút khi nút nổi dẫn tới hành động chỉnh sửa nội dung đang xem." },
    render: () => (
        <FloatingActionButton onPress={() => {}} ariaLabel="Chỉnh sửa nội dung">
            <PencilSimpleIcon />
        </FloatingActionButton>
    ),
}

/** Truyền thêm className khi cần điều chỉnh vị trí neo cho phù hợp với một khung chứa cụ thể. */
export const CustomPosition: Story = {
    parameters: { usage: "Truyền thêm className khi cần điều chỉnh vị trí neo cho phù hợp với một khung chứa cụ thể." },
    render: () => (
        <FloatingActionButton
            onPress={() => {}}
            ariaLabel="Tạo mới"
            className="bottom-10 right-10"
        >
            <PlusIcon />
        </FloatingActionButton>
    ),
}
