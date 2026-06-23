"use client"

import React, { useMemo } from "react"
import {
    Chip,
    Link,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import {
    ArrowLeftIcon,
    ArrowSquareOutIcon,
} from "@phosphor-icons/react"
import {
    AsyncContent,
    Skeleton,
} from "@/components/blocks"
import { FeedbackCard } from "@/components/modals/FeedbackDetailsModal/FeedbackCard"
import {
    useQuerySubmissionResultAttemptsSwr,
    useQuerySubmissionResultFeedbacksSwr,
} from "@/hooks"
import { useAppSelector } from "@/redux"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { SubmissionFeedbackSeverity } from "@/modules/types"
import type {
    SubmissionAttemptEntity,
    SubmissionFeedbackEntity,
    WithClassNames,
} from "@/modules/types"

/** Props for {@link SubmissionResult}. */
export type SubmissionResultProps = WithClassNames<undefined>

/** Severity groups in descending urgency — drives the section order. */
const SEVERITY_GROUPS: ReadonlyArray<{ severity: SubmissionFeedbackSeverity, tone: "danger" | "warning" | "default", key: string }> = [
    { severity: SubmissionFeedbackSeverity.High, tone: "danger", key: "high" },
    { severity: SubmissionFeedbackSeverity.Medium, tone: "warning", key: "medium" },
    { severity: SubmissionFeedbackSeverity.Low, tone: "default", key: "low" },
]

/**
 * Dedicated challenge-result page (replaces the drawer → modal stack). A master rail
 * of attempts on the left; on the right the selected attempt's verdict + score +
 * artifact link, its one-line summary, and the feedback grouped by severity. Reads
 * the requirement id from `?submission=` and the chosen attempt from `?attempt=`
 * (defaults to the newest). Reuses the shared {@link FeedbackCard}.
 *
 * @param props - optional root className (placement only).
 */
export const SubmissionResult = ({
    className,
}: SubmissionResultProps) => {
    const t = useTranslations()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const challengeSubmissionId = searchParams.get("submission")
    const attemptParam = searchParams.get("attempt")

    const config = useAppSelector((state) => state.system.config)
    const passThreshold = config?.challenge?.passThreshold ?? 0
    const challengeSubmissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const requirement = useMemo(
        () => (challengeSubmissions ?? []).find((submission) => submission.id === challengeSubmissionId),
        [challengeSubmissions, challengeSubmissionId],
    )
    const maxScore = requirement?.score ?? 0

    const attemptsSwr = useQuerySubmissionResultAttemptsSwr(challengeSubmissionId)
    const attempts = useMemo<Array<SubmissionAttemptEntity>>(
        () => attemptsSwr.data?.data ?? [],
        [attemptsSwr.data],
    )
    // newest attempt is first (sorted attemptNumber DESC); honour `?attempt=` when present
    const selectedAttempt = useMemo(
        () => (attemptParam ? attempts.find((attempt) => attempt.id === attemptParam) : undefined) ?? attempts[0],
        [attempts, attemptParam],
    )

    const feedbacksSwr = useQuerySubmissionResultFeedbacksSwr(selectedAttempt?.id)
    const feedbacks = useMemo<Array<SubmissionFeedbackEntity>>(
        () => feedbacksSwr.data?.data ?? [],
        [feedbacksSwr.data],
    )

    /** Back to the challenge solve page (strip the trailing /result). */
    const challengeHref = pathname.replace(/\/result\/?$/, "")

    /** Verdict for a score against the requirement's pass threshold. */
    const isPassing = (score: number | null) => (score ?? 0) >= passThreshold * maxScore
    const scoreLabel = (score: number | null) => (maxScore > 0 ? `${score ?? 0}/${maxScore}` : `${score ?? 0}`)

    return (
        <div className={cn("mx-auto flex w-full max-w-5xl flex-col gap-6 p-6", className)}>
            <Link
                onPress={() => router.push(challengeHref)}
                className="flex w-fit items-center gap-2 text-sm text-muted"
            >
                <ArrowLeftIcon aria-hidden focusable="false" className="size-5" />
                {t("submissionResult.backToChallenge")}
            </Link>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* master rail — the attempts (newest first); select to view */}
                <aside className="flex shrink-0 flex-col gap-2 lg:w-64">
                    <Typography type="body-xs" color="muted" className="uppercase">
                        {t("submissionResult.attempts")}
                    </Typography>
                    <AsyncContent
                        isLoading={attemptsSwr.data === null || attemptsSwr.data === undefined ? !attemptsSwr.error : false}
                        skeleton={(
                            <div className="flex flex-col gap-2">
                                {[0, 1].map((row) => (
                                    <Skeleton key={row} className="h-16 w-full rounded-xl" />
                                ))}
                            </div>
                        )}
                        isEmpty={attempts.length === 0}
                        emptyContent={{
                            title: t("submissionResult.emptyAttempts"),
                            description: t("submissionResult.emptyAttemptsHint"),
                        }}
                        error={!attemptsSwr.data ? attemptsSwr.error : undefined}
                        errorContent={{
                            title: t("submissionResult.error"),
                            onRetry: () => { void attemptsSwr.mutate() },
                            retryLabel: t("submissionResult.retry"),
                        }}
                    >
                        {attempts.map((attempt) => {
                            const active = attempt.id === selectedAttempt?.id
                            return (
                                <button
                                    key={attempt.id}
                                    type="button"
                                    onClick={() => router.push(`${pathname}?submission=${challengeSubmissionId}&attempt=${attempt.id}`)}
                                    className={cn(
                                        "flex cursor-pointer flex-col gap-1 rounded-xl border border-default bg-surface p-3 text-start transition-colors hover:border-accent",
                                        active && "border-accent bg-accent/5",
                                    )}
                                >
                                    <Typography type="body-sm" weight="semibold">
                                        {t("submissionAttempts.attemptLine", { number: attempt.attemptNumber })}
                                    </Typography>
                                    <Typography type="body-xs" className={isPassing(attempt.score) ? "text-success" : "text-danger"}>
                                        {`${scoreLabel(attempt.score)} · ${t(isPassing(attempt.score) ? "submissionResult.passed" : "submissionResult.failed")}`}
                                    </Typography>
                                </button>
                            )
                        })}
                    </AsyncContent>
                </aside>

                {/* detail — verdict + score + artifact + summary + severity-grouped feedback */}
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    {selectedAttempt ? (
                        <>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Chip color={isPassing(selectedAttempt.score) ? "success" : "danger"} size="sm" variant="soft">
                                            <Chip.Label>
                                                {`${t(isPassing(selectedAttempt.score) ? "submissionResult.passed" : "submissionResult.failed")} · ${scoreLabel(selectedAttempt.score)}`}
                                            </Chip.Label>
                                        </Chip>
                                        {selectedAttempt.processedAt ? (
                                            <Typography type="body-xs" color="muted">
                                                {getTimeAgoLabel(getTimeAgoMessage(dayjs(selectedAttempt.processedAt)), t)}
                                            </Typography>
                                        ) : null}
                                    </div>
                                    {selectedAttempt.submissionUrl ? (
                                        <Link
                                            href={selectedAttempt.submissionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm text-accent hover:underline"
                                        >
                                            {t("submissionAttempts.viewSubmission")}
                                            <ArrowSquareOutIcon aria-hidden focusable="false" className="size-5" />
                                        </Link>
                                    ) : null}
                                </div>
                                {selectedAttempt.shortFeedback ? (
                                    <Typography type="body-sm" color="muted">
                                        {selectedAttempt.shortFeedback}
                                    </Typography>
                                ) : null}
                            </div>

                            <AsyncContent
                                isLoading={feedbacksSwr.data === null || feedbacksSwr.data === undefined ? !feedbacksSwr.error : false}
                                skeleton={(
                                    <div className="flex flex-col gap-3">
                                        {[0, 1, 2].map((row) => (
                                            <Skeleton key={row} className="h-24 w-full rounded-xl" />
                                        ))}
                                    </div>
                                )}
                                isEmpty={feedbacks.length === 0}
                                emptyContent={{ title: t("submissionResult.noFeedback") }}
                                error={!feedbacksSwr.data ? feedbacksSwr.error : undefined}
                                errorContent={{
                                    title: t("submissionResult.error"),
                                    onRetry: () => { void feedbacksSwr.mutate() },
                                    retryLabel: t("submissionResult.retry"),
                                }}
                            >
                                <div className="flex flex-col gap-4">
                                    {SEVERITY_GROUPS.map((group) => {
                                        const items = feedbacks.filter((feedback) => feedback.severity === group.severity)
                                        if (items.length === 0) {
                                            return null
                                        }
                                        return (
                                            <div key={group.key} className="flex flex-col gap-2">
                                                <Typography type="body-xs" className={cn("uppercase", group.tone === "danger" ? "text-danger" : group.tone === "warning" ? "text-warning" : "text-muted")}>
                                                    {`${t(`feedback.severity.${group.key}`)} · ${items.length}`}
                                                </Typography>
                                                {items.map((feedback) => (
                                                    <FeedbackCard
                                                        key={feedback.id}
                                                        submissionFeedback={feedback}
                                                        repositoryUrl={selectedAttempt.submissionUrl}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            </AsyncContent>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default SubmissionResult
