import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert, type AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Callout`, a tinted flat strip LIVING INSIDE a
 * surface (`title`/`description`/`body`(+`children`)/`action`).
 *
 * ⚠️ Split out of the `Feedback.*` namespace (2026-08-01) back into its own flat
 * file — the 2026-07-25 consolidation grouped `Callout`/`Empty`/`Confirm` under
 * one `Feedback` folder; this reverses that so each frame is discoverable by
 * its own name again. Props/behaviour are UNCHANGED — this is a file-location +
 * naming refactor, not a visual or API change.
 *
 * ATOM COMPOSITION (§12): text goes through `Typography.*`, buttons through
 * `Button.*`, icons come from `@phosphor-icons/react` — ONE SET ONLY (§5⃣0),
 * passed as a component ref, the frame forces size/weight itself (§4/§5).
 * DELIBERATE EXCEPTION: keeps HeroUI's `Alert.Title`/`Alert.Description`
 * because HeroUI itself carries the COLOR-BY-STATUS contract (`.alert--warning
 * .alert__title` → `text-warning-soft-foreground`). Swapping in `Typography` would
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
     * Equivalent to `children`; wins over it when both are passed.
     */
    body?: ReactNode
    /** Shorthand for {@link CalloutProps.body}. */
    children?: ReactNode
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
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * Story-only: when on, the frame names ITSELF `"Callout"` so a panel can badge it
     * without the story wrapping an extra div.
     *
     * Until 2026-07-27 this prop was declared and destructured but NEVER USED — six story
     * leaves passed it and got NO badge at all, while the JSDoc claimed "each composed part
     * emits data-anat-part". A frame that promises anatomy and emits nothing is invisible in
     * the panel with no error anywhere, which is exactly why 11a.1 pins the idiom
     * `anatPart ?? (showAnatomy ? "<name>" : undefined)`.
     */
    showAnatomy?: boolean
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
    children,
    icon,
    actionLabel,
    onAction,
    onClose,
    closeAriaLabel,
    classNames,
    anatPart,
    showAnatomy = false,
}: CalloutProps) => (
    <Alert
        status={status}
        tone="soft"
        title={title}
        description={description}
        body={body ?? children}
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
        // Self-names as the thing it COMPOSES, not as itself. The parent already gives it a
        // name through `anatPart`; running inside its own story the useful answer is "this is
        // an Alert wearing a callout skin", which is what a Deps tab is for. Naming it
        // `Callout` here made the subject label itself and left the tree empty, because the
        // only frame this composite is built on never appeared (caught 2026-07-27).
        showAnatomy={showAnatomy}
    />
)
