import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    CaretRightIcon,
    CreditCardIcon,
    WalletIcon,
} from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"

const meta: Meta<typeof SurfaceListCard> = {
    title: "Core/List/SurfaceListCard",
    component: SurfaceListCard,
}

export default meta

type Story = StoryObj<typeof SurfaceListCard>

/**
 * Use when each item is SIMPLE (label + subtitle + leading) and there are many items: pack them ALL
 * into ONE card here, with rows separated by a separator — do NOT scatter N loose Card blocks. If each
 * item is RICH (cover image, several distinct actions) to the point it deserves to stand alone → then
 * split into N separate cards spaced gap-3. If the list needs to collapse/expand by group → Accordion.
 * This story is a card floating on the page background.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use when each item is SIMPLE (label + subtitle + leading) and there are many items: pack them ALL into ONE card here, with " +
            "rows separated by a separator — do NOT scatter N loose Card blocks. If each item is RICH (cover image, several distinct " +
            "actions) to the point it deserves to stand alone → then split into N separate cards spaced gap-3. If the list needs to " +
            "collapse/expand by group → Accordion. This story is a card floating on the page background (choose a course, choose a settings item).",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    Text-only row template: the title is the required line, the subtitle is an extra line added when a short bit of context helps the reader pick the right row. Put a caret in the trailing slot when clicking the row NAVIGATES to another screen; drop the caret if the row runs an action in place.
                </Typography>
            </div>
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Programming fundamentals"
                    subtitle="12 lessons · 4 hours"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
                <SurfaceListCardRow
                    title="Data structures & algorithms"
                    subtitle="18 lessons · 7 hours"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
                <SurfaceListCardRow
                    title="System design"
                    subtitle="9 lessons · 5 hours"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * A gallery of row states: `bordered` when the card is NESTED inside another surface (e.g.
 * inside a modal), `selected` to mark the currently chosen item (language, payment method),
 * `isDisabled` for an option not yet unlocked, `hover="underline"` for a row leading to an article/content.
 */
export const RowVariants: Story = {
    parameters: {
        usage: "A gallery of row states: `bordered` when the card is NESTED inside another surface (e.g. inside a modal), `selected` to mark the currently chosen item (language, payment method), `isDisabled` for an option not yet unlocked, `hover=\"underline\"` for a row leading to an article/content.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex max-w-md flex-col gap-3 rounded-3xl bg-surface p-3 shadow-surface">
                <div className="flex flex-col gap-2">
                    <Label>Bordered</Label>
                    <Typography type="body-sm" color="muted">
                        Turn on when the card is NESTED inside another already-visible surface — a modal body, drawer, panel. There the shadow is nearly invisible because it sits on a surface background, so it has to be read by its border. A card standing alone on the page background stays default (shadow).
                    </Typography>
                </div>
                <SurfaceListCard bordered>
                    <SurfaceListCardRow
                        title="MoMo wallet"
                        subtitle="Linked on 12/06/2026"
                        onPress={() => {}}
                    />
                    <SurfaceListCardRow
                        title="Visa card •••• 4242"
                        subtitle="Expires 08/28"
                        onPress={() => {}}
                        selected
                    />
                </SurfaceListCard>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Selected</Label>
                    <Typography type="body-sm" color="muted">
                        Turn on for a row whose choice STAYS and reads as "the one I'm using" — language, payment method. A click-and-go row doesn't have this state.
                    </Typography>
                </div>
                <SurfaceListCard>
                    <SurfaceListCardRow title="Tiếng Việt" onPress={() => {}} />
                    <SurfaceListCardRow title="English" selected onPress={() => {}} />
                </SurfaceListCard>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Disabled</Label>
                    <Typography type="body-sm" color="muted">
                        Turn on when an option exists but isn't unlocked for this user — keep the row rather than hide it, because hiding means they don't know it exists, whereas seeing it but not being able to click makes it clear they need to upgrade or wait.
                    </Typography>
                </div>
                <SurfaceListCard>
                    <SurfaceListCardRow title="Export PDF invoice" onPress={() => {}} />
                    <SurfaceListCardRow
                        title="Export Excel report (coming soon)"
                        subtitle="Not available on your current plan"
                        isDisabled
                        onPress={() => {}}
                    />
                </SurfaceListCard>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Hover underline</Label>
                    <Typography type="body-sm" color="muted">
                        Switch to underline when the row leads TO an article — hover underlines it because it's essentially a link. A row that runs an action in place, or opens an item within the app, stays default (background fill).
                    </Typography>
                </div>
                <SurfaceListCard>
                    <SurfaceListCardRow
                        title="Why do students drop out of courses?"
                        subtitle="12.4k reads"
                        hover="underline"
                        href="#"
                    />
                    <SurfaceListCardRow
                        title="The path to becoming a Senior Backend engineer"
                        subtitle="9.1k reads"
                        hover="underline"
                        href="#"
                    />
                </SurfaceListCard>
            </div>
        </div>
    ),
}

/** Use when each row needs an illustrative icon + a secondary label (offer, note) — e.g. choosing a payment method. */
export const WithLeadingAndMeta: Story = {
    parameters: {
        usage: "Use when each row needs an illustrative icon + a secondary label (offer, note) — e.g. choosing a payment method.",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With leading and meta</Label>
                <Typography type="body-sm" color="muted">
                    Add a leading element when rows are recognized faster by IMAGE than by text — payment methods, courses; drop it for a plain-text list. Add meta for a short piece of information that belongs to one row and is worth comparing across rows, e.g. an offer; leave it empty on rows that don't have one, don't fill it just for symmetry.
                </Typography>
            </div>
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
                            <CreditCardIcon className="size-5 text-accent-soft-foreground" aria-hidden focusable="false" />
                        </div>
                    }
                    title="One-time payment"
                    subtitle="Pay the full tuition now"
                    meta={<span className="text-xs text-muted">Save 10%</span>}
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    leading={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-default">
                            <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
                        </div>
                    }
                    title="3-month installments"
                    subtitle="No interest"
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** Use when a row's content doesn't fit the title/subtitle/leading template — e.g. a row with its own progress bar. */
export const FreeFormItems: Story = {
    parameters: {
        usage: "Use when a row's content doesn't fit the title/subtitle/leading template — e.g. a row with its own progress bar.",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Free-form content</Label>
                <Typography type="body-sm" color="muted">
                    SurfaceListCardItem defaults to a STATIC row — only add onPress or href when the whole row is genuinely clickable, as in this demo. In exchange, the layout is entirely up to the caller: you must handle truncation and keep rows the same height yourself, two things the SurfaceListCardRow template locks in for you.
                </Typography>
            </div>
            <SurfaceListCard>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm">
                                Intro to Backend Programming
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-2/3 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted">65%</span>
                    </div>
                </SurfaceListCardItem>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm">
                                Relational databases
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-1/5 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted">20%</span>
                    </div>
                </SurfaceListCardItem>
            </SurfaceListCard>
        </div>
    ),
}
