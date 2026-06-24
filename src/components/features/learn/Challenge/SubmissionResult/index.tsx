"use client"

import React, { useMemo } from "react"
import {
    Alert,
    Label,
    Link,
    ListBox,
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
    CheckCircleIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import {
    AsyncContent,
    PageHeader,
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

/** Severity groups in descending urgency — drives the section order + eyebrow tone. */
const SEVERITY_GROUPS: ReadonlyArray<{ severity: SubmissionFeedbackSeverity, tone: "danger" | "warning" | "muted", key: string }> = [
    { severity: SubmissionFeedbackSeverity.High, tone: "danger", key: "high" },
    { severity: SubmissionFeedbackSeverity.Medium, tone: "warning", key: "medium" },
    { severity: SubmissionFeedbackSeverity.Low, tone: "muted", key: "low" },
]

/**
 * Dedicated challenge-result page. TIER-1/2 {@link PageHeader} (back-link in the
 * breadcrumb slot + requirement title); below it a two-column body: a flat list of
 * attempts on the left (no card — select to view) and the selected attempt's verdict
 * + score + artifact link + summary + severity-grouped findings inside ONE surface
 * card on the right. Reads the requirement id from `?submission=` and the chosen
 * attempt from `?attempt=` (defaults to the newest). Reuses {@link FeedbackCard}
 * (frameless) as inset finding rows.
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
    /** Minimum score needed to pass (for the verdict banner sub-line). */
    const passScore = Math.ceil(passThreshold * maxScore)

    const attemptsLoading = attemptsSwr.data === null || attemptsSwr.data === undefined ? !attemptsSwr.error : false
    const feedbacksLoading = feedbacksSwr.data === null || feedbacksSwr.data === undefined ? !feedbacksSwr.error : false

    return (
        // PageHeader (header) → content cluster, gap-10 (page-heading debt)
        <div className={cn("mx-auto flex w-full max-w-5xl flex-col gap-10 p-6", className)}>
            <PageHeader
                breadcrumb={(
                    <Link
                        onPress={() => router.push(challengeHref)}
                        className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted"
                    >
                        <ArrowLeftIcon aria-hidden focusable="false" className="size-5" />
                        {t("submissionResult.backToChallenge")}
                    </Link>
                )}
                title={requirement?.title ?? t("submissionResult.title")}
                description={requirement?.description || undefined}
            />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* LEFT — attempts as a flat list (no card); select to view */}
                <aside className="flex shrink-0 flex-col gap-2 lg:w-64">
                    <Label>{t("submissionResult.attempts")}</Label>
                    <AsyncContent
                        isLoading={attemptsLoading}
                        skeleton={(
                            <div className="flex flex-col gap-2">
                                {[0, 1].map((row) => (
                                    <Skeleton key={row} className="h-12 w-full rounded-lg" />
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
                        <ListBox
                            aria-label={t("submissionResult.attempts")}
                            selectionMode="single"
                            disallowEmptySelection
                            selectedKeys={selectedAttempt ? [selectedAttempt.id] : []}
                            className="gap-1 p-0"
                        >
                            {attempts.map((attempt) => (
                                <ListBox.Item
                                    key={attempt.id}
                                    id={attempt.id}
                                    textValue={t("submissionAttempts.attemptLine", { number: attempt.attemptNumber })}
                                    onAction={() => router.push(`${pathname}?submission=${challengeSubmissionId}&attempt=${attempt.id}`)}
                                    className="cursor-pointer rounded-2xl px-3 py-2 data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent/10"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <Typography type="body-sm" weight="semibold">
                                            {t("submissionAttempts.attemptLine", { number: attempt.attemptNumber })}
                                        </Typography>
                                        <Typography type="body-xs" className={isPassing(attempt.score) ? "text-success" : "text-danger"}>
                                            {`${scoreLabel(attempt.score)} · ${t(isPassing(attempt.score) ? "submissionResult.passed" : "submissionResult.failed")}`}
                                        </Typography>
                                    </div>
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </AsyncContent>
                </aside>

                {/* RIGHT — selected attempt detail in ONE surface card */}
                <div className="min-w-0 flex-1">
                    {selectedAttempt ? (
                        <div className="flex flex-col gap-6">
                            {/* verdict banner — tinted by result (the page's #1 signal: pass/fail) + summary */}
                            <div className="flex flex-col gap-3">
                                <Alert
                                    status={isPassing(selectedAttempt.score) ? "success" : "danger"}
                                    className={cn(
                                        "shadow-none",
                                        isPassing(selectedAttempt.score) ? "bg-success/10" : "bg-danger/10",
                                    )}
                                >
                                    <Alert.Indicator>
                                        {isPassing(selectedAttempt.score) ? (
                                            <CheckCircleIcon aria-hidden focusable="false" className="size-6" />
                                        ) : (
                                            <XCircleIcon aria-hidden focusable="false" className="size-6" />
                                        )}
                                    </Alert.Indicator>
                                    <Alert.Content className="gap-1">
                                        <Alert.Title>
                                            <span className="flex flex-wrap items-baseline gap-2">
                                                <span className="text-base font-bold">
                                                    {t(isPassing(selectedAttempt.score) ? "submissionResult.passed" : "submissionResult.failed")}
                                                </span>
                                                <span className="text-sm font-semibold">{scoreLabel(selectedAttempt.score)}</span>
                                            </span>
                                        </Alert.Title>
                                        <Alert.Description>
                                            {[
                                                selectedAttempt.processedAt ? getTimeAgoLabel(getTimeAgoMessage(dayjs(selectedAttempt.processedAt)), t) : null,
                                                passScore > 0 ? t("submissionResult.passNeeded", { score: passScore }) : null,
                                            ].filter(Boolean).join(" · ")}
                                        </Alert.Description>
                                    </Alert.Content>
                                    {selectedAttempt.submissionUrl ? (
                                        <Link
                                            href={selectedAttempt.submissionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-auto flex shrink-0 items-center gap-1.5 text-sm hover:underline"
                                        >
                                            {t("submissionAttempts.viewSubmission")}
                                            <ArrowSquareOutIcon aria-hidden focusable="false" className="size-5" />
                                        </Link>
                                    ) : null}
                                </Alert>
                                {selectedAttempt.shortFeedback ? (
                                    <Typography type="body-sm" color="muted">
                                        {selectedAttempt.shortFeedback}
                                    </Typography>
                                ) : null}
                            </div>

                            {/* findings — severity groups; each = quiet eyebrow + separated bordered
                                FeedbackCards (gap-3), each finding its own bounded object */}
                            <AsyncContent
                                isLoading={feedbacksLoading}
                                skeleton={(
                                    <div className="flex flex-col gap-3">
                                        {[0, 1, 2].map((row) => (
                                            <Skeleton key={row} className="h-16 w-full rounded-2xl" />
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
                                <div className="flex flex-col gap-6">
                                    {SEVERITY_GROUPS.map((group) => {
                                        const items = feedbacks.filter((feedback) => feedback.severity === group.severity)
                                        if (items.length === 0) {
                                            return null
                                        }
                                        return (
                                            <div key={group.key} className="flex flex-col gap-2">
                                                <Typography
                                                    type="body-xs"
                                                    className={group.tone === "danger" ? "text-danger" : group.tone === "warning" ? "text-warning" : "text-muted"}
                                                >
                                                    {`${t(`feedback.severity.${group.key}`)} · ${items.length}`}
                                                </Typography>
                                                {/* findings as SEPARATE bordered cards (gap-3), each a bounded object */}
                                                <div className="flex flex-col gap-3">
                                                    {items.map((feedback) => (
                                                        <FeedbackCard
                                                            key={feedback.id}
                                                            submissionFeedback={feedback}
                                                            repositoryUrl={selectedAttempt.submissionUrl}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </AsyncContent>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default SubmissionResult
