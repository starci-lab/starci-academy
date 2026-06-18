"use client"

import React from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import {
    BookOpenIcon,
    RocketLaunchIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    useCourseEnrollment,
} from "../hooks/useCourseEnrollment"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CourseCtaButtons}. */
export type CourseCtaButtonsProps = WithClassNames<undefined>

/**
 * The course conversion CTA cluster, shared by the hero + pricing rail so every
 * call to action stays in sync. Not enrolled → primary "Enroll" + secondary
 * "Try free"; enrolled → single primary "Continue learning". Self-contained:
 * reads enrollment intent from {@link useCourseEnrollment}.
 *
 * @param props - optional className (placement only).
 */
export const CourseCtaButtons = ({ className }: CourseCtaButtonsProps) => {
    const t = useTranslations()
    const { isEnrolled, onEnroll, onContinueLearning } = useCourseEnrollment()

    if (isEnrolled) {
        return (
            <div className={cn("flex flex-col gap-2", className)}>
                <Button variant="primary" size="lg" className="w-full" onPress={onContinueLearning}>
                    <BookOpenIcon className="size-5" />
                    {t("course.continueLearning")}
                </Button>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Button variant="primary" size="lg" className="w-full" onPress={onEnroll}>
                <RocketLaunchIcon className="size-5" />
                {t("course.enroll")}
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onPress={onContinueLearning}>
                <BookOpenIcon className="size-5" />
                {t("course.tryLearning")}
            </Button>
        </div>
    )
}
