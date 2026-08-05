import React from "react"
import { PriceTagBase, type PriceTagProps } from "../PriceTagBase"

/**
 * Focal course/product price — the purchase-CTA member of PriceTag.
 * Callers pick this member for role, not for font size.
 */
export const PriceTagProminent = (props: PriceTagProps) => <PriceTagBase {...props} emphasis="prominent" />
