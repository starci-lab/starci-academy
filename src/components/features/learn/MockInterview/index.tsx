"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { EnrollGate } from "../shared/EnrollGate"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { MockInterviewSession } from "./MockInterviewSession"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"

/** Props for {@link MockInterview}. */
export type MockInterviewProps = WithClassNames<undefined>

/**
 * Course-level mock interview WORK PANE (entry). Reads the active course off
 * Redux, gates the surface behind enrollment (it spends AI credits, like the
 * flashcard interview), and frames the {@link MockInterviewSession} state machine
 * with the standard learn header + breadcrumb.
 * @param props - {@link MockInterviewProps}
 */
export const MockInterview = ({ className }: MockInterviewProps) => {
    const t = useTranslations()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // enrolled-only (spends AI credits) — gate trial viewers behind an enroll CTA
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const isEnrolled = enrollmentSwr.data?.courseEnrollmentStatus?.data?.isEnrolled === true
    // during the LIVE interview phase the shell goes full-bleed (course rails dropped via
    // `?phase=interview`); drop the centered max-width + page header here to match — the
    // interview is a focused work surface, not a centered reading column.
    const isLive = useSearchParams().get("phase") === "interview"

    return (
        <div className={className}>
            <div className={isLive ? "flex flex-col" : "mx-auto flex max-w-3xl flex-col gap-10"}>
                {!isLive ? (
                    <PageHeader
                        breadcrumb={<LearnBreadcrumb current={t("mockInterview.title")} />}
                        title={t("mockInterview.title")}
                        description={t("mockInterview.subtitle")}
                    />
                ) : null}

                {!isEnrolled ? (
                    <EnrollGate
                        title={t("mockInterview.gateTitle")}
                        description={t("mockInterview.gateDescription")}
                    />
                ) : courseId && courseDisplayId ? (
                    <MockInterviewSession key={courseId} courseId={courseId} courseDisplayId={courseDisplayId} />
                ) : null}
            </div>
        </div>
    )
}
