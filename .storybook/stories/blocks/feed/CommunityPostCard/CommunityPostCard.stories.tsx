import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import {
    CommunityPostCard,
    CommunityChannel,
    type QueryCommunityFeedItemData,
} from "./CommunityPostCard"
import { ReactionType } from "../ReactionBar/ReactionBar"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof CommunityPostCard> = {
    title: "Block/Feed/CommunityPostCard",
    component: CommunityPostCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CommunityPostCard>

const ANATOMY = {
    primitives: [
        { name: "UserAvatar", role: "avatar tác giả trong header" },
        { name: "MarkdownContent", role: "thân bài markdown (compact)" },
        { name: "ReactionBar", role: "thả cảm xúc trong footer" },
    ],
    reason:
        "Một bài đăng cộng đồng gói header tác giả (avatar + tên + thời gian + kênh + huy hiệu) + thân markdown + footer reaction/bình luận vào một card. Feature chỉ truyền post + handler; block tự dựng khung Card và bố cục.",
}

const defaultPost: QueryCommunityFeedItemData = {
    id: "post-1",
    body: "Mọi người ơi, ai đã dùng thử useTransition của React 19 chưa, so với useDeferredValue thì nên chọn cái nào cho form tìm kiếm nhé.",
    channel: CommunityChannel.General,
    isPinned: false,
    editedAt: null,
    createdAt: "2026-07-20T02:30:00.000Z",
    author: { id: "author-1", username: "quochuy_backend", displayName: "Quốc Huy", avatar: "https://i.pravatar.cc/150?img=33" },
    commentCount: 4,
    reactions: { total: 12, myReaction: ReactionType.Like },
    isMine: false,
    isFounderAuthor: false,
}

const founderPinnedPost: QueryCommunityFeedItemData = {
    id: "post-2",
    body: "Câu hỏi hay, mình khuyên các bạn cứ đi theo lộ trình Fullstack trước rồi mới rẽ sang System Design, đừng học nhảy cóc.",
    channel: CommunityChannel.FounderQa,
    isPinned: true,
    editedAt: null,
    createdAt: "2026-07-19T08:00:00.000Z",
    author: { id: "author-2", username: "starci_founder", displayName: "Thầy StarCi", avatar: "https://i.pravatar.cc/150?img=5" },
    commentCount: 21,
    reactions: { total: 58, myReaction: ReactionType.Love },
    isMine: false,
    isFounderAuthor: true,
}

const freshPost: QueryCommunityFeedItemData = {
    id: "post-3",
    body: "Em vừa deploy xong dự án capstone đầu tiên, ai có kinh nghiệm review giúp em với ạ.",
    channel: CommunityChannel.General,
    isPinned: false,
    editedAt: null,
    createdAt: "2026-07-21T01:05:00.000Z",
    author: { id: "author-3", username: "thuha_ux", displayName: "Thu Hà", avatar: "https://i.pravatar.cc/150?img=45" },
    commentCount: 0,
    reactions: { total: 0, myReaction: null },
    isMine: false,
    isFounderAuthor: false,
}

const longBodyPost: QueryCommunityFeedItemData = {
    id: "post-4",
    body: "Em đang gặp lỗi CORS khi gọi API từ Next.js sang NestJS ở môi trường staging, dù local chạy bình thường. Em đã thêm origin vào whitelist trong main.ts rồi nhưng vẫn bị chặn ở preflight OPTIONS. Có phải do reverse proxy Nginx ở giữa chưa forward header Access-Control-Allow-Origin không, hay em cần cấu hình thêm ở phía gateway. Ai từng gặp case tương tự chỉ em cách debug với ạ, em cảm ơn nhiều.",
    channel: CommunityChannel.Problems,
    isPinned: false,
    editedAt: "2026-07-18T10:00:00.000Z",
    createdAt: "2026-07-18T09:15:00.000Z",
    author: { id: "author-4", username: "minhanh_dev", displayName: "Minh Anh", avatar: "https://i.pravatar.cc/150?img=12" },
    commentCount: 9,
    reactions: { total: 3, myReaction: null },
    isMine: false,
    isFounderAuthor: false,
}

const readOnlyPost: QueryCommunityFeedItemData = { ...defaultPost, id: "post-5" }

/** Wrapper holding reaction + comment-thread open state for the interactive story. */
const Controlled = () => {
    const [myReaction, setMyReaction] = useState<ReactionType | null>(null)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const post: QueryCommunityFeedItemData = {
        ...defaultPost,
        reactions: { total: defaultPost.reactions.total + (myReaction ? 1 : 0), myReaction },
    }
    return (
        <div className="w-full max-w-xl">
            <CommunityPostCard
                post={post}
                onReact={(_postId, type) => setMyReaction(type)}
                onToggleComments={() => setCommentsOpen((open) => !open)}
            >
                {commentsOpen ? (
                    <div className="rounded-2xl bg-default/40 p-3 text-sm text-muted">
                        Thread bình luận sẽ hiển thị ở đây khi được bấm mở.
                    </div>
                ) : null}
            </CommunityPostCard>
        </div>
    )
}

export const Default: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityPostCard post={defaultPost} onReact={() => {}} onToggleComments={() => {}} /></div>, ANATOMY),
}

export const FounderPinned: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityPostCard post={founderPinnedPost} onReact={() => {}} onToggleComments={() => {}} /></div>, ANATOMY),
}

export const Fresh: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityPostCard post={freshPost} onReact={() => {}} onToggleComments={() => {}} /></div>, ANATOMY),
}

export const LongBody: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityPostCard post={longBodyPost} onReact={() => {}} onToggleComments={() => {}} /></div>, ANATOMY),
}

export const ReadOnly: Story = {
    render: () => blockShell(<div className="w-full max-w-xl"><CommunityPostCard post={readOnlyPost} /></div>, ANATOMY),
}

export const Interactive: Story = {
    render: () => blockShell(<Controlled />, ANATOMY),
}
