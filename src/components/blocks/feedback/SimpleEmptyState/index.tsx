import React from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"

import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for the {@link SimpleEmptyState} block.
 */
export interface SimpleEmptyStateProps extends WithClassNames<undefined> {
    /**
     * Translated copy explaining why the area is empty. The caller supplies
     * the message — this block never calls a translation hook itself.
     */
    children: ReactNode
}

/**
 * Minimal inline empty-state message: a single muted, small line of text.
 *
 * Use this for lightweight "nothing here yet" placeholders inside a tab or
 * panel body. For a richer placeholder with an icon, title, description, and
 * action, use {@link EmptyState} instead.
 *
 * @param props - See {@link SimpleEmptyStateProps}.
 * @returns The rendered empty-state element.
 * @see Story: .storybook/stories/blocks/feedback/SimpleEmptyState/SimpleEmptyState.stories
 */
export const SimpleEmptyState = ({ children, className }: SimpleEmptyStateProps) => {
    return (
        <p className={cn("text-sm text-muted", className)}>
            {children}
        </p>
    )
}
