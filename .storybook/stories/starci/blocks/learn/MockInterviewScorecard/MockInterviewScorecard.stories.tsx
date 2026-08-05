import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockInterviewScorecard } from "@sb-components/starci/blocks/learn/MockInterviewScorecard/MockInterviewScorecard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MockInterviewScorecard` — read-only render of one graded mock-interview run:
 * a verdict banner (`Callout`), hand-laid `ProgressMeter` rows for the score and
 * attribute breakdowns, and strengths/gaps via `SurfaceCard.CrossList`. Every
 * optional section — byline, attribute breakdown, strengths, gaps, follow-up,
 * weak-area tag, retry — is a state of one shape. Per-question model-answer review
 * is out of scope (no primitive for it yet).
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
    { key: "requirements", label: "Requirements & scope", score: 18, max: 20 },
    { key: "estimation", label: "Capacity estimation", score: 10, max: 20 },
    { key: "highLevel", label: "High-level design", score: 16, max: 20 },
    { key: "deepDive", label: "Component deep dive", score: 14, max: 20 },
    { key: "tradeoffs", label: "Trade-offs & limits", score: 17, max: 20 },
]

const ATTRIBUTE_ROWS = [
    { key: "communication", label: "Communication", score: 78 },
    { key: "structuredThinking", label: "Structured thinking", score: 62 },
    { key: "tradeoffAwareness", label: "Trade-off awareness", score: 85 },
]

const STRENGTHS = [
    "Estimated QPS and bandwidth with a clear formula, not guesswork.",
    "Proactively called out the bottleneck before being asked.",
]

const GAPS = [
    "Didn't account for a cache invalidation strategy when data changes.",
    "Missed an idempotency approach for the write API.",
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track separating the byline, the verdict banner and every breakdown card, one seam per region", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal row inside one part — a score row's label+bar+value, or the CTA row", storyId: "frames-stack-stackh--default" },
    "Callout": { tier: "composite", role: "the verdict banner — tone/icon/wording driven entirely by the `verdict` enum", storyId: "composites-feedback-callout--default" },
    "SurfaceCard": { tier: "composite", role: "the bounded card face for the score breakdown, the attribute breakdown, and the follow-up question", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "ProgressMeter": { tier: "composite", role: "one score row's bar, value-colored by how close it is to its own max", storyId: "composites-stats-progressmeter--label-and-value" },
    "SurfaceCardCrossList": { tier: "composite", role: "the strengths (check) / gaps (x) list — marked rows in a bounded card with its own skeleton mirror", storyId: "composites-cards-surfacecard-surfacecardcrosslist--checks" },
    "MarkdownContent": { tier: "composite", role: "one authored line of text — a strength, a gap, or the follow-up question", storyId: "composites-viewers-markdowncontent--compact" },
    "Chip": { tier: "atom", role: "tags the weak area the primary CTA is about to send the learner back into", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — a row label, a score value, a section caption, or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "Button": { tier: "atom", role: "one of the three CTAs — study the weak area, do the capstone, or retry", storyId: "atoms-buttons-button-button--default" },
    "Skeleton": { tier: "heroui", role: "the loading mirror standing in for the verdict banner — `Callout` has no `isSkeleton` shape of its own, so this block draws the shimmer bar directly, in the banner's own slot" },
}

/** LEAF — the graded scorecard, every optional section present or absent as a STATE. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MockInterviewScorecard"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "verdict = pass, every section has data",
                        why: "The candidate cleared the bar, so the banner reads success and every breakdown/strength/gap/follow-up section is present at once — the fullest shape this card ever draws, and the one every other state is measured against.",
                        code: `<MockInterviewScorecard
    verdict="pass"
    overallScore={82}
    phaseOrQuestionScores={scoreRows}
    attributeScores={attributeRows}
    strengths={strengths}
    gaps={gaps}
    followUpQuestion="If traffic spikes 10x during peak hours, which component would you scale first?"
    weakAreaLabel="Capacity estimation"
    promptTitle="Design a URL shortener system"
    createdAt="Jul 28, 2026 · 14:32"
    onStudyWeakArea={...}
    onCapstone={...}
    onRetry={...}
/>`,
                        render: (
                            <MockInterviewScorecard


                                verdict="pass"
                                overallScore={82}
                                phaseOrQuestionScores={SCORE_ROWS}
                                attributeScores={ATTRIBUTE_ROWS}
                                strengths={STRENGTHS}
                                gaps={GAPS}
                                followUpQuestion="If traffic spikes 10x during peak hours, which component would you scale first?"
                                weakAreaLabel="Capacity estimation"
                                promptTitle="Design a URL shortener system"
                                createdAt="Jul 28, 2026 · 14:32"
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
                                followUpQuestion="If traffic spikes 10x during peak hours, which component would you scale first?"
                                weakAreaLabel="Capacity estimation"
                                promptTitle="Design a URL shortener system"
                                createdAt="Jul 28, 2026 · 14:32"
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
                                weakAreaLabel="Capacity estimation"
                                promptTitle="Design a URL shortener system"
                                onStudyWeakArea={() => {}}
                                onCapstone={() => {}}
                            />
                        ),
                    },
                    {
                        name: "only required fields present — no byline/attribute/strengths/gaps/follow-up/weak-area/retry",
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
        <div data-tier="fixture" className="p-8">
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
                        why: "The grade hasn't landed yet, so the block paints the fullest shape it can (byline, banner, both breakdowns, strengths, gaps, follow-up, all three CTAs) as shimmer — `Callout` and `ProgressMeter` have no `isSkeleton` of their own, so a bare bar stands in each's exact slot instead.",
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
