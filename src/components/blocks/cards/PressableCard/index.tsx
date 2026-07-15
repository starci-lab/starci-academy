"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for the {@link PressableCard} block. */
export interface PressableCardProps extends WithClassNames<undefined> {
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
     * pattern (Inclusive Components / Adrian Roselli): the whole-card target
     * becomes a TRANSPARENT overlay that covers the card, and these actions sit
     * ABOVE it (later in source order + `z-10`) so each stays separately
     * clickable. This is the correct alternative to illegally nesting a
     * `<button>` inside the card's own `<button>`/`<a>` — which is invalid HTML,
     * breaks the keyboard/AT focus order, AND is what made the card grow tall
     * (a block button laying its interactive children out on their own lines).
     *
     * REQUIRES {@link PressableCardProps.label} — the overlay target no longer
     * wraps the children text, so it needs its own accessible name.
     */
    actions?: React.ReactNode
    /**
     * Accessible name for the whole-card press target. REQUIRED when
     * {@link PressableCardProps.actions} is set (the stretched overlay covers the
     * card but has no visible text of its own, so it must carry an `aria-label`).
     * Optional otherwise — without `actions` the children ARE the card's
     * accessible name, so pass this only when they carry no readable text (an
     * icon-only tile). Keep it descriptive of the destination/action ("Mở lộ
     * trình Fullstack Mastery"), never generic ("bấm vào đây").
     */
    label?: string
}

/**
 * A whole-card press target with the default surface card look (surface fill,
 * concentric `rounded-3xl`, fixed `px-4 py-3` padding, `shadow-surface`
 * elevation AT REST — per `card.md` §0, a top-level bounded card, so it must
 * read as a card even before hover) plus a hover affordance and keyboard
 * focus ring. Exists because HeroUI v3 `Card` is a
 * non-interactive `<div>` — this block owns the card styling on a real
 * `<button>` / `<a>` so features can compose a clickable card without
 * hand-rolling styles (per the no-style-in-features rule). Use for navigation
 * tiles, selectable option cards, and bookmark rows.
 *
 * When the card also needs its OWN buttons (a "Continue" CTA, an overflow menu),
 * pass them via {@link PressableCardProps.actions} + {@link PressableCardProps.label}:
 * the card renders as the accessible stretched-link pattern (a transparent
 * whole-card overlay UNDER the actions) instead of nesting interactive elements
 * — see the `actions` prop docs.
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
    // Shared card surface + disabled dim, identical across both render paths so
    // a card reads the same with or without actions. `shadow-surface` is a
    // top-level bounded card (card.md §0 elevation convention) — it must read as
    // one at rest, not only once the pointer arrives (thầy: "render dạng card").
    // One hover treatment only (tint) — no lift variant, no press-scale.
    const surface = cn(
        "rounded-3xl bg-surface px-4 py-3 text-left shadow-surface transition-colors hover:bg-surface-secondary",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )

    // ── Simple whole-card target (no secondary actions) — the common case;
    // the whole card is ONE <button>/<a> and its children are its label. ──────
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
    // relative <div>; a transparent overlay <a>/<button> covers it (whole-card
    // press), and the actions sit ABOVE the overlay so they stay clickable. No
    // interactive element is ever nested inside another. ─────────────────────
    const overlay = cn(
        // covers the whole card; the focus ring reads as a card-level ring since
        // the overlay's border-box IS the card's bounds
        "absolute inset-0 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    )
    return (
        <div className={cn("relative w-full", surface)}>
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    {children}
                </div>
                {/*
                  Secondary actions — later in source order than the overlay below
                  AND `relative z-10`, so they paint/hit-test ABOVE the stretched
                  overlay and remain independently pressable.
                */}
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
