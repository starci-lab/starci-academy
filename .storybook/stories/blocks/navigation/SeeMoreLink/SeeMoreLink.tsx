import React from "react"
import type { ReactNode } from "react"
import { Link, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/navigation/SeeMoreLink`.
 * Authored in Storybook (not `src`); synced to `src` later.
 *
 * Reused by the surface-card header ("Xem thêm →") and by ContinueCard's item CTA
 * (`decorative`), so both read as the same control.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Visual size for {@link SeeMoreLink} — mirrors the label row it sits beside
 * (`sm` next to a section label, `xs` next to a subtle eyebrow).
 */
export type SeeMoreLinkSize = "sm" | "xs"

/** Props for the {@link SeeMoreLink} block. */
export interface SeeMoreLinkProps {
    /** Link label — e.g. "Xem thêm", "Tiếp tục", "Xem tất cả". */
    children: ReactNode
    /**
     * Press handler. Ignored when {@link href} is set, and when
     * {@link decorative} is true (the parent owns the press target).
     */
    onPress?: () => void
    /** Optional destination URL. Takes priority over {@link onPress}. */
    href?: string
    /**
     * When true, render plain markup (no own `<a>`/`<button>`) — for use inside
     * an already-interactive surface (e.g. ContinueCard `item`, where the whole
     * card is the one press target). Hover still rides on a parent `group`
     * class: opacity fade + arrow slide.
     */
    decorative?: boolean
    /** Text size. Defaults to `sm`. */
    size?: SeeMoreLinkSize
    /** Extra classes on the link. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Shared look — semibold accent text (matches LabeledCard "Xem thêm"). */
const baseClassName = (size: SeeMoreLinkSize, className?: string) =>
    cn(
        "inline-flex w-fit shrink-0 items-center gap-1 font-semibold text-accent-soft-foreground no-underline",
        size === "xs" ? "text-xs" : "text-sm",
        className,
    )

/**
 * The shared "Xem thêm →" / "Tiếp tục →" affordance: semibold accent text + an
 * ARROW that slides right on hover (§5b — ARROW is the CTA affordance that slides;
 * a caret would NOT slide), with an opacity fade (no underline). Used by
 * LabeledCard `onSeeMore` and ContinueCard `item` CTA so both read as the same
 * control.
 *
 * @param props - {@link SeeMoreLinkProps}
 */
export const SeeMoreLink = ({
    children,
    onPress,
    href,
    decorative = false,
    size = "sm",
    className,
    anatPart,
}: SeeMoreLinkProps) => {
    const arrow = (
        <ArrowRightIcon
            aria-hidden
            focusable="false"
            className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
        />
    )

    if (decorative) {
        // Parent supplies `group` (e.g. ContinueCard wrapper) — hover fires from
        // anywhere on that surface, not a hover zone of this span alone.
        return (
            <span
                data-anat-part={anatPart}
                className={cn(
                    baseClassName(size, className),
                    "transition-opacity group-hover:opacity-60",
                )}
            >
                {children}
                {arrow}
            </span>
        )
    }

    const interactiveClassName = cn(
        baseClassName(size, className),
        "group cursor-pointer transition-opacity hover:opacity-60",
    )

    if (href) {
        return (
            <a data-anat-part={anatPart} href={href} className={interactiveClassName}>
                {children}
                {arrow}
            </a>
        )
    }

    return (
        <Link data-anat-part={anatPart} onPress={onPress} className={interactiveClassName}>
            {children}
            {arrow}
        </Link>
    )
}
