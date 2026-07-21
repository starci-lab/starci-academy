import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CommunityCommentRow } from "@/components/blocks/feed/CommunityCommentRow"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CommunityCommentRow> = {
    title: "Blocks/Feed/CommunityCommentRow",
    component: CommunityCommentRow,
}
export default meta
type Story = StoryObj<typeof CommunityCommentRow>

const usage = "Một dòng bình luận trong cộng đồng: avatar + tên tác giả (kèm huy hiệu founder nếu có) + thời gian tương đối, phần thân markdown, thanh cảm xúc, và một chỗ trống cho action do feature cha cung cấp (ví dụ nút Trả lời). Block chỉ trình bày dữ liệu — quyền react do cha quyết định qua việc có truyền onReact hay không."

/** Bình luận vừa mới, chưa ai thả cảm xúc, tác giả là học viên thường. */
const freshComment: QueryCommunityCommentNode = {
    id: "c-fresh",
    body: "Mình vẫn chưa hiểu khi nào nên dùng covering index thay vì index thường, có ai giải thích giúp không?",
    isDeleted: false,
    editedAt: null,
    createdAt: "2026-07-20T08:30:00.000Z",
    parentCommentId: null,
    author: { id: "u-lan", username: "lan.pham", displayName: "Lena Pham", avatar: null },
    replyCount: 0,
    reactions: { total: 0, myReaction: null },
    isFounderAuthor: false,
}

/** Bình luận đã có nhiều người thả cảm xúc, người xem cũng đã react. */
const reactedComment: QueryCommunityCommentNode = {
    id: "c-reacted",
    body: "Covering index đã chứa sẵn mọi cột câu truy vấn cần, nên không phải quay lại đọc bảng gốc nữa. Dùng khi truy vấn đó chạy nhiều và ít đổi cấu trúc.",
    isDeleted: false,
    editedAt: null,
    createdAt: "2026-07-20T08:45:00.000Z",
    parentCommentId: "c-fresh",
    author: { id: "u-minh", username: "minh.tran", displayName: "Michael Tran", avatar: null },
    replyCount: 1,
    reactions: { total: 9, myReaction: ReactionType.Love },
    isFounderAuthor: false,
}

/** Tác giả là founder — hiện huy hiệu SealCheck cạnh tên. */
const founderComment: QueryCommunityCommentNode = {
    id: "c-founder",
    body: "Góc nhìn hay đó! Bên mình khuyến nghị đo bằng EXPLAIN ANALYZE thật trước khi thêm index, đừng đoán theo cảm giác.",
    isDeleted: false,
    editedAt: null,
    createdAt: "2026-07-20T09:00:00.000Z",
    parentCommentId: "c-fresh",
    author: { id: "u-quang", username: "quang.founder", displayName: "Quinn Nguyen", avatar: null },
    replyCount: 0,
    reactions: { total: 14, myReaction: null },
    isFounderAuthor: true,
}

/** Bình luận dài nhiều đoạn — kiểm phần thân markdown không vỡ layout khi nội dung dài. */
const longComment: QueryCommunityCommentNode = {
    id: "c-long",
    body: "Mình tổng hợp lại luồng debug hôm nay cho ai chưa theo kịp:\n\n1. Query chậm vì thiếu index trên `order_id`.\n2. Thêm index rồi nhưng planner vẫn seq scan do thống kê cũ.\n3. Chạy `ANALYZE` lại thì planner mới chọn index scan.\n\nKết luận: thêm index xong nhớ `ANALYZE`, đừng chỉ nhìn EXPLAIN cũ mà kết luận index vô dụng.",
    isDeleted: false,
    editedAt: "2026-07-20T09:40:00.000Z",
    createdAt: "2026-07-20T09:15:00.000Z",
    parentCommentId: null,
    author: { id: "u-hoa", username: "hoa.le", displayName: "Hannah Le", avatar: null },
    replyCount: 3,
    reactions: { total: 5, myReaction: null },
    isFounderAuthor: false,
}

/** Wrapper sở hữu state cục bộ, mô phỏng đúng luồng thật: bấm react cập nhật count + myReaction. */
const Controlled = ({ initialComment }: { initialComment: QueryCommunityCommentNode }) => {
    const [comment, setComment] = useState(initialComment)

    const handleReact = (type: ReactionType | null) => {
        setComment((previous) => {
            const hadReaction = previous.reactions.myReaction !== null
            const hasReaction = type !== null
            const delta = hasReaction ? (hadReaction ? 0 : 1) : hadReaction ? -1 : 0
            return {
                ...previous,
                reactions: { total: previous.reactions.total + delta, myReaction: type },
            }
        })
    }

    return <CommunityCommentRow comment={comment} onReact={handleReact} />
}

/** Nút "Trả lời" chữ thường, đúng affordance mà CommentThread truyền vào slot actions. */
const replyAction = (
    <button
        type="button"
        onClick={() => {}}
        className="cursor-pointer text-xs font-medium text-muted transition-colors hover:text-foreground"
    >
        Trả lời
    </button>
)

/**
 * Toàn bộ state của CommunityCommentRow trong một gallery: bình luận mới chưa ai
 * react (có bấm thật), đã có người react, tác giả là founder, thân dài nhiều đoạn,
 * có slot actions, và chế độ chỉ xem khi không được quyền react.
 */
export const AllVariants: Story = {
    parameters: { usage },
    render: () => (
        <Gallery>
            <Variant
                label="Bình luận mới, chưa ai thả cảm xúc"
                hint="Dùng khi người xem được quyền react lần đầu — chỉ có nút mở picker, chưa có số đếm. Bấm thử để thấy count + myReaction cập nhật."
            >
                <Controlled initialComment={freshComment} />
            </Variant>
            <Variant
                label="Đã có người react, người xem cũng đã react"
                hint="Truyền reactions.total + myReaction đã có sẵn — trigger đổi sang đúng emoji người xem chọn."
            >
                <CommunityCommentRow comment={reactedComment} onReact={() => {}} />
            </Variant>
            <Variant
                label="Tác giả là founder"
                hint="isFounderAuthor=true hiện thêm huy hiệu SealCheck ngay cạnh tên tác giả."
            >
                <CommunityCommentRow comment={founderComment} onReact={() => {}} />
            </Variant>
            <Variant
                label="Thân bình luận dài, nhiều đoạn"
                hint="Markdown nhiều dòng/list — kiểm phần thân không vỡ layout và vẫn căn đều với avatar + thanh cảm xúc bên dưới."
            >
                <CommunityCommentRow comment={longComment} onReact={() => {}} />
            </Variant>
            <Variant
                label="Có actions kèm nút Trả lời"
                hint="Feature cha (ví dụ CommentThread) truyền một nút Trả lời qua slot actions, đặt cạnh thanh cảm xúc."
            >
                <CommunityCommentRow comment={reactedComment} onReact={() => {}} actions={replyAction} />
            </Variant>
            <Variant
                label="Chỉ xem, không được react"
                hint="Bỏ onReact khi người xem không có quyền react (ví dụ đang xem hoạt động của chính mình) — thanh cảm xúc chỉ còn số đếm + emoji đã chọn, không có picker."
            >
                <CommunityCommentRow comment={reactedComment} />
            </Variant>
        </Gallery>
    ),
}
