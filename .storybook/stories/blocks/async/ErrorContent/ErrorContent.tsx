import React from "react"
import type { ReactNode } from "react"
import { WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Button } from "../../buttons/Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/async/ErrorContent`. Synced to `src` later.
 *
 * The `src` version hand-rolls the icon + title + description + retry button from
 * scratch — i.e. it RE-DRAWS the `feedback/EmptyState` primitive instead of
 * composing it. Reconnected here: ErrorContent is now a THIN wrapper over
 * `EmptyState` (`../../feedback/EmptyState/EmptyState`) with `tone="danger"`, a
 * duotone warning icon, and `onRetry`/`retryLabel` folded into the `action` slot.
 *
 * NOTE (consolidation, thầy chốt gộp): previously delegated to the `ErrorState`
 * port, which has been folded into `EmptyState` and deleted. `icon` override now
 * actually wires through (ErrorState's version fixed the icon and ignored it).
 */

export interface ErrorContentProps {
    /** Primary error line. */
    title: ReactNode
    /** Optional supporting line below the title (cause / what to do). */
    description?: ReactNode
    /** Override the default warning icon. */
    icon?: ReactNode
    /** Retry handler — renders a button when paired with a label. */
    onRetry?: () => void
    /** Translated label for the retry button (required to render it). */
    retryLabel?: ReactNode
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * Standalone error state — a warning-octagon icon, a title + optional
 * description, and a "try again" button, centered. The standard `errorContent`
 * for the async-state switch. Props-only; the block owns its look, text arrives
 * translated from the caller.
 *
 * @param props - {@link ErrorContentProps}
 */
export const ErrorContent = ({
    title,
    description,
    icon,
    onRetry,
    retryLabel,
    className,
}: ErrorContentProps) => {
    return (
        <EmptyState
            className={className}
            tone="danger"
            icon={icon ?? <WarningIcon weight="duotone" />}
            title={title}
            description={description}
            action={
                onRetry && retryLabel ? (
                    <Button variant="secondary" size="sm" onPress={onRetry}>
                        {retryLabel}
                    </Button>
                ) : null
            }
        />
    )
}
