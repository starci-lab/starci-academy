import React from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/SimpleEmptyState`. Authored in Storybook (not
 * `src`); synced to `src` later.
 *
 * Minimal inline empty-state message: a single muted, small line of text. Use for
 * lightweight "nothing here yet" placeholders inside a tab or panel body. For a
 * richer placeholder with an icon, title, description, and action, use EmptyState.
 */

/** Props for the {@link SimpleEmptyState} block. */
export interface SimpleEmptyStateProps {
    /**
     * Translated copy explaining why the area is empty. The caller supplies
     * the message — this block never calls a translation hook itself.
     */
    children: ReactNode
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * A single muted, small line of text for a lightweight empty placeholder.
 *
 * @param props - See {@link SimpleEmptyStateProps}.
 */
export const SimpleEmptyState = ({ children, className }: SimpleEmptyStateProps) => {
    return (
        <p className={cn("text-sm text-muted", className)}>
            {children}
        </p>
    )
}
