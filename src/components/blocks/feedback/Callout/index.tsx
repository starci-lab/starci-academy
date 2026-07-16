"use client"

import React from "react"
import { Alert, cn } from "@heroui/react"
import { ElementCloseButton } from "@/components/blocks/buttons/ElementCloseButton"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"

/** Semantic tone — maps 1:1 to HeroUI `Alert` `status`. */
export type CalloutStatus = "default" | "accent" | "success" | "warning" | "danger"

/** Default icon per status — Phosphor, matching every OTHER icon in the app
 * (`@phosphor-icons/react`), never HeroUI's own bundled icon set (`Alert`'s
 * built-in `getDefaultIcon()` fallback pulls from a separate internal icon
 * family with a different stroke style and a hardcoded, non-token size). A
 * caller's own `icon` prop still always wins (see {@link CalloutProps.icon}). */
const STATUS_ICON: Record<CalloutStatus, React.ReactNode> = {
    default: <InfoIcon />,
    accent: <InfoIcon />,
    success: <CheckCircleIcon />,
    warning: <WarningIcon />,
    danger: <XCircleIcon />,
}

/** Soft tint per status — a callout nested inside a card uses the NATIVE HeroUI soft
 * token `bg-<status>-soft` (not the default `bg-surface`) so it reads as a thin highlight
 * strip, not a card-in-card. `Alert` has no soft-bg variant (its base is always
 * `bg-surface`), so the tint is declared explicitly — but via the same `-soft` token the
 * title/icon are already paired to (`.alert--<status>` sets them to `-soft-foreground`),
 * NOT a hand-rolled `/10` opacity (that raw-hue-on-tint formula failed colour contrast). */
const STATUS_TINT: Record<CalloutStatus, string> = {
    default: "bg-default",
    accent: "bg-accent-soft",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
}

/** Close button colour follows the status (matches the tint). */
/** Action button background/text per status — SOLID `bg-<status>` (not the `/10` tint
 * above) so a `<Button variant="secondary">` action reads as a clear, tappable CTA
 * against the callout's much lighter tint, using the SAME status colour family as the
 * callout instead of a single fixed accent for every tone. `text-<status>-foreground`
 * is each status's own paired contrast colour (mirrors `.button--primary`'s
 * `--accent-foreground` pattern), not a generic white/black. Apply to a Callout's
 * `action` button's `className`, keyed by that same Callout's `status`. */
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
    /** Optional custom indicator icon (Phosphor `*Icon` / `Spinner`); omit for the
     * default status icon. The icon inherits the status colour — don't colour it. */
    icon?: React.ReactNode
    /** Optional trailing action (e.g. a `<Button>`), rendered before the close button. */
    action?: React.ReactNode
    /** When provided, renders a HeroUI `CloseButton` (×) wired to this. */
    onClose?: () => void
    /** Accessible label for the close button. */
    closeAriaLabel?: string
    /** Placement utilities only (e.g. `mb-4`) — NOT for restyling the callout. */
    className?: string
}

/**
 * A tinted, flat note for use **inside a card / surface** (surface-in-surface):
 * a thin `bg-<status>/10` + `shadow-none` highlight strip, so it doesn't read as
 * a card-in-card (the default HeroUI `Alert` `bg-surface` + shadow would). Wraps
 * HeroUI `Alert` + `CloseButton` so features just pass content — the block owns
 * the tint/flat treatment and the status-coloured close button. For a standalone
 * alert on the page canvas, use the raw `Alert` (its default surface look is
 * correct there). See `elements/alert.md`.
 * @see Story: .storybook/stories/blocks/feedback/Callout/Callout.stories
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
            {/* Always pass an explicit icon (caller's `icon`, else the Phosphor
                STATUS_ICON default) so HeroUI's own internal icon-family
                fallback (`Alert`'s `getDefaultIcon()`) never renders — keeps
                every Callout icon on the SAME icon family as the rest of the
                app. `[&_svg]:size-6!` then forces a consistent size regardless
                of source, mirroring `IconTile`'s `[&_svg]:size-*` technique. */}
            <Alert.Indicator className="[&_svg]:size-6!">{icon ?? STATUS_ICON[status]}</Alert.Indicator>
            <Alert.Content>
                <Alert.Title>{title}</Alert.Title>
                {description ? (
                    <Alert.Description>{description}</Alert.Description>
                ) : null}
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
