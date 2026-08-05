import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengePage } from "@sb-components/starci/pages/ChallengePage/ChallengePage"
import type { ChallengeDeliverableItem } from "@sb-components/starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
const meta: Meta<typeof ChallengePage> = {
    title: "StarCi/Pages/ChallengePage/ChallengePage",
    component: ChallengePage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengePage>

const PREREQUISITES = [
    { key: "prereq-1", body: "Node.js 20 or later installed" },
    { key: "prereq-2", body: "A GitHub account, and you know how to create a new repo" },
]

const REQUIREMENTS = [
    {
        key: "req-1",
        title: "Build a CRUD API for Task",
        points: 40,
        body: "Build a REST API `/tasks` supporting create, read, update, delete — each route returns the correct HTTP status code.",
    },
    {
        key: "req-2",
        title: "Write tests for each route",
        points: 30,
        body: "At least one integration test per route, runnable with `npm test`.",
    },
]

const STEPS = [
    { key: "step-1", title: "Initialize the project", body: "Run `npm init`, then install Express and TypeORM." },
    { key: "step-2", body: "Define the `Task` entity with fields `title`, `done`, `createdAt`." },
]

const OUTPUTS = [
    { key: "out-1", body: "`GET /tasks` returns a JSON array of existing tasks" },
    { key: "out-2", body: "`POST /tasks` returns the newly created task along with its `id`" },
]

const HINT = "If a route returns 500 during testing, check whether you `await`ed the migration before the server started listening for requests."

const TODO_DELIVERABLES: Array<ChallengeDeliverableItem> = [
    {
        id: "api-design",
        title: "Build a CRUD API for Task",
        points: 40,
        status: "todo",
        description: "Sketch the **resource** diagram and list the method/status code for each endpoint.",
        url: "",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
    {
        id: "unit-test",
        title: "Write tests for each route",
        points: 30,
        status: "todo",
        description: "At least one integration test per route, runnable with `npm test`.",
        url: "",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
]

const GRADED_DELIVERABLES: Array<ChallengeDeliverableItem> = [
    {
        id: "api-design",
        title: "Build a CRUD API for Task",
        points: 40,
        status: "done",
        description: "Sketch the **resource** diagram and list the method/status code for each endpoint.",
        url: "https://github.com/learner/task-api",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
        graded: {
            verdict: "pass",
            earnedScore: 40,
            requiredScore: 32,
            attemptNumber: 1,
            processedAt: "5:24 PM Jun 23",
            shortFeedback: "All four CRUD routes present, status codes match spec.",
        },
    },
    {
        id: "unit-test",
        title: "Write tests for each route",
        points: 30,
        status: "failed",
        description: "At least one integration test per route, runnable with `npm test`.",
        url: "https://github.com/learner/task-api/pull/3",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
        graded: {
            verdict: "fail",
            earnedScore: 12,
            requiredScore: 24,
            attemptNumber: 2,
            processedAt: "6:44 PM Jun 23",
            shortFeedback: "The test suite doesn't cover the delete route's nonexistent-id branch.",
        },
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SplitWorkspace": { tier: "frame", role: "the read-column + sticky-aside workspace — stacked below @app-xl, side-by-side (`min-w-0 flex-1` beside a `w-[360px]` sticky rail) from @app-xl up", storyId: "frames-splitworkspace-splitworkspace--default" },
    "StackV": { tier: "frame", role: "one column's own vertical rhythm — the read column (header above brief) or the act column (deliverables above the score card)", storyId: "frames-stack-stackv--default" },
    "ChallengeHeader": { tier: "block", role: "what this challenge is: back link, title, description, and score/difficulty/status", storyId: "starci-blocks-learn-challengeheader-challengeheader--default" },
    "ChallengeBrief": { tier: "block", role: "the challenge brief — prerequisites, requirements, guided steps, expected outputs, hint", storyId: "starci-blocks-learn-challengebrief-challengebrief--full" },
    "ChallengeDeliverableList": { tier: "block", role: "submit each requirement's repo URL and see its graded verdict; grading-settings trigger lives in its header", storyId: "starci-blocks-learn-challengedeliverablelist-challengedeliverablelist--full" },
    "ChallengeScoreCard": { tier: "block", role: "the roll-up earned/max score read against the pass line", storyId: "starci-blocks-learn-challengescorecard-challengescorecard--full" },
}

/** LEAF — a fresh challenge: no attempt yet, every deliverable still `todo`. */
export const NotAttempted: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengePage"
                tier="screen"
                leaf="Not attempted"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "status = undefined, deliverables = todo, earnedScore = 0",
                        why: "The learner has never submitted anything for this challenge, so the header shows no status chip, every deliverable row sits at `todo` with an empty URL field, and the score card reads 0 against the pass line. Every one of the five functions is present — only the numbers say nothing has happened yet.",
                        code: `<ChallengePage
    onBackPress={goBack}
    title="Build a Task management REST API"
    difficulty="medium"
    deliverables={deliverables}
    earnedScore={0}
    maxScore={70}
    passThreshold={0.8}
    …
/>`,
                        render: (
                            <ChallengePage

                                onBackPress={() => {}}
                                title="Build a Task management REST API"
                                description="Build a CRUD REST API for the Task resource, with tests, and deploy it to staging."
                                scoreValue={70}
                                difficulty="medium"
                                prerequisites={PREREQUISITES}
                                requirements={REQUIREMENTS}
                                steps={STEPS}
                                outputs={OUTPUTS}
                                hint={HINT}
                                deliverables={TODO_DELIVERABLES}
                                onOpenGradingSettings={() => {}}
                                earnedScore={0}
                                maxScore={70}
                                passThreshold={0.8}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a graded attempt: one requirement passed, one failed with feedback. */
export const Graded: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengePage"
                tier="screen"
                leaf="Graded"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "status = failed, one deliverable passed, one failed with feedback",
                        why: "The header's status chip reads the OVERALL attempt (failed — not every requirement cleared), while each deliverable row carries its OWN verdict independently: the API requirement passed, the test requirement did not and shows its feedback. The score card's total (52/70) sits below the pass line even though one requirement individually passed — the same 'passing needs every requirement' fact its caption states.",
                        code: `<ChallengePage
    …
    status="failed"
    deliverables={gradedDeliverables}
    earnedScore={52}
    maxScore={70}
    passThreshold={0.8}
/>`,
                        render: (
                            <ChallengePage

                                onBackPress={() => {}}
                                title="Build a Task management REST API"
                                description="Build a CRUD REST API for the Task resource, with tests, and deploy it to staging."
                                scoreValue={70}
                                difficulty="medium"
                                status="failed"
                                prerequisites={PREREQUISITES}
                                requirements={REQUIREMENTS}
                                steps={STEPS}
                                outputs={OUTPUTS}
                                hint={HINT}
                                deliverables={GRADED_DELIVERABLES}
                                onOpenGradingSettings={() => {}}
                                earnedScore={52}
                                maxScore={70}
                                passThreshold={0.8}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF * — the evidence for `SplitWorkspace`'s axis switch, same 3 widths as
 * `ContentPage`'s "Practice nudge — responsive" leaf. Same data as
 * `NotAttempted` at every width — only the container changes.
 */
export const Responsive: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengePage"
                tier="screen"
                leaf="Responsive"
                parts={[]}
                annotate={ANNOTATE}
                reason="Real `src`'s `ChallengeView` stacks the read/act columns below `@app-xl` (1280px) and only goes side-by-side from there up — a mobile or tablet reader never sees the two columns crowd each other. `SplitWorkspace` owns that exact switch now; these 3 widths are the proof."
                states={[
                    {
                        name: "Mobile — 375px (stacked)",
                        why: "Below @app-xl the brief renders first at full width, then the deliverables + score card follow directly below it — the same single-column reading order as any other mobile screen, not a squeezed two-up layout.",
                        code: `<div style={{ width: 375 }}>
    <ChallengePage {...props} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 375 }}>
                                <ChallengePage
                                    onBackPress={() => {}}
                                    title="Build a Task management REST API"
                                    description="Build a CRUD REST API for the Task resource, with tests, and deploy it to staging."
                                    scoreValue={70}
                                    difficulty="medium"
                                    prerequisites={PREREQUISITES}
                                    requirements={REQUIREMENTS}
                                    steps={STEPS}
                                    outputs={OUTPUTS}
                                    hint={HINT}
                                    deliverables={TODO_DELIVERABLES}
                                    onOpenGradingSettings={() => {}}
                                    earnedScore={0}
                                    maxScore={70}
                                    passThreshold={0.8}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "Tablet — 768px (still stacked)",
                        why: "768px is still below the `@app-xl` (1280px) step, so the columns stay stacked — this is the exact width the old `StackH…wrap` stand-in got wrong: its `min-w-0 flex-1` reading column let it keep squeezing beside the aside instead of dropping below it.",
                        code: `<div style={{ width: 768 }}>
    <ChallengePage {...props} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 768 }}>
                                <ChallengePage
                                    onBackPress={() => {}}
                                    title="Build a Task management REST API"
                                    description="Build a CRUD REST API for the Task resource, with tests, and deploy it to staging."
                                    scoreValue={70}
                                    difficulty="medium"
                                    prerequisites={PREREQUISITES}
                                    requirements={REQUIREMENTS}
                                    steps={STEPS}
                                    outputs={OUTPUTS}
                                    hint={HINT}
                                    deliverables={TODO_DELIVERABLES}
                                    onOpenGradingSettings={() => {}}
                                    earnedScore={0}
                                    maxScore={70}
                                    passThreshold={0.8}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "Desktop — 1280px (side by side)",
                        why: "At the `@app-xl` step the brief and the deliverables/score sit side by side — the brief column grows against the sticky 360px aside, matching real `src`'s `ChallengeView` exactly. This is the ONE width where the split is correct; everything narrower reads as one column.",
                        code: `<div style={{ width: 1280 }}>
    <ChallengePage {...props} />
</div>`,
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 1280 }}>
                                <ChallengePage
                                    onBackPress={() => {}}
                                    title="Build a Task management REST API"
                                    description="Build a CRUD REST API for the Task resource, with tests, and deploy it to staging."
                                    scoreValue={70}
                                    difficulty="medium"
                                    prerequisites={PREREQUISITES}
                                    requirements={REQUIREMENTS}
                                    steps={STEPS}
                                    outputs={OUTPUTS}
                                    hint={HINT}
                                    deliverables={TODO_DELIVERABLES}
                                    onOpenGradingSettings={() => {}}
                                    earnedScore={0}
                                    maxScore={70}
                                    passThreshold={0.8}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block mirrors itself. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengePage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block that can mirror itself does — the flag flows straight down into `ChallengeHeader`, `ChallengeBrief`, `ChallengeDeliverableList` and `ChallengeScoreCard`, and each draws its own resting shape. `deliverables` still carries the real rows (only shimmering) so the accordion keeps the same row count instead of collapsing to zero — the same reason `ChallengeDeliverableList`'s own skeleton story keeps its items. The two-column layout keeps its shape too, so nothing reflows once the challenge entity lands.",
                        code: "<ChallengePage {...props} isSkeleton />",
                        render: (
                            <ChallengePage

                                onBackPress={() => {}}
                                title="Build a Task management REST API"
                                description="Build a CRUD REST API for the Task resource, with tests, and deploy it to staging."
                                scoreValue={70}
                                difficulty="medium"
                                prerequisites={PREREQUISITES}
                                requirements={REQUIREMENTS}
                                steps={STEPS}
                                outputs={OUTPUTS}
                                hint={HINT}
                                deliverables={TODO_DELIVERABLES}
                                onOpenGradingSettings={() => {}}
                                earnedScore={0}
                                maxScore={70}
                                passThreshold={0.8}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
