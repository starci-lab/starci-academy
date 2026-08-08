import React from "react"
import { PriceTagBase, type PriceTagProps } from "../PriceTagBase"

/**
 * Presentational one-line price — the in-card member of PriceTag.
 */
export const _PriceTagInline = (props: PriceTagProps) => (
    <PriceTagBase
        {...props}
        emphasis="inline"
        identity={{ tier: "block", component: "PriceTagInline" }}
    />
)
