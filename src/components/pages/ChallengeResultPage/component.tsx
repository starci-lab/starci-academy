import React from "react"
import { ContentRelatedList, type ContentRelatedItem } from "@/components/blocks/learn/ContentRelatedList"
import { SubmissionAttemptSelector, type SubmissionAttempt } from "@/components/blocks/learn/SubmissionAttemptSelector"
import { SubmissionFindingsList, type SubmissionFinding } from "@/components/blocks/learn/SubmissionFindingsList"
import { SubmissionResultHeader } from "@/components/blocks/learn/SubmissionResultHeader"
import { SubmissionScoreCard, type AiModelCategory } from "@/components/blocks/learn/SubmissionScoreCard"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `ChallengeResultPage` — the screen showing what came back from grading one
 * challenge submission. A screen owns a list of functions: it calls blocks,
 * places them in frames, and hands each typed data. Four functions, in reading
 * order: where am I / how do I leave · which attempt am I looking at · how did
 * this attempt do · what should I fix, plus a nudge toward more reading on a
 * failing attempt. The score cluster is conditional on an attempt being
 * selected; the related-reading nudge appears only on a failing attempt.
 *
 * src twin of `.storybook/components/starci/pages/ChallengeResultPage/ChallengeResultPage.tsx` —
 * presentational half; the connected {@link ChallengeResultPage} (`index.tsx`) owns the fetch,
 * routing, and i18n and renders this through `@/components/*` block twins.
 *
 * DEVIATION FROM THE STORYBOOK SOURCE: the storybook page also composes
 * `SubmissionAttemptsDrawer` inline as a prop-driven overlay (`isOpen`/`attempts`/
 * `onSelect` all handed in by this screen). The real v1 architecture this app
 * already ships does not compose that drawer per-page — its src twin
 * (`@/components/overlays/drawers/SubmissionAttemptsDrawer`) is a SELF-MOUNTED GLOBAL
 * SINGLETON, mounted once by `DrawerContainer` inside `InnerLayout`, driven by
 * zustand overlay state (`useSubmissionAttemptsOverlayState`) rather than props —
 * its connected export takes no props at all. Composing it again here would
 * double-mount an already-global drawer and there is no prop-driven twin of it
 * exported for per-page composition. So this presentational twin drops the
 * `isHistoryOpen`/`onHistoryOpenChange`/`historyAttempts` props and the inline
 * `<SubmissionAttemptsDrawer>` composition entirely; `onOverflowPress` is the
 * only surface `index.tsx` needs to open the existing global drawer (see its
 * own header comment).
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
    /** Fired when the reader presses "+N" — opens the app's global submission-history drawer (see file header). */
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
     * `true` → every block that can mirror itself does, and the score/findings
     * cluster reserves its height even though no attempt is selected yet — the
     * same reasoning `ContentPage` documents for its own footer.
     */
    isSkeleton?: boolean
}

/**
 * The challenge grading-result screen. See the file header for the function
 * list and why the score/findings cluster and the related-reading nudge are
 * each conditional, and for the `SubmissionAttemptsDrawer` deviation.
 *
 * @param props - {@link ChallengeResultPageProps}
 */
const _ChallengeResultPage = ({
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
                <StackV gap={6} items={[() => scoreSection]} />
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
            <StackV gap={6} items={[() => attemptsSection]} />
        </>
    )

    const resultBody = <StackV gap={7} items={[() => pageSections]} />

    return (
        <Container
            size="xl"
            padding={6}
            body={() => resultBody}
            identity={{ tier: "page", component: "ChallengeResultPage" }}
        />
    )
}

export { _ChallengeResultPage }
