import React from "react"
import { Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/NestedCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 */

/** Props for {@link NestedCard}. */
export interface NestedCardProps {
    /** Header title (quiet eyebrow label, e.g. "Bài liên quan"). */
    title: ReactNode
    /** Inner sections — typically {@link NestedCardSection} elements. */
    children: ReactNode
    /**
     * Surface-in-surface: `border border-default bg-transparent` — when the parent
     * already has a fill (`bg-surface` panel, `bg-surface-secondary` bubble,
     * modal/page card). Pass `bordered={false}` only when rendering directly on
     * `bg-background` with no parent surface.
     */
    bordered?: boolean
    /** Extra classes on the card root. */
    className?: string
}

/**
 * Card-inside-card WITH HEADERS: quiet header (title-only eyebrow) + a flush stack
 * of {@link NestedCardSection}s separated by dividers (no per-row rounded borders).
 * Parent context drives the shell: any filled parent surface → `bordered`; bare
 * `bg-background` only → omit `bordered` → `bg-surface shadow-surface`.
 *
 * @param props - See {@link NestedCardProps}.
 */
export const NestedCard = ({ title, children, bordered = false, className }: NestedCardProps) => (
    <div
        className={cn(
            "overflow-hidden rounded-3xl",
            bordered ? "border border-default bg-transparent" : "bg-surface shadow-surface",
            className,
        )}
    >
        <div className="min-w-0 border-b border-default px-3 py-2 text-sm text-muted">
            <Typography type="body-xs" color="muted" truncate>{title}</Typography>
        </div>
        <div className="flex flex-col divide-y divide-default">{children}</div>
    </div>
)

/** Props for {@link NestedCardSection}. */
export interface NestedCardSectionProps {
    /** Section header title. */
    title: ReactNode
    /** Optional muted sub-label above the title (context, e.g. a course/module name). */
    eyebrow?: ReactNode
    /** Optional body under the header (description text, meta rows). */
    children?: ReactNode
    /** Press handler — renders the row as a native `<button>` (nav-link affordance). */
    onPress?: () => void
    /** Destination — renders the row as a native `<a>` (nav-link affordance). Wins over `onPress`. */
    href?: string
    /** Extra classes on the section. */
    className?: string
}

/**
 * One inner section of a {@link NestedCard}: a flush row (no own border/radius)
 * with an optional muted eyebrow, a title, and optional body below.
 *
 * ROW ≠ CARD (principles §7b): when interactive (`href`/`onPress`) it renders as
 * a native `<a>`/`<button>` (a11y — focusable + keyboard) with a hover-underline
 * title (nav-link affordance) — NO press-scale/ripple. Non-interactive → plain
 * `<div>` with no `cursor-pointer` (no false click affordance).
 *
 * @param props - See {@link NestedCardSectionProps}.
 */
export const NestedCardSection = ({ title, eyebrow, children, onPress, href, className }: NestedCardSectionProps) => {
    const interactive = Boolean(onPress || href)
    const body = (
        <>
            {eyebrow ? (
                <Typography type="body-xs" color="muted" truncate className="mb-1">{eyebrow}</Typography>
            ) : null}
            <Typography
                type="body-sm"
                weight="medium"
                truncate
                className={cn(
                    "underline-offset-4 decoration-[var(--separator-tertiary)]",
                    interactive && "group-hover:underline",
                )}
            >
                {title}
            </Typography>
            {children ? <div className="mt-1">{children}</div> : null}
        </>
    )

    if (href) {
        return (
            <a
                href={href}
                className={cn(
                    "group block w-full cursor-pointer p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    className,
                )}
            >
                {body}
            </a>
        )
    }

    if (onPress) {
        return (
            <button
                type="button"
                onClick={onPress}
                className={cn(
                    "group block w-full cursor-pointer p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    className,
                )}
            >
                {body}
            </button>
        )
    }

    return <div className={cn("p-3", className)}>{body}</div>
}
