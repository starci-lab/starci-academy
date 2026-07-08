"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** i18n key for each pricing phase's display name (inlined so this block stays feature-independent). */
const PHASE_LABEL_KEY: Record<PricingPhase, string> = {
    [PricingPhase.Pioneer]: "courseLanding.phase.pioneer",
    [PricingPhase.EarlyBird]: "courseLanding.phase.earlyBird",
    [PricingPhase.Regular]: "courseLanding.phase.regular",
}

/** Props for {@link PhaseScarcityNote}. */
export interface PhaseScarcityNoteProps extends WithClassNames<undefined> {
    /** The course's current pricing phase (its label is shown). */
    currentPhase: PricingPhase
    /** Seats left at the current phase price; null = unlimited → renders nothing. */
    seatsRemaining: number | null
    /** VND price after this phase sells out; null = no price rise to show. */
    nextPhasePriceVnd: number | null
}

/**
 * Honest pricing-phase scarcity line for a paywall: "Còn N suất giá {phase} · giá tăng
 * lên {X} sau đó". Sits as a SIBLING below `PriceTag` (PriceTag owns the discount;
 * scarcity is orthogonal urgency). Renders ONLY when the current phase has a real seat
 * cap (`seatsRemaining != null`) — an unlimited phase has no honest "rises-when" trigger
 * so nothing shows. EVERY number comes from the backend `coursePricePreview` (seat cap −
 * paid enrollments; the next tier's real price) — this NEVER fabricates a countdown or
 * a seat figure (see `CTA.md` — fake scarcity is a banned dark pattern).
 *
 * @param props - {@link PhaseScarcityNoteProps}
 */
export const PhaseScarcityNote = ({
    currentPhase,
    seatsRemaining,
    nextPhasePriceVnd,
    className,
}: PhaseScarcityNoteProps) => {
    const t = useTranslations()

    // no seat cap on this phase → no honest scarcity trigger → render nothing
    if (seatsRemaining == null) {
        return null
    }

    const phaseLabel = t(PHASE_LABEL_KEY[currentPhase])

    return (
        <div className={cn("flex flex-wrap items-center gap-2 text-warning", className)}>
            <WarningCircleIcon aria-hidden focusable="false" className="size-4 shrink-0" />
            <span className="text-sm font-medium">
                {t("courseLanding.slotsLeftPhase", {
                    count: seatsRemaining,
                    phase: phaseLabel,
                })}
            </span>
            {nextPhasePriceVnd != null ? (
                <>
                    <span aria-hidden className="text-sm">·</span>
                    <span className="text-sm">
                        {t("course.paywall.priceRising", {
                            nextPrice: `${nextPhasePriceVnd.toLocaleString("vi-VN")}₫`,
                        })}
                    </span>
                </>
            ) : null}
        </div>
    )
}
