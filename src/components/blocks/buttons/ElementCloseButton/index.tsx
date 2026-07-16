import React from "react"
import { CloseButton, cn } from "@heroui/react"

import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Tone that drives the close button's colour + hover tint. Maps 1:1 to the app's
 * semantic colours; `neutral` is the quiet grey default.
 */
export type ElementCloseButtonTone = "neutral" | "accent" | "success" | "warning" | "danger"

/**
 * Per-tone colour + hover fill (LITERAL classes — Tailwind can't see interpolated
 * ones). The `!` beats HeroUI's UNLAYERED `.close-button--default` base
 * (`bg-default text-muted`), which a plain utility would lose to. This is the SAME
 * "text-<tone> + hover:bg-<tone>/10" treatment `Callout` used ad-hoc, now shared so
 * every close button reads consistently: hover = a tint of its OWN tone.
 */
const TONE: Record<ElementCloseButtonTone, string> = {
    neutral: "!text-muted hover:!bg-default",
    accent: "!text-accent-soft-foreground hover:!bg-accent-soft",
    success: "!text-success-soft-foreground hover:!bg-success-soft",
    warning: "!text-warning-soft-foreground hover:!bg-warning-soft",
    danger: "!text-danger-soft-foreground hover:!bg-danger-soft",
}

/** Props for {@link ElementCloseButton}. */
export interface ElementCloseButtonProps extends WithClassNames<undefined> {
    /** Accessible label (the caller passes a localised string, e.g. `t("common.close")`). */
    label: string
    /** Fired when the close/dismiss button is pressed. */
    onPress: () => void
    /**
     * Colour + hover-tint tone. Defaults to `neutral`. Pass the OWNER's tone so the
     * X reads tonal (a warning callout → warning X, an accent chip → accent X).
     */
    tone?: ElementCloseButtonTone
}

/**
 * The design-system close/dismiss "×" — a thin wrapper over HeroUI `CloseButton`
 * that bakes the shared look so callers don't re-style it ad-hoc:
 *
 * - **TRANSPARENT at rest** (icon only, no grey pill) — a fill of its own tone only
 *   on hover, so it never sits as a permanent grey square.
 * - **Tonal colour** (`tone`) — the × and its hover tint follow the owner's semantic
 *   colour, matching the surface it dismisses.
 *
 * All styling is per-instance (`!` utilities on THIS element), so it never leaks to
 * close buttons elsewhere (no global `.close-button` override). Use for a Callout
 * dismiss, a removable chip's cancel-X, a dismissible banner, etc.
 *
 * @param props - {@link ElementCloseButtonProps}
 * @see Story: .storybook/stories/blocks/buttons/ElementCloseButton/ElementCloseButton.stories
 */
export const ElementCloseButton = ({ label, onPress, tone = "neutral", className }: ElementCloseButtonProps) => {
    return (
        <CloseButton
            aria-label={label}
            onPress={onPress}
            className={cn("!bg-transparent", TONE[tone], className)}
        />
    )
}
