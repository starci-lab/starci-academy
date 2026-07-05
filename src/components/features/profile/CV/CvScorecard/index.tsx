"use client"

import React, { useMemo } from "react"
import {
    Accordion,
    Card,
    CardContent,
    Chip,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    InfoIcon,
    LightbulbIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { VerdictIcon } from "@/components/blocks/grading/GradingByline"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { useQueryCvGenerationSwr } from "@/hooks/swr/api/graphql/queries/useQueryCvGenerationSwr"
import { useQueryMyCvGenerationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCvGenerationsSwr"
import { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"
import { SubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"
import type { CvFeedbackItem } from "@/modules/api/graphql/queries/types/cv-generation"

/** Props for {@link CvScorecard}. */
export interface CvScorecardProps extends WithClassNames<undefined> {
    /**
     * Currently selected CV id (already resolved to the latest CV when the
     * caller hasn't picked one) — the history dial that drives this lives in
     * the parent `CvWorkspace` (shared with `CVPreview`, applies across both
     * the "Kết quả"/"Xem trước" tabs, not just this card).
     */
    selectedId: string | undefined
}

/** Score at/above this unlocks headhunter contact (mirrors BE `CV_SCORE_UNLOCK_THRESHOLD`). */
export const CV_SCORE_UNLOCK_THRESHOLD = 70

/** Icon + tone per finding severity (drives the accordion item header). */
const SEVERITY_VISUAL: Record<SubmissionFeedbackSeverity, { Icon: typeof WarningCircleIcon, text: string, rank: number }> = {
    [SubmissionFeedbackSeverity.High]: { Icon: WarningCircleIcon, text: "text-danger", rank: 0 },
    [SubmissionFeedbackSeverity.Medium]: { Icon: WarningCircleIcon, text: "text-warning", rank: 1 },
    [SubmissionFeedbackSeverity.Low]: { Icon: InfoIcon, text: "text-muted", rank: 2 },
}

/**
 * Distinct tint per rubric `section` (AI-graded, free-text — "structure",
 * "clarity", "impact", "experience", "skills"…) so items group visually at a
 * glance. Purely categorical (not a pass/fail signal, which the severity icon
 * already owns), so these hues deliberately avoid `danger`/`warning`/`success`
 * to not collide with that meaning. Unknown/uncommon sections fall back to a
 * neutral tint rather than going unstyled.
 */
const SECTION_COLOR: Record<string, string> = {
    structure: "bg-[#3B82F6]/10 text-[#3B82F6]",
    clarity: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    impact: "bg-[#0D9488]/10 text-[#0D9488]",
    experience: "bg-[#EA580C]/10 text-[#EA580C]",
    skills: "bg-[#4F46E5]/10 text-[#4F46E5]",
}

/** Fallback tint for a `section` value not in {@link SECTION_COLOR}. */
const SECTION_COLOR_FALLBACK = "bg-default text-muted"

/** One feedback item as an accordion item: header = severity icon + section + message; panel = suggestion. */
const FindingAccordionItem = ({ item, index }: { item: CvFeedbackItem, index: number }) => {
    const t = useTranslations()
    const visual = SEVERITY_VISUAL[item.severity] ?? SEVERITY_VISUAL[SubmissionFeedbackSeverity.Medium]
    const { Icon } = visual
    const sectionColor = SECTION_COLOR[item.section.toLowerCase()] ?? SECTION_COLOR_FALLBACK

    return (
        <Accordion.Item id={`cv-finding-${index}`} aria-label={item.message}>
            <Accordion.Heading>
                <Accordion.Trigger className="w-full">
                    <div className="flex w-full items-center gap-3 text-start">
                        <Icon aria-hidden focusable="false" className={cn("size-4 shrink-0", visual.text)} />
                        <span className="min-w-0 flex-1 truncate text-sm">{item.message}</span>
                        <Chip size="sm" className={cn("hidden shrink-0 sm:inline-flex", sectionColor)}>
                            <Chip.Label>{item.section}</Chip.Label>
                        </Chip>
                        <Accordion.Indicator />
                    </div>
                </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
                <Accordion.Body>
                    {item.suggestion ? (
                        <div className="flex items-start gap-2">
                            <LightbulbIcon aria-hidden focusable="false" className="mt-0.5 size-4 shrink-0 text-muted" />
                            <MarkdownContent markdown={item.suggestion} className="text-sm text-muted [&_p]:m-0" />
                        </div>
                    ) : (
                        <Typography type="body-sm" color="muted">
                            {t("cv.scorecard.noSuggestion")}
                        </Typography>
                    )}
                </Accordion.Body>
            </Accordion.Panel>
        </Accordion.Item>
    )
}

/**
 * The CV score card: a plain (unlabeled) score-hero card — no "Kết quả" label
 * of its own, since it renders directly under the ALREADY-ACTIVE "Kết quả" tab
 * in `CvWorkspace`; repeating that word as a card title right below the tab
 * would just be a duplicate heading — plus a "Góp ý" {@link LabeledCard}
 * (findings accordion from `cvGeneration.feedback.items`, a genuinely distinct
 * sub-section, so it keeps its own label). Mirrors the challenge-result page's
 * verdict-hero + findings-accordion pattern (`SubmissionResult`) — same shape
 * of problem (AI graded something, show the score and what to fix). Picking a
 * CV (the history dial, one level up in `CvWorkspace`, shared with the
 * "Xem trước" tab) is NOT rendered here — it applies to the whole workspace,
 * not just this card.
 *
 * Self-fetching (`myCvGenerations` + `cvGeneration(id)` — SWR-deduped against
 * the sibling `CVPreview` call, no extra network cost). `selectedId` is owned
 * by the parent `CvWorkspace`.
 *
 * @param props - {@link CvScorecardProps}
 */
export const CvScorecard = ({ className, selectedId }: CvScorecardProps) => {
    const t = useTranslations()
    const myCvGenerationsSwr = useQueryMyCvGenerationsSwr()
    const list = myCvGenerationsSwr.data ?? []
    const listLoading = myCvGenerationsSwr.data === undefined && !myCvGenerationsSwr.error

    const effectiveId = selectedId ?? list[0]?.id
    const detailSwr = useQueryCvGenerationSwr(effectiveId)
    const detail = detailSwr.data
    const detailLoading = effectiveId !== undefined && detail === undefined && !detailSwr.error

    const score = detail?.score ?? null
    const stillScoring = detail?.status === CvGenerationStatus.Pending || detail?.status === CvGenerationStatus.Processing
    const unlocked = score !== null && score >= CV_SCORE_UNLOCK_THRESHOLD

    const sortedItems = useMemo(
        () => [...(detail?.feedback?.items ?? [])].sort(
            (a, b) => (SEVERITY_VISUAL[a.severity]?.rank ?? 1) - (SEVERITY_VISUAL[b.severity]?.rank ?? 1),
        ),
        [detail?.feedback?.items],
    )

    const hasAnyCv = list.length > 0

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* Score hero — ALWAYS a bounded card (loading / empty / real), never a
                floating empty-state. NO "Kết quả" label of its own — the
                already-active "Kết quả" tab above it says that. */}
            <Card>
                <CardContent className="flex flex-col gap-3">
                    <AsyncContent
                        isLoading={listLoading}
                        skeleton={<Skeleton className="h-16 w-full rounded-xl" />}
                        isEmpty={!hasAnyCv}
                        emptyContent={{
                            title: t("cv.scorecard.emptyTitle"),
                            description: t("cv.scorecard.emptyHint"),
                        }}
                    >
                        {/* score hero — the #1 signal, tinted by unlock verdict */}
                        <div className="flex items-start gap-3">
                            <div className="flex items-baseline">
                                <span
                                    className={cn(
                                        "text-4xl font-bold leading-none",
                                        score === null ? "text-muted" : unlocked ? "text-success" : "text-warning",
                                    )}
                                >
                                    {stillScoring ? "…" : (score ?? "—")}
                                </span>
                                {score !== null && !stillScoring ? (
                                    <span className="text-base text-muted">/100</span>
                                ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    {stillScoring ? (
                                        <Typography type="body-sm" color="muted">
                                            {t("cv.scorecard.stillScoring")}
                                        </Typography>
                                    ) : score !== null ? (
                                        <Chip color={unlocked ? "success" : "warning"} variant="soft" size="sm">
                                            <VerdictIcon pass={unlocked} />
                                            <Chip.Label>
                                                {t(unlocked ? "cv.scorecard.unlocked" : "cv.scorecard.locked")}
                                            </Chip.Label>
                                        </Chip>
                                    ) : (
                                        <Typography type="body-sm" color="muted">
                                            {t("cv.scorecard.noScoreYet")}
                                        </Typography>
                                    )}
                                    {detail?.courseTitle ? (
                                        <Chip size="sm">
                                            <Chip.Label>{detail.courseTitle}</Chip.Label>
                                        </Chip>
                                    ) : null}
                                </div>
                                {!stillScoring && score !== null && !unlocked ? (
                                    <Typography type="body-sm" color="muted" className="mt-1">
                                        {t("cv.scorecard.needMore", { score: CV_SCORE_UNLOCK_THRESHOLD - score })}
                                    </Typography>
                                ) : null}
                                {!stillScoring && detail?.feedback?.shortFeedback ? (
                                    <Typography type="body-sm" color="muted" className="mt-1">
                                        {detail.feedback.shortFeedback}
                                    </Typography>
                                ) : null}
                            </div>
                        </div>
                    </AsyncContent>
                </CardContent>
            </Card>

            {/* findings — a labeled accordion card, only once there's a CV to grade */}
            {hasAnyCv ? (
                <LabeledCard label={t("cv.scorecard.feedbackLabel")} frameless>
                    <AsyncContent
                        isLoading={detailLoading}
                        skeleton={<Skeleton className="h-40 w-full rounded-2xl" />}
                        isEmpty={stillScoring || sortedItems.length === 0}
                        emptyContent={{
                            title: stillScoring ? t("cv.scorecard.stillScoring") : t("cv.scorecard.noFeedback"),
                        }}
                    >
                        <Accordion
                            variant="surface"
                            className="overflow-hidden shadow-surface"
                            allowsMultipleExpanded
                        >
                            {sortedItems.map((item, index) => (
                                <FindingAccordionItem key={index} item={item} index={index} />
                            ))}
                        </Accordion>
                    </AsyncContent>
                </LabeledCard>
            ) : null}
        </div>
    )
}
