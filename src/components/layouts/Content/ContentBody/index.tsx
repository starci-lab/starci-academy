"use client"

import React from "react"
import { useAppSelector } from "@/redux"
import type { WithClassNames } from "@/modules/types"
import { ContentBodyLegacy } from "./ContentBodyLegacy"
import { ContentBodyV2 } from "./ContentBodyV2"

export type ContentBodyProps = WithClassNames<undefined>

/**
 * Content body switch. A non-null `verified` day marks SCHEMA V2 content → render the V2 body;
 * otherwise fall back to the legacy markdown body.
 *
 * @param props.className - Optional wrapper class forwarded to the chosen body.
 */
export const ContentBody = ({ className }: ContentBodyProps) => {
    const verified = useAppSelector((state) => state.content.entity?.verified)
    return verified
        ? <ContentBodyV2 className={className} />
        : <ContentBodyLegacy className={className} />
}
