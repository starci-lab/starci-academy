"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"

/**
 * Title, description and resource count for the foundations learn page.
 *
 * Self-contained section (single-use): reads the active category and the
 * foundations list/count from the Redux singleton itself (falling back to the
 * generic copy), so the container just renders `<FoundationsLearnHeader />`.
 */
export const FoundationsLearnHeader = () => {
    const t = useTranslations()
    const category = useAppSelector((state) => state.foundation.category)
    const foundations = useAppSelector((state) => state.foundation.entities)
    const count = useAppSelector((state) => state.foundation.count)

    const title = category?.title
    const description = category?.description
    const hasLoaded = Boolean(foundations)

    return (
        <>
            <div>
                <div className="text-2xl font-bold">{title || t("foundations.title")}</div>
                {description ? (
                    <p className="text-muted mt-2 text-sm">{description}</p>
                ) : (
                    <p className="text-muted mt-2 text-sm">{t("foundations.description")}</p>
                )}
            </div>
            <div className="h-6" />
            {!hasLoaded ? (
                <Skeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <p className="text-muted text-sm">
                    {t("foundations.count", { count: count ?? 0 })}
                </p>
            )}
        </>
    )
}
