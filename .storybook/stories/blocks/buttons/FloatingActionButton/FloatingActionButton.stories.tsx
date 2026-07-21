import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlusIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "./FloatingActionButton"

const meta: Meta<typeof FloatingActionButton> = {
    title: "Primitives/Button/FloatingActionButton",
    component: FloatingActionButton,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FloatingActionButton>

/**
 * Nút hành động chính dạng nổi ở góc dưới-phải màn hình để mở action chính của
 * trang (ví dụ quick create). Block tự ghim vào góc bằng `fixed`, nên nó bám mép
 * màn hình thay vì chảy inline — đừng bọc trong element khác để định vị.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <FloatingActionButton onPress={() => {}} ariaLabel="Create new">
                <PlusIcon />
            </FloatingActionButton>
        </div>
    ),
}
