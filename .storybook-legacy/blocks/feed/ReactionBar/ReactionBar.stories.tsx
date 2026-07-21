import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, userEvent, within } from "storybook/test"
import { ReactionBar } from "@/components/blocks/feed/ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { usage, Controlled } from "./components"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ReactionBar> = {
    title: "Features/Social/ReactionBar",
    component: ReactionBar,
}
export default meta
type Story = StoryObj<typeof ReactionBar>

/**
 * Toàn bộ ma trận trạng thái của ReactionBar: chưa có tương tác, người xem đã
 * react, chỉ đọc (còn số đếm), chỉ đọc và rỗng (ẩn hẳn). Quyền react do caller
 * quyết định qua có truyền onReact hay không — không có prop readOnly riêng.
 */
export const AllVariants: Story = {
    parameters: { usage },
    render: () => (
        <Gallery>
            <Variant
                label="Chưa có tương tác"
                hint="Chưa ai react và người xem được phép react: chỉ hiện nút mở picker, không có số đếm."
            >
                <Controlled initialCount={0} initialReaction={null} />
            </Variant>
            <Variant
                label="Người xem đã react"
                hint="Truyền myReaction khi người xem đã react: nút trigger đổi sang đúng emoji đã chọn, bấm lại để bỏ reaction."
            >
                <Controlled initialCount={12} initialReaction={ReactionType.Love} />
            </Variant>
            <Variant
                label="Chỉ đọc"
                hint="Bỏ onReact khi người xem không được react, ví dụ hoạt động của chính họ: picker biến mất, số đếm vẫn còn."
            >
                <ReactionBar count={7} myReaction={ReactionType.Like} />
            </Variant>
            <Variant
                label="Chỉ đọc và rỗng"
                hint="Không có reaction nào và không được phép react thì bar trả về null — biến mất hoàn toàn, không để lại khoảng trống thay vì hiện rỗng."
            >
                <ReactionBar count={0} myReaction={null} />
            </Variant>
        </Gallery>
    ),
}

/**
 * Trường hợp "nhiều icon" duy nhất của block này: mở picker ra một hàng cố định
 * 6 emoji (Like, Love, Haha, Wow, Sad, Angry) — không phải bảng tổng hợp số đếm
 * từ API. Story tự mở picker để xác nhận đủ 6 nút.
 */
export const PickerGroup: Story = {
    parameters: {
        usage:
            "Bấm nút trigger để mở picker: đây là lúc bar hiện nhiều icon (nhóm cố định " +
            "👍 ❤️ 😄 😮 😢 😠). Không có chế độ tổng hợp số đếm top-reaction dạng stacked — " +
            "props chỉ gồm count + myReaction.",
    },
    render: () => (
        <div className="pt-12">
            <Controlled initialCount={12} initialReaction={ReactionType.Love} />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole("button", { name: "React" }))
        await expect(canvas.getByRole("button", { name: ReactionType.Like })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Love })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Haha })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Wow })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Sad })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Angry })).toBeInTheDocument()
    },
}
