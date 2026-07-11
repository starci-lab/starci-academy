"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { EnrollGate } from "../shared/EnrollGate"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { MockInterviewSession } from "./MockInterviewSession"
import { MockInterviewSetupSkeleton } from "./MockInterviewSetupSkeleton"
import { MockInterviewSessionSkeleton } from "./MockInterviewSessionSkeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"

/** Props for {@link MockInterview}. */
export interface MockInterviewProps extends WithClassNames<undefined> {
    /**
     * Present when reached via the dedicated `/mock-interview/interview/[sessionId]`
     * route — threaded straight through to {@link MockInterviewSession}, which
     * rehydrates that server-persisted session (24h TTL) instead of showing the
     * green room.
     */
    resumeSessionId?: string
}

/**
 * Course-level mock interview WORK PANE (entry). Reads the active course off
 * Redux, gates the surface behind enrollment (it spends AI credits, like the
 * flashcard interview), and frames the {@link MockInterviewSession} state machine
 * with the standard learn header + breadcrumb.
 * @param props - {@link MockInterviewProps}
 */
export const MockInterview = ({ className, resumeSessionId }: MockInterviewProps) => {
    const t = useTranslations()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // enrollment status is only ever FETCHED while authenticated (the query's key is
    // disabled otherwise — see `useQueryCourseEnrollmentStatusSwr`), so a guest's
    // `enrollmentSwr.data` stays `undefined` forever; without checking `authenticated`
    // below, `enrollmentResolved` would never flip and the skeleton would spin forever
    // instead of settling straight into the enroll gate.
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    // enrolled-only (spends AI credits) — gate trial viewers behind an enroll CTA
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const isEnrolled = enrollmentSwr.data?.courseEnrollmentStatus?.data?.isEnrolled === true
    // during the LIVE interview phase the shell goes full-bleed (course rails dropped via
    // `?phase=interview`); drop the centered max-width + page header here to match — the
    // interview is a focused work surface, not a centered reading column. A
    // `resumeSessionId` (the dedicated `/interview/[sessionId]` route) always lands
    // straight in the interview phase, so it counts as live immediately too — no
    // waiting on the query-param mirror to catch up after mount.
    const isLive = useSearchParams().get("phase") === "interview" || Boolean(resumeSessionId)
    // resolved once the enrollment check has actually run (nullish, not `!enrollmentSwr.data` —
    // an `{isEnrolled: false}` payload is falsy but IS resolved) — gates the green
    // room / live surface behind a mirrored skeleton instead of rendering nothing.
    // Guests (unauthenticated) never fire the query at all, so they resolve immediately
    // (straight to the enroll gate) instead of waiting on a request that never runs.
    const enrollmentResolved = !authenticated || (enrollmentSwr.data !== undefined && !enrollmentSwr.isLoading)

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

                <AsyncContent
                    isLoading={!enrollmentResolved}
                    skeleton={isLive ? <MockInterviewSessionSkeleton /> : <MockInterviewSetupSkeleton />}
                >
                    {!isEnrolled ? (
                        <EnrollGate
                            title={t("mockInterview.gateTitle")}
                            description={t("mockInterview.gateDescription")}
                        />
                    ) : courseId && courseDisplayId ? (
                        <MockInterviewSession
                            key={courseId}
                            courseId={courseId}
                            courseDisplayId={courseDisplayId}
                            resumeSessionId={resumeSessionId}
                        />
                    ) : null}
                </AsyncContent>
            </div>
        </div>
    )
}
