import React from "react"
import { EyeIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentReaction`: say how the lesson landed. A reaction control on
 * the left, the quiet view count on the right, at the foot of the reading card.
 *
 * WHY A BLOCK: it knows a LESSON has readers and reactions. The row itself is
 * two controls, but what they mean — "people reacted to this lesson", "this many
 * read it" — is domain, and the wording belongs here (§14d.1).
 *
 * TWO WEIGHTS, ON PURPOSE. Reacting is an ACTION the reader can take, so it is a
 * button. The view count is a FACT they can only observe, so it is muted text.
 * Giving both the same weight would ask the reader to pick between a control and
 * a number.
 *
 * COUNTS ARE DATA, THE WORDING IS NOT. The caller hands over
 * `reactionCount`/`viewCount` as numbers; the block adds the thousands separator
 * and the words. A caller that could pass `"1.2k lượt xem"` would decide the
 * grouping and the unit, and two callers would drift apart.
 *
 * ZERO IS NOT NEWS. With nobody having reacted yet the count is dropped and the
 * button reads as an invitation rather than as a score of nil.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ContentReaction}. */
export interface ContentReactionProps {
    /**
     * How many people reacted. `0` or omitted → the count is not shown, so the
     * control reads as an invitation instead of reporting a score of nil.
     */
    reactionCount?: number
    /** How many people opened this lesson. Omitted → the fact is not claimed. */
    viewCount?: number
    /** `true` → the reader has already reacted; the control shows it is on. */
    hasReacted?: boolean
    /** Fired when the reader reacts or takes their reaction back. */
    onReact: () => void
    /**
     * `true` → the reaction is in flight. The button owns the busy affordance,
     * so the row keeps its shape while the server answers.
     */
    isPending?: boolean
    /**
     * `true` → both slots switch to their own shimmer. Without it the row would
     * render a truthful-looking "0 reactions" for the length of the fetch and
     * then jump when the real number lands.
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
    reactionCount,
    viewCount,
    hasReacted = false,
    onReact,
    isPending = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ContentReactionProps) => {
    // The block joins the words from NUMBERS: unit, thousands grouping and the
    // decision to stay silent at zero all belong here, not at the call site.
    const reactionLabel = reactionCount
        ? `${reactionCount.toLocaleString("vi-VN")} lượt thích`
        : "Thích bài này"

    return (
        <div data-anat-part={anatPart}>
            <StackH gap="related" align="center" justify="between" anatPart={showAnatomy ? "StackH" : undefined}>
                <Button
                    label={reactionLabel}
                    variant={hasReacted ? "primary" : "secondary"}
                    size="sm"
                    onPress={onReact}
                    isPending={isPending}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "Button" : undefined}
                />
                {isSkeleton ? (
                    <Typography size="xs" color="muted" isSkeleton className="w-16" anatPart={showAnatomy ? "Typography" : undefined} />
                ) : viewCount != null ? (
                    <Typography
                        size="xs"
                        color="muted"
                        prefixIcon={EyeIcon}
                        text={`${viewCount.toLocaleString("vi-VN")} lượt xem`}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                ) : null}
            </StackH>
        </div>
    )
}

export { ContentReaction }
