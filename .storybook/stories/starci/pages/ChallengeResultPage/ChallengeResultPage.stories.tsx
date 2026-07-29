import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeResultPage } from "@sb-components/starci/pages/ChallengeResultPage/ChallengeResultPage"
import type { SubmissionAttemptRecord } from "@sb-components/starci/overlays/drawers/SubmissionAttemptsDrawer/SubmissionAttemptsDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `ChallengeResultPage`: what came back from grading ONE challenge
 * submission.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data — every `div` here would be a
 * shape it had no right to decide.
 *
 * FOUR FUNCTIONS, in the order the reader meets them: where am I / how do I
 * leave · which attempt am I looking at · how did THIS attempt do · what should
 * I fix, plus a quiet nudge toward more reading when the attempt failed.
 *
 * ⭐ THE SCORE CLUSTER IS CONDITIONAL, AND THE CONDITION IS THE POINT. Nothing
 * about "how did it go" can render before an attempt is actually selected —
 * `NoSelection` below is what that looks like: two blocks, not four.
 *
 * ⭐ THE RELATED-READING NUDGE ONLY APPEARS ON A FAILING ATTEMPT. A passing
 * attempt has nothing left to fix; `Passing` vs `Failing` below is that one
 * block, present or absent.
 *
 * ⭐ THE "+N" OVERFLOW TRIGGER OPENS A REAL DRAWER (corrected 2026-07-29 —
 * `SubmissionResultHistoryDrawer` DOES exist in `src`; the earlier claim that
 * it didn't was wrong). `WithHistory` below is that flow end to end.
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
    backLabel: "Quay lại bài giải",
    onBack: () => {},
    title: "Triển khai API phân trang cho danh sách khoá học",
    description: "Viết endpoint GET /courses hỗ trợ cursor pagination, kèm test cho trang đầu/cuối.",
    attempts: [
        { id: "a1", attemptNumber: 1, score: 54, isPassing: false },
        { id: "a2", attemptNumber: 2, score: 88, isPassing: true },
    ],
    selectedAttemptId: "a2",
    onSelectAttempt: () => {},
    attemptsAriaLabel: "Các lần làm",
    scoreLabel: "Kết quả",
    score: 88,
    maxScore: 100,
    passScore: 70,
    shortFeedback: "Cursor pagination đúng hướng, còn thiếu test cho trang cuối.",
    submissionUrl: "#submission",
    gradedByModel: "qwen2.5-coder-32b",
    modelCategory: "economy" as const,
    timeAgo: "5 phút trước",
    findingsLabel: "Góp ý",
    findings: [
        {
            id: "f1",
            message: "Thiếu test cho trang cuối cùng của danh sách",
            detail: "Cursor pagination cần test riêng cho trường hợp `hasNextPage` trả về `false`.",
            suggestion: "Thêm test case với cursor trỏ tới bản ghi cuối.",
            location: "src/courses/courses.controller.spec.ts",
            severity: "medium" as const,
        },
        {
            id: "f2",
            message: "Cursor không được encode, lộ id nội bộ",
            location: "src/courses/courses.service.ts",
            severity: "high" as const,
            sortIndex: 1,
        },
    ],
    repositoryUrl: "https://github.com/starci-academy/challenge-submissions",
    relatedLabel: "Có thể bạn muốn đọc lại",
    relatedItems: [
        { key: "cursor", title: "Cursor pagination hoạt động ra sao", snippet: "Vì sao offset pagination chậm dần khi bảng lớn.", href: "#cursor" },
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
        <div className="p-8">
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
                        render: <ChallengeResultPage {...BASE} showAnatomy selectedAttemptId={undefined} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a PASSING attempt ⇒ score + findings, no related-reading nudge. */
export const Passing: Story = {
    render: () => (
        <div className="p-8">
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
                        render: <ChallengeResultPage {...BASE} showAnatomy isPassing />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a FAILING attempt ⇒ score + findings + related-reading nudge. */
export const Failing: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ChallengeResultPage"
                tier="screen"
                leaf="Failing"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isPassing = false",
                        why: "The selected attempt fell short of the pass bar: the score card reads red with a \"cần thêm N điểm\" line, and the related-reading nudge appears underneath the findings — the one moment a pointer to relevant material earns its place.",
                        code: `<ChallengeResultPage
    {...props}
    isPassing={false}
    score={54}
/>`,
                        render: <ChallengeResultPage {...BASE} showAnatomy isPassing={false} score={54} selectedAttemptId="a1" />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block mirrors, including the still-absent cluster. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
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
                        render: <ChallengeResultPage {...BASE} showAnatomy isSkeleton selectedAttemptId={undefined} findings={[]} relatedItems={[]} />,
                    },
                ]}
            />
        </div>
    ),
}

// 8 attempts total — the row shows the newest 5 (real `src`'s own
// `ATTEMPT_CHIPS_VISIBLE`), "+3" opens the drawer over the FULL 8.
const HISTORY_ATTEMPTS: Array<SubmissionAttemptRecord> = [
    { id: "a8", attemptNumber: 8, score: 88, maxScore: 100, isPassing: true, processedTimeAgo: "5 phút trước", gradedByModel: "qwen2.5-coder-32b", modelCategory: "economy" },
    { id: "a7", attemptNumber: 7, score: 61, maxScore: 100, isPassing: false, processedTimeAgo: "3 giờ trước" },
    { id: "a6", attemptNumber: 6, score: 54, maxScore: 100, isPassing: false, processedTimeAgo: "1 ngày trước" },
    { id: "a5", attemptNumber: 5, score: 40, maxScore: 100, isPassing: false, processedTimeAgo: "2 ngày trước" },
    { id: "a4", attemptNumber: 4, score: null, maxScore: null, isPassing: false },
    { id: "a3", attemptNumber: 3, score: 33, maxScore: 100, isPassing: false, processedTimeAgo: "4 ngày trước" },
    { id: "a2", attemptNumber: 2, score: 20, maxScore: 100, isPassing: false, processedTimeAgo: "5 ngày trước" },
    { id: "a1", attemptNumber: 1, score: 10, maxScore: 100, isPassing: false, processedTimeAgo: "6 ngày trước" },
]

/** Local controlled wrapper — the "+N" trigger opens the drawer, a row selection closes it. */
const WithHistoryExample = () => {
    const [historyOpen, setHistoryOpen] = useState(true)
    const [selectedId, setSelectedId] = useState("a8")
    return (
        <ChallengeResultPage
            {...BASE}
            showAnatomy
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
        <div className="p-8">
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
