import type { Meta, StoryObj } from "@storybook/nextjs"
import { SubmissionScoreCard } from "@sb-components/starci/blocks/learn/SubmissionScoreCard/SubmissionScoreCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SubmissionScoreCard`: the #1 signal after the attempt selector on a
 * graded-result page — score hero (tinted pass/fail), verdict chip + "cần thêm
 * X điểm" sub-line, optional short feedback, optional submission link, and an
 * optional model-byline row (who graded it, its tier, when).
 *
 * SIBLING OF `SubmissionResultHeader`, NOT A COPY. The header answers "where am
 * I, what was I graded on"; this card answers "how did it go" — one layer
 * below it on the same result page.
 *
 * ⭐ ONE TONE, TWO PLACES. Pass/fail drives BOTH the hero number's color and
 * the verdict chip's tone together — a score and its chip disagreeing on
 * color would read as two different verdicts.
 *
 * 📐 ONE LEAF (§14d.2), same judgement as `SubmissionResultHeader`. Every
 * difference below — pass vs fail tint, a submission link appearing or not, a
 * feedback line appearing or not, the whole model-byline row appearing or not,
 * `isSkeleton` — changes DATA on the same shape, never the arrangement of
 * parts, so all seven are STATES of the one `ScoreCard` leaf.
 */
const meta: Meta<typeof SubmissionScoreCard> = {
    title: "StarCi/Blocks/Learn/SubmissionScoreCard/SubmissionScoreCard",
    component: SubmissionScoreCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SubmissionScoreCard>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face holding the score, verdict, and every optional row beneath them, plus the section label above the face", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "the vertical track separating the hero row from the sub-line, feedback, link, and byline rows below it", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal track lining up the score number with its max and the verdict chip on one baseline, or the byline's model/tier/time on one line", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the score number, its max, the threshold sub-line, feedback, the submission link, or the relative time — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "Chip": { tier: "atom", role: "the pass/fail verdict badge, tinted to the same tone as the score number", storyId: "atoms-chips-chip-chip--default" },
    "InlineIconLabel": { tier: "composite", role: "the sparkle + \"graded by <model>\" text unit that opens the byline row", storyId: "composites-texts-inlineiconlabel--overview" },
    "EnumChip": { tier: "composite", role: "the model's cost/quality tier chip, trailing the byline text", storyId: "composites-chips-enumchip--overview" },
}

/**
 * LEAF — the one shape this block draws: score hero + verdict → optional
 * threshold sub-line → optional feedback → optional submission link →
 * optional model byline.
 */
export const ScoreCard: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SubmissionScoreCard"
                tier="block"
                leaf="ScoreCard"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "isPassing = true",
                        why: "The attempt cleared the pass bar, so the hero number and the verdict chip both tint success together — one signal, not two. A full set of grading metadata rides along: short feedback, a link back to the raw submission, and the model that produced the grade.",
                        code: `<SubmissionScoreCard
    label="Kết quả chấm điểm"
    score={82}
    maxScore={100}
    isPassing
    passScore={70}
    shortFeedback="Xử lý transaction đúng, còn thiếu index cho truy vấn theo ngày."
    submissionUrl="/submissions/8841"
    gradedByModel="claude-sonnet-4-5"
    modelCategory="frontier"
    timeAgo="5 phút trước"
/>`,
                        render: (
                            <SubmissionScoreCard
                                anatPart="SubmissionScoreCard"
                                showAnatomy
                                label="Kết quả chấm điểm"
                                score={82}
                                maxScore={100}
                                isPassing
                                passScore={70}
                                shortFeedback="Xử lý transaction đúng, còn thiếu index cho truy vấn theo ngày."
                                submissionUrl="/submissions/8841"
                                gradedByModel="claude-sonnet-4-5"
                                modelCategory="frontier"
                                timeAgo="5 phút trước"
                            />
                        ),
                    },
                    {
                        name: "isPassing = false",
                        why: "The attempt fell short, so the same two signals tint danger together instead, and the sub-line does its own subtraction (passScore − score) to say exactly how far off it was — the block computes this itself rather than taking a formatted string from the caller.",
                        code: `<SubmissionScoreCard
    label="Kết quả chấm điểm"
    score={58}
    maxScore={100}
    isPassing={false}
    passScore={70}
    shortFeedback="Chưa xử lý được race condition khi hai request ghi cùng lúc."
    submissionUrl="/submissions/8842"
    gradedByModel="claude-sonnet-4-5"
    modelCategory="frontier"
    timeAgo="12 phút trước"
/>`,
                        render: (
                            <SubmissionScoreCard
                                label="Kết quả chấm điểm"
                                score={58}
                                maxScore={100}
                                isPassing={false}
                                passScore={70}
                                shortFeedback="Chưa xử lý được race condition khi hai request ghi cùng lúc."
                                submissionUrl="/submissions/8842"
                                gradedByModel="claude-sonnet-4-5"
                                modelCategory="frontier"
                                timeAgo="12 phút trước"
                            />
                        ),
                    },
                    {
                        name: "submissionUrl có giá trị",
                        why: "The caller has a URL to the raw submission, so the link row draws — with its own label, since a caller reviewing a code challenge and one reviewing a written answer want different wording for the same link.",
                        code: `<SubmissionScoreCard
    label="Kết quả chấm điểm"
    score={91}
    maxScore={100}
    isPassing
    submissionUrl="/submissions/9010"
    submissionLabel="Xem bài nộp đầy đủ"
/>`,
                        render: (
                            <SubmissionScoreCard
                                label="Kết quả chấm điểm"
                                score={91}
                                maxScore={100}
                                isPassing
                                submissionUrl="/submissions/9010"
                                submissionLabel="Xem bài nộp đầy đủ"
                            />
                        ),
                    },
                    {
                        name: "submissionUrl không có giá trị",
                        why: "Same attempt, minus a link to review — the row is not drawn disabled or empty, it simply is not there. A card with nothing to link to should not offer a dead link.",
                        code: `<SubmissionScoreCard
    label="Kết quả chấm điểm"
    score={91}
    maxScore={100}
    isPassing
/>`,
                        render: (
                            <SubmissionScoreCard
                                label="Kết quả chấm điểm"
                                score={91}
                                maxScore={100}
                                isPassing
                            />
                        ),
                    },
                    {
                        name: "shortFeedback có giá trị",
                        why: "A borderline failing attempt with one line of grader feedback — enough context to tell the learner what to fix next, without a submission link or a model byline pulling focus away from it.",
                        code: `<SubmissionScoreCard
    label="Kết quả chấm điểm"
    score={45}
    maxScore={100}
    isPassing={false}
    passScore={60}
    shortFeedback="Thiếu test cho nhánh lỗi khi input rỗng."
/>`,
                        render: (
                            <SubmissionScoreCard
                                label="Kết quả chấm điểm"
                                score={45}
                                maxScore={100}
                                isPassing={false}
                                passScore={60}
                                shortFeedback="Thiếu test cho nhánh lỗi khi input rỗng."
                            />
                        ),
                    },
                    {
                        name: "gradedByModel không có giá trị",
                        why: "An auto-tested challenge with no served model recorded — the byline row (model name, tier chip, and relative time all together) drops entirely rather than showing a tier chip and a timestamp with nothing to attribute them to.",
                        code: `<SubmissionScoreCard
    label="Kết quả chấm điểm"
    score={100}
    maxScore={100}
    isPassing
    shortFeedback="Toàn bộ test case pass, không có cảnh báo lint."
    submissionUrl="/submissions/9021"
/>`,
                        render: (
                            <SubmissionScoreCard
                                label="Kết quả chấm điểm"
                                score={100}
                                maxScore={100}
                                isPassing
                                shortFeedback="Toàn bộ test case pass, không có cảnh báo lint."
                                submissionUrl="/submissions/9021"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The grade hasn't loaded yet. The optional rows (feedback, link, byline) are not known to exist yet either, so — same as `ContentHeader`'s skeleton state — only the parts the block always draws (the card face and the score/verdict hero) shimmer; there is nothing to reserve space for beyond that.",
                        code: "<SubmissionScoreCard label=\"\" score={0} isPassing={false} isSkeleton />",
                        render: (
                            <SubmissionScoreCard
                                label=""
                                score={0}
                                isPassing={false}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
