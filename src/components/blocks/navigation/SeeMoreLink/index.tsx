"use client"

import React from "react"
import type { ReactNode } from "react"
import { Link, cn } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Visual size for {@link SeeMoreLink} — mirrors the label row it sits beside
 * (`sm` next to a section label, `xs` next to a subtle eyebrow).
 */
export type SeeMoreLinkSize = "sm" | "xs"

/** Props for the {@link SeeMoreLink} block. */
export interface SeeMoreLinkProps extends WithClassNames<undefined> {
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
     * class: opacity fade + caret slide.
     */
    decorative?: boolean
    /** Text size. Defaults to `sm`. */
    size?: SeeMoreLinkSize
}

/** Shared look — semibold accent text (matches LabeledCard "Xem thêm"). */
const baseClassName = (size: SeeMoreLinkSize, className?: string) =>
    cn(
        "inline-flex w-fit shrink-0 items-center gap-1 font-semibold text-accent-soft-foreground no-underline",
        size === "xs" ? "text-xs" : "text-sm",
        className,
    )

/**
 * The shared "Xem thêm →" / "Tiếp tục →" affordance: semibold accent text + a
 * caret that slides right on hover, with an opacity fade (no underline). Used by
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
}: SeeMoreLinkProps) => {
    const caret = (
        <CaretRightIcon
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
                className={cn(
                    baseClassName(size, className),
                    "transition-opacity group-hover:opacity-60",
                )}
            >
                {children}
                {caret}
            </span>
        )
    }

    const interactiveClassName = cn(
        baseClassName(size, className),
        "group cursor-pointer transition-opacity hover:opacity-60",
    )

    if (href) {
        return (
            <a href={href} className={interactiveClassName}>
                {children}
                {caret}
            </a>
        )
    }

    return (
        <Link onPress={onPress} className={interactiveClassName}>
            {children}
            {caret}
        </Link>
    )
}
