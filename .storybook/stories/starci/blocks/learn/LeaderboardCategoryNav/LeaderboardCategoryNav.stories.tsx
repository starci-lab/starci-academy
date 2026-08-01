import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeaderboardCategoryNav } from "@sb-components/starci/blocks/learn/LeaderboardCategoryNav/LeaderboardCategoryNav"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `LeaderboardCategoryNav`: the MOBILE chip row for switching which XP
 * category the leaderboard is sorted by — the `variant="chips"` half of the src
 * `LeaderboardCategoryRail`. The `variant="rail"` half (desktop `ListBox`) lives
 * in the shared learn-shell `leftRail` slot and is out of scope for this block.
 *
 * ⭐ REUSE, NOT A NEW ROW. Picking a category RE-SORTS the same board — a
 * single-value facet toggle, not navigation to a different body — so this wraps
 * `Button.RadioGroup` (already documented for "a facet/config toggle isn't a
 * CTA") instead of `ContentModeNav`'s tab-navigation idiom.
 *
 * 📐 ONE LEAF, `ChipRow`. Every difference below (which category is selected,
 * how many XP each carries) is the SAME four-chip row wearing different data,
 * never a different structure, so none of it earns its own leaf.
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
    "Typography": { tier: "atom", role: "each chip's own icon+label+XP line, built from the category's icon/label table plus the caller's XP number", storyId: "atoms-text-typography-typography--with-prefix-icon" },
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
