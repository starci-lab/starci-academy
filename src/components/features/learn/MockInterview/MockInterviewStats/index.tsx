"use client"

import React, { useMemo } from "react"
import { Alert, Button, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SectionCard } from "@/components/reuseable/SectionCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useQueryMyMockInterviewStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewStatsSwr"
import { useQueryMatchedContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryMatchedContentSwr"
import type { MockInterviewStatsBreakdownItem } from "@/modules/api/graphql/queries/types/my-mock-interview-stats"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MockInterviewStats}. */
export interface MockInterviewStatsProps extends WithClassNames<undefined> {
    /** Course whose aggregate mock-interview stats to show. */
    courseId: string
    /** Course display id, for the weakest-phase/kind CTA's deep link. */
    courseDisplayId: string
    /** Jumps the setup tab strip back to "Bắt đầu" (empty-state action). */
    onStartInterview?: () => void
}

/** Score bar color BY VALUE (not always accent) — mirrors `MockInterviewScorecard`'s own `scoreColorOf`. */
const scoreColorOf = (score: number, max: number): "success" | "warning" | "danger" => {
    const ratio = max > 0 ? score / max : 0
    return ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"
}

/** `scoreColorOf`'s result as a `text-*` class, for the headline number + trend bar labels. */
const scoreTextColorOf = (score: number, max: number): string => {
    const color = scoreColorOf(score, max)
    return color === "danger" ? "text-danger" : color === "warning" ? "text-warning" : "text-success"
}

/**
 * Mock-interview aggregate stats — the setup screen's "Thống kê" tab: an
 * overall-score trend, a mode split, per-phase (design) / per-kind (qna)
 * breakdowns, and a single "what to improve" callout (the weakest phase/kind
 * across BOTH axes, when it's a real recurring pattern) with one deep-link
 * CTA — mirrors `MockInterviewScorecard`'s own weak-phase CTA resolution so
 * the two surfaces read as one system. Gated behind a minimum-attempts floor
 * (server-enforced via `insufficientData`) so a near-empty history never
 * reads as a broken dashboard of fabricated percentages.
 * @param props - {@link MockInterviewStatsProps}
 */
export const MockInterviewStats = ({ courseId, courseDisplayId, onStartInterview, className }: MockInterviewStatsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const statsSwr = useQueryMyMockInterviewStatsSwr(courseId)
    const stats = statsSwr.data

    // best-effort deep link for the weakest phase/kind — same resolution
    // MockInterviewScorecard uses for its own weak-phase CTA (a single
    // representative citation, never an invented match).
    const matchedContentSwr = useQueryMatchedContentSwr(stats?.weakest?.matchedContentId ?? undefined)
    const matchedContent = matchedContentSwr.data
    const weakest = stats?.weakest ?? null
    const studyHref = useMemo(() => {
        const base = pathConfig().locale(locale).course(courseDisplayId).learn()
        return (weakest?.matchedContentId && matchedContent?.module?.id)
            ? base.module(matchedContent.module.id).content(weakest.matchedContentId).build()
            : base.content().build()
    }, [locale, courseDisplayId, weakest?.matchedContentId, matchedContent?.module?.id])

    const axisLabel = (axis: "phase" | "kind" | "attribute", key: string): string =>
        axis === "phase" ? t(`mockInterview.phase.${key}`) : axis === "kind" ? t(`mockInterview.kind.${key}`) : t(`mockInterview.attribute.${key}`)

    const weakestLabel = weakest ? axisLabel(weakest.axis as "phase" | "kind" | "attribute", weakest.key) : null

    const breakdownLabel = (item: MockInterviewStatsBreakdownItem, axis: "phase" | "kind" | "attribute"): string =>
        axisLabel(axis, item.key)

    const renderBreakdown = (items: Array<MockInterviewStatsBreakdownItem>, axis: "phase" | "kind" | "attribute") => (
        <div className="flex flex-col gap-3">
            {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                    <div className="flex w-40 shrink-0 flex-col">
                        <Typography type="body-sm">
                            {breakdownLabel(item, axis)}
                        </Typography>
                        <Typography type="body-xs" color="muted">
                            {t("mockInterview.statsWeakRatioCaption", { weak: item.weakCount, total: item.attemptCount })}
                        </Typography>
                    </div>
                    <ProgressMeter
                        value={Math.round(item.avgScore)}
                        max={Math.round(item.avgMax) || 100}
                        color={scoreColorOf(item.avgScore, item.avgMax)}
                        showValue
                        className="flex-1"
                    />
                </div>
            ))}
        </div>
    )

    const formatTrendDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(new Date(iso))

    const verdictDotColorOf = (verdict: string): string =>
        verdict === "pass" ? "bg-success" : verdict === "borderline" ? "bg-warning" : "bg-danger"

    return (
        <AsyncContent
            isLoading={statsSwr.isLoading && !stats}
            skeleton={(
                <div className="flex flex-col gap-6">
                    <Skeleton.Card />
                    <Skeleton.Card />
                </div>
            )}
            error={!stats ? statsSwr.error : undefined}
            errorContent={{
                title: t("mockInterview.statsError"),
                onRetry: () => { void statsSwr.mutate() },
                retryLabel: t("mockInterview.promptsRetry"),
            }}
        >
            {!stats || stats.insufficientData ? (
                <EmptyState
                    icon={<ChartLineUpIcon aria-hidden focusable="false" />}
                    title={t("mockInterview.statsInsufficientTitle")}
                    description={t("mockInterview.statsInsufficientDescription")}
                    action={onStartInterview ? (
                        <Button size="sm" variant="secondary" onPress={onStartInterview}>
                            {t("mockInterview.begin")}
                        </Button>
                    ) : undefined}
                />
            ) : (
                <div className={cn("flex flex-col gap-6", className)}>
                    {/* headline = THE quantity that matters here ("điểm TB của tôi tới đâu"),
                        rendered as a big number + a meter toward 100 — not a stat-strip of
                        co-equal numbers. Number itself is colored BY VALUE (a low average
                        must read as low at a glance, not just via the meter). Mode split is
                        real context but SECONDARY, so it's a muted caption below, spelled out
                        (not a bare "N · M"). `SectionCard` — canonical bordered card, no
                        hand-rolled `bg-default/40` div. */}
                    <SectionCard contentClassName="flex flex-col gap-2">
                        {(() => {
                            const avgScore = Math.round(
                                stats.trend.reduce((sum, point) => sum + point.overallScore, 0) / Math.max(1, stats.trend.length),
                            )
                            return (
                                <>
                                    <div className="flex items-baseline gap-2">
                                        <Typography type="h2" weight="semibold" className={scoreTextColorOf(avgScore, 100)}>
                                            {avgScore}
                                        </Typography>
                                        <Typography type="body-sm" color="muted">/100 · {t("mockInterview.statsAvgScoreLabel")}</Typography>
                                    </div>
                                    <ProgressMeter value={avgScore} max={100} color={scoreColorOf(avgScore, 100)} />
                                </>
                            )
                        })()}
                        <Typography type="body-xs" color="muted">
                            {t("mockInterview.statsModeSplitCaption", {
                                qna: stats.modeSplit.qnaCount,
                                design: stats.modeSplit.designCount,
                            })}
                        </Typography>
                    </SectionCard>

                    {/* Hero 1: Hồ sơ năng lực — attributeScores graded on EVERY attempt
                        regardless of mode, mirrors byPhase/byKind's own row-shape. */}
                    {stats.byAttribute.length > 0 ? (
                        <LabeledCard label={t("mockInterview.statsAttributeTitle")}>
                            {renderBreakdown(stats.byAttribute, "attribute")}
                        </LabeledCard>
                    ) : null}

                    {/* Hero 2: Phân bố verdict — "3/5 Đạt · 1 Cần cải thiện · 1 Chưa đạt". */}
                    <LabeledCard label={t("mockInterview.statsVerdictTitle")}>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
                                <span className="size-2 rounded-full bg-success" aria-hidden />
                                <Typography type="body-sm">
                                    {stats.verdictCounts.pass} {t("mockInterview.statsVerdictPass")}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1">
                                <span className="size-2 rounded-full bg-warning" aria-hidden />
                                <Typography type="body-sm">
                                    {stats.verdictCounts.borderline} {t("mockInterview.statsVerdictBorderline")}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1">
                                <span className="size-2 rounded-full bg-danger" aria-hidden />
                                <Typography type="body-sm">
                                    {stats.verdictCounts.fail} {t("mockInterview.statsVerdictFail")}
                                </Typography>
                            </div>
                        </div>
                    </LabeledCard>

                    <LabeledCard label={t("mockInterview.statsTrendTitle")}>
                        <div className="flex items-end gap-1">
                            {stats.trend.map((point, position) => (
                                <div key={`${point.completedAt}-${position}`} className="flex flex-1 flex-col items-center gap-1">
                                    {/* concrete number above each bar — a bar alone (just relative
                                        height) reads too generic to tell scores apart at a glance. */}
                                    <Typography
                                        type="body-xs"
                                        weight="medium"
                                        className={cn("tabular-nums", scoreTextColorOf(point.overallScore, 100))}
                                    >
                                        {point.overallScore}
                                    </Typography>
                                    <div className="flex h-14 w-full items-end">
                                        <div
                                            title={`${point.overallScore}/100 · ${t(`mockInterview.verdict.${point.verdict}`)}`}
                                            style={{ height: `${Math.max(6, point.overallScore)}%` }}
                                            className={cn(
                                                "w-full rounded-t",
                                                point.overallScore < 50 ? "bg-danger/70" : point.overallScore < 75 ? "bg-warning/70" : "bg-success/70",
                                            )}
                                        />
                                    </div>
                                    {/* small dot = verdict signal, kept separate from the bar's own
                                        score-band color so the two reads never fight each other */}
                                    <span className={cn("size-1.5 rounded-full", verdictDotColorOf(point.verdict))} aria-hidden />
                                    <Typography type="body-xs" color="muted" className="tabular-nums">
                                        {formatTrendDate(point.completedAt)}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </LabeledCard>

                    {stats.byPhase.length > 0 ? (
                        <LabeledCard label={t("mockInterview.statsByPhaseTitle")}>
                            {renderBreakdown(stats.byPhase, "phase")}
                        </LabeledCard>
                    ) : null}

                    {stats.byKind.length > 0 ? (
                        <LabeledCard label={t("mockInterview.statsByKindTitle")}>
                            {renderBreakdown(stats.byKind, "kind")}
                        </LabeledCard>
                    ) : null}

                    {weakest && weakestLabel ? (
                        <Alert status="warning" className="shadow-none bg-warning/10">
                            <Alert.Content>
                                <Alert.Title>
                                    {t("mockInterview.statsWeakestCallout", {
                                        label: weakestLabel,
                                        count: weakest.weakCount,
                                    })}
                                </Alert.Title>
                                <Alert.Description>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="mt-3"
                                        onPress={() => router.push(studyHref)}
                                    >
                                        {t("mockInterview.statsWeakCta", { label: weakestLabel })}
                                        <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                    </Button>
                                </Alert.Description>
                            </Alert.Content>
                        </Alert>
                    ) : null}
                </div>
            )}
        </AsyncContent>
    )
}
