import React from "react"
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
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `ChallengePage`: solve one challenge.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide.
 *
 * FIVE FUNCTIONS, split across a read column and an act column, mirroring the
 * real `src/.../Challenge/ChallengeView` split ("read a brief, submit a repo,
 * get AI-graded") — READ: (1) what this challenge is — score, difficulty, the
 * learner's own status; (2) the brief itself — prerequisites, requirements,
 * guided steps, expected outputs, hint. ACT: (3) submit each requirement's repo
 * URL and see its graded verdict + feedback; (4) reopen grading settings (the
 * language picker) as a chrome trigger; (5) the roll-up score against the pass
 * line.
 *
 * TWO COLUMNS, NOT ONE. `src`'s `ChallengeView` is explicit about this being a
 * SPLIT WORKSPACE, not a single reading column with a card bolted to the
 * bottom: the read column and the act column answer different questions ("what
 * do I need to do" vs "how did it go / let me try"), so `ChallengeDeliverableList`
 * + `ChallengeScoreCard` sit in their own track beside the brief instead of
 * being appended under it. Composed with `SplitWorkspace` (§ layout khung,
 * 2026-07-29) — `min-w-0 flex-1` reading column beside a `shrink-0 w-[360px]`
 * sticky aside, STACKED (mobile/tablet) → `@app-xl:flex-row` (desktop) —
 * matching `src`'s own responsive axis exactly (was `StackH…wrap`, a fixed
 * horizontal axis that never actually stacked below desktop; thầy caught the
 * render forcing side-by-side even on mobile). `Container size="xl"` (not the
 * `md` a single-column screen like `ContentPage`/`CourseContents` uses) is
 * what actually buys the room: at `md` (48rem) the two columns would fight
 * each other for space the moment `ChallengeDeliverableList`'s card face
 * wants to breathe.
 *
 * ⚠️ SCOPE OF THIS PASS, inherited from `ChallengeDeliverableList`'s own file
 * header: the grading-settings drawer (language picker + private-repo token,
 * `src`'s `Drawer`) is NOT built. `onOpenGradingSettings` is wired as a chrome
 * trigger only — leaving the drawer's content as a gap is the honest state,
 * not a stub that renders nothing real (§B3).
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    showAnatomy = false,
}: ChallengePageProps) => {
    const readColumn = (
        <>
            <ChallengeHeader
                anatPart="ChallengeHeader"
                onBackPress={onBackPress}
                backLabel={backLabel}
                title={title}
                description={description}
                scoreValue={scoreValue}
                difficulty={difficulty}
                status={status}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <ChallengeBrief
                anatPart="ChallengeBrief"
                prerequisites={prerequisites}
                requirements={requirements}
                steps={steps}
                outputs={outputs}
                hint={hint}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const actColumn = (
        <>
            <ChallengeDeliverableList
                anatPart="ChallengeDeliverableList"
                items={deliverables}
                onOpenGradingSettings={onOpenGradingSettings}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <ChallengeScoreCard
                anatPart="ChallengeScoreCard"
                earnedScore={earnedScore}
                maxScore={maxScore}
                passThreshold={passThreshold}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const challengeBody = (
        <SplitWorkspace
            anatPart={showAnatomy ? "SplitWorkspace" : undefined}
            main={<StackV gap="page" anatPart={showAnatomy ? "StackV" : undefined} body={readColumn} />}
            aside={<StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={actColumn} />}
        />
    )

    return <Container size="xl" padding="roomy" body={challengeBody} />
}

export { ChallengePage }
