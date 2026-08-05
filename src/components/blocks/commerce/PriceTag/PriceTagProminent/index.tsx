"use client"

import React from "react"
import { _PriceTagProminent } from "./component"
import { useLabels, type PriceTagConnectedProps } from "../useLabels"

/** The focal price of a purchase CTA. */
export const PriceTagProminent = (props: PriceTagConnectedProps) => (
    <_PriceTagProminent {...props} labels={useLabels(props.breakdown)} />
)
