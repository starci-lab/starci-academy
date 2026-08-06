"use client"

import React, {
    useState,
} from "react"
import {
    Button,
    Card,
    CardContent,
    Chip,
    Typography,
    cn,
    Spinner,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    SettingsBreadcrumb,
} from "@/components/blocks/settings/SettingsBreadcrumb"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyLearningFeedbacksSwr, MY_LEARNING_FEEDBACKS_LIMIT } from "@/hooks/swr/api/graphql/queries/useQueryMyLearningFeedbacksSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link MyFeedbackPage}. */
export type MyFeedbackPageProps = WithClassNames<undefined>

/** Map a feedback source to a HeroUI Chip color. */
const SOURCE_COLOR_MAP: Record<string, "accent" | "warning" | "success"> = {
    challenge: "accent",
    task: "warning",
    cv: "success",
}

/**
 * The learner's received feedback as a list — source chip, title, related course
 * and summary. "Load more" grows the page window via a single offset=0 query
 * (`myLearningFeedbacks`).
 *
 * @param props - optional root className.
 */
export const MyFeedbackPage = ({
    className,
}: MyFeedbackPageProps) => {
    const t = useTranslations()
    const locale = useLocale()

    /** How many pages have been requested (drives the growing window). */
    const [pageCount, setPageCount] = useState(1)

    const swr = useQueryMyLearningFeedbacksSwr(
        0,
        MY_LEARNING_FEEDBACKS_LIMIT * pageCount,
    )
    const items = swr.data?.items ?? []
    const total = swr.data?.total ?? 0
    const hasMore = items.length < total

    const formatDate = (iso: string): string =>
        new Date(iso).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })

    const skeletonItems = [0, 1, 2].map((row) => () => (
        <Card key={row}>
            <CardContent>
                <StackV
                    gap={3}
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    items={[
                        () => (
                            <StackH
                                gap={4}
                                align="center"
                                principle="content-row"
                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                items={[
                                    () => <Skeleton.Chip />,
                                    () => <Skeleton.Typography type="body-sm" width="1/3" />,
                                ]}
                            />
                        ),
                        () => <Skeleton.Typography type="body-sm" width="3/4" />,
                    ]}
                />
            </CardContent>
        </Card>
    ))

    const feedbackItems = [
        ...items.map((item) => () => (
            <Card key={item.id}>
                <CardContent>
                    <StackV
                        gap={3}
                        principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        items={[
                            () => (
                                <Cluster
                                    gap={4}
                                    align="center"
                                    principle="content-row"
                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                    items={[
                                        () => (
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={SOURCE_COLOR_MAP[item.source] ?? "accent"}
                                            >
                                                <Chip.Label>
                                                    {t(`profileSettings.learning.feedback.source.${item.source}`)}
                                                </Chip.Label>
                                            </Chip>
                                        ),
                                        () => (
                                            <Typography type="body-sm" weight="medium">
                                                {item.title}
                                            </Typography>
                                        ),
                                        () => (
                                            <Box principle="push-end" className="ml-auto"
                                                explain="Pushes this peer to the trailing edge so trailing meta stays right-aligned in the row.">
                                                <Typography type="body-xs" color="muted">
                                                    {formatDate(item.createdAt)}
                                                </Typography>
                                            </Box>
                                        ),
                                    ]}
                                />
                            ),
                            ...(item.courseTitle
                                ? [() => (
                                    <Typography type="body-xs" color="muted">
                                        {item.courseTitle}
                                    </Typography>
                                )]
                                : []),
                            () => (
                                <Typography type="body-sm" color="muted">
                                    {item.summary}
                                </Typography>
                            ),
                        ]}
                    />
                </CardContent>
            </Card>
        )),
        ...(hasMore
            ? [() => (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        isDisabled={swr.isValidating}
                        onPress={() => setPageCount((count) => count + 1)}
                    >
                        {swr.isValidating ? (
                            <Spinner color="current" size="sm" />
                        ) : null}
                        {t("profileSettings.learning.loadMore")}
                    </Button>
                </div>
            )]
            : []),
    ]

    return (
        <div className={cn("flex flex-col gap-10", className)}>
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("profileSettings.learning.feedback.title")} />}
                title={t("profileSettings.learning.feedback.title")}
                description={t("profileSettings.learning.feedback.subtitle")}
            />

            <LabeledCard
                label={t("profileSettings.learning.feedback.title")}
            >
                <AsyncContent
                    isLoading={!swr.data && !swr.error}
                    skeleton={<StackV gap={4} items={skeletonItems} />}
                    isEmpty={items.length === 0}
                    emptyContent={{
                        title: t("profileSettings.learning.feedback.empty"),
                    }}
                    error={!swr.data ? swr.error : undefined}
                    errorContent={{
                        title: t("profileSettings.learning.feedback.empty"),
                        onRetry: () => { void swr.mutate() },
                        retryLabel: t("profileSettings.learning.loadMore"),
                    }}
                >
                    <StackV gap={4} items={feedbackItems} />
                </AsyncContent>
            </LabeledCard>
        </div>
    )
}
