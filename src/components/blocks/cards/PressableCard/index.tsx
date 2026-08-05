"use client"

import React, { type ComponentType } from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { StackH } from "@/components/frames/Stack"

/**
 * Props for the {@link PressableCard} block.
 *
 * TIER NOTE: this folder sits under `blocks/cards`, but the component itself
 * owns no domain entity — every prop here is a shape (`children`, `onPress`,
 * `href`, `actions`) never a field of something fetched. That is BLOCK-7's
 * detection signal: it is really a **composite** mis-filed in a block folder.
 * Left in place (moving the folder breaks every importer below), but treated
 * as a composite for this pass — one file, `cn()` allowed (COMPOSITE-5), and
 * `className` kept as a raw string rather than `classNames: Array<AllowedClassName>`
 * because three real callers outside this folder (`GroupPressableCard`,
 * `SummaryCard`, `ConsultantCard`) already forward arbitrary skin classes
 * (radius/border/hover overrides) through it — narrowing the type here would
 * break them without touching a single one of their files.
 *
 * `composites/cards/SurfaceCard` (`SurfaceCard`, exported off `Base`) is the
 * emerging canonical member for this exact job — same whole-card press target,
 * same stretched-link `actions` pattern, plus ripple/selection/verdict-band —
 * and its own header explicitly notes it folds in "was `PressableCard`". It is
 * NOT swapped in here: its hover/ripple treatment differs from this file's
 * (tint-on-hover, no ripple), so delegating to it would change the rendered
 * look for the three live callers above, not just the code shape. Consolidating
 * onto `SurfaceCard` is a separate migration (each caller needs the `children`
 * → `body` slot conversion too), left as debt rather than folded in silently.
 */
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
    actions?: ComponentType
    /**
     * Accessible name for the whole-card press target. REQUIRED when
     * {@link PressableCardProps.actions} is set (the stretched overlay covers the
     * card but has no visible text of its own, so it must carry an `aria-label`).
     * Optional otherwise — without `actions` the children ARE the card's
     * accessible name, so pass this only when they carry no readable text (an
     * icon-only tile). Keep it descriptive of the destination/action ("Open the
     * Fullstack Mastery track"), never generic ("click here").
     */
    label?: string
}

/**
 * A whole-card press target with the default surface card look (surface fill,
 * concentric `rounded-3xl`, fixed `px-4 py-3` padding, `shadow-surface`
 * elevation AT REST — per `card.md` §0, a top-level bounded card, so it must
 * read as a card even before hover) plus a hover affordance and keyboard
 * focus ring. Exists because HeroUI v3 `Card` is a
 * non-interactive `<div>` — this component owns the card styling on a real
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
 * @see Story: .storybook/stories/blocks/cards/PressableCard/PressableCard.stories
 */
export const PressableCard = ({
    children,
    onPress,
    href,
    isDisabled = false,
    actions: Actions,
    label,
    className,
}: PressableCardProps) => {
    // Shared card surface + disabled dim, identical across both render paths so
    // a card reads the same with or without actions. `shadow-surface` is a
    // top-level bounded card (card.md §0 elevation convention) — it must read as
    // one at rest, not only once the pointer arrives (teacher: "render it as a card").
    // One hover treatment only (tint) — no lift variant, no press-scale.
    const surface = cn(
        "rounded-3xl bg-surface px-4 py-3 text-left shadow-surface transition-colors hover:bg-surface-secondary",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )

    // ── Simple whole-card target (no secondary actions) — the common case;
    // the whole card is ONE <button>/<a> and its children are its label. ──────
    if (!Actions) {
        const base = cn(
            "block w-full outline-none focus-visible:ring-2 focus-visible:ring-accent",
            surface,
        )
        if (href && !isDisabled) {
            return (
                <a href={href} aria-label={label} className={base} data-tier="composite" data-component="PressableCard">
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
                data-tier="composite"
                data-component="PressableCard"
            >
                {children}
            </button>
        )
    }

    // ── Card WITH its own buttons — stretched-link pattern. The card is a plain
    // relative <div>; a transparent overlay <a>/<button> covers it (whole-card
    // press), and the actions sit ABOVE the overlay so they stay clickable. No
    // interactive element is ever nested inside another. Row built with `StackH`
    // (frame tier) instead of a hand-rolled `flex items-center gap-3` wrapper —
    // same shape as `composites/cards/SurfaceCard`'s own actions branch. ───────
    const overlay = cn(
        // covers the whole card; the focus ring reads as a card-level ring since
        // the overlay's border-box IS the card's bounds
        "absolute inset-0 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    )
    return (
        <div className={cn("relative w-full", surface)} data-tier="composite" data-component="PressableCard">
            <StackH
                gap={4}
                items={[
                    () => <div className="min-w-0 flex-1">{children}</div>,
                    () => (
                        <div className="relative z-10">
                            <StackH gap={3} principles={["flex-action"]} classNames={["shrink-0"]} items={[() => <Actions />]} />
                        </div>
                    ),
                ]}
            />
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
