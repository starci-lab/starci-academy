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
    /** Optional right-aligned header slot — a count, a "view all" link, a chip. */
    trailing?: ReactNode
    /** Inner sections — typically {@link NestedCardSection} elements. */
    children: ReactNode
}

/**
 * Card-inside-card WITH HEADERS: a border-only outer card with a quiet header
 * (icon + title + optional trailing count/action) whose body is a `gap-3` stack of
 * inner {@link NestedCardSection}s (each its own bordered sub-card + header). Because
 * the inner cards sit ON a surface, they use BORDER not shadow (surface-in-surface,
 * [[card]] §4) — the outer is border-only too so the nesting never doubles shadows.
 * For a flat labelled list with NO sub-headers use `CheckListCard`/`SurfaceListCard`.
 *
 * @param props - See {@link NestedCardProps}.
 */
export const NestedCard = ({ title, icon, trailing, children, className }: NestedCardProps) => (
    <div className={cn("overflow-hidden rounded-3xl border border-default bg-surface", className)}>
        <div className="flex items-center justify-between gap-3 border-b border-separator px-4 py-3">
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted">
                {icon}
                <Typography type="body-sm" color="muted" truncate>{title}</Typography>
            </div>
            {trailing ? <div className="shrink-0">{trailing}</div> : null}
        </div>
        <div className="flex flex-col gap-3 p-3">{children}</div>
    </div>
)

/** Props for {@link NestedCardSection}. */
export interface NestedCardSectionProps extends WithClassNames<undefined> {
    /** Section header title. */
    title: ReactNode
    /** Optional muted sub-label above the title (context, e.g. a course/module name). */
    eyebrow?: ReactNode
    /** Optional right-aligned action (a link like "Đọc →", a button). */
    action?: ReactNode
    /** Optional body under the header (description text, meta rows). */
    children?: ReactNode
}

/**
 * One inner section of a {@link NestedCard}: a bordered sub-card with an optional
 * muted eyebrow, a title + optional right-aligned action on the header row, and an
 * optional body below.
 *
 * @param props - See {@link NestedCardSectionProps}.
 */
export const NestedCardSection = ({ title, eyebrow, action, children, className }: NestedCardSectionProps) => (
    <div className={cn("rounded-large border border-default px-4 py-3", className)}>
        {eyebrow ? (
            <Typography type="body-xs" color="muted" truncate className="mb-1">{eyebrow}</Typography>
        ) : null}
        <div className="flex items-center justify-between gap-3">
            <Typography type="body-sm" weight="medium" truncate className="min-w-0">{title}</Typography>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children ? <div className="mt-1">{children}</div> : null}
    </div>
)
