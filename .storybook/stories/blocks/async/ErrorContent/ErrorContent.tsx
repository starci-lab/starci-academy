import React from "react"
import type { ReactNode } from "react"
import { Button, Typography, cn } from "@heroui/react"
import { WarningOctagonIcon } from "@phosphor-icons/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/async/ErrorContent`. Synced to `src` later.
 *
 * The `src` version hand-rolls the icon + title + description + retry button from
 * scratch — i.e. it RE-DRAWS the `feedback/ErrorState` primitive instead of
 * composing it. Ported here as a THIN block over a local `ErrorState` primitive:
 * ErrorContent only supplies the default WarningOctagon icon and folds
 * `onRetry`/`retryLabel` into the retry button. (See FLAGS — this is a P1/P2
 * duplication of the ErrorState primitive.)
 */

/**
 * Local faithful copy of the `feedback/ErrorState` primitive (extended with an
 * `icon` override so ErrorContent can swap the default). Inlined because the
 * ErrorState primitive is not yet ported under `.storybook/stories`.
 *
 * TODO: swap for the `ErrorState` local (`../../feedback/ErrorState/ErrorState`)
 * once that primitive is ported.
 */
interface ErrorStateProps {
    icon?: ReactNode
    title?: ReactNode
    description?: ReactNode
    retryLabel?: ReactNode
    onRetry?: () => void
    className?: string
}

const ErrorState = ({ icon, title, description, retryLabel, onRetry, className }: ErrorStateProps) => (
    <div className={cn("flex flex-col items-center gap-3 py-6 text-center", className)}>
        {icon ?? <WarningOctagonIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
        {title ? <Typography weight="medium" align="center">{title}</Typography> : null}
        {description ? (
            <Typography type="body-xs" color="muted" align="center">{description}</Typography>
        ) : null}
        {onRetry && retryLabel ? (
            <Button variant="secondary" size="sm" onPress={onRetry}>
                {retryLabel}
            </Button>
        ) : null}
    </div>
)

export interface ErrorContentProps {
    /** Primary error line. */
    title: ReactNode
    /** Optional supporting line below the title (cause / what to do). */
    description?: ReactNode
    /** Override the default warning-octagon icon. */
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
        <ErrorState
            className={className}
            icon={icon}
            title={title}
            description={description}
            onRetry={onRetry}
            retryLabel={retryLabel}
        />
    )
}
