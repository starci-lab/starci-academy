import React from "react"
import { Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link NestedCard}. */
export interface NestedCardProps extends WithClassNames<undefined> {
    /** Header title (quiet eyebrow label, e.g. "Bài liên quan"). */
    title: ReactNode
    /** Optional leading icon (phosphor) before the title, signalling the group kind. */
    icon?: ReactNode
    /** Inner sections — typically {@link NestedCardSection} elements. */
    children: ReactNode
    /**
     * Surface-in-surface: `border border-default bg-transparent` — when the
     * parent already has a fill (`bg-surface` panel, `bg-surface-secondary`
     * bubble, modal/page card). Pass `bordered={false}` only when rendering
     * directly on `bg-background` with no parent surface.
     */
    bordered?: boolean
}

/**
 * Card-inside-card WITH HEADERS: quiet header (icon + title) + a flush stack of
 * {@link NestedCardSection}s separated by dividers (no per-row rounded borders).
 *
 * Parent context drives the shell: any filled parent surface (chat panel, bubble,
 * modal) → `bordered` ([[card]] §4). Bare `bg-background` only → omit `bordered`
 * → `bg-surface shadow-surface`.
 *
 * @param props - See {@link NestedCardProps}.
 * @see Story: .storybook/stories/blocks/cards/NestedCard/NestedCard.stories
 */
export const NestedCard = ({ title, icon, children, bordered = false, className }: NestedCardProps) => (
    <div
        className={cn(
            "overflow-hidden rounded-3xl",
            bordered ? "border border-default bg-transparent" : "bg-surface shadow-surface",
            className,
        )}
    >
        <div className="flex min-w-0 items-center gap-2 border-b border-default px-3 py-2 text-sm text-muted">
            {icon}
            <Typography type="body-xs" color="muted" truncate>{title}</Typography>
        </div>
        <div className="flex flex-col divide-y divide-default">{children}</div>
    </div>
)

/** Props for {@link NestedCardSection}. */
export interface NestedCardSectionProps extends WithClassNames<undefined> {
    /** Section header title. */
    title: ReactNode
    /** Optional muted sub-label above the title (context, e.g. a course/module name). */
    eyebrow?: ReactNode
    /** Optional body under the header (description text, meta rows). */
    children?: ReactNode
}

/**
 * One inner section of a {@link NestedCard}: a flush row (no own border/radius)
 * with an optional muted eyebrow, a title, and optional body below. Hover
 * underlines the title (nav-link affordance).
 *
 * @param props - See {@link NestedCardSectionProps}.
 */
export const NestedCardSection = ({ title, eyebrow, children, className }: NestedCardSectionProps) => (
    <div className={cn("group cursor-pointer px-4 py-3", className)}>
        {eyebrow ? (
            <Typography type="body-xs" color="muted" truncate className="mb-1">{eyebrow}</Typography>
        ) : null}
        <Typography
            type="body-sm"
            weight="medium"
            truncate
            className="text-accent-soft-foreground underline-offset-2 group-hover:underline"
        >
            {title}
        </Typography>
        {children ? <div className="mt-1">{children}</div> : null}
    </div>
)
