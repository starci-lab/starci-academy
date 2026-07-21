import type { Meta, StoryObj } from "@storybook/nextjs"
import { CommentThread } from "@/components/blocks/feed/CommentThread"
import { baseComments, Controlled } from "./components"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CommentThread> = {
    title: "Features/Social/CommentThread",
    component: CommentThread,
}
export default meta
type Story = StoryObj<typeof CommentThread>

/**
 * Toàn bộ ma trận trạng thái của CommentThread: một luồng thảo luận có sẵn hai
 * cấp reply lồng nhau, và trạng thái rỗng khi chưa có bình luận nào. Dùng để tra
 * khi nào từng trạng thái xuất hiện và cách Composer/Reply phản ứng ở mỗi trạng thái.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có nội dung, hai cấp reply"
                hint="Dùng cho một luồng bình luận đã có nội dung: mỗi node là một CommunityCommentRow, reply lồng sâu một cấp phía sau một guide rail (có giới hạn độ sâu), mỗi node có nút Reply mở Composer inline, và một Composer gốc để thêm bình luận cấp cao nhất. Ở đây là câu hỏi gốc, câu trả lời của founder, và một reply lồng sâu thêm một cấp; bấm Reply trên bất kỳ node nào để mở composer inline."
            >
                <Controlled initialComments={baseComments} />
            </Variant>
            <Variant
                label="Rỗng"
                hint="Dùng khi luồng chưa có bình luận nào: danh sách rỗng nên chỉ còn Composer gốc nằm trên đầu, mời gửi bình luận đầu tiên. Không có node nào thì chỉ Composer gốc hiện ra; gửi một bình luận sẽ tạo node cấp cao nhất đầu tiên."
            >
                <Controlled initialComments={[]} />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của CommentThread: một luồng thảo luận có sẵn hai cấp " +
            "reply lồng nhau (guide rail, Reply mở Composer inline), và trạng thái rỗng khi chưa " +
            "có bình luận nào (chỉ còn Composer gốc). Dùng để tra khi nào mỗi trạng thái xuất hiện.",
    },
}
