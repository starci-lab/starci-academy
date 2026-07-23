import React from "react"
import type { ReactNode } from "react"
import { Chip, cn } from "@heroui/react"
import { XIcon } from "@phosphor-icons/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { AnatomyOverlay } from "../../layout/AnatomyOverlay/AnatomyOverlay"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `StatusChip`. Authored in Storybook
 * (not `src`); synced to `src` later. NO `@/components` imports.
 */

/**
 * Semantic tone of the status chip. Each tone maps to a HeroUI Chip color
 * (the neutral tone maps to the default color).
 */
export type StatusChipTone = "neutral" | "success" | "warning" | "danger" | "accent"

/**
 * Props for the {@link StatusChip} block.
 */
export interface StatusChipProps {
    /**
     * Semantic tone that drives the chip color. Defaults to "neutral".
     */
    tone?: StatusChipTone
    /**
     * Label content rendered inside the chip.
     */
    children: ReactNode
    /**
     * When provided, renders a TRAILING cancel × — click it to remove/cancel the
     * chip. COMPACT close sized to the chip (size-4 hit, size-3 glyph) inheriting
     * the chip's tone via `currentColor` — NOT the button-scale `Button` iconOnly close
     * (that's ~32px+ and would blow the 24px pill up). Chip close is its own scale.
     */
    onCancel?: () => void
    /**
     * Accessible label for the cancel button (the caller passes a localised string,
     * e.g. `t("common.remove")`). Falls back to HeroUI's default "Close".
     */
    cancelLabel?: string
    /** Extra classes on the chip. */
    className?: string
    /** `true` → render the skeleton mirror (a pill placeholder). Consumer just flips the flag. */
    isSkeleton?: boolean
    /**
     * Optional LEADING glyph rendered before the label. Opt-in — the chip stays
     * text-only by default. The PRIMITIVE owns the size (§4): pass the icon
     * TRẦN (no `size-*`) — it's forced to `size-3` here to match the chip's
     * `text-xs` label scale.
     */
    icon?: ReactNode
    /** Dev/spec: overlay the anatomy annotation on this chip. */
    showAnatomy?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Maps a {@link StatusChipTone} to the matching HeroUI Chip color.
 */
const toneToColor: Record<StatusChipTone, "default" | "success" | "warning" | "danger" | "accent"> = {
    neutral: "default",
    success: "success",
    warning: "warning",
    danger: "danger",
    accent: "accent",
}

/**
 * Generic, presentational status chip. A thin pill-shaped wrapper over the
 * HeroUI Chip that maps a semantic tone to a chip color. Text-only by
 * default — {@link StatusChipProps.icon} is an opt-in leading glyph.
 * Presentational: the only callback it takes is
 * {@link StatusChipProps.onCancel} for a removable/filter chip (a trailing cancel-X).
 */
export const StatusChip = ({
    tone = "neutral",
    children,
    onCancel,
    cancelLabel,
    className,
    isSkeleton = false,
    icon,
    showAnatomy = false,
    anatPart,
}: StatusChipProps) => {
    if (isSkeleton) {
        return <Skeleton.Chip className={className} />
    }
    const chip = (
        <Chip
            data-anat-part={anatPart}
            color={toneToColor[tone]}
            variant="soft"
            size="sm"
            // w-fit: a chip is a hug-content pill by default — an explicit width
            // defeats a parent flex-col's `align-items: stretch` so it never
            // gets stretched full-width (card family §chip).
            // Colour is HeroUI's NATIVE soft pairing (`--chip-bg`=`<color>-soft`,
            // `--chip-fg`=`<color>-soft-foreground`) — no hand-rolled tint, so the
            // label inherits an accessibility-tuned foreground (the old
            // `bg-<status>/10 + text-<status>` raw-hue formula failed contrast).
            className={cn("w-fit", className)}
        >
            {icon ? (
                // PRIMITIVE owns the size (§4) — force the caller's bare icon down
                // to the chip glyph scale (matches the `text-xs` label).
                <span aria-hidden className="inline-flex shrink-0 [&_svg]:size-3">
                    {icon}
                </span>
            ) : null}
            <Chip.Label>{children}</Chip.Label>
            {onCancel ? (
                // Compact chip-scale close × — inherits the chip's tone (currentColor),
                // sized to the pill (NOT the button-scale `Button` iconOnly close). It's an
                // ACTION (remove) → real <button> for a11y, NOT a <Link> (link = nav).
                // Hover = tonal tint + full opacity (rõ hơn opacity fade).
                <button
                    type="button"
                    aria-label={cancelLabel ?? "Close"}
                    onClick={onCancel}
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none transition hover:bg-current/15 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent [&_svg]:size-3"
                >
                    <XIcon aria-hidden focusable="false" />
                </button>
            ) : null}
        </Chip>
    )
    return showAnatomy ? (
        <span className="relative inline-flex" data-anat>
            {chip}
            <AnatomyOverlay label="StatusChip" tier="primitive" href="/?path=/docs/primitives-chip-statuschip--docs" />
        </span>
    ) : chip
}
