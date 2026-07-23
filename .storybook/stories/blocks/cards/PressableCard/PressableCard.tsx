import React, { useCallback, useRef, useState } from "react"
import { cn } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/PressableCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Ripple — ported from HeroUI v2 `@heroui/ripple` (MIT). ADAPTED: HeroUI reads
// press coords from react-aria's `PressEvent` (`event.x/y`); we use a real
// `<button>`/`<a>`, so we compute the origin from the native `pointerdown`
// position relative to the pressed element. Same animation: a circle grows from
// scale 0 → 2 at the press point while fading out, then self-clears.
// ─────────────────────────────────────────────────────────────────────────────
type RippleItem = { key: number; x: number; y: number; size: number }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** Track ripples + expose `add` (on pointerdown) and `clear` (on anim end). */
const useRipple = () => {
    const idRef = useRef(0)
    const [ripples, setRipples] = useState<Array<RippleItem>>([])
    const clear = useCallback((key: number) => {
        setRipples((prev) => prev.filter((ripple) => ripple.key !== key))
    }, [])
    const add = useCallback(
        (event: React.PointerEvent<HTMLElement>) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const size = Math.max(rect.width, rect.height)
            idRef.current += 1
            const key = idRef.current
            setRipples((prev) => [
                ...prev,
                {
                    key,
                    size,
                    // Centre the size×size circle on the exact press point.
                    x: event.clientX - rect.left - size / 2,
                    y: event.clientY - rect.top - size / 2,
                },
            ])
            // Safety net: guarantee removal even if `onAnimationComplete` never
            // fires (e.g. tab hidden mid-animation → rAF paused). Idempotent with
            // the anim-complete clear. Max ripple duration is 0.75s.
            window.setTimeout(() => clear(key), 800)
        },
        [clear],
    )
    return { ripples, add, clear }
}

/** Renders one fading, growing circle per active ripple. Sits BEHIND content (`z-0`). */
const Ripple = ({ ripples, onClear }: { ripples: Array<RippleItem>; onClear: (key: number) => void }) => (
    <AnimatePresence mode="popLayout">
        {ripples.map((ripple) => {
            // Bigger ripple → longer travel (HeroUI's clamp curve).
            const duration = clamp(0.01 * ripple.size, 0.2, ripple.size > 100 ? 0.75 : 0.5)
            return (
                <motion.span
                    key={ripple.key}
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-foreground"
                    style={{ width: ripple.size, height: ripple.size }}
                    initial={{ x: ripple.x, y: ripple.y, scale: 0, opacity: 0.18 }}
                    animate={{ x: ripple.x, y: ripple.y, scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration }}
                    onAnimationComplete={() => onClear(ripple.key)}
                />
            )
        })}
    </AnimatePresence>
)

/** Props shared by both press-target shapes of {@link PressableCard}. */
interface PressableCardBaseProps {
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
     * `true` → mark this card as the CHOSEN one in a selectable grid — an accent
     * `ring-2 ring-accent` around the card (the card-equivalent of a list row's
     * trailing check). Sets `aria-pressed`/`aria-current` so it's announced.
     */
    isSelected?: boolean
    /**
     * `true` → render a generic skeleton mirror (tile-shaped placeholder) instead
     * of the real press target. Consumer chỉ bật cờ — mirror không phụ thuộc
     * `children`/`actions` thật (giống base `Button`).
     */
    isSkeleton?: boolean
    /** Extra classes on the card surface. */
    className?: string
}

/**
 * Discriminates the two accessible-name contracts: without `actions` the
 * children ARE the card's label (optional `label` only for icon-only tiles);
 * WITH `actions` the whole-card target becomes a transparent overlay with no
 * visible text of its own, so `label` becomes REQUIRED.
 */
type PressableCardActionsProps =
    | {
        /** No secondary controls — the whole card is ONE press target. */
        actions?: undefined
        /**
         * Accessible name for the whole-card press target. Optional here —
         * without `actions` the children ARE the card's accessible name, so pass
         * this only when they carry no readable text (an icon-only tile).
         */
        label?: string
    }
    | {
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
         */
        actions: React.ReactNode
        /**
         * Accessible name for the whole-card press target. REQUIRED — the stretched
         * overlay covers the card but has no visible text of its own.
         */
        label: string
    }

/** Props for the {@link PressableCard} block. */
export type PressableCardProps = PressableCardBaseProps & PressableCardActionsProps

/**
 * A whole-card press target with the default surface card look (surface fill,
 * concentric `rounded-3xl`, fixed `p-3` padding, `shadow-surface` elevation AT
 * REST — per `card.md` §0) plus a hover affordance and keyboard focus ring.
 * Exists because HeroUI v3 `Card` is a non-interactive `<div>` — this block owns
 * the card styling on a real `<button>` / `<a>`. Hover tints the surface; PRESS
 * scales it to 0.97 (subtle push-in) via native `:active`. Use for navigation
 * tiles, selectable option cards, and bookmark rows.
 *
 * When the card also needs its OWN buttons (a "Continue" CTA, an overflow menu),
 * pass them via {@link PressableCardProps.actions} + {@link PressableCardProps.label}
 * (TypeScript enforces `label` once `actions` is set): the card renders as the
 * accessible stretched-link pattern.
 *
 * @param props - {@link PressableCardProps}
 */
export const PressableCard = ({
    children,
    onPress,
    href,
    isDisabled = false,
    isSelected = false,
    isSkeleton = false,
    actions,
    label,
    className,
}: PressableCardProps) => {
    const { ripples, add: addRipple, clear: clearRipple } = useRipple()

    // Skeleton mirror — generic tile shape (leading tile + 2 text bars), same
    // outer frame/padding as the real card, regardless of actions/children.
    if (isSkeleton) {
        return (
            <div className={cn("flex items-center gap-3 rounded-3xl bg-surface p-3 shadow-surface", className)}>
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton.Typography type="body-sm" width="2/3" />
                    <Skeleton.Typography type="body-xs" width="1/3" />
                </div>
            </div>
        )
    }

    // Shared card surface + disabled dim, identical across both render paths.
    // NO hover effect (như HeroUI pressable card — hover trơ); phản hồi DUY NHẤT
    // là PRESS: lún `active:scale-[0.97]` + ripple. ⚠️ Tailwind v4: `scale-*` set
    // property `scale:` (KHÔNG phải `transform:`), nên transition PHẢI liệt kê
    // `scale` — để `transform` thì scale đổi tức thì (giật). `duration-200
    // ease-out` cho lún mượt; `motion-reduce` tắt; tap-highlight ẩn mobile.
    // Shared LOOK only — press-scale is added PER-VARIANT below (simple = element's
    // own `:active`; stretched = only when the OVERLAY is pressed, NOT the inner
    // actions — a Continue/menu click must NOT scale the whole card).
    const surface = cn(
        "rounded-3xl bg-surface p-3 text-left shadow-surface [-webkit-tap-highlight-color:transparent]",
        "transition-[scale] duration-200 ease-out motion-reduce:transition-none",
        // Selected = accent ring quanh card (card-equivalent của check ở row).
        isSelected && "ring-2 ring-accent",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )

    // ── Simple whole-card target (no secondary actions) — the whole card is ONE
    // <button>/<a> and its children are its label. ─────────────────────────────
    if (!actions) {
        // `relative overflow-hidden` so the ripple clips to the rounded card shape.
        // Simple variant = the whole element IS the press target → its own `:active`.
        const base = cn(
            "relative block w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent",
            surface,
            !isDisabled && "active:scale-[0.97]",
        )
        // Content sits ABOVE the ripple layer (ripple is absolute `z-0`).
        const inner = (
            <>
                <span className="relative z-10 block">{children}</span>
                {!isDisabled ? <Ripple ripples={ripples} onClear={clearRipple} /> : null}
            </>
        )
        if (href && !isDisabled) {
            return (
                <a href={href} aria-label={label} aria-current={isSelected ? "true" : undefined} className={base} onPointerDown={addRipple}>
                    {inner}
                </a>
            )
        }
        return (
            <button
                type="button"
                onClick={onPress}
                onPointerDown={isDisabled ? undefined : addRipple}
                disabled={isDisabled}
                aria-label={label}
                aria-pressed={isSelected || undefined}
                className={cn(base, !isDisabled && "cursor-pointer")}
            >
                {inner}
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
        // Scale the WHOLE card ONLY when the stretched overlay (`data-card-press`) is
        // pressed — NOT when an inner action is. Plain `active:scale` would fire on
        // ANY descendant press (Continue/menu → whole card zooms, sai). `:has()` giới
        // hạn về đúng vùng card.
        <div
            className={cn(
                "relative w-full",
                surface,
                !isDisabled && "has-[[data-card-press]:active]:scale-[0.97]",
            )}
        >
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
                <a href={href} data-card-press aria-label={label} aria-current={isSelected ? "true" : undefined} className={overlay} />
            ) : (
                <button
                    type="button"
                    data-card-press
                    onClick={onPress}
                    disabled={isDisabled}
                    aria-label={label}
                    aria-pressed={isSelected || undefined}
                    className={overlay}
                />
            )}
        </div>
    )
}
