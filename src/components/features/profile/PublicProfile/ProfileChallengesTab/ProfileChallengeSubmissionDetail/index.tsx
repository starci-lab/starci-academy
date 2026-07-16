"use client"

import React from "react"
import {
    Link,
    Typography,
    cn,
} from "@heroui/react"
import {
    useParams,
    useRouter,
} from "next/navigation"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    LinkIcon,
} from "@phosphor-icons/react"
import {
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import {
    difficultyLevel,
} from "../ProfileChallenges/difficultyMeta"
import { pathConfig } from "@/resources/path"
import { dayjs } from "@/modules/dayjs"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserSolvedChallengeDetailSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSolvedChallengeDetailSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"
import { LanguageChip } from "@/components/blocks/chips/LanguageChip"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { SubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Score → attention colour band, shared with the manage list row. */
const scoreToneClass = (score: number): string => {
    if (score >= 90) {
        return "text-success-soft-foreground"
    }
    if (score >= 70) {
        return "text-warning-soft-foreground"
    }
    return "text-danger-soft-foreground"
}

/** Severity → left accent border colour for a feedback row. */
const SEVERITY_ACCENT: Record<SubmissionFeedbackSeverity, string> = {
    [SubmissionFeedbackSeverity.Low]: "border-l-4 border-l-success",
    [SubmissionFeedbackSeverity.Medium]: "border-l-4 border-l-warning",
    [SubmissionFeedbackSeverity.High]: "border-l-4 border-l-danger",
}

/** Props for {@link ProfileChallengeSubmissionDetail}. */
export type ProfileChallengeSubmissionDetailProps = WithClassNames<undefined>

/**
 * `/profile/<u>/challenges/<courseGlobalId>/<submissionId>` — the DETAIL tier of
 * the 3-tier challenges flow: one passed submission's header (title, score,
 * difficulty, language, passed date), its submitted repo/docs link, and the
 * structured AI feedback rubric from the passing attempt — one row per feedback
 * item, accented by severity.
 *
 * @param props - optional className for the root element.
 */
export const ProfileChallengeSubmissionDetail = ({
    className,
}: ProfileChallengeSubmissionDetailProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const params = useParams<{ courseId: string; submissionId: string }>()
    const courseGlobalId = params?.courseId ? String(params.courseId) : null
    const submissionId = params?.submissionId ? String(params.submissionId) : null

    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data: detail,
        isLoading,
        error,
        mutate,
    } = useQueryUserSolvedChallengeDetailSwr(userId, submissionId)

    const level = difficultyLevel(detail?.difficulty)
    const passedAt = detail?.passedAt
        ? dayjs(detail.passedAt).locale(locale).format("hh:mm MMMM DD, YYYY")
        : undefined
    const feedbacks = detail?.feedbacks ?? []

    return (
        <div className={cn("mx-auto flex max-w-4xl flex-col gap-6", className)}>
            <PageHeader
                breadcrumb={(
                    <BackLink
                        target={t("publicProfile.challengesTab.repoHeading")}
                        onPress={() => router.push(
                            username && courseGlobalId
                                ? pathConfig().locale(locale).profile(username).challenges().course(courseGlobalId).build()
                                : pathConfig().locale(locale).profile(username ?? undefined).challenges().build(),
                        )}
                    />
                )}
                title={detail?.title ?? t("publicProfile.challengesTab.detail.title")}
                meta={detail ? (
                    <div className="flex flex-wrap items-center gap-3">
                        {level ? <DifficultyChip difficulty={level} /> : null}
                        {detail.selectedLang ? <LanguageChip language={detail.selectedLang} /> : null}
                        {typeof detail.score === "number" ? (
                            <Typography type="body-xs" weight="medium" className={scoreToneClass(detail.score)}>
                                {t("publicProfile.challengesTab.score", { score: detail.score })}
                            </Typography>
                        ) : null}
                        {passedAt ? (
                            <Typography type="body-xs" color="muted">
                                {passedAt}
                            </Typography>
                        ) : null}
                    </div>
                ) : undefined}
            />

            <AsyncContent
                isLoading={isLoading && !detail}
                skeleton={(
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-6 w-1/2" />
                        <SurfaceListCard>
                            {[0, 1, 2].map((row) => (
                                <SurfaceListCardItem key={row}>
                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </div>
                )}
                isEmpty={!detail}
                emptyContent={{
                    title: t("publicProfile.challengesTab.detail.notFound"),
                }}
                error={!detail ? error : undefined}
                errorContent={{
                    title: t("publicProfile.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                {detail ? (
                    <div className="flex flex-col gap-6">
                        <Link
                            href={detail.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-fit items-center gap-2 text-accent-soft-foreground underline"
                            aria-label={t("publicProfile.openRepo", { title: detail.title })}
                        >
                            <LinkIcon aria-hidden focusable="false" className="size-5" />
                            <Typography type="body-sm" className="text-accent-soft-foreground">
                                {t("publicProfile.repoLink")}
                            </Typography>
                        </Link>

                        <LabeledCard
                            label={t("publicProfile.challengesTab.detail.feedbackHeading")}
                            frameless
                        >
                            {feedbacks.length > 0 ? (
                                <SurfaceListCard>
                                    {feedbacks.map((feedback, index) => (
                                        <SurfaceListCardItem key={index}>
                                            <div className={cn("flex flex-col gap-1 pl-3", SEVERITY_ACCENT[feedback.severity])}>
                                                <Typography type="body-sm" weight="medium">
                                                    {feedback.message}
                                                </Typography>
                                                {feedback.detail ? (
                                                    <Typography type="body-xs" color="muted">
                                                        {feedback.detail}
                                                    </Typography>
                                                ) : null}
                                                {feedback.suggestion ? (
                                                    <Typography type="body-xs" color="muted" className="italic">
                                                        {feedback.suggestion}
                                                    </Typography>
                                                ) : null}
                                            </div>
                                        </SurfaceListCardItem>
                                    ))}
                                </SurfaceListCard>
                            ) : (
                                <Typography type="body-sm" color="muted">
                                    {t("publicProfile.challengesTab.detail.feedbackEmpty")}
                                </Typography>
                            )}
                        </LabeledCard>
                    </div>
                ) : null}
            </AsyncContent>
        </div>
    )
}
