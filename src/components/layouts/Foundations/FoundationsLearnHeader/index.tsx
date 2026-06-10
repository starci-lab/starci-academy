"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import {
    SubPageHeader,
    SkeletonText,
} from "@/components/reuseable"

/** Props for {@link FoundationsLearnHeader}. */
export interface FoundationsLearnHeaderProps {
    /** Navigate back to the foundations category hub. */
    onBack: () => void
}

/**
 * Title, description and resource count for the foundations category learn page.
 *
 * Self-contained section (single-use): reads the active category and the
 * foundations list/count from Redux; back navigation is owned by the parent.
 *
 * @param props.onBack - Handler for the back button (parent owns routing).
 */
export const FoundationsLearnHeader = ({
    onBack,
}: FoundationsLearnHeaderProps) => {
    const t = useTranslations()
    const category = useAppSelector((state) => state.foundation.category)
    const foundations = useAppSelector((state) => state.foundation.entities)
    const count = useAppSelector((state) => state.foundation.count)

    const title = category?.title || t("foundations.title")
    const description = category?.description || t("foundations.description")
    const hasLoaded = Boolean(foundations)

    return (
        <>
            <SubPageHeader
                title={title}
                description={description}
                onBack={onBack}
            />
            <div className="h-6" />
            {!hasLoaded ? (
                <SkeletonText size="sm" width="w-[150px]" />
            ) : (
                <p className="text-muted text-sm">
                    {t("foundations.count", { count: count ?? 0 })}
                </p>
            )}
        </>
    )
}
