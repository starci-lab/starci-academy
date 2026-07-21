import React from "react"
import { cn } from "@heroui/react"
import { WarningCircleIcon } from "@phosphor-icons/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/commerce/PhaseScarcityNote`. The `next-intl` `useTranslations`
 * dependency + the `PricingPhase` enum are INLINED locally (vi strings) so this stays
 * feature-independent. Synced to `src` later.
 *
 * NOTE (anatomy): this is essentially a single warning line (icon + text) — it does
 * NOT compose any `Primitives/*` primitive. Flagged as "should be Primitive" for the
 * orchestrator (see report). Ported here to keep the commerce set complete.
 */

/** The course's pricing phases (inlined from `@/modules/types/enums/pricing-phase`). */
export enum PricingPhase {
    Pioneer = "pioneer",
    EarlyBird = "early_bird",
    Regular = "regular",
}

/** Localised phase display name (inlined from `courseLanding.phase.*`, vi). */
const PHASE_LABEL: Record<PricingPhase, string> = {
    [PricingPhase.Pioneer]: "Tiên phong",
    [PricingPhase.EarlyBird]: "Sớm",
    [PricingPhase.Regular]: "Tiêu chuẩn",
}

/** Props for {@link PhaseScarcityNote}. */
export interface PhaseScarcityNoteProps {
    /** The course's current pricing phase (its label is shown). */
    currentPhase: PricingPhase
    /** Seats left at the current phase price; null = unlimited → renders nothing. */
    seatsRemaining: number | null
    /** VND price after this phase sells out; null = no price rise to show. */
    nextPhasePriceVnd: number | null
    /** Extra classes on the root. */
    className?: string
}

/**
 * Honest pricing-phase scarcity line for a paywall: "Còn N suất giá {phase} · giá tăng
 * lên {X} sau đó". Sits as a SIBLING below `PriceTag` (PriceTag owns the discount;
 * scarcity is orthogonal urgency). Renders ONLY when the current phase has a real seat
 * cap (`seatsRemaining != null`) — an unlimited phase has no honest "rises-when" trigger
 * so nothing shows. EVERY number comes from the backend `coursePricePreview` — this
 * NEVER fabricates a countdown or a seat figure (fake scarcity is a banned dark pattern).
 *
 * @param props - {@link PhaseScarcityNoteProps}
 */
export const PhaseScarcityNote = ({
    currentPhase,
    seatsRemaining,
    nextPhasePriceVnd,
    className,
}: PhaseScarcityNoteProps) => {
    // no seat cap on this phase → no honest scarcity trigger → render nothing
    if (seatsRemaining == null) {
        return null
    }

    const phaseLabel = PHASE_LABEL[currentPhase]

    return (
        <div className={cn("flex flex-wrap items-center gap-2 text-warning-soft-foreground", className)}>
            <WarningCircleIcon aria-hidden focusable="false" className="size-4 shrink-0" />
            <span className="text-sm font-medium">
                {`Còn ${seatsRemaining} suất giá ${phaseLabel}`}
            </span>
            {nextPhasePriceVnd != null ? (
                <>
                    <span aria-hidden className="text-sm">·</span>
                    <span className="text-sm">
                        {`giá tăng lên ${nextPhasePriceVnd.toLocaleString("vi-VN")}₫ sau đó`}
                    </span>
                </>
            ) : null}
        </div>
    )
}
