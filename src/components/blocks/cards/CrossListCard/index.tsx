import React from "react"
import { cn } from "@heroui/react"
import { XCircleIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { StackH } from "@/components/frames/Stack"

/** Props for {@link CrossListCard}. */
export interface CrossListCardProps {
    /** The list rows — typically {@link CrossListItem} elements. */
    children: ReactNode
    /**
     * Renders `border border-default` **instead of** `shadow-surface` — when this
     * list sits NESTED inside another surface (modal / drawer / panel body).
     * Same rule as {@link import("../CheckListCard").CheckListCard}. Default `false`
     * keeps the top-level shadow look.
     */
    bordered?: boolean
    /** Where the list root sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The NEGATIVE mirror of {@link import("../CheckListCard").CheckListCard}: same
 * bounded `bg-surface` list card with full-bleed dividers, but each row carries a
 * muted cross (`XCircleIcon`, `text-muted`) instead of a success check — for
 * "things NOT included / not available / excluded" briefs (e.g. features a pricing
 * tier does NOT get, limitations, missing prerequisites). Read-only; for clickable
 * rows use `SurfaceListCard`.
 *
 * Composite, not a block (BLOCK-7): it owns no domain entity, only a reusable
 * marked-list SHAPE fed through `children`. `SurfaceCard.CrossList` covers the
 * same shape `items`-driven (COMPOSITE-8); this folder stays `children`-based
 * because existing callers (`CrossListItem` is imported directly by
 * `PricingTable`) already depend on that call shape.
 *
 * @param props - See {@link CrossListCardProps}.
 * @see Story: .storybook/stories/blocks/cards/CrossListCard/CrossListCard.stories
 */
export const CrossListCard = ({ children, bordered = false, classNames }: CrossListCardProps) => (
    <ul
        className={cn(
            "overflow-hidden rounded-3xl bg-surface",
            bordered ? "border border-default" : "shadow-surface",
            classNames,
        )}
        data-tier="composite"
        data-component="CrossListCard"
    >
        {children}
    </ul>
)

/** Props for {@link CrossListItem}. */
export interface CrossListItemProps {
    /**
     * Show the leading muted cross (`XCircleIcon`, `text-muted`). Default `true`.
     * Pass `false` for a plain row with no leading mark.
     */
    showCross?: boolean
    /** Row body — plain text (`<Typography>`) or `<MarkdownContent>`. */
    children: ReactNode
}

/**
 * One row of a {@link CrossListCard}: an optional leading muted cross followed by a
 * free body, laid out through `StackH` with a full-bleed separator (chrome, not a
 * positioning token — stays on the `<li>` itself so `StackH` only lays out the
 * row's two children; the last row hides its separator).
 *
 * @param props - See {@link CrossListItemProps}.
 */
export const CrossListItem = ({ showCross = true, children }: CrossListItemProps) => (
    <li
        className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
        data-tier="composite"
        data-component="CrossListItem"
    >
        <StackH
            gap={4}
            align="start"
            padding={4}
            principle="content-row"
            items={[
                ...(showCross
                    ? [() => (
                        <XCircleIcon
                            aria-hidden
                            focusable="false"
                            className="size-5 shrink-0 text-muted"
                        />
                    )]
                    : []),
                () => <div className="min-w-0 flex-1">{children}</div>,
            ]}
        />
    </li>
)
