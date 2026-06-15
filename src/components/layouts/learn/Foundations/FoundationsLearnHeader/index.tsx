"use client"

import React, { useCallback } from "react"
import {
    useTranslations,
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources"
import {
    useAppSelector,
} from "@/redux"
import {
    SubPageHeader,
} from "@/components/reuseable"
import type {
    WithClassNames,
} from "@/modules/types"

/** Props for {@link FoundationsLearnHeader}. */
export type FoundationsLearnHeaderProps = WithClassNames<undefined>

/**
 * Title, description and resource count for the foundations category learn page.
 *
 * Self-contained: reads the active category from Redux and owns back navigation
 * to the foundations category hub.
 * @param props.className - Optional root class names.
 */
export const FoundationsLearnHeader = ({
    className,
}: FoundationsLearnHeaderProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const category = useAppSelector((state) => state.foundation.category)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    const title = category?.title || t("foundations.title")
    const description = category?.description || t("foundations.description")

    /** Navigate back to the foundations category hub. */
    const onBack = useCallback(() => {
        if (!courseDisplayId) {
            return
        }
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .foundations()
                .build(),
        )
    }, [courseDisplayId, locale, router])

    return (
        <SubPageHeader
            title={title}
            description={description}
            onBack={onBack}
            className={className}
        />
    )
}
