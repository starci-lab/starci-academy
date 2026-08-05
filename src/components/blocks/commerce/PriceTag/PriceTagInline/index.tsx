"use client"

import React from "react"
import { _PriceTagInline } from "./component"
import { useLabels, type PriceTagConnectedProps } from "../useLabels"

/** One line of price inside a card. */
export const PriceTagInline = (props: PriceTagConnectedProps) => (
    <_PriceTagInline {...props} labels={useLabels(props.breakdown)} />
)
