import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeScreen } from "@sb-components/starci/screens/ChallengeScreen/ChallengeScreen"
import type { ChallengeDeliverableItem } from "@sb-components/starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `ChallengeScreen`: solve one challenge.
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
 * ⚠️ TWO COLUMNS, BEST-AVAILABLE LAYOUT. `src`'s `ChallengeView` is a real
 * split workspace (`flex-1 min-w-0` reading column beside a `shrink-0
 * w-[360px]` sticky aside). This design system has no dedicated "reading
 * column + fixed aside" frame yet, so `StackH` holding two `StackV` children
 * is what stands in for it — neither column can be pinned or made to grow
 * against the other the way `src`'s hand-written flex can. `Container
 * size="xl"` (not the `md` a single-column screen uses) is what buys the two
 * columns enough room to sit side by side without crowding each other.
 *
 * ⚠️ SCOPE OF THIS PASS: the grading-settings drawer (language picker +
 * private-repo token) is NOT built — `onOpenGradingSettings` is a chrome
 * trigger only, same scope cut `ChallengeDeliverableList` already documents.
 */
const meta: Meta<typeof ChallengeScreen> = {
    title: "StarCi/Screens/ChallengeScreen/ChallengeScreen",
    component: ChallengeScreen,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeScreen>

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
    "StackH": { tier: "frame", role: "the two-column row splitting the read column from the act column — the best-available substitute for `src`'s fixed-aside split, see the file header", storyId: "frames-stack-stackh--default" },
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
                name="ChallengeScreen"
                tier="screen"
                leaf="Not attempted"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "status = undefined, deliverables = todo, earnedScore = 0",
                        why: "The learner has never submitted anything for this challenge, so the header shows no status chip, every deliverable row sits at `todo` with an empty URL field, and the score card reads 0 against the pass line. Every one of the five functions is present — only the numbers say nothing has happened yet.",
                        code: `<ChallengeScreen
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
                            <ChallengeScreen
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
                name="ChallengeScreen"
                tier="screen"
                leaf="Graded"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "status = failed, one deliverable passed, one failed with feedback",
                        why: "The header's status chip reads the OVERALL attempt (failed — not every requirement cleared), while each deliverable row carries its OWN verdict independently: the API requirement passed, the test requirement did not and shows its feedback. The score card's total (52/70) sits below the pass line even though one requirement individually passed — the same 'passing needs every requirement' fact its caption states.",
                        code: `<ChallengeScreen
    …
    status="failed"
    deliverables={gradedDeliverables}
    earnedScore={52}
    maxScore={70}
    passThreshold={0.8}
/>`,
                        render: (
                            <ChallengeScreen
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

/** LEAF — the caller flips `isSkeleton`; every block mirrors itself. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ChallengeScreen"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block that can mirror itself does — the flag flows straight down into `ChallengeHeader`, `ChallengeBrief`, `ChallengeDeliverableList` and `ChallengeScoreCard`, and each draws its own resting shape. `deliverables` still carries the real rows (only shimmering) so the accordion keeps the same row count instead of collapsing to zero — the same reason `ChallengeDeliverableList`'s own skeleton story keeps its items. The two-column layout keeps its shape too, so nothing reflows once the challenge entity lands.",
                        code: "<ChallengeScreen {...props} isSkeleton />",
                        render: (
                            <ChallengeScreen
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
