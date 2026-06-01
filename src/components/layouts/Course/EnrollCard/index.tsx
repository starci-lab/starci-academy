"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    Card,
} from "@heroui/react"
import {
    BookOpenIcon,
    PencilSimpleLineIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    usePaymentOverlayState,
    useQueryCourseEnrollmentStatusSwr,
} from "@/hooks/singleton"
import {
    PaymentFlow,
} from "@/modules/types"
import {
    useAppSelector,
} from "@/redux"
import {
    pathConfig,
} from "@/resources"
import {
    Stepper,
} from "../Stepper"
import {
    ValuePropositions,
} from "../ValuePropositions"

/**
 * Sidebar card: cover image, pricing stepper, value propositions and the
 * enroll / continue-learning call to action.
 *
 * Self-contained section (single-use): reads its own course display data
 * (redux), enrollment status (SWR singleton) and owns its enroll (payment
 * overlay) / continue-learning (router) handlers, so the course container
 * renders `<EnrollCard />` with no props. `"use client"` because HeroUI
 * `Card`/`Button` are interactive and it reads redux/router.
 */
export const EnrollCard = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const { open } = usePaymentOverlayState()
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const title = useAppSelector((state) => state.course.entity?.title)
    const coverImageUrl = useAppSelector((state) => state.course.entity?.coverImageUrl)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    /** Whether the current user is already enrolled in this course. */
    const isEnrolled = enrollmentSwr.data?.courseEnrollmentStatus?.data?.isEnrolled === true
    /** Number of users enrolled in this course (0 when unknown). */
    const enrollmentCount = useAppSelector((state) => state.course.entity?.enrollmentCount) ?? 0

    /** Open the payment overlay in the course-enroll flow. */
    const onEnroll = useCallback(
        () => open({ flow: PaymentFlow.CourseEnroll }),
        [open],
    )
    /** Navigate into the course learning experience. */
    const onContinueLearning = useCallback(
        () => router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .module()
                .build(),
        ),
        [router, locale, courseDisplayId],
    )
    return (
        <Card className="order-1 md:order-2 md:col-span-2 w-full bg-inherit border  h-fit shrink-0 p-0">
            <Card.Content>
                <img
                    className="w-full h-full object-cover"
                    alt={title ?? ""}
                    loading="lazy"
                    src={coverImageUrl ?? undefined}
                />
                <div className="p-3">
                    <Stepper />
                    <div className="h-12" />
                    <ValuePropositions />
                </div>
            </Card.Content>
            <Card.Footer className="px-3 pb-3">
                <div className="w-full">
                    {!isEnrolled ? (
                        <>
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isDisabled={isEnrolled}
                                onPress={onEnroll}
                            >
                                <PencilSimpleLineIcon className="w-5 h-5" />
                                {t("course.enroll")}
                            </Button>
                            <div className="h-2" />
                            {/* trial: enter the learning experience; premium lessons stay blurred behind the paywall */}
                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full"
                                onPress={onContinueLearning}
                            >
                                <BookOpenIcon className="w-5 h-5" />
                                {t("course.tryLearning")}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            isDisabled={!isEnrolled}
                            onPress={onContinueLearning}
                        >
                            <BookOpenIcon className="w-5 h-5" />
                            {t("course.continueLearning")}
                        </Button>
                    )}
                    <div className="h-12" />
                    <div className="text-sm text-muted">
                        {t("course.usersEnrolled", { count: enrollmentCount })}
                    </div>
                </div>
            </Card.Footer>
        </Card>
    )
}
