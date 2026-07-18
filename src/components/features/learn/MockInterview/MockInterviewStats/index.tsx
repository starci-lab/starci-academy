"use client"

import React from "react"
import { Button, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { VerdictHeroCard } from "@/components/blocks/stats/VerdictHeroCard"
import type { VerdictHeroBand } from "@/components/blocks/stats/VerdictHeroCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useQueryMyMockInterviewStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewStatsSwr"
import type { MockInterviewStatsBreakdownItem } from "@/modules/api/graphql/queries/types/my-mock-interview-stats"
import { ProgrammingLanguage } from "@/modules/types/enums/programming-language"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MockInterviewStats}. */
export interface MockInterviewStatsProps extends WithClassNames<undefined> {
    /** Course whose aggregate mock-interview stats to show. */
    courseId: string
    /** Course display id, for the weakest-phase/kind CTA's deep link. */
    courseDisplayId: string
    /** Jumps the setup tab strip back to "Bắt đầu" (empty-state action, and also the readiness hero's "practice more" CTA when not yet at {@link PASS_BAR}). */
    onStartInterview?: () => void
}

/** Every breakdown axis this surface folds a `MockInterviewStatsBreakdownItem` list by. */
type BreakdownAxis = "phase" | "kind" | "attribute" | "level" | "language"

/** Score bar color BY VALUE (not always accent) — mirrors `MockInterviewScorecard`'s own `scoreColorOf`. Used for the per-row breakdown meters and the trend bars (absolute 0-100 quality reads), NOT the readiness hero (that one is relative to {@link PASS_BAR} — see `readinessBandOf`). */
const scoreColorOf = (score: number, max: number): "success" | "warning" | "danger" => {
    const ratio = max > 0 ? score / max : 0
    return ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"
}

/** Every language {@link ProgrammingLanguage} covers — used to tell a real implementation-track language (translated) apart from a raw drawn-language string (fallback-capitalized), mirrors `MockInterviewWorkspace`'s own `KNOWN_PROGRAMMING_LANGS`. */
const KNOWN_PROGRAMMING_LANGS: ReadonlySet<string> = new Set(Object.values(ProgrammingLanguage))

/** No dedicated BE field yet for the interview "pass" line — a local const, same convention `MockInterviewScorecard`'s own `WEAK_PHASE_THRESHOLD` uses for a hardcoded interview-domain constant. */
const PASS_BAR = 70

/** Below this fraction of {@link PASS_BAR} the readiness hero reads as `"danger"` rather than `"warning"` — proportional (not a flat point gap) so the same margin scales with the bar itself. */
const READINESS_WARNING_RATIO = 0.8

/** Readiness band relative to {@link PASS_BAR} (NOT the absolute-quality {@link scoreColorOf} scale — a 64 there is "warning" purely because it's <75/100, whereas here it's "warning" because it's close-but-under the pass line). */
const readinessBandOf = (avgScore: number): VerdictHeroBand =>
    avgScore >= PASS_BAR ? "success" : avgScore >= PASS_BAR * READINESS_WARNING_RATIO ? "warning" : "danger"

/**
 * Mock-interview aggregate stats — the setup screen's "Thống kê" tab, rút gọn
 * per `stats-canonical-fold` (1 hero + 1 zone): a readiness hero (vs
 * {@link PASS_BAR}, "còn ~N phiên" projected from the recent trend delta) +
 * the per-phase breakdown. Gated behind a minimum-attempts floor
 * (server-enforced via `insufficientData`) so a near-empty history never
 * reads as a broken dashboard of fabricated percentages.
 * @param props - {@link MockInterviewStatsProps}
 */
export const MockInterviewStats = ({ courseId, courseDisplayId, onStartInterview, className }: MockInterviewStatsProps) => {
    const t = useTranslations()

    const statsSwr = useQueryMyMockInterviewStatsSwr(courseId)
    const stats = statsSwr.data

    const axisLabel = (axis: BreakdownAxis, key: string): string => {
        switch (axis) {
        case "phase":
            return t(`mockInterview.phase.${key}`)
        case "kind":
            return t(`mockInterview.kind.${key}`)
        case "attribute":
            return t(`mockInterview.attribute.${key}`)
        case "level":
            // junior/middle/senior/staff — shared vocabulary, reuses the flashcard
            // module's own level labels rather than duplicating a 4th copy of them.
            return t(`flashcard.level.${key}`)
        case "language":
            // byLanguage keys are drawn from a question's ProgrammingLanguage (the
            // 4 implementation tracks); an unrecognized one still reads as a plain
            // label instead of a raw i18n key, mirrors MockInterviewWorkspace's own
            // displayLangLabel fallback.
            return KNOWN_PROGRAMMING_LANGS.has(key) ? t(`programmingLanguage.${key}`) : key.charAt(0).toUpperCase() + key.slice(1)
        }
    }

    const renderBreakdown = (
        items: ReadonlyArray<MockInterviewStatsBreakdownItem>,
        axis: BreakdownAxis,
        subtitleFor?: (item: MockInterviewStatsBreakdownItem) => React.ReactNode,
    ) => (
        <div className="flex flex-col gap-3">
            {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                    <div className="flex w-40 shrink-0 flex-col">
                        <Typography type="body-sm">
                            {axisLabel(axis, item.key)}
                        </Typography>
                        <Typography type="body-xs" color="muted">
                            {subtitleFor ? subtitleFor(item) : t("mockInterview.statsWeakRatioCaption", { weak: item.weakCount, total: item.attemptCount })}
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

    return (
        <AsyncContent
            isLoading={statsSwr.isLoading && !stats}
            skeleton={(
                // MIRROR the loaded tree: ZONE 1 label + readiness verdict hero (value ·
                // verdict · trend sub · meter · CTA), ZONE 2 label + per-phase breakdown of
                // label/caption + ProgressMeter rows.
                <div className="flex flex-col gap-6">
                    {/* ZONE 1 — readiness hero */}
                    <section className="flex flex-col gap-3">
                        <Skeleton className="h-[14px] w-40 rounded" />
                        <SectionCard>
                            <div className="flex items-baseline gap-1">
                                <Skeleton className="h-9 w-20 rounded" />
                                <Skeleton className="h-[14px] w-8 rounded" />
                            </div>
                            <Skeleton.Typography type="body-sm" width="3/4" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                            <Skeleton.ProgressBar />
                            <Skeleton.Button width="w-44" />
                        </SectionCard>
                    </section>

                    {/* ZONE 2 — per-phase breakdown rows (label/caption + meter) */}
                    <section className="flex flex-col gap-3">
                        <Skeleton className="h-[14px] w-32 rounded" />
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 4 }).map((_unused, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex w-40 shrink-0 flex-col gap-1">
                                        <Skeleton.Typography type="body-sm" width="2/3" />
                                        <Skeleton.Typography type="body-xs" width="1/2" />
                                    </div>
                                    <Skeleton.ProgressBar className="flex-1" />
                                </div>
                            ))}
                        </div>
                    </section>
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
                    {/* ZONE 1 — readiness hero: verdict (vs PASS_BAR, projected from the
                        recent trend delta) → evidence (trend sub-line) → action (practice
                        more). Replaces the old bare "avg/100 + meter" SectionCard — a number
                        alone is exactly the "xàm" pattern this redesign removes. */}
                    <LabeledCard
                        label={t("mockInterview.statsReadinessLabel")}
                        frameless
                        description={(
                            <Typography type="body-xs" color="muted">
                                {t("mockInterview.statsModeSplitCaption", {
                                    qna: stats.modeSplit.qnaCount,
                                    design: stats.modeSplit.designCount,
                                })}
                            </Typography>
                        )}
                    >
                        {(() => {
                            const avgScore = Math.round(
                                stats.trend.reduce((sum, point) => sum + point.overallScore, 0) / Math.max(1, stats.trend.length),
                            )
                            // "recent trend delta" — the last up-to-3 points' own rate of
                            // change projects how many more sessions at that pace it takes
                            // to cross PASS_BAR; a flat/declining trend still frames as "one
                            // more strong session" rather than an undefined/negative count.
                            const recentScores = stats.trend.slice(-3).map((point) => point.overallScore)
                            const trendDelta = recentScores.length >= 2
                                ? (recentScores[recentScores.length - 1] - recentScores[0]) / (recentScores.length - 1)
                                : 0
                            const sessionsNeeded = Math.max(1, trendDelta > 0 ? Math.ceil((PASS_BAR - avgScore) / trendDelta) : 1)
                            const band = readinessBandOf(avgScore)
                            return (
                                <VerdictHeroCard
                                    value={avgScore}
                                    unit="/100"
                                    band={band}
                                    verdict={band === "success" ? t("mockInterview.statsVerdictPass") : t("mockInterview.statsReadinessAlmostSentence", { sessionsNeeded })}
                                    sub={t("mockInterview.statsReadinessTrendCaption", {
                                        passBar: PASS_BAR,
                                        count: recentScores.length,
                                        scores: recentScores.join(" → "),
                                    })}
                                    meter={{ value: avgScore, max: 100, target: PASS_BAR }}
                                    action={band !== "success" && onStartInterview ? (
                                        <Button variant="primary" size="sm" onPress={onStartInterview}>
                                            {t("mockInterview.statsReadinessPracticeMoreCta", { count: sessionsNeeded })}
                                            <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                        </Button>
                                    ) : undefined}
                                />
                            )
                        })()}
                    </LabeledCard>

                    {stats.byPhase.length > 0 ? (
                        <LabeledCard label={t("mockInterview.statsByPhaseTitle")}>
                            {renderBreakdown(stats.byPhase, "phase")}
                        </LabeledCard>
                    ) : null}

                    {/* ZONE 3 — passive RAG "Gợi ý học": the weakest phases (by avg score) →
                        course-wide content search, keyed off their human phase labels
                        (self-hiding when empty / no match). Same study payoff the flashcard
                        stats surfaces carry. */}
                    <RelatedContentList
                        courseId={courseId}
                        courseDisplayId={courseDisplayId}
                        query={[...stats.byPhase]
                            .sort((a, b) => a.avgScore - b.avgScore)
                            .slice(0, 3)
                            .map((item) => axisLabel("phase", item.key))
                            .join(" ")}
                        label={t("mockInterview.statsStudyHeading")}
                    />
                </div>
            )}
        </AsyncContent>
    )
}
