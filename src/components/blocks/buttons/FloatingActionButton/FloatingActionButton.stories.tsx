import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlusIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "./index"

const meta: Meta<typeof FloatingActionButton> = {
    title: "Blocks/Button/FloatingActionButton",
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
