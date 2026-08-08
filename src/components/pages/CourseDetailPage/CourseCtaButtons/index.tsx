"use client"

import React from "react"
import {
    ArrowRightIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    useCourseEnrollment,
} from "@/hooks/useCourseEnrollment"
import {
    AddToCartButton,
} from "@/components/blocks/commerce/AddToCartButton"
import {
    useAppSelector,
} from "@/redux/hooks"
import { Button } from "@/components/atoms/buttons/Button"
import { StackV } from "@/components/frames/Stack"

/**
 * The course conversion CTA cluster, shared by the hero + pricing rail so every
 * call to action stays in sync. Not enrolled → primary "Enroll" + secondary
 * "Try free"; enrolled → single primary "Continue learning". Self-contained:
 * reads enrollment intent from {@link useCourseEnrollment}.
 */
export const CourseCtaButtons = () => {
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const { isEnrolled, onEnroll, onContinueLearning, onTryLearning } = useCourseEnrollment()

    if (isEnrolled) {
        return (
            <StackV
                identity={{ tier: "page", component: "CourseCtaButtons" }}
                gap={2}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                items={[
                    () => (
                        <Button
                            variant="primary"
                            size="lg"
                            classNames={["w-full"]}
                            label={t("course.continueLearning")}
                            suffixIcon={ArrowRightIcon}
                            onPress={onContinueLearning}
                        />
                    ),
                ]}
            />
        )
    }

    return (
        <StackV
            identity={{ tier: "page", component: "CourseCtaButtons" }}
            gap={2}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            items={[
                () => (
                    <Button
                        variant="primary"
                        size="lg"
                        classNames={["w-full"]}
                        label={t("course.enroll")}
                        suffixIcon={ArrowRightIcon}
                        onPress={onEnroll}
                    />
                ),
                ...(course ? [
                    () => (
                        <AddToCartButton
                            course={course}
                            isEnrolled={isEnrolled}
                            variant="secondary"
                            fullWidth
                        />
                    ),
                ] : []),
                // "Try free" is the ACQUISITION entry for a non-payer — a peer secondary
                // CTA (not buried as quiet tertiary), so the funnel's front door is visible.
                // No trailing arrow: arrow marks the ONE primary CTA per surface
                // (button.md §2) — "Enroll" above already carries it.
                () => (
                    <Button
                        variant="secondary"
                        size="lg"
                        classNames={["w-full"]}
                        label={t("course.tryLearning")}
                        onPress={onTryLearning}
                    />
                ),
            ]}
        />
    )
}
