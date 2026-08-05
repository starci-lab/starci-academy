import type { Meta, StoryObj } from "@storybook/nextjs"
import { PersonalProjectWorkspace } from "@sb-components/starci/pages/PersonalProjectWorkspace/PersonalProjectWorkspace"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `PersonalProjectWorkspace`: the personal-project route group's own
 * content switch. See the component's file header for the full RULE 12
 * investigation (why this is a `pages/` screen, not a `layouts/` wrapper) and
 * for why this file is a thin dispatch rather than a rebuild of any content.
 *
 * THREE LEAVES, one per `view` — a STRUCTURAL fork (which of three disjoint
 * screens mounts), not a data state of one shape: `Dashboard` (`/personal-
 * project`), `Task` (`/personal-project/tasks/[taskId]`), `Result`
 * (`…/result`). Each leaf hands the real, untouched prop surface of the screen
 * it dispatches to straight through — this file invents no data shape of its
 * own.
 */
const meta: Meta<typeof PersonalProjectWorkspace> = {
    title: "StarCi/Pages/PersonalProjectWorkspace/PersonalProjectWorkspace",
    component: PersonalProjectWorkspace,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PersonalProjectWorkspace>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PersonalProjectDashboard": { tier: "block", role: "the `view=\"dashboard\"` body — capstone landing overview, mounted for the base `/personal-project` route", storyId: "starci-blocks-learn-personalprojectdashboard-personalprojectdashboard--full" },
    "PersonalProjectTaskPage": { tier: "screen", role: "the `view=\"task\"` body — read-left/act-right split for solving one task, mounted for `/personal-project/tasks/[taskId]`", storyId: "starci-pages-personalprojecttaskpage-personalprojecttaskpage--overview" },
    "PersonalProjectResultScreen": { tier: "block", role: "the `view=\"result\"` body — the graded-attempt verdict, mounted for `…/tasks/[taskId]/result`", storyId: "starci-blocks-learn-personalprojectresultscreen-personalprojectresultscreen--overview" },
}

/** LEAF — `view="dashboard"`: the capstone landing overview. */
export const Dashboard: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectWorkspace"
                tier="screen"
                leaf="view = &quot;dashboard&quot;"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "view = \"dashboard\"",
                        why: "The route carries no `taskId` (`/personal-project`), so the workspace mounts the capstone overview: next task, completion meter, and the current milestone's keep-going grid — the same body `PersonalProjectDashboard`'s own story shows, reached here through the route switch instead of directly.",
                        code: `<PersonalProjectWorkspace
    view="dashboard"
    title="Personal project"
    githubStatus={{ isConnected: true, label: "student/task-api · main" }}
    currentTask={{ sortIndex: 3, title: "Add tests for the DELETE route" }}
    onContinue={goToTask}
    milestoneLabel="Backend fundamentals"
    tasks={tasks}
    onSelectTask={goToTask}
    stats={{ done: 2, total: 6, attempts: 5, avgLabel: "18/20" }}
/>`,
                        render: (
                            <PersonalProjectWorkspace

                                view="dashboard"
                                breadcrumbItems={[{ key: "courses", label: "Courses" }, { key: "course", label: "Backend Mastery" }]}
                                title="Personal project"
                                description="Submit a real project instead of doing scattered exercises."
                                githubStatus={{ isConnected: true, label: "student/task-api · main" }}
                                currentTask={{ sortIndex: 3, title: "Add tests for the DELETE route" }}
                                onContinue={() => {}}
                                milestoneLabel="Backend fundamentals"
                                tasks={[
                                    { id: "t1", sortIndex: 1, title: "Build a CRUD API for Task", subtitleState: "done" },
                                    { id: "t2", sortIndex: 2, title: "Add pagination", subtitleState: "done" },
                                    { id: "t3", sortIndex: 3, title: "Add tests for the DELETE route", subtitleState: "active" },
                                    { id: "t4", sortIndex: 4, title: "Deploy to staging", subtitleState: "todo" },
                                ]}
                                onSelectTask={() => {}}
                                stats={{ done: 2, total: 6, attempts: 5, avgLabel: "18/20" }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `view="task"`: the read-left/act-right task split. */
export const Task: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectWorkspace"
                tier="screen"
                leaf="view = &quot;task&quot;"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "view = \"task\"",
                        why: "The route carries a `taskId` and does not end in `/result` (`/personal-project/tasks/[taskId]`), so the workspace mounts the task's own read/act split — the same body `PersonalProjectTaskPage`'s own story shows, reached here through the route switch instead of directly.",
                        code: `<PersonalProjectWorkspace
    view="task"
    task={{ title: "Add tests for the DELETE route", description: "…" }}
    brief={{ body: "…" }}
    relatedItems={related}
    relatedLabel="You might also want to read"
    submissionPanelProps={panelProps}
/>`,
                        render: (
                            <PersonalProjectWorkspace

                                view="task"
                                breadcrumbItems={[{ key: "courses", label: "Courses" }, { key: "milestone", label: "Backend fundamentals" }]}
                                task={{ title: "Add tests for the DELETE route", description: "Write an integration test for the task-delete route, including the case where the id doesn't exist." }}
                                brief={{ body: "Add test coverage for the `DELETE /tasks/:id` route, including when `id` doesn't exist (expect 404)." }}
                                relatedItems={[{ key: "r1", title: "Writing integration tests with Supertest", href: "#" }]}
                                relatedLabel="You might also want to read"
                                submissionPanelProps={{
                                    repoUrl: "https://github.com/student/task-api",
                                    onRepoUrlChange: () => {},
                                    settingsLangLabel: "TypeScript",
                                    settingsBranch: "main",
                                    onOpenSettings: () => {},
                                    onEvaluate: () => {},
                                    hasAttempts: true,
                                    onOpenFeedbackDetails: () => {},
                                    onOpenAttempts: () => {},
                                    result: { score: 18, maxScore: 20, isPassing: true, shortFeedback: "Covers most cases, still missing the double-delete case." },
                                }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `view="result"`: the graded-attempt verdict. */
export const Result: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PersonalProjectWorkspace"
                tier="screen"
                leaf="view = &quot;result&quot;"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "view = \"result\"",
                        why: "The route ends in `/result` (`/personal-project/tasks/[taskId]/result`), so the workspace mounts the graded verdict — the same body `PersonalProjectResultScreen`'s own story shows, reached here through the route switch instead of directly.",
                        code: `<PersonalProjectWorkspace
    view="result"
    title="Add tests for the DELETE route"
    attempts={attempts}
    selectedAttemptId="a2"
    onSelectAttempt={selectAttempt}
    scoreLabel="Result"
    isPassing
    findingsLabel="Feedback"
    findings={findings}
    relatedItems={related}
    relatedLabel="You might also want to read"
    nextTask={{ title: "Deploy to staging" }}
/>`,
                        render: (
                            <PersonalProjectWorkspace

                                view="result"
                                backLabel="Back to task"
                                onBack={() => {}}
                                title="Add tests for the DELETE route"
                                description="Write an integration test for the task-delete route."
                                attempts={[
                                    { id: "a1", attemptNumber: 1, score: 12, isPassing: false },
                                    { id: "a2", attemptNumber: 2, score: 18, isPassing: true },
                                ]}
                                selectedAttemptId="a2"
                                onSelectAttempt={() => {}}
                                attemptsAriaLabel="Submission attempts"
                                scoreLabel="Result"
                                score={18}
                                maxScore={20}
                                isPassing
                                shortFeedback="Covers most cases."
                                submissionUrl="https://github.com/student/task-api"
                                findingsLabel="Feedback"
                                findings={[]}
                                relatedItems={[]}
                                relatedLabel="You might also want to read"
                                nextTask={{ title: "Deploy to staging" }}
                                onGoToNextTask={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
