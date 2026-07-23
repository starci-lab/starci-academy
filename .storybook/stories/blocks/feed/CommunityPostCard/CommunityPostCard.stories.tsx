import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import {
    CommunityPostCard,
    CommunityChannel,
    type QueryCommunityFeedItemData,
} from "./CommunityPostCard"
import { ReactionType } from "../ReactionBar/ReactionBar"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one community feed post: author header + markdown body + reaction/
 * comment footer, framed by a Card.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — the
 * founder badge and pinned pin are present/absent parts, so those variants get
 * their own PARTS. There is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof CommunityPostCard> = {
    title: "Design/Feed/CommunityPostCard",
    component: CommunityPostCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CommunityPostCard>

/** Plain canvas — each leaf wraps its render in its own BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Base composition every post leaf renders (author avatar + body + reaction bar).
const DEFAULT_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả trong header" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bài markdown (compact)" },
    { name: "ReactionBar", tier: "design", role: "thả cảm xúc trong footer" },
]

// founder leaf: base + huy hiệu SealCheck cạnh tên tác giả.
const FOUNDER_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả trong header" },
    { name: "SealCheckIcon", tier: "primitive", role: "huy hiệu founder cạnh tên", state: "founder" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bài markdown (compact)" },
    { name: "ReactionBar", tier: "design", role: "thả cảm xúc trong footer" },
]

// pinned leaf: base + ghim PushPin ở góc phải header.
const PINNED_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả trong header" },
    { name: "PushPinIcon", tier: "primitive", role: "ghim bài ở góc header", state: "pinned" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bài markdown (compact)" },
    { name: "ReactionBar", tier: "design", role: "thả cảm xúc trong footer" },
]

// founder + pinned leaf: base + cả huy hiệu SealCheck lẫn ghim PushPin.
const FOUNDER_PINNED_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả trong header" },
    { name: "SealCheckIcon", tier: "primitive", role: "huy hiệu founder cạnh tên", state: "founder" },
    { name: "PushPinIcon", tier: "primitive", role: "ghim bài ở góc header", state: "pinned" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bài markdown (compact)" },
    { name: "ReactionBar", tier: "design", role: "thả cảm xúc trong footer" },
]

// read-only leaf: base composition nhưng ReactionBar mất onReact → không tương tác.
const READONLY_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả trong header" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bài markdown (compact)" },
    { name: "ReactionBar", tier: "design", role: "hiển thị cảm xúc (chỉ đọc)", state: "read-only" },
]

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

const pinnedPost: QueryCommunityFeedItemData = {
    ...defaultPost,
    id: "post-6",
    isPinned: true,
    isFounderAuthor: false,
}

const founderAuthorPost: QueryCommunityFeedItemData = {
    ...defaultPost,
    id: "post-7",
    isPinned: false,
    isFounderAuthor: true,
    author: { id: "author-2", username: "starci_founder", displayName: "Thầy StarCi", avatar: "https://i.pravatar.cc/150?img=5" },
}

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
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Có dữ liệu"
                parts={DEFAULT_PARTS}
                reason="Một bài đăng cộng đồng gói header tác giả (avatar + tên + thời gian + kênh + huy hiệu) + thân markdown + footer reaction/bình luận vào một card. Feature chỉ truyền post + handler; block tự dựng khung Card và bố cục."
            >
                <div className="w-full max-w-xl"><CommunityPostCard post={defaultPost} onReact={() => {}} onToggleComments={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

export const FounderPinned: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Founder + ghim"
                parts={FOUNDER_PINNED_PARTS}
                note="Founder + đã ghim → hiện cả huy hiệu SealCheck lẫn ghim PushPin trên cùng base composition."
            >
                <div className="w-full max-w-xl"><CommunityPostCard post={founderPinnedPost} onReact={() => {}} onToggleComments={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

export const Pinned: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Đã ghim"
                parts={PINNED_PARTS}
                note="isPinned → thêm ghim PushPin ở góc header, phần còn lại như leaf 'Có dữ liệu'."
            >
                <div className="w-full max-w-xl"><CommunityPostCard post={pinnedPost} onReact={() => {}} onToggleComments={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

export const FounderAuthor: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Tác giả founder"
                parts={FOUNDER_PARTS}
                note="isFounderAuthor → thêm huy hiệu SealCheck cạnh tên, phần còn lại như leaf 'Có dữ liệu'."
            >
                <div className="w-full max-w-xl"><CommunityPostCard post={founderAuthorPost} onReact={() => {}} onToggleComments={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

export const Fresh: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Bài mới"
                parts={DEFAULT_PARTS}
                note="Bài mới đăng (0 reaction, 0 bình luận) — CÙNG composition với leaf 'Có dữ liệu', chỉ đổi dữ liệu đếm."
            >
                <div className="w-full max-w-xl"><CommunityPostCard post={freshPost} onReact={() => {}} onToggleComments={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

export const LongBody: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Thân bài dài"
                parts={DEFAULT_PARTS}
                note="Thân markdown dài + đã sửa — CÙNG composition, MarkdownContent tự giãn chiều cao."
            >
                <div className="w-full max-w-xl"><CommunityPostCard post={longBodyPost} onReact={() => {}} onToggleComments={() => {}} /></div>
            </BlockAnatomy>,
        ),
}

export const ReadOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Chỉ đọc"
                parts={READONLY_PARTS}
                note="Không truyền onReact/onToggleComments → ReactionBar chỉ đọc, đếm bình luận tĩnh."
            >
                <div className="w-full max-w-xl"><CommunityPostCard post={readOnlyPost} /></div>
            </BlockAnatomy>,
        ),
}

export const Interactive: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityPostCard"
                tier="design"
                leaf="Tương tác"
                parts={DEFAULT_PARTS}
                note="Có onReact + onToggleComments → bấm cảm xúc cập nhật state, mở thread bình luận qua children; base composition không đổi."
            >
                <Controlled />
            </BlockAnatomy>,
        ),
}
