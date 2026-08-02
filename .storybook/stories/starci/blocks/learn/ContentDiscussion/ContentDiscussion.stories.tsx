import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentDiscussion } from "@sb-components/starci/blocks/learn/ContentDiscussion/ContentDiscussion"
import type { ContentCommentNode } from "@sb-components/starci/blocks/learn/ContentCommentThread/ContentCommentThread"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContentDiscussion` — talk about this lesson: a label + archive line, an
 * avatar-led collapsible composer, and the threaded comment list, frameless on
 * the page canvas. The empty state is drawn on purpose — no comments yet is an
 * invitation. The composer never hides, and an error replaces the list only.
 * Comment count, archive line, and `hasMore` are states of `Full`; empty, error,
 * and the loading mirror are each their own leaf.
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
        createdTimeAgo: "2 hours ago",
        body: "I followed the multi-stage steps and the image is still 800MB — turns out I forgot COPY --from. If you're stuck on the same thing, check your last line.",
        replyCount: 1,
        myReaction: null,
        reactionCounts: [{ type: "like", count: 4 }],
    },
    {
        id: "c2",
        author: { id: "u2", username: "Tuan" },
        createdTimeAgo: "yesterday",
        isFounderAuthor: true,
        body: "The cache breaking on every code change is because COPY . . sits before npm ci. Swap the two lines and you're done.",
        replyCount: 0,
        myReaction: "love",
        reactionCounts: [{ type: "love", count: 2 }],
    },
]

const REPLIES: Record<string, ReadonlyArray<ContentCommentNode>> = {
    c1: [
        {
            id: "r1",
            author: { id: "u2", username: "Tuan" },
            createdTimeAgo: "1 hour ago",
            body: "Yep, missing COPY --from is the most common cause.",
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
    "Typography": { tier: "atom", role: "the label+count line, or the archive-line fact", storyId: "atoms-text-typography-typography--overview" },
    "ContentCommentComposer": { tier: "block", role: "the avatar-led, collapsible top-level composer", storyId: "starci-blocks-learn-contentcommentcomposer-contentcommentcomposer--collapsed-pill" },
    "ContentCommentThread": { tier: "block", role: "one threaded comment — author, reaction, actions, and its own recursive replies", storyId: "starci-blocks-learn-contentcommentthread-contentcommentthread--default" },
    "Button": { tier: "atom", role: "the \"load more comments\" action, only when a further page remains", storyId: "atoms-buttons-button-button--default" },
    "EmptyState": { tier: "composite", role: "the centred block carrying either the invitation to write first or the failed-to-load message", storyId: "composites-feedback-emptystate--title-only" },
}

/** LEAF — a lesson with a thread on it. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
                        why: "The label reads \"Discussion · 2\", and the archive line honestly counts 1/2 questions answered from what's currently loaded — not a fabricated aggregate. The composer leads as a collapsed pill; the thread follows.",
                        code: `<ContentDiscussion
    label="Discussion"
    currentUserId="viewer-1"
    currentUser={{ username: "You" }}
    comments={comments}
    total={2}
    repliesByParent={repliesByParent}
    onSubmitComment={post}
    onReply={reply} onEdit={edit} onDelete={del} onReactComment={react} onLoadReplies={load}
/>`,
                        render: (
                            <ContentDiscussion

                               
                                label="Discussion"
                                currentUserId="viewer-1"
                                currentUser={{ username: "You" }}
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
                        why: "More top-level pages remain, so a \"Show more comments\" action sits under the loaded comments — the same load-more shape `LeaderboardBoard`'s own pager precedent uses elsewhere in this system.",
                        code: "<ContentDiscussion label=\"Discussion\" ... hasMore onLoadMore={loadMore} />",
                        render: (
                            <ContentDiscussion
                                label="Discussion"
                                currentUserId="viewer-1"
                                currentUser={{ username: "You" }}
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
        <div data-tier="fixture" className="p-8">
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
                        code: "<ContentDiscussion label=\"Discussion\" comments={[]} total={0} repliesByParent={{}} onSubmitComment={post} ... />",
                        render: (
                            <ContentDiscussion

                               
                                label="Discussion"
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
        <div data-tier="fixture" className="p-8">
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
                        code: "<ContentDiscussion label=\"Discussion\" comments={[]} total={0} errorMessage=\"Couldn't load comments\" ... />",
                        render: (
                            <ContentDiscussion

                               
                                label="Discussion"
                                currentUserId={null}
                                comments={[]}
                                total={0}
                                repliesByParent={{}}
                                onSubmitComment={() => {}}
                                errorMessage="Couldn't load comments"
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
        <div data-tier="fixture" className="p-8">
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
                        code: "<ContentDiscussion label=\"Discussion\" isSkeleton comments={[]} total={0} ... />",
                        render: (
                            <ContentDiscussion

                               
                                label="Discussion"
                                currentUserId="viewer-1"
                                currentUser={{ username: "You" }}
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
