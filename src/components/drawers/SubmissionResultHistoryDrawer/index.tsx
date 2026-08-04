"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { SubmissionAttemptEntity } from "@/modules/types/entities/submission-attempt"
import { _SubmissionResultHistoryDrawer, type SubmissionResultHistoryRow } from "./component"

/** Props for {@link SubmissionResultHistoryDrawer}. */
export type SubmissionResultHistoryDrawerProps = {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open/close callback (also closes when a row is selected). */
    onOpenChange: (open: boolean) => void
    /** Full attempt list (newest first). */
    attempts: Array<SubmissionAttemptEntity>
    /** Currently selected attempt (highlighted row). */
    selectedAttemptId?: string
    /** Requirement max score (for the `x/max` label + verdict threshold). */
    maxScore: number
    /** Pass threshold ratio (verdict per row). */
    passThreshold: number
    /** Served-model id → tier category (for the model byline chip). */
    modelCategoryMap: Map<string, AiModelCategory>
    /** Select an attempt (the page navigates `?attempt=`). */
    onSelect: (attemptId: string) => void
}

/**
 * Submission-history drawer — the CONNECTED half: it resolves every label (incl. per-row interpolation)
 * and hands them to the presentational {@link _SubmissionResultHistoryDrawer}. Co-located with the other
 * attempt drawers (see {@link DrawerContainer}); the page owns open + selection. See `tiers/split.md`.
 *
 * @param props - {@link SubmissionResultHistoryDrawerProps}
 */
export const SubmissionResultHistoryDrawer = ({
    isOpen,
    onOpenChange,
    attempts,
    selectedAttemptId,
    maxScore,
    passThreshold,
    modelCategoryMap,
    onSelect,
}: SubmissionResultHistoryDrawerProps) => {
    const t = useTranslations()

    const rows = useMemo<Array<SubmissionResultHistoryRow>>(
        () => attempts.map((attempt) => ({
            id: attempt.id,
            attemptNumber: attempt.attemptNumber,
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
        <_SubmissionResultHistoryDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            rows={rows}
            selectedAttemptId={selectedAttemptId}
            maxScore={maxScore}
            passThreshold={passThreshold}
            onSelect={onSelect}
            labels={{
                historyLabel: t("submissionResult.history"),
                passed: t("submissionResult.passed"),
                failed: t("submissionResult.failed"),
                previous: t("common.pagination.previous"),
                next: t("common.pagination.next"),
            }}
        />
    )
}
