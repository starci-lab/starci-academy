import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentDiscussion } from "@sb-components/starci/blocks/learn/ContentDiscussion/ContentDiscussion"
import type { ContentCommentNode } from "@sb-components/starci/blocks/learn/ContentCommentThread/ContentCommentThread"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentDiscussion`: talk about this lesson — label + honest
 * archive line, an avatar-led collapsible composer, and the threaded comment
 * list. Sits FRAMELESS directly on the page canvas — no card — see the
 * component's own file header for the full rebuild against the earlier
 * flat-list, wrongly-carded cut.
 *
 * ⭐ EMPTY IS DRAWN, ON PURPOSE — the exact OPPOSITE of `ContentRelatedList`,
 * which hides itself when it has nothing. Here nobody having written yet is
 * an INVITATION.
 *
 * THE COMPOSER NEVER HIDES — not while loading, not when empty, not on
 * error. That is also why the error replaces the LIST only.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). The comment count, the archive line, and
 * `hasMore` are all data ⇒ states of `Full`. Losing the list to an empty
 * invitation, to an error, or to the loading mirror each change the shape ⇒
 * their own leaf.
 */
const meta: Meta<typeof ContentDiscussion> = {
    title: "StarCi/Blocks/Learn/ContentDiscussion/ContentDiscussion",
    component: ContentDiscussion,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentDiscussion>

const COMMENTS: Array<ContentCommentNode> = [
    {
        id: "c1",
        author: { id: "u1", username: "Minh Anh" },
        createdTimeAgo: "2 giờ trước",
        body: "Chỗ multi-stage em làm theo mà image vẫn 800MB, hoá ra quên COPY --from. Ai vướng giống em thì soi lại dòng cuối.",
        replyCount: 1,
        myReaction: null,
        reactionCounts: [{ type: "like", count: 4 }],
    },
    {
        id: "c2",
        author: { id: "u2", username: "Tuấn" },
        createdTimeAgo: "hôm qua",
        isFounderAuthor: true,
        body: "Cache bị vỡ mỗi lần sửa code là do COPY . . đứng trước npm ci. Đảo hai dòng là xong.",
        replyCount: 0,
        myReaction: "love",
        reactionCounts: [{ type: "love", count: 2 }],
    },
]

const REPLIES: Record<string, ReadonlyArray<ContentCommentNode>> = {
    c1: [
        {
            id: "r1",
            author: { id: "u2", username: "Tuấn" },
            createdTimeAgo: "1 giờ trước",
            body: "Đúng rồi, thiếu COPY --from là nguyên nhân phổ biến nhất.",
            replyCount: 0,
            myReaction: null,
        },
    ],
}

const NOOP_CALLBACKS = {
    onReply: () => {},
    onEdit: () => {},
    onDelete: () => {},
    onReactComment: () => {},
    onLoadReplies: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "several vertical frames — separating label/archive-line/composer from the list, stacking the comments, or pairing the label with its archive line", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "the label+count line, or the archive-line fact", storyId: "atoms-text-typography-typography--plain" },
    "ContentCommentComposer": { tier: "block", role: "the avatar-led, collapsible top-level composer", storyId: "starci-blocks-learn-contentcommentcomposer-contentcommentcomposer--collapsed-pill" },
    "ContentCommentThread": { tier: "block", role: "one threaded comment — author, reaction, actions, and its own recursive replies", storyId: "starci-blocks-learn-contentcommentthread-contentcommentthread--default" },
    "Button": { tier: "atom", role: "the \"load more comments\" action, only when a further page remains", storyId: "atoms-buttons-button-button--default" },
    "FeedbackEmpty": { tier: "composite", role: "the centred block carrying either the invitation to write first or the failed-to-load message", storyId: "composites-feedback-feedback-feedbackempty--title-only" },
}

/** LEAF — a lesson with a thread on it. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentDiscussion"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "comments.length = 2, one has a loaded reply",
                        why: "The label reads \"Thảo luận · 2\", and the archive line honestly counts 1/2 questions answered from what's currently loaded — not a fabricated aggregate. The composer leads as a collapsed pill; the thread follows.",
                        code: `<ContentDiscussion
    label="Thảo luận"
    currentUserId="viewer-1"
    currentUser={{ username: "Bạn" }}
    comments={comments}
    total={2}
    repliesByParent={repliesByParent}
    onSubmitComment={post}
    onReply={reply} onEdit={edit} onDelete={del} onReactComment={react} onLoadReplies={load}
/>`,
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                currentUserId="viewer-1"
                                currentUser={{ username: "Bạn" }}
                                comments={COMMENTS}
                                total={2}
                                repliesByParent={REPLIES}
                                onSubmitComment={() => {}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                    {
                        name: "hasMore = true, isLoadingMore = false",
                        why: "More top-level pages remain, so a \"Xem thêm bình luận\" action sits under the loaded comments — the same load-more shape `LeaderboardBoard`'s own pager precedent uses elsewhere in this system.",
                        code: "<ContentDiscussion label=\"Thảo luận\" ... hasMore onLoadMore={loadMore} />",
                        render: (
                            <ContentDiscussion
                                label="Thảo luận"
                                currentUserId="viewer-1"
                                currentUser={{ username: "Bạn" }}
                                comments={COMMENTS}
                                total={5}
                                repliesByParent={REPLIES}
                                onSubmitComment={() => {}}
                                hasMore
                                onLoadMore={() => {}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — nobody has written yet ⇒ the list is replaced by an INVITATION. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentDiscussion"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "comments = [], total = 0",
                        why: "The thread is empty, so the block says the reader would be the first — no archive line either, since 0/0 would read as a broken fraction rather than an honest fact. Opposite call from ContentRelatedList, which hides itself when empty.",
                        code: "<ContentDiscussion label=\"Thảo luận\" comments={[]} total={0} repliesByParent={{}} onSubmitComment={post} ... />",
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                currentUserId={null}
                                comments={[]}
                                total={0}
                                repliesByParent={{}}
                                onSubmitComment={() => {}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the thread failed to load ⇒ the message replaces the LIST, never the composer. */
export const Error: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentDiscussion"
                tier="block"
                leaf="Error"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "errorMessage set",
                        why: "The comments could not be fetched, so the message takes their place and the composer stays exactly where it was — a failed read never removes the ability to write.",
                        code: "<ContentDiscussion label=\"Thảo luận\" comments={[]} total={0} errorMessage=\"Không tải được bình luận\" ... />",
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                currentUserId={null}
                                comments={[]}
                                total={0}
                                repliesByParent={{}}
                                onSubmitComment={() => {}}
                                errorMessage="Không tải được bình luận"
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; two placeholder threads mirror, the composer stays real. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentDiscussion"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Two placeholder threads mirror the shape of a short list while the first page fetches, and the composer above them stays fully real — it is known before any request finishes. Matches every sibling block's own isSkeleton contract in this design system.",
                        code: "<ContentDiscussion label=\"Thảo luận\" isSkeleton comments={[]} total={0} ... />",
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                currentUserId="viewer-1"
                                currentUser={{ username: "Bạn" }}
                                comments={[]}
                                total={0}
                                repliesByParent={{}}
                                onSubmitComment={() => {}}
                                isSkeleton
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
