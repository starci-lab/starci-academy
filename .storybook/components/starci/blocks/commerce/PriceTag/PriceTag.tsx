import { PriceTagProminent } from "./PriceTagProminent"

export type { PriceCurrency, PriceBreakdown, PriceTagProps } from "./PriceTagBase"
export { PriceTagProminent } from "./PriceTagProminent"
export { PriceTagInline } from "./PriceTagInline"

/** The unqualified name keeps meaning the focal one, as it did before the split. */
export const PriceTag = PriceTagProminent
