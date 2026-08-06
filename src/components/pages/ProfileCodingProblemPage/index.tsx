"use client"

import React from "react"
import {
    Typography,
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
} from "@/hooks/profile/useProfileUsername"
import {
    CODING_DIFFICULTY_CHIP,
} from "@/modules/utils/coding-difficulty"
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
import { Cluster } from "@/components/frames/Cluster"
import { Container } from "@/components/frames/Container"
import { StackH, StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ProfileCodingProblemPage}. */
export type ProfileCodingProblemPageProps = WithClassNames<undefined>

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
export const ProfileCodingProblemPage = ({
    className,
}: ProfileCodingProblemPageProps) => {
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

    const rootClassNames: Array<AllowedClassName> = []
    if (className) {
        rootClassNames.push(className as AllowedClassName)
    }

    return (
        <Container identity={{ tier: "page", component: "ProfileCodingProblemPage" }} size="lg" padding={1} classNames={rootClassNames} body={() => (
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                items={[
                    () => (
                        <PageHeader
                            breadcrumb={(
                                <BackLink
                                    target={t("publicProfile.coding.history")}
                                    onPress={() => router.push(pathConfig().locale(locale).profile(username ?? undefined).skills().build())}
                                />
                            )}
                            title={problem?.title ?? t("publicProfile.coding.detail.title")}
                            meta={problem ? (
                                <Cluster gap={3} principle="chip-row"
                                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                    items={[
                                        ...(difficulty
                                            ? [() => (
                                                <StatusChip tone={difficulty.tone}>
                                                    {t(difficulty.labelKey)}
                                                </StatusChip>
                                            )]
                                            : []),
                                        () => (
                                            <StatusChip tone="neutral">
                                                {t(`codingPractice.domain.${problem.domain}`)}
                                            </StatusChip>
                                        ),
                                    ]} />
                            ) : undefined}
                        />
                    ),
                    () => (
                        <AsyncContent
                            isLoading={isLoading && !detail}
                            skeleton={(
                                <StackV gap={6} principle="block-boundary"
                                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                    items={[
                                        () => <Skeleton className="h-6 w-1/2" />,
                                        () => <Skeleton className="h-40 w-full rounded-2xl" />,
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
                                <StackV gap={6} principle="block-boundary"
                                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                    items={[
                                        () => (
                                            <LabeledCard label={t("publicProfile.coding.detail.statementHeading")} frameless>
                                                <MarkdownContent markdown={problem.statement ?? ""} />
                                            </LabeledCard>
                                        ),
                                        ...(problem.tags.length > 0
                                            ? [() => (
                                                <Cluster gap={3} principle="chip-row"
                                                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                                    items={
                                                        problem.tags.map((tag) => (
                                                            () => (
                                                                <StatusChip key={tag} tone="neutral">
                                                                    {tag}
                                                                </StatusChip>
                                                            )
                                                        ))
                                                    } />
                                            )]
                                            : []),
                                        () => (
                                            <LabeledCard label={t("publicProfile.coding.detail.submissionHeading")} frameless>
                                                {submission ? (
                                                    <SurfaceListCard>
                                                        <SurfaceListCardItem>
                                                            <Cluster gap={4} principle="content-row"
                                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                justify="between" items={[
                                                                    () => (
                                                                        <Cluster gap={3} principle="chip-row"
                                                                            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                                                            items={
                                                                                submission.languages.map((language) => (
                                                                                    () => <LanguageChip key={language} language={language} />
                                                                                ))
                                                                            } />
                                                                    ),
                                                                    () => (
                                                                        <StatusChip tone="success">
                                                                            {t(`codingPractice.verdict.${submission.verdict}`)}
                                                                        </StatusChip>
                                                                    ),
                                                                ]} />
                                                        </SurfaceListCardItem>
                                                        <SurfaceListCardItem>
                                                            <StackH gap={4} principle="content-row"
                                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                justify="between" items={[
                                                                    () => (
                                                                        <Typography type="body-sm" color="muted">
                                                                            {t("publicProfile.coding.detail.passedOf", {
                                                                                passed: submission.passedCount,
                                                                                total: submission.totalCount,
                                                                            })}
                                                                        </Typography>
                                                                    ),
                                                                    ...(solvedAt
                                                                        ? [() => (
                                                                            <Typography type="body-xs" color="muted">
                                                                                {solvedAt}
                                                                            </Typography>
                                                                        )]
                                                                        : []),
                                                                ]} />
                                                        </SurfaceListCardItem>
                                                    </SurfaceListCard>
                                                ) : (
                                                    <Typography type="body-sm" color="muted">
                                                        {t("publicProfile.coding.detail.notSolved")}
                                                    </Typography>
                                                )}
                                            </LabeledCard>
                                        ),
                                    ]} />
                            ) : null}
                        </AsyncContent>
                    ),
                ]} />
        )} />
    )
}
