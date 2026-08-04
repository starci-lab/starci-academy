"use client"

import React from "react"
import { useTranslations } from "next-intl"
import {
    _PriceTag,
    formatPrice,
    type PriceTagProps,
} from "./component"

export type { PriceCurrency, PriceTagSize, PriceBreakdown } from "./component"

/** Props the connected {@link PriceTag} takes from its caller. */
export type PriceTagConnectedProps = Omit<
    PriceTagProps,
    "breakdownTitleLabel" | "listPriceLabel" | "phaseRowLabel" | "loyaltyRowLabel" | "youPayLabel" | "savedLabel"
>

/**
 * The single source of truth for rendering a course/product price — the
 * CONNECTED half: resolves the breakdown-popover + saved-line labels via
 * `t()` and hands them to the presentational {@link _PriceTag}. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link PriceTagConnectedProps}
 */
export const PriceTag = ({
    discounted,
    original,
    currency = "VND",
    breakdown,
    showSavingLine = true,
    ...rest
}: PriceTagConnectedProps) => {
    const t = useTranslations()

    const hasSaving = original != null && original > discounted
    const showPhaseRow = breakdown != null && original != null && original > breakdown.phase
    const showLoyaltyRow = breakdown != null && breakdown.loyaltyPercent > 0 && breakdown.phase > discounted

    const phaseRowLabel = showPhaseRow
        ? (breakdown!.phaseLabel
            ? t("priceTag.phaseNamed", { phase: breakdown!.phaseLabel })
            : t("priceTag.phase"))
        : undefined

    const loyaltyRowLabel = showLoyaltyRow
        ? (breakdown!.loyaltyNote
            ? `${t("priceTag.loyalty")} · ${breakdown!.loyaltyNote}`
            : t("priceTag.loyalty"))
        : undefined

    const savedLabel = hasSaving
        ? t("priceTag.saved", { amount: formatPrice(original - discounted, currency) })
        : undefined

    return (
        <_PriceTag
            {...rest}
            discounted={discounted}
            original={original}
            currency={currency}
            breakdown={breakdown}
            showSavingLine={showSavingLine}
            breakdownTitleLabel={t("priceTag.breakdownTitle")}
            listPriceLabel={t("priceTag.listPrice")}
            phaseRowLabel={phaseRowLabel}
            loyaltyRowLabel={loyaltyRowLabel}
            youPayLabel={t("priceTag.youPay")}
            savedLabel={savedLabel}
        />
    )
}
