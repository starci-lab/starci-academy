import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { CommunityCommentRow, type QueryCommunityCommentNode } from "./CommunityCommentRow"
import { ReactionType } from "../ReactionBar/ReactionBar"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in its
 * OWN BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story. This block emits no anchors,
 * so `Sơ đồ` shows a clean render + a numbered legend.
 */
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

/** Plain canvas wrapping each leaf's BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Base composition — the plain comment row (avatar + header + body + reaction bar).
// DOM order: UserAvatar sits beside a content column whose header row stacks the
// author name + relative-time (two distinct Typography atoms), then the markdown
// body, then the footer row with the ReactionBar. Shared by every leaf that
// renders this exact shape. (Layout `div`s carry no component name → not parts.)
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả bình luận" },
    { name: "Typography", tier: "primitive", role: "tên tác giả (body-xs semibold, truncate)" },
    { name: "Typography", tier: "primitive", role: "thời gian tương đối (body-xs muted)" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bình luận (compact, [&_p]:m-0)" },
    { name: "ReactionBar", tier: "design", role: "thả cảm xúc cho bình luận" },
]

// Founder leaf: base + a founder badge (SealCheckIcon) between the author name
// and the relative-time, inside the header row.
const FOUNDER_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả bình luận" },
    { name: "Typography", tier: "primitive", role: "tên tác giả (body-xs semibold, truncate)" },
    { name: "SealCheckIcon", tier: "primitive", role: "huy hiệu founder cạnh tên", state: "founder" },
    { name: "Typography", tier: "primitive", role: "thời gian tương đối (body-xs muted)" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bình luận (compact, [&_p]:m-0)" },
    { name: "ReactionBar", tier: "design", role: "thả cảm xúc cho bình luận" },
]

// Actions leaf: base + the caller-supplied actions slot beside the reaction bar
// in the footer row.
const ACTIONS_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả bình luận" },
    { name: "Typography", tier: "primitive", role: "tên tác giả (body-xs semibold, truncate)" },
    { name: "Typography", tier: "primitive", role: "thời gian tương đối (body-xs muted)" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bình luận (compact, [&_p]:m-0)" },
    { name: "ReactionBar", tier: "design", role: "thả cảm xúc cho bình luận" },
    { name: "actions", tier: "primitive", role: "slot hành động do caller cấp (nút Trả lời)" },
]

// Read-only + zero reactions: ReactionBar returns null, so it drops out entirely.
const NO_REACTION_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar tác giả bình luận" },
    { name: "Typography", tier: "primitive", role: "tên tác giả (body-xs semibold, truncate)" },
    { name: "Typography", tier: "primitive", role: "thời gian tương đối (body-xs muted)" },
    { name: "MarkdownContent", tier: "primitive", role: "thân bình luận (compact, [&_p]:m-0)" },
]

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
    return <CommunityCommentRow comment={comment} onReact={handleReact} showAnatomy />
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
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Mặc định"
                parts={BASE_PARTS}
                reason="Một dòng bình luận cộng đồng gói header tác giả + thân markdown + reaction + slot actions vào một block, để CommentThread và các surface bình luận dùng chung một cách trình bày. Quyền react do caller quyết định qua onReact."
            >
                <div className="w-full max-w-xl"><CommunityCommentRow comment={defaultComment} onReact={() => {}} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}

export const Fresh: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Chưa có cảm xúc"
                parts={BASE_PARTS}
                note="onReact có mặt nên bar tương tác vẫn hiện (chỉ số 0 ẩn) — CÙNG composition với leaf mặc định."
            >
                <div className="w-full max-w-xl"><Controlled initialComment={freshComment} /></div>
            </BlockAnatomy>,
        ),
}

export const Reacted: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Đã thả cảm xúc"
                parts={BASE_PARTS}
                note="9 cảm xúc + myReaction Love → ReactionBar hiện số và emoji, composition không đổi."
            >
                <div className="w-full max-w-xl"><CommunityCommentRow comment={reactedComment} onReact={() => {}} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}

export const FounderAuthor: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Tác giả founder"
                parts={FOUNDER_PARTS}
                note="isFounderAuthor → thêm huy hiệu SealCheckIcon cạnh tên (part chỉ leaf này có)."
            >
                <div className="w-full max-w-xl"><CommunityCommentRow comment={founderComment} onReact={() => {}} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}

export const LongBody: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Thân dài"
                parts={BASE_PARTS}
                note="Thân markdown nhiều dòng → MarkdownContent giãn cao, composition không đổi."
            >
                <div className="w-full max-w-xl"><CommunityCommentRow comment={longComment} onReact={() => {}} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}

export const WithActions: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Có slot hành động"
                parts={ACTIONS_PARTS}
                note="Caller truyền actions → thêm slot 'Trả lời' cạnh ReactionBar (part chỉ leaf này có)."
            >
                <div className="w-full max-w-xl"><CommunityCommentRow comment={reactedComment} onReact={() => {}} actions={replyAction} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}

export const ReadOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Chỉ đọc"
                parts={BASE_PARTS}
                note="Không onReact + có cảm xúc → ReactionBar rơi về hiển thị số + emoji (không picker), vẫn cùng composition."
            >
                <div className="w-full max-w-xl"><CommunityCommentRow comment={reactedComment} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}

/** Read-only viewer (no `onReact`) AND zero reactions — `ReactionBar` renders nothing at all. */
export const ReadOnlyNoReactions: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Chỉ đọc, không cảm xúc"
                parts={NO_REACTION_PARTS}
                note="Không onReact VÀ 0 cảm xúc → ReactionBar render null, biến mất khỏi composition."
            >
                <div className="w-full max-w-xl"><CommunityCommentRow comment={freshComment} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}

/** Very long display name — `Typography truncate` clips it instead of wrapping/overflowing. */
export const LongAuthorName: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="CommunityCommentRow"
                tier="design"
                leaf="Tên tác giả dài"
                parts={BASE_PARTS}
                note="Tên rất dài → Typography truncate cắt bớt thay vì wrap/tràn, composition không đổi."
            >
                <div className="w-72"><CommunityCommentRow comment={longNameComment} onReact={() => {}} showAnatomy /></div>
            </BlockAnatomy>,
        ),
}
