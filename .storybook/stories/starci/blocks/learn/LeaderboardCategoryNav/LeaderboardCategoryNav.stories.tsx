import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeaderboardCategoryNav } from "@sb-components/starci/blocks/learn/LeaderboardCategoryNav/LeaderboardCategoryNav"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeaderboardCategoryNav` — the mobile chip row for switching which XP category
 * the leaderboard is sorted by (the `variant="chips"` half of `LeaderboardCategoryRail`;
 * the desktop `ListBox` rail lives in the learn-shell `leftRail` slot). Picking a
 * category re-sorts the same board — a facet toggle, not navigation — so it wraps
 * `Button.RadioGroup`. Which category is selected and each XP count are data on the
 * same chip row.
 */
const meta: Meta<typeof LeaderboardCategoryNav> = {
    title: "StarCi/Blocks/Learn/LeaderboardCategoryNav/LeaderboardCategoryNav",
    component: LeaderboardCategoryNav,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeaderboardCategoryNav>

const ITEMS = [
    { key: "total" as const, xp: 420 },
    { key: "challenge" as const, xp: 260 },
    { key: "reading" as const, xp: 96 },
    { key: "milestone" as const, xp: 60 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ButtonRadioGroup": { tier: "atom", role: "the flex-wrap row of select buttons — single-select, filled `tertiary` when chosen, hollow `ghost` otherwise", storyId: "composites-buttons-buttonradiogroup--default" },
    "Typography": { tier: "atom", role: "each chip's own icon+label+XP line, built from the category's icon/label table plus the caller's XP number", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — the mobile chip row, one state per selected category. */
export const ChipRow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeaderboardCategoryNav"
                tier="block"
                leaf="ChipRow"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "selected = \"total\"",
                        why: "The board opens on the canonical ranking, so the first chip is the one carrying the accent-neutral selected look. Every chip still shows its own XP number — this row doubles as the viewer's XP breakdown, not just a sort control.",
                        code: `<LeaderboardCategoryNav
    items={categories}
    selected="total"
    onSelect={setCategory}
    ariaLabel="Leaderboard category"
/>`,
                        render: (
                            <LeaderboardCategoryNav


                                items={ITEMS}
                                selected="total"
                                onSelect={() => {}}
                                ariaLabel="Leaderboard category"
                            />
                        ),
                    },
                    {
                        name: "selected = \"milestone\"",
                        why: "The learner tapped a different chip to re-sort the same board by milestone XP — the row's selection moves, nothing navigates away, and the other three chips stay pressable so switching back is one tap.",
                        code: `<LeaderboardCategoryNav
    items={categories}
    selected="milestone"
    onSelect={setCategory}
    ariaLabel="Leaderboard category"
/>`,
                        render: (
                            <LeaderboardCategoryNav
                                items={ITEMS}
                                selected="milestone"
                                onSelect={() => {}}
                                ariaLabel="Leaderboard category"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
