import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
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
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Hành động chính của trang mà người dùng phải với tới được ở mọi vị trí cuộn. Block tự ghim góc dưới-phải bằng fixed nên nó bám mép màn hình chứ không nằm theo dòng — đừng bọc thêm wrapper để định vị.
                </Typography>
            </div>
            <FloatingActionButton onPress={() => {}} ariaLabel="Tạo mới">
                <PlusIcon />
            </FloatingActionButton>
        </div>
    ),
}
