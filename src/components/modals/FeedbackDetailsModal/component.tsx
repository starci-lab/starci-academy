import React from "react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import {
    SubmissionFindingsList,
    type SubmissionFinding,
    type SubmissionFeedbackSeverity,
} from "@/components/blocks/learn/SubmissionFindingsList"

/**
 * `_FeedbackDetailsModal` — the presentational half of `FeedbackDetailsModal`: a
 * `ModalShell` wrapping the shared `SubmissionFindingsList` block, the SAME
 * severity-sorted findings accordion `ChallengeResultPage` and
 * `PersonalProjectResultScreen` already compose for this exact entity
 * (`SubmissionFeedbackEntity`). This modal owns only the dialog scaffold — every
 * finding row, the severity vocabulary, the sort order, and the loading/empty
 * states live in `SubmissionFindingsList` itself, so no bespoke card/skeleton
 * markup is authored here.
 *
 * Presentational: typed props, already resolved; no fetch/store/i18n — that is
 * the connected half, `./index.tsx`. See `tiers/split.md`.
 */

// re-exported so the connected file builds its mapped data against the SAME
// types `SubmissionFindingsList` defines, rather than redeclaring the shape.
export type { SubmissionFinding, SubmissionFeedbackSeverity }

/** Already-translated strings the connected half resolves. */
export interface FeedbackDetailsModalLabels {
    /** Modal title (`t("feedback.detailsTitle")`). */
    title: string
    /**
     * Section label above the findings card (`t("submissionResult.feedbackLabel")`)
     * — the same key `SubmissionFindingsList`'s other callers already pass.
     */
    findingsLabel: string
    /** Empty-state title when the attempt has no findings (`t("feedback.empty")`). */
    emptyLabel: string
}

/** Props for {@link _FeedbackDetailsModal}. */
export interface FeedbackDetailsModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /** The selected attempt's findings, already mapped from `SubmissionFeedbackEntity`. */
    findings: Array<SubmissionFinding>
    /** GitHub repo URL for the selected submission attempt — turns each finding's location into a file link. */
    repositoryUrl?: string
    /** `true` (once loading has finished) → the findings card falls to its own empty message. */
    isEmpty?: boolean
    /**
     * `true` → the findings card mirrors itself (`SubmissionFindingsList`'s own
     * `isSkeleton`), computed by the connected half from the first-load formula.
     */
    isSkeleton?: boolean
    /** Already-resolved display strings. */
    labels: FeedbackDetailsModalLabels
}

/**
 * Modal listing feedback entries for the current submission attempt. See the
 * file header for what this modal owns (the `ModalShell` scaffold only) and
 * what it delegates entirely to `SubmissionFindingsList`.
 *
 * @param props - {@link FeedbackDetailsModalProps}
 */
export const _FeedbackDetailsModal = ({
    isOpen,
    onOpenChange,
    findings,
    repositoryUrl,
    isEmpty,
    isSkeleton = false,
    labels,
}: FeedbackDetailsModalProps) => (
    <ModalShell
        identity={{ tier: "overlay", component: "FeedbackDetailsModal" }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={labels.title}
        size="lg"
        scroll="inside"

        body={() => (
            <SubmissionFindingsList
                label={labels.findingsLabel}
                findings={findings}
                repositoryUrl={repositoryUrl}
                isEmpty={isEmpty}
                emptyLabel={labels.emptyLabel}
                isSkeleton={isSkeleton}

            />
        )}
    />
)
