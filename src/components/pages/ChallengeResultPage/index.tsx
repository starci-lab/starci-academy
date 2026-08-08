"use client"

import React, { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useSubmissionAttemptsOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQuerySubmissionResultAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQuerySubmissionResultAttemptsSwr"
import { useQuerySubmissionResultFeedbacksSwr } from "@/hooks/swr/api/graphql/queries/useQuerySubmissionResultFeedbacksSwr"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { setActiveChallengeSubmissionId } from "@/redux/slices/submission-attempt"
import { resolveSearchResultHref } from "@/modules/learn/resolve-search-result-href"
import type { AiModelCategory as RealAiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { SubmissionAttempt } from "@/components/blocks/learn/SubmissionAttemptSelector"
import type { SubmissionFinding } from "@/components/blocks/learn/SubmissionFindingsList"
import type { ContentRelatedItem } from "@/components/blocks/learn/ContentRelatedList"
import { toBlueprintModelCategory, toBlueprintSeverity } from "@/modules/utils/challenge-result-map"
import { _ChallengeResultPage } from "./component"

/** Render up to this many attempt chips inline; beyond it, the newest few + a "+N" overflow trigger. */
const ATTEMPT_CHIPS_MAX = 6
/** When overflowing, how many newest chips stay visible (the rest collapse into the "+N" pill). */
const ATTEMPT_CHIPS_VISIBLE = 5
/** How many of the top-severity findings feed the auto-built related-reading query. */
const RELATED_QUERY_FINDINGS = 3
/** Max related-reading rows shown. */
const RELATED_ITEMS_LIMIT = 3

/**
 * The challenge grading-result screen — the CONNECTED half of `ChallengeResultPage`.
 * Reads `?submission=<requirementId>` (the `ChallengeSubmissionEntity` id) and
 * `?attempt=<id>` (defaults to the newest attempt), fetches that requirement's
 * attempts and the selected attempt's findings, resolves the served-model → tier
 * map, auto-builds a "related reading" search query from the top failing findings,
 * and hands fully-typed, already-resolved props to the presentational
 * {@link _ChallengeResultPage}.
 *
 * src twin of `.storybook/components/starci/pages/ChallengeResultPage/ChallengeResultPage.tsx`,
 * wired to the same v1 data source as `@/components/features/learn/Challenge/SubmissionResult`
 * (`/src/app/[locale]/.../challenges/[challengeId]/result/page.tsx`).
 *
 * DEVIATION FROM THE STORYBOOK SOURCE (see `component.tsx`'s header for the full
 * reasoning): the storybook page's `isHistoryOpen`/`onHistoryOpenChange`/
 * `historyAttempts` props have no counterpart here. The full-history surface is
 * `@/components/overlays/drawers/SubmissionAttemptsDrawer`, already mounted globally by
 * `DrawerContainer` (`InnerLayout`) and driven entirely by zustand overlay state
 * — `onOverflowPress` below only has to scope that existing global drawer to this
 * requirement and open it, never render it itself.
 */
export const ChallengeResultPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const { setOpen: setHistoryOpen } = useSubmissionAttemptsOverlayState()

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
    const attempts = useMemo(() => attemptsSwr.data?.data ?? [], [attemptsSwr.data])
    // newest attempt is first (sorted attemptNumber DESC); honour `?attempt=` when present
    const selectedAttempt = useMemo(
        () => (attemptParam ? attempts.find((attempt) => attempt.id === attemptParam) : undefined) ?? attempts[0],
        [attempts, attemptParam],
    )

    const feedbacksSwr = useQuerySubmissionResultFeedbacksSwr(selectedAttempt?.id)
    const feedbacks = useMemo(() => feedbacksSwr.data?.data ?? [], [feedbacksSwr.data])

    // model catalog → map every served model id to its cost/quality tier
    const aiModelsSwr = useQueryAiModelsSwr()
    const modelCategoryMap = useMemo(() => {
        const map = new Map<string, RealAiModelCategory>()
        for (const model of aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []) {
            map.set(model.model, model.category)
        }
        return map
    }, [aiModelsSwr.data])
    const servedCategory = selectedAttempt?.servedModel ? modelCategoryMap.get(selectedAttempt.servedModel) : undefined

    // findings sorted high → low, then by their own authored order — same rank
    // table `SubmissionFindingsList` re-derives itself, kept here only to build
    // the related-reading query from the TOP findings.
    const severityRank: Record<string, number> = { high: 0, medium: 1, low: 2 }
    const sortedFeedbacks = useMemo(
        () => [...feedbacks].sort((a, b) => {
            const rankDiff = (severityRank[a.severity] ?? 1) - (severityRank[b.severity] ?? 1)
            return rankDiff !== 0 ? rankDiff : (a.sortIndex ?? 0) - (b.sortIndex ?? 0)
        }),
        [feedbacks],
    )

    // Verdict against the requirement's pass threshold. Guard the threshold/maxScore:
    // while system config is still loading (passThreshold=0) or a requirement has no
    // max, `0 >= 0` would falsely mark every attempt as passed — treat an unknown
    // threshold as NOT passing.
    const isPassingScore = (score: number | null) =>
        passThreshold > 0 && maxScore > 0 && (score ?? 0) >= passThreshold * maxScore
    const isPassing = selectedAttempt ? isPassingScore(selectedAttempt.score) : false
    const passScore = maxScore > 0 ? Math.ceil(passThreshold * maxScore) : undefined
    const timeAgo = selectedAttempt?.processedAt
        ? getTimeAgoLabel(getTimeAgoMessage(dayjs(selectedAttempt.processedAt)), t)
        : undefined

    // related reading — auto-built from the top failing findings' own text, only
    // while the selected attempt failed (mirrors v1 `RelatedContentList` call site)
    const failingFindingsQuery = useMemo(
        () => sortedFeedbacks.slice(0, RELATED_QUERY_FINDINGS).map((feedback) => feedback.message).join(" "),
        [sortedFeedbacks],
    )
    const relatedEnabled = Boolean(selectedAttempt) && !isPassing && Boolean(failingFindingsQuery.trim())
    const relatedSwr = useQuerySearchCourseContentSwr(courseId ?? null, failingFindingsQuery, relatedEnabled)
    const relatedItems: Array<ContentRelatedItem> = useMemo(() => {
        if (!relatedEnabled || !courseDisplayId) {
            return []
        }
        return (relatedSwr.data ?? [])
            .slice(0, RELATED_ITEMS_LIMIT)
            .flatMap((item) => {
                const href = resolveSearchResultHref(item, locale, courseDisplayId)
                if (!href) {
                    return []
                }
                return [{
                    key: `${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? item.title}`,
                    title: item.title,
                    breadcrumb: item.breadcrumb ?? undefined,
                    isLocked: item.isLocked,
                    href,
                }]
            })
    }, [relatedEnabled, relatedSwr.data, locale, courseDisplayId])

    // chip strip: show up to ATTEMPT_CHIPS_MAX; beyond that, the newest few + a
    // "+N" trigger that opens the app's global submission-history drawer
    const isOverflow = attempts.length > ATTEMPT_CHIPS_MAX
    const visibleAttempts = isOverflow ? attempts.slice(0, ATTEMPT_CHIPS_VISIBLE) : attempts
    const overflowCount = attempts.length - visibleAttempts.length
    const attemptRows: Array<SubmissionAttempt> = visibleAttempts.map((attempt) => ({
        id: attempt.id,
        attemptNumber: attempt.attemptNumber,
        score: attempt.score,
        isPassing: isPassingScore(attempt.score),
    }))

    const findingRows: Array<SubmissionFinding> = sortedFeedbacks.map((feedback) => ({
        id: feedback.id,
        message: feedback.message,
        detail: feedback.detail ?? undefined,
        suggestion: feedback.suggestion ?? undefined,
        location: feedback.location ?? undefined,
        severity: toBlueprintSeverity(feedback.severity),
        sortIndex: feedback.sortIndex,
    }))

    /** Back to the challenge solve page (strip the trailing `/result`). */
    const challengeHref = pathname.replace(/\/result\/?$/, "")
    /** URL that selects a given attempt on this result page. */
    const attemptHref = (id: string) => `${pathname}?submission=${challengeSubmissionId}&attempt=${id}`

    const attemptsLoading = attemptsSwr.data == null ? !attemptsSwr.error : false
    const feedbacksLoading = feedbacksSwr.data == null ? !feedbacksSwr.error : false

    return (
        <_ChallengeResultPage
            backLabel={t("submissionResult.backToChallenge")}
            onBack={() => router.push(challengeHref)}
            title={requirement?.title ?? t("submissionResult.title")}
            description={requirement?.description || undefined}
            attempts={attemptRows}
            selectedAttemptId={selectedAttempt?.id}
            onSelectAttempt={(id) => router.push(attemptHref(id))}
            attemptsAriaLabel={t("submissionResult.history")}
            overflowCount={overflowCount}
            onOverflowPress={() => {
                if (challengeSubmissionId) {
                    dispatch(setActiveChallengeSubmissionId(challengeSubmissionId))
                }
                setHistoryOpen(true)
            }}
            isAttemptsLoading={attemptsLoading}
            isAttemptsEmpty={!attemptsLoading && attempts.length === 0}
            attemptsError={attempts.length === 0 ? attemptsSwr.error : undefined}
            onRetryAttempts={() => { void attemptsSwr.mutate() }}
            retryAttemptsLabel={t("submissionResult.retry")}
            scoreLabel={t("submissionResult.resultLabel")}
            score={selectedAttempt?.score ?? undefined}
            maxScore={maxScore > 0 ? maxScore : undefined}
            isPassing={isPassing}
            passScore={passScore}
            shortFeedback={selectedAttempt?.shortFeedback ?? undefined}
            submissionUrl={selectedAttempt?.submissionUrl}
            submissionLabel={t("submissionAttempts.viewSubmission")}
            gradedByModel={selectedAttempt?.servedModel ?? undefined}
            modelCategory={servedCategory != null ? toBlueprintModelCategory(servedCategory) : undefined}
            timeAgo={timeAgo}
            findingsLabel={t("submissionResult.feedbackLabel")}
            findings={findingRows}
            repositoryUrl={selectedAttempt?.submissionUrl}
            isFindingsLoading={feedbacksLoading}
            isFindingsEmpty={!feedbacksLoading && feedbacks.length === 0}
            findingsError={feedbacks.length === 0 ? feedbacksSwr.error : undefined}
            onRetryFindings={() => { void feedbacksSwr.mutate() }}
            retryFindingsLabel={t("submissionResult.retry")}
            relatedItems={relatedItems}
            relatedLabel={t("submissionResult.relatedContent.label")}
        />
    )
}

export default ChallengeResultPage
