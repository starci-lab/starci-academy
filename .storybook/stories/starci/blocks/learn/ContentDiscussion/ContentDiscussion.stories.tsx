import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentDiscussion } from "@sb-components/starci/blocks/learn/ContentDiscussion/ContentDiscussion"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentDiscussion`: talk about this lesson. A composer at the top,
 * the comments under it, on their own surface below the reading card.
 *
 * ⭐ EMPTY IS DRAWN, ON PURPOSE — the exact OPPOSITE of `ContentRelatedList`,
 * which hides itself when it has nothing. Here nobody having written yet is an
 * INVITATION: the reader is the first, and saying so is what makes them likely
 * to write. Hiding the section would hide the invitation with it.
 *
 * Same state name in two sibling blocks, opposite behaviour. Read both before
 * touching either.
 *
 * THE COMPOSER NEVER HIDES — not while loading, not when empty, not on error. A
 * reader who wants to write should never wait for a list first. That is also why
 * the error replaces the LIST only.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). The comment count is data ⇒ a state. Losing the
 * list to an empty invitation or to an error, and the caller flipping
 * `isSkeleton`, each change the shape ⇒ their own leaf.
 */
const meta: Meta<typeof ContentDiscussion> = {
    title: "StarCi/Blocks/Learn/ContentDiscussion/ContentDiscussion",
    component: ContentDiscussion,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentDiscussion>

const COMMENTS = [
    { key: "c1", authorName: "Minh Anh", timeAgo: "2 giờ trước", body: "Chỗ multi-stage em làm theo mà image vẫn 800MB, hoá ra quên COPY --from. Ai vướng giống em thì soi lại dòng cuối." },
    { key: "c2", authorName: "Tuấn", timeAgo: "hôm qua", body: "Cache bị vỡ mỗi lần sửa code là do COPY . . đứng trước npm ci. Đảo hai dòng là xong." },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the surface the whole conversation sits on, owning the label row and the padding around composer and comments", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "a vertical frame — separating composer from comments, stacking the comments, or pairing an author line with its body", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal frame — pushing the post button to the end of its row, or setting an avatar beside its comment", storyId: "frames-stack-stackh--default" },
    "InputTextarea": { tier: "atom", role: "the composer field, owning its own box, its focus ring and its row height", storyId: "atoms-forms-input-inputtextarea--default" },
    "Button": { tier: "atom", role: "the post control, owning its disabled and busy skins; the block only decides when a draft counts as postable", storyId: "atoms-buttons-button-button--default" },
    "Avatar": { tier: "atom", role: "the commenter's face, falling back to initials when there is no picture, or its own mirror while the thread loads", storyId: "atoms-display-avatar-avatar--default" },
    "Typography": { tier: "atom", role: "one of a comment's two lines — the muted author-and-time line, or the comment body", storyId: "atoms-text-typography-typography--plain" },
    "FeedbackEmpty": { tier: "composite", role: "the centred block that carries either the invitation to write first or the message saying the thread could not be loaded", storyId: "composites-feedback-feedback-feedbackempty--title-only" },
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
                        name: "comments.length = 2, draft empty",
                        why: "Two comments sit under a composer whose post button is off because there is nothing to post yet. The composer leads rather than follows the thread, so a reader who came to ask something does not have to scroll past other people first.",
                        code: `<ContentDiscussion
    label="Thảo luận"
    comments={comments}
    draft=""
    onDraftChange={setDraft}
    onSubmit={post}
/>`,
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                comments={COMMENTS}
                                draft=""
                                onDraftChange={() => {}}
                                onSubmit={() => {}}
                            />
                        ),
                    },
                    {
                        name: "draft set, isPending = true",
                        why: "The reader has typed and pressed post, so the button carries the busy affordance while the server answers and the thread below stays exactly where it was. Nothing is optimistically inserted, because a comment that appears and then vanishes reads worse than one that takes a moment.",
                        code: `<ContentDiscussion
    label="Thảo luận"
    comments={comments}
    draft="Chỗ cache em vẫn chưa rõ…"
    isPending
    onDraftChange={setDraft}
    onSubmit={post}
/>`,
                        render: (
                            <ContentDiscussion
                                label="Thảo luận"
                                comments={COMMENTS}
                                draft="Chỗ cache em vẫn chưa rõ…"
                                isPending
                                onDraftChange={() => {}}
                                onSubmit={() => {}}
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
                        name: "comments = []",
                        why: "The thread is empty, so the block says the reader would be the first and suggests what to write. This is the opposite call from `ContentRelatedList`, which hides itself when empty: silence there means the course has nothing more to offer, while silence here is an opening the reader can take.",
                        code: `<ContentDiscussion
    label="Thảo luận"
    comments={[]}
    draft=""
    onDraftChange={setDraft}
    onSubmit={post}
/>`,
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                comments={[]}
                                draft=""
                                onDraftChange={() => {}}
                                onSubmit={() => {}}
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
                        why: "The comments could not be fetched, so the message takes their place and the composer stays where it was. A failed read did not remove the ability to write, and blanking the whole section would take away a control that still works.",
                        code: `<ContentDiscussion
    label="Thảo luận"
    comments={[]}
    errorMessage="Không tải được bình luận"
    draft=""
    onDraftChange={setDraft}
    onSubmit={post}
/>`,
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                comments={[]}
                                errorMessage="Không tải được bình luận"
                                draft=""
                                onDraftChange={() => {}}
                                onSubmit={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the comment rows mirror, the composer stays real. */
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
                        why: "Two placeholder rows mirror the shape of a short thread while the first page loads, and the composer above them stays fully real. Shimmering the composer too would take away the one control that was ready before any request finished.",
                        code: `<ContentDiscussion
    label="Thảo luận"
    comments={[]}
    isSkeleton
    draft=""
    onDraftChange={setDraft}
    onSubmit={post}
/>`,
                        render: (
                            <ContentDiscussion
                                anatPart="ContentDiscussion"
                                showAnatomy
                                label="Thảo luận"
                                comments={[]}
                                isSkeleton
                                draft=""
                                onDraftChange={() => {}}
                                onSubmit={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
