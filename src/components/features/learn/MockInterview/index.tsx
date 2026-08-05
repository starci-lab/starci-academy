"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { EnrollGate } from "../shared/EnrollGate"
import { MockInterviewGatePreview } from "./MockInterviewGatePreview"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { MockInterviewSession } from "./MockInterviewSession"
import { MockInterviewResult } from "./MockInterviewResult"
import { MockInterviewSetupSkeleton } from "./MockInterviewSetupSkeleton"
import { MockInterviewSessionSkeleton } from "./MockInterviewSessionSkeleton"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"

/** Props for {@link MockInterview}. */
export interface MockInterviewProps {
    /**
     * Present when reached via the dedicated `/mock-interview/interview/[sessionId]`
     * route — threaded straight through to {@link MockInterviewSession}, which
     * rehydrates that server-persisted session (24h TTL) instead of showing the
     * green room.
     */
    resumeSessionId?: string
    /** Present on the `/interview/[sessionId]/result` route — shows the graded debrief. */
    resultSessionId?: string
}

/**
 * Mock-interview feature shell: gates the surface behind enrollment (it spends AI
 * credits), and frames the {@link MockInterviewSession} state machine with the
 * standard learn header + breadcrumb.
 *
 * Two shapes, stated as two composed trees rather than one conditional class
 * string: the LIVE interview and the result debrief are full-bleed work surfaces
 * that own their own header, while the green room is a centred reading column.
 *
 * DEBT: `MockInterviewSetupSkeleton` / `MockInterviewSessionSkeleton` are still
 * separate descriptions of the two surfaces below. Folding them in means giving a
 * state machine its own resting state — a change worth reviewing on its own.
 *
 * @param props - {@link MockInterviewProps}
 */
export const MockInterview = ({ resumeSessionId, resultSessionId }: MockInterviewProps) => {
    const t = useTranslations()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // enrollment status is only ever FETCHED while authenticated (the query's key is
    // disabled otherwise — see `useQueryCourseEnrollmentStatusSwr`), so a guest's
    // `enrollmentSwr.data` stays `undefined` forever; without checking `authenticated`
    // below, `enrollmentResolved` would never flip and the surface would rest forever
    // instead of settling straight into the enroll gate.
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    // enrolled-only (spends AI credits) — gate trial viewers behind an enroll CTA
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const isEnrolled = enrollmentSwr.data?.courseEnrollmentStatus?.data?.isEnrolled === true
    // during the LIVE interview phase the shell goes full-bleed (course rails dropped via
    // `?phase=interview`); drop the centred measure + page header here to match — the
    // interview is a focused work surface, not a centred reading column. A
    // `resumeSessionId` (the dedicated `/interview/[sessionId]` route) always lands
    // straight in the interview phase, so it counts as live immediately too — no
    // waiting on the query-param mirror to catch up after mount.
    const isLive = useSearchParams().get("phase") === "interview" || Boolean(resumeSessionId)
    // result: its own centred page (like the flashcard quiz result), NOT the full-bleed
    // live shell — but it owns its OWN PageHeader/BackLink internally
    // (`MockInterviewResult`), so it skips this shell's generic header the same way.
    const isResult = Boolean(resultSessionId)
    // resolved once the enrollment check has actually run (nullish, not `!enrollmentSwr.data` —
    // an `{isEnrolled: false}` payload is falsy but IS resolved) — gates the green room /
    // live surface behind its resting state instead of rendering nothing. Guests never
    // fire the query at all, so they resolve immediately (straight to the enroll gate).
    const isSkeleton = !(!authenticated || (enrollmentSwr.data !== undefined && !enrollmentSwr.isLoading))
    const ownsItsHeader = isLive || isResult

    const surface = () => {
        if (isSkeleton) {
            return ownsItsHeader ? <MockInterviewSessionSkeleton /> : <MockInterviewSetupSkeleton />
        }
        if (!isEnrolled) {
            return (
                <EnrollGate
                    title={t("mockInterview.gateTitle")}
                    description={t("mockInterview.gateDescription")}
                    preview={<MockInterviewGatePreview />}
                />
            )
        }
        if (!(courseId && courseDisplayId)) {
            return null
        }
        return resultSessionId ? (
            <MockInterviewResult
                key={courseId}
                sessionId={resultSessionId}
                courseId={courseId}
                courseDisplayId={courseDisplayId}
            />
        ) : (
            <MockInterviewSession
                key={courseId}
                courseId={courseId}
                courseDisplayId={courseDisplayId}
                resumeSessionId={resumeSessionId}
            />
        )
    }

    // full-bleed: the surface below owns its own header and measure
    if (ownsItsHeader) {
        return (
            <StackV
                identity={{ tier: "block", component: "MockInterview" }}
                gap={1}
                body={surface}
            />
        )
    }

    return (
        <Container
            identity={{ tier: "block", component: "MockInterview" }}
            size="md"
            body={() => (
                <StackV
                    gap={7}
                    items={[
                        () => (
                            <PageHeader
                                breadcrumb={<LearnBreadcrumb current={t("mockInterview.title")} />}
                                title={t("mockInterview.title")}
                                description={t("mockInterview.subtitle")}
                            />
                        ),
                        surface,
                    ]}
                />
            )}
        />
    )
}
