import type { Meta, StoryObj } from "@storybook/nextjs"
import { _FlashcardQuizStats, type FlashcardQuizStatsLabels } from "@/components/features/learn/Flashcards/QuizSession/FlashcardQuizStats/component"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FlashcardQuizStats`: the "Quick quiz" aggregate stats surface (the setup screen's Stats
 * tab). It is the PRESENTATIONAL half of a split component (`design/storybook/architecture/split.md`):
 * the connected `index.tsx` fetches the stats and resolves every label; this file (`component.tsx`,
 * `_FlashcardQuizStats`) takes them as props and renders. That is why a story can show all four async
 * states with no backend.
 *
 * ⭐ TEXT IS DATA. Every string arrives as a prop, already localized by the connected file. A story has
 * no locale, so it passes the raw i18n KEY as each label — the key names the slot without inventing
 * copy. The app passes `t(key)`; the story passes `"the.key"`; the component renders whichever it gets.
 *
 * ⭐ NO ANATOMY OVERLAY. This is real `src` code, so it carries no `showAnatomy`
 * (split.md) — the Structure tab stays empty here on purpose. The states below are the point: one leaf,
 * four data-driven states of the async switch, plus the coverage band.
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
                leaf="The async switch"
                reason="The connected file hands the presentational block a status (`isLoading` / `error` / `isEmpty`) plus the resolved data. The block renders the fixed error → loading → empty → content order through `AsyncContent` — so every state is reachable from props alone, with no live request."
                states={[
                    {
                        name: "loading",
                        why: "First load, before any stats resolve. The block shows a skeleton that mirrors the loaded two-zone tree so switching into the tab does not collapse then jump on resolve.",
                        code: "<_FlashcardQuizStats isLoading courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats isLoading courseId="demo-course" labels={LABELS} />,
                    },
                    {
                        name: "empty (insufficient data)",
                        why: "The learner has not completed enough quiz sessions for an honest aggregate, so the block shows an empty state whose action jumps back to the Start tab.",
                        code: "<_FlashcardQuizStats isEmpty onStartQuiz={fn} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats isEmpty onStartQuiz={() => {}} courseId="demo-course" labels={LABELS} />,
                    },
                    {
                        name: "error",
                        why: "The stats request failed. Error outranks a stale loading flag, so the block shows a retry message rather than a spinner over old data.",
                        code: "<_FlashcardQuizStats error={err} onRetry={fn} courseId=\"…\" labels={…} />",
                        render: <_FlashcardQuizStats error={new Error("failed")} onRetry={() => {}} courseId="demo-course" labels={LABELS} />,
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
