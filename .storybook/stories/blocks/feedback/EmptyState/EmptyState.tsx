import React from "react"
import type { ReactNode } from "react"
import { cn, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/EmptyState`. Authored in Storybook (not `src`);
 * synced to `src` later. A presentational, props-only empty-state placeholder —
 * all copy is passed in as {@link ReactNode} so the caller supplies translated text.
 */

/** Props for the {@link EmptyState} primitive. */
export interface EmptyStateProps {
    /** Optional decorative icon (a Phosphor icon), rendered ~`size-8`, muted, above the title. */
    icon?: ReactNode
    /** Primary message describing why the area is empty (e.g. "No results"). */
    title: ReactNode
    /** Optional supporting text giving more detail or guidance below the title. */
    description?: ReactNode
    /** Optional call-to-action (typically a Button) below the description. */
    action?: ReactNode
    /**
     * Icon tone. `"neutral"` (default) tints the icon `text-foreground`;
     * `"danger"` tints it `text-danger` for error placeholders. Only the icon
     * color changes — title and description stay as-is.
     */
    tone?: "neutral" | "danger"
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * Centered empty-state placeholder for lists, panels, or sections with no content.
 * A vertical, centered stack of an optional icon, a title, an optional description,
 * and an optional action. Omits a card wrapper — the caller wraps it in a surface
 * (e.g. `SurfaceListCard emptyState={<EmptyState/>}`) when a frame is desired.
 *
 * @param props - {@link EmptyStateProps}
 */
export const EmptyState = ({ icon, title, description, action, tone = "neutral", className }: EmptyStateProps) => {
    return (
        <div className={cn("flex flex-col items-center gap-3 py-6 text-center", className)}>
            {icon ? (
                <span className={cn("[&>svg]:size-8", tone === "danger" ? "text-danger" : "text-foreground")}>{icon}</span>
            ) : null}
            <Typography weight="medium" align="center">{title}</Typography>
            {description ? (
                <Typography type="body-xs" color="muted" align="center">{description}</Typography>
            ) : null}
            {action}
        </div>
    )
}
