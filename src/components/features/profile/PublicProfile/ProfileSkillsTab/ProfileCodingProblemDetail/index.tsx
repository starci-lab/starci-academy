"use client"

import React from "react"
import {
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
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import {
    CODING_DIFFICULTY_CHIP,
} from "../codingDifficultyMeta"
import { pathConfig } from "@/resources/path"
import { dayjs } from "@/modules/dayjs"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryUserCodingProblemDetailSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCodingProblemDetailSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { LanguageChip } from "@/components/blocks/chips/LanguageChip"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ProfileCodingProblemDetail}. */
export type ProfileCodingProblemDetailProps = WithClassNames<undefined>

/**
 * `/profile/<u>/skills/<slug>` — the DETAIL tier of the skills (coding) flow: one
 * coding problem's statement (same read as the practice catalog, no ownership
 * check) plus the profile owner's accepted-submission summary for it — languages
 * used, verdict, passed/total testcases, first-solved date — or an empty note when
 * the owner hasn't solved it yet. Deliberately never shows source code (the BE
 * doesn't return it here). Self-contained: reads the username + slug from the
 * route, resolves the username to the entity id, and drives its own SWR.
 *
 * @param props - optional className for the root element.
 */
export const ProfileCodingProblemDetail = ({
    className,
}: ProfileCodingProblemDetailProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const params = useParams<{ slug: string }>()
    const slug = params?.slug ? String(params.slug) : null

    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data: detail,
        isLoading,
        error,
        mutate,
    } = useQueryUserCodingProblemDetailSwr(userId, slug)

    const problem = detail?.problem
    const submission = detail?.submission ?? null
    const difficulty = problem ? CODING_DIFFICULTY_CHIP[problem.difficulty] : undefined
    const solvedAt = submission?.firstSolvedAt
        ? dayjs(submission.firstSolvedAt).locale(locale).format("hh:mm MMMM DD, YYYY")
        : undefined

    return (
        <div className={cn("mx-auto flex max-w-4xl flex-col gap-6", className)}>
            <PageHeader
                breadcrumb={(
                    <BackLink
                        target={t("publicProfile.coding.history")}
                        onPress={() => router.push(pathConfig().locale(locale).profile(username ?? undefined).skills().build())}
                    />
                )}
                title={problem?.title ?? t("publicProfile.coding.detail.title")}
                meta={problem ? (
                    <div className="flex flex-wrap items-center gap-2">
                        {difficulty ? (
                            <StatusChip tone={difficulty.tone}>
                                {t(difficulty.labelKey)}
                            </StatusChip>
                        ) : null}
                        <StatusChip tone="neutral">
                            {t(`codingPractice.domain.${problem.domain}`)}
                        </StatusChip>
                    </div>
                ) : undefined}
            />

            <AsyncContent
                isLoading={isLoading && !detail}
                skeleton={(
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-40 w-full rounded-2xl" />
                        <SurfaceListCard>
                            {[0, 1, 2].map((row) => (
                                <SurfaceListCardItem key={row}>
                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </div>
                )}
                isEmpty={!problem}
                emptyContent={{
                    title: t("publicProfile.coding.detail.notFound"),
                }}
                error={!problem ? error : undefined}
                errorContent={{
                    title: t("publicProfile.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                {problem ? (
                    <div className="flex flex-col gap-6">
                        {/* problem statement — same markdown renderer as the practice catalog */}
                        <LabeledCard label={t("publicProfile.coding.detail.statementHeading")} frameless>
                            <MarkdownContent markdown={problem.statement ?? ""} />
                        </LabeledCard>

                        {/* tags row */}
                        {problem.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {problem.tags.map((tag) => (
                                    <StatusChip key={tag} tone="neutral">
                                        {tag}
                                    </StatusChip>
                                ))}
                            </div>
                        ) : null}

                        {/* the owner's accepted-submission summary — no source code (BE never returns it here) */}
                        <LabeledCard label={t("publicProfile.coding.detail.submissionHeading")} frameless>
                            {submission ? (
                                <SurfaceListCard>
                                    <SurfaceListCardItem>
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {submission.languages.map((language) => (
                                                    <LanguageChip key={language} language={language} />
                                                ))}
                                            </div>
                                            <StatusChip tone="success">
                                                {t(`codingPractice.verdict.${submission.verdict}`)}
                                            </StatusChip>
                                        </div>
                                    </SurfaceListCardItem>
                                    <SurfaceListCardItem>
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <Typography type="body-sm" color="muted">
                                                {t("publicProfile.coding.detail.passedOf", {
                                                    passed: submission.passedCount,
                                                    total: submission.totalCount,
                                                })}
                                            </Typography>
                                            {solvedAt ? (
                                                <Typography type="body-xs" color="muted">
                                                    {solvedAt}
                                                </Typography>
                                            ) : null}
                                        </div>
                                    </SurfaceListCardItem>
                                </SurfaceListCard>
                            ) : (
                                <Typography type="body-sm" color="muted">
                                    {t("publicProfile.coding.detail.notSolved")}
                                </Typography>
                            )}
                        </LabeledCard>
                    </div>
                ) : null}
            </AsyncContent>
        </div>
    )
}
