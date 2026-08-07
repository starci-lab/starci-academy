"use client"

import React from "react"
import { Button, Typography } from "@heroui/react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { VerdictHeroCard } from "@/components/blocks/stats/VerdictHeroCard"
import type { VerdictHeroBand } from "@/components/blocks/stats/VerdictHeroCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackH, StackV } from "@/components/frames/Stack"
import { useQueryMyMockInterviewStatsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewStatsSwr"
import type { MockInterviewStatsBreakdownItem } from "@/modules/api/graphql/queries/types/my-mock-interview-stats"
import { ProgrammingLanguage } from "@/modules/types/enums/programming-language"

/** Props for {@link MockInterviewStats}. */
export interface MockInterviewStatsProps {
    /** Course whose aggregate mock-interview stats to show. */
    courseId: string
    /** Course display id, for the weakest-phase/kind CTA's deep link. */
    courseDisplayId: string
    /** Jumps the setup tab strip back to "Start" (empty-state action, and also the readiness hero's "practice more" CTA when not yet at {@link PASS_BAR}). */
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
 * Mock-interview aggregate stats — the setup screen's "Stats" tab, condensed
 * per `stats-canonical-fold` (1 hero + 1 zone): a readiness hero (vs
 * {@link PASS_BAR}, "~N sessions to go" projected from the recent trend delta) +
 * the per-phase breakdown. Gated behind a minimum-attempts floor
 * (server-enforced via `insufficientData`) so a near-empty history never
 * reads as a broken dashboard of fabricated percentages.
 * @param props - {@link MockInterviewStatsProps}
 */
export const MockInterviewStats = ({ courseId, courseDisplayId, onStartInterview}: MockInterviewStatsProps) => {
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
        <StackV
            gap={4}
            items={items.map((item) => () => (
                <StackH
                    gap={4}
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    classNames={["w-full"]}
                    items={[
                        () => (
                            <StackV
                                gap={1}
                                principle="name-handle"
                                explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                classNames={["shrink-0"]}
                                items={[
                                    () => (
                                        <Typography type="body-sm" className="w-40">
                                            {axisLabel(axis, item.key)}
                                        </Typography>
                                    ),
                                    () => (
                                        <Typography type="body-xs" color="muted" className="w-40">
                                            {subtitleFor ? subtitleFor(item) : t("mockInterview.statsWeakRatioCaption", { weak: item.weakCount, total: item.attemptCount })}
                                        </Typography>
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <ProgressMeter
                                value={Math.round(item.avgScore)}
                                max={Math.round(item.avgMax) || 100}
                                color={scoreColorOf(item.avgScore, item.avgMax)}
                                showValue
                                classNames={["flex-1"]}
                            />
                        ),
                    ]}
                />
            ))}
        />
    )

    return (
        <AsyncContent
            isLoading={statsSwr.isLoading && !stats}
            skeleton={(
                // MIRROR the loaded tree: ZONE 1 label + readiness verdict hero (value ·
                // verdict · trend sub · meter · CTA), ZONE 2 label + per-phase breakdown of
                // label/caption + ProgressMeter rows.
                <StackV
                    gap={6}
                    principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    items={[
                        () => (
                            <StackV
                                gap={4}
                                items={[
                                    () => <Skeleton className="h-[14px] w-40 rounded" />,
                                    () => (
                                        <SectionCard>
                                            <StackH
                                                gap={3}
                                                principle="value-row"
                                                explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
                                                align="baseline"
                                                items={[
                                                    () => <Skeleton className="h-9 w-20 rounded" />,
                                                    () => <Skeleton className="h-[14px] w-8 rounded" />,
                                                ]}
                                            />
                                            <Skeleton.Typography type="body-sm" width="3/4" />
                                            <Skeleton.Typography type="body-xs" width="1/2" />
                                            <Skeleton.ProgressBar />
                                            <Skeleton.Button width="w-44" />
                                        </SectionCard>
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <StackV
                                gap={4}
                                items={[
                                    () => <Skeleton className="h-[14px] w-32 rounded" />,
                                    () => (
                                        <StackV
                                            gap={4}
                                            items={Array.from({ length: 4 }).map((_unused, index) => () => (
                                                <StackH
                                                    key={index}
                                                    gap={4}
                                                    principle="content-row"
                                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                    classNames={["w-full"]}
                                                    items={[
                                                        () => (
                                                            <StackV
                                                                gap={2}
                                                                principle="title-subtitle"
                                                                explain="Title over supporting line — not label-field, because neither line is a form control label."
                                                                classNames={["shrink-0"]}
                                                                items={[
                                                                    () => <Skeleton.Typography type="body-sm" width="2/3" />,
                                                                    () => <Skeleton.Typography type="body-xs" width="1/2" />,
                                                                ]}
                                                            />
                                                        ),
                                                        () => <Skeleton.ProgressBar className="flex-1" />,
                                                    ]}
                                                />
                                            ))}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
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
                    icon={ChartLineUpIcon}
                    title={t("mockInterview.statsInsufficientTitle")}
                    description={t("mockInterview.statsInsufficientDescription")}
                    action={onStartInterview ? () => (
                        <Button size="sm" variant="secondary" onPress={onStartInterview}>
                            {t("mockInterview.begin")}
                        </Button>
                    ) : undefined}
                />
            ) : (
                <div>
                    <StackV
                        gap={6}
                        principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        items={[
                            () => (
                                <LabeledCard
                                    label={t("mockInterview.statsReadinessLabel")}
                                    frameless
                                    description={() => (
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
                                                action={band !== "success" && onStartInterview ? () => (
                                                    <Button variant="primary" size="sm" onPress={onStartInterview}>
                                                        {t("mockInterview.statsReadinessPracticeMoreCta", { count: sessionsNeeded })}
                                                        <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                                                    </Button>
                                                ) : undefined}
                                            />
                                        )
                                    })()}
                                </LabeledCard>
                            ),
                            ...(stats.byPhase.length > 0
                                ? [() => (
                                    <LabeledCard label={t("mockInterview.statsByPhaseTitle")}>
                                        {renderBreakdown(stats.byPhase, "phase")}
                                    </LabeledCard>
                                )]
                                : []),
                            () => (
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
                            ),
                        ]}
                    />
                </div>
            )}
        </AsyncContent>
    )
}
