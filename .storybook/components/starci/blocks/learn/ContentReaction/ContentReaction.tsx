import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ReactionButton, type ReactionType, type ReactionCount } from "@sb-components/starci/blocks/learn/ReactionButton/ReactionButton"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentReaction` — say how the lesson landed: a six-emotion picker on the
 * left, the quiet view count on the right. Reacting is a button; the view count
 * is muted text. The caller hands over `counts` (one entry per emotion reacted);
 * the block owns the six fixed labels/emoji and does the sort/cap/total. Which
 * emotion is picked, empty summary, and the server wait are states; `isSkeleton`
 * is its own leaf.
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
}: ContentReactionProps) => {
    const row = (
        <>
            <ReactionButton
                myReaction={myReaction}
                counts={counts}
                onReact={onReact}
                isPending={isPending}
                isSkeleton={isSkeleton}


            />
            {isSkeleton ? (
                <Typography size="xs" color="muted" isSkeleton />
            ) : viewCount != null ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`${viewCount.toLocaleString("en-US")} views`}

                />
            ) : null}
        </>
    )

    return (
        <div>
            <StackH gap={3} principle="sibling-stack" align="center" justify="between" isSkeleton={isSkeleton} items={[() => row]} />
        </div>
    )
}

export { ContentReaction }
