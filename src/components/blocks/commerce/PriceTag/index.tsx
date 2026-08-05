"use client"

import { PriceTagProminent } from "./PriceTagProminent"

export type { PriceCurrency, PriceBreakdown } from "./PriceTagBase"
export type { PriceTagConnectedProps } from "./useLabels"
export { formatPrice } from "./PriceTagBase"
export { PriceTagProminent } from "./PriceTagProminent"
export { PriceTagInline } from "./PriceTagInline"

/** The unqualified name keeps meaning the focal one. */
export const PriceTag = PriceTagProminent
