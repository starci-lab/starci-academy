import React, { useState } from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { Button as HeroButton, Popover as HeroPopover } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ReactionPicker } from "@sb-components/atoms/feedback/ReactionPicker/ReactionPicker"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { ReactionGlyph } from "./ReactionGlyph"
import { REACTION_BY_TYPE, type ReactionButtonProps, type ReactionType } from "./types"

export type { ReactionType, ReactionCount, ReactionButtonProps } from "./types"

/**
 * BLOCK — `ReactionButton`: the Facebook-style six-emotion reaction control —
 * pill trigger + Popover picker + compact summary. Shared verbatim between
 * `ContentReaction` (the lesson-level reaction) and each comment row in
 * `ContentDiscussion`'s thread — the SAME control real `src`'s `ReactionBar`
 * is, reused between `InteractionBar` and `CommentItem`.
 *
 *  LEAF by STRUCTURE (§14d.2). Which emotion is picked and whether the
 * summary is empty keep the same two-part shape ⇒ states. The caller
 * flipping `isSkeleton` is its own leaf.
 */

/**
 * The reaction trigger + picker + summary. See the file header for the full contract.
 *
 * @param props - {@link ReactionButtonProps}
 */
const ReactionButton = ({
    myReaction = null,
    counts = [],
    onReact,
    isPending = false,
    isSkeleton = false,
}: ReactionButtonProps) => {
    // controlled so the popover closes as soon as an emotion is picked — mirrors real ReactionBar
    const [isOpen, setIsOpen] = useState(false)

    const total = counts.reduce((sum, entry) => sum + entry.count, 0)
    // busiest emotions first, top 3 — same cap real ReactionBar uses for the stacked summary
    const topReactions = counts
        .slice()
        .sort((prev, next) => next.count - prev.count)
        .slice(0, 3)
        .map((entry) => REACTION_BY_TYPE[entry.type])

    const handlePick = (type: ReactionType) => {
        setIsOpen(false)
        onReact(myReaction === type ? null : type)
    }

    if (isSkeleton) {
        return <span className="inline-block h-8 w-28 animate-pulse rounded-full bg-default" />
    }

    // compact summary: stacked top emojis + total — dropped entirely at zero
    const summaryRow = total > 0 ? (
        <StackH
            gap={3}
            principles={["value-row"]}
            align="center"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <span className="flex items-center -space-x-1">
                        {topReactions.map((reaction) => (
                            <ReactionGlyph key={reaction.type} type={reaction.type} size="sm" />
                        ))}
                    </span>
                ),
                ({ isSkeleton }: SkeletonProps) => <Typography isSkeleton={isSkeleton} size="sm" text={String(total)} />,
            ]}
        />
    ) : null

    const triggerAndSummary = (
        <>
            {/* trigger: opens the 6-emotion picker; shows the viewer's own pick once set */}
            <HeroPopover isOpen={isOpen} onOpenChange={setIsOpen}>
                <HeroPopover.Trigger>
                    <HeroButton
                        variant="tertiary"
                        isDisabled={isPending}
                        className="rounded-full"

                    >
                        <ReactionGlyph type={myReaction ?? "like"} size="sm" />
                        <span className="text-sm">
                            {myReaction ? REACTION_BY_TYPE[myReaction].label : "React"}
                        </span>
                    </HeroButton>
                </HeroPopover.Trigger>
                {/* TODO(atom): bold skin-shape (rounded-full + px-2 py-1 pill) — a frame cannot own it,
                    Wrap with a hand-set data-principles for now. `className` sits on `HeroPopover.Content`
                    itself (the vendor's OWN rendered surface, react-aria `Popover`), not a raw <div>
                    we author, so `Box` can't wrap it (moving the shape down onto an inner wrapping
                    Box would leave the real popover surface with its default non-pill radius showing
                    behind it — a visible shape regression). `data-principles` on `Content` directly is
                    type-safe (forwarded through `DOMAttributes`), so tagged in place instead. Needs a
                    dedicated pill-popover atom/composite to own this shape. Same declared shape
                    as `QaReactionBar.tsx`'s trigger.
                    inset-exception: pill geometry, the same px-2 py-1 HeroUI ships in chip.css. */}
                <HeroPopover.Content data-principles="pill-pad" className="overflow-visible rounded-full px-2 py-1">
                    <ReactionPicker
                        items={Object.values(REACTION_BY_TYPE).map((reaction) => ({ key: reaction.type, imgSrc: `/reactions/${reaction.type}.svg`, label: reaction.label }))}
                        activeKey={myReaction}
                        onSelect={(key) => handlePick(key as ReactionType)}
                    />
                </HeroPopover.Content>
            </HeroPopover>

            {summaryRow}
        </>
    )

    return (
        <StackH gap={3} principles={["flex-action"]} align="center" isSkeleton={isSkeleton} items={[() => triggerAndSummary]} />
    )
}

export { ReactionButton }
