import React from "react"

import { EmptyState } from "@/components/composites/feedback/EmptyState"

/**
 * Props for the {@link SimpleEmptyState} block.
 */
export interface SimpleEmptyStateProps {
    /**
     * Translated copy explaining why the area is empty. The caller supplies
     * the message — this block never calls a translation hook itself.
     * Proven string at every live consumer (`t(...)`); ReactNode was unused.
     */
    children: string
}

/**
 * Minimal inline empty-state message: a single muted, small line of text.
 *
 * Exact collapse onto {@link EmptyState} `size="compact"` — same muted title-only
 * line the composite already owns. Prefer calling `EmptyState` directly for new
 * call sites; this block remains as a thin identity root for existing children API.
 *
 * @param props - See {@link SimpleEmptyStateProps}.
 * @returns The rendered empty-state element.
 * @see Story: .storybook/stories/blocks/feedback/SimpleEmptyState/SimpleEmptyState.stories
 */
export const SimpleEmptyState = ({ children }: SimpleEmptyStateProps) => {
    return (
        <EmptyState
            identity={{ tier: "block", component: "SimpleEmptyState" }}
            size="compact"
            title={children}
        />
    )
}
