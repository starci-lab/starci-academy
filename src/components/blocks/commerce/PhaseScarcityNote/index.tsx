"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import { _PhaseScarcityNote, type PhaseScarcityNoteProps } from "./component"

/** i18n key for each pricing phase's display name (inlined so this block stays feature-independent). */
const PHASE_LABEL_KEY: Record<PricingPhase, string> = {
    [PricingPhase.Pioneer]: "courseLanding.phase.pioneer",
    [PricingPhase.EarlyBird]: "courseLanding.phase.earlyBird",
    [PricingPhase.Regular]: "courseLanding.phase.regular",
}

/** Props the connected {@link PhaseScarcityNote} takes from its caller. */
export type PhaseScarcityNoteConnectedProps = Omit<PhaseScarcityNoteProps, "slotsLeftLabel" | "priceRisingLabel"> & {
    /** The course's current pricing phase (its label is shown). */
    currentPhase: PricingPhase
    /** VND price after this phase sells out; `null` = no price rise to show. */
    nextPhasePriceVnd: number | null
}

/**
 * Honest pricing-phase scarcity line — the CONNECTED half: resolves the phase
 * name + interpolated copy via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link PhaseScarcityNoteConnectedProps}
 */
export const PhaseScarcityNote = ({
    currentPhase,
    nextPhasePriceVnd,
    seatsRemaining,
    className,
}: PhaseScarcityNoteConnectedProps) => {
    const t = useTranslations()

    if (seatsRemaining == null) {
        return <_PhaseScarcityNote seatsRemaining={null} slotsLeftLabel={null} priceRisingLabel={null} className={className} />
    }

    const phaseLabel = t(PHASE_LABEL_KEY[currentPhase])
    const slotsLeftLabel = t("courseLanding.slotsLeftPhase", { count: seatsRemaining, phase: phaseLabel })
    const priceRisingLabel = nextPhasePriceVnd != null
        ? t("course.paywall.priceRising", { nextPrice: `${nextPhasePriceVnd.toLocaleString("vi-VN")}₫` })
        : null

    return (
        <_PhaseScarcityNote
            seatsRemaining={seatsRemaining}
            slotsLeftLabel={slotsLeftLabel}
            priceRisingLabel={priceRisingLabel}
            className={className}
        />
    )
}
