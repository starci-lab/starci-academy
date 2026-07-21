import type { Meta, StoryObj } from "@storybook/nextjs"

import { ElementCloseButton } from "@/components/blocks/buttons/ElementCloseButton"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ElementCloseButton> = {
    title: "Primitives/Actions/ElementCloseButton",
    component: ElementCloseButton,
}
export default meta
type Story = StoryObj<typeof ElementCloseButton>

/**
 * Toàn bộ 5 tone của ElementCloseButton side-by-side: neutral, accent, success,
 * warning, danger. Dùng để tra tone nào khớp màu ngữ nghĩa của khối đang bị đóng —
 * nút X luôn theo tone của host, không tự chọn màu riêng.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Neutral"
                hint="Mặc định — khi host là banner/panel không mang màu ngữ nghĩa nào."
            >
                <ElementCloseButton label="Close banner" onPress={() => {}} tone="neutral" />
            </Variant>
            <Variant
                label="Accent"
                hint="Khi host là block/chip accent — nút X theo tone của host, không tự chọn màu riêng."
            >
                <ElementCloseButton label="Close card" onPress={() => {}} tone="accent" />
            </Variant>
            <Variant
                label="Success"
                hint="Khi host là callout success (đã xong, đã lưu)."
            >
                <ElementCloseButton label="Close notification" onPress={() => {}} tone="success" />
            </Variant>
            <Variant
                label="Warning"
                hint="Khi host là callout warning (cần chú ý, sắp hết hạn)."
            >
                <ElementCloseButton label="Close warning" onPress={() => {}} tone="warning" />
            </Variant>
            <Variant
                label="Danger"
                hint="Khi host là callout danger (lỗi, hỏng)."
            >
                <ElementCloseButton label="Close error" onPress={() => {}} tone="danger" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ 5 tone (neutral, accent, success, warning, danger) side by side để so sánh nhanh; " +
            "chọn tone khớp màu ngữ nghĩa của khối đang bị đóng.",
    },
}
