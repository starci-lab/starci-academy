"use client"

import React from "react"
import { Button } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { pathConfig } from "@/resources/path"
import { useQueryMyMockInterviewAttemptBySessionSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewAttemptBySessionSwr"
import { mapMockInterviewAttemptToGradeResult } from "../mapAttemptToGradeResult"
import { MockInterviewScorecard } from "../MockInterviewScorecard"

/** Props for {@link MockInterviewResult}. */
export interface MockInterviewResultProps extends WithClassNames<undefined> {
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
 * — this is a read-only revisit; "Phỏng vấn lại" goes back to setup instead of
 * silently redrawing a session out from under a URL someone might have shared.
 *
 * @param props - {@link MockInterviewResultProps}
 */
export const MockInterviewResult = ({
    sessionId,
    courseId,
    courseDisplayId,
    className,
}: MockInterviewResultProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const attemptSwr = useQueryMyMockInterviewAttemptBySessionSwr(sessionId, courseId)

    const goToMockInterviewHome = () => {
        router.push(pathConfig().locale(locale).course(courseDisplayId).learn().mockInterview().build())
    }

    return (
        <div className={className}>
            <PageHeader
                className="mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6"
                breadcrumb={<BackLink label={t("mockInterview.title")} onPress={goToMockInterviewHome} />}
                title={t("mockInterview.debriefTitle")}
            />
            <AsyncContent
                isLoading={attemptSwr.isLoading && !attemptSwr.data}
                skeleton={(
                    // mirrors MockInterviewScorecard's real tree: verdict Alert, track
                    // snapshot, phase breakdown — each is a bordered card in the real
                    // render, so Skeleton.Card (not raw pulse bars) matches its box.
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-6 sm:px-6">
                        <Skeleton.Card lines={2} />
                        <Skeleton.Card lines={3} />
                        <Skeleton.Card lines={3} />
                    </div>
                )}
                error={!attemptSwr.data ? attemptSwr.error : undefined}
                errorContent={{
                    title: t("mockInterview.scorecardPending"),
                    onRetry: () => { void attemptSwr.mutate() },
                    retryLabel: t("mockInterview.backToSetup"),
                }}
            >
                {attemptSwr.data ? (
                    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-6 sm:px-6">
                        <MockInterviewScorecard
                            grade={mapMockInterviewAttemptToGradeResult(attemptSwr.data)}
                            courseId={courseId}
                            courseDisplayId={courseDisplayId}
                            promptTitle={attemptSwr.data.promptTitle}
                            createdAt={attemptSwr.data.createdAt}
                        />
                        <Button variant="tertiary" className="self-start" onPress={goToMockInterviewHome}>
                            {t("mockInterview.backToSetup")}
                        </Button>
                    </div>
                ) : (
                    <div className="mx-auto flex w-full max-w-3xl px-4 pb-6 sm:px-6">
                        <EmptyState
                            title={t("mockInterview.scorecardPending")}
                            action={(
                                <Button size="sm" variant="primary" onPress={goToMockInterviewHome}>
                                    {t("mockInterview.backToSetup")}
                                </Button>
                            )}
                        />
                    </div>
                )}
            </AsyncContent>
        </div>
    )
}
