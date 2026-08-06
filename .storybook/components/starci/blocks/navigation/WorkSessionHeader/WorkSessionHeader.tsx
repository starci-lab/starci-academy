import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { principleAttr } from "@sb-components/frames/_principles"

/**
 * `WorkSessionHeader` — the band that signals "you are inside a session",
 * shared across quiz, flashcard review, and mock interview. Knows what a
 * session is: a length, a position, steps that can be graded, and two distinct
 * exits — a back link that leaves and keeps the run resumable, and a finish
 * button that ends it and goes to results. "Done" (graded, filled) and
 * "current" (viewing, a taller bar) are independent signals. Takes typed data
 * (counter string, optional time-left string), no `ReactNode` slot. Leaf by
 * structure: losing the finish control or the rail's interactivity changes the
 * shape; position and which steps are graded are states.
 */

/** Props {@link WorkSessionHeader} carries regardless of loading state. */
interface WorkSessionHeaderOwnProps {
    /** Back-link label, localized by the caller — means LEAVE, run stays resumable. */
    backLabel: string
    /** Fired when the learner leaves without ending the run. */
    onBack: () => void
    /** What the session is, e.g. "Quick quiz". */
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
            /** Where the learner is, already worded by the caller, e.g. "Question 3 / 10". */
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
}: WorkSessionHeaderProps) => {
    if (isSkeleton) {
        const skeletonRow = (
            <>
                <HeroSkeleton className="h-4 w-16 rounded" />
                <HeroSkeleton className="h-4 w-24 rounded" />
                <span className="flex-1" />
            </>
        )
        return (
            <div className="border-b border-default bg-surface">
                <StackH gap={4} principle="content-row" align="center" isSkeleton={isSkeleton} items={[() => skeletonRow]} />
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                {/* `cell-pad` is the closest registered padding token to this wrapper's
                    `p-2` — the frame's `padding={3}` keeps the exact 8px inset. */}
                <StackV gap={1} principle="cell-pad" padding={3} isSkeleton={isSkeleton} items={[() => <HeroSkeleton className="h-1 w-full rounded-full" />]} />
                explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
            </div>
        )
    }
    const done = new Set(doneSteps ?? [])

    const headerRow = (
        <>
            <LinkBack label={backLabel} onPress={onBack} />
            {title != null ? (
                <Typography size="sm" weight="bold" text={title} />
            ) : null}
            <Typography size="sm" color="muted" text={counter} />
            {timeLeft != null ? (
                <Typography size="sm" weight="medium" text={timeLeft} tabularNums />
            ) : null}
            <span className="flex-1" />
            {onFinish != null && finishLabel != null ? (
                // "END IT NOW" (line 20) is an
                // action that ends the session mid-way — uses `danger-soft`.
                <Button label={finishLabel} variant="danger-soft" size="sm" onPress={onFinish} />
            ) : null}
        </>
    )

    // `total` is REQUIRED whenever `isSkeleton` is false (discriminated union
    // above) — already guaranteed by the early return at `isSkeleton`; the
    // `?? 0` only satisfies narrowing across the destructure, never actually fires.
    const railSegments = Array.from({ length: total ?? 0 }, (_, index) => {
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
        // `py-2` enlarges the tap target around the thin 4px bar; `control-pad` is the
        // closest registered token (its own `py-2`) — this leaf carries no matching `px`
        // since the segment already fills `flex-1` width.
        return onStepPress != null ? (
            <button
                key={step}
                type="button"
                aria-label={`${counter} — ${step}`}
                className="flex-1 py-2" data-principle={principleAttr("control-pad")}
                onClick={() => onStepPress(step)}
            >
                {segment}
            </button>
        ) : (
            <span key={step} className="flex-1 py-2" data-principle={principleAttr("control-pad")}>{segment}</span>
        )
    })

    return (
        <div className="border-b border-default bg-surface">
            <StackH gap={4} principle="content-row" align="center" isSkeleton={isSkeleton} items={[() => headerRow]} />
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            {/* The rail. Segments are laid out by a frame so the seam stays on scale; each
                segment carries its own hit zone, because a 4px bar is not a touch target. */}
            <StackH gap={2} principle="chip-row" align="center" isSkeleton={isSkeleton} items={[() => railSegments]} />
            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
        </div>
    )
}

export { WorkSessionHeader }
