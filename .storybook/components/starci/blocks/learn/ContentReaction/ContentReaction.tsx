import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ReactionButton, type ReactionType, type ReactionCount } from "@sb-components/starci/blocks/learn/ReactionButton/ReactionButton"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentReaction` — a BLOCK: say how the lesson landed. A `ReactionButton` on the
 * left, the quiet view count on the right, at the foot of the reading card.
 *
 * A Facebook-style six-emotion picker (the same control used for the content
 * reaction and every comment). The trigger+picker+summary control is extracted into
 * its own `ReactionButton` block, shared with `ContentDiscussion`'s comment rows.
 *
 * Counts are data, the wording is not: the caller hands `counts`/`viewCount`, the
 * block adds the thousands separator and the words.
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
                <Typography size="xs" color="muted" isSkeleton classNames={["w-1/4"]} />
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
            <StackH gap={3} align="center" justify="between" items={[() => row]} />
        </div>
    )
}

export { ContentReaction }
