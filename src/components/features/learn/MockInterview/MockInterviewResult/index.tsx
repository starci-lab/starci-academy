"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import { pathConfig } from "@/resources/path"
import { useQueryMyMockInterviewAttemptBySessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewAttemptBySessionSwr"
import { mapMockInterviewAttemptToGradeResult } from "../mapAttemptToGradeResult"
import { MockInterviewScorecard } from "../MockInterviewScorecard"

/** Props for {@link MockInterviewResult}. */
export interface MockInterviewResultProps {
    /** The graded session to show. */
    sessionId: string
    /** Owning course id (uuid) — enrollment-guard header + track-snapshot scope. */
    courseId: string
    /** Owning course slug — needed to build deep links (study-weak-area CTA, retry). */
    courseDisplayId: string
}

/**
 * The URL-addressable RESULT surface for a GRADED mock-interview run —
 * `mock-interview/interview/[sessionId]/result`. Fetches the attempt fresh by
 * session id ({@link useQueryMyMockInterviewAttemptBySessionSwr}) and maps it
 * through {@link mapMockInterviewAttemptToGradeResult} into the same
 * {@link import("../types").MockInterviewGradeResult} shape the live grading
 * mutation returns, so {@link MockInterviewScorecard} renders identically
 * whether reached via a fresh finish (`MockInterviewSession` redirects here
 * right after grading) or a direct/resumed URL visit — "is this session done"
 * is answered by being on THIS route, never re-derived from `?phase=` client
 * state (2026-07-13, mirrors `flashcards().quiz(sessionId).result()`'s own
 * 2026-07-12 fix for the same class of F5-shows-stale-state bug). No `onRetry`
 * — this is a read-only revisit; "Interview again" goes back to setup instead of
 * silently redrawing a session out from under a URL someone might have shared.
 *
 * The reading measure is stated ONCE on `Container`; it used to be repeated as the
 * same `mx-auto w-full max-w-3xl px-4` string on three separate branches.
 *
 * @param props - {@link MockInterviewResultProps}
 */
export const MockInterviewResult = ({
    sessionId,
    courseId,
    courseDisplayId,
}: MockInterviewResultProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const attemptSwr = useQueryMyMockInterviewAttemptBySessionSwr(sessionId, courseId)
    const attempt = attemptSwr.data
    const isSkeleton = attemptSwr.isLoading && !attempt

    const goToMockInterviewHome = () => {
        router.push(pathConfig().locale(locale).course(courseDisplayId).learn().mockInterview().build())
    }

    // error beats a stale loading flag; the pending-scorecard message is the settled
    // "graded run has no attempt row" case (BLOCK-8 order).
    const scorecard = () => {
        if (attemptSwr.error && !attempt) {
            return (
                <AsyncContentError
                    title={t("mockInterview.scorecardPending")}
                    onRetry={() => { void attemptSwr.mutate() }}
                    retryLabel={t("mockInterview.backToSetup")}
                />
            )
        }
        if (isSkeleton) {
            // each region of the real scorecard is a bordered card, so the resting
            // state is card-shaped too — verdict, track snapshot, phase breakdown.
            return (
                <StackV
                    gap={6}
                    items={[
                        () => <Skeleton.Card lines={2} />,
                        () => <Skeleton.Card lines={3} />,
                        () => <Skeleton.Card lines={3} />,
                    ]}
                />
            )
        }
        if (!attempt) {
            return (
                <AsyncContentEmpty
                    title={t("mockInterview.scorecardPending")}
                    action={() => (
                        <Button
                            label={t("mockInterview.backToSetup")}
                            size="sm"
                            variant="primary"
                            onPress={goToMockInterviewHome}
                        />
                    )}
                />
            )
        }
        return (
            <StackV
                gap={6}
                items={[
                    () => (
                        <MockInterviewScorecard
                            grade={mapMockInterviewAttemptToGradeResult(attempt)}
                            courseId={courseId}
                            courseDisplayId={courseDisplayId}
                            promptTitle={attempt.promptTitle}
                            createdAt={attempt.createdAt}
                        />
                    ),
                    () => (
                        <Button
                            label={t("mockInterview.backToSetup")}
                            variant="tertiary"
                            onPress={goToMockInterviewHome}
                            classNames={["self-start"]}
                        />
                    ),
                ]}
            />
        )
    }

    return (
        <Container
            identity={{ tier: "block", component: "MockInterviewResult" }}
            size="md"
            padding={5}
            body={() => (
                <StackV
                    gap={6}
                    items={[
                        () => (
                            <PageHeader
                                breadcrumb={<BackLink label={t("mockInterview.title")} onPress={goToMockInterviewHome} />}
                                title={t("mockInterview.debriefTitle")}
                            />
                        ),
                        scorecard,
                    ]}
                />
            )}
        />
    )
}
