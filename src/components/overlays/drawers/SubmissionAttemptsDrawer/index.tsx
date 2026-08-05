"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    useFeedbackDetailsOverlayState,
    useSubmissionAttemptsOverlayState,
} from "@/hooks/zustand/overlay/hooks"
import { useQuerySubmissionAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQuerySubmissionAttemptsSwr"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import {
    setActiveChallengeSubmissionId,
    setSubmissionAttemptId,
} from "@/redux/slices/submission-attempt"
import type { AiModelCategory as RealAiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { toBlueprintModelCategory } from "./map"
import { _SubmissionAttemptsDrawer, type SubmissionAttemptRecord } from "./component"

/**
 * The attempts-history drawer — the CONNECTED half of `SubmissionAttemptsDrawer`:
 * reads the shared overlay open-state, the redux-cached page of submission
 * attempts (server-paginated: `useQuerySubmissionAttemptsSwr` + the
 * `submissionAttempt` slice's `pageNumber`/`limit`), the requirement's max score
 * + pass threshold, and the served-model → tier map (`useQueryAiModelsSwr`'s
 * `gradableModels`) — then hands fully-typed rows to the presentational
 * {@link _SubmissionAttemptsDrawer}.
 *
 * TODO(pagination): the blueprint (`component.tsx`, ported as-is from the
 * storybook source) paginates the FULL `attempts` array CLIENT-side
 * (`HISTORY_PAGE_SIZE` rows/page, its own internal `page` state). Real `src`
 * paginates SERVER-side instead (`submissionAttempt.pageNumber`/`limit` drive
 * `useQuerySubmissionAttemptsSwr`, which only ever returns ONE page's rows). This
 * connected file can only hand over that one server page at a time, so the
 * drawer's own pager currently re-paginates WITHIN a single server page rather
 * than walking the server's pages. Reconciling the two (e.g. adding controlled
 * `page`/`onPageChange` props to the blueprint) is out of this pilot's
 * two-file scope.
 */
export const SubmissionAttemptsDrawer = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const { isOpen, setOpen } = useSubmissionAttemptsOverlayState()
    const { open: openFeedbackDetails } = useFeedbackDetailsOverlayState()
    const { isMobile } = useSmViewpoint()

    const submissionAttempts = useAppSelector((state) => state.submissionAttempt.submissionAttempts)
    const selectedAttemptId = useAppSelector((state) => state.submissionAttempt.id)
    const activeChallengeSubmissionId = useAppSelector(
        (state) => state.submissionAttempt.activeChallengeSubmissionId,
    )
    const challengeSubmissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const config = useAppSelector((state) => state.system.config)

    const swr = useQuerySubmissionAttemptsSwr()
    const aiModelsSwr = useQueryAiModelsSwr()

    /** The requirement this drawer is currently scoped to — its `score` is the `maxScore` denominator. */
    const challengeSubmission = useMemo(
        () => challengeSubmissions?.find(
            (challengeSubmission) => challengeSubmission.id === activeChallengeSubmissionId,
        ),
        [challengeSubmissions, activeChallengeSubmissionId],
    )
    const maxScore = challengeSubmission?.score ?? null
    const passThreshold = config?.challenge?.passThreshold ?? 0

    /** Served-model id → tier category, resolved from the viewer's gradable-model list (same source `SubmissionResultHistoryDrawer` uses). */
    const modelCategoryMap = useMemo(() => {
        const map = new Map<string, RealAiModelCategory>()
        for (const model of aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []) {
            map.set(model.model, model.category)
        }
        return map
    }, [aiModelsSwr.data])

    const attempts = useMemo<Array<SubmissionAttemptRecord>>(
        () => submissionAttempts.map((attempt) => {
            const realCategory = attempt.servedModel ? modelCategoryMap.get(attempt.servedModel) : undefined
            return {
                id: attempt.id,
                attemptNumber: attempt.attemptNumber,
                score: attempt.score,
                maxScore,
                isPassing: passThreshold > 0 && maxScore != null && maxScore > 0
                    && (attempt.score ?? 0) >= passThreshold * maxScore,
                processedTimeAgo: attempt.processedAt
                    ? getTimeAgoLabel(getTimeAgoMessage(dayjs(attempt.processedAt)), t)
                    : undefined,
                gradedByModel: attempt.servedModel ?? undefined,
                modelCategory: realCategory != null ? toBlueprintModelCategory(realCategory) : undefined,
            }
        }),
        [submissionAttempts, maxScore, passThreshold, modelCategoryMap, t],
    )

    /**
     * Selecting a row surfaces that attempt's feedback details (the real "View
     * details" gesture) and — per the blueprint's own contract — closes this
     * drawer in the same tap.
     */
    const onSelect = (attemptId: string) => {
        dispatch(setSubmissionAttemptId(attemptId))
        openFeedbackDetails()
        setOpen(false)
    }

    return (
        <_SubmissionAttemptsDrawer
            isOpen={isOpen}
            onOpenChange={(open) => {
                setOpen(open)
                if (!open) {
                    dispatch(setActiveChallengeSubmissionId(undefined))
                }
            }}
            placement={isMobile ? "bottom" : "right"}
            attempts={attempts}
            selectedAttemptId={selectedAttemptId}
            onSelect={onSelect}
            isSkeleton={isOpen && swr.isLoading && submissionAttempts.length === 0}
            error={submissionAttempts.length === 0 ? swr.error : undefined}
            onRetry={() => { void swr.mutate() }}
            retryLabel={t("common.retry")}
        />
    )
}
