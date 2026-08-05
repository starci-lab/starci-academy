"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useFeedbackDetailsOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQuerySubmissionFeedbacksSwr } from "@/hooks/swr/api/graphql/queries/useQuerySubmissionFeedbacksSwr"
import { useAppSelector } from "@/redux/hooks"
import { SubmissionFeedbackSeverity as RealSubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"
import { _FeedbackDetailsModal, type SubmissionFinding, type SubmissionFeedbackSeverity } from "./component"

/**
 * Real `SubmissionFeedbackSeverity` (a backend-mirroring TS `enum`) → the
 * `SubmissionFindingsList` block's plain string-union severity. Same bridging
 * convention as `ChallengeResultPage/map.ts#toBlueprintSeverity` — a TS string
 * `enum` is not structurally assignable to a matching string-literal union.
 *
 * @param severity - The real, GraphQL-sourced feedback severity.
 * @returns The equivalent block severity value.
 */
const toFindingSeverity = (severity: RealSubmissionFeedbackSeverity): SubmissionFeedbackSeverity => {
    switch (severity) {
    case RealSubmissionFeedbackSeverity.High:
        return "high"
    case RealSubmissionFeedbackSeverity.Medium:
        return "medium"
    case RealSubmissionFeedbackSeverity.Low:
        return "low"
    }
}

/**
 * Modal listing feedback entries for the current submission attempt — the
 * CONNECTED half: reads the overlay open-state ({@link useFeedbackDetailsOverlayState}),
 * fetches the attempt's feedback rows ({@link useQuerySubmissionFeedbacksSwr}, which
 * itself only runs while the modal is open), reads the selected attempt's repo
 * URL from redux, resolves every label, and hands it all to the presentational
 * {@link _FeedbackDetailsModal}. No findings markup lives here — it delegates to
 * the shared `SubmissionFindingsList` block. See `tiers/split.md`.
 */
export const FeedbackDetailsModal = () => {
    const { isOpen, setOpen } = useFeedbackDetailsOverlayState()
    const querySubmissionFeedbacksSwr = useQuerySubmissionFeedbacksSwr()
    const submissionFeedbacks = useAppSelector((state) => state.submissionFeedback.submissionFeedbacks)
    const submissionAttemptId = useAppSelector((state) => state.submissionAttempt.id)
    const submissionAttempts = useAppSelector((state) => state.submissionAttempt.submissionAttempts)
    const repositoryUrl = useMemo(
        () => submissionAttempts.find((attempt) => attempt.id === submissionAttemptId)?.submissionUrl,
        [submissionAttempts, submissionAttemptId],
    )
    const t = useTranslations()

    // first load, nothing in hand yet — see `authoring/loading-and-skeleton.md`
    const isSkeleton = isOpen && querySubmissionFeedbacksSwr.isLoading && submissionFeedbacks.length === 0

    const findings = useMemo<Array<SubmissionFinding>>(
        () => submissionFeedbacks.map((feedback) => ({
            id: feedback.id,
            message: feedback.message,
            detail: feedback.detail ?? undefined,
            suggestion: feedback.suggestion ?? undefined,
            location: feedback.location ?? undefined,
            severity: toFindingSeverity(feedback.severity),
            sortIndex: feedback.sortIndex,
        })),
        [submissionFeedbacks],
    )

    return (
        <_FeedbackDetailsModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            findings={findings}
            repositoryUrl={repositoryUrl}
            isEmpty={!querySubmissionFeedbacksSwr.isLoading && submissionFeedbacks.length === 0}
            isSkeleton={isSkeleton}
            labels={{
                title: t("feedback.detailsTitle"),
                findingsLabel: t("submissionResult.feedbackLabel"),
                emptyLabel: t("feedback.empty"),
            }}
        />
    )
}
