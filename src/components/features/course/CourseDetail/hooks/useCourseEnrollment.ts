"use client"

import {
    useCallback,
} from "react"
import {
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    usePaymentOverlayState,
    useQueryCourseEnrollmentStatusSwr,
} from "@/hooks"
import {
    PaymentFlow,
} from "@/modules/types"
import {
    useAppSelector,
} from "@/redux"
import {
    pathConfig,
} from "@/resources"

/** Result of {@link useCourseEnrollment}. */
export interface UseCourseEnrollmentResult {
    /** Whether the viewer is already enrolled. */
    isEnrolled: boolean
    /** Open the payment overlay in the course-enroll flow. */
    onEnroll: () => void
    /** Navigate into the learning experience (trial or continue). */
    onContinueLearning: () => void
}

/**
 * Shared enrollment intent for the landing CTAs (hero, pricing rail, mobile bar):
 * reads enrollment status (SWR singleton) + the enroll / continue-learning
 * handlers, so every CTA stays in sync.
 *
 * @returns {@link UseCourseEnrollmentResult}.
 */
export const useCourseEnrollment = (): UseCourseEnrollmentResult => {
    const locale = useLocale()
    const router = useRouter()
    const { open } = usePaymentOverlayState()
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    const isEnrolled = enrollmentSwr.data?.courseEnrollmentStatus?.data?.isEnrolled === true

    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )
    const onContinueLearning = useCallback(
        () => router.push(
            pathConfig().locale(locale).course(courseDisplayId).learn().module().build(),
        ),
        [router, locale, courseDisplayId],
    )

    return {
        isEnrolled,
        onEnroll,
        onContinueLearning,
    }
}
