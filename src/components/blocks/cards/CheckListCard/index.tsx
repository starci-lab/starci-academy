import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon } from "@phosphor-icons/react"

/**
 * Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`.
 * This file has TWO public components, not one, so this is a record (same shape
 * `Stack.tsx` uses) rather than the single `{ tier, name }` most composite files export.
 */
export const meta = {
    CheckListCard: { tier: "composite", name: "CheckListCard" },
    CheckListItem: { tier: "composite", name: "CheckListItem" },
} as const

/** Props for {@link CheckListCard}. */
export interface CheckListCardProps {
    /** The list rows — typically {@link CheckListItem} elements. */
    children: ReactNode
    /**
     * Renders `border border-default` **instead of** `shadow-surface` — when this
     * list sits NESTED inside another surface (modal / drawer / panel body).
     * Shadow is invisible on `bg-surface` (surface-in-surface); use border to
     * delineate. Same rule as `SurfaceListCard bordered`. Default `false` keeps
     * the top-level shadow look.
     */
    bordered?: boolean
}

/**
 * Static "list card" surface (see `elements/card.md` §3b): one bounded `bg-surface`
 * card whose rows are separated by full-bleed dividers (the `Accordion
 * variant="surface"` look, but static — no expand, no click). Pair it with a
 * `LabeledCard frameless` for the section label (label outside — no card-in-card).
 *
 * **Surface-in-surface:** inside a modal/drawer, pass `bordered` (border, not
 * shadow). Top-level on the page → omit `bordered` (shadow).
 *
 * For clickable rows use `SurfaceListCard` instead — this one is for read-only
 * brief lists (value props, expected outputs, prerequisites…).
 *
 * @param props - See {@link CheckListCardProps}.
 * @see Story: .storybook/stories/blocks/cards/CheckListCard/CheckListCard.stories
 */
export const CheckListCard = ({ children, bordered = false }: CheckListCardProps) => (
    <ul
        className={cn(
            "overflow-hidden rounded-3xl bg-surface",
            bordered ? "border border-default" : "shadow-surface",
        )}
        data-tier="composite"
        data-component="CheckListCard"
    >
        {children}
    </ul>
)

/** Props for {@link CheckListItem}. */
export interface CheckListItemProps {
    /**
     * Show the leading success check (`CheckCircleIcon`, `text-success-soft-foreground`). Default
     * `true`. Pass `false` for "things you need beforehand" lists (prerequisites) —
     * those are requirements, NOT achievements, so they carry no tick.
     */
    showCheck?: boolean
    /** Row body — plain text (`<Typography>`) or `<MarkdownContent>`. */
    children: ReactNode
}

/**
 * One row of a {@link CheckListCard}: an optional leading success check followed by a
 * free body. Rows are divided by a full-bleed separator (the last row hides it) —
 * surface-in-surface also keeps separators edge-to-edge.
 *
 * The row's flex layout stays a raw `cn()` composition, not a `Stack` frame: the
 * full-bleed separator is a pseudo-element (`after:…`) on this SAME `<li>`, and a
 * frame's typed `classNames` (position-only) can't carry it. Same call every other
 * converted row of this shape makes — `List.Row`, `SurfaceListCardRow`,
 * `SurfaceCard.Nested`'s `NestedSection` — none of them route their row through a
 * frame either, for the identical reason.
 *
 * @param props - See {@link CheckListItemProps}.
 */
export const CheckListItem = ({ showCheck = true, children }: CheckListItemProps) => (
    <li
        className="relative flex items-start gap-3 p-3 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
        data-tier="composite"
        data-component="CheckListItem"
    >
        {showCheck ? (
            <CheckCircleIcon
                aria-hidden
                focusable="false"
                className="size-5 shrink-0 text-success-soft-foreground"
            />
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
    </li>
)
