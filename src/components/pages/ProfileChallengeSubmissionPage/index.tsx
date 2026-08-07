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
} from "@/hooks/profile/useProfileUsername"
import {
    difficultyLevel,
} from "@/modules/utils/challenge-difficulty"
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
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/** Score → attention colour band (also used per-attempt in the attempts record). */
const scoreToneClass = (score: number): string => {
    if (score >= 90) {
        return "text-success-soft-foreground"
    }
    if (score >= 70) {
        return "text-warning-soft-foreground"
    }
    return "text-danger-soft-foreground"
}

/** Props for {@link ProfileChallengeSubmissionPage}. */
export type ProfileChallengeSubmissionPageProps = Record<string, never>
/**
 * `/profile/<u>/challenges/<courseSlug>/<submissionId>` — the DETAIL tier of
 * the 3-tier challenges flow: one passed submission's header (title, score,
 * difficulty, language, passed date), its submitted repo/docs link (the URL
 * itself, not a generic label), the attempts record (every graded try, newest
 * first), and the structured AI feedback rubric from the passing attempt — one
 * row per feedback item, accented by severity.
 *
 * @param props - optional className for the root element.
 */
export const ProfileChallengeSubmissionPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const params = useParams<{ courseId: string; submissionId: string }>()
    const courseSlug = params?.courseId ? String(params.courseId) : null
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
    const attempts = detail?.attempts ?? []

    return (
        <div className={"mx-auto flex max-w-4xl flex-col gap-6"}>
            <PageHeader
                breadcrumb={(
                    <BackLink
                        target={t("publicProfile.challengesTab.repoHeading")}
                        onPress={() => router.push(
                            username && courseSlug
                                ? pathConfig().locale(locale).profile(username).challenges().course(courseSlug).build()
                                : pathConfig().locale(locale).profile(username ?? undefined).challenges().build(),
                        )}
                    />
                )}
                title={detail?.title ?? t("publicProfile.challengesTab.detail.title")}
                meta={detail ? (
                    <Cluster gap={3} principle="chip-row"
                        explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                        align="center" items={[
                            ...(level ? [() => <DifficultyChip difficulty={level} />] : []),
                            ...(detail.selectedLang ? [() => {
                                const lang = detail.selectedLang as string
                                return <LanguageChip language={lang} />
                            }] : []),
                            ...(typeof detail.score === "number" ? [() => {
                                const score = detail.score as number
                                return (
                                    <Typography type="body-xs" weight="medium" className={scoreToneClass(score)}>
                                        {t("publicProfile.challengesTab.score", { score })}
                                    </Typography>
                                )
                            }] : []),
                            ...(passedAt ? [() => (
                                <Typography type="body-xs" color="muted">
                                    {passedAt}
                                </Typography>
                            )] : []),
                        ]} />
                ) : undefined}
            />

            <AsyncContent
                isLoading={isLoading && !detail}
                skeleton={(
                    <StackV gap={6} principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        items={[
                            () => <Skeleton className="h-6 w-1/2" />,
                            () => (
                                <SurfaceListCard>
                                    {[0, 1, 2].map((row) => (
                                        <SurfaceListCardItem key={row}>
                                            <Skeleton.Typography type="body-sm" width="3/4" />
                                        </SurfaceListCardItem>
                                    ))}
                                </SurfaceListCard>
                            ),
                        ]} />
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
                    <StackV gap={6} principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        items={[
                            () => (
                                <StackV gap={1} principle="name-handle"
                                    explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                    items={[
                                        () => (
                                            <Typography type="body-xs" color="muted">
                                                {t("publicProfile.challengesTab.detail.repoLabel")}
                                            </Typography>
                                        ),
                                        () => (
                                            <Link
                                                href={detail.submissionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-fit min-w-0 max-w-full text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                                aria-label={t("publicProfile.openRepo", { title: detail.title })}
                                            >
                                                <StackH gap={2} principle="icon-text"
                                                    explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                                    align="center" items={[
                                                        () => <LinkIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
                                                        () => (
                                                            <Typography type="body-sm" truncate className="text-accent-soft-foreground">
                                                                {detail.submissionUrl}
                                                            </Typography>
                                                        ),
                                                    ]} />
                                            </Link>
                                        ),
                                    ]} />
                            ),
                            () => (
                                <LabeledCard
                                    label={t("publicProfile.challengesTab.detail.attemptsHeading")}
                                    frameless
                                >
                                    {attempts.length > 0 ? (
                                        <SurfaceListCard>
                                            {attempts.map((attempt) => {
                                                const attemptProcessedAt = attempt.processedAt
                                                    ? dayjs(attempt.processedAt).locale(locale).format("hh:mm MMMM DD, YYYY")
                                                    : undefined
                                                const attemptScore = attempt.score
                                                return (
                                                    <SurfaceListCardItem key={attempt.attemptNumber}>
                                                        <StackV gap={3} principle="sibling-stack"
                                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                            items={[
                                                                () => (
                                                                    <StackH gap={4} principle="content-row"
                                                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                        justify="between" align="center" items={[
                                                                            () => (
                                                                                <Typography type="body-sm" weight="medium">
                                                                                    {t("publicProfile.challengesTab.detail.attemptLabel", { number: attempt.attemptNumber })}
                                                                                </Typography>
                                                                            ),
                                                                            ...(typeof attemptScore === "number" ? [() => (
                                                                                <Typography
                                                                                    type="body-xs"
                                                                                    weight="medium"
                                                                                    className={cn("shrink-0", scoreToneClass(attemptScore))}
                                                                                >
                                                                                    {t("publicProfile.challengesTab.score", { score: attemptScore })}
                                                                                </Typography>
                                                                            )] : []),
                                                                        ]} />
                                                                ),
                                                                ...(attemptProcessedAt ? [() => (
                                                                    <Typography type="body-xs" color="muted">
                                                                        {attemptProcessedAt}
                                                                    </Typography>
                                                                )] : []),
                                                                () => (
                                                                    <Link
                                                                        href={attempt.submissionUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="w-fit min-w-0 max-w-full text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                                                        aria-label={t("publicProfile.openRepo", { title: detail.title })}
                                                                    >
                                                                        <StackH gap={2} principle="icon-text"
                                                                            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                                                            align="center" items={[
                                                                                () => <LinkIcon aria-hidden focusable="false" className="size-4 shrink-0" />,
                                                                                () => (
                                                                                    <Typography type="body-xs" truncate className="text-accent-soft-foreground">
                                                                                        {attempt.submissionUrl}
                                                                                    </Typography>
                                                                                ),
                                                                            ]} />
                                                                    </Link>
                                                                ),
                                                                ...(attempt.shortFeedback ? [() => (
                                                                    <Typography type="body-xs" color="muted">
                                                                        {attempt.shortFeedback}
                                                                    </Typography>
                                                                )] : []),
                                                            ]} />
                                                    </SurfaceListCardItem>
                                                )
                                            })}
                                        </SurfaceListCard>
                                    ) : (
                                        <Typography type="body-sm" color="muted">
                                            {t("publicProfile.challengesTab.detail.noAttempts")}
                                        </Typography>
                                    )}
                                </LabeledCard>
                            ),
                        ]} />
                ) : null}
            </AsyncContent>
        </div>
    )
}
