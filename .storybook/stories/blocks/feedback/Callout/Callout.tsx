import React from "react"
import { Alert, cn } from "@heroui/react"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"
import { ElementCloseButton } from "../../buttons/ElementCloseButton/ElementCloseButton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/Callout`. Authored in Storybook (not `src`); synced later.
 * Uses the local `ElementCloseButton` port (composable).
 */

/** Semantic tone — maps 1:1 to HeroUI `Alert` `status`. */
export type CalloutStatus = "default" | "accent" | "success" | "warning" | "danger"

/** Default icon per status — Phosphor, matching every other icon in the app. */
const STATUS_ICON: Record<CalloutStatus, React.ReactNode> = {
    default: <InfoIcon />,
    accent: <InfoIcon />,
    success: <CheckCircleIcon />,
    warning: <WarningIcon />,
    danger: <XCircleIcon />,
}

/** Soft tint per status — a nested callout reads as a thin highlight strip, not a card-in-card. */
const STATUS_TINT: Record<CalloutStatus, string> = {
    default: "bg-default",
    accent: "bg-accent-soft",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
}

/** Action button bg/text per status — SOLID `bg-<status>` CTA against the lighter tint. */
export const STATUS_ACTION_CLASS: Record<CalloutStatus, string> = {
    default: "bg-foreground text-background",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    danger: "bg-danger text-danger-foreground",
}

/** Props for {@link Callout}. */
export interface CalloutProps {
    /** Semantic tone (drives tint + icon/title colour). Default `"default"`. */
    status?: CalloutStatus
    /** Headline line (always shown). */
    title: React.ReactNode
    /** Optional supporting line under the title. */
    description?: React.ReactNode
    /** Optional custom indicator icon; omit for the default status icon. Inherits status colour. */
    icon?: React.ReactNode
    /** Optional trailing action (e.g. a `<Button>`), rendered before the close button. */
    action?: React.ReactNode
    /** When provided, renders a status-coloured close (×) wired to this. */
    onClose?: () => void
    /** Accessible label for the close button. */
    closeAriaLabel?: string
    /** Placement utilities only (e.g. `mb-4`) — NOT for restyling the callout. */
    className?: string
}

/**
 * A tinted, flat note for use INSIDE a card / surface (surface-in-surface): a thin
 * `bg-<status>-soft` + `shadow-none` highlight strip, so it doesn't read as a
 * card-in-card. Wraps HeroUI `Alert` + the local `ElementCloseButton`. For a standalone
 * alert on the page canvas, use the raw `Alert`.
 *
 * @param props - {@link CalloutProps}
 */
export const Callout = ({
    status = "default",
    title,
    description,
    icon,
    action,
    onClose,
    closeAriaLabel,
    className,
}: CalloutProps) => {
    return (
        <Alert status={status} className={cn("shadow-none", STATUS_TINT[status], className)}>
            <Alert.Indicator className="[&_svg]:size-6!">{icon ?? STATUS_ICON[status]}</Alert.Indicator>
            <Alert.Content>
                <Alert.Title>{title}</Alert.Title>
                {description ? <Alert.Description>{description}</Alert.Description> : null}
            </Alert.Content>
            {action}
            {onClose ? (
                <ElementCloseButton
                    label={closeAriaLabel ?? ""}
                    onPress={onClose}
                    tone={status === "default" ? "neutral" : status}
                />
            ) : null}
        </Alert>
    )
}
