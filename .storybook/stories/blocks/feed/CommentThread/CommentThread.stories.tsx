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

// content leaf: root Composer + the recursive CommunityCommentRow tree (each node
// carries its reaction bar, a "Trả lời" affordance, and its own inline reply Composer).
const DATA_PARTS: Array<AnatomyNode> = [
    { name: "Composer", tier: "block", role: "ô soạn bình luận gốc (parentId = null)" },
    {
        name: "CommunityCommentRow",
        tier: "design",
        role: "mỗi node bình luận trong cây (đệ quy, thụt lề theo depth)",
        children: [
            { name: "UserAvatar", tier: "primitive", role: "ảnh đại diện tác giả" },
            { name: "MarkdownContent", tier: "primitive", role: "nội dung bình luận" },
            { name: "ReactionBar", tier: "block", role: "cảm xúc + đếm" },
            { name: "Trả lời", tier: "primitive", role: "affordance mở ô trả lời inline", state: "hand-rolled" },
            { name: "Composer", tier: "block", role: "ô trả lời inline (ẩn tới khi bấm Trả lời)", state: "reply" },
        ],
    },
]

// empty leaf: no comments → the thread is absent, only the root Composer renders.
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Composer", tier: "block", role: "ô soạn bình luận gốc — phần duy nhất render khi chưa có bình luận" },
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
                leaf="Có dữ liệu"
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
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Chưa có bình luận → cây node biến mất, chỉ còn Composer gốc để mở luồng (khác leaf 'Có dữ liệu')."
            >
                <Controlled initialComments={[]} />
            </BlockAnatomy>,
        ),
}
