import React from "react"
import type { ReactNode } from "react"
import { cn, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/EmptyState`. Authored in Storybook (not `src`);
 * synced to `src` later. A presentational, props-only empty-state placeholder —
 * all copy is passed in as {@link ReactNode} so the caller supplies translated text.
 *
 * CONSOLIDATED (thầy chốt gộp) — this is now the ONE generic feedback primitive.
 * Folded in here (ported components deleted, callers migrated):
 * - `ErrorState` → `tone="danger"` + `action` (a retry Button passed by the caller).
 * - `ErrorPageState` → `size="page"` (+ `code` slot for the status numeral).
 * - `SimpleEmptyState` → `size="compact"` (title-only muted line).
 */

/** Props for the {@link EmptyState} primitive. */
export interface EmptyStateProps {
    /** Optional decorative icon (a Phosphor icon), rendered ~`size-8`, muted, above the title. Ignored in `size="compact"`. */
    icon?: ReactNode
    /**
     * Optional large status numeral (e.g. `"404"`, `"500"`) shown above the icon/title.
     * Intended for `size="page"` (whole-route failures); ignored in `size="compact"`.
     */
    code?: ReactNode
    /** Primary message describing why the area is empty (e.g. "No results"). */
    title: ReactNode
    /** Optional supporting text giving more detail or guidance below the title. Ignored in `size="compact"`. */
    description?: ReactNode
    /**
     * Optional call-to-action (typically a Button, or a retry Button) below the
     * description. Ignored in `size="compact"`. In `size="page"`, multiple actions
     * (e.g. retry + home) are centered and wrap in a row.
     */
    action?: ReactNode
    /**
     * Icon tone. `"neutral"` (default) tints the icon `text-foreground`;
     * `"danger"` tints it `text-danger` for error placeholders. Only the icon
     * color changes — title and description stay as-is.
     */
    tone?: "neutral" | "danger"
    /**
     * Layout size:
     * - `"default"` (default) — the standard centered stack for lists/panels/sections.
     * - `"compact"` — a single muted title-only line (no icon/description/action/code),
     *   for a lightweight "nothing here yet" placeholder inside a tab or panel body.
     * - `"page"` — roomy full-page sizing for whole-route failures (404/500), with a
     *   larger title and room for a `code` numeral above it.
     */
    size?: "default" | "compact" | "page"
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * Centered empty-state placeholder for lists, panels, sections, or whole routes with
 * no content. A vertical, centered stack of an optional `code` numeral, an optional
 * icon, a title, an optional description, and an optional action. Omits a card
 * wrapper — the caller wraps it in a surface (e.g. `SurfaceListCard
 * emptyState={<EmptyState/>}`) when a frame is desired.
 *
 * @param props - {@link EmptyStateProps}
 */
export const EmptyState = ({
    icon,
    code,
    title,
    description,
    action,
    tone = "neutral",
    size = "default",
    className,
}: EmptyStateProps) => {
    if (size === "compact") {
        return (
            <Typography type="body-sm" color="muted" className={className}>
                {title}
            </Typography>
        )
    }

    const isPage = size === "page"

    return (
        <div
            className={cn(
                isPage
                    ? "mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center"
                    : "flex flex-col items-center gap-3 py-6 text-center",
                className,
            )}
        >
            {code ? (
                <Typography type="h1" weight="bold" color="muted">{code}</Typography>
            ) : null}
            {icon ? (
                <span className={cn("[&>svg]:size-8", tone === "danger" ? "text-danger" : "text-foreground")}>{icon}</span>
            ) : null}
            {isPage ? (
                <div className="flex flex-col gap-2">
                    <Typography type="h4" weight="semibold" align="center">{title}</Typography>
                    {description ? (
                        <Typography type="body-sm" color="muted" align="center">{description}</Typography>
                    ) : null}
                </div>
            ) : (
                <>
                    <Typography weight="medium" align="center">{title}</Typography>
                    {description ? (
                        <Typography type="body-xs" color="muted" align="center">{description}</Typography>
                    ) : null}
                </>
            )}
            {action ? (
                isPage ? <div className="flex flex-wrap items-center justify-center gap-3">{action}</div> : action
            ) : null}
        </div>
    )
}
