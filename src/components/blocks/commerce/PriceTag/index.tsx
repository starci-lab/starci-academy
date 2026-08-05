"use client"

import React from "react"
import { useTranslations } from "next-intl"
import {
    _PriceTagInline,
    _PriceTagProminent,
    formatPrice,
    type PriceTagProps,
} from "./component"

export type { PriceCurrency, PriceBreakdown } from "./component"

/** Props the connected members take — every breakdown label is resolved here. */
export type PriceTagConnectedProps = Omit<PriceTagProps, "labels">

/**
 * The single source of truth for rendering a course/product price — the CONNECTED
 * half. It resolves the breakdown popover's five labels via `t()` and hands them to
 * the presentational members, which is the whole reason this half exists: the
 * presentational file used to bake "Price breakdown" / "List price" / "You pay" in
 * English, and it was live on the payment modal, the paywall, the premium gate and
 * the search palette.
 *
 * Two members, split by WHY the price is there, not by size (§14d.1):
 * `.Prominent` is the focal point of a purchase CTA, `.Inline` is one line of info
 * inside a card. See the presentational file's header for the full table.
 */
const useLabels = (breakdown: PriceTagProps["breakdown"]) => {
    const t = useTranslations()
    return {
        breakdownTitle: t("priceTag.breakdownTitle"),
        listPrice: t("priceTag.listPrice"),
        phaseRow: breakdown?.phaseLabel
            ? t("priceTag.phaseNamed", { phase: breakdown.phaseLabel })
            : t("priceTag.phase"),
        loyaltyRow: breakdown?.loyaltyNote
            ? `${t("priceTag.loyalty")} · ${breakdown.loyaltyNote}`
            : t("priceTag.loyalty"),
        youPay: t("priceTag.youPay"),
    }
}

/** The focal price of a purchase CTA. */
export const PriceTagProminent = (props: PriceTagConnectedProps) => (
    <_PriceTagProminent {...props} labels={useLabels(props.breakdown)} />
)

/** One line of price inside a card. */
export const PriceTagInline = (props: PriceTagConnectedProps) => (
    <_PriceTagInline {...props} labels={useLabels(props.breakdown)} />
)

/** The unqualified name keeps meaning the focal one. */
export const PriceTag = PriceTagProminent

export { formatPrice }
