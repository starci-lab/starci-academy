"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
    useFormatter,
    useLocale,
    useTranslations,
} from "next-intl"
import {
    usePathname,
    useParams,
    useRouter,
} from "next/navigation"
import { useRouter as useLocaleRouter } from "@/i18n/navigation"
import {
    _ChallengePage,
    type ChallengeBriefOutputItem,
    type ChallengeBriefPrerequisiteItem,
    type ChallengeBriefRequirementItem,
    type ChallengeBriefStepItem,
    type ChallengeDeliverableItem,
    type ChallengeDifficulty as BlockChallengeDifficulty,
    type ChallengeStatus as BlockChallengeStatus,
} from "./component"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setChallengeId, setChallengeSubmissionJobId } from "@/redux/slices/challenge"
import { useChallengeOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useEditSubmissionForm } from "@/hooks/rhf/useEditSubmissionForm"
import { useJobNotificationsSocketIo } from "@/hooks/socketio/useJobNotificationsSocketIo"
import { useMutateSubmitChallengeSubmissionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSubmitChallengeSubmissionSwr"
import { PublicationEvent } from "@/hooks/socketio/enums/publication-event"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { resolveChallengeSubmissionJobEnvelope } from "@/components/utils/challenge-submission-job"
import { JobCategory } from "@/modules/types/enums/job-category"
import { JobStatus } from "@/modules/types/enums/job-status"
import { ChallengeDifficulty } from "@/modules/types/enums/challenge-difficulty"
import {
    listChallengeProgrammingLangs,
    resolveChallengeSectionRows,
} from "@/modules/types/utils/challenge-section"
import { resolveActiveProgrammingLang } from "@/modules/types/utils/programming-language"

/**
 * Backend `JobStatus` enum → the block's string-literal `jobStatus` union. The two
 * are spelled the same (see the block's own doc) but a string enum is not directly
 * assignable to its literal equivalents, so the mapping is explicit.
 */
const JOB_STATUS_MAP: Record<JobStatus, NonNullable<ChallengeDeliverableItem["jobStatus"]>> = {
    [JobStatus.Queued]: "queued",
    [JobStatus.Processing]: "processing",
    [JobStatus.Completed]: "completed",
    [JobStatus.Failed]: "failed",
}

/**
 * `ChallengePage` — the CONNECTED half of the SRC TWIN. Mirrors the data wiring
 * already proven across the v1 trio in `src/components/features/learn/Challenge`
 * (`ChallengePage` host + `ChallengeView` read column + `ChallengeSubmissionPanel`
 * submission stack) onto the storybook-driven block tree in `./component`
 * instead of that v1's hand-built markup — same route
 * (`…/challenges/[challengeId]`, NOT swapped here), same redux/SWR sources.
 *
 * STAGED TWIN: this connected component is ported but not yet mounted — the route
 * still renders the v1 `ChallengePage`. Wiring is deferred debt
 * (`src-tier-ported-but-unused`), matching batches 1–16.
 *
 * On mount it sets the active challenge id (the singleton SWR in `SwrSideEffects`
 * then hydrates `challenge.entity` + submissions into redux) and flips the shared
 * `challenge` overlay flag on — `useEditSubmissionForm` keys its auto-save gate off
 * that flag — clearing it on unmount. The read column (header + brief + score) is
 * lifted from `ChallengeView`; the `deliverables` submission rows are lifted from
 * `ChallengeSubmissionPanel` (URL edit via `useEditSubmissionForm`, submit via the
 * submit mutation + a live job-notification subscription, per-row job status from
 * the socket slice). The programming-language SELECTOR is NOT ported — the storybook
 * screen folds it into a grading-settings drawer that is not built this pass
 * (`onOpenGradingSettings` is a chrome trigger only) — so content resolves at the
 * default active language.
 */
export const ChallengePage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const format = useFormatter()
    const localeRouter = useLocaleRouter()
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const dispatch = useAppDispatch()
    const { setOpen } = useChallengeOverlayState()

    const challengeId = params.challengeId as string | undefined
    const courseId = params.courseId as string | undefined
    const moduleId = params.moduleId as string | undefined
    const contentId = params.contentId as string | undefined

    // Bootstrap the active challenge (same as the v1 host): the singleton SWR resolves
    // `challenge.entity` + submissions off this id, and the overlay flag arms the
    // submission auto-save gate while the page is mounted.
    useEffect(() => {
        if (!challengeId) {
            return undefined
        }
        dispatch(setChallengeId(challengeId))
        setOpen(true)
        return () => setOpen(false)
    }, [challengeId, dispatch, setOpen])

    // --- redux sources (lifted from ChallengeView + ChallengeSubmissionPanel) ---
    const challenge = useAppSelector((state) => state.challenge.entity)
    const completionTasks = useAppSelector((state) => state.challenge.completionTasks)
    const config = useAppSelector((state) => state.system.config)
    const loadingChallengeSubmissionIds = useAppSelector(
        (state) => state.challenge.loadingChallengeSubmissionIds,
    )
    const submissionIdToJobId = useAppSelector((state) => state.challenge.submissionIdToJobId)
    const aiProcessingData = useAppSelector((state) => state.modal.aiProcessingData)
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)

    const passThreshold = config?.challenge?.passThreshold ?? 0

    // Content resolves at the default active language (no selector in this twin — see file header).
    const langs = useMemo(() => listChallengeProgrammingLangs(challenge), [challenge])
    const activeLang = useMemo(() => resolveActiveProgrammingLang(null, langs), [langs])

    // --- read column: brief sections resolved for the active language ---
    const prerequisites = useMemo<Array<ChallengeBriefPrerequisiteItem>>(
        () => resolveChallengeSectionRows(challenge?.prerequisites, activeLang)
            .filter((row) => row.body.trim().length > 0)
            .map((row, index) => ({ key: `prereq-${index}`, body: row.body })),
        [challenge?.prerequisites, activeLang],
    )
    const requirements = useMemo<Array<ChallengeBriefRequirementItem>>(
        () => resolveChallengeSectionRows(challenge?.requirements, activeLang)
            .map((row, index) => ({
                key: `req-${index}`,
                title: row.title,
                points: row.score,
                body: row.body,
            })),
        [challenge?.requirements, activeLang],
    )
    const steps = useMemo<Array<ChallengeBriefStepItem>>(
        () => resolveChallengeSectionRows(challenge?.steps, activeLang)
            .map((row, index) => ({ key: `step-${index}`, title: row.title, body: row.body })),
        [challenge?.steps, activeLang],
    )
    const outputs = useMemo<Array<ChallengeBriefOutputItem>>(
        () => resolveChallengeSectionRows(challenge?.outputs, activeLang)
            .filter((row) => row.body.trim().length > 0)
            .map((row, index) => ({ key: `output-${index}`, body: row.body })),
        [challenge?.outputs, activeLang],
    )
    const hint = challenge?.hint?.trim() ?? ""

    // --- challenge identity: score, difficulty, learner status ---
    const challengeProgress = useMemo(
        () => completionTasks.find((task) => task.id === challenge?.id) ?? null,
        [completionTasks, challenge?.id],
    )
    const earnedScore = challengeProgress?.lastScore ?? 0
    const maxScore = challengeProgress?.maxScore ?? challenge?.score ?? 0

    const difficulty = useMemo<BlockChallengeDifficulty>(() => {
        switch (challenge?.difficulty) {
        case ChallengeDifficulty.Medium:
            return "medium"
        case ChallengeDifficulty.Hard:
        case ChallengeDifficulty.Insane:
        case ChallengeDifficulty.Expert:
            return "hard"
        case ChallengeDifficulty.Easy:
        default:
            return "easy"
        }
    }, [challenge?.difficulty])

    // ChallengeProgressStatus ("notStarted" | "inProgress" | "failed" | "completed") →
    // the block's status ("completed" | "failed" | "inProgress"); "notStarted" ⇒ no chip.
    const status = useMemo<BlockChallengeStatus | undefined>(() => {
        switch (challengeProgress?.status) {
        case "completed":
            return "completed"
        case "failed":
            return "failed"
        case "inProgress":
            return "inProgress"
        default:
            return undefined
        }
    }, [challengeProgress?.status])

    // --- act column: live submission rows (lifted from ChallengeSubmissionPanel) ---
    const formik = useEditSubmissionForm()
    const {
        values,
        errors,
        touched,
        setFieldValue,
        isSubmitting,
    } = formik
    const runGraphQL = useGraphQLWithToast()
    const submitChallengeSubmissionSwr = useMutateSubmitChallengeSubmissionSwr()
    const jobNotificationsSocket = useJobNotificationsSocketIo()

    /** Active AI-processing job id for the challenge-submit flow, from the modal state. */
    const modalJobId = useMemo(
        () => aiProcessingData?.category === JobCategory.SubmitChallenge
            ? aiProcessingData.jobId
            : undefined,
        [aiProcessingData],
    )

    /** Submit one row's URL for grading, then subscribe to its live job notifications. */
    const onSubmitRow = useCallback(
        async (submissionId: string, index: number) => {
            const url = values.submissions?.[index]?.userSubmission?.submissionUrl?.trim()
            if (!url) {
                return
            }
            await runGraphQL(
                async () => {
                    const response = await submitChallengeSubmissionSwr.trigger({
                        challengeSubmissionId: submissionId,
                        githubUrl: url,
                        // language selector deferred (chrome-only drawer); backend falls back to the stored lang
                        lang: activeLang,
                    })
                    const result = response.data?.submitChallengeSubmission
                    if (!result) {
                        throw new Error(response.error?.message)
                    }
                    const newJobId = result.data?.jobId
                    if (newJobId) {
                        dispatch(setChallengeSubmissionJobId({ submissionId, jobId: newJobId }))
                        jobNotificationsSocket.emit(
                            PublicationEvent.SubscribeJobNotification,
                            { data: { jobId: newJobId }, locale },
                        )
                    }
                    return result
                },
                { showSuccessToast: true, showErrorToast: true },
            )
        },
        [
            submitChallengeSubmissionSwr,
            values.submissions,
            dispatch,
            jobNotificationsSocket,
            locale,
            activeLang,
            runGraphQL,
        ],
    )

    /** Navigate to the dedicated result page for one requirement's attempts. */
    const onViewHistory = useCallback(
        (submissionId: string) => {
            router.push(`${pathname}/result?submission=${submissionId}`)
        },
        [router, pathname],
    )

    const deliverables = useMemo<Array<ChallengeDeliverableItem>>(() => {
        const submissions = [...(values.submissions ?? [])].sort(
            (prev, next) => prev.sortIndex - next.sortIndex,
        )
        return submissions.map((submission) => {
            const index = values.submissions?.findIndex((candidate) => candidate.id === submission.id) ?? -1
            const rowMaxScore = submission.score ?? 0
            const lastAttempt = submission.userSubmission?.lastAttempt
            const lastScore = lastAttempt?.score ?? 0

            // status: passed the per-row threshold ⇒ done; attempted but below ⇒ failed; never ⇒ todo.
            const rowStatus: ChallengeDeliverableItem["status"] = !lastAttempt
                ? "todo"
                : lastScore >= rowMaxScore * passThreshold
                    ? "done"
                    : "failed"

            // touched-gated URL error (an i18n key from the form → localized here).
            const rawError = errors.submissions?.[index]?.userSubmission?.submissionUrl
            const isTouched = Boolean(touched.submissions?.[index]?.userSubmission?.submissionUrl)
            const urlError = isTouched && typeof rawError === "string" ? t(rawError) : undefined

            // live per-row job status off the socket slice + any active submit-flow job error.
            const jobEnvelope = resolveChallengeSubmissionJobEnvelope(
                submission.id,
                submissionIdToJobId,
                jobStatusByJobId,
            )
            const rowJobStatus = jobEnvelope?.data?.status
            const rowSubmitJobId = submissionIdToJobId[submission.id]
            const activeJobId = modalJobId && rowSubmitJobId && modalJobId === rowSubmitJobId
                ? modalJobId
                : undefined
            const jobError = activeJobId ? jobStatusByJobId[activeJobId]?.data?.error : undefined
            const isBusy = rowJobStatus === JobStatus.Queued || rowJobStatus === JobStatus.Processing

            const graded: ChallengeDeliverableItem["graded"] = lastAttempt != null
                ? {
                    verdict: lastScore >= rowMaxScore * passThreshold ? "pass" : "fail",
                    earnedScore: lastScore,
                    requiredScore: Math.ceil(rowMaxScore * passThreshold),
                    attemptNumber: lastAttempt.attemptNumber,
                    processedAt: lastAttempt.processedAt != null
                        ? format.dateTime(new Date(lastAttempt.processedAt), {
                            dateStyle: "short",
                            timeStyle: "short",
                        })
                        : undefined,
                    shortFeedback: lastAttempt.shortFeedback ?? undefined,
                }
                : undefined

            return {
                id: submission.id,
                title: submission.title,
                points: rowMaxScore,
                status: rowStatus,
                description: submission.description ?? undefined,
                url: values.submissions?.[index]?.userSubmission?.submissionUrl ?? "",
                urlError,
                onUrlChange: (value: string) => setFieldValue(
                    `submissions.${index}.userSubmission.submissionUrl`,
                    value,
                ),
                onSubmit: () => void onSubmitRow(submission.id, index),
                isPending: isSubmitting || isBusy || loadingChallengeSubmissionIds.includes(submission.id),
                jobStatus: rowJobStatus != null ? JOB_STATUS_MAP[rowJobStatus] : undefined,
                jobError: rowJobStatus === JobStatus.Failed ? jobError : undefined,
                onViewHistory: () => onViewHistory(submission.id),
                graded,
            }
        })
    }, [
        values.submissions,
        errors.submissions,
        touched.submissions,
        passThreshold,
        submissionIdToJobId,
        jobStatusByJobId,
        modalJobId,
        isSubmitting,
        loadingChallengeSubmissionIds,
        format,
        t,
        setFieldValue,
        onSubmitRow,
        onViewHistory,
    ])

    /** Back to the owning lesson (falls back to history when params are missing). */
    const onBackPress = useCallback(() => {
        if (courseId && moduleId && contentId) {
            localeRouter.push(
                `/courses/${courseId}/learn/content/modules/${moduleId}/contents/${contentId}`,
            )
            return
        }
        localeRouter.back()
    }, [courseId, moduleId, contentId, localeRouter])

    /**
     * Grading-settings drawer is not built this pass (the storybook screen folds the
     * language selector + private-repo token into it) — chrome trigger only.
     */
    const onOpenGradingSettings = useCallback(() => undefined, [])

    /** First load: the challenge entity has not hydrated into redux yet. */
    const isFirstLoad = !challenge

    return (
        <_ChallengePage
            onBackPress={onBackPress}
            backLabel={t("challenge.back")}
            title={challenge?.title ?? ""}
            description={challenge?.description || undefined}
            scoreValue={challenge?.score}
            difficulty={difficulty}
            status={status}
            prerequisites={prerequisites}
            requirements={requirements}
            steps={steps}
            outputs={outputs}
            hint={hint}
            deliverables={deliverables}
            onOpenGradingSettings={onOpenGradingSettings}
            earnedScore={earnedScore}
            maxScore={maxScore}
            passThreshold={passThreshold}
            isSkeleton={isFirstLoad}
        />
    )
}
