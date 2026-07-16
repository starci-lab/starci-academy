import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    CaretRightIcon,
    CheckCircleIcon,
    CircleIcon,
    CreditCardIcon,
    WalletIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"

const meta: Meta<typeof SurfaceListCard> = {
    title: "Blocks/Cards/SurfaceListCard",
    component: SurfaceListCard,
}

export default meta

type Story = StoryObj<typeof SurfaceListCard>

/**
 * Use when each item is SIMPLE (label + subtitle + leading) and there are many items: gather them ALL into
 * this ONE card, with rows separated by a separator — do NOT scatter N separate Card blocks. If each item is
 * RICH (cover image, several distinct actions) to the point that it deserves its own standalone block →
 * only then split into N separate cards spaced gap-3. If the list needs to collapse/expand by group →
 * Accordion. This story is a card floating on the page background.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use when each item is SIMPLE (label + subtitle + leading) and there are many items: gather them ALL into " +
            "this ONE card, with rows separated by a separator — do NOT scatter N separate Card blocks. If each item is " +
            "RICH (cover image, several distinct actions) to the point that it deserves its own standalone block → only " +
            "then split into N separate cards spaced gap-3. If the list needs to collapse/expand by group → Accordion. " +
            "This story is a card floating on the page background (choosing a course, choosing a settings item).",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    The text-only row template: title is the required line, subtitle is an extra line added when a short piece of context is needed to help the reader pick the right row. Put a caret in trailing when pressing the row GOES to another screen; drop the caret if the row runs an action in place.
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
 * Gallery of row states: `bordered` when the card is NESTED inside another surface (for example
 * inside a modal), `selected` to mark the currently chosen item (language, payment method),
 * `isDisabled` for an option not yet unlocked, `hover="underline"` for a row leading to an article/content.
 */
export const RowVariants: Story = {
    parameters: {
        usage: "Gallery of row states: `bordered` when the card is NESTED inside another surface (for example inside a modal), `selected` to mark the currently chosen item (language, payment method), `isDisabled` for an option not yet unlocked, `hover=\"underline\"` for a row leading to an article/content.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex max-w-md flex-col gap-3 rounded-3xl bg-surface p-3 shadow-surface">
                <div className="flex flex-col gap-2">
                    <Label>Bordered</Label>
                    <Typography type="body-sm" color="muted">
                        Enable when the card is NESTED inside another visible surface — a modal, drawer, or panel body. There the shadow is nearly invisible because it sits on a surface background, so it must read via a border. A card standing alone on the page background keeps the default (shadow).
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
                        Enable for a row where the choice STAYS and reads as "the one I'm using" — language, payment method. A press-and-go row has no such state.
                    </Typography>
                </div>
                <SurfaceListCard>
                    <SurfaceListCardRow title="Vietnamese" onPress={() => {}} />
                    <SurfaceListCardRow title="English" selected onPress={() => {}} />
                </SurfaceListCard>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Disabled</Label>
                    <Typography type="body-sm" color="muted">
                        Enable when an option exists but is not unlocked for this user — keep the row rather than hiding it, because hiding it means they don't know it exists, whereas seeing it but not being able to press it makes it clear they need to upgrade or wait.
                    </Typography>
                </div>
                <SurfaceListCard>
                    <SurfaceListCardRow title="Export PDF invoice" onPress={() => {}} />
                    <SurfaceListCardRow
                        title="Export Excel report (coming soon)"
                        subtitle="Not yet available on the current plan"
                        isDisabled
                        onPress={() => {}}
                    />
                </SurfaceListCard>
            </div>
            <div className="flex max-w-md flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Hover underline</Label>
                    <Typography type="body-sm" color="muted">
                        Switch to underline when the row leads TO an article — underline on hover because it is fundamentally a link. A row that runs an action in place, or opens an item within the app, keeps the default (background fill).
                    </Typography>
                </div>
                <SurfaceListCard>
                    <SurfaceListCardRow
                        title="Why do learners drop out of courses?"
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

/** Use when each row needs an illustrative icon + a secondary label (offer, note) — for example choosing a payment method. */
export const WithLeadingAndMeta: Story = {
    parameters: {
        usage: "Use when each row needs an illustrative icon + a secondary label (offer, note) — for example choosing a payment method.",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With leading and meta</Label>
                <Typography type="body-sm" color="muted">
                    Add leading when rows are recognized faster by IMAGE than by text — payment methods, courses; drop it for a plain text list. Add meta for a short piece of info that belongs to a single row and is worth comparing across rows, for example an offer; leave it empty on rows that don't have it, don't fill it just for evenness.
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
                    title="Installments over 3 months"
                    subtitle="No interest"
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** Use when the row content doesn't fit the title/subtitle/leading template — for example a row with its own progress bar. */
export const FreeFormItems: Story = {
    parameters: {
        usage: "Use when the row content doesn't fit the title/subtitle/leading template — for example a row with its own progress bar.",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Free-form content</Label>
                <Typography type="body-sm" color="muted">
                    SurfaceListCardItem is a STATIC row by default — only add onPress or href when the whole row is genuinely pressable, as in this demo. In exchange, layout is entirely up to the caller: you must handle truncation and keep rows the same height yourself, two things the SurfaceListCardRow template already locks down.
                </Typography>
            </div>
            <SurfaceListCard>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm">
                                Introduction to Backend Programming
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

/**
 * Leading STATE-MARKER palette (icon.md §6): a checklist row whose leading icon signals progress. Icon AND
 * title carry the SAME color per state ("buộc cùng màu") — `todo` = `CircleIcon` + title both `text-foreground`;
 * `done` = `CheckCircleIcon` + title both `text-success-soft-foreground`; `fail` = `XCircleIcon` + title both
 * `text-muted` (soft/expired) or `text-danger` (needs attention). Recolor the title via a NODE (`<span>`), NOT
 * `titleClassName` (banned by lint `no-modal-title-classname`) — safe here because the row has no
 * underline-on-hover. Only ONE leading icon per row (icon.md §7 — never a state-marker + a type-icon together).
 */
export const StateMarkers: Story = {
    parameters: {
        usage:
            "Leading state-marker palette (icon.md §6): icon AND title share the same color per state — todo = " +
            "CircleIcon + foreground, done = CheckCircleIcon + success, fail = XCircleIcon + muted or danger. Recolor " +
            "the title via a <span> node, not titleClassName (lint-banned). One leading icon per row only (§7).",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>State markers</Label>
                <Typography type="body-sm" color="muted">
                    Use for a checklist whose rows track progress (daily quests, a lesson&apos;s tasks). The leading icon is a STATE signal, not a type icon — pick exactly one per row and let the title take its color, so the eye reads state from both at once.
                </Typography>
            </div>
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={<CircleIcon className="size-5 shrink-0 text-foreground" aria-hidden focusable="false" />}
                    title="Đọc nội dung bài học"
                    meta={<Typography type="body-xs" color="muted">0/1</Typography>}
                />
                <SurfaceListCardRow
                    leading={<CheckCircleIcon className="size-5 shrink-0 text-success-soft-foreground" aria-hidden focusable="false" />}
                    title={<span className="text-success-soft-foreground">Ôn 5 flashcard</span>}
                    meta={<Typography type="body-xs" color="muted">5/5</Typography>}
                />
                <SurfaceListCardRow
                    leading={<XCircleIcon className="size-5 shrink-0 text-danger" aria-hidden focusable="false" />}
                    title={<span className="text-danger">Hoàn thành 1 phiên Phỏng vấn thử</span>}
                    meta={<Typography type="body-xs" color="muted">Hết hạn</Typography>}
                />
            </SurfaceListCard>
        </div>
    ),
}
