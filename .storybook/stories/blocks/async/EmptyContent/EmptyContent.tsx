import React from "react"
import type { ReactNode } from "react"
import { Button } from "@heroui/react"
import { TrayIcon } from "@phosphor-icons/react"

import { EmptyState } from "../../feedback/EmptyState/EmptyState"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/async/EmptyContent`. Synced to `src` later.
 *
 * The `src` version hand-rolls the icon + title + description + retry button from
 * scratch — i.e. it RE-DRAWS the `feedback/EmptyState` primitive instead of
 * composing it. Ported here as a THIN block that COMPOSES the local `EmptyState`
 * primitive: it only adds a default TrayIcon and folds `onRetry`/`retryLabel`
 * into EmptyState's `action` slot. (See FLAGS — this is a P1/P2 duplication of the
 * EmptyState primitive.)
 */
export interface EmptyContentProps {
    /** Primary "nothing here" line. */
    title: ReactNode
    /** Optional supporting line below the title. */
    description?: ReactNode
    /** Override the default tray icon. */
    icon?: ReactNode
    /** Optional retry/refresh handler — renders a button when paired with a label. */
    onRetry?: () => void
    /** Translated label for the retry button (required to render it). */
    retryLabel?: ReactNode
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * Standalone empty state — a tray icon, a title + optional description, and an
 * optional "try again" button, centered. The standard `emptyContent` for the
 * async-state switch. Props-only; the block owns its look, text arrives
 * translated from the caller.
 *
 * @param props - {@link EmptyContentProps}
 */
export const EmptyContent = ({
    title,
    description,
    icon,
    onRetry,
    retryLabel,
    className,
}: EmptyContentProps) => {
    return (
        <EmptyState
            className={className}
            icon={icon ?? <TrayIcon aria-hidden focusable="false" weight="duotone" />}
            title={title}
            description={description}
            action={
                onRetry && retryLabel ? (
                    <Button variant="secondary" size="sm" onPress={onRetry}>
                        {retryLabel}
                    </Button>
                ) : undefined
            }
        />
    )
}
