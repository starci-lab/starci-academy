import type { ComponentType, SVGProps } from "react"
import { Alert, type AlertStatus } from "@/components/atoms/feedback/Alert"
import { Button } from "@/components/atoms/buttons/Button"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Callout`, a tinted flat strip LIVING INSIDE a
 * surface (`title`/`description`/`body`/`action`).
 *
 * WARNING Split out of the `Feedback.*` namespace (2026-08-01) back into its own flat
 * file — the 2026-07-25 consolidation grouped `Callout`/`Empty`/`Confirm` under
 * one `Feedback` folder; this reverses that so each frame is discoverable by
 * its own name again. Props/behaviour are UNCHANGED — this is a file-location +
 * naming refactor, not a visual or API change.
 *
 * ATOM COMPOSITION (§12): text goes through `Typography.*`, buttons through
 * `Button.*`, icons come from `@phosphor-icons/react` — ONE SET ONLY (§50),
 * passed as a component ref, the frame forces size/weight itself (§4/§5).
 * DELIBERATE EXCEPTION: keeps HeroUI's `Alert.Title`/`Alert.Description`
 * because HeroUI itself carries the COLOR-BY-STATUS contract (`.alert--warning
 * .alert__title` -> `text-warning-soft-foreground`). Swapping in `Typography` would
 * mean hand-feeding a color table — that's the real "hand-rolled". Switch to the
 * atom once an `Alert` atom exists.
 * ─────────────────────────────────────────────────────────────────────────────
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
 * builds the button ITSELF from `actionLabel`/`onAction` => the caller
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

/** Props SPECIFIC to {@link Callout} — EXCEPT the `title`/`isSkeleton` pair (see {@link CalloutProps}). */
interface CalloutOwnProps {
    /** Semantic tone (drives tint + icon/title colour). Default `"default"`. */
    status?: CalloutStatus
    /**
     * Optional supporting line under the title — the body TEXT slot. `string`,
     * not `ReactNode` (COMPOSITE-8) — forwarded straight into `Alert`, which
     * renders it (or a shimmer bar in its place) itself.
     */
    description?: string
    /**
     * Optional free-form body region under `description` (a short list, a meta
     * row). A COMPONENT reference, not a built node (COMPOSITE-8) — the frame
     * calls it itself with `isSkeleton` forwarded before handing the result to
     * `Alert`'s own `body` slot.
     */
    body?: ComponentTypeWithSkeleton
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
}

/**
 * `isSkeleton` is a co-located loading state — forwarded straight into `Alert`,
 * which owns drawing the shimmer bars. `title` is optional only in the
 * `isSkeleton: true` branch; the live branch still requires it. `string`, not
 * `ReactNode` (COMPOSITE-8) — the frame hands it to `Alert`'s own `title` slot.
 */
export type CalloutProps = CalloutOwnProps &
    (
        | { isSkeleton: true; title?: string }
        | { isSkeleton?: false; title: string }
    )

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
export const Callout = (props: CalloutProps) => {
    const {
        status = "default",
        description,
        body: Body,
        icon,
        actionLabel,
        onAction,
        onClose,
        closeAriaLabel,
    } = props
    // Narrowed off the discriminant so `title` stays required in the live branch —
    // destructuring it straight off `props` above would widen it to `string | undefined`
    // and lose exactly that guarantee (same shape `Alert`/`Toast` already use).
    const content = props.isSkeleton
        ? ({ isSkeleton: true, title: props.title } as const)
        : ({ isSkeleton: false, title: props.title } as const)
    return (
        <Alert
            status={status}
            tone="soft"
            {...content}
            description={description}
            body={Body ? <Body isSkeleton={props.isSkeleton} /> : undefined}
            icon={icon}
            action={
                actionLabel ? (
                    // The frame owns the CTA: builds the button + applies skin per status itself. Caller only supplies text.
                    // Button is an atom — it owns its own appearance, so the per-status skin wraps a div rather than reaching into the atom.
                    <div className={CALLOUT_ACTION_CLASS[status]}>
                        <Button label={actionLabel} size="sm" onPress={onAction} />
                    </div>
                ) : undefined
            }
            onClose={onClose}
            closeAriaLabel={closeAriaLabel}
        />
    )
}
