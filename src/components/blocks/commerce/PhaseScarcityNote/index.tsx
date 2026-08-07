"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import { _PhaseScarcityNote } from "./component"

/** Phase → its i18n key. The ONE pricing-phase enum lives in `modules/types/enums`. */
const PHASE_LABEL_KEY: Record<PricingPhase, string> = {
    [PricingPhase.Pioneer]: "courseLanding.phase.pioneer",
    [PricingPhase.EarlyBird]: "courseLanding.phase.earlyBird",
    [PricingPhase.Regular]: "courseLanding.phase.regular",
}

/** Props the connected {@link PhaseScarcityNote} takes from its caller. */
export interface PhaseScarcityNoteConnectedProps {
    /** The course's current pricing phase — its label is shown. Absent only while resting. */
    currentPhase?: PricingPhase
    /** Seats left at this phase's price; `null` = unlimited → renders NOTHING. */
    seatsRemaining?: number | null
    /** VND price after this phase sells out; `null` = no rise to mention. */
    nextPhasePriceVnd?: number | null
    /** First load, nothing in hand → the line rests in place. */
    isSkeleton?: boolean
}

/**
 * Honest pricing-phase scarcity line — the CONNECTED half: resolves the phase name
 * and both interpolated sentences via `t()`. The presentational file used to bake
 * them in English ("N seats left at the Early Bird price"), and it was live on the
 * paywall, the trial strip, the premium gate and the module page.
 *
 * It also carried a SECOND `PricingPhase` enum whose `EarlyBird` value disagreed
 * with the real one (`early_bird` vs `earlyBird`) — the reason a phase-to-phase
 * bridge existed in `pages/_map.ts` at all. There is one enum now.
 *
 * @param props - {@link PhaseScarcityNoteConnectedProps}
 */
export const PhaseScarcityNote = ({
    currentPhase,
    seatsRemaining,
    nextPhasePriceVnd,
    isSkeleton = false,
}: PhaseScarcityNoteConnectedProps) => {
    const t = useTranslations()

    if (isSkeleton) {
        return <_PhaseScarcityNote isSkeleton />
    }
    if (seatsRemaining == null || currentPhase == null) {
        return (
            <_PhaseScarcityNote
                seatsRemaining={null}
                slotsLeftLabel={null}
                priceRisingLabel={null}
            />
        )
    }

    const phase = t(PHASE_LABEL_KEY[currentPhase])
    return (
        <_PhaseScarcityNote
            seatsRemaining={seatsRemaining}
            slotsLeftLabel={t("courseLanding.slotsLeftPhase", { count: seatsRemaining, phase })}
            priceRisingLabel={nextPhasePriceVnd != null
                ? t("course.paywall.priceRising", { nextPrice: `${nextPhasePriceVnd.toLocaleString("vi-VN")}₫` })
                : null}
        />
    )
}
