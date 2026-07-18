"use client"

import React from "react"
import Link from "next/link"
import { cn, Typography } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { type VerdictBand, verdictBandClassName } from "../verdict-band"

/**
 * The interactive anchor for a clickable surface-list row. An INTERNAL app route
 * (href starting with `/`) renders a Next `<Link>` → client-side `router.push`:
 * SPA navigation that keeps history (Back works) with NO full-page reload — and
 * NEVER `router.replace` (a link click must not erase the entry it came from).
 * Protocol / external hrefs (`mailto:`, `tel:`, `http(s)://`, `#`) fall back to a
 * native `<a>` (Next `<Link>` is for in-app routes only). Ref feedback 2026-07-17
 * "bấm row = router.push chứ không phải router.replace, dù là link".
 */
const RowAnchor = ({
    href,
    onClick,
    className,
    children,
}: {
    href: string
    onClick?: () => void
    className?: string
    children: React.ReactNode
}) => {
    if (href.startsWith("/")) {
        return (
            <Link href={href} onClick={onClick} className={className}>
                {children}
            </Link>
        )
    }
    return (
        <a href={href} onClick={onClick} className={className}>
            {children}
        </a>
    )
}

/** Props for {@link SurfaceListCard}. */
export interface SurfaceListCardProps extends WithClassNames<undefined> {
    /** The rows ({@link SurfaceListCardRow}) of the joined list. */
    children: React.ReactNode
    /**
     * Renders `border border-default` instead of `shadow-surface` — for when
     * this list sits NESTED inside another surface (a modal/drawer body),
     * where `--surface-shadow` can render invisible against the parent surface
     * (dark mode) — nested cards need a border to delineate (`components/card.md`
     * §"surface-in-surface / nested" — GIỮ border, KHÔNG convert to shadow).
     * Defaults to `false` (existing top-level usages keep the shadow look).
     */
    bordered?: boolean
}

/**
 * Bounded SURFACE list card: one `bg-surface` container with a border + large
 * radius, holding {@link SurfaceListCardRow}s edge-to-edge (the `Accordion
 * variant="surface"` skin — NOT a real accordion). Each row owns the FULL-BLEED
 * separator + hover; the last row hides its separator automatically (thầy
 * 2026-07-14: "surface in surface cũng separator full width nhé" — full-bleed
 * everywhere, no inset-vs-nested split).
 *
 * Use for a list of clickable items that should read as ONE card (foundation
 * categories/resources, payment methods…), not N separate cards. Style lives
 * here (block); features only feed rows. Ref `elements/card.md` §3c.
 *
 * @param props - {@link SurfaceListCardProps}
 * @see Story: .storybook/stories/blocks/cards/SurfaceListCard/SurfaceListCard.stories
 */
export const SurfaceListCard = ({ children, bordered = false, className }: SurfaceListCardProps) => (
    <div
        className={cn(
            "overflow-hidden rounded-3xl bg-surface",
            bordered ? "border border-default" : "shadow-surface",
            className,
        )}
    >
        {children}
    </div>
)

/** Props for {@link SurfaceListCardRow}. */
export interface SurfaceListCardRowProps extends WithClassNames<undefined> {
    /** Optional leading node (thumbnail/icon), kept at intrinsic size. */
    leading?: React.ReactNode
    /** Primary line — medium foreground, single-line truncate. */
    title: React.ReactNode
    /**
     * Extra className applied directly to the title's own `Typography` element
     * (e.g. `text-accent-soft-foreground` for a selected row) — NOT a wrapper span around
     * `title`. `text-decoration-color` for `hover="underline"` is resolved from
     * THIS element's own `color` (the one carrying `group-hover:underline`),
     * not from a nested child's — a child-only color override leaves the
     * hover underline in the default colour while the text itself changes,
     * a visible mismatch. Ref `components/icon.md` §6.
     */
    titleClassName?: string
    /** Optional secondary line — muted, smaller, single-line truncate. */
    subtitle?: React.ReactNode
    /** Optional right-aligned metadata (chips/counts) before the trailing node. */
    meta?: React.ReactNode
    /** Optional far-right node (caret / inline action). */
    trailing?: React.ReactNode
    /** Press handler → renders an interactive `<button>` row. */
    onPress?: () => void
    /** Link target → renders an `<a>` row that navigates on click. */
    href?: string
    /** Tints the row as the active selection. */
    selected?: boolean
    /** Disables the row (dimmed, non-interactive). */
    isDisabled?: boolean
    /**
     * Hover treatment. `"fill"` (default) tints the whole row (`bg-default`) — for
     * card-like rows / bounded objects. `"underline"` is link-style: the TITLE
     * underlines on hover with NO row fill — for a list whose title IS the link
     * (e.g. a most-read list). Ref `interactive-needs-hover` (row-as-link → underline
     * the label, don't colour the whole block).
     */
    hover?: "fill" | "underline"
    /**
     * Verdict band: an inset colored PILL on the left marking this row with a signal
     * that comes from DATA (`card.md` §3i) — e.g. a keyword's popularity tier. See
     * {@link VerdictBand} (same shape as `SurfaceListCardItem.withVerdict`).
     */
    withVerdict?: VerdictBand
}

/**
 * One row of a {@link SurfaceListCard}, laying out leading · title+subtitle ·
 * meta+trailing (the same slot shape as `ListRow`, surface-card skin) with a
 * full-bleed inset separator auto-hidden on the last row. STATIC by default (a
 * plain `<div>`, NO hover/focus/cursor); pass `onPress`/`href` to make the whole
 * row a tappable `<button>`/`<a>` with `hover:bg-default` + focus ring. A static
 * row never fakes interactivity with a hover tint (`hover-style-matches-clickable-nature`).
 *
 * @param props - {@link SurfaceListCardRowProps}
 */
export const SurfaceListCardRow = ({
    leading,
    title,
    titleClassName,
    subtitle,
    meta,
    trailing,
    onPress,
    href,
    selected = false,
    isDisabled = false,
    hover = "fill",
    withVerdict,
    className,
}: SurfaceListCardRowProps) => {
    // a row is only interactive when it actually does something; a STATIC row must
    // not fake interactivity with a hover tint / focus ring / button semantics
    // (`hover-style-matches-clickable-nature` — mirrors SurfaceListCardItem).
    const interactive = Boolean(onPress || href)
    const underlineHover = hover === "underline"
    const rowClassName = cn(
        "relative flex w-full items-center gap-3 p-3 text-left",
        // full-bleed separator, hidden on the last row of the card
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-['']",
        "last:after:hidden",
        // hover + focus + cursor ONLY when interactive. link-style rows form a hover
        // `group` (the title underlines) with no fill; card-style rows tint the row
        interactive && "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        interactive && (underlineHover ? "group" : "hover:bg-default"),
        interactive && !isDisabled && "cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected && "bg-accent-soft",
        verdictBandClassName(withVerdict),
        className,
    )

    const content = (
        <>
            {leading ? <div className="shrink-0">{leading}</div> : null}
            <div className="flex min-w-0 flex-col gap-0">
                <Typography
                    type="body-sm"
                    truncate
                    className={cn(underlineHover && "underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline", titleClassName)}
                >
                    {title}
                </Typography>
                {subtitle ? (
                    <Typography type="body-xs" color="muted" truncate>
                        {subtitle}
                    </Typography>
                ) : null}
            </div>
            {meta || trailing ? (
                <div className="ml-auto flex shrink-0 items-center gap-2">
                    {meta}
                    {trailing}
                </div>
            ) : null}
        </>
    )

    if (href) {
        return (
            <RowAnchor href={href} onClick={onPress} className={rowClassName}>
                {content}
            </RowAnchor>
        )
    }
    if (onPress) {
        return (
            <button type="button" onClick={onPress} disabled={isDisabled} className={rowClassName}>
                {content}
            </button>
        )
    }
    // static row (no onPress/href) — a plain div: no button semantics, no hover
    return <div className={rowClassName}>{content}</div>
}

/** Props for {@link SurfaceListCardItem}. */
export interface SurfaceListCardItemProps extends WithClassNames<undefined> {
    /** Arbitrary row content (the block owns padding + the inset separator). */
    children: React.ReactNode
    /** Press handler → renders an interactive `<button>` row (hover + focus ring). */
    onPress?: () => void
    /** Link target → renders an `<a>` row that navigates on click. */
    href?: string
    /** Disables the interactive row (dimmed, non-interactive). */
    isDisabled?: boolean
    /**
     * Hover treatment for an interactive row. `"fill"` (default) tints the whole
     * row (`bg-default`) — the accordion-skin hover, for SELECT/expand rows that
     * keep you on the surface (e.g. payment methods). `"underline"` makes the row a
     * hover `group` with NO fill — for a NAV row whose title is a link (navigates
     * away); the feature adds `group-hover:underline` to its title. Ref
     * `hover-style-matches-clickable-nature` (go-there → underline, stay-here → fill).
     */
    hover?: "fill" | "underline"
    /**
     * Verdict variant: a LEFT band (`border-l-4`) marking this row with a signal that
     * comes from DATA (`card.md` §3i) — e.g. the league's promote/demote zone. See
     * {@link VerdictBand} (same shape as `SectionCard.withVerdict`).
     */
    withVerdict?: VerdictBand
}

/**
 * One free-form row of a {@link SurfaceListCard} — bespoke content (not the fixed
 * leading/title/subtitle slots of {@link SurfaceListCardRow}). The block owns the
 * row padding + inset bottom separator (auto-hidden on the last row); the feature
 * lays out whatever it needs inside (e.g. a changelog entry, or a course row with a
 * progress bar). STATIC by default; pass `onPress`/`href` to make the WHOLE row a
 * tappable `<button>`/`<a>`. `hover="fill"` (default) tints the row (accordion skin);
 * `hover="underline"` is link-style (the row is a `group`, no fill — the feature
 * underlines its own title). Ref `elements/card.md` §3b/§3c.
 *
 * @param props - {@link SurfaceListCardItemProps}
 */
export const SurfaceListCardItem = ({
    children,
    onPress,
    href,
    isDisabled = false,
    hover = "fill",
    withVerdict,
    className,
}: SurfaceListCardItemProps) => {
    const interactive = Boolean(onPress || href)
    const itemClassName = cn(
        "relative block w-full p-3 text-left",
        verdictBandClassName(withVerdict),
        // full-bleed separator, hidden on the last row of the card
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-['']",
        "last:after:hidden",
        interactive && "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        // link-style rows form a hover `group` (the title underlines) with NO fill;
        // select/expand rows tint the whole row (accordion skin)
        interactive && (hover === "underline" ? "group" : "hover:bg-default"),
        interactive && !isDisabled && "cursor-pointer",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )

    if (href) {
        return (
            <RowAnchor href={href} onClick={onPress} className={itemClassName}>
                {children}
            </RowAnchor>
        )
    }
    if (onPress) {
        return (
            <button type="button" onClick={onPress} disabled={isDisabled} className={itemClassName}>
                {children}
            </button>
        )
    }
    return <div className={itemClassName}>{children}</div>
}
