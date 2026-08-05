import type { Meta, StoryObj } from "@storybook/nextjs"
import { WeeklyGoals, type WeeklyGoalKey, type WeeklyGoalsData } from "@sb-components/starci/blocks/dashboard/WeeklyGoals/WeeklyGoals"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `WeeklyGoals`: "Weekly Goals" — the composite summary + six-metric
 * breakdown. See the component's own file header for the full contract; this
 * file only adds the states.
 *
 * [layout] LEAF by STRUCTURE (§14d.2): the six metrics never change the SHAPE of the
 * tree, only the numbers inside it, so this block has exactly ONE leaf
 * ("Content") — loading / error / content are states of that one leaf, the
 * same shape `ChallengeScoreCard`'s single leaf uses. No `isEmpty` state:
 * `items` is always the fixed six-metric set (see the component file header).
 */
const DEFAULT_TARGETS: Record<WeeklyGoalKey, number> = {
    lessons: 5,
    studyDays: 5,
    challenges: 3,
    coding: 3,
    flashcards: 20,
    milestones: 2,
}

const meta: Meta<typeof WeeklyGoals> = {
    title: "StarCi/Blocks/Dashboard/WeeklyGoals/WeeklyGoals",
    component: WeeklyGoals,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof WeeklyGoals>

const FULL_DATA: WeeklyGoalsData = {
    items: [
        { key: "lessons", label: "Lessons", current: 4, target: 5, coinReward: 20, canClaim: false },
        { key: "studyDays", label: "Study days", current: 5, target: 5, coinReward: 15, canClaim: true },
        { key: "challenges", label: "Challenges", current: 1, target: 3, coinReward: 25, canClaim: false },
        { key: "coding", label: "Coding exercises", current: 3, target: 3, coinReward: 20, canClaim: true },
        { key: "flashcards", label: "Flashcards", current: 12, target: 20, coinReward: null, canClaim: false },
        { key: "milestones", label: "Milestones", current: 0, target: 2, coinReward: null, canClaim: false },
    ],
    composite: { percent: 68, completed: 2, total: 6 },
    resetInLabel: "3 days 12 hours left",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labeled card face, drawing the \"Weekly Goals\" label above the summary and the six-metric grid", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical frame stacking the summary sentence above the grid, or one metric cell's icon+label row above its meter", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a metric cell's icon+label row, or the row splitting it from the current/target ratio", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the summary sentence, a metric's label/ratio/coin-reward line, or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "StatGridCard": { tier: "composite", role: "the six-cell grid holding one metric per cell, divided by thin seams", storyId: "composites-stats-statgridcard--even" },
    "ProgressMeter": { tier: "composite", role: "one metric's bar, reading its current value against its effective target", storyId: "composites-stats-progressmeter--label-and-value" },
    "Skeleton": { tier: "heroui", role: "the loading mirror standing in for a metric's icon (a round dot) or its meter (a bar) — neither a bare glyph nor `ProgressMeter` has a usable `isSkeleton` shape of its own here, so this block substitutes shimmer sized to each real footprint" },
}

/** LEAF — the weekly-goals card: async lifecycle, summary and six-metric grid, all as states of one shape. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="WeeklyGoals"
                tier="block"
                leaf="Content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "content, targets mixed custom/default, some claimable",
                        why: "The everyday shape: some metrics already have a custom target and a coin reward, one is met and claimable (accent hint), one is met but already claimed elsewhere (muted), and two metrics (flashcards, milestones) still ride the default target with no reward yet — the ratio and bar still track them out of the box.",
                        code: `<WeeklyGoals
    isLoading={false}
    onRetry={refetch}
    data={{
        items: [
            { key: "lessons", label: "Lessons", current: 4, target: 5, coinReward: 20, canClaim: false },
            { key: "studyDays", label: "Study days", current: 5, target: 5, coinReward: 15, canClaim: true },
            // …
        ],
        composite: { percent: 68, completed: 2, total: 6 },
        resetInLabel: "3 days 12 hours left",
    }}
    defaultTargets={{ lessons: 5, studyDays: 5, challenges: 3, coding: 3, flashcards: 20, milestones: 2 }}
/>`,
                        render: (
                            <WeeklyGoals


                                isLoading={false}
                                onRetry={() => {}}
                                data={FULL_DATA}
                                defaultTargets={DEFAULT_TARGETS}
                            />
                        ),
                    },
                    {
                        name: "content, week just reset (no progress yet)",
                        why: "Right after Monday's reset every metric reads 0 against its target — the composite percent drops to 0 and every bar sits empty, but the six cells and their ratios still render in full (never an empty state: the fixed metric set always has something to show).",
                        code: `<WeeklyGoals
    isLoading={false}
    onRetry={refetch}
    data={{
        items: [{ key: "lessons", label: "Lessons", current: 0, target: 5, coinReward: null, canClaim: false }, …],
        composite: { percent: 0, completed: 0, total: 6 },
    }}
    defaultTargets={defaultTargets}
/>`,
                        render: (
                            <WeeklyGoals
                                isLoading={false}
                                onRetry={() => {}}
                                data={{
                                    items: FULL_DATA.items.map((item) => ({ ...item, current: 0, coinReward: null, canClaim: false })),
                                    composite: { percent: 0, completed: 0, total: 6 },
                                }}
                                defaultTargets={DEFAULT_TARGETS}
                            />
                        ),
                    },
                    {
                        name: "isLoading = true",
                        why: "Before the first `myKpis` response lands, `AsyncContent` picks the loading branch and this block hands it six placeholder cells (icon dot + text bars + an empty meter track) in the exact grid shape the real data will fill, so the card doesn't resize once it resolves.",
                        code: "<WeeklyGoals isLoading onRetry={refetch} defaultTargets={defaultTargets} />",
                        render: (
                            <WeeklyGoals
                                isLoading
                                onRetry={() => {}}
                                defaultTargets={DEFAULT_TARGETS}
                            />
                        ),
                    },
                    {
                        name: "error present",
                        why: "A failed `myKpis` fetch beats loading/content in `AsyncContent`'s priority order, so a stale snapshot never sits under a silent spinner. `onRetry` is the caller's own refetch — the block only supplies the wording and the button.",
                        code: "<WeeklyGoals isLoading={false} error={fetchError} onRetry={refetch} defaultTargets={defaultTargets} />",
                        render: (
                            <WeeklyGoals
                                isLoading={false}
                                error={new Error("network")}
                                onRetry={() => {}}
                                defaultTargets={DEFAULT_TARGETS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
