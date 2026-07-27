import React from "react"
import { ChatsCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentDiscussion`: talk about this lesson. A composer at the top and
 * the comments under it, on their own surface below the reading card.
 *
 * WHY A BLOCK: it knows the conversation belongs to a LESSON. Whose comments,
 * what the invitation says, and what silence means are all domain decisions.
 *
 * ⭐ EMPTY IS DRAWN, ON PURPOSE — and this is the exact OPPOSITE of
 * `ContentRelatedList`, which hides itself when it has nothing. Here nobody
 * having written yet is an INVITATION: the reader is the first, and saying so is
 * the only thing that makes them likely to write. Hiding the section would hide
 * the invitation along with it. Same state name in two blocks, opposite
 * behaviour — read both before touching either.
 *
 * THE COMPOSER NEVER HIDES. It sits above the comments in every state, including
 * empty and error, because a reader who wants to write should never have to wait
 * for a list to load before they can start.
 *
 * ERROR KEEPS THE COMPOSER TOO. A failed fetch loses the comments, not the
 * ability to add one, so the error replaces the LIST and nothing else.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One comment — plain data, the block builds the row. */
export interface ContentComment {
    /** Stable React key. */
    key: string
    /** Display name of whoever wrote it. */
    authorName: string
    /** Avatar image; omitted → the avatar falls back to initials from the name. */
    authorAvatarUrl?: string
    /** Already-formatted relative time from the caller, e.g. "2 giờ trước". */
    timeAgo: string
    /** The comment text. */
    body: string
}

/** Props for {@link ContentDiscussion}. */
export interface ContentDiscussionProps {
    /** Section label, localized by the caller — e.g. "Thảo luận". */
    label: string
    /** The comments, newest first. EMPTY → the invitation is drawn instead. */
    comments: Array<ContentComment>
    /** Current composer text. */
    draft: string
    /** Fired as the reader types. */
    onDraftChange: (value: string) => void
    /** Fired when the reader posts. */
    onSubmit: () => void
    /** `true` → the post is in flight; the button owns the busy affordance. */
    isPending?: boolean
    /**
     * Set → the comment list could not be loaded. The message replaces the LIST
     * only: the composer stays, because a failed read did not remove the ability
     * to write.
     */
    errorMessage?: string
    /** `true` → the comment rows mirror themselves while the first page loads. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Lesson discussion. See the file header for the full contract.
 *
 * @param props - {@link ContentDiscussionProps}
 */
const ContentDiscussion = ({
    label,
    comments,
    draft,
    onDraftChange,
    onSubmit,
    isPending = false,
    errorMessage,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ContentDiscussionProps) => {
    const composer = (
        <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
            <InputTextarea
                value={draft}
                onValueChange={onDraftChange}
                placeholder="Bạn nghĩ gì về bài này?"
                ariaLabel="Viết bình luận"
                rows={3}
                showAnatomy={showAnatomy}
            />
            <StackH gap="related" justify="end" anatPart={showAnatomy ? "StackH" : undefined}>
                <Button
                    label="Gửi"
                    size="sm"
                    onPress={onSubmit}
                    isDisabled={draft.trim().length === 0}
                    isPending={isPending}
                    anatPart={showAnatomy ? "Button" : undefined}
                />
            </StackH>
        </StackV>
    )

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard label={label} anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    {composer}
                    {errorMessage != null ? (
                        <FeedbackEmpty
                            icon={WarningCircleIcon}
                            title={errorMessage}
                            anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                        />
                    ) : isSkeleton || comments.length > 0 ? (
                        <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                            {(isSkeleton ? SKELETON_ROWS : comments).map((comment) => (
                                <StackH key={comment.key} gap="related" anatPart={showAnatomy ? "StackH" : undefined}>
                                    <Avatar
                                        src={comment.authorAvatarUrl}
                                        name={comment.authorName}
                                        size="sm"
                                        isSkeleton={isSkeleton}
                                        showAnatomy={showAnatomy}
                                    />
                                    <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined}>
                                        <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={`${comment.authorName} · ${comment.timeAgo}`} anatPart={showAnatomy ? "Typography" : undefined} />
                                        <Typography size="sm" isSkeleton={isSkeleton} text={comment.body} anatPart={showAnatomy ? "Typography" : undefined} />
                                    </StackV>
                                </StackH>
                            ))}
                        </StackV>
                    ) : (
                        // Nobody has written yet. This is an INVITATION, so it is drawn —
                        // hiding the section would hide the invitation with it.
                        <FeedbackEmpty
                            icon={ChatsCircleIcon}
                            title="Chưa có bình luận nào"
                            description="Bạn là người đầu tiên — hỏi một câu, hoặc kể chỗ bạn thấy khó."
                            anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                        />
                    )}
                </StackV>
            </SurfaceCard>
        </div>
    )
}

/** Two placeholder rows so the mirror has the same shape as a short thread. */
const SKELETON_ROWS: Array<ContentComment> = [
    { key: "s1", authorName: "", timeAgo: "", body: "" },
    { key: "s2", authorName: "", timeAgo: "", body: "" },
]

export { ContentDiscussion }
