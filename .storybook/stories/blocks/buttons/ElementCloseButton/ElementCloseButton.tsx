import React from "react"
import { cn } from "@heroui/react"
import { X } from "@phosphor-icons/react"
import { Button } from "../Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `ElementCloseButton`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 */

/**
 * Tone that drives the close button's colour + hover tint. Maps 1:1 to the app's
 * semantic colours; `neutral` is the quiet grey default.
 */
export type ElementCloseButtonTone = "neutral" | "accent" | "success" | "warning" | "danger"

/**
 * Per-tone colour + hover fill (LITERAL classes — Tailwind can't see interpolated
 * ones). The `!` beats the base `ghost` variant's own text/hover, which a plain
 * utility would lose to. This is the SAME "text-<tone> + hover:bg-<tone>/10"
 * treatment `Callout` used ad-hoc, now shared so every close button reads
 * consistently: hover = a tint of its OWN tone.
 */
const TONE: Record<ElementCloseButtonTone, string> = {
    neutral: "!text-muted hover:!bg-default",
    accent: "!text-accent-soft-foreground hover:!bg-accent-soft",
    success: "!text-success-soft-foreground hover:!bg-success-soft",
    warning: "!text-warning-soft-foreground hover:!bg-warning-soft",
    danger: "!text-danger-soft-foreground hover:!bg-danger-soft",
}

/** Props for {@link ElementCloseButton}. */
export interface ElementCloseButtonProps {
    /** Accessible label (the caller passes a localised string, e.g. `t("common.close")`). */
    label: string
    /** Fired when the close/dismiss button is pressed. */
    onPress: () => void
    /**
     * Colour + hover-tint tone. Defaults to `neutral`. Pass the OWNER's tone so the
     * X reads tonal (a warning callout → warning X, an accent chip → accent X).
     */
    tone?: ElementCloseButtonTone
    /** Extra classes on the button. */
    className?: string
}

/**
 * The design-system close/dismiss "×" — a THIN semantic "close" wrapper that
 * COMPOSES the base {@link Button} in `iconOnly` + `ghost` mode (never HeroUI
 * directly), baking the shared look so callers don't re-style it ad-hoc:
 *
 * - **TRANSPARENT at rest** (icon only, no grey pill) — a fill of its own tone only
 *   on hover, so it never sits as a permanent grey square.
 * - **Tonal colour** (`tone`) — the × and its hover tint follow the owner's semantic
 *   colour, matching the surface it dismisses.
 *
 * All styling is per-instance (`!` utilities on THIS element), so it never leaks to
 * close buttons elsewhere. Use for a Callout dismiss, a removable chip's cancel-X, a
 * dismissible banner, etc.
 *
 * @param props - {@link ElementCloseButtonProps}
 */
export const ElementCloseButton = ({ label, onPress, tone = "neutral", className }: ElementCloseButtonProps) => {
    return (
        <Button
            iconOnly
            variant="ghost"
            ariaLabel={label}
            icon={<X aria-hidden />}
            onPress={onPress}
            className={cn(TONE[tone], className)}
        />
    )
}
