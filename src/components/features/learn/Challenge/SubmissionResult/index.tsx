"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { useQuerySubmissionResultAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQuerySubmissionResultAttemptsSwr"
import { useQuerySubmissionResultFeedbacksSwr } from "@/hooks/swr/api/graphql/queries/useQuerySubmissionResultFeedbacksSwr"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useAppSelector } from "@/redux/hooks"
import { SubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { SubmissionAttemptEntity } from "@/modules/types/entities/submission-attempt"
import type { SubmissionFeedbackEntity } from "@/modules/types/entities/submission-feedback"
import { _SubmissionResult } from "./component"

/**
 * Severity rank used to sort findings worst-first. A separate table from the presentational
 * half's `SEVERITY_VISUAL` (icon + tone) — this file only needs the ORDER, not the glyph.
 */
const SEVERITY_RANK: Record<SubmissionFeedbackSeverity, number> = {
    [SubmissionFeedbackSeverity.High]: 0,
    [SubmissionFeedbackSeverity.Medium]: 1,
    [SubmissionFeedbackSeverity.Low]: 2,
}

/**
 * Challenge-result page — the CONNECTED half of `SubmissionResult`: reads `?submission=`
 * (requirement) + `?attempt=` (defaults newest), fetches the attempt list + the selected
 * attempt's feedback + the AI model catalog, computes both async regions' `isSkeleton`/`isEmpty`
 * from the first-load formula ("first load, nothing in hand"), and resolves every label. See
 * `design/storybook/architecture/tiers/split.md`.
 */
export const SubmissionResult = () => {
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const challengeSubmissionId = searchParams.get("submission")
    const attemptParam = searchParams.get("attempt")

    const config = useAppSelector((state) => state.system.config)
    const passThreshold = config?.challenge?.passThreshold ?? 0
    const courseId = useAppSelector((state) => state.course.id)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const challengeSubmissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const requirement = useMemo(
        () => (challengeSubmissions ?? []).find((submission) => submission.id === challengeSubmissionId),
        [challengeSubmissions, challengeSubmissionId],
    )
    const maxScore = requirement?.score ?? 0

    const attemptsSwr = useQuerySubmissionResultAttemptsSwr(challengeSubmissionId)
    const rawAttempts = useMemo<Array<SubmissionAttemptEntity>>(
        () => attemptsSwr.data?.data ?? [],
        [attemptsSwr.data],
    )
    // newest attempt is first (sorted attemptNumber DESC); honour `?attempt=` when present
    const selectedAttemptEntity = useMemo(
        () => (attemptParam ? rawAttempts.find((attempt) => attempt.id === attemptParam) : undefined) ?? rawAttempts[0],
        [rawAttempts, attemptParam],
    )

    const feedbacksSwr = useQuerySubmissionResultFeedbacksSwr(selectedAttemptEntity?.id)
    const feedbacks = useMemo<Array<SubmissionFeedbackEntity>>(
        () => feedbacksSwr.data?.data ?? [],
        [feedbacksSwr.data],
    )

    // model catalog → map every served model id to its cost/quality tier (chip)
    const aiModelsSwr = useQueryAiModelsSwr()
    const modelCategoryMap = useMemo(() => {
        const map = new Map<string, AiModelCategory>()
        for (const model of aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []) {
            map.set(model.model, model.category)
        }
        return map
    }, [aiModelsSwr.data])

    // findings sorted by severity (high → low), then by their stored order
    const sortedFeedbacks = useMemo(
        () => [...feedbacks].sort((a, b) => {
            const rankDiff = (SEVERITY_RANK[a.severity] ?? 1) - (SEVERITY_RANK[b.severity] ?? 1)
            return rankDiff !== 0 ? rankDiff : (a.sortIndex ?? 0) - (b.sortIndex ?? 0)
        }),
        [feedbacks],
    )

    /** Back to the challenge solve page (strip the trailing /result). */
    const challengeHref = pathname.replace(/\/result\/?$/, "")
    /** URL that selects a given attempt on this result page. */
    const attemptHref = (id: string) => `${pathname}?submission=${challengeSubmissionId}&attempt=${id}`

    /** Minimum score needed to pass (for the verdict sub-line). */
    const passScore = Math.ceil(passThreshold * maxScore)

    // Already-i18n'd "Attempt {n}" per button — resolved here so the presentational half never
    // reaches for `t()` (split.md: i18n is data, it lives beside the fetch).
    const attemptItems = useMemo(
        () => rawAttempts.map((attempt) => ({
            id: attempt.id,
            score: attempt.score,
            label: t("submissionAttempts.attemptLine", { number: attempt.attemptNumber }),
        })),
        [rawAttempts, t],
    )

    const servedCategory = selectedAttemptEntity?.servedModel ? modelCategoryMap.get(selectedAttemptEntity.servedModel) : undefined
    const timeAgo = selectedAttemptEntity?.processedAt
        ? getTimeAgoLabel(getTimeAgoMessage(dayjs(selectedAttemptEntity.processedAt)), t)
        : null

    return (
        <_SubmissionResult
            onBackPress={() => router.push(challengeHref)}
            title={requirement?.title ?? t("submissionResult.title")}
            description={requirement?.description || undefined}
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            attemptsIsSkeleton={!attemptsSwr.data && !attemptsSwr.error}
            attemptsIsEmpty={rawAttempts.length === 0}
            // error beats skeleton + empty; only a settled fetch error (nothing in hand) reaches the block
            attemptsError={!attemptsSwr.data ? attemptsSwr.error : undefined}
            onRetryAttempts={() => { void attemptsSwr.mutate() }}
            attempts={attemptItems}
            selectedAttemptId={selectedAttemptEntity?.id}
            onSelectAttempt={(id) => router.push(attemptHref(id))}
            maxScore={maxScore}
            passThreshold={passThreshold}
            selectedAttempt={selectedAttemptEntity ? {
                id: selectedAttemptEntity.id,
                score: selectedAttemptEntity.score,
                shortFeedback: selectedAttemptEntity.shortFeedback,
                submissionUrl: selectedAttemptEntity.submissionUrl,
                servedModel: selectedAttemptEntity.servedModel,
                servedCategory,
                timeAgo,
            } : undefined}
            feedbacksIsSkeleton={!feedbacksSwr.data && !feedbacksSwr.error}
            feedbacksError={!feedbacksSwr.data ? feedbacksSwr.error : undefined}
            onRetryFeedbacks={() => { void feedbacksSwr.mutate() }}
            feedbacks={sortedFeedbacks}
            courseId={courseId}
            courseDisplayId={courseDisplayId}
            rawAttempts={rawAttempts}
            modelCategoryMap={modelCategoryMap}
            labels={{
                backToChallenge: t("submissionResult.backToChallenge"),
                attempts: t("submissionResult.attempts"),
                history: t("submissionResult.history"),
                emptyAttemptsTitle: t("submissionResult.emptyAttempts"),
                emptyAttemptsDescription: t("submissionResult.emptyAttemptsHint"),
                error: t("submissionResult.error"),
                retry: t("submissionResult.retry"),
                resultLabel: t("submissionResult.resultLabel"),
                passed: t("submissionResult.passed"),
                failed: t("submissionResult.failed"),
                passNeeded: passScore > 0 ? t("submissionResult.passNeeded", { score: passScore }) : undefined,
                viewSubmission: t("submissionAttempts.viewSubmission"),
                feedbackLabel: t("submissionResult.feedbackLabel"),
                noFeedback: t("submissionResult.noFeedback"),
                relatedContentLabel: t("submissionResult.relatedContent.label"),
            }}
        />
    )
}

export default SubmissionResult
