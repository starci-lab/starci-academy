import React, { useState } from "react"
import { Button as HeroButton, Popover as HeroPopover, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ReactionPicker } from "@sb-components/atoms/feedback/ReactionPicker/ReactionPicker"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ReactionButton` — the Facebook-style six-emotion reaction control: a pill
 * trigger (current pick's emoji + label, or a neutral invitation) that opens a
 * Popover with the six reactions in a row, plus a compact summary (top-3 reacted
 * emoji stacked + total) beside it. Shared by the content-level reaction and
 * individual comments. Uses raw HeroUI Popover/Button (the constrained atom's
 * fixed chrome can't do `rounded-full`/`overflow-visible`); the six-button row
 * itself is the `ReactionPicker` atom. Counts are data; the six labels/emoji are
 * block-owned. With no reactions yet the summary is dropped so the trigger reads
 * as an invitation.
 */

/** The six reactions, in the fixed display order real `src` uses. */
export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry"

/** One reaction kind's fixed vocabulary — the block's own table (§14d.1), never caller-supplied. */
interface ReactionDescriptor {
    type: ReactionType
    /** Native emoji glyph — `alt` text for the real SVG asset. */
    emoji: string
    /** Accessible + summary label, matches `src/messages/vi.json`'s `discussion.reactions.*`. */
    label: string
}

const REACTIONS: ReadonlyArray<ReactionDescriptor> = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "love", emoji: "❤️", label: "Love" },
    { type: "haha", emoji: "😂", label: "Haha" },
    { type: "wow", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Sad" },
    { type: "angry", emoji: "😡", label: "Angry" },
]

const REACTION_BY_TYPE: Record<ReactionType, ReactionDescriptor> = REACTIONS.reduce(
    (acc, descriptor) => { acc[descriptor.type] = descriptor; return acc },
    {} as Record<ReactionType, ReactionDescriptor>,
)

/** Props for the {@link ReactionGlyph} helper below. */
interface ReactionGlyphProps {
    type: ReactionType
    size: "xs" | "sm" | "md"
    className?: string
}

const REACTION_GLYPH_CLS: Record<ReactionGlyphProps["size"], string> = {
    xs: "size-4",
    sm: "size-5",
    md: "size-7",
}

/** Real Fluent Emoji SVG for a reaction (`public/reactions/<type>.svg` — same asset `src` serves). */
const ReactionGlyph = ({ type, size, className }: ReactionGlyphProps) => (
    <img
        src={`/reactions/${type}.svg`}
        alt={REACTION_BY_TYPE[type].label}
        aria-hidden
        draggable={false}
        className={cn("inline-block select-none", REACTION_GLYPH_CLS[size], className)}
    />
)

/** How many times each reaction was picked — one entry per emotion actually present. */
export interface ReactionCount {
    type: ReactionType
    count: number
}

/** Props for {@link ReactionButton}. */
export interface ReactionButtonProps {
    /** The viewer's own reaction, or `null`/omitted if they haven't reacted. */
    myReaction?: ReactionType | null
    /** Per-emotion counts. Empty/omitted → the summary is not drawn at all. */
    counts?: ReadonlyArray<ReactionCount>
    /** Fired with the picked emotion, or `null` to remove the current one. */
    onReact: (type: ReactionType | null) => void
    /** `true` → the reaction is in flight. The trigger owns the busy affordance. */
    isPending?: boolean
    /** `true` → the trigger + summary switch to their own shimmer. */
    isSkeleton?: boolean
}

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
            align="center"

            body={
                <>
                    <span className="flex items-center -space-x-1">
                        {topReactions.map((reaction) => (
                            <ReactionGlyph key={reaction.type} type={reaction.type} size="sm" />
                        ))}
                    </span>
                    <Typography size="sm" text={String(total)} />
                </>
            }
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
                {/* inset-exception: pill geometry of the vendor popover body, the shape HeroUI ships */}
                <HeroPopover.Content className="overflow-visible rounded-full px-2 py-1">
                    <ReactionPicker
                        items={REACTIONS.map((reaction) => ({ key: reaction.type, imgSrc: `/reactions/${reaction.type}.svg`, label: reaction.label }))}
                        activeKey={myReaction}
                        onSelect={(key) => handlePick(key as ReactionType)}
                    />
                </HeroPopover.Content>
            </HeroPopover>

            {summaryRow}
        </>
    )

    return (
        <StackH gap={3} align="center" body={triggerAndSummary} />
    )
}

export { ReactionButton }
