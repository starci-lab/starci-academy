import React from "react"
import { ContentRelatedList, type ContentRelatedItem } from "@sb-components/starci/blocks/learn/ContentRelatedList/ContentRelatedList"
import { SubmissionAttemptSelector, type SubmissionAttempt } from "@sb-components/starci/blocks/learn/SubmissionAttemptSelector/SubmissionAttemptSelector"
import { SubmissionFindingsList, type SubmissionFinding } from "@sb-components/starci/blocks/learn/SubmissionFindingsList/SubmissionFindingsList"
import { SubmissionResultHeader } from "@sb-components/starci/blocks/learn/SubmissionResultHeader/SubmissionResultHeader"
import { SubmissionScoreCard, type AiModelCategory } from "@sb-components/starci/blocks/learn/SubmissionScoreCard/SubmissionScoreCard"
import { SubmissionAttemptsDrawer, type SubmissionAttemptRecord } from "@sb-components/starci/overlays/drawers/SubmissionAttemptsDrawer/SubmissionAttemptsDrawer"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ChallengeResultPage` — the screen showing what came back from grading one
 * challenge submission. It composes blocks in frames and hands each typed data,
 * drawing no shape of its own.
 *
 * Four functions in reading order: where am I / how to leave, which attempt this is,
 * how this attempt did, and what to fix — plus a related-reading nudge shown only on
 * a failing attempt. The score cluster (`SubmissionScoreCard` +
 * `SubmissionFindingsList`) renders only once an attempt is selected (or while
 * skeleton). Mounts the full-history drawer, opened from the attempt selector's
 * overflow.
 */

/** Props for {@link ChallengeResultPage}. */
export interface ChallengeResultPageProps {
    /** Back-link label, e.g. "Back to submission". */
    backLabel: string
    /** Fired when the learner leaves the result page for the challenge solve page. */
    onBack: () => void
    /** The graded requirement's title. */
    title: string
    /** The requirement's own description/prompt. */
    description?: string

    /** The attempts offered in the selector row, in display order. */
    attempts: Array<SubmissionAttempt>
    /** The attempt currently being viewed. Unset → the score section stays hidden. */
    selectedAttemptId?: string
    /** Fired with the id of the attempt the reader picked. */
    onSelectAttempt: (id: string) => void
    /** Accessible name for the attempt selector row. */
    attemptsAriaLabel: string
    /** How many MORE attempts exist beyond the selector row — set (and > 0) → the "+N" trigger shows. */
    overflowCount?: number
    /** Label for the "+N" trigger. Defaults to `+{overflowCount}` when omitted. */
    overflowLabel?: string
    /** Fired when the reader presses "+N" — see the file header for why this screen does not open anything itself. */
    onOverflowPress?: () => void
    /** `true` → the attempt row's own fetch is in flight. */
    isAttemptsLoading?: boolean
    /** `true` (once loading has finished) → the attempt row falls to its empty message. */
    isAttemptsEmpty?: boolean
    /** Truthy → the attempt row falls to its error message. */
    attemptsError?: unknown
    /** Retry handler for the attempt row's error branch. */
    onRetryAttempts?: () => void
    /** Label of the attempt row's retry button. */
    retryAttemptsLabel?: string

    /** Section label above the score card, e.g. "Result". */
    scoreLabel: string
    /** Points earned on the selected attempt. Ignored while no attempt is selected. */
    score?: number
    /** Points the selected attempt was scored out of. */
    maxScore?: number
    /** Whether the selected attempt cleared the pass bar — also gates the related-reading nudge. */
    isPassing?: boolean
    /** The pass bar, in points — feeds the score card's "need N more points" sub-line. */
    passScore?: number
    /** A short line of grader feedback for the selected attempt. */
    shortFeedback?: string
    /** Link to the full submission. Omit to hide the link. */
    submissionUrl?: string
    /** Link text for {@link submissionUrl}. */
    submissionLabel?: string
    /** The model that graded the selected attempt. Omit → the byline row drops. */
    gradedByModel?: string
    /** Cost/quality tier of {@link gradedByModel}. */
    modelCategory?: AiModelCategory
    /** Overrides the byline's leading word. */
    gradedByLabel?: string
    /** Relative time since grading, already localized. */
    timeAgo?: string

    /** Section label above the findings accordion, e.g. "Feedback". */
    findingsLabel: string
    /** The selected attempt's findings, in ANY order — the block re-sorts them. */
    findings: Array<SubmissionFinding>
    /** Repo URL the selected attempt was submitted from — turns each finding's `location` into a deep-link. */
    repositoryUrl?: string
    /** `true` → the findings card's own fetch is in flight. */
    isFindingsLoading?: boolean
    /** `true` (once loading has finished) → the findings card falls to its empty message. */
    isFindingsEmpty?: boolean
    /** Truthy → the findings card falls to its error message. */
    findingsError?: unknown
    /** Retry handler for the findings card's error branch. */
    onRetryFindings?: () => void
    /** Label of the findings card's retry button. */
    retryFindingsLabel?: string

    /** Related lessons, shown only while the selected attempt failed. */
    relatedItems: Array<ContentRelatedItem>
    /** Label for the related-reading section. */
    relatedLabel: string

    /**
     * Whether the full-history drawer is open. Distinct from the selector row's
     * own loading/empty/error — the drawer is a SEPARATE overlay this screen
     * mounts (see file header).
     */
    isHistoryOpen?: boolean
    /** Open-state change handler for the history drawer (backdrop, close button, or a row selection). */
    onHistoryOpenChange?: (open: boolean) => void
    /**
     * The FULL attempt history (newest first) — distinct from `attempts`, which
     * is only the visible chip-row subset. Unset/empty while `isHistoryOpen` is
     * never true → the drawer never actually mounts open, so this stays optional.
     */
    historyAttempts?: Array<SubmissionAttemptRecord>

    /**
     * `true` → every block that can mirror itself does, and the score/findings
     * cluster reserves its height even though no attempt is selected yet — the
     * same reasoning `ContentPage` documents for its own footer.
     */
    isSkeleton?: boolean
}

/**
 * The challenge grading-result screen. See the file header for the function
 * list and why the score/findings cluster and the related-reading nudge are
 * each conditional.
 *
 * @param props - {@link ChallengeResultPageProps}
 */
const ChallengeResultPage = ({
    backLabel,
    onBack,
    title,
    description,
    attempts,
    selectedAttemptId,
    onSelectAttempt,
    attemptsAriaLabel,
    overflowCount,
    overflowLabel,
    onOverflowPress,
    isAttemptsLoading,
    isAttemptsEmpty,
    attemptsError,
    onRetryAttempts,
    retryAttemptsLabel,
    scoreLabel,
    score,
    maxScore,
    isPassing = false,
    passScore,
    shortFeedback,
    submissionUrl,
    submissionLabel,
    gradedByModel,
    modelCategory,
    gradedByLabel,
    timeAgo,
    findingsLabel,
    findings,
    repositoryUrl,
    isFindingsLoading,
    isFindingsEmpty,
    findingsError,
    onRetryFindings,
    retryFindingsLabel,
    relatedItems,
    relatedLabel,
    isHistoryOpen = false,
    onHistoryOpenChange,
    historyAttempts,
    isSkeleton = false,
}: ChallengeResultPageProps) => {
    // Nothing about "how did it go" can render before an attempt is actually
    // selected — see the file header. A skeleton paint still reserves this
    // cluster's height so the page does not jump once the first attempt lands.
    const hasSelection = isSkeleton || selectedAttemptId != null

    const scoreSection = (
        <>
            <SubmissionScoreCard

                label={scoreLabel}
                score={score ?? 0}
                maxScore={maxScore}
                isPassing={isPassing}
                passScore={passScore}
                shortFeedback={shortFeedback}
                submissionUrl={submissionUrl}
                submissionLabel={submissionLabel}
                gradedByModel={gradedByModel}
                modelCategory={modelCategory}
                gradedByLabel={gradedByLabel}
                timeAgo={timeAgo}
                isSkeleton={isSkeleton}

            />
            <SubmissionFindingsList

                label={findingsLabel}
                findings={findings}
                repositoryUrl={repositoryUrl}
                isLoading={isFindingsLoading}
                isEmpty={isFindingsEmpty}
                error={findingsError}
                onRetry={onRetryFindings}
                retryLabel={retryFindingsLabel}
                isSkeleton={isSkeleton}

            />
            {/* Nothing left to fix on a passing attempt — see file header. */}
            {!isPassing ? (
                <ContentRelatedList

                    items={relatedItems}
                    label={relatedLabel}
                    isSkeleton={isSkeleton}

                />
            ) : null}
        </>
    )

    const attemptsSection = (
        <>
            <SubmissionAttemptSelector

                attempts={attempts}
                selectedId={selectedAttemptId}
                onSelect={onSelectAttempt}
                ariaLabel={attemptsAriaLabel}
                overflowCount={overflowCount}
                overflowLabel={overflowLabel}
                onOverflowPress={onOverflowPress}
                isLoading={isAttemptsLoading}
                isEmpty={isAttemptsEmpty}
                error={attemptsError}
                onRetry={onRetryAttempts}
                retryLabel={retryAttemptsLabel}
                isSkeleton={isSkeleton}

            />
            {hasSelection ? (
                <StackV gap={6} body={scoreSection} />
            ) : null}
        </>
    )

    const pageSections = (
        <>
            <SubmissionResultHeader

                backLabel={backLabel}
                onBack={onBack}
                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            <StackV gap={6} body={attemptsSection} />
        </>
    )

    const resultBody = <StackV gap={7} body={pageSections} />

    return (
        <>
            <Container size="xl" padding={6} body={resultBody} />
            <SubmissionAttemptsDrawer

                isOpen={isHistoryOpen}
                onOpenChange={onHistoryOpenChange ?? (() => {})}
                attempts={historyAttempts ?? []}
                selectedAttemptId={selectedAttemptId}
                onSelect={onSelectAttempt}

            />
        </>
    )
}

export { ChallengeResultPage }
