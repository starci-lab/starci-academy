import type { Meta, StoryObj } from "@storybook/nextjs"
import { _FlashcardQuizStats, type FlashcardQuizStatsLabels } from "@/components/features/learn/Flashcards/QuizSession/FlashcardQuizStats/component"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FlashcardQuizStats` — the "Quick quiz" aggregate stats surface (the setup
 * screen's Stats tab). The presentational half of a split component: the
 * connected `index.tsx` fetches stats and resolves labels, while this
 * `component.tsx` (`_FlashcardQuizStats`) takes them as props and renders. Every
 * label arrives as a prop (a story passes the raw i18n key). One leaf, four
 * data-driven states of the async switch; no anatomy overlay.
 */

/** Every label as its i18n key — the self-naming placeholder a locale-free story passes in. */
const LABELS: FlashcardQuizStatsLabels = {
    errorTitle: "flashcard.quiz.quizStatsError",
    retry: "flashcard.quiz.retry",
    emptyTitle: "flashcard.quiz.quizStatsEmptyTitle",
    emptyDescription: "flashcard.quiz.quizStatsEmptyDescription",
    emptyAction: "flashcard.quiz.quizHistoryEmptyAction",
    coverageZone: "flashcard.quiz.quizStatsCoverageVsTargetLabel",
    coverageVerdict: "flashcard.quiz.quizStatsCoverageSentence",
    coverageSub: "flashcard.quiz.quizStatsCoverageTargetCaption",
    coverageDrillCta: "flashcard.quiz.quizStatsCoverageDrillCta",
    gapZone: "flashcard.quiz.quizStatsGapLabel",
    topicOftenWrong: "flashcard.quiz.quizStatsTopicOftenWrong",
    topicNeverTried: "flashcard.quiz.quizStatsTopicNeverTried",
    topicEmptyChip: "flashcard.quiz.quizStatsTopicEmptyChip",
    studyHeading: "flashcard.review.stats.studyHeading",
}

const TAGS = [
    { tag: "closures", coverage: 0.35 },
    { tag: "promises", coverage: 0.6 },
    { tag: "generics", coverage: 0.85 },
]

const meta: Meta<typeof _FlashcardQuizStats> = {
    title: "StarCi/Blocks/Learn/FlashcardQuizStats",
    component: _FlashcardQuizStats,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof _FlashcardQuizStats>

/** The async switch — the block owns error → loading → empty → content, each a data-driven state. */
export const Status: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FlashcardQuizStats"
                tier="block"
                leaf="The async state"
                reason="The connected file hands the block `isSkeleton` + `isEmpty` + `error` + resolved data, in the fixed order error → loading → empty → content. `error` falls to the shared `AsyncContentError` frame, `isEmpty` to `AsyncContentEmpty`, and otherwise `isSkeleton` threads down so the whole tree shimmers in place mirroring the loaded shape (loading-and-skeleton.md)."
                states={[
                    {
                        name: "skeleton (first load)",
                        why: "First load, nothing in hand. `isSkeleton` threads down to every leaf so the two-zone tree shimmers in its real shape — nothing collapses or jumps when the data arrives.",
                        code: "<_FlashcardQuizStats isSkeleton courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats isSkeleton courseId="demo-course" labels={LABELS} />,
                    },
                    {
                        name: "error",
                        why: "The stats fetch failed. Error outranks a stale loading flag, so the block shows the shared `AsyncContentError` frame with a retry button rather than a spinner over old data.",
                        code: "<_FlashcardQuizStats error={err} onRetry={fn} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats error={new Error("failed")} onRetry={() => {}} courseId="demo-course" labels={LABELS} />,
                    },
                    {
                        name: "empty (insufficient data)",
                        why: "Settled with no honest aggregate — too few completed sessions. The block shows the shared `AsyncContentEmpty` frame whose action jumps back to the Start tab.",
                        code: "<_FlashcardQuizStats isEmpty onStartQuiz={fn} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats isEmpty onStartQuiz={() => {}} courseId="demo-course" labels={LABELS} />,
                    },
                    {
                        name: "content",
                        why: "Stats resolved: the coverage hero (zone 1) over the ranked weak-topics list (zone 2). The study zone is skipped because no `displayId` is passed, so the story stays backend-free.",
                        code: "<_FlashcardQuizStats coveragePercent={62} untouchedTopicCount={2} tags={…} onStartQuiz={fn} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats coveragePercent={62} untouchedTopicCount={2} tags={TAGS} onStartQuiz={() => {}} courseId="demo-course" labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Prop `coveragePercent` — the zone-1 verdict band, judged against the 80% target (not a bare number). */
export const Coverage: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-8 p-8">
            <BlockAnatomy
                name="FlashcardQuizStats"
                tier="block"
                leaf="Prop `coveragePercent`"
                reason="Coverage is judged against COVERAGE_TARGET (80), not shown as a bare percentage: at or above target reads success, well below reads danger, and near-target reads warning — progress in motion, never a false success. `null` means the course has zero tag data, so the whole zone is skipped rather than faking a verdict."
                states={[
                    {
                        name: "at/above target (success)",
                        why: "90% ≥ 80% target — the hero meter and verdict read success, and with no untouched topics there is no drill CTA.",
                        code: "<_FlashcardQuizStats coveragePercent={90} untouchedTopicCount={0} tags={strongTags} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats coveragePercent={90} untouchedTopicCount={0} tags={[{ tag: "generics", coverage: 0.9 }]} courseId="demo-course" labels={LABELS} />,
                    },
                    {
                        name: "below target (warning + drill)",
                        why: "45% is under target but not yet low — a warning band with a drill CTA into the untouched topics, and the worst tag flagged in zone 2.",
                        code: "<_FlashcardQuizStats coveragePercent={45} untouchedTopicCount={3} tags={weakTags} onStartQuiz={fn} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats coveragePercent={45} untouchedTopicCount={3} tags={TAGS} onStartQuiz={() => {}} courseId="demo-course" labels={LABELS} />,
                    },
                    {
                        name: "null (zero tag data → zone skipped)",
                        why: "The course carries no tag data, so there is nothing honest to judge — zone 1 is skipped entirely and only the (also empty) weak-topics zone would show.",
                        code: "<_FlashcardQuizStats coveragePercent={null} tags={[]} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats coveragePercent={null} tags={[]} courseId="demo-course" labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
