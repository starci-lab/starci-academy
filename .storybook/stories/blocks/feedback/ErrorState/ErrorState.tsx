import React from "react"
import { Button } from "@heroui/react"
import { WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "../EmptyState/EmptyState"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/ErrorState`. Authored in Storybook (not `src`);
 * synced to `src` later.
 *
 * Centered, presentational error-state block: a danger-toned warning icon, an
 * optional title and description, and an optional retry button. Purely
 * props-driven (no store/fetch); text and the retry handler are supplied by the
 * caller so it stays self-contained and reusable across features.
 *
 * Shares the centered icon + title + description + action layout with
 * {@link EmptyState}; this component DELEGATES to it with `tone="danger"` and a
 * warning icon, keeping its own public props stable for consumers.
 */

/** Props for {@link ErrorState}. */
export interface ErrorStateProps {
    /**
     * Primary error headline rendered emphasized below the warning icon.
     * Caller supplies a translated node (e.g. via `t()`).
     */
    title?: React.ReactNode
    /**
     * Secondary explanatory line shown muted beneath the title.
     * Caller supplies a translated node (e.g. via `t()`).
     */
    description?: React.ReactNode
    /**
     * Label for the retry button. The button only renders when both this
     * label and {@link onRetry} are provided. Caller supplies a translated node.
     */
    retryLabel?: React.ReactNode
    /**
     * Invoked when the user presses the retry button. When omitted, no retry
     * button is shown regardless of {@link retryLabel}.
     */
    onRetry?: () => void
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * Centered error-state placeholder — a warning icon, optional title + description,
 * and an optional retry action.
 *
 * @param props - {@link ErrorStateProps}
 */
export const ErrorState = ({
    title,
    description,
    retryLabel,
    onRetry,
    className,
}: ErrorStateProps) => {
    return (
        <EmptyState
            tone="danger"
            icon={<WarningIcon weight="duotone" />}
            title={title}
            description={description}
            action={
                onRetry && retryLabel ? (
                    <Button variant="secondary" size="sm" onPress={onRetry}>
                        {retryLabel}
                    </Button>
                ) : null
            }
            className={className}
        />
    )
}
