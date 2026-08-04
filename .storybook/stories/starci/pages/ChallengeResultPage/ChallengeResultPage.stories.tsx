import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeResultPage } from "@sb-components/starci/pages/ChallengeResultPage/ChallengeResultPage"
import type { SubmissionAttemptRecord } from "@sb-components/starci/overlays/drawers/SubmissionAttemptsDrawer/SubmissionAttemptsDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChallengeResultPage` — the screen showing what came back from grading one
 * challenge submission. A screen owns a list of functions: it calls blocks,
 * places them in frames, and hands each typed data. Four functions, in reading
 * order: where am I / how do I leave · which attempt am I looking at · how did
 * this attempt do · what should I fix, plus a nudge toward more reading on a
 * failing attempt. The score cluster is conditional on an attempt being
 * selected (`NoSelection` shows two blocks, not four); the related-reading
 * nudge appears only on a failing attempt (`Passing` vs `Failing`); the "+N"
 * overflow trigger opens `SubmissionResultHistoryDrawer` (`WithHistory`).
 */
const meta: Meta<typeof ChallengeResultPage> = {
    title: "StarCi/Pages/ChallengeResultPage/ChallengeResultPage",
    component: ChallengeResultPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeResultPage>

const BASE = {
    backLabel: "Back to challenge",
    onBack: () => {},
    title: "Implement a paginated API for the course list",
    description: "Write a GET /courses endpoint supporting cursor pagination, with tests for the first/last page.",
    attempts: [
        { id: "a1", attemptNumber: 1, score: 54, isPassing: false },
        { id: "a2", attemptNumber: 2, score: 88, isPassing: true },
    ],
    selectedAttemptId: "a2",
    onSelectAttempt: () => {},
    attemptsAriaLabel: "Attempts",
    scoreLabel: "Result",
    score: 88,
    maxScore: 100,
    passScore: 70,
    shortFeedback: "Cursor pagination is on the right track; still missing a test for the last page.",
    submissionUrl: "#submission",
    gradedByModel: "qwen2.5-coder-32b",
    modelCategory: "low" as const,
    timeAgo: "5 minutes ago",
    findingsLabel: "Feedback",
    findings: [
        {
            id: "f1",
            message: "Missing a test for the last page of the list",
            detail: "Cursor pagination needs a dedicated test for the case where `hasNextPage` returns `false`.",
            suggestion: "Add a test case with the cursor pointing at the last record.",
            location: "src/courses/courses.controller.spec.ts",
            severity: "medium" as const,
        },
        {
            id: "f2",
            message: "Cursor isn't encoded, exposing internal ids",
            location: "src/courses/courses.service.ts",
            severity: "high" as const,
            sortIndex: 1,
        },
    ],
    repositoryUrl: "https://github.com/starci-academy/challenge-submissions",
    relatedLabel: "You might want to revisit",
    relatedItems: [
        { key: "cursor", title: "How cursor pagination works", snippet: "Why offset pagination gets slower as tables grow.", href: "#cursor" },
    ],
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame that owns every seam on this screen — between the header, the attempt row, and the score/findings cluster", storyId: "frames-stack-stackv--default" },
    "SubmissionResultHeader": { tier: "block", role: "where am I, how do I leave — the back-link and the graded requirement's title/description", storyId: "starci-blocks-learn-submissionresultheader-submissionresultheader--header" },
    "SubmissionAttemptSelector": { tier: "block", role: "which graded attempt is being looked at, verdict-at-a-glance per attempt", storyId: "starci-blocks-learn-submissionattemptselector-submissionattemptselector--attempt-row" },
    "SubmissionScoreCard": { tier: "block", role: "how the selected attempt did — the score, the verdict, who graded it", storyId: "starci-blocks-learn-submissionscorecard-submissionscorecard--score-card" },
    "SubmissionFindingsList": { tier: "block", role: "what to fix — the selected attempt's findings, severity-sorted", storyId: "starci-blocks-learn-submissionfindingslist-submissionfindingslist--findings-accordion" },
    "ContentRelatedList": { tier: "block", role: "a quiet nudge toward more reading, shown only on a failing attempt", storyId: "starci-blocks-learn-contentrelatedlist-contentrelatedlist--full" },
    "SubmissionAttemptsDrawer": { tier: "block", role: "the full paginated attempt history, opened over this screen when the selector row's \"+N\" overflow trigger fires", storyId: "starci-overlays-drawers-submissionattemptsdrawer-submissionattemptsdrawer--default" },
}

/** LEAF — no attempt selected yet ⇒ the score/findings cluster is absent, not empty. */
export const NoSelection: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeResultPage"
                tier="screen"
                leaf="NoSelection"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "selectedAttemptId = undefined",
                        why: "Only the identity header and the attempt row draw — nothing about \"how did it go\" can render before the reader has actually picked an attempt to look at, so the whole score/findings cluster is absent rather than shown empty.",
                        code: `<ChallengeResultPage
    {...props}
    selectedAttemptId={undefined}
/>`,
                        render: <ChallengeResultPage {...BASE} selectedAttemptId={undefined} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a PASSING attempt ⇒ score + findings, no related-reading nudge. */
export const Passing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeResultPage"
                tier="screen"
                leaf="Passing"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isPassing = true",
                        why: "The selected attempt cleared the pass bar: the score card reads green, findings still show whatever quality-gate notes exist, and the related-reading nudge is gone — there is nothing left to point the reader back toward.",
                        code: `<ChallengeResultPage
    {...props}
    isPassing
/>`,
                        render: <ChallengeResultPage {...BASE} isPassing />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a FAILING attempt ⇒ score + findings + related-reading nudge. */
export const Failing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeResultPage"
                tier="screen"
                leaf="Failing"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isPassing = false",
                        why: "The selected attempt fell short of the pass bar: the score card reads red with a \"needs N more points\" line, and the related-reading nudge appears underneath the findings — the one moment a pointer to relevant material earns its place.",
                        code: `<ChallengeResultPage
    {...props}
    isPassing={false}
    score={54}
/>`,
                        render: <ChallengeResultPage {...BASE} isPassing={false} score={54} selectedAttemptId="a1" />,
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
                name="ChallengeResultPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block mirrors itself, and the score/findings cluster reserves its height even though no attempt id has been selected yet — the same reasoning ContentPage documents for its own footer, so the page does not jump once the first attempt actually lands.",
                        code: "<ChallengeResultPage {...props} isSkeleton />",
                        render: <ChallengeResultPage {...BASE} isSkeleton selectedAttemptId={undefined} findings={[]} relatedItems={[]} />,
                    },
                ]}
            />
        </div>
    ),
}

// 8 attempts total — the row shows the newest 5 (real `src`'s own
// `ATTEMPT_CHIPS_VISIBLE`), "+3" opens the drawer over the FULL 8.
const HISTORY_ATTEMPTS: Array<SubmissionAttemptRecord> = [
    { id: "a8", attemptNumber: 8, score: 88, maxScore: 100, isPassing: true, processedTimeAgo: "5 minutes ago", gradedByModel: "qwen2.5-coder-32b", modelCategory: "low" },
    { id: "a7", attemptNumber: 7, score: 61, maxScore: 100, isPassing: false, processedTimeAgo: "3 hours ago" },
    { id: "a6", attemptNumber: 6, score: 54, maxScore: 100, isPassing: false, processedTimeAgo: "1 day ago" },
    { id: "a5", attemptNumber: 5, score: 40, maxScore: 100, isPassing: false, processedTimeAgo: "2 days ago" },
    { id: "a4", attemptNumber: 4, score: null, maxScore: null, isPassing: false },
    { id: "a3", attemptNumber: 3, score: 33, maxScore: 100, isPassing: false, processedTimeAgo: "4 days ago" },
    { id: "a2", attemptNumber: 2, score: 20, maxScore: 100, isPassing: false, processedTimeAgo: "5 days ago" },
    { id: "a1", attemptNumber: 1, score: 10, maxScore: 100, isPassing: false, processedTimeAgo: "6 days ago" },
]

/** Local controlled wrapper — the "+N" trigger opens the drawer, a row selection closes it. */
const WithHistoryExample = () => {
    const [historyOpen, setHistoryOpen] = useState(true)
    const [selectedId, setSelectedId] = useState("a8")
    return (
        <ChallengeResultPage
            {...BASE}
           
            selectedAttemptId={selectedId}
            onSelectAttempt={setSelectedId}
            attempts={HISTORY_ATTEMPTS.slice(0, 5)}
            overflowCount={HISTORY_ATTEMPTS.length - 5}
            onOverflowPress={() => setHistoryOpen(true)}
            isHistoryOpen={historyOpen}
            onHistoryOpenChange={setHistoryOpen}
            historyAttempts={HISTORY_ATTEMPTS}
        />
    )
}

/** LEAF ⭐ — 8 attempts overflow the selector row; "+N" opens the real history drawer. */
export const WithHistory: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeResultPage"
                tier="screen"
                leaf="WithHistory"
                parts={[]}
                annotate={ANNOTATE}
                reason="8 recorded attempts is past the 5 the selector row shows inline, so a `+3` trigger appears at the end of the row — pressing it (or, here, the drawer opening by default so the anatomy panel can badge it) opens `SubmissionAttemptsDrawer` over the FULL 8-attempt history, paginated 6-per-page by the drawer itself. Selecting a row there closes the drawer and updates the selected attempt, exactly the one gesture real `src` uses."
                states={[
                    {
                        name: "8 attempts, drawer open, page 1 of 2",
                        why: "The drawer receives the FULL `historyAttempts` array (not the row's sliced `attempts`), so it paginates on its own — 6 of the 8 attempts show, and the pager reaches the 2 held back. The row behind it still shows only its own 5 + the `+3` trigger.",
                        code: `<ChallengeResultPage
    {...props}
    attempts={visibleAttempts}
    overflowCount={3}
    onOverflowPress={() => setHistoryOpen(true)}
    isHistoryOpen={historyOpen}
    onHistoryOpenChange={setHistoryOpen}
    historyAttempts={allAttempts}
/>`,
                        render: <WithHistoryExample />,
                    },
                ]}
            />
        </div>
    ),
}
