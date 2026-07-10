"use client"

import React, { useMemo } from "react"
import {
    Alert,
    Button,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    ChatCircleIcon,
    CheckCircleIcon,
    WarningCircleIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { useQueryMatchedContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryMatchedContentSwr"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { MockInterviewTrackSnapshot } from "../MockInterviewTrackSnapshot"
import type { MockInterviewGradeResult, MockInterviewPhaseKey } from "../types"

/** Props for {@link MockInterviewScorecard}. */
export interface MockInterviewScorecardProps extends WithClassNames<undefined> {
    /** The graded result to render (current session, or a past attempt re-opened from history). */
    grade: MockInterviewGradeResult
    /** Course the session belongs to — needed for the track snapshot (B3). */
    courseId: string
    /** Course display id, for building the "study this" deep link (B6) via `pathConfig().course(displayId)`. */
    courseDisplayId: string
    /** System this session worked through, shown as a header line when known. */
    promptTitle?: string
    /** ISO timestamp of when this attempt was graded — shown for history detail, omitted for a live session. */
    createdAt?: string | null
    /** Called when the learner picks "Interview again" (B7, now a tertiary action). Omit to hide the action (e.g. read-only history detail). */
    onRetry?: () => void
}

/** The 3 named attributes the grader always scores, in a fixed display order. */
const ATTRIBUTE_ORDER: ReadonlyArray<string> = [
    "communication",
    "structuredThinking",
    "tradeoffAwareness",
]

/** A phase below this fraction of its max is called out as "weak" (B4/B6) — mirrors the ~60% pass-bar convention used elsewhere in grading result pages. */
const WEAK_PHASE_THRESHOLD = 0.6

/** Verdict → semantic tone (đạt / cận / chưa đạt) — drives the verdict Alert status. */
const verdictStatusOf = (verdict: MockInterviewGradeResult["verdict"]): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/** Verdict → Phosphor icon for the Alert indicator. */
const VERDICT_ICON = {
    pass: CheckCircleIcon,
    borderline: WarningCircleIcon,
    fail: XCircleIcon,
} as const

/**
 * Verdict status → soft tint class (literal, so Tailwind emits it). The verdict
 * Alert uses the tinted "in-surface" look (`bg-<status>/10` + `shadow-none`), not
 * the default `bg-surface` + shadow — the scorecard is a tinted result banner and
 * often renders inside the history drawer surface. Mirrors {@link Callout}.
 */
const VERDICT_TINT: Record<"success" | "warning" | "danger", string> = {
    success: "bg-success/10",
    warning: "bg-warning/10",
    danger: "bg-danger/10",
}

/**
 * Score bar color BY VALUE (not always accent): a low score must read as low.
 * &lt;50% of max = danger, &lt;75% = warning, else success.
 */
const scoreColorOf = (score: number, max: number): "success" | "warning" | "danger" => {
    const ratio = max > 0 ? score / max : 0
    return ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"
}

/** The 5 canonical design-kind phase keys — used to tell a `kind="design"` phase from a Q&A-kind server-labeled question ("Câu 1" …). */
const DESIGN_PHASE_KEYS: ReadonlyArray<MockInterviewPhaseKey> = [
    "requirements",
    "estimation",
    "highLevel",
    "deepDive",
    "tradeoffs",
]

/**
 * Renders a `phaseScores[].phase` value for display. `kind="design"` sends one
 * of the 5 canonical phase keys (i18n-resolved); Q&A kinds instead send a
 * ready-to-render label like `"Câu 1"` straight from the server — rendered
 * as-is, no i18n lookup (the scorecard never hardcodes 5 phase labels).
 */
const phaseDisplayLabel = (phase: string, t: ReturnType<typeof useTranslations>): string =>
    (DESIGN_PHASE_KEYS as ReadonlyArray<string>).includes(phase)
        ? t(`mockInterview.phase.${phase}`)
        : phase

/**
 * Read-only render of one graded mock-interview session — score, verdict, a
 * course-grounding citation, a "where you stand" track snapshot, per-phase +
 * per-attribute breakdown, strengths, gaps, and the primary "study your weak
 * area" CTA that closes the demand loop back into the course. Shared between
 * the just-finished session's scorecard and the history detail drawer for a
 * past attempt (a single source of render for "what a graded session looks like").
 *
 * @param props - {@link MockInterviewScorecardProps}
 */
export const MockInterviewScorecard = ({
    grade,
    courseId,
    courseDisplayId,
    promptTitle,
    createdAt,
    onRetry,
    className,
}: MockInterviewScorecardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    // known attribute keys render with a localized label; anything unexpected
    // (the grader is prompted to a fixed set, but AI output isn't guaranteed)
    // falls back to the raw key rather than risking a missing-message error
    const attributeLabel = (key: string): string =>
        ATTRIBUTE_ORDER.includes(key) ? t(`mockInterview.attribute.${key}`) : key

    // order attributes by the fixed display order, then append anything unexpected
    const orderedAttributes = [
        ...ATTRIBUTE_ORDER
            .map((key) => grade.attributeScores.find((attribute) => attribute.key === key))
            .filter((attribute) => attribute !== undefined),
        ...grade.attributeScores.filter((attribute) => !ATTRIBUTE_ORDER.includes(attribute.key)),
    ]

    const formattedDate = createdAt
        ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(createdAt))
        : null

    // B2/B4/B6 — resolve the FIRST RAG-matched content id into a title + module id (single
    // representative citation; retrieval already ranks matches, no batch content-by-ids
    // query exists to cheaply resolve every match). Empty matchedContentIds → no citation,
    // fall back to a plain deep link (never fabricate a match).
    const firstMatchedContentId = grade.matchedContentIds[0]
    const matchedContentSwr = useQueryMatchedContentSwr(firstMatchedContentId)
    const matchedContent = matchedContentSwr.data

    // B4/B6 — the single weakest phase (lowest earned/max ratio), when it's actually
    // weak (below threshold) — the CTA and phase-bar link both key off this.
    const weakestPhase = useMemo(() => {
        const weak = grade.phaseScores
            .filter((phaseScore) => phaseScore.max > 0 && phaseScore.score / phaseScore.max < WEAK_PHASE_THRESHOLD)
            .sort((left, right) => (left.score / left.max) - (right.score / right.max))
        return weak[0]
    }, [grade.phaseScores])

    // B6 — deep link routes to the matched content when we have BOTH a content id and
    // its owning module id (the route needs both segments); otherwise falls back to the
    // course-contents home ("Học phần" landing) so the CTA never dead-ends even when
    // nothing matched.
    const studyHref = (firstMatchedContentId && matchedContent?.module?.id)
        ? pathConfig().locale(locale).course(courseDisplayId).learn().module(matchedContent.module.id).content(firstMatchedContentId).build()
        : pathConfig().locale(locale).course(courseDisplayId).learn().content().build()

    const weakPhaseLabel = weakestPhase ? phaseDisplayLabel(weakestPhase.phase, t) : null

    // query auto-built from the gaps + follow-up question — no typing. This is
    // ADDITIVE to the primary CTA above (which already deep-links matchedContentIds[0]):
    // a fresh course-wide RAG search surfaces a small passive list (may include
    // challenges/flashcards/milestones the single-match CTA never considered).
    const relatedContentQuery = [...grade.gaps, grade.followUpQuestion].filter(Boolean).join(" ")

    // design mode scores against the 5 canonical phases; qna scores are per-question
    // ("Câu N") — drives whether the breakdown reads "từng phase" or "từng câu".
    const isDesignScore = grade.phaseScores.length > 0
        && grade.phaseScores.every((phaseScore) => (DESIGN_PHASE_KEYS as ReadonlyArray<string>).includes(phaseScore.phase))

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {(promptTitle || formattedDate) ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {promptTitle ? (
                        <Typography type="body" weight="medium">{promptTitle}</Typography>
                    ) : null}
                    {formattedDate ? (
                        <Typography type="body-xs" color="muted">{formattedDate}</Typography>
                    ) : null}
                </div>
            ) : null}

            {/* B1 — verdict = HeroUI Alert (status by verdict), NOT a hand-tinted div.
                Title carries the score; Description folds in the course-grounding line
                (moat) + the "not yet server-verified" honesty note as plain text — no
                second chip beside the verdict. */}
            <Alert status={verdictStatusOf(grade.verdict)} className={cn("shadow-none", VERDICT_TINT[verdictStatusOf(grade.verdict)])}>
                <Alert.Indicator>
                    {React.createElement(VERDICT_ICON[grade.verdict], { className: "size-6", "aria-hidden": true })}
                </Alert.Indicator>
                <Alert.Content>
                    <Alert.Title>
                        <span className="text-2xl font-medium">{grade.overallScore}</span>
                        <span className="text-muted">/100</span>
                        {" · "}
                        {t(`mockInterview.verdict.${grade.verdict}`)}
                    </Alert.Title>
                    <Alert.Description>
                        <span className="block">
                            {firstMatchedContentId
                                ? (matchedContent?.title
                                    ? t("mockInterview.moatCalloutTitled", { title: matchedContent.title })
                                    : t("mockInterview.moatCalloutUntitled"))
                                : t("mockInterview.moatCalloutGeneric")}
                        </span>
                        <span className="block text-muted">{t("mockInterview.serverUnverifiedHint")}</span>
                    </Alert.Description>
                </Alert.Content>
            </Alert>

            {/* B3 — rolling readiness snapshot (retention hook, Hole 6). Shares the exact
                same component + data the setup screen shows (single source). */}
            <MockInterviewTrackSnapshot courseId={courseId} />

            {/* qna sends "Câu N" phases → "Điểm theo từng câu"; design sends the 5
                canonical phase keys → "Điểm theo từng phase". */}
            <LabeledCard label={isDesignScore ? t("mockInterview.perPhaseTitle") : t("mockInterview.perQuestionTitle")}>
                <div className="flex flex-col gap-3">
                    {grade.phaseScores.map((phaseScore) => (
                        <div key={phaseScore.phase} className="flex items-center gap-3">
                            <Typography type="body-sm" className="w-40 shrink-0">
                                {phaseDisplayLabel(phaseScore.phase, t)}
                            </Typography>
                            <ProgressMeter
                                value={phaseScore.score}
                                max={phaseScore.max}
                                color={scoreColorOf(phaseScore.score, phaseScore.max)}
                                className="flex-1"
                            />
                        </div>
                    ))}
                </div>
            </LabeledCard>

            {orderedAttributes.length > 0 ? (
                <LabeledCard label={t("mockInterview.attributesTitle")}>
                    <div className="flex flex-col gap-3">
                        {orderedAttributes.map((attribute) => (
                            <div key={attribute.key} className="flex items-center gap-3">
                                <Typography type="body-sm" className="w-40 shrink-0">
                                    {attributeLabel(attribute.key)}
                                </Typography>
                                <ProgressMeter
                                    value={attribute.score}
                                    max={100}
                                    color={scoreColorOf(attribute.score, 100)}
                                    className="flex-1"
                                />
                            </div>
                        ))}
                    </div>
                </LabeledCard>
            ) : null}

            {grade.strengths.length > 0 ? (
                <LabeledCard label={t("mockInterview.strengthsTitle")} frameless>
                    <CheckListCard>
                        {grade.strengths.map((strength, position) => (
                            <CheckListItem key={position}>
                                <MarkdownContent markdown={strength} />
                            </CheckListItem>
                        ))}
                    </CheckListCard>
                </LabeledCard>
            ) : null}

            {/* B5 — gaps: plain "what to add" list. The single course deep-link lives on
                the primary CTA below (no per-row floating link). */}
            {grade.gaps.length > 0 ? (
                <LabeledCard label={t("mockInterview.gapsTitle")} frameless>
                    <SurfaceListCard>
                        {grade.gaps.map((gap, position) => (
                            <SurfaceListCardItem key={position}>
                                <div className="flex items-start gap-2">
                                    <WarningCircleIcon className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden focusable="false" />
                                    <MarkdownContent markdown={gap} className="min-w-0 flex-1" />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                </LabeledCard>
            ) : null}

            {grade.followUpQuestion ? (
                <LabeledCard label={t("mockInterview.followUpTitle")}>
                    <div className="flex items-start gap-2">
                        <ChatCircleIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden focusable="false" />
                        <MarkdownContent markdown={grade.followUpQuestion} className="min-w-0 flex-1 italic" />
                    </div>
                </LabeledCard>
            ) : null}

            {/* B6/B7 — the demand-loop fix: the PRIMARY action now studies the weak spot in
                the course, not "run it again"; retry is demoted to a tertiary action so
                re-running to chase a better number isn't the path of least resistance. */}
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="primary"
                    size="lg"
                    onPress={() => router.push(studyHref)}
                >
                    {weakPhaseLabel
                        ? t("mockInterview.weakPhaseCta", { phase: weakPhaseLabel })
                        : t("mockInterview.weakPhaseCtaGeneric")}
                    <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                </Button>
                {/* next rung in the loop: turn the interview into a built artifact —
                    a quiet handoff to the course's capstone (personal project). */}
                <Button
                    variant="tertiary"
                    onPress={() => router.push(
                        pathConfig().locale(locale).course(courseDisplayId).learn().personalProject().build(),
                    )}
                >
                    {t("mockInterview.capstoneCta")}
                    <ArrowRightIcon className="size-5" aria-hidden focusable="false" />
                </Button>
                {onRetry ? (
                    <Button variant="tertiary" onPress={onRetry}>
                        {t("mockInterview.retry")}
                    </Button>
                ) : null}
            </div>

            {/* quiet, self-hiding "nên đọc lại" — a passive list below the primary CTA,
                never a competing button. */}
            <RelatedContentList
                courseId={courseId}
                courseDisplayId={courseDisplayId}
                query={relatedContentQuery}
                label={t("mockInterview.relatedContentLabel")}
            />
        </div>
    )
}
