import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockInterviewScorecard } from "@sb-components/starci/blocks/learn/MockInterviewScorecard/MockInterviewScorecard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `MockInterviewScorecard`: read-only render of one graded mock-interview
 * run. See the component file header for the full contract, the scope cut (no
 * per-question model-answer review this pass — blocked on a missing primitive),
 * and why every optional section (byline, attribute breakdown, strengths, gaps,
 * follow-up, weak-area tag, retry) is a STATE of this one leaf rather than its
 * own leaf.
 *
 * REUSE NOTE: the verdict banner goes through `Feedback.Callout`, the score and
 * attribute breakdowns are hand-laid `ProgressMeter` rows (no existing composite
 * owns "labeled meter list" — same call `ChallengeScoreCard` already makes), and
 * strengths/gaps go through `SurfaceCard.CrossList` — an addition to the task's
 * compose list, picked because it already owns "N marked rows + its own skeleton"
 * rather than this block re-deriving that shape by hand.
 */
const meta: Meta<typeof MockInterviewScorecard> = {
    title: "StarCi/Blocks/Learn/MockInterviewScorecard/MockInterviewScorecard",
    component: MockInterviewScorecard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MockInterviewScorecard>

const SCORE_ROWS = [
    { key: "requirements", label: "Yêu cầu & phạm vi", score: 18, max: 20 },
    { key: "estimation", label: "Ước lượng dung lượng", score: 10, max: 20 },
    { key: "highLevel", label: "Thiết kế tổng thể", score: 16, max: 20 },
    { key: "deepDive", label: "Đào sâu thành phần", score: 14, max: 20 },
    { key: "tradeoffs", label: "Đánh đổi & giới hạn", score: 17, max: 20 },
]

const ATTRIBUTE_ROWS = [
    { key: "communication", label: "Giao tiếp", score: 78 },
    { key: "structuredThinking", label: "Tư duy có cấu trúc", score: 62 },
    { key: "tradeoffAwareness", label: "Nhận thức đánh đổi", score: 85 },
]

const STRENGTHS = [
    "Ước lượng QPS và băng thông có công thức rõ ràng, không đoán mò.",
    "Chủ động nêu điểm nghẽn (bottleneck) trước khi được hỏi.",
]

const GAPS = [
    "Chưa tính đến chiến lược cache invalidation khi dữ liệu đổi.",
    "Bỏ sót phương án chống trùng lặp (idempotency) cho API ghi.",
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track separating the byline, the verdict banner and every breakdown card, one seam per region", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal row inside one part — a score row's label+bar+value, or the CTA row", storyId: "frames-stack-stackh--default" },
    "FeedbackCallout": { tier: "composite", role: "the verdict banner — tone/icon/wording driven entirely by the `verdict` enum", storyId: "composites-feedback-feedback-feedbackcallout--default" },
    "SurfaceCard": { tier: "composite", role: "the bounded card face for the score breakdown, the attribute breakdown, and the follow-up question", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "ProgressMeter": { tier: "composite", role: "one score row's bar, value-colored by how close it is to its own max", storyId: "composites-stats-progressmeter--label-and-value" },
    "SurfaceCardCrossList": { tier: "composite", role: "the strengths (✓) / gaps (✗) list — marked rows in a bounded card with its own skeleton mirror", storyId: "composites-cards-surfacecard-surfacecardcrosslist--checks" },
    "MarkdownContent": { tier: "composite", role: "one authored line of text — a strength, a gap, or the follow-up question", storyId: "composites-viewers-markdowncontent--compact" },
    "Chip": { tier: "atom", role: "tags the weak area the primary CTA is about to send the learner back into", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — a row label, a score value, a section caption, or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "one of the three CTAs — study the weak area, do the capstone, or retry", storyId: "atoms-buttons-button-button--default" },
    "Skeleton": { tier: "heroui", role: "the loading mirror standing in for the verdict banner — `FeedbackCallout` has no `isSkeleton` shape of its own, so this block draws the shimmer bar directly, in the banner's own slot" },
}

/** LEAF — the graded scorecard, every optional section present or absent as a STATE. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MockInterviewScorecard"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "verdict = pass, mọi phần đều có dữ liệu",
                        why: "The candidate cleared the bar, so the banner reads success and every breakdown/strength/gap/follow-up section is present at once — the fullest shape this card ever draws, and the one every other state is measured against.",
                        code: `<MockInterviewScorecard
    verdict="pass"
    overallScore={82}
    phaseOrQuestionScores={scoreRows}
    attributeScores={attributeRows}
    strengths={strengths}
    gaps={gaps}
    followUpQuestion="Nếu traffic tăng gấp 10 lần vào giờ cao điểm, bạn sẽ scale thành phần nào trước?"
    weakAreaLabel="Ước lượng dung lượng"
    promptTitle="Thiết kế hệ thống rút gọn URL"
    createdAt="28 thg 7, 2026 · 14:32"
    onStudyWeakArea={...}
    onCapstone={...}
    onRetry={...}
/>`,
                        render: (
                            <MockInterviewScorecard
                                anatPart="MockInterviewScorecard"
                                showAnatomy
                                verdict="pass"
                                overallScore={82}
                                phaseOrQuestionScores={SCORE_ROWS}
                                attributeScores={ATTRIBUTE_ROWS}
                                strengths={STRENGTHS}
                                gaps={GAPS}
                                followUpQuestion="Nếu traffic tăng gấp 10 lần vào giờ cao điểm, bạn sẽ scale thành phần nào trước?"
                                weakAreaLabel="Ước lượng dung lượng"
                                promptTitle="Thiết kế hệ thống rút gọn URL"
                                createdAt="28 thg 7, 2026 · 14:32"
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                                onRetry={() => {}}
                            />
                        ),
                    },
                    {
                        name: "verdict = borderline",
                        why: "The score sits right on the line, so the banner switches to the warning tone/icon and wording — the same data shape as a pass, only the one enum flips, which is exactly why this stays a state and not a second leaf.",
                        code: "<MockInterviewScorecard verdict=\"borderline\" overallScore={58} ... />",
                        render: (
                            <MockInterviewScorecard
                                verdict="borderline"
                                overallScore={58}
                                phaseOrQuestionScores={SCORE_ROWS}
                                attributeScores={ATTRIBUTE_ROWS}
                                strengths={STRENGTHS}
                                gaps={GAPS}
                                followUpQuestion="Nếu traffic tăng gấp 10 lần vào giờ cao điểm, bạn sẽ scale thành phần nào trước?"
                                weakAreaLabel="Ước lượng dung lượng"
                                promptTitle="Thiết kế hệ thống rút gọn URL"
                                createdAt="28 thg 7, 2026 · 14:32"
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                                onRetry={() => {}}
                            />
                        ),
                    },
                    {
                        name: "verdict = fail",
                        why: "A clear miss switches the banner to the danger tone — the candidate still gets the full breakdown underneath, because knowing exactly where it went wrong matters more on a failing run, not less.",
                        code: "<MockInterviewScorecard verdict=\"fail\" overallScore={31} ... />",
                        render: (
                            <MockInterviewScorecard
                                verdict="fail"
                                overallScore={31}
                                phaseOrQuestionScores={SCORE_ROWS.map((row) => ({ ...row, score: Math.round(row.score * 0.4) }))}
                                attributeScores={ATTRIBUTE_ROWS.map((row) => ({ ...row, score: Math.round(row.score * 0.4) }))}
                                strengths={[STRENGTHS[0]]}
                                gaps={GAPS}
                                weakAreaLabel="Ước lượng dung lượng"
                                promptTitle="Thiết kế hệ thống rút gọn URL"
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                    {
                        name: "chỉ có phần bắt buộc — không byline/attribute/strengths/gaps/follow-up/weak-area/retry",
                        why: "An older graded attempt (or one predating a field) carries only the verdict, the score breakdown and the two required CTAs — every optional section drops out together, and the card still reads as a complete result rather than a broken one.",
                        code: `<MockInterviewScorecard
    verdict="pass"
    overallScore={82}
    phaseOrQuestionScores={scoreRows}
    attributeScores={[]}
    strengths={[]}
    gaps={[]}
    onStudyWeakArea={...}
    onCapstone={...}
/>`,
                        render: (
                            <MockInterviewScorecard
                                verdict="pass"
                                overallScore={82}
                                phaseOrQuestionScores={SCORE_ROWS}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so every part this block draws itself mirrors as shimmer. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MockInterviewScorecard"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The grade hasn't landed yet, so the block paints the fullest shape it can (byline, banner, both breakdowns, strengths, gaps, follow-up, all three CTAs) as shimmer — `FeedbackCallout` and `ProgressMeter` have no `isSkeleton` of their own, so a bare bar stands in each's exact slot instead.",
                        code: `<MockInterviewScorecard
    verdict="pass"
    overallScore={0}
    phaseOrQuestionScores={[]}
    attributeScores={[]}
    strengths={[]}
    gaps={[]}
    onStudyWeakArea={...}
    onCapstone={...}
    onRetry={...}
    isSkeleton
/>`,
                        render: (
                            <MockInterviewScorecard
                                anatPart="MockInterviewScorecard"
                                showAnatomy
                                verdict="pass"
                                overallScore={0}
                                phaseOrQuestionScores={[]}
                                attributeScores={[]}
                                strengths={[]}
                                gaps={[]}
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                                onRetry={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
