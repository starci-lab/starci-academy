import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarGroup } from "@/components/blocks/identity/AvatarGroup"
import { Gallery, Variant } from "../../../../story-kit"
import { users } from "./components"

const meta: Meta<typeof AvatarGroup> = {
    title: "Legacy/Blocks/Identity/AvatarGroup",
    component: AvatarGroup,
}
export default meta
type Story = StoryObj<typeof AvatarGroup>

/**
 * Toàn bộ ma trận trạng thái của AvatarGroup: mặc định (danh sách ngắn không cần
 * max), tràn (max + chip +N gom phần còn lại), và rỗng (không render gì). Dùng để
 * tra khi nào cần đặt max và khi nào block tự ẩn hoàn toàn.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Bỏ max khi danh sách vốn ngắn và không thể tăng: người tham gia một buổi, tác giả của một bài viết. Ai chưa có ảnh sẽ dùng avatar được tạo từ username của họ."
            >
                <AvatarGroup users={users.slice(0, 3)} />
            </Variant>
            <Variant
                label="Tràn (chip +N)"
                hint="Đặt max ở bất cứ đâu số lượng đến từ dữ liệu người dùng và không có giới hạn trên: follower, học viên. Chip +N gom phần còn lại, giữ khung không bị kéo dài dù danh sách dài bao nhiêu."
            >
                <AvatarGroup max={3} users={users} />
            </Variant>
            <Variant
                label="Rỗng"
                hint="Khi chưa có ai tham gia, block biến mất hoàn toàn, không để lại khoảng trống. Nghĩa là ở đâu cần nói rõ &quot;chưa có ai&quot; bạn phải tự dựng empty state riêng — không dựa vào block này."
            >
                <AvatarGroup users={[]} />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của AvatarGroup: mặc định (danh sách ngắn không cần max), tràn " +
            "(max + chip +N gom phần còn lại), và rỗng (không render gì). Dùng khi cần tra khi nào đặt max " +
            "và xác nhận block tự ẩn hoàn toàn ở trạng thái rỗng.",
    },
}
