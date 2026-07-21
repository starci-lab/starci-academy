import React from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/PressableCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 */

/** Props for the {@link PressableCard} block. */
export interface PressableCardProps {
    /** Card body — composed freely by the caller (icon tiles, text, chips…). */
    children: React.ReactNode
    /**
     * Press handler for an action card (select / toggle). Ignored when
     * {@link PressableCardProps.href} is set. One of `onPress` / `href` should
     * be provided for the card to be interactive.
     */
    onPress?: () => void
    /** Navigation target — renders the card as an anchor when provided. */
    href?: string
    /** Disables interaction and dims the card (action cards only). */
    isDisabled?: boolean
    /**
     * Secondary interactive controls (buttons / menus) that live INSIDE the card
     * but act INDEPENDENTLY of the whole-card press — e.g. a "Continue" button +
     * an overflow menu on a course-progress card.
     *
     * Providing this switches the card to the accessible **stretched-link**
     * pattern: the whole-card target becomes a TRANSPARENT overlay that covers
     * the card, and these actions sit ABOVE it (later in source order + `z-10`)
     * so each stays separately clickable — instead of illegally nesting a
     * `<button>` inside the card's own `<button>`/`<a>`.
     *
     * REQUIRES {@link PressableCardProps.label} — the overlay target no longer
     * wraps the children text, so it needs its own accessible name.
     */
    actions?: React.ReactNode
    /**
     * Accessible name for the whole-card press target. REQUIRED when
     * {@link PressableCardProps.actions} is set (the stretched overlay covers the
     * card but has no visible text of its own). Optional otherwise — without
     * `actions` the children ARE the card's accessible name, so pass this only
     * when they carry no readable text (an icon-only tile).
     */
    label?: string
    /** Extra classes on the card surface. */
    className?: string
}

/**
 * A whole-card press target with the default surface card look (surface fill,
 * concentric `rounded-3xl`, fixed `px-4 py-3` padding, `shadow-surface`
 * elevation AT REST — per `card.md` §0) plus a hover affordance and keyboard
 * focus ring. Exists because HeroUI v3 `Card` is a non-interactive `<div>` —
 * this block owns the card styling on a real `<button>` / `<a>`. Use for
 * navigation tiles, selectable option cards, and bookmark rows.
 *
 * When the card also needs its OWN buttons (a "Continue" CTA, an overflow menu),
 * pass them via {@link PressableCardProps.actions} + {@link PressableCardProps.label}:
 * the card renders as the accessible stretched-link pattern.
 *
 * @param props - {@link PressableCardProps}
 */
export const PressableCard = ({
    children,
    onPress,
    href,
    isDisabled = false,
    actions,
    label,
    className,
}: PressableCardProps) => {
    // Shared card surface + disabled dim, identical across both render paths. One
    // hover treatment only (tint) — no lift variant, no press-scale.
    const surface = cn(
        "rounded-3xl bg-surface px-4 py-3 text-left shadow-surface transition-colors hover:bg-surface-secondary",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )

    // ── Simple whole-card target (no secondary actions) — the whole card is ONE
    // <button>/<a> and its children are its label. ─────────────────────────────
    if (!actions) {
        const base = cn(
            "block w-full outline-none focus-visible:ring-2 focus-visible:ring-accent",
            surface,
        )
        if (href && !isDisabled) {
            return (
                <a href={href} aria-label={label} className={base}>
                    {children}
                </a>
            )
        }
        return (
            <button
                type="button"
                onClick={onPress}
                disabled={isDisabled}
                aria-label={label}
                className={cn(base, !isDisabled && "cursor-pointer")}
            >
                {children}
            </button>
        )
    }

    // ── Card WITH its own buttons — stretched-link pattern. The card is a plain
    // relative <div>; a transparent overlay <a>/<button> covers it, and the
    // actions sit ABOVE the overlay so they stay clickable. ────────────────────
    const overlay = cn(
        "absolute inset-0 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    )
    return (
        <div className={cn("relative w-full", surface)}>
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    {children}
                </div>
                {/* Secondary actions — later in source order than the overlay AND
                    `relative z-10`, so they hit-test ABOVE the stretched overlay. */}
                <div className="relative z-10 flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            </div>
            {href && !isDisabled ? (
                <a href={href} aria-label={label} className={overlay} />
            ) : (
                <button
                    type="button"
                    onClick={onPress}
                    disabled={isDisabled}
                    aria-label={label}
                    className={overlay}
                />
            )}
        </div>
    )
}
