import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengePage } from "@sb-components/starci/pages/ChallengePage/ChallengePage"
import type { ChallengeDeliverableItem } from "@sb-components/starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `ChallengePage`: solve one challenge.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data — every `div` here would be a
 * shape it had no right to decide.
 *
 * FIVE FUNCTIONS, split across a read column and an act column: (1) what this
 * challenge is — score, difficulty, the learner's own status; (2) the brief
 * itself; (3) submit each requirement and see its graded verdict; (4) reopen
 * grading settings, chrome trigger only; (5) the roll-up score against the
 * pass line.
 *
 * ⭐ TWO COLUMNS, composed with `SplitWorkspace` (§ layout khung, 2026-07-29):
 * `min-w-0 flex-1` reading column beside a `shrink-0 w-[360px]` sticky aside
 * — STACKED (mobile/tablet) → `@app-xl:flex-row` (desktop only), matching
 * real `src`'s `ChallengeView` exactly. Was `StackH…wrap`, a FIXED horizontal
 * axis that never actually stacked below desktop — thầy caught the render
 * forcing side-by-side even on mobile ("desktop là phải render flex chứ
 * nhỉ?"); see the `Responsive` leaf below for the 3-width proof. `Container
 * size="xl"` (not the `md` a single-column screen uses) is what buys the two
 * columns enough room to sit side by side without crowding each other.
 *
 * ⚠️ SCOPE OF THIS PASS: the grading-settings drawer (language picker +
 * private-repo token) is NOT built — `onOpenGradingSettings` is a chrome
 * trigger only, same scope cut `ChallengeDeliverableList` already documents.
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
    { key: "prereq-1", body: "Đã cài Node.js 20 trở lên" },
    { key: "prereq-2", body: "Có tài khoản GitHub và biết tạo repo mới" },
]

const REQUIREMENTS = [
    {
        key: "req-1",
        title: "Dựng API CRUD cho `Task`",
        points: 40,
        body: "Xây REST API `/tasks` hỗ trợ tạo, đọc, sửa, xoá — mỗi route trả đúng mã trạng thái HTTP.",
    },
    {
        key: "req-2",
        title: "Viết test cho từng route",
        points: 30,
        body: "Ít nhất một test integration cho mỗi route, chạy được bằng `npm test`.",
    },
]

const STEPS = [
    { key: "step-1", title: "Khởi tạo dự án", body: "Chạy `npm init` rồi cài Express và TypeORM." },
    { key: "step-2", body: "Định nghĩa entity `Task` với các trường `title`, `done`, `createdAt`." },
]

const OUTPUTS = [
    { key: "out-1", body: "`GET /tasks` trả về mảng JSON các task hiện có" },
    { key: "out-2", body: "`POST /tasks` trả về task vừa tạo kèm `id`" },
]

const HINT = "Nếu route trả 500 khi test, kiểm tra lại xem đã `await` migration trước khi server lắng nghe request chưa."

const TODO_DELIVERABLES: Array<ChallengeDeliverableItem> = [
    {
        id: "api-design",
        title: "Dựng API CRUD cho `Task`",
        points: 40,
        status: "todo",
        description: "Vẽ sơ đồ **resource** và liệt kê method/status code cho từng endpoint.",
        url: "",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
    {
        id: "unit-test",
        title: "Viết test cho từng route",
        points: 30,
        status: "todo",
        url: "",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
    },
]

const GRADED_DELIVERABLES: Array<ChallengeDeliverableItem> = [
    {
        id: "api-design",
        title: "Dựng API CRUD cho `Task`",
        points: 40,
        status: "done",
        url: "https://github.com/hocvien/task-api",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
        graded: {
            verdict: "pass",
            earnedScore: 40,
            requiredScore: 32,
        },
    },
    {
        id: "unit-test",
        title: "Viết test cho từng route",
        points: 30,
        status: "failed",
        url: "https://github.com/hocvien/task-api/pull/3",
        onUrlChange: () => {},
        onSubmit: () => {},
        onViewHistory: () => {},
        graded: {
            verdict: "fail",
            earnedScore: 12,
            requiredScore: 24,
            feedback: [
                {
                    id: "f1",
                    severity: "high",
                    message: "Không có test cho route `DELETE /tasks/:id` khi id không tồn tại.",
                    location: "test/tasks.spec.ts:58",
                    suggestion: "Thêm case xoá một id chưa từng được tạo, kỳ vọng 404.",
                },
            ],
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
        <div className="p-8">
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
    title="Xây REST API quản lý Task"
    difficulty="medium"
    deliverables={deliverables}
    earnedScore={0}
    maxScore={70}
    passThreshold={0.8}
    …
/>`,
                        render: (
                            <ChallengePage
                                showAnatomy
                                onBackPress={() => {}}
                                title="Xây REST API quản lý Task"
                                description="Dựng một REST API CRUD cho tài nguyên Task, có test và triển khai lên staging."
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
        <div className="p-8">
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
                                showAnatomy
                                onBackPress={() => {}}
                                title="Xây REST API quản lý Task"
                                description="Dựng một REST API CRUD cho tài nguyên Task, có test và triển khai lên staging."
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
 * LEAF ⭐ — the evidence for `SplitWorkspace`'s axis switch, same 3 widths as
 * `ContentPage`'s "Practice nudge — responsive" leaf. Same data as
 * `NotAttempted` at every width — only the container changes.
 */
export const Responsive: Story = {
    render: () => (
        <div className="p-8">
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
                            <div className="@container" style={{ width: 375 }}>
                                <ChallengePage
                                    onBackPress={() => {}}
                                    title="Xây REST API quản lý Task"
                                    description="Dựng một REST API CRUD cho tài nguyên Task, có test và triển khai lên staging."
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
                            <div className="@container" style={{ width: 768 }}>
                                <ChallengePage
                                    onBackPress={() => {}}
                                    title="Xây REST API quản lý Task"
                                    description="Dựng một REST API CRUD cho tài nguyên Task, có test và triển khai lên staging."
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
                            <div className="@container" style={{ width: 1280 }}>
                                <ChallengePage
                                    onBackPress={() => {}}
                                    title="Xây REST API quản lý Task"
                                    description="Dựng một REST API CRUD cho tài nguyên Task, có test và triển khai lên staging."
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
        <div className="p-8">
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
                                showAnatomy
                                onBackPress={() => {}}
                                title="Xây REST API quản lý Task"
                                description="Dựng một REST API CRUD cho tài nguyên Task, có test và triển khai lên staging."
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
