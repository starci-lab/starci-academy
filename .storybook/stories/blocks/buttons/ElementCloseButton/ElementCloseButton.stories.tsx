import type { Meta, StoryObj } from "@storybook/nextjs"
import { ElementCloseButton } from "./ElementCloseButton"

const meta: Meta<typeof ElementCloseButton> = {
    title: "Primitives/Button/ElementCloseButton",
    component: ElementCloseButton,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ElementCloseButton>

/** Mặc định — khi host là banner/panel không mang màu ngữ nghĩa nào. */
export const Neutral: Story = {
    render: () => (
        <div className="p-8">
            <ElementCloseButton label="Close banner" onPress={() => {}} tone="neutral" />
        </div>
    ),
}

/** Khi host là block/chip accent — nút X theo tone của host, không tự chọn màu riêng. */
export const Accent: Story = {
    render: () => (
        <div className="p-8">
            <ElementCloseButton label="Close card" onPress={() => {}} tone="accent" />
        </div>
    ),
}

/** Khi host là callout success (đã xong, đã lưu). */
export const Success: Story = {
    render: () => (
        <div className="p-8">
            <ElementCloseButton label="Close notification" onPress={() => {}} tone="success" />
        </div>
    ),
}

/** Khi host là callout warning (cần chú ý, sắp hết hạn). */
export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <ElementCloseButton label="Close warning" onPress={() => {}} tone="warning" />
        </div>
    ),
}

/** Khi host là callout danger (lỗi, hỏng). */
export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <ElementCloseButton label="Close error" onPress={() => {}} tone="danger" />
        </div>
    ),
}
