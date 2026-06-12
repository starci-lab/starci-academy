"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { MarkdownContent } from "@/components/reuseable"
import type { MilestoneTaskBrief } from "@/modules/types"

/** Props for {@link TaskBrief}. */
export interface TaskBriefProps {
    /** Per-language briefs for the milestone task. */
    briefs: Array<MilestoneTaskBrief>
    /** Currently selected programming language (matched against `brief.lang`). */
    lang: string
}

/**
 * Pick the brief matching the selected language, falling back to the first brief (handles the
 * single `agnostic` brief used by FE/infra tasks).
 */
const pickBriefByLang = (
    briefs: Array<MilestoneTaskBrief>,
    lang: string,
): MilestoneTaskBrief | undefined =>
    briefs.find((brief) => brief.lang === lang) ?? briefs[0]

/**
 * The brief `body` is already resolved to the active locale by the backend resolver (one localized
 * body per language, no per-locale translation variants), so we read it directly.
 */
const resolveBriefBody = (
    brief: MilestoneTaskBrief | undefined,
): string => brief?.body ?? ""

/**
 * SCHEMA V2 learner-facing task brief. Renders the per-language Markdown instructions (with
 * `:::muted` callouts, fenced code and ```layout``` widgets) for the selected language, resolved to
 * the active locale. Renders nothing when there are no briefs (legacy tasks).
 *
 * @param props - {@link TaskBriefProps}
 */
export const TaskBrief = ({ briefs, lang }: TaskBriefProps) => {
    const t = useTranslations()

    const body = useMemo(
        () => resolveBriefBody(pickBriefByLang(briefs, lang)),
        [briefs, lang],
    )

    if (briefs.length === 0) {
        return null
    }

    return (
        <div className="mt-3">
            <div className="font-semibold">{t("task.briefTitle")}</div>
            <div className="h-3" />
            <MarkdownContent markdown={body} />
        </div>
    )
}
