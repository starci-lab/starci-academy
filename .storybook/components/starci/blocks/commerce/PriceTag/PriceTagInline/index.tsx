import React from "react"
import { PriceTagBase, type PriceTagProps } from "../PriceTagBase"

/**
 * One-line course/product price — the in-card member of PriceTag.
 * Callers pick this member for role, not for font size.
 */
export const PriceTagInline = (props: PriceTagProps) => <PriceTagBase {...props} emphasis="inline" />
