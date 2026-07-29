import type { Meta, StoryObj } from "@storybook/nextjs"
import { SubmissionFindingsList, type SubmissionFinding } from "@sb-components/starci/blocks/learn/SubmissionFindingsList/SubmissionFindingsList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SubmissionFindingsList`: "Góp ý" — one accordion row per quality-gate
 * finding on a graded attempt: severity icon + plain-text message (backtick
 * code only — a trigger title is never richtext) + location chip in the
 * trigger, markdown detail + a linked file location + a markdown suggestion
 * in the panel.
 *
 * REUSE, NOT A NEW ACCORDION: the frame is `SurfaceCard.Accordion` end to end —
 * this block only supplies the DOMAIN (severity → icon/tone/sort-rank, the
 * high→low sort, the repo-URL→file-link builder), ported from `SubmissionResult`
 * / `FindingAccordionItem`.
 *
 * 📐 ONE LEAF (`FindingsAccordion`): loading, empty, error, and populated are all
 * the SAME bounded accordion card wearing different content, never a different
 * structure — see the block's own file header for why loading/empty/error all
 * stay routed through `SurfaceCard.Accordion`'s own `isSkeleton`/`emptyState`
 * axes instead of `AsyncContent`'s state-switch wrapper.
 */
const meta: Meta<typeof SubmissionFindingsList> = {
    title: "StarCi/Blocks/Learn/SubmissionFindingsList/SubmissionFindingsList",
    component: SubmissionFindingsList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SubmissionFindingsList>

const REPOSITORY_URL = "https://github.com/starci-academy/challenge-submissions.git"

// Deliberately UNSORTED (medium → high → high → low) so the "populated" state
// shows the block re-sorting on its own — a caller never has to pre-sort.
const FINDINGS: Array<SubmissionFinding> = [
    {
        id: "index-missing",
        severity: "medium",
        message: "Thiếu index cho cột `user_id` trên bảng `submissions`",
        detail: "Truy vấn lọc theo `user_id` đang full-scan cả bảng — chậm dần khi số lượt nộp tăng lên.",
        suggestion: "Thêm `CREATE INDEX idx_submissions_user_id ON submissions(user_id);` trong migration kế tiếp.",
        location: "src/db/migrations/002_submissions.sql",
        sortIndex: 0,
    },
    {
        id: "jwt-missing",
        severity: "high",
        message: "Endpoint `/api/submit` không xác thực JWT trước khi ghi DB",
        detail: "Bất kỳ request nào cũng ghi được submission thay cho người khác nếu biết trước `userId`.",
        suggestion: "Bọc route bằng middleware `requireAuth` và đối chiếu `req.user.id` với payload trước khi ghi.",
        location: "src/routes/submit.ts",
        sortIndex: 0,
    },
    {
        id: "race-condition",
        severity: "high",
        message: "Hai request nộp bài cùng lúc có thể ghi đè điểm của nhau",
        detail: "Không có khoá lạc quan (`version`) trên bản ghi `submission`, nên request xử lý sau luôn thắng bất kể điểm nào cao hơn.",
        suggestion: "Thêm cột `version` và kiểm tra `WHERE version = :expected` khi UPDATE.",
        sortIndex: 1,
    },
    {
        id: "naming",
        severity: "low",
        message: "Biến `tempResult` đặt tên không rõ nghĩa",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardAccordion": { tier: "composite", role: "the bounded card frame — one collapsible row per finding, self-mirroring while loading and self-hosting the empty/error message, so this block never owns a second frame", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "StackH": { tier: "frame", role: "the panel's location/suggestion rows — an icon or link as a MARK attached to its label, `tight`", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the panel's own track holding detail, location and suggestion as peer facts about one finding", storyId: "frames-stack-stackv--default" },
    "MarkdownContent": { tier: "composite", role: "the panel's detail/suggestion — rendered faithfully rather than as plain text (the trigger's own message stays plain, see file header)", storyId: "composites-viewers-markdowncontent--compact" },
    "SeverityIcon": { tier: "heroui", role: "the trigger's severity mark, riding in `titleStart` — its own tone colour, independent of the message text" },
    "Chip": { tier: "atom", role: "the finding's file location, riding in the trigger's trailing slot", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "the location line's plain text, or the underlined link when the location resolves to a real href", storyId: "atoms-text-typography-typography--plain" },
    "AsyncContentEmpty": { tier: "composite", role: "the no-findings message, hosted inside the accordion's own `emptyState` slot", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
    "AsyncContentError": { tier: "composite", role: "the failed-fetch message with a retry action, hosted inside the same `emptyState` slot", storyId: "composites-async-asynccontent-asynccontenterror--with-retry" },
}

/** LEAF — the findings card: loading → empty → error → populated (severity-sorted). */
export const FindingsAccordion: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SubmissionFindingsList"
                tier="block"
                leaf="FindingsAccordion"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The list's own fetch is in flight, so the card draws its own self-mirror — same frame, same trigger-row shape — rather than collapsing to nothing. A parent-forced `isSkeleton` paint fires the exact same branch.",
                        code: `<SubmissionFindingsList
    findings={[]}
    label="Góp ý"
    isLoading
/>`,
                        render: (
                            <SubmissionFindingsList
                                anatPart="SubmissionFindingsList"
                                showAnatomy
                                findings={[]}
                                label="Góp ý"
                                isLoading
                            />
                        ),
                    },
                    {
                        name: "isEmpty = true",
                        why: "The grading pass came back clean, so the card shows one message inside its own frame instead of an empty accordion that reads as broken chrome.",
                        code: `<SubmissionFindingsList
    findings={[]}
    label="Góp ý"
    isEmpty
/>`,
                        render: (
                            <SubmissionFindingsList
                                findings={[]}
                                label="Góp ý"
                                isEmpty
                            />
                        ),
                    },
                    {
                        name: "error set, retry paired",
                        why: "The fetch failed, which outranks even a stale loading flag — the reader sees why nothing is listed and a way to try again, staying inside the same bounded card rather than the whole section vanishing.",
                        code: `<SubmissionFindingsList
    findings={[]}
    label="Góp ý"
    error={fetchError}
    onRetry={retry}
    retryLabel="Thử lại"
/>`,
                        render: (
                            <SubmissionFindingsList
                                findings={[]}
                                label="Góp ý"
                                error={new Error("network")}
                                onRetry={() => {}}
                                retryLabel="Thử lại"
                            />
                        ),
                    },
                    {
                        name: "findings.length = 4, severity-sorted",
                        why: "Four findings land in medium/high/high/low order, and the card re-sorts them itself: both `high` rows surface first (tie-broken by `sortIndex`), then the `medium`, then the `low` — a caller never has to pre-sort what it hands in. The `race-condition` row also shows a finding with no `location`, and `naming` shows one with no `detail`/`suggestion` at all.",
                        code: `<SubmissionFindingsList
    findings={findings}
    repositoryUrl="https://github.com/starci-academy/challenge-submissions.git"
    label="Góp ý"
/>`,
                        render: (
                            <SubmissionFindingsList
                                findings={FINDINGS}
                                repositoryUrl={REPOSITORY_URL}
                                label="Góp ý"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
