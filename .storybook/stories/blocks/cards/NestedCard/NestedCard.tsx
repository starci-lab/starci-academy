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
    /** Optional leading eyebrow icon in the header (passed BARE — the card owns its size-4, §4/§5). */
    icon?: ReactNode
    /** Optional trailing header slot (e.g. a count) — right-aligned beside the title. */
    meta?: ReactNode
    /** Optional footer row below the sections (e.g. a "Xem tất cả" {@link SeeMoreLink}), border-t separated. */
    footer?: ReactNode
    /** Tight radius (`rounded-xl` vs default `rounded-3xl`) for narrow contexts like a chat bubble. */
    compact?: boolean
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
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Card-inside-card WITH HEADERS: quiet header (optional eyebrow icon + title-only
 * label + optional trailing meta) + a flush stack of {@link NestedCardSection}s
 * separated by dividers (no per-row rounded borders) + an optional footer row.
 * Parent context drives the shell: any filled parent surface → `bordered`; bare
 * `bg-background` only → omit `bordered` → `bg-surface shadow-surface`.
 *
 * @param props - See {@link NestedCardProps}.
 */
export const NestedCard = ({ title, icon, meta, footer, compact = false, children, bordered = false, className, anatPart }: NestedCardProps) => (
    <div
        data-anat-part={anatPart}
        className={cn(
            "overflow-hidden",
            compact ? "rounded-xl" : "rounded-3xl",
            bordered ? "border border-default bg-transparent" : "bg-surface shadow-surface",
            className,
        )}
    >
        <div className="flex min-w-0 items-center justify-between gap-2 border-b border-default px-3 py-2">
            {/* leading eyebrow: card owns icon size-4 (§4/§5); icon inherits muted via the span */}
            <span className="flex min-w-0 items-center gap-2 text-muted [&_svg]:size-4">
                {icon}
                <Typography type="body-xs" color="muted" truncate>{title}</Typography>
            </span>
            {meta ? <span className="shrink-0">{meta}</span> : null}
        </div>
        <div className="flex flex-col divide-y divide-default">{children}</div>
        {footer ? <div className="border-t border-default px-3 py-2">{footer}</div> : null}
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
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
export const NestedCardSection = ({ title, eyebrow, children, onPress, href, className, anatPart }: NestedCardSectionProps) => {
    const interactive = Boolean(onPress || href)
    // §10: parent owns the gap (tight) — eyebrow/title/children no longer self-margin.
    const body = (
        <div className="flex min-w-0 flex-col gap-1">
            {eyebrow ? (
                <Typography type="body-xs" color="muted" truncate>{eyebrow}</Typography>
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
            {children ? <div>{children}</div> : null}
        </div>
    )

    if (href) {
        return (
            <a
                href={href}
                data-anat-part={anatPart}
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
                data-anat-part={anatPart}
                className={cn(
                    "group block w-full cursor-pointer p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    className,
                )}
            >
                {body}
            </button>
        )
    }

    return (
        <div data-anat-part={anatPart} className={cn("p-3", className)}>
            {body}
        </div>
    )
}
