"use client"

import React from "react"
import {
    Chip,
    Label,
    Typography,
    cn,
} from "@heroui/react"
import {
    ChatCircleIcon,
    CheckCircleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { MockInterviewGradeResult } from "../types"

/** Props for {@link MockInterviewScorecard}. */
export interface MockInterviewScorecardProps extends WithClassNames<undefined> {
    /** The graded result to render (current session, or a past attempt re-opened from history). */
    grade: MockInterviewGradeResult
    /** System the session worked through, shown as a header line when known. */
    promptTitle?: string
    /** ISO timestamp of when this attempt was graded — shown for history detail, omitted for a live session. */
    createdAt?: string | null
}

/** The 3 named attributes the grader always scores, in a fixed display order. */
const ATTRIBUTE_ORDER: ReadonlyArray<string> = [
    "communication",
    "structuredThinking",
    "tradeoffAwareness",
]

/** Verdict → chip color (đạt / cận / chưa đạt) — mirrors the flashcard mock interview's convention. */
const verdictColorOf = (verdict: MockInterviewGradeResult["verdict"]): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/**
 * Read-only render of one graded mock-interview session — score, verdict,
 * per-phase + per-attribute breakdown, strengths, gaps, and a suggested
 * follow-up question. Shared between the just-finished session's scorecard
 * and the history detail drawer for a past attempt (a single source of
 * render for "what a graded session looks like").
 * @param props - {@link MockInterviewScorecardProps}
 */
export const MockInterviewScorecard = ({ grade, promptTitle, createdAt, className }: MockInterviewScorecardProps) => {
    const t = useTranslations()
    const locale = useLocale()

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

    return (
        <div className={cn("flex flex-col gap-6 rounded-xl bg-default/40 p-8", className)}>
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

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-baseline gap-2">
                    <Typography className="text-4xl font-medium text-foreground">{grade.overallScore}</Typography>
                    <Typography type="body-xs" color="muted">/100</Typography>
                </div>
                <Chip size="md" variant="soft" color={verdictColorOf(grade.verdict)}>
                    {t(`flashcard.interview.${grade.verdict}`)}
                </Chip>
            </div>

            <div className="flex flex-col gap-3">
                <Label>{t("mockInterview.perPhaseTitle")}</Label>
                {grade.phaseScores.map((phaseScore) => (
                    <div key={phaseScore.phase} className="flex items-center gap-3">
                        <Typography type="body-sm" className="w-40 shrink-0">
                            {t(`mockInterview.phase.${phaseScore.phase}`)}
                        </Typography>
                        <ProgressMeter value={phaseScore.score} max={phaseScore.max} className="flex-1" />
                    </div>
                ))}
            </div>

            {orderedAttributes.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <Label>{t("mockInterview.attributesTitle")}</Label>
                    {orderedAttributes.map((attribute) => (
                        <div key={attribute.key} className="flex items-center gap-3">
                            <Typography type="body-sm" className="w-40 shrink-0">
                                {attributeLabel(attribute.key)}
                            </Typography>
                            <ProgressMeter value={attribute.score} max={100} className="flex-1" />
                        </div>
                    ))}
                </div>
            ) : null}

            {grade.strengths.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <Label>{t("mockInterview.strengthsTitle")}</Label>
                    <ul className="flex flex-col gap-2">
                        {grade.strengths.map((strength, position) => (
                            <li key={position} className="flex items-start gap-2">
                                <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden focusable="false" />
                                <Typography type="body-sm">{strength}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {grade.gaps.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <Label>{t("mockInterview.gapsTitle")}</Label>
                    <ul className="flex flex-col gap-2">
                        {grade.gaps.map((gap, position) => (
                            <li key={position} className="flex items-start gap-2">
                                <WarningCircleIcon className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden focusable="false" />
                                <Typography type="body-sm">{gap}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {grade.followUpQuestion ? (
                <div className="flex flex-col gap-2 border-t border-divider pt-4">
                    <Label>{t("mockInterview.followUpTitle")}</Label>
                    <div className="flex items-start gap-2">
                        <ChatCircleIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden focusable="false" />
                        <Typography type="body-sm" className="italic">{grade.followUpQuestion}</Typography>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
