"use client"

import React, { useMemo } from "react"
import {
    useTranslations,
} from "next-intl"
import {
    FoundationCard,
} from "../FoundationCard"
import {
    compareFoundations,
} from "../utils"
import { useAppSelector } from "@/redux/hooks"
import { useQueryFoundationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationsSwr"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"

/** Number of placeholder rows shown while the resources load. */
const SKELETON_ROWS = 6

/**
 * Foundations master list: reads from Redux + SWR.
 *
 * The placeholder rows render inside the SAME `SurfaceListCard` the loaded rows do —
 * one tree, not a second one kept in step by hand (`loading-and-skeleton.md`).
 */
export const FoundationsList = () => {
    const t = useTranslations()
    const foundations = useAppSelector((state) => state.foundation.entities)
    const { data: foundationsData, isLoading, error } = useQueryFoundationsSwr()

    // First load: the query has not settled, or redux has not hydrated the list yet.
    const isSkeleton = (isLoading && !foundationsData) || foundations === undefined

    /** Foundations sorted into display order (StarCi video → roadmap → cheatsheet → rest). */
    const sortedFoundations = useMemo(() => {
        if (!foundations?.length) {
            return []
        }
        return [...foundations].sort(compareFoundations)
    }, [foundations])

    // error beats a stale loading flag; empty only once settled (BLOCK-8 order). Both branches
    // carry the same line the pre-split code used — only the tone differs.
    if (error && !foundationsData) {
        return <AsyncContentError title={t("foundations.empty")} />
    }
    if (!isSkeleton && sortedFoundations.length === 0) {
        return <AsyncContentEmpty title={t("foundations.empty")} />
    }

    return (
        <SurfaceListCard identity={{ tier: "block", component: "FoundationsList" }}>
            {isSkeleton
                ? Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                    <FoundationCard
                        key={index}
                        isSkeleton
                        divider={index < SKELETON_ROWS - 1}
                    />
                ))
                : sortedFoundations.map((foundation, index) => (
                    <FoundationCard
                        key={foundation.id}
                        foundation={foundation}
                        displayIndex={index}
                    />
                ))}
        </SurfaceListCard>
    )
}
