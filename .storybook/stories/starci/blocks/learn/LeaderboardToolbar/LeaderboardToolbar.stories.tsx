import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeaderboardToolbar } from "@sb-components/starci/blocks/learn/LeaderboardToolbar/LeaderboardToolbar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeaderboardToolbar` — the strip above the ranking: "ranked by X" on the left, a
 * quiet last-updated fact beside it, a plain refresh button on the right. It sits
 * outside the board's async region, hence its own block. Hand-composed from atoms —
 * no composite draws this "label · muted timestamp · secondary button" shape. Owns
 * the "Ranked by …" template and the relative-time phrasing built from a plain
 * `updatedAt: Date`. Whether the timestamp has landed and whether a refresh is in
 * flight are states on the same three-slot row.
 */
const meta: Meta<typeof LeaderboardToolbar> = {
    title: "StarCi/Blocks/Learn/LeaderboardToolbar/LeaderboardToolbar",
    component: LeaderboardToolbar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeaderboardToolbar>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the row frame holding the label, the quiet timestamp and the refresh button on one baseline with one seam, doubling as the block's own anatomy node", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the 'ranked by' sentence it built from the category, or the muted relative-time fact — real, or absent when there is nothing to claim yet", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the refresh trigger, owning its own busy skin while a refresh is in flight; the block only decides the word and when it is pressable", storyId: "atoms-buttons-button-button--default" },
}

const FIVE_MINUTES_AGO = new Date(Date.now() - 5 * 60_000)
const THREE_HOURS_AGO = new Date(Date.now() - 3 * 60 * 60_000)

/** LEAF — the toolbar strip above the ranked list. */
export const Toolbar: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeaderboardToolbar"
                tier="block"
                leaf="Toolbar"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "categoryLabel = \"This week's XP\", updatedAt = 5 minutes ago",
                        why: "The common resting state: the board finished its first load a few minutes ago, so the strip names what it is ranked by and how fresh that ranking is. The refresh button stays plain — nothing is in flight.",
                        code: "<LeaderboardToolbar categoryLabel=\"This week's XP\" updatedAt={fiveMinutesAgo} refreshLabel=\"Refresh\" onRefresh={refresh} />",
                        render: (
                            <LeaderboardToolbar

                               
                                categoryLabel="This week's XP"
                                updatedAt={FIVE_MINUTES_AGO}
                                refreshLabel="Refresh"
                                onRefresh={() => {}}
                            />
                        ),
                    },
                    {
                        name: "updatedAt = 3 hours ago",
                        why: "The relative wording steps up a unit once the gap crosses an hour, so a reader glancing at the strip can tell this ranking is getting stale without doing the arithmetic themselves.",
                        code: "<LeaderboardToolbar categoryLabel=\"Course score\" updatedAt={threeHoursAgo} refreshLabel=\"Refresh\" onRefresh={refresh} />",
                        render: (
                            <LeaderboardToolbar
                                categoryLabel="Course score"
                                updatedAt={THREE_HOURS_AGO}
                                refreshLabel="Refresh"
                                onRefresh={() => {}}
                            />
                        ),
                    },
                    {
                        name: "updatedAt = undefined",
                        why: "Nothing has loaded yet, so the strip claims no timestamp at all rather than showing a fake 'just now'. The label and the button still render immediately, because this strip lives OUTSIDE the board's async region.",
                        code: "<LeaderboardToolbar categoryLabel=\"This week's XP\" refreshLabel=\"Refresh\" onRefresh={refresh} />",
                        render: (
                            <LeaderboardToolbar
                                categoryLabel="This week's XP"
                                refreshLabel="Refresh"
                                onRefresh={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isRefreshing = true",
                        why: "A refresh is in flight, so the button carries its own busy skin and locks the press. Nothing else in the row moves, which is why a reader cannot fire a second refresh mid-flight by mistake.",
                        code: "<LeaderboardToolbar categoryLabel=\"This week's XP\" updatedAt={fiveMinutesAgo} isRefreshing refreshLabel=\"Refresh\" onRefresh={refresh} />",
                        render: (
                            <LeaderboardToolbar
                                categoryLabel="This week's XP"
                                updatedAt={FIVE_MINUTES_AGO}
                                isRefreshing
                                refreshLabel="Refresh"
                                onRefresh={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
