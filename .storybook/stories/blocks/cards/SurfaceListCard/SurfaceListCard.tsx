import React from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { Typography, cn } from "@heroui/react"
import { SurfaceCardHeader, surfaceSectionGap, surfaceFrame, type SurfaceLabelProps } from "../surface-card-header"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/cards/SurfaceListCard`
 * (thầy 2026-07-21: "đầy đủ hết" — port the whole row API + all legacy states, không chế).
 * Authored in Storybook (not `src`); synced to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Semantic verdict tones — literal Tailwind classes so the JIT scanner sees them. */
export type VerdictBandVariant = "accent" | "success" | "warning" | "danger"

/** Left-edge DATA-signal band on a row (`card.md` §3i) — a colour that MEANS something from data. */
export interface VerdictBand {
    /** Turn the left band on. */
    enable: boolean
    /** Semantic tone (literal lookup, no safelist needed). */
    variant?: VerdictBandVariant
    /** Raw Tailwind color + shade (e.g. `"amber-500"`); ignored when `variant` is set. */
    color?: string
}

const VERDICT_VARIANT_CLASS: Record<VerdictBandVariant, string> = {
    accent: "inset-shadow-[2px_0_0_0_var(--accent)]",
    success: "inset-shadow-[2px_0_0_0_var(--success)]",
    warning: "inset-shadow-[2px_0_0_0_var(--warning)]",
    danger: "inset-shadow-[2px_0_0_0_var(--danger)]",
}

/** Resolves a {@link VerdictBand} into a 2px inset-shadow left band (curves with the corner radius). */
const verdictBandClassName = (withVerdict?: VerdictBand): string | undefined => {
    if (!withVerdict?.enable) return undefined
    const shadowClass = withVerdict.variant
        ? VERDICT_VARIANT_CLASS[withVerdict.variant]
        : withVerdict.color
            ? `inset-shadow-[2px_0_0_0_var(--color-${withVerdict.color})]`
            : undefined
    return cn("pl-4", shadowClass)
}

/**
 * Interactive anchor for a clickable row: an INTERNAL route (`/…`) → Next `<Link>`
 * (client-side push, keeps history); a protocol / external href → native `<a>`.
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
    children: ReactNode
}) => {
    if (href.startsWith("/")) {
        return <Link href={href} onClick={onClick} className={className}>{children}</Link>
    }
    return <a href={href} onClick={onClick} className={className}>{children}</a>
}

/** Props for the target {@link SurfaceListCard}. */
export interface SurfaceListCardProps extends SurfaceLabelProps {
    /** The rows ({@link SurfaceListCardRow}/{@link SurfaceListCardItem}). Omit → renders `emptyState`. */
    children?: ReactNode
    /** Shown (padded) INSIDE the surface when there are no rows — so empty reads as intentional. */
    emptyState?: ReactNode
    /** `border border-default` instead of `shadow-surface` — for a nested surface. */
    bordered?: boolean
    /** Secondary node rendered OUTSIDE (below) the list, `gap-2` — a caption/prompt. */
    description?: ReactNode
    /** Extra classes on the outer section / surface. */
    className?: string
}

/**
 * Bounded SURFACE list card: one `bg-surface` container with a large radius holding
 * {@link SurfaceListCardRow}s edge-to-edge, each with a full-bleed separator (the
 * last row hides its own). Pass `label` for a section header baked in above the list.
 *
 * @param props - {@link SurfaceListCardProps}
 */
export const SurfaceListCard = ({
    children,
    emptyState,
    bordered = false,
    description,
    className,
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel,
    action,
    subtleLabel = false,
}: SurfaceListCardProps) => {
    const isEmpty = React.Children.count(children) === 0
    const inner = isEmpty && emptyState != null ? <div className="p-8">{emptyState}</div> : children
    const bare = label == null && description == null
    const surface = (
        <div
            className={cn(
                "overflow-hidden",
                surfaceFrame(bordered),
                bare && className,
            )}
        >
            {inner}
        </div>
    )
    if (bare) return surface
    const withCaption = description != null ? (
        <div className="flex flex-col gap-2">
            {surface}
            {description}
        </div>
    ) : surface
    return (
        <section className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            <SurfaceCardHeader
                label={label}
                labelEnd={labelEnd}
                onSeeMore={onSeeMore}
                seeMoreLabel={seeMoreLabel}
                action={action}
                subtleLabel={subtleLabel}
            />
            {withCaption}
        </section>
    )
}

/** Props for {@link SurfaceListCardRow}. */
export interface SurfaceListCardRowProps {
    /** Optional leading node (thumbnail/icon), kept at intrinsic size. */
    leading?: ReactNode
    /** Primary line — foreground, single-line truncate. */
    title: ReactNode
    /** Extra className on the title's own Typography (e.g. a selected-row colour). */
    titleClassName?: string
    /** Optional secondary line — muted, smaller, single-line truncate. */
    subtitle?: ReactNode
    /** Optional right-aligned metadata (chips/counts) before the trailing node. */
    meta?: ReactNode
    /** Optional far-right node (caret / inline action). */
    trailing?: ReactNode
    /** Press handler → renders an interactive `<button>` row. */
    onPress?: () => void
    /** Link target → renders an `<a>`/`<Link>` row that navigates on click. */
    href?: string
    /** Tints the row as the active selection (`bg-accent-soft`). */
    selected?: boolean
    /** Disables the row (dimmed, non-interactive). */
    isDisabled?: boolean
    /** `"fill"` (default) tints the whole row on hover; `"underline"` underlines the TITLE (row-as-link). */
    hover?: "fill" | "underline"
    /** Left DATA-signal band ({@link VerdictBand}). */
    withVerdict?: VerdictBand
    /** Extra classes on the row. */
    className?: string
}

/**
 * One row of a {@link SurfaceListCard}: leading · title+subtitle · meta+trailing,
 * with a full-bleed inset separator auto-hidden on the last row. STATIC by default
 * (a plain `<div>`); pass `onPress`/`href` to make the whole row a tappable
 * `<button>`/`<a>` with `hover:bg-default` + focus ring.
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
    const interactive = Boolean(onPress || href)
    const underlineHover = hover === "underline"
    const rowClassName = cn(
        "relative flex w-full items-center gap-3 p-3 text-left",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-['']",
        "last:after:hidden",
        interactive && "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        interactive && (underlineHover ? "group" : "hover:bg-default"),
        interactive && !isDisabled && "cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected && "bg-accent-soft",
        verdictBandClassName(withVerdict),
        withVerdict?.enable && "first:rounded-t-3xl last:rounded-b-3xl",
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
                    <Typography type="body-xs" color="muted" truncate>{subtitle}</Typography>
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
        return <RowAnchor href={href} onClick={onPress} className={rowClassName}>{content}</RowAnchor>
    }
    if (onPress) {
        return <button type="button" onClick={onPress} disabled={isDisabled} className={rowClassName}>{content}</button>
    }
    return <div className={rowClassName}>{content}</div>
}

/** Props for {@link SurfaceListCardItem}. */
export interface SurfaceListCardItemProps {
    /** Arbitrary row content (the block owns padding + the inset separator). */
    children: ReactNode
    /** Press handler → interactive `<button>` row. */
    onPress?: () => void
    /** Link target → `<a>`/`<Link>` row. */
    href?: string
    /** Disables the interactive row. */
    isDisabled?: boolean
    /** `"fill"` (default) tints the row on hover; `"underline"` is link-style (no fill). */
    hover?: "fill" | "underline"
    /** Left DATA-signal band ({@link VerdictBand}). */
    withVerdict?: VerdictBand
    /** Extra classes on the item. */
    className?: string
}

/**
 * One FREE-FORM row of a {@link SurfaceListCard} — bespoke content (not the fixed
 * leading/title/subtitle slots of {@link SurfaceListCardRow}). The block owns the
 * padding + inset bottom separator; the caller lays out whatever it needs inside.
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
        withVerdict?.enable && "first:rounded-t-3xl last:rounded-b-3xl",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-['']",
        "last:after:hidden",
        interactive && "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        interactive && (hover === "underline" ? "group" : "hover:bg-default"),
        interactive && !isDisabled && "cursor-pointer",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )
    if (href) {
        return <RowAnchor href={href} onClick={onPress} className={itemClassName}>{children}</RowAnchor>
    }
    if (onPress) {
        return <button type="button" onClick={onPress} disabled={isDisabled} className={itemClassName}>{children}</button>
    }
    return <div className={itemClassName}>{children}</div>
}
