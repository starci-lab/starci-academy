import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CommunityCommentRow } from "./index"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import type { QueryCommunityCommentNode } from "@/modules/api/graphql/queries/types/community-comments"

const meta: Meta<typeof CommunityCommentRow> = {
    title: "Blocks/Feed/CommunityCommentRow",
    component: CommunityCommentRow,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CommunityCommentRow>

const baseComment: QueryCommunityCommentNode = {
    id: "comment-1",
    body: "Bài viết rất hữu ích, mình đã áp dụng thử pattern này trong dự án và thấy hiệu quả rõ rệt.",
    isDeleted: false,
    editedAt: null,
    createdAt: "2026-07-10T08:30:00.000Z",
    parentCommentId: null,
    author: {
        id: "user-1",
        username: "minhtran",
        displayName: "Minh Trần",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    replyCount: 2,
    reactions: {
        total: 8,
        myReaction: null,
    },
    isFounderAuthor: false,
}

/** Dùng để hiển thị một bình luận thông thường trong luồng thảo luận, kèm thanh cảm xúc tương tác được. */
export const Default: Story = {
    parameters: { usage: "Dùng để hiển thị một bình luận thông thường trong luồng thảo luận, kèm thanh cảm xúc tương tác được." },
    render: () => <CommunityCommentRow comment={baseComment} onReact={() => {}} />,
}

/** Dùng khi tác giả bình luận là nhà sáng lập, cần gắn huy hiệu xác minh bên cạnh tên hiển thị. */
export const FounderAuthor: Story = {
    parameters: { usage: "Dùng khi tác giả bình luận là nhà sáng lập, cần gắn huy hiệu xác minh bên cạnh tên hiển thị." },
    render: () => (
        <CommunityCommentRow
            comment={{
                ...baseComment,
                id: "comment-2",
                author: {
                    id: "user-2",
                    username: "starci_founder",
                    displayName: "StarCi Founder",
                    avatar: "https://i.pravatar.cc/150?img=5",
                },
                isFounderAuthor: true,
                reactions: { total: 24, myReaction: ReactionType.Love },
            }}
            onReact={() => {}}
        />
    ),
}

/** Dùng khi người xem đã đăng xuất, thanh cảm xúc chỉ hiển thị số liệu mà không cho phép bấm chọn. */
export const ReadOnly: Story = {
    parameters: { usage: "Dùng khi người xem đã đăng xuất, thanh cảm xúc chỉ hiển thị số liệu mà không cho phép bấm chọn." },
    render: () => <CommunityCommentRow comment={baseComment} />,
}

/** Dùng khi bình luận có các thao tác phụ như trả lời hoặc xem các phản hồi bên dưới. */
export const WithActions: Story = {
    parameters: { usage: "Dùng khi bình luận có các thao tác phụ như trả lời hoặc xem các phản hồi bên dưới." },
    render: () => (
        <CommunityCommentRow
            comment={baseComment}
            onReact={() => {}}
            actions={
                <Button size="sm" variant="ghost">
                    Trả lời · Xem 2 phản hồi
                </Button>
            }
        />
    ),
}

/** Dùng khi nội dung bình luận dài, cần kiểm tra khối markdown xuống dòng và co giãn đúng cách. */
export const LongBody: Story = {
    parameters: { usage: "Dùng khi nội dung bình luận dài, cần kiểm tra khối markdown xuống dòng và co giãn đúng cách." },
    render: () => (
        <div className="w-[420px]">
            <CommunityCommentRow
                comment={{
                    ...baseComment,
                    id: "comment-3",
                    body: "Mình nghĩ đây là một cách tiếp cận đáng cân nhắc, nhưng cần lưu ý thêm về khả năng mở rộng khi hệ thống có lượng truy cập lớn. Ngoài ra nên viết thêm test để đảm bảo hành vi không bị phá vỡ khi refactor sau này, đặc biệt là ở các đường biên dữ liệu.",
                }}
                onReact={() => {}}
            />
        </div>
    ),
}
