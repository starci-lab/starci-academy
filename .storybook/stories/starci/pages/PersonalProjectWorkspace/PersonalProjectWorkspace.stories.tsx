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
        <div className="p-8">
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
    title="Dự án cá nhân"
    githubStatus={{ isConnected: true, label: "hocvien/task-api · main" }}
    currentTask={{ sortIndex: 3, title: "Thêm test cho route DELETE" }}
    onContinue={goToTask}
    milestoneLabel="Backend cơ bản"
    tasks={tasks}
    onSelectTask={goToTask}
    stats={{ done: 2, total: 6, attempts: 5, avgLabel: "18/20" }}
/>`,
                        render: (
                            <PersonalProjectWorkspace
                                showAnatomy
                                view="dashboard"
                                breadcrumbItems={[{ key: "courses", label: "Khoá học" }, { key: "course", label: "Backend Mastery" }]}
                                title="Dự án cá nhân"
                                description="Nộp một dự án thật thay vì làm bài tập rời rạc."
                                githubStatus={{ isConnected: true, label: "hocvien/task-api · main" }}
                                currentTask={{ sortIndex: 3, title: "Thêm test cho route DELETE" }}
                                onContinue={() => {}}
                                milestoneLabel="Backend cơ bản"
                                tasks={[
                                    { id: "t1", sortIndex: 1, title: "Dựng API CRUD cho Task", subtitleState: "done" },
                                    { id: "t2", sortIndex: 2, title: "Thêm phân trang", subtitleState: "done" },
                                    { id: "t3", sortIndex: 3, title: "Thêm test cho route DELETE", subtitleState: "active" },
                                    { id: "t4", sortIndex: 4, title: "Triển khai lên staging", subtitleState: "todo" },
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
        <div className="p-8">
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
    task={{ title: "Thêm test cho route DELETE", description: "…" }}
    brief={{ body: "…" }}
    relatedItems={related}
    relatedLabel="Có thể bạn muốn đọc"
    submissionPanelProps={panelProps}
/>`,
                        render: (
                            <PersonalProjectWorkspace
                                showAnatomy
                                view="task"
                                breadcrumbItems={[{ key: "courses", label: "Khoá học" }, { key: "milestone", label: "Backend cơ bản" }]}
                                task={{ title: "Thêm test cho route DELETE", description: "Viết integration test cho route xoá task, bao gồm cả trường hợp id không tồn tại." }}
                                brief={{ body: "Thêm test bao phủ route `DELETE /tasks/:id`, kể cả khi `id` không tồn tại (kỳ vọng 404)." }}
                                relatedItems={[{ key: "r1", title: "Viết integration test với Supertest", href: "#" }]}
                                relatedLabel="Có thể bạn muốn đọc"
                                submissionPanelProps={{
                                    repoUrl: "https://github.com/hocvien/task-api",
                                    onRepoUrlChange: () => {},
                                    settingsLangLabel: "TypeScript",
                                    settingsBranch: "main",
                                    onOpenSettings: () => {},
                                    onEvaluate: () => {},
                                    hasAttempts: true,
                                    onOpenFeedbackDetails: () => {},
                                    onOpenAttempts: () => {},
                                    result: { score: 18, maxScore: 20, isPassing: true, shortFeedback: "Đã bao phủ hầu hết trường hợp, còn thiếu case xoá hai lần liên tiếp." },
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
        <div className="p-8">
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
    title="Thêm test cho route DELETE"
    attempts={attempts}
    selectedAttemptId="a2"
    onSelectAttempt={selectAttempt}
    scoreLabel="Kết quả"
    isPassing
    findingsLabel="Góp ý"
    findings={findings}
    relatedItems={related}
    relatedLabel="Có thể bạn muốn đọc"
    nextTask={{ title: "Triển khai lên staging" }}
/>`,
                        render: (
                            <PersonalProjectWorkspace
                                showAnatomy
                                view="result"
                                backLabel="Quay lại nhiệm vụ"
                                onBack={() => {}}
                                title="Thêm test cho route DELETE"
                                description="Viết integration test cho route xoá task."
                                attempts={[
                                    { id: "a1", attemptNumber: 1, score: 12, isPassing: false },
                                    { id: "a2", attemptNumber: 2, score: 18, isPassing: true },
                                ]}
                                selectedAttemptId="a2"
                                onSelectAttempt={() => {}}
                                attemptsAriaLabel="Các lượt nộp"
                                scoreLabel="Kết quả"
                                score={18}
                                maxScore={20}
                                isPassing
                                shortFeedback="Đã bao phủ hầu hết trường hợp."
                                submissionUrl="https://github.com/hocvien/task-api"
                                findingsLabel="Góp ý"
                                findings={[]}
                                relatedItems={[]}
                                relatedLabel="Có thể bạn muốn đọc"
                                nextTask={{ title: "Triển khai lên staging" }}
                                onGoToNextTask={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
