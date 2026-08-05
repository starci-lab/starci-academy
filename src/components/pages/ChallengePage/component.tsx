import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import {
    ChallengeHeader,
    type ChallengeDifficulty,
    type ChallengeStatus,
} from "@/components/blocks/learn/ChallengeHeader"
import {
    ChallengeBrief,
    type ChallengeBriefPrerequisiteItem,
    type ChallengeBriefRequirementItem,
    type ChallengeBriefStepItem,
    type ChallengeBriefOutputItem,
} from "@/components/blocks/learn/ChallengeBrief"
import {
    ChallengeDeliverableList,
    type ChallengeDeliverableItem,
} from "@/components/blocks/learn/ChallengeDeliverableList"
import { ChallengeScoreCard } from "@/components/blocks/learn/ChallengeScoreCard"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import { SplitWorkspace } from "@/components/frames/SplitWorkspace"

/**
 * `_ChallengePage` — the SRC TWIN of `.storybook/components/starci/pages/
 * ChallengePage/ChallengePage.tsx`. Presentational: typed props, already
 * resolved; no fetch/store/i18n (that's the connected half, `./index.tsx`).
 *
 * A screen owns a list of
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

// re-exported so the connected file (and anything downstream) can build data
// against the SAME types the blueprint's blocks define, rather than
// redeclaring shape that already exists.
export type {
    ChallengeDifficulty,
    ChallengeStatus,
    ChallengeBriefPrerequisiteItem,
    ChallengeBriefRequirementItem,
    ChallengeBriefStepItem,
    ChallengeBriefOutputItem,
    ChallengeDeliverableItem,
}

/** Props for {@link _ChallengePage}. */
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
const _ChallengePage = ({
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
            main={({ isSkeleton }: SkeletonProps) => <StackV gap={7} isSkeleton={isSkeleton} items={readColumn} />}
            aside={({ isSkeleton }: SkeletonProps) => <StackV gap={6} isSkeleton={isSkeleton} items={actColumn} />}
        />
    )

    return (
        <Container
            size="xl"
            padding={6}
            isSkeleton={isSkeleton}
            body={challengeBody}
            identity={{ tier: "page", component: "ChallengePage" }}
        />
    )
}

export { _ChallengePage }
