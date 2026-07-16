import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { GroupPressableCard } from "@/components/blocks/cards/GroupPressableCard"
import { settingsItems, ratingOptions } from "./components"

const meta: Meta<typeof GroupPressableCard> = {
    title: "Block/Card/GroupPressableCard",
    component: GroupPressableCard,
}
export default meta
type Story = StoryObj<typeof GroupPressableCard>

/** Use when pressing leaves nothing behind in a chosen state — the card runs an action and that's it (open a page, submit a grade); if the choice must STAY and read as "the one I chose", use SelectableCardGroup (real radios) rather than this block. */
export const Default: Story = {
    parameters: { usage: "Use when pressing leaves nothing behind in a chosen state — the card runs an action and that's it (open a page, submit a grade); if the choice must STAY and read as \"the one I chose\", use SelectableCardGroup (real radios) rather than this block." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    Choose this when each tile opens its own destination and the whole grid is just a secondary path on the screen: no tile needs more emphasis than another, and no tile owns the page's number keys.
                </Typography>
            </div>
            <GroupPressableCard
                ariaLabel="Settings pages"
                columns={{ base: 1, sm: 2 }}
                items={settingsItems}
            />
        </div>
    ),
}

/** Use when the cluster is the PRIMARY action of the screen: enable shortcuts 1–N so a user whose hands are already on the keyboard can still operate it. Only enable shortcuts here — the listener lives on window, so a secondary navigation grid that enables them would steal every number key on the page. The ONLY real case for this flag is grading SM-2 cards, so the story renders `RatingBar` directly — it is a thin wrapper around `GroupPressableCard` with exactly this flag, and mocking the tiles again here would drift from the real component at the next edit. Try pressing keys 1 to 4. */
export const ActionTilesWithShortcut: Story = {
    parameters: { usage: "Use when the cluster is the PRIMARY action of the screen: enable shortcuts 1–N so a user whose hands are already on the keyboard can still operate it. Only enable shortcuts here — the listener lives on window, so a secondary navigation grid that enables them would steal every number key on the page. The ONLY real case for this flag is grading SM-2 cards, so the story renders RatingBar directly — it is a thin wrapper around GroupPressableCard with exactly this flag, and mocking the tiles again here would drift from the real component at the next edit. Try pressing keys 1 to 4." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Action tiles with shortcuts</Label>
                <Typography type="body-sm" color="muted">
                    Choose this when the user presses this cluster many times in a row so their hands stay on the keyboard, and each tile needs to convey the consequence of the previous press before choosing.
                </Typography>
            </div>
            <RatingBar
                ariaLabel="Rate how well you remembered this card"
                options={ratingOptions}
                onRate={() => {}}
            />
        </div>
    ),
}

/** Use when a submission is in flight — lock the whole cluster to prevent a second press; the shortcuts stop with it, which differs from hiding the tiles (the user still sees the choices exist, they just can't press them yet). */
export const AllDisabled: Story = {
    parameters: { usage: "Use when a submission is in flight — lock the whole cluster to prevent a second press; the shortcuts stop with it, which differs from hiding the tiles (the user still sees the choices exist, they just can't press them yet)." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Lock the whole cluster</Label>
                <Typography type="body-sm" color="muted">
                    The state when a submission is in flight: every tile dims and stops accepting both mouse and keyboard, the user still sees the choices are there but can't press any of them.
                </Typography>
            </div>
            <GroupPressableCard
                ariaLabel="Settings pages"
                columns={{ base: 1, sm: 2 }}
                items={settingsItems.map((item) => ({ ...item, isDisabled: true }))}
            />
        </div>
    ),
}

/** Use when the first card is missing but the remaining card must still sit in the correct right column (a pager with no previous item): pin it with `@sm:col-start-2` — the SAME axis as the container the grid splits columns on, NOT a bare `col-start-2` (at the 1-column step it spawns an implicit content-sized column that squeezes the card to ~30px) and NOT `sm:` viewport (wrong axis: a narrow slot in a wide window still breaks, a wide slot in a narrow window doesn't). Shrink the window to see the card stay full-width when the grid drops to 1 column. */
export const LonePagerCardPinnedRight: Story = {
    parameters: { usage: "Use when the first card is missing but the remaining card must still sit in the correct right column (a pager with no previous item): pin it with `@sm:col-start-2` — the SAME axis as the container the grid splits columns on, NOT a bare `col-start-2` (at the 1-column step it spawns an implicit content-sized column that squeezes the card to ~30px) and NOT `sm:` viewport (wrong axis: a narrow slot in a wide window still breaks, a wide slot in a narrow window doesn't). Shrink the window to see the card stay full-width when the grid drops to 1 column." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>One card pinned to the right column</Label>
                <Typography type="body-sm" color="muted">
                    The pager state when the previous card is missing: only one card remains, but it must stay in the correct right column just as when the pair was complete, not jump to the left column.
                </Typography>
            </div>
            <GroupPressableCard
                ariaLabel="Go to previous or next content"
                columns={{ base: 1, sm: 2 }}
                items={[
                    {
                        key: "next",
                        href: "#",
                        className: "@sm:col-start-2",
                        content: (
                            <div className="flex items-center justify-end gap-2">
                                <Typography type="body-sm" weight="medium">
                                    Next content
                                </Typography>
                                <CaretRightIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
