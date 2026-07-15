import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ChatsCircleIcon } from "@phosphor-icons/react"
import { CommentThread, type CommentThreadNode } from "./index"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { CommunityPostAuthor } from "@/modules/api/graphql/queries/types/community-feed"

const meta: Meta<typeof CommentThread> = {
    title: "Block/Feed/CommentThread",
    component: CommentThread,
}
export default meta
type Story = StoryObj<typeof CommentThread>

/** Vài tác giả mẫu, cố định để story không phụ thuộc dữ liệu thật. */
const authors: Record<string, CommunityPostAuthor> = {
    lan: { id: "u-lan", username: "lan.pham", displayName: "Lan Phạm", avatar: null },
    quang: { id: "u-quang", username: "quang.founder", displayName: "Quang Nguyễn", avatar: null },
    minh: { id: "u-minh", username: "minh.tran", displayName: "Minh Trần", avatar: null },
    hoa: { id: "u-hoa", username: "hoa.le", displayName: "Hoà Lê", avatar: null },
}

/** Dựng nhanh một node bình luận với giá trị mặc định hợp lý và mốc thời gian cố định. */
const makeNode = (
    node: Partial<CommentThreadNode> & Pick<CommentThreadNode, "id" | "body" | "author">,
): CommentThreadNode => ({
    isDeleted: false,
    editedAt: null,
    createdAt: "2026-07-14T09:00:00.000Z",
    parentCommentId: null,
    replyCount: node.replies?.length ?? 0,
    reactions: { total: 0, myReaction: null },
    isFounderAuthor: false,
    ...node,
})

/** Một luồng có sẵn với hai cấp trả lời lồng nhau. */
const baseComments: Array<CommentThreadNode> = [
    makeNode({
        id: "c1",
        author: authors.lan,
        body: "Em vẫn chưa phân biệt được khi nào dùng chỉ mục phủ và khi nào chỉ mục thường ạ.",
        createdAt: "2026-07-14T08:30:00.000Z",
        reactions: { total: 4, myReaction: ReactionType.Like },
        replies: [
            makeNode({
                id: "c1-r1",
                author: authors.quang,
                parentCommentId: "c1",
                isFounderAuthor: true,
                body: "Chỉ mục phủ chứa sẵn mọi cột câu truy vấn cần, nên không phải quay lại đọc bảng gốc. Dùng khi câu truy vấn nóng và cố định.",
                createdAt: "2026-07-14T08:45:00.000Z",
                reactions: { total: 9, myReaction: null },
                replies: [
                    makeNode({
                        id: "c1-r1-r1",
                        author: authors.lan,
                        parentCommentId: "c1-r1",
                        body: "Vậy đánh đổi là chỉ mục phình to hơn phải không thầy?",
                        createdAt: "2026-07-14T09:05:00.000Z",
                        reactions: { total: 1, myReaction: null },
                    }),
                ],
            }),
        ],
    }),
    makeNode({
        id: "c2",
        author: authors.minh,
        body: "Mình bổ sung: nhớ đo bằng dữ liệu thật trước khi thêm chỉ mục, đừng thêm theo cảm tính.",
        createdAt: "2026-07-14T09:20:00.000Z",
        reactions: { total: 6, myReaction: null },
    }),
]

/** Chèn một node trả lời vào đúng cha trong cây (đệ quy), phục vụ demo thêm bình luận sống. */
const insertReply = (
    nodes: Array<CommentThreadNode>,
    parentId: string,
    reply: CommentThreadNode,
): Array<CommentThreadNode> => nodes.map((node) => {
    if (node.id === parentId) {
        const replies = [...(node.replies ?? []), reply]
        return { ...node, replies, replyCount: replies.length }
    }
    if (node.replies) {
        return { ...node, replies: insertReply(node.replies, parentId, reply) }
    }
    return node
})

/**
 * Wrapper sở hữu cây bình luận, mô phỏng đúng luồng: gửi bình luận gốc thì thêm node cấp cao
 * nhất, trả lời thì chèn vào đúng cha; react thì cập nhật tổng và cảm xúc của viewer.
 */
const Controlled = ({
    initialComments,
}: {
    initialComments: Array<CommentThreadNode>
}) => {
    const [comments, setComments] = useState(initialComments)

    const addReply = (parentId: string | null, text: string) => {
        const reply = makeNode({
            id: `c-${Date.now()}`,
            author: authors.hoa,
            parentCommentId: parentId,
            body: text,
            createdAt: "2026-07-14T10:00:00.000Z",
        })
        setComments((previous) =>
            parentId === null ? [...previous, reply] : insertReply(previous, parentId, reply),
        )
    }

    return (
        <CommentThread
            comments={comments}
            onReply={addReply}
            onReact={() => {}}
            avatarSrc="https://i.pravatar.cc/80?img=32"
        />
    )
}

/** Dùng cho một luồng thảo luận đã có nội dung với hai cấp trả lời lồng nhau và thanh cảm xúc mỗi dòng. */
export const Thread: Story = {
    parameters: { usage: "Dùng cho luồng bình luận lồng nhau: mỗi node là một CommunityCommentRow, trả lời thụt vào một cấp sau thanh dẫn (có chặn độ sâu), mỗi node có nút Trả lời mở Composer nội tuyến, và một Composer gốc để thêm bình luận cấp cao nhất." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Luồng hai cấp</Label>
                <Typography type="body-sm" color="muted">
                    Một câu hỏi gốc, câu trả lời của founder, và một phản hồi lồng thêm một cấp; bấm Trả lời ở bất kỳ dòng nào để mở ô soạn nội tuyến.
                </Typography>
            </div>
            <Controlled initialComments={baseComments} />
        </div>
    ),
}

/** Dùng khi chưa có bình luận nào: chỉ còn Composer gốc để mời viết bình luận đầu tiên. */
export const Empty: Story = {
    parameters: { usage: "Dùng khi luồng chưa có bình luận: danh sách rỗng nên chỉ còn Composer gốc ở trên cùng, mời viết bình luận đầu tiên." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chưa có bình luận</Label>
                <Typography type="body-sm" color="muted">
                    <span className="inline-flex items-center gap-1">
                        <ChatsCircleIcon aria-hidden focusable="false" className="size-4" />
                        Không có node nào nên chỉ hiển thị Composer gốc; gửi một bình luận sẽ tạo node cấp cao nhất đầu tiên.
                    </span>
                </Typography>
            </div>
            <Controlled initialComments={[]} />
        </div>
    ),
}
