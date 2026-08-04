"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { UserMilestoneTaskAttemptEntity } from "@/modules/types/entities/user-milestone-task"
import { _PersonalProjectTaskResultHistoryDrawer, type PersonalProjectTaskResultHistoryRow } from "./component"

/** Props for {@link PersonalProjectTaskResultHistoryDrawer}. */
export type PersonalProjectTaskResultHistoryDrawerProps = {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open/close callback (also closes when a row is selected). */
    onOpenChange: (open: boolean) => void
    /** Full attempt list (newest first). */
    attempts: Array<UserMilestoneTaskAttemptEntity>
    /** Currently selected attempt (highlighted row). */
    selectedAttemptId?: string
    /** Task max score (for the `x/max` label); 0 → show bare score. */
    maxScore: number
    /** Served-model id → tier category (for the model byline chip). */
    modelCategoryMap: Map<string, AiModelCategory>
    /** Select an attempt (the page navigates `?attempt=`). */
    onSelect: (attemptId: string) => void
}

/**
 * Personal-project task submission-history drawer — the CONNECTED half: it resolves every label (incl.
 * per-row interpolation) and hands them to the presentational
 * {@link _PersonalProjectTaskResultHistoryDrawer}. Sibling of `SubmissionResultHistoryDrawer` (challenge)
 * — here the verdict comes straight from `attempt.passed` (no pass-threshold computation). See
 * `tiers/split.md`.
 *
 * @param props - {@link PersonalProjectTaskResultHistoryDrawerProps}
 */
export const PersonalProjectTaskResultHistoryDrawer = ({
    isOpen,
    onOpenChange,
    attempts,
    selectedAttemptId,
    maxScore,
    modelCategoryMap,
    onSelect,
}: PersonalProjectTaskResultHistoryDrawerProps) => {
    const t = useTranslations()

    const rows = useMemo<Array<PersonalProjectTaskResultHistoryRow>>(
        () => attempts.map((attempt) => ({
            id: attempt.id,
            passed: attempt.passed,
            score: attempt.score,
            servedModel: attempt.servedModel,
            category: attempt.servedModel ? modelCategoryMap.get(attempt.servedModel) : undefined,
            attemptLineLabel: t("submissionAttempts.attemptLine", { number: attempt.attemptNumber }),
            timeLabel: attempt.processedAt
                ? getTimeAgoLabel(getTimeAgoMessage(dayjs(attempt.processedAt)), t)
                : null,
        })),
        [attempts, modelCategoryMap, t],
    )

    return (
        <_PersonalProjectTaskResultHistoryDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            rows={rows}
            selectedAttemptId={selectedAttemptId}
            maxScore={maxScore}
            onSelect={onSelect}
            labels={{
                historyLabel: t("personalProjectResult.history"),
                passed: t("personalProjectResult.passed"),
                failed: t("personalProjectResult.failed"),
                previous: t("common.pagination.previous"),
                next: t("common.pagination.next"),
            }}
        />
    )
}
