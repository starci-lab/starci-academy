import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { ContentRelatedList, type ContentRelatedItem } from "@sb-components/starci/blocks/learn/ContentRelatedList/ContentRelatedList"
import { SubmissionAttemptSelector, type SubmissionAttempt } from "@sb-components/starci/blocks/learn/SubmissionAttemptSelector/SubmissionAttemptSelector"
import { SubmissionFindingsList, type SubmissionFinding } from "@sb-components/starci/blocks/learn/SubmissionFindingsList/SubmissionFindingsList"
import { SubmissionResultHeader } from "@sb-components/starci/blocks/learn/SubmissionResultHeader/SubmissionResultHeader"
import { SubmissionScoreCard, type AiModelCategory } from "@sb-components/starci/blocks/learn/SubmissionScoreCard/SubmissionScoreCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PersonalProjectResultScreen` — the graded result of one capstone
 * (personal-project) task attempt. Reuses `ChallengeResultPage`'s blocks
 * (`SubmissionResultHeader`, `SubmissionAttemptSelector`, `SubmissionScoreCard`,
 * `SubmissionFindingsList`, `ContentRelatedList`) and adds one local
 * `MilestoneUpNextCard` for the forward handoff to the next task. The score
 * cluster gates on `selectedAttemptId != null`; the next-task handoff renders
 * only when `isPassing && nextTask`.
 */

/** One milestone task waiting once the current one is marked passing. */
export interface PersonalProjectNextTask {
    /** Task title — the only thing the handoff card needs to name it. */
    title: string
}

/** Section eyebrow the handoff card owns itself (§14d.1) — never handed in by the caller. */
const NEXT_TASK_EYEBROW = "Next milestone"
/** CTA label the handoff card owns itself. */
const NEXT_TASK_CTA_LABEL = "Go to the next task"
/**
 * Link text for the capstone's submission link. Overrides `SubmissionScoreCard`'s
 * generic "View submission" default: a capstone submission is always a GitHub repo
 * (unlike a challenge submission, which the sibling screen leaves generic), so this
 * block owns the more specific wording itself (§14d.1) rather than taking a label
 * string from the caller.
 */
const GITHUB_LINK_LABEL = "View on GitHub"

/** Props for the next-task handoff card. Local to this file — see the file header. */
interface MilestoneUpNextCardProps {
    /** The next milestone task to hand the learner off to. */
    task: PersonalProjectNextTask
    /** Fired when the learner presses through to the next task. */
    onGoToNextTask?: () => void
    /** `true` → every composed atom mirrors shimmer instead of the real title. */
    isSkeleton?: boolean
}

/**
 * "You passed — here's what's next." A private composition helper (like
 * `ContinueCard.tsx`'s own `CardBody`), not a node with its own anatomy badge —
 * every part IT renders (`SurfaceCard`/`StackH`/`StackV`/`Typography`/`Button`)
 * badges itself individually, the same way `CardBody` lets its callers' real
 * parts show up in the tree without a synthetic wrapper name in between.
 *
 * @param props - {@link MilestoneUpNextCardProps}
 */
const MilestoneUpNextCard = ({
    task,
    onGoToNextTask,
    isSkeleton = false,
}: MilestoneUpNextCardProps) => {
    const titleColumn = (
        <StackV
            gap={1}
            classNames={["min-w-0"]}

            items={[
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={NEXT_TASK_EYEBROW}

                    />
                ),
                () => (
                    <Typography
                        size="base"
                        weight="semibold"
                        truncate
                        isSkeleton={isSkeleton}
                        text={task.title}

                    />
                ),
            ]}
        />
    )

    return (
        <SurfaceCard
            isHighlight
            isSkeleton={isSkeleton}

            body={() => (
                <StackH
                    gap={4}
                    justify="between"
                    align="center"
                    wrap

                    items={[
                        () => titleColumn,
                        () => (
                            <Button
                                isSkeleton={isSkeleton}
                                variant="primary"
                                size="sm"
                                label={NEXT_TASK_CTA_LABEL}
                                suffixIcon={ArrowRightIcon}
                                iconSlide
                                onPress={onGoToNextTask}
                                classNames={["w-fit", "shrink-0"]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}

/** Props for {@link PersonalProjectResultScreen}. */
export interface PersonalProjectResultScreenProps {
    /** Back-link label, e.g. "Back to task". */
    backLabel: string
    /** Fired when the learner leaves the result page for the task solve page. */
    onBack: () => void
    /** The graded task's title. */
    title: string
    /** The task's own description/prompt. */
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
    /** Fired when the reader presses "+N" — what it opens is a caller/screen decision (Rule 7). */
    onOverflowPress?: () => void

    /** Section label above the score card, e.g. "Result". */
    scoreLabel: string
    /** Points earned on the selected attempt. Ignored while no attempt is selected. */
    score?: number
    /** Points the selected attempt was scored out of. */
    maxScore?: number
    /** Whether the selected attempt cleared the pass bar — also gates the related-reading nudge and the next-task handoff. */
    isPassing?: boolean
    /** A short line of grader feedback for the selected attempt. */
    shortFeedback?: string
    /**
     * Link to the full submission. A capstone submission is always a GitHub repo
     * (see the `GITHUB_LINK_LABEL` constant above) — named `submissionUrl` to keep
     * one shared vocabulary with the sibling `ChallengeResultPage` prop of the
     * same role, even though its content here is always a GitHub URL.
     */
    submissionUrl?: string
    /** The model that graded the selected attempt. Omit → the byline row drops. */
    gradedByModel?: string
    /** Cost/quality tier of {@link gradedByModel}. */
    modelCategory?: AiModelCategory
    /** Relative time since grading, already localized. */
    timeAgo?: string

    /** Section label above the findings accordion, e.g. "Feedback". */
    findingsLabel: string
    /** The selected attempt's findings, in ANY order — the block re-sorts them. */
    findings: Array<SubmissionFinding>
    /** Repo URL the selected attempt was submitted from — turns each finding's `location` into a deep-link. */
    repositoryUrl?: string

    /** Related lessons, shown only while the selected attempt failed. */
    relatedItems: Array<ContentRelatedItem>
    /** Label for the related-reading section. */
    relatedLabel: string

    /** The next milestone task. Unset → the handoff card never appears, even on a pass. */
    nextTask?: PersonalProjectNextTask
    /** Fired when the learner presses through to the next task. */
    onGoToNextTask?: () => void

    /**
     * `true` → every block that can mirror itself does, and the score/findings
     * cluster reserves its height even though no attempt is selected yet — the
     * same reasoning `ChallengeResultPage` documents for its own cluster.
     */
    isSkeleton?: boolean
}

/**
 * The capstone (personal-project) grading-result screen. See the file header
 * for the full contract, the reuse list, and why the next-task handoff is a
 * new small card rather than a reuse of `ContinueCardHero`.
 *
 * @param props - {@link PersonalProjectResultScreenProps}
 */
const PersonalProjectResultScreen = ({
    backLabel,
    onBack,
    title,
    description,
    attempts,
    selectedAttemptId,
    onSelectAttempt,
    attemptsAriaLabel,
    overflowCount,
    onOverflowPress,
    scoreLabel,
    score,
    maxScore,
    isPassing = false,
    shortFeedback,
    submissionUrl,
    gradedByModel,
    modelCategory,
    timeAgo,
    findingsLabel,
    findings,
    repositoryUrl,
    relatedItems,
    relatedLabel,
    nextTask,
    onGoToNextTask,
    isSkeleton = false,
}: PersonalProjectResultScreenProps) => {
    // Nothing about "how did it go" can render before an attempt is actually
    // selected — see the file header. A skeleton paint still reserves this
    // cluster's height so the page does not jump once the first attempt lands.
    const hasSelection = isSkeleton || selectedAttemptId != null
    // Optional addendum, not the reason the page exists — no isSkeleton override,
    // same treatment ChallengeResultPage gives its related-reading nudge.
    const showNextTaskHandoff = isPassing && nextTask != null

    // Nothing about "how did it go" can render before an attempt is actually
    // selected — see the file header.
    const scoreCluster = hasSelection ? (
        <StackV
            gap={6}

            items={[
                () => (
                    <SubmissionScoreCard

                        label={scoreLabel}
                        score={score ?? 0}
                        maxScore={maxScore}
                        isPassing={isPassing}
                        shortFeedback={shortFeedback}
                        submissionUrl={submissionUrl}
                        submissionLabel={GITHUB_LINK_LABEL}
                        gradedByModel={gradedByModel}
                        modelCategory={modelCategory}
                        timeAgo={timeAgo}
                        isSkeleton={isSkeleton}

                    />
                ),
                () => (
                    <SubmissionFindingsList

                        label={findingsLabel}
                        findings={findings}
                        repositoryUrl={repositoryUrl}
                        isSkeleton={isSkeleton}

                    />
                ),
                // Nothing left to fix on a passing attempt — see file header.
                ...(!isPassing ? [() => (
                    <ContentRelatedList

                        items={relatedItems}
                        label={relatedLabel}
                        isSkeleton={isSkeleton}

                    />
                )] : []),
                // Forward handoff to the next milestone task — only once this one passed.
                ...(showNextTaskHandoff ? [() => (
                    <MilestoneUpNextCard
                        task={nextTask as PersonalProjectNextTask}
                        onGoToNextTask={onGoToNextTask}
                        isSkeleton={isSkeleton}

                    />
                )] : []),
            ]}
        />
    ) : null

    const screenBody = (
        <StackV
            gap={6}

            items={[
                () => (
                    <SubmissionResultHeader

                        backLabel={backLabel}
                        onBack={onBack}
                        title={title}
                        description={description}
                        isSkeleton={isSkeleton}

                    />
                ),
                () => (
                    <SubmissionAttemptSelector

                        attempts={attempts}
                        selectedId={selectedAttemptId}
                        onSelect={onSelectAttempt}
                        ariaLabel={attemptsAriaLabel}
                        overflowCount={overflowCount}
                        onOverflowPress={onOverflowPress}
                        isSkeleton={isSkeleton}

                    />
                ),
                () => scoreCluster,
            ]}
        />
    )

    return <Container size="md" padding={6} body={screenBody} />
}

export { PersonalProjectResultScreen }
