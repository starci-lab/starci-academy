import React from "react"
import { PriceTagBase, type PriceTagProps } from "../PriceTagBase"

/**
 * Presentational focal price — the purchase-CTA member of PriceTag.
 */
export const _PriceTagProminent = (props: PriceTagProps) => <PriceTagBase {...props} emphasis="prominent" />
