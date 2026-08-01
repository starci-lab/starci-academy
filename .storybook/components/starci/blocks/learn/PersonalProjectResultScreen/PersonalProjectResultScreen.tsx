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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PersonalProjectResultScreen`: what came back from grading ONE
 * capstone (personal-project) task attempt, quality-gated the same way a
 * challenge submission is.
 *
 * ⭐⭐ NEAR-TOTAL REUSE OF `ChallengeResultPage` — read that file
 * (`components/starci/pages/ChallengeResultPage/ChallengeResultPage.tsx`)
 * first. FIVE of six composed leaves are the EXACT SAME blocks that page
 * already calls (`SubmissionResultHeader`, `SubmissionAttemptSelector`,
 * `SubmissionScoreCard`, `SubmissionFindingsList`, `ContentRelatedList`) —
 * this file does not fork a single one of them, it imports the real thing.
 * The only new material is the capstone-specific "what's next" handoff.
 *
 * ⚠️ FILED AS A BLOCK, NOT A PAGE, PER THIS TASK'S OWN INSTRUCTION — even
 * though the name ends in `…Screen` and the top-level frame
 * (`Container` + `StackV`) is the same shape `ChallengeResultPage` (a page)
 * uses. The task scoped this build to `components/starci/blocks/<group>/`
 * and named it a BLOCK explicitly, so that is where it lives; a future thin
 * page/route can mount this directly the same way a page would mount
 * `ChallengeResultPage`. Using `Container`/`StackV` here is not a tier
 * violation either way — those are FRAMES, and nothing in rules/1 forbids a
 * block from reaching for a frame, only from reaching for a bare `div`.
 *
 * ⭐ THE ONE NEW LEAF — `MilestoneUpNextCard` — IS DELIBERATELY LOCAL TO THIS
 * FILE, NOT A THIRD FILE. The task explicitly scoped this pass to exactly
 * two files (this component + its story) while sibling agents build other
 * blocks concurrently in the same run, so promoting this small card to its
 * own `components/starci/blocks/<group>/MilestoneUpNextCard/` directory would
 * both violate that scope and risk a name/file collision with a sibling
 * agent's own pass. It is written here the same way `ContinueCard.tsx`
 * shares its internal `CardBody` between `.Hero`/`.Item` — a private
 * composition helper, not a node with its own anatomy badge (see its own
 * doc comment for why it takes no `anatPart` of its own).
 *
 * ⭐ WHY A NEW CARD INSTEAD OF REUSING `ContinueCardHero`: different WHY,
 * per §14d. `ContinueCardHero` is for resuming something IN PROGRESS — it
 * optionally shows a progress bar and its CTA always reads "Continue". This
 * card fires exactly ONCE, at the moment a milestone task is marked passing,
 * to hand the learner forward to the NEXT one — there is no progress to show
 * (the just-finished task is done, the next one has not started), and the
 * CTA is a different, forward-only sentence ("Go to the next task").
 * Reaching for `ContinueCardHero` would have bought a progress-bar slot this
 * moment never uses and a CTA wording that means the wrong thing here.
 *
 * ⭐ THE SCORE CLUSTER IS CONDITIONAL, AND THE CONDITION IS THE POINT — SAME
 * pattern `ChallengeResultPage` documents for its own score/findings
 * cluster. Nothing about "how did it go" can render before an attempt is
 * actually selected, so the whole cluster (score, findings, related reading,
 * and the next-task handoff) gates on `selectedAttemptId != null`.
 *
 * ⭐ THE NEXT-TASK HANDOFF IS CONDITIONAL ON `isPassing && nextTask`, WITH NO
 * `isSkeleton` OVERRIDE — the same treatment `ChallengeResultPage` gives
 * its related-reading nudge (`!isPassing`, no override either), not the
 * treatment it gives the always-reserved score/findings cluster. The
 * reasoning is the same: this is an optional addendum to the verdict, not
 * the reason the page exists, so a skeleton paint simply follows whatever
 * `isPassing`/`nextTask` the caller hands it (see the Skeleton story for how
 * that looks in practice) rather than forcing the section to always reserve
 * height.
 *
 * ⚠️ SCOPE OF THIS PASS (§B3), CARRIED OVER FROM `ChallengeResultPage`:
 * this prop list is deliberately the SHORTER one the task specified, not
 * `ChallengeResultPage`'s full surface. It drops the attempt-row and
 * findings-list loading/empty/error axes, `overflowLabel`, `passScore`, and
 * the two byline-label overrides — none of those are in the task's own prop
 * list, so nothing here fakes support for them. A caller needing those axes
 * on the capstone result page is a real gap, not invented here.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** `true` → each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    showAnatomy = false,
}: MilestoneUpNextCardProps) => {
    const titleColumn = (
        <StackV
            gap={1}
            classNames={["min-w-0"]}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={NEXT_TASK_EYEBROW}
                        showAnatomy={showAnatomy}
                    />
                    <Typography
                        size="base"
                        weight="semibold"
                        truncate
                        isSkeleton={isSkeleton}
                        text={task.title}
                        showAnatomy={showAnatomy}
                    />
                </>
            }
        />
    )

    return (
        <SurfaceCard
            isHighlight
            isSkeleton={isSkeleton}
            anatPart={showAnatomy ? "SurfaceCard" : undefined}
            body={() => (
                <StackH
                    gap={4}
                    justify="between"
                    align="center"
                    wrap
                    anatPart={showAnatomy ? "StackH" : undefined}
                    body={
                        <>
                            {titleColumn}
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
                        </>
                    }
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
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    showAnatomy = false,
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
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <SubmissionScoreCard
                        anatPart="SubmissionScoreCard"
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
                        showAnatomy={showAnatomy}
                    />
                    <SubmissionFindingsList
                        anatPart="SubmissionFindingsList"
                        label={findingsLabel}
                        findings={findings}
                        repositoryUrl={repositoryUrl}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                    {/* Nothing left to fix on a passing attempt — see file header. */}
                    {!isPassing ? (
                        <ContentRelatedList
                            anatPart="ContentRelatedList"
                            items={relatedItems}
                            label={relatedLabel}
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                    ) : null}
                    {/* Forward handoff to the next milestone task — only once this one passed. */}
                    {showNextTaskHandoff ? (
                        <MilestoneUpNextCard
                            task={nextTask as PersonalProjectNextTask}
                            onGoToNextTask={onGoToNextTask}
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                    ) : null}
                </>
            }
        />
    ) : null

    const screenBody = (
        <StackV
            gap={6}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <SubmissionResultHeader
                        anatPart="SubmissionResultHeader"
                        backLabel={backLabel}
                        onBack={onBack}
                        title={title}
                        description={description}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                    <SubmissionAttemptSelector
                        anatPart="SubmissionAttemptSelector"
                        attempts={attempts}
                        selectedId={selectedAttemptId}
                        onSelect={onSelectAttempt}
                        ariaLabel={attemptsAriaLabel}
                        overflowCount={overflowCount}
                        onOverflowPress={onOverflowPress}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                    {scoreCluster}
                </>
            }
        />
    )

    return <Container size="md" padding={6} body={screenBody} />
}

export { PersonalProjectResultScreen }
