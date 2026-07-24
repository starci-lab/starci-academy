import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { CommentThread, type CommentThreadNode } from "./CommentThread"
import { ReactionType } from "../ReactionBar/ReactionBar"
import type { CommunityPostAuthor } from "../CommunityCommentRow/CommunityCommentRow"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — a nested discussion thread: a root Composer for a top-level comment, a
 * recursive tree of CommunityCommentRow nodes, and an inline reply Composer under
 * each node. It owns only the transient draft/reveal state; posting is delegated.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof CommentThread> = {
    title: "Block/Feed/CommentThread",
    component: CommentThread,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CommentThread>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// Composer's real DOM: leading UserAvatar (when avatarSrc set) + a TextField wrapping
// the auto-growing TextArea + a trailing Send Button. The paper-plane icon (swapped
// for a Spinner while submitting) is manually-composed children of Button, not a
// prop Button renders — same call as ChatPanel's copy of this composition — so
// Button stays ONE opaque node, no icon child. attachSlot is not supplied here → not
// rendered → omitted. Shared by the root composer AND every inline reply composer.
const COMPOSER_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "ảnh đại diện người xem ở đầu hàng (khi có avatarSrc)" },
    {
        name: "TextField",
        tier: "primitive",
        role: "ô nhập (variant secondary) bọc vùng soạn",
        children: [
            { name: "TextArea", tier: "primitive", role: "vùng gõ tự giãn theo nội dung" },
        ],
    },
    { name: "Button", tier: "primitive", role: "nút Gửi (size sm, primary); disabled khi trống hoặc đang gửi" },
]

// One CommunityCommentRow node's real DOM: avatar + author-name/time Typography it
// renders directly + markdown body + a cluster of ReactionBar and the hand-rolled
// "Trả lời" toggle (passed in via the row's `actions` slot). The founder
// SealCheckIcon badge between the two Typography stays untagged — a bare
// decorative phosphor icon, not a named component — mirroring CommunityCommentRow's
// own story (see its BASE_PARTS).
const COMMENT_ROW: AnatomyNode = {
    name: "CommunityCommentRow",
    tier: "block",
    role: "một node bình luận: avatar + tác giả/thời gian + nội dung + reaction + slot actions",
    children: [
        { name: "UserAvatar", tier: "primitive", role: "ảnh đại diện tác giả" },
        { name: "Typography.Name", tier: "primitive", role: "tên hiển thị tác giả (truncate)" },
        { name: "Typography.Time", tier: "primitive", role: "thời gian tương đối, muted" },
        { name: "MarkdownContent", tier: "primitive", role: "nội dung bình luận (markdown)" },
        { name: "ReactionBar", tier: "block", role: "cảm xúc + đếm; read-only khi không có onReact" },
        { name: "Reply", tier: "primitive", role: "nút mở/đóng ô trả lời inline (truyền qua slot actions)", state: "hand-rolled" },
    ],
}

// The recursive item wrapper: a node's row, then its inline reply Composer (a SIBLING
// of the row — revealed by "Trả lời", not nested inside it), then the recursively
// rendered reply subtree. depth 1..4 draws an indent guide rail; deeper renders flush.
const COMMENT_ITEM: AnatomyNode = {
    name: "CommentThreadItem",
    tier: "design",
    role: "đơn vị đệ quy: một node + ô trả lời inline + cây reply con; thụt lề theo depth qua rail (≤4 cấp)",
    children: [
        COMMENT_ROW,
        {
            name: "Composer",
            tier: "block",
            role: "ô trả lời inline (ẩn tới khi bấm Trả lời) — anh em cạnh row, không nằm trong row",
            state: "reply",
            children: COMPOSER_PARTS,
        },
        {
            name: "CommentThreadItem",
            tier: "design",
            role: "cây reply con — đệ quy CommentThreadItem, thụt lề sâu hơn một cấp",
            state: "đệ quy",
        },
    ],
}

// content leaf: root Composer (parentId = null) + the recursive CommentThreadItem tree.
const DATA_PARTS: Array<AnatomyNode> = [
    {
        name: "Composer",
        tier: "block",
        role: "ô soạn bình luận gốc (parentId = null)",
        children: COMPOSER_PARTS,
    },
    COMMENT_ITEM,
]

// empty leaf: no comments → the thread is absent, only the root Composer renders.
const EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "Composer",
        tier: "block",
        role: "ô soạn bình luận gốc — phần duy nhất render khi chưa có bình luận",
        children: COMPOSER_PARTS,
    },
]

const authors: Record<string, CommunityPostAuthor> = {
    lan: { id: "u-lan", username: "lan.pham", displayName: "Lena Pham", avatar: null },
    quang: { id: "u-quang", username: "quang.founder", displayName: "Quinn Nguyen", avatar: null },
    minh: { id: "u-minh", username: "minh.tran", displayName: "Michael Tran", avatar: null },
    hoa: { id: "u-hoa", username: "hoa.le", displayName: "Hannah Le", avatar: null },
}

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

const baseComments: Array<CommentThreadNode> = [
    makeNode({
        id: "c1",
        author: authors.lan,
        body: "I still can't tell when to use a covering index versus a regular index.",
        createdAt: "2026-07-14T08:30:00.000Z",
        reactions: { total: 4, myReaction: ReactionType.Like },
        replies: [
            makeNode({
                id: "c1-r1",
                author: authors.quang,
                parentCommentId: "c1",
                isFounderAuthor: true,
                body: "A covering index already holds every column the query needs, so it never has to go back and read the base table. Use it when the query is hot and stable.",
                createdAt: "2026-07-14T08:45:00.000Z",
                reactions: { total: 9, myReaction: null },
                replies: [
                    makeNode({
                        id: "c1-r1-r1",
                        author: authors.lan,
                        parentCommentId: "c1-r1",
                        body: "So the trade-off is that the index grows larger, right?",
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
        body: "One thing to add: measure with real data before adding an index, don't add one on a hunch.",
        createdAt: "2026-07-14T09:20:00.000Z",
        reactions: { total: 6, myReaction: null },
    }),
]

/** Insert a reply node under the correct parent in the tree (recursively). */
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

/** Wrapper owning the comment tree — the controlled add-comment flow. */
const Controlled = ({ initialComments }: { initialComments: Array<CommentThreadNode> }) => {
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
        <div className="w-full max-w-xl">
            <CommentThread
                comments={comments}
                onReply={addReply}
                onReact={() => {}}
                avatarSrc="https://i.pravatar.cc/80?img=32"
                showAnatomy
            />
        </div>
    )
}

/** DATA — a populated thread: root composer + nested comment tree with inline replies. */
export const Nested: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CommentThread"
                tier="block"
                leaf="Nested"
                parts={DATA_PARTS}
                reason="Một luồng thảo luận lồng nhau: mỗi node là CommunityCommentRow, mỗi node có nút Trả lời mở Composer inline, reply thụt lề theo guide rail có giới hạn độ sâu, và một Composer gốc thêm bình luận cấp cao nhất. Gói toàn bộ đệ quy + state draft/reveal vào một block."
            >
                <Controlled initialComments={baseComments} />
            </BlockAnatomy>,
        ),
}

/** EMPTY — no comments yet → the thread is absent, only the root Composer renders. */
export const Empty: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CommentThread"
                tier="block"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="Chưa có bình luận → cây node biến mất, chỉ còn Composer gốc để mở luồng (khác leaf 'Có dữ liệu')."
            >
                <Controlled initialComments={[]} />
            </BlockAnatomy>,
        ),
}
