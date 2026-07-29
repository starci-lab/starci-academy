import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `WorkSessionHeader`: the band that says "you are inside a session".
 * A way out, what the session is, where you are in it, and a progress rail along
 * the bottom edge.
 *
 * WHY A BLOCK, AND A SHARED ONE: it knows what a SESSION is — that it has a
 * length, a position, steps that can be graded, and two different ways to leave.
 * Quiz, flashcard review and mock interview all run sessions, so this belongs to
 * none of them.
 *
 * ⭐ TWO WAYS TO LEAVE, AND THEY ARE NOT THE SAME. The back link means LEAVE,
 * keeping the run resumable. The finish button means END IT NOW and go to the
 * results. Collapsing them into one control would make one of the two silently
 * destructive.
 *
 * ⭐ DONE AND CURRENT ARE INDEPENDENT SIGNALS. A segment is filled because it was
 * GRADED; a segment is taller because it is the one being VIEWED. Letting "done"
 * win over "current" is exactly how "which step am I on" disappears the moment
 * the learner revisits a graded step. Current is a taller bar and nothing else —
 * no ring, no dot, no second colour.
 *
 * THE RAIL IS TAPPABLE, NOT JUST VISIBLE. A 4px bar is not a touch target, so
 * each segment sits inside a taller transparent hit zone. Without it the rail
 * looks interactive and refuses to respond.
 *
 * ⛔ NO `ReactNode` SLOT. The band takes typed data — a counter string, an
 * optional time-left string — never a node. A slot here is how a caller starts
 * putting its own shapes into a shared band, and two callers then drift.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props {@link WorkSessionHeader} carries regardless of loading state. */
interface WorkSessionHeaderOwnProps {
    /** Back-link label, localized by the caller — means LEAVE, run stays resumable. */
    backLabel: string
    /** Fired when the learner leaves without ending the run. */
    onBack: () => void
    /** What the session is, e.g. "Hỏi nhanh". */
    title?: string
    /** Optional time remaining, e.g. "2:14". Omitted → the session is untimed. */
    timeLeft?: string
    /** Steps already graded, 1-based. Rendered FILLED, independently of `current`. */
    doneSteps?: Array<number>
    /** Fired with a 1-based step when the learner taps the rail. Omitted → the rail is inert. */
    onStepPress?: (step: number) => void
    /** Finish-label, localized. Present with `onFinish` → the end-now control shows. */
    finishLabel?: string
    /** Fired when the learner ends the run and goes to the results. */
    onFinish?: () => void
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Props for {@link WorkSessionHeader}. `counter`/`total`/`current` are
 * REQUIRED unless `isSkeleton` (§12b) — the run's own length/position isn't
 * known before the session data arrives.
 */
export type WorkSessionHeaderProps = WorkSessionHeaderOwnProps &
    (
        | { isSkeleton: true; counter?: string; total?: number; current?: number }
        | {
            isSkeleton?: false
            /** Where the learner is, already worded by the caller, e.g. "Câu 3 / 10". */
            counter: string
            /** How many steps the session has. Drives the rail's segment count. */
            total: number
            /** Which step is being VIEWED, 1-based. Rendered as a TALLER segment. */
            current: number
        }
    )

/**
 * Session band with a progress rail. See the file header for the full contract.
 *
 * @param props - {@link WorkSessionHeaderProps}
 */
const WorkSessionHeader = ({
    backLabel,
    onBack,
    title,
    counter,
    timeLeft,
    total,
    current,
    doneSteps,
    onStepPress,
    finishLabel,
    onFinish,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: WorkSessionHeaderProps) => {
    if (isSkeleton) {
        return (
            <div data-anat-part={anatPart} className="border-b border-default bg-surface">
                <StackH gap="grouped" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                    <HeroSkeleton className="h-4 w-16 rounded" />
                    <HeroSkeleton className="h-4 w-24 rounded" />
                    <span className="flex-1" />
                </StackH>
                <div className="p-2">
                    <HeroSkeleton className="h-1 w-full rounded-full" />
                </div>
            </div>
        )
    }
    const done = new Set(doneSteps ?? [])

    return (
        <div data-anat-part={anatPart} className="border-b border-default bg-surface">
            <StackH gap="grouped" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                <LinkBack label={backLabel} onPress={onBack} anatPart={showAnatomy ? "LinkBack" : undefined} />
                {title != null ? (
                    <Typography size="sm" weight="bold" text={title} anatPart={showAnatomy ? "Typography" : undefined} />
                ) : null}
                <Typography size="sm" color="muted" text={counter} anatPart={showAnatomy ? "Typography" : undefined} />
                {timeLeft != null ? (
                    <Typography size="sm" weight="medium" text={timeLeft} tabularNums anatPart={showAnatomy ? "Typography" : undefined} />
                ) : null}
                <span className="flex-1" />
                {onFinish != null && finishLabel != null ? (
                    <Button label={finishLabel} variant="secondary" size="sm" onPress={onFinish} anatPart={showAnatomy ? "Button" : undefined} />
                ) : null}
            </StackH>
            {/* The rail. Segments are laid out by a frame so the seam stays on scale; each
                segment carries its own hit zone, because a 4px bar is not a touch target. */}
            <StackH gap="tight" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                {/* `total` is REQUIRED whenever `isSkeleton` is false (discriminated union
                    above) — already guaranteed by the early return at `isSkeleton`; the
                    `?? 0` only satisfies narrowing across the destructure, never actually fires. */}
                {Array.from({ length: total ?? 0 }, (_, index) => {
                    const step = index + 1
                    const isDone = done.has(step)
                    const isCurrent = step === current
                    const segment = (
                        <span
                            className={cn(
                                "block w-full rounded-full",
                                // TALLER means VIEWING; FILLED means GRADED. Two signals, and
                                // neither is allowed to overwrite the other.
                                isCurrent ? "h-1.5" : "h-1",
                                isDone ? "bg-success" : "bg-default",
                            )}
                        />
                    )
                    return onStepPress != null ? (
                        <button
                            key={step}
                            type="button"
                            aria-label={`${counter} — ${step}`}
                            className="flex-1 py-2"
                            onClick={() => onStepPress(step)}
                        >
                            {segment}
                        </button>
                    ) : (
                        <span key={step} className="flex-1 py-2">{segment}</span>
                    )
                })}
            </StackH>
        </div>
    )
}

export { WorkSessionHeader }
