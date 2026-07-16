import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Label, Link, Typography } from "@heroui/react"
import { PencilIcon } from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SampleBody } from "./components"

/**
 * The StarCi section card (UI 2.0): title `Label` sits OUTSIDE, above the card,
 * while `Card` holds only content. See `src/components/blocks/cards/LabeledCard/index.tsx`.
 */
const meta: Meta<typeof LabeledCard> = {
    title: "Blocks/Cards/LabeledCard",
    component: LabeledCard,
}
export default meta
type Story = StoryObj<typeof LabeledCard>

/**
 * Use for EVERY titled block — this is the default block, even when the label is just a small eyebrow
 * ("Today", "Last 7 days"): don't reach for a bare Card and place a Typography on top yourself. The Label sits
 * OUTSIDE the card, the card holds only content. Each metric with a different MEANING is its own LabeledCard —
 * don't cram two or three different-meaning things into one card; conversely a single lone number doesn't
 * deserve its own card, gather same-meaning ones together. A block with NO title → a plain Card. The ONE narrow
 * exception to this "default": a block inside a RAIL/PANEL whose list is only a few rows → LabeledList (label + list, no card frame).
 */
export const Default: Story = {
    args: {
        label: "My courses",
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    The slot to the right of the label is empty — the starting state. Only fill in labelEnd, onSeeMore or action
                    when the block genuinely has something to attach there, since all three compete for the same spot.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: {
        usage:
            "Use for EVERY titled block — this is the default block, even when the label is just a small eyebrow (\"Today\", " +
            "\"Last 7 days\"): don't reach for a bare Card and place a Typography on top yourself. The Label sits OUTSIDE the " +
            "card, the card holds only content. Each metric with a different MEANING is its own LabeledCard — don't cram two " +
            "or three different-meaning things into one card; conversely a single lone number doesn't deserve its own card, " +
            "gather same-meaning ones together. A block with NO title → a plain Card. The ONE narrow exception to this " +
            "\"default\": a block inside a RAIL/PANEL whose list is only a few rows → LabeledList (label + list, no card frame).",
    },
}

/** Use when you need to attach a short unit/note right next to the label (VND, a unit of measure, a summary status). */
export const WithLabelEnd: Story = {
    args: {
        label: "Tuition remaining",
        labelEnd: "VND",
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With a secondary label on the right</Label>
                <Typography type="body-sm" color="muted">
                    The right slot carries a MUTE tag, not pressable. The lowest priority of the three competing for that slot:
                    pass onSeeMore or action alongside it and labelEnd no longer renders.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: { usage: "Use when you need to attach a short unit/note right next to the label (VND, a unit of measure, a summary status)." },
}

/** Use when the card is only a SHORTENED version of a longer list and needs a way through to the full page — `onSeeMore` attaches that path right next to the label, without taking up space in the card body. Don't attach it when the card already shows all the data, because "see more" with nothing more to see is an empty promise. Adjust `seeMoreLabel` when "See more" doesn't fit the context (e.g. "See all"). Need a MANAGEMENT action (add/edit) instead of a link away → use `action`. */
export const WithSeeMore: Story = {
    args: {
        label: "Featured courses",
        onSeeMore: () => {},
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With a see-more link</Label>
                <Typography type="body-sm" color="muted">
                    The right slot carries a NAVIGATION path away from the card. Middle priority: it overrides labelEnd when passed together,
                    but is itself overridden by action.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: { usage: "Use when the card is only a SHORTENED version of a longer list and needs a way through to the full page — onSeeMore attaches that path right next to the label, without taking up space in the card body. Don't attach it when the card already shows all the data, because \"see more\" with nothing more to see is an empty promise. Adjust seeMoreLabel when \"See more\" doesn't fit the context (e.g. \"See all\"). Need a MANAGEMENT action (add/edit) instead of a link away → use action." },
}

/**
 * Use when the block needs a management action alongside the label (add/edit/manage) rather than a link to
 * another page like "see more". `action` is ALWAYS a `Link` (not a solid Button/Chip) — the same hover formula
 * as `onSeeMore`: `no-underline` + `transition-opacity hover:opacity-60` (NO underline on hover).
 * An optional icon goes before or after the text; only `onSeeMore`'s `CaretRightIcon` gets the subtle
 * slide effect (`group-hover:translate-x-1`), other icons don't need it.
 */
export const WithAction: Story = {
    args: {
        label: "Manager",
        action: (
            <Link className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm text-accent-soft-foreground no-underline transition-opacity hover:opacity-60">
                <PencilIcon aria-hidden focusable="false" className="size-4" />
                Add / manage
            </Link>
        ),
        children: <SampleBody />,
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With a management action</Label>
                <Typography type="body-sm" color="muted">
                    The right slot carries an IN-PLACE action (add/edit/manage) rather than a link away. The highest priority
                    of the three competing for the slot: with action present, both labelEnd and onSeeMore are ignored.
                </Typography>
            </div>
            <LabeledCard {...args} />
        </div>
    ),
    parameters: { usage: "Use when the block needs a management action alongside the label (add/edit/manage) rather than a link to another page like \"see more\". `action` is always a Link, hover = opacity (no underline), optional icon before/after the text." },
}

/**
 * Use `description` for a caption/prompt/status that belongs to the section but sits BELOW the card (`gap-2`),
 * never inside the surface — e.g. a "complete all 3 to claim" prompt or a claim button under a task list. Keeps
 * it out of the card so it never becomes surface-in-surface. The caller owns the node's alignment. Real pattern:
 * `DailyQuest` ("Nhiệm vụ hôm nay") — the task list is the card, the claim prompt/button is the description.
 */
export const WithDescription: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With a description below the card</Label>
                <Typography type="body-sm" color="muted">
                    The DailyQuest shape: `frameless` LabeledCard → `SurfaceListCard` (the ONE surface) → rows, with
                    the claim prompt as `description` BELOW the card at `gap-2` — kept OUTSIDE the surface so it never
                    becomes surface-in-surface. The label→card gap stays `gap-3`; only card→description is `gap-2`.
                </Typography>
            </div>
            <LabeledCard
                label="Today's tasks"
                frameless
                description={(
                    <Typography type="body-xs" color="muted">
                        Complete all 3 to claim 20 points.
                    </Typography>
                )}
            >
                <SurfaceListCard>
                    <SurfaceListCardItem>
                        <span className="text-sm">Read a lesson</span>
                    </SurfaceListCardItem>
                    <SurfaceListCardItem>
                        <span className="text-sm">Pass a challenge</span>
                    </SurfaceListCardItem>
                    <SurfaceListCardItem>
                        <span className="text-sm">Review flashcards</span>
                    </SurfaceListCardItem>
                </SurfaceListCard>
            </LabeledCard>
        </div>
    ),
    parameters: { usage: "The DailyQuest shape: `frameless` LabeledCard + `SurfaceListCard` list + a claim prompt as `description` below the card (gap-2), outside the surface so it never becomes surface-in-surface. Use `description` for any caption/prompt/button tied to the section but that must stay out of the card." },
}

/**
 * Surface-in-surface: a list surface NESTED inside a visible PARENT surface (modal/drawer/panel body). The
 * parent panel is a REAL `Card` (don't hand-roll a `<div>` mimicking Card's exact classes — Card is already a
 * ready-made component, defaulting to `p-3 rounded-3xl shadow-surface`, exactly the "top-level surface" skin you
 * need); inside it a nested `SurfaceListCard bordered` — use a BORDER instead of shadow because shadow-surface is
 * nearly invisible when placed on another `bg-surface`. This is the true "surface in surface" (DIFFERENT from a
 * list card standing alone in `CategorizedList`). Real pattern:
 * `PaymentModal` (a payment-gateway list nested in the modal body).
 */
export const SurfaceInSurface: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nested in a parent surface</Label>
                <Typography type="body-sm" color="muted">
                    Use when a list sits inside a visible PARENT surface (modal/panel body). Enable frameless
                    and give the inner list a SurfaceListCard bordered.
                </Typography>
            </div>
            {/* parent panel = modal/drawer body (PARENT surface) — has its own label + content */}
            <Card>
                <CardContent>
                    <LabeledCard label="Payment method" frameless>
                        <SurfaceListCard bordered>
                            <SurfaceListCardItem>
                                <span className="text-sm">MoMo wallet</span>
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <span className="text-sm">VNPay QR</span>
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <span className="text-sm">Credit / debit card</span>
                            </SurfaceListCardItem>
                        </SurfaceListCard>
                    </LabeledCard>
                </CardContent>
            </Card>
        </div>
    ),
    parameters: { usage: "TRUE surface-in-surface: 1 list surface nested in a visible PARENT surface (modal/panel body: a REAL `Card`, not a hand-rolled div). The inner uses `SurfaceListCard bordered` (border instead of shadow because the shadow is invisible on bg-surface). Different from a list card standing alone. Real pattern: PaymentModal." },
}

/**
 * Sub-label by category: split ONE long list into GROUPS. A single `LabeledCard frameless` (the main label)
 * wraps several `LabeledCard subtleLabel frameless` + `SurfaceListCard` clusters — each group has a sub-label
 * eyebrow (`text-xs text-muted`) sitting right above a standalone LIST CARD (shadow, NOT `bordered` — it is NOT
 * nested inside any surface, unlike `SurfaceInSurface`). The gap between groups is `gap-3` (they belong to the
 * same category, not two separate regions). Use when a list needs sectioning (Basic / Advanced…) rather than
 * being dumped flat in one run.
 */
export const CategorizedList: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Grouped by sub-label</Label>
                <Typography type="body-sm" color="muted">
                    Use when a long list needs to be split into subgroups (Basic / Advanced) rather than dumped flat.
                    Each group is a standalone list card, not nested in a surface.
                </Typography>
            </div>
            <LabeledCard label="Lesson list" frameless contentClassName="flex flex-col gap-3">
                <LabeledCard label="Basic" subtleLabel frameless>
                    <SurfaceListCard>
                        <SurfaceListCardItem>
                            <span className="text-sm">Lesson 1: Intro to React Hooks</span>
                        </SurfaceListCardItem>
                        <SurfaceListCardItem>
                            <span className="text-sm">Lesson 2: useState and useEffect</span>
                        </SurfaceListCardItem>
                    </SurfaceListCard>
                </LabeledCard>
                <LabeledCard label="Advanced" subtleLabel frameless>
                    <SurfaceListCard>
                        <SurfaceListCardItem>
                            <span className="text-sm">Lesson 3: Custom Hooks</span>
                        </SurfaceListCardItem>
                        <SurfaceListCardItem>
                            <span className="text-sm">Lesson 4: useReducer &amp; Context</span>
                        </SurfaceListCardItem>
                    </SurfaceListCard>
                </LabeledCard>
            </LabeledCard>
        </div>
    ),
    parameters: { usage: "Sub-label by category: split a long list into groups. 1 `LabeledCard frameless` (main label) wraps several `LabeledCard subtleLabel frameless` + `SurfaceListCard` clusters — each group has a sub-label eyebrow above a standalone LIST CARD (shadow, NOT bordered — not nested in a surface). Gap between groups is gap-3 (same category). Different from surface-in-surface." },
}
