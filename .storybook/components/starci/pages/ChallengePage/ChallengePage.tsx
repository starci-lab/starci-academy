import React from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import {
    ChallengeHeader,
    type ChallengeDifficulty,
    type ChallengeStatus,
} from "@sb-components/starci/blocks/learn/ChallengeHeader/ChallengeHeader"
import {
    ChallengeBrief,
    type ChallengeBriefPrerequisiteItem,
    type ChallengeBriefRequirementItem,
    type ChallengeBriefStepItem,
    type ChallengeBriefOutputItem,
} from "@sb-components/starci/blocks/learn/ChallengeBrief/ChallengeBrief"
import {
    ChallengeDeliverableList,
    type ChallengeDeliverableItem,
} from "@sb-components/starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList"
import { ChallengeScoreCard } from "@sb-components/starci/blocks/learn/ChallengeScoreCard/ChallengeScoreCard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { SplitWorkspace } from "@sb-components/frames/SplitWorkspace/SplitWorkspace"

/**
 * `ChallengePage` — the screen to solve one challenge. A screen owns a list of
 * functions: it calls blocks, places them in frames, and hands each typed data.
 * Five functions across a read column and an act column: (1) what this
 * challenge is — score, difficulty, the learner's status; (2) the brief; (3)
 * submit each requirement and see its graded verdict; (4) reopen grading
 * settings (chrome trigger only); (5) the roll-up score against the pass line.
 * Two columns composed with `SplitWorkspace`: a `min-w-0 flex-1` reading column
 * beside a `shrink-0 w-[360px]` sticky aside, stacked on mobile/tablet →
 * `@app-xl:flex-row` on desktop, inside a `Container size="xl"`. The
 * grading-settings drawer is not built — `onOpenGradingSettings` is a chrome
 * trigger only.
 */

/** Props for {@link ChallengePage}. */
export interface ChallengePageProps {
    /** Fired when the back link is pressed. */
    onBackPress: () => void
    /** Full back-link label override; omit to fall back to the generic "Back". */
    backLabel?: string
    /** Challenge title. */
    title: string
    /** One-sentence summary of the challenge. */
    description?: string
    /** Points this challenge is worth. Omit when no score is defined yet. */
    scoreValue?: number
    /** How hard the challenge is. Always known, independent of the learner's own attempt. */
    difficulty: ChallengeDifficulty
    /** The learner's own attempt outcome. Omit when not attempted yet. */
    status?: ChallengeStatus

    /** "Before you start" lines. Section is omitted entirely when empty/absent. */
    prerequisites?: ReadonlyArray<ChallengeBriefPrerequisiteItem>
    /** Graded requirements, each collapsible with its points on the trigger. */
    requirements?: ReadonlyArray<ChallengeBriefRequirementItem>
    /** Guided steps, numbered by the brief block in order. */
    steps?: ReadonlyArray<ChallengeBriefStepItem>
    /** Expected-output lines, each with a leading check. */
    outputs?: ReadonlyArray<ChallengeBriefOutputItem>
    /** A single hint, collapsed by default. Section is omitted when blank. */
    hint?: string

    /** The challenge's requirements as live submission rows, in display order. */
    deliverables: Array<ChallengeDeliverableItem>
    /** Fired when the learner opens the grading-lane settings — chrome trigger only this pass. */
    onOpenGradingSettings: () => void

    /** Points the learner earned across every requirement. */
    earnedScore: number
    /** Points available in total. */
    maxScore: number
    /** Fraction of `maxScore` required to pass, in the `0..1` range. */
    passThreshold: number

    /**
     * `true` → every block that can mirror itself does. The flag FLOWS DOWN
     * into each block rather than building a parallel skeleton tree here.
     */
    isSkeleton?: boolean
}

/**
 * The challenge solve screen. See the file header for the function list and
 * the two-column layout's known limits.
 *
 * @param props - {@link ChallengePageProps}
 */
const ChallengePage = ({
    onBackPress,
    backLabel,
    title,
    description,
    scoreValue,
    difficulty,
    status,
    prerequisites,
    requirements,
    steps,
    outputs,
    hint,
    deliverables,
    onOpenGradingSettings,
    earnedScore,
    maxScore,
    passThreshold,
    isSkeleton = false,
}: ChallengePageProps) => {
    const readColumn = [
        () => (
            <ChallengeHeader

                onBackPress={onBackPress}
                backLabel={backLabel}
                title={title}
                description={description}
                scoreValue={scoreValue}
                difficulty={difficulty}
                status={status}
                isSkeleton={isSkeleton}

            />
        ),
        () => (
            <ChallengeBrief

                prerequisites={prerequisites}
                requirements={requirements}
                steps={steps}
                outputs={outputs}
                hint={hint}
                isSkeleton={isSkeleton}

            />
        ),
    ]

    const actColumn = [
        () => (
            <ChallengeDeliverableList

                items={deliverables}
                onOpenGradingSettings={onOpenGradingSettings}
                isSkeleton={isSkeleton}

            />
        ),
        () => (
            <ChallengeScoreCard

                earnedScore={earnedScore}
                maxScore={maxScore}
                passThreshold={passThreshold}
                isSkeleton={isSkeleton}

            />
        ),
    ]

    const challengeBody = ({ isSkeleton }: SkeletonProps) => (
        <SplitWorkspace
            isSkeleton={isSkeleton}
            principle="layout-split"
            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
            main={({ isSkeleton }: SkeletonProps) => (
                <StackV
                    gap={7}
                    principle="layout-split"
                    explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                    isSkeleton={isSkeleton}
                    items={readColumn}
                />
            )}
            aside={({ isSkeleton }: SkeletonProps) => (
                <StackV
                    gap={6}
                    principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    isSkeleton={isSkeleton}
                    items={actColumn}
                />
            )}
        />
    )

    return (
        <Container
            size="xl"
            padding={6}
            principle="page-pad"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
            isSkeleton={isSkeleton}
            body={challengeBody}
        />
    )
}

export { ChallengePage }
