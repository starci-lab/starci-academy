"use client"

import React from "react"
import {
    Button,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    RocketLaunchIcon,
    BookOpenIcon,
} from "@phosphor-icons/react"
import {
    StickyBottomBar,
} from "@/components/blocks"
import {
    usePricingRows,
} from "../hooks/usePricingRows"
import {
    useCourseEnrollment,
} from "../hooks/useCourseEnrollment"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CourseMobileEnrollBar}. */
export type CourseMobileEnrollBarProps = WithClassNames<undefined>

/**
 * Mobile-only sticky bottom bar (md:hidden): the active price + a single primary
 * action that's always reachable while scrolling the landing on a phone. Reuses
 * the {@link StickyBottomBar} block chrome + the shared pricing / enrollment hooks.
 *
 * @param props - optional className (placement only).
 */
export const CourseMobileEnrollBar = ({ className }: CourseMobileEnrollBarProps) => {
    const t = useTranslations()
    const { active } = usePricingRows()
    const { isEnrolled, onEnroll, onContinueLearning } = useCourseEnrollment()

    return (
        <StickyBottomBar className={className}>
            <div className="flex items-center justify-between gap-3">
                <Typography type="body" weight="bold">
                    {active?.formattedPrice}
                </Typography>
                {isEnrolled ? (
                    <Button variant="primary" onPress={onContinueLearning}>
                        <BookOpenIcon className="size-5" />
                        {t("course.continueLearning")}
                    </Button>
                ) : (
                    <Button variant="primary" onPress={onEnroll}>
                        <RocketLaunchIcon className="size-5" />
                        {t("course.enroll")}
                    </Button>
                )}
            </div>
        </StickyBottomBar>
    )
}
