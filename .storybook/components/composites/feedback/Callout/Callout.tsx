import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert, type AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `Callout` — a tinted flat strip that lives INSIDE a surface
 * (`title`/`description`/`body`/`action`).
 *
 * Text goes through `Typography.*`, buttons through `Button.*`, icons from
 * `@phosphor-icons/react` passed as a component ref (the frame forces size/weight).
 * Deliberate exception: it keeps HeroUI's `Alert.Title`/`Alert.Description`
 * because HeroUI itself carries the color-by-status contract; swapping in
 * `Typography` would mean hand-feeding a color table. Switch to the atom once an
 * `Alert` atom exists.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Callout" } as const

/** Semantic tone — the atom's `AlertStatus` re-exported under this frame's name. */
export type CalloutStatus = AlertStatus

/** Icon passed as a COMPONENT (phosphor), never JSX — the frame owns its scale (§4/§5). */
export type CalloutIcon = ComponentType<SVGProps<SVGSVGElement>>

/**
 * Action button bg/text per status — SOLID `bg-<status>` CTA against the lighter
 * tint. INTERNAL: the CTA lived in the caller's `action` slot in the old shape,
 * so the caller had to hold `Button` and apply the skin itself. Now the frame
 * builds the button ITSELF from `actionLabel`/`onAction` ⇒ the caller
 * (especially a SCREEN) no longer touches the atom.
 */
const CALLOUT_ACTION_CLASS: Record<CalloutStatus, string> = {
    default: "bg-foreground text-background",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    danger: "bg-danger text-danger-foreground",
    info: "bg-info text-info-foreground",
}

/** Props for {@link Callout}. */
export interface CalloutProps {
    /** Semantic tone (drives tint + icon/title colour). Default `"default"`. */
    status?: CalloutStatus
    /** Headline line (always shown) — the header slot of this frame. */
    title: ReactNode
    /** Optional supporting line under the title — the body TEXT slot. */
    description?: ReactNode
    /**
     * Optional free-form body under `description` (a short list, a meta row).
     * 
     */
    body?: ReactNode
    /** Optional custom indicator icon as a COMPONENT; omit for the status default. */
    icon?: CalloutIcon
    /**
     * CTA label (footer slot). The frame builds the button ITSELF and applies the
     * skin per `status` — the caller only supplies TEXT, not a `Button` (a screen
     * must not hold the atom).
     */
    actionLabel?: string
    /** Handler for the CTA; the button only shows once `actionLabel` is also present. */
    onAction?: () => void
    /** When provided, renders a status-coloured close (×) wired to this. */
    onClose?: () => void
    /** Accessible label for the close button. */
    closeAriaLabel?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * A tinted, flat note for use INSIDE a card / surface (surface-in-surface): a thin
 * `bg-<status>-soft` + `shadow-none` highlight strip, so it doesn't read as a
 * card-in-card.
 *
 * A thin FRAME around the `Alert` atom: callout = an alert PLACED INSIDE a
 * surface, so the frame only picks `tone="soft"` + glyph `md` and hands the
 * whole skin (tint · icon per valence · × button) to the atom. The frame used
 * to hand-feed three color tables in parallel with `Toast` — that was drift,
 * now removed.
 *
 * @param props - {@link CalloutProps}
 */
export const Callout = ({
    status = "default",
    title,
    description,
    body,
    icon,
    actionLabel,
    onAction,
    onClose,
    closeAriaLabel,
    classNames,
}: CalloutProps) => (
    <Alert
        status={status}
        tone="soft"
        title={title}
        description={description}
        body={body}
        icon={icon}
        action={
            actionLabel ? (
                // The frame owns the CTA: builds the button + applies skin per status itself. Caller only supplies text.
                <Button label={actionLabel} size="sm" onPress={onAction} className={CALLOUT_ACTION_CLASS[status]} />
            ) : undefined
        }
        onClose={onClose}
        closeAriaLabel={closeAriaLabel}
        classNames={classNames}
    />
)
