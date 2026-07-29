import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentCommentComposer } from "@sb-components/starci/blocks/learn/ContentCommentComposer/ContentCommentComposer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentCommentComposer`: the textarea + submit control for new
 * comments, replies, and edits — ONE component, three call shapes, ported
 * verbatim from real `src`'s `CommentComposer`. See the component's own file
 * header for why `variant="primary"` (real `Discussion` is frameless — no
 * card ever wraps this field) and why the avatar-led row is top-level only.
 *
 * 📐 LEAVES by STRUCTURE (§14d.2). Collapsed-pill vs expanded-field is a real
 * node swap ⇒ separate leaves. Avatar present/absent is also a node swap
 * (top-level vs reply/edit) ⇒ its own leaf.
 */
const meta: Meta<typeof ContentCommentComposer> = {
    title: "StarCi/Blocks/Learn/ContentCommentComposer/ContentCommentComposer",
    component: ContentCommentComposer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentCommentComposer>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the avatar-led row (collapsed pill, or avatar beside the expanded field), and the submit/cancel button row", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the field-plus-actions column beside the avatar", storyId: "frames-stack-stackv--default" },
    "Avatar": { tier: "atom", role: "the current viewer's avatar, leading the top-level composer only", storyId: "atoms-display-avatar-avatar--default" },
    "Button": { tier: "atom", role: "submit, or the quiet cancel action (reply/edit/collapsible only)", storyId: "atoms-buttons-button-button--default" },
    "InputButtonLike": { tier: "composite", role: "the collapsed pill — a field-look press target rather than a hand-rolled button, reused instead of rebuilt", storyId: "composites-buttons-inputbuttonlike--default" },
}

const VIEWER = { username: "Minh Anh" }

/** LEAF — collapsed pill (top-level, collapsible). */
export const CollapsedPill: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentCommentComposer"
                tier="block"
                leaf="Collapsed pill"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "collapsible = true, expanded = false (initial)",
                        why: "The top-level composer starts as a slim avatar + placeholder pill so it never dominates the discussion zone with an empty grey box. Clicking it expands to the full field.",
                        code: "<ContentCommentComposer collapsible currentUser={viewer} ariaLabel=\"Viết bình luận\" onSubmit={post} />",
                        render: (
                            <ContentCommentComposer
                                anatPart="ContentCommentComposer"
                                showAnatomy
                                collapsible
                                currentUser={VIEWER}
                                ariaLabel="Viết bình luận"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — expanded, avatar-led (the top-level composer once opened). */
export const ExpandedWithAvatar: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentCommentComposer"
                tier="block"
                leaf="Expanded, avatar-led"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "currentUser set, draft empty",
                        why: "The field, submit, and a cancel action (collapsible always offers one) sit beside the viewer's avatar. Submit stays disabled until the draft is non-empty.",
                        code: "<ContentCommentComposer collapsible currentUser={viewer} ariaLabel=\"Viết bình luận\" onSubmit={post} />",
                        render: (
                            <ContentCommentComposer
                                anatPart="ContentCommentComposer"
                                showAnatomy
                                collapsible
                                currentUser={VIEWER}
                                ariaLabel="Viết bình luận"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isPending = true",
                        why: "A post is in flight — submit shows its busy affordance and both actions disable, so a double click can't fire a second request.",
                        code: "<ContentCommentComposer collapsible currentUser={viewer} isPending ariaLabel=\"Viết bình luận\" onSubmit={post} />",
                        render: (
                            <ContentCommentComposer
                                collapsible
                                currentUser={VIEWER}
                                isPending
                                ariaLabel="Viết bình luận"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — reply/edit shape: no avatar, no collapse, always expanded. */
export const ReplyOrEdit: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentCommentComposer"
                tier="block"
                leaf="Reply / edit (no avatar)"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "reply: onCancel set, submitLabel = 'Trả lời'",
                        why: "A reply composer omits currentUser entirely (real src never passes it for this call) and always renders expanded — no pill to collapse back into. The cancel button appears because onCancel is set, not because of collapsible.",
                        code: "<ContentCommentComposer placeholder=\"Viết câu trả lời...\" submitLabel=\"Trả lời\" onCancel={close} ariaLabel=\"Viết câu trả lời\" onSubmit={reply} />",
                        render: (
                            <ContentCommentComposer
                                anatPart="ContentCommentComposer"
                                showAnatomy
                                placeholder="Viết câu trả lời..."
                                submitLabel="Trả lời"
                                onCancel={() => {}}
                                ariaLabel="Viết câu trả lời"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "edit: initialValue set, submitLabel = 'Lưu'",
                        why: "Editing seeds the field from the comment's current body and relabels submit — same shape as reply, just pre-filled.",
                        code: "<ContentCommentComposer initialValue={comment.body} submitLabel=\"Lưu\" onCancel={close} ariaLabel=\"Sửa bình luận\" onSubmit={save} />",
                        render: (
                            <ContentCommentComposer
                                initialValue="Chỗ multi-stage em làm theo mà image vẫn 800MB."
                                submitLabel="Lưu"
                                onCancel={() => {}}
                                ariaLabel="Sửa bình luận"
                                onSubmit={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
