import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { CommunityCommentRow, type QueryCommunityCommentNode } from "./CommunityCommentRow"
import { ReactionType } from "../ReactionBar/ReactionBar"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof CommunityCommentRow> = {
    title: "Design/Feed/CommunityCommentRow",
    component: CommunityCommentRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CommunityCommentRow>

const ANATOMY = {
    primitives: [
        { name: "UserAvatar", role: "avatar tác giả bình luận" },
        { name: "MarkdownContent", role: "thân bình luận (compact, [&_p]:m-0)" },
        { name: "ReactionBar", role: "thả cảm xúc cho bình luận" },
    ],
    reason:
        "Một dòng bình luận cộng đồng gói header tác giả + thân markdown + reaction + slot actions vào một block, để CommentThread và các surface bình luận dùng chung một cách trình bày. Quyền react do caller quyết định qua onReact.",
}

/** Wrapper owning local state, simulating the real react flow. */
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

const defaultComment: QueryCommunityCommentNode = {
    id: "c-default",
    body: "Cảm ơn bạn, giải thích rất dễ hiểu!",
    isDeleted: false,
    editedAt: null,
    createdAt: "2026-07-20T08:00:00.000Z",
    parentCommentId: null,
    author: { id: "u-default", username: "an.nguyen", displayName: "An Nguyễn", avatar: null },
    replyCount: 0,
    reactions: { total: 2, myReaction: null },
    isFounderAuthor: false,
}

const longNameComment: QueryCommunityCommentNode = {
    id: "c-long-name",
    body: "Bình luận ngắn nhưng tên tác giả rất dài để test truncate.",
    isDeleted: false,
    editedAt: null,
    createdAt: "2026-07-20T10:00:00.000Z",
    parentCommentId: null,
    author: {
        id: "u-longname",
        username: "nguyen.thi.minh.hoang.yen.nhi",
        displayName: "Nguyễn Thị Minh Hoàng Yến Nhi Đặng Gia Bảo Trân",
        avatar: null,
    },
    replyCount: 0,
    reactions: { total: 1, myReaction: null },
    isFounderAuthor: false,
}

const replyAction = (
    <button
        type="button"
        onClick={() => {}}
        className="cursor-pointer text-xs font-medium text-muted transition-colors hover:text-foreground"
    >
        Trả lời
    </button>
)

/** Plain baseline: a non-founder comment with a couple of reactions, no actions slot. */
export const Default: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityCommentRow comment={defaultComment} onReact={() => {}} /></div>, ANATOMY),
}

export const Fresh: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><Controlled initialComment={freshComment} /></div>, ANATOMY),
}

export const Reacted: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityCommentRow comment={reactedComment} onReact={() => {}} /></div>, ANATOMY),
}

export const FounderAuthor: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityCommentRow comment={founderComment} onReact={() => {}} /></div>, ANATOMY),
}

export const LongBody: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityCommentRow comment={longComment} onReact={() => {}} /></div>, ANATOMY),
}

export const WithActions: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityCommentRow comment={reactedComment} onReact={() => {}} actions={replyAction} /></div>, ANATOMY),
}

export const ReadOnly: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityCommentRow comment={reactedComment} /></div>, ANATOMY),
}

/** Read-only viewer (no `onReact`) AND zero reactions — `ReactionBar` renders nothing at all. */
export const ReadOnlyNoReactions: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityCommentRow comment={freshComment} /></div>, ANATOMY),
}

/** Very long display name — `Typography truncate` clips it instead of wrapping/overflowing. */
export const LongAuthorName: Story = {
    render: () => blockShell(<div className="w-72"><CommunityCommentRow comment={longNameComment} onReact={() => {}} /></div>, ANATOMY),
}
