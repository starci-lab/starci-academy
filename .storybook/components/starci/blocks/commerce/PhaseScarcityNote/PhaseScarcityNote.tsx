import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"

/**
 * `PhaseScarcityNote` — the scarcity line for a pricing phase. Every number
 * comes from the backend's `coursePricePreview`; it never fabricates a
 * countdown or seat count, and a phase with no seat cap renders nothing.
 */

/** The course's pricing phases (inlined from `@/modules/types/enums/pricing-phase`). */
export enum PricingPhase {
    /** Opening phase with the fewest seats and the lowest price. */
    Pioneer = "pioneer",
    /** Mid phase after pioneer, still discounted before standard pricing. */
    EarlyBird = "early_bird",
    /** Full-price phase after early-bird seats are gone. */
    Regular = "regular",
}

/** Localised phase display name (inlined from `courseLanding.phase.*`, vi). */
const PHASE_LABEL: Record<PricingPhase, string> = {
    [PricingPhase.Pioneer]: "Pioneer",
    [PricingPhase.EarlyBird]: "Early Bird",
    [PricingPhase.Regular]: "Standard",
}

/**
 * Props for {@link PhaseScarcityNote}. `currentPhase`/`seatsRemaining`/
 * `nextPhasePriceVnd` are REQUIRED unless `isSkeleton` (§12b) — the price
 * preview hasn't arrived yet, so there is no honest phase/seat fact to state.
 */
export type PhaseScarcityNoteBaseProps =
    (
        | { isSkeleton: true; currentPhase?: PricingPhase; seatsRemaining?: number | null; nextPhasePriceVnd?: number | null }
        | {
            isSkeleton?: false
            /** The course's current pricing phase (shows its label). */
            currentPhase: PricingPhase
            /** Seats left at this phase's price; `null` = unlimited → renders NOTHING. */
            seatsRemaining: number | null
            /** VND price after this phase sells out; `null` = no rise to mention. */
            nextPhasePriceVnd: number | null
        }
    )

/**
 * Honest scarcity line for a paywall. Sits as a DIRECT SIBLING below `PriceTag`
 * (PriceTag handles discounting; scarcity is a different, orthogonal push axis).
 *
 * Only renders when the current phase has a **real seat cap**
 * (`seatsRemaining != null`) — an unlimited phase has no honest "rises when"
 * milestone to state, so it stays silent. EVERY number comes from the
 * backend's `coursePricePreview` — this file NEVER makes up a countdown or
 * seat count (fake scarcity is a banned dark pattern).
 *
 * @param props - {@link PhaseScarcityNoteBaseProps}
 */
const PhaseScarcityNoteBase = ({
    currentPhase,
    seatsRemaining,
    nextPhasePriceVnd,
    isSkeleton = false,
}: PhaseScarcityNoteBaseProps) => {
    if (isSkeleton) {
        return <HeroSkeleton className="h-4 w-64 max-w-full rounded" />
    }
    // no seat cap at this phase → no honest scarcity reason → stay silent
    if (seatsRemaining == null) {
        return null
    }

    return (
        // Color is set ON THE FRAME; text inside does NOT declare `color`, so it
        // inherits `currentColor` — the exact `warning-soft-foreground` tone.
        //
        // This row is ONE TRACK of N elements that wrap ⇒ exactly the definition
        // of `Cluster`, and repeated lists go through `items` DATA (children are
        // forbidden).
        //
        // What's gained isn't "fewer classes" but that `gap` is now PINNED to
        // the scale BY TYPE: hand-written it's `gap-2` today, `gap-1.5`
        // tomorrow, nothing stops that.
        <div className="text-warning-soft-foreground">
            <Cluster
                gap={3}
                principle="separator-dot"
                explain="Places a middle-dot separator between short meta peers so the items read as one inline list."
                align="center"
                // The `·` between the two clauses is drawn by the FRAME, not written as a text item.
                // A mark that separates a track's items belongs to the track, the same way a rule
                // does; written as content it also produced a `Separator` node in the structure tree
                // whose link went to the generic Typography story.
                separator
                items={[
                    () => (
                        // §5a: icon matches the FONT-SIZE of the text beside it — `sm`
                        // (14px) ⇒ `size-3.5`. §5.0a: below `size-5` ⇒ force
                        // `weight="bold"` to compensate for the thin strokes.
                        <WarningCircleIcon
                            aria-hidden
                            focusable="false"
                            weight="bold"
                            className="size-3.5 shrink-0"
                        />
                    ),
                    () => (
                        <Typography
                            size="sm"
                            weight="medium"
                            text={`${seatsRemaining} seats left at the ${currentPhase != null ? PHASE_LABEL[currentPhase] : ""} price`}

                        />
                    ),
                    // The next two pieces go TOGETHER (no rise means nothing to separate
                    // it from) — but they're still TWO SEPARATE cluster items, since the
                    // `·` mark must be allowed to wrap onto the line with the piece after
                    // it when the row runs tight.
                    ...(nextPhasePriceVnd != null
                        ? [
                            () => (
                                <Typography
                                    size="sm"
                                    text={`price rises to ${nextPhasePriceVnd.toLocaleString("vi-VN")}₫ after that`}

                                />
                            ),
                        ]
                        : []),
                ]}
            />
        </div>
    )
}

/** `PhaseScarcityNote.*` — single-component namespace ⇒ only `.Base`. */
export { PhaseScarcityNoteBase as PhaseScarcityNote }
