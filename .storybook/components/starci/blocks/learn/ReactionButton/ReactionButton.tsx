import React, { useState } from "react"
import { Button as HeroButton, Popover as HeroPopover, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ReactionPicker } from "@sb-components/atoms/feedback/ReactionPicker/ReactionPicker"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ReactionButton`: the Facebook-style six-emotion reaction control —
 * a pill trigger (current pick's emoji + label, or a neutral invitation) that
 * opens a Popover with the six reactions in a row, plus a compact summary
 * (top-3 reacted emoji stacked + total) beside it.
 *
 * ⭐⭐ EXTRACTED 2026-07-28 while building `ContentDiscussion` — real `src`
 * uses the SAME `ReactionBar` for both the content-level reaction
 * (`InteractionBar`) and every individual comment (`CommentItem`). This block
 * was first built inline inside `ContentReaction` for the content case only;
 * pulling it out here is what real `src` already does, now that a second
 * caller (a comment row) needs the identical control.
 *
 * WHY RAW HEROUI POPOVER/BUTTON, NOT THE CONSTRAINED ATOM: `atoms/overlay/
 * Popover` fixes its own chrome (arrow, `w-64`, a `text-sm text-muted` content
 * wrapper) — this picker needs `rounded-full`/`overflow-visible`/`px-2 py-1`,
 * none of which that atom's fixed opinions allow. Real `src` reaches for raw
 * HeroUI for the exact same reason.
 *
 * THE SIX-BUTTON ROW ITSELF IS THE ATOM `ReactionPicker` (teacher 2026-07-28 —
 * "complex CSS only in atoms/frames"). This block only supplies data; the
 * animation/hover CSS lives there.
 *
 * COUNTS ARE DATA, THE VOCABULARY IS NOT. The caller hands over `counts`
 * (one entry per emotion actually reacted); the block owns the six fixed
 * labels/emoji (§14d.1, universal — not a per-lesson/per-comment fact).
 *
 * ZERO IS NOT NEWS. With nobody having reacted yet the summary is dropped
 * entirely (not "0"), so the trigger reads as an invitation.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
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
        return <span data-anat-part={anatPart} className="inline-block h-8 w-28 animate-pulse rounded-full bg-default" />
    }

    // compact summary: stacked top emojis + total — dropped entirely at zero
    const summaryRow = total > 0 ? (
        <StackH
            gap={3}
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <span className="flex items-center -space-x-1">
                        {topReactions.map((reaction) => (
                            <ReactionGlyph key={reaction.type} type={reaction.type} size="sm" />
                        ))}
                    </span>
                    <Typography size="sm" text={String(total)} showAnatomy={showAnatomy} />
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
                        data-anat-part={showAnatomy ? "Button" : undefined}
                    >
                        <ReactionGlyph type={myReaction ?? "like"} size="sm" />
                        <span className="text-sm">
                            {myReaction ? REACTION_BY_TYPE[myReaction].label : "React"}
                        </span>
                    </HeroButton>
                </HeroPopover.Trigger>
                {/* inset-exception: pill geometry of the vendor popover body, the shape HeroUI ships */}
                <HeroPopover.Content className="overflow-visible rounded-full px-2 py-1" data-anat-part={showAnatomy ? "Popover.Content" : undefined}>
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
        <StackH gap={3} align="center" anatPart={anatPart ?? (showAnatomy ? "StackH" : undefined)} body={triggerAndSummary} />
    )
}

export { ReactionButton }
