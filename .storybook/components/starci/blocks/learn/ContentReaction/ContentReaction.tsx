import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ReactionButton, type ReactionType, type ReactionCount } from "@sb-components/starci/blocks/learn/ReactionButton/ReactionButton"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentReaction`: say how the lesson landed. `ReactionButton` on
 * the left, the quiet view count on the right, at the foot of the reading card.
 *
 * ⭐⭐ REBUILT 2026-07-28 (teacher: "over-engineered it" — the first cut was a single
 * boolean like/unlike toggle; real `src` is a Facebook-style SIX-EMOTION picker,
 * the SAME control used for the content reaction and every comment). The
 * trigger+picker+summary control itself was later EXTRACTED into its own block,
 * `ReactionButton`, once `ContentDiscussion`'s comment rows needed the exact
 * same control — matching how real `src` already shares ONE `ReactionBar`
 * between `InteractionBar` (here) and `CommentItem`.
 *
 * COUNTS ARE DATA, THE WORDING IS NOT. The caller hands over `counts`/
 * `viewCount`; the block adds the thousands separator and the words.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type { ReactionType, ReactionCount as ContentReactionCount }

/** Props for {@link ContentReaction}. */
export interface ContentReactionProps {
    /** The viewer's own reaction, or `null`/omitted if they haven't reacted. */
    myReaction?: ReactionType | null
    /** Per-emotion counts. Empty/omitted → the summary is not drawn at all. */
    counts?: ReadonlyArray<ReactionCount>
    /** How many people opened this lesson. Omitted → the fact is not claimed. */
    viewCount?: number
    /** Fired with the picked emotion, or `null` to remove the current one. */
    onReact: (type: ReactionType | null) => void
    /**
     * `true` → the reaction is in flight. The trigger owns the busy affordance,
     * so the row keeps its shape while the server answers.
     */
    isPending?: boolean
    /**
     * `true` → both slots switch to their own shimmer. Without it the row would
     * render a truthful-looking "no reactions" for the length of the fetch and
     * then jump when the real summary lands.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Reaction footer for a lesson. See the file header for the full contract.
 *
 * @param props - {@link ContentReactionProps}
 */
const ContentReaction = ({
    myReaction = null,
    counts = [],
    viewCount,
    onReact,
    isPending = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ContentReactionProps) => {
    const row = (
        <>
            <ReactionButton
                myReaction={myReaction}
                counts={counts}
                onReact={onReact}
                isPending={isPending}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "ReactionButton" : undefined}
            />
            {isSkeleton ? (
                <Typography size="xs" color="muted" isSkeleton classNames={["w-1/4"]} showAnatomy={showAnatomy} />
            ) : viewCount != null ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`${viewCount.toLocaleString("en-US")} views`}
                    showAnatomy={showAnatomy}
                />
            ) : null}
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <StackH gap={3} align="center" justify="between" anatPart={showAnatomy ? "StackH" : undefined} body={row} />
        </div>
    )
}

export { ContentReaction }
