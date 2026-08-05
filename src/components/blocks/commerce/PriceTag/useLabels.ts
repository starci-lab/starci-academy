import { useTranslations } from "next-intl"
import type { PriceTagProps } from "./PriceTagBase"

/** Props the connected members take — every breakdown label is resolved here. */
export type PriceTagConnectedProps = Omit<PriceTagProps, "labels">

/**
 * Resolves breakdown-popover copy. Lives beside the PriceTag barrel so both
 * members share one catalog read without fetching inside the presentational half.
 */
export const useLabels = (breakdown: PriceTagProps["breakdown"]) => {
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
