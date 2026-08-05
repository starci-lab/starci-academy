import { useEffect, useRef } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentCommentThread, type ContentCommentThreadProps, type ContentCommentNode } from "@sb-components/starci/blocks/learn/ContentCommentThread/ContentCommentThread"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentCommentThread`: one threaded comment — author, reaction,
 * reply/edit/delete actions, and its recursively-rendered replies. Ported
 * verbatim from real `src`'s `CommentItem`. See the component's own file
 * header for the massive gap this fills against the earlier flat-list cut.
 *
 * [layout] LEAVES by STRUCTURE (§14d.2). Owner-only actions appearing, the body
 * swapping for an edit composer or a deleted placeholder, and the reply
 * subtree expanding each add/remove real nodes ⇒ separate leaves.
 */
const meta: Meta<typeof ContentCommentThread> = {
    title: "StarCi/Blocks/Learn/ContentCommentThread/ContentCommentThread",
    component: ContentCommentThread,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentCommentThread>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "IdentityContentRow": { tier: "composite", role: "avatar + byline + everything under it (body, actions, replies) — both its seams tight on purpose", storyId: "composites-lists-identitycontentrow-identitycontentrow--default" },
    "StackH": { tier: "frame", role: "the byline row (author name/badge/time), the action-row cluster, and the reply-composer row (connector beside the composer)", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the nested-replies track", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — author name, time, edited marker, body, or the view-replies link", storyId: "atoms-text-typography-typography--overview" },
    "ReactionButton": { tier: "block", role: "this comment's own reaction control — the exact same block ContentReaction uses for the lesson-level reaction", storyId: "starci-blocks-learn-reactionbutton-reactionbutton--full" },
    "ContentCommentComposer": { tier: "block", role: "the inline edit form, or the reply box beneath the action row", storyId: "starci-blocks-learn-contentcommentcomposer-contentcommentcomposer--reply-or-edit" },
    "ThreadConnector": { tier: "atom", role: "the Facebook-style curved guide linking this comment down into the reply composer's own avatar", storyId: "atoms-display-threadconnector-threadconnector--default" },
}

const AUTHOR = { id: "u1", username: "Anna Pham" }
const OWNER_ID = "viewer-1"

const BASE_COMMENT: ContentCommentNode = {
    id: "c1",
    author: AUTHOR,
    createdTimeAgo: "2 hours ago",
    body: "I followed the multi-stage steps but the image was still 800MB — turned out I forgot COPY --from.",
    replyCount: 0,
    myReaction: null,
    reactionCounts: [{ type: "like", count: 3 }],
}

const NOOP_CALLBACKS = {
    onReply: () => {},
    onEdit: () => {},
    onDelete: () => {},
    onReactComment: () => {},
    onLoadReplies: () => {},
}

/**
 * Some leaves demo an internal-only toggle (editing/expanded — mirrors
 * `src`'s own `CommentItem`, no controlled prop exists for them). This
 * wrapper presses a button matching `clickText` once mounted, the same way a
 * reader would, so the story lands directly on that state.
 */
const ClickPreview = ({ clickText, ...props }: ContentCommentThreadProps & { clickText: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const buttons = Array.from(containerRef.current?.querySelectorAll("button") ?? [])
        buttons.find((button) => button.textContent === clickText)?.click()
    }, [clickText])
    return (
        <div data-tier="fixture" ref={containerRef}>
            <ContentCommentThread {...props} />
        </div>
    )
}

/** LEAF — a non-owner viewing: reaction + reply only, no edit/delete. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentCommentThread"
                tier="block"
                leaf="Default (non-owner)"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "currentUserId !== comment.author.id",
                        why: "The viewer isn't this comment's author, so only the reaction control and the reply action render — edit/delete are the author's alone.",
                        code: "<ContentCommentThread comment={comment} currentUserId=\"viewer-1\" depth={0} repliesByParent={{}} onReply={reply} onEdit={edit} onDelete={del} onReactComment={react} onLoadReplies={load} />",
                        render: (
                            <ContentCommentThread


                                comment={BASE_COMMENT}
                                currentUserId="someone-else"
                                depth={0}
                                repliesByParent={{}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the author viewing their own comment ⇒ **gains** edit/delete. */
export const OwnerActions: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentCommentThread"
                tier="block"
                leaf="Owner actions"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "currentUserId === comment.author.id",
                        why: "The viewer IS this comment's author, so \"Edit\"/\"Delete\" join \"Reply\" in the action row — two real nodes the non-owner leaf never mounts at all.",
                        code: "<ContentCommentThread comment={comment} currentUserId=\"u1\" depth={0} repliesByParent={{}} onReply={reply} onEdit={edit} onDelete={del} onReactComment={react} onLoadReplies={load} />",
                        render: (
                            <ContentCommentThread


                                comment={BASE_COMMENT}
                                currentUserId={AUTHOR.id}
                                depth={0}
                                repliesByParent={{}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — editing: the body swaps for an inline composer seeded with the current text. */
export const Editing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentCommentThread"
                tier="block"
                leaf="Editing"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "pressed \"Edit\"",
                        why: "The plain body text is replaced by ContentCommentComposer, seeded with the current body and relabeled \"Save\" — the same composer real src reuses for new comments, replies, AND edits.",
                        code: "// reader pressed \"Edit\" — internal state, no controlled prop",
                        render: (
                            <ClickPreview


                                clickText="Edit"
                                comment={BASE_COMMENT}
                                currentUserId={AUTHOR.id}
                                depth={0}
                                repliesByParent={{}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — replying: `currentUser` gives the reply composer its own avatar, joined by `ThreadConnector`'s curved guide. */
export const Replying: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentCommentThread"
                tier="block"
                leaf="Replying"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "pressed \"Reply\", currentUser set",
                        why: "The reply composer mounts beside a curved `ThreadConnector` line down from this comment — a deliberate divergence from real `src` (`CommentComposer` never shows an avatar for a reply at all), added so a reply visually reads as branching off THIS comment rather than a bare form floating below it.",
                        code: "// reader pressed \"Reply\" — internal state, no controlled prop\n<ContentCommentThread comment={comment} currentUserId=\"someone-else\" currentUser={{ username: \"You\" }} depth={0} repliesByParent={{}} ... />",
                        render: (
                            <ClickPreview


                                clickText="Reply"
                                comment={BASE_COMMENT}
                                currentUserId="someone-else"
                                currentUser={{ username: "You" }}
                                depth={0}
                                repliesByParent={{}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — deleted: a quiet placeholder replaces the body, and no actions render at all. */
export const Deleted: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentCommentThread"
                tier="block"
                leaf="Deleted"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "comment.isDeleted = true",
                        why: "The body becomes a muted italic placeholder and the whole action row disappears — a removed comment can't be reacted to, replied to, edited, or deleted again.",
                        code: "<ContentCommentThread comment={{ ...comment, isDeleted: true }} currentUserId=\"viewer-1\" depth={0} repliesByParent={{}} onReply={reply} onEdit={edit} onDelete={del} onReactComment={react} onLoadReplies={load} />",
                        render: (
                            <ContentCommentThread


                                comment={{ ...BASE_COMMENT, isDeleted: true }}
                                currentUserId={OWNER_ID}
                                depth={0}
                                repliesByParent={{}}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — replies expanded: the recursive subtree renders, indented with a guide border. */
export const ExpandedWithReplies: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentCommentThread"
                tier="block"
                leaf="Expanded with replies"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "pressed \"View 1 reply\" — reply already loaded",
                        why: "A reply is just another ContentCommentThread one depth deeper, indented with a left guide border — recursion, not a separate component. Founder badge and \"(edited)\" both show on the reply to prove they aren't top-level-only.",
                        code: "// reader pressed the view-replies link — internal state, no controlled prop",
                        render: (
                            <ClickPreview


                                clickText="View 1 reply"
                                comment={{ ...BASE_COMMENT, replyCount: 1 }}
                                currentUserId="someone-else"
                                depth={0}
                                repliesByParent={{
                                    c1: [
                                        {
                                            id: "r1",
                                            author: { id: "u2", username: "Ethan Vu" },
                                            createdTimeAgo: "40 minutes ago",
                                            isFounderAuthor: true,
                                            isEdited: true,
                                            body: "That's right, missing COPY --from is the most common cause.",
                                            replyCount: 0,
                                            myReaction: null,
                                        },
                                    ],
                                }}
                                {...NOOP_CALLBACKS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
