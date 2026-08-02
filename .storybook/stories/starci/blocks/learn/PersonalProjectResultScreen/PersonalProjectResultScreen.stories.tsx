import type { Meta, StoryObj } from "@storybook/nextjs"
import { PersonalProjectResultScreen } from "@sb-components/starci/blocks/learn/PersonalProjectResultScreen/PersonalProjectResultScreen"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PersonalProjectResultScreen` — what came back from grading one capstone task
 * attempt: near-total reuse of `ChallengeResultPage`'s blocks
 * (`SubmissionResultHeader`, `SubmissionAttemptSelector`, `SubmissionScoreCard`,
 * `SubmissionFindingsList`, `ContentRelatedList`), plus an inline capstone
 * "what's next" handoff card. The score cluster is conditional on an attempt being
 * selected (`NoSelection` shows two blocks, not five). The related-reading nudge
 * appears only on a failing attempt; the next-task handoff only on a passing one
 * with a `nextTask` set — the two never overlap.
 */
const meta: Meta<typeof PersonalProjectResultScreen> = {
    title: "StarCi/Blocks/Learn/PersonalProjectResultScreen/PersonalProjectResultScreen",
    component: PersonalProjectResultScreen,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PersonalProjectResultScreen>

const BASE = {
    backLabel: "Back to task",
    onBack: () => {},
    title: "Milestone 3 — Implement an async processing queue",
    description: "Build a worker queue that processes grading jobs, with retry and a dead-letter queue.",
    attempts: [
        { id: "a1", attemptNumber: 1, score: 58, isPassing: false },
        { id: "a2", attemptNumber: 2, score: 91, isPassing: true },
    ],
    selectedAttemptId: "a2",
    onSelectAttempt: () => {},
    attemptsAriaLabel: "Attempts",
    scoreLabel: "Result",
    score: 91,
    maxScore: 100,
    shortFeedback: "Queue and retry logic are on the right track; the dead-letter queue is handled cleanly.",
    submissionUrl: "https://github.com/starci-academy/capstone-submissions/tree/main/attempt-2",
    gradedByModel: "qwen2.5-coder-32b",
    modelCategory: "economy" as const,
    timeAgo: "12 minutes ago",
    findingsLabel: "Feedback",
    findings: [
        {
            id: "f1",
            message: "No limit on retry attempts for a failing job",
            detail: "A job that keeps failing will retry indefinitely, tying up all the workers.",
            suggestion: "Add `maxAttempts` and push the job to the dead-letter queue once it exceeds the threshold.",
            location: "src/queue/worker.service.ts",
            severity: "medium" as const,
        },
    ],
    repositoryUrl: "https://github.com/starci-academy/capstone-submissions",
    relatedLabel: "You might want to revisit",
    relatedItems: [
        { key: "queues", title: "Why you need a dead-letter queue", snippet: "A job that keeps failing will clog the entire queue if it isn't isolated.", href: "#queues" },
    ],
    nextTask: { title: "Milestone 4 — Add idempotency to the payment processing job" },
    onGoToNextTask: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame that owns every seam on this screen — between the header, the attempt row, and the score/findings/handoff cluster", storyId: "frames-stack-stackv--default" },
    "SubmissionResultHeader": { tier: "block", role: "where am I, how do I leave — the back-link and the graded task's title/description", storyId: "starci-blocks-learn-submissionresultheader-submissionresultheader--header" },
    "SubmissionAttemptSelector": { tier: "block", role: "which graded attempt is being looked at, verdict-at-a-glance per attempt", storyId: "starci-blocks-learn-submissionattemptselector-submissionattemptselector--attempt-row" },
    "SubmissionScoreCard": { tier: "block", role: "how the selected attempt did — the score, the verdict, who graded it", storyId: "starci-blocks-learn-submissionscorecard-submissionscorecard--score-card" },
    "SubmissionFindingsList": { tier: "block", role: "what to fix — the selected attempt's findings, severity-sorted", storyId: "starci-blocks-learn-submissionfindingslist-submissionfindingslist--findings-accordion" },
    "ContentRelatedList": { tier: "block", role: "a quiet nudge toward more reading, shown only on a failing attempt", storyId: "starci-blocks-learn-contentrelatedlist-contentrelatedlist--full" },
    "SurfaceCard": { tier: "composite", role: "the highlight card face for the next-task handoff — isHighlight marks it as the one thing to look at once a milestone closes", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackH": { tier: "frame", role: "the handoff card's own row — eyebrow+title on one side, the forward CTA on the other", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the handoff card's own text — its eyebrow or the next task's title, real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "Button": { tier: "atom", role: "the handoff card's forward CTA, the only pressable part this new card owns", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — no attempt selected yet ⇒ the score/findings/handoff cluster is absent, not empty. */
export const NoSelection: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectResultScreen"
                tier="block"
                leaf="NoSelection"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "selectedAttemptId = undefined",
                        why: "Only the identity header and the attempt row draw — nothing about \"how did it go\" can render before the reader has actually picked an attempt to look at, so the whole score/findings/handoff cluster is absent rather than shown empty.",
                        code: `<PersonalProjectResultScreen
    {...props}
    selectedAttemptId={undefined}
/>`,
                        render: <PersonalProjectResultScreen {...BASE} selectedAttemptId={undefined} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a PASSING attempt with a next task queued ⇒ score + findings + the next-task handoff, no related-reading nudge. */
export const Passing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectResultScreen"
                tier="block"
                leaf="Passing"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isPassing = true, nextTask set",
                        why: "The selected attempt cleared the pass bar: the score card reads green, findings still show whatever quality-gate notes exist, the related-reading nudge is gone, and in its place the next-task handoff card appears — the one moment a forward pointer to the next milestone earns its place.",
                        code: `<PersonalProjectResultScreen
    {...props}
    isPassing
    nextTask={{ title: "Milestone 4 — Add idempotency to the payment processing job" }}
/>`,
                        render: <PersonalProjectResultScreen {...BASE} isPassing />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a FAILING attempt ⇒ score + findings + related-reading nudge, no next-task handoff. */
export const Failing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectResultScreen"
                tier="block"
                leaf="Failing"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isPassing = false",
                        why: "The selected attempt fell short of the pass bar: the score card reads red, the related-reading nudge appears underneath the findings, and the next-task handoff never renders — there is no next milestone to hand the learner off to until this one actually passes.",
                        code: `<PersonalProjectResultScreen
    {...props}
    isPassing={false}
    score={58}
/>`,
                        render: <PersonalProjectResultScreen {...BASE} isPassing={false} score={58} selectedAttemptId="a1" />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a PASSING attempt with no next task queued ⇒ neither the related-reading nudge nor the handoff appears. */
export const PassingNoNextTask: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectResultScreen"
                tier="block"
                leaf="PassingNoNextTask"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isPassing = true, nextTask = undefined",
                        why: "The attempt passed, but there is no further milestone queued yet (the capstone's last one, or the next one not unlocked yet) — `nextTask` stays unset, so the handoff card never renders rather than pointing the learner at nothing.",
                        code: `<PersonalProjectResultScreen
    {...props}
    isPassing
    nextTask={undefined}
/>`,
                        render: <PersonalProjectResultScreen {...BASE} isPassing nextTask={undefined} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block mirrors, including the still-absent cluster. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectResultScreen"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block mirrors itself, and the score/findings/handoff cluster reserves its height even though no attempt id has been selected yet — the same reasoning ChallengeResultPage documents for its own cluster, so the page does not jump once the first attempt actually lands.",
                        code: "<PersonalProjectResultScreen {...props} isSkeleton />",
                        render: (
                            <PersonalProjectResultScreen
                                {...BASE}
                               
                                isSkeleton
                                isPassing
                                selectedAttemptId={undefined}
                                findings={[]}
                                relatedItems={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
