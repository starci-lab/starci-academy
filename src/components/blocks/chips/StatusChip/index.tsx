import React from "react"
import type { ReactNode } from "react"
import { Chip, cn } from "@heroui/react"
import { ElementCloseButton } from "@/components/blocks/buttons/ElementCloseButton"

import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Semantic tone of the status chip. Each tone maps to a HeroUI Chip color
 * (the neutral tone maps to the default color).
 */
export type StatusChipTone = "neutral" | "success" | "warning" | "danger" | "accent"

/**
 * Props for the {@link StatusChip} block.
 */
export interface StatusChipProps extends WithClassNames<undefined> {
    /**
     * Semantic tone that drives the chip color. Defaults to "neutral".
     */
    tone?: StatusChipTone
    /**
     * Optional leading icon (typically a Phosphor icon) rendered before the label.
     */
    icon?: ReactNode
    /**
     * Label content rendered inside the chip.
     */
    children: ReactNode
    /**
     * When provided, renders a TRAILING cancel button (X at the end) — click it to
     * remove/cancel the chip. Uses HeroUI `CloseButton` with its OWN default × glyph
     * (per `alert.md`: close-affordances use `CloseButton`, never a hand-rolled
     * `<button><XIcon/>` — and don't override its glyph either; same treatment as
     * `Callout`). When set, the leading {@link StatusChipProps.icon} is DROPPED — a
     * removable/filter chip carries EITHER a leading status icon OR a trailing
     * cancel-X, never both (teacher: "có dấu X rồi thì prefix không có icon").
     */
    onCancel?: () => void
    /**
     * Accessible label for the cancel button (the caller passes a localised string,
     * e.g. `t("common.remove")`). Falls back to HeroUI's default "Close".
     */
    cancelLabel?: string
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
 * HeroUI Chip that maps a semantic tone to a chip color and optionally renders
 * a leading icon before the label. Presentational: the only callback it takes is
 * {@link StatusChipProps.onCancel} for a removable/filter chip (a trailing cancel-X).
 */
export const StatusChip = ({ tone = "neutral", icon, children, onCancel, cancelLabel, className }: StatusChipProps) => {
    return (
        <Chip
            color={toneToColor[tone]}
            variant="soft"
            size="sm"
            // w-fit: a chip is a hug-content pill by default — an explicit width
            // defeats a parent flex-col's `align-items: stretch` so it never
            // gets stretched full-width (card family §chip). Icon forced to
            // size-4 so every chip icon reads uniformly regardless of caller.
            // Colour is HeroUI's NATIVE soft pairing (`--chip-bg`=`<color>-soft`,
            // `--chip-fg`=`<color>-soft-foreground`) — no hand-rolled tint, so the
            // label + icon inherit an accessibility-tuned foreground (the old
            // `bg-<status>/10 + text-<status>` raw-hue formula failed contrast).
            className={cn("w-fit", className)}
        >
            {/* leading status icon — DROPPED when the chip is removable (has a
                trailing cancel-X): a chip carries EITHER a status icon OR a cancel-X,
                never both. Icon forced to size-4 so it reads uniformly. */}
            {icon && !onCancel ? <span className="shrink-0 [&_svg]:size-4">{icon}</span> : null}
            <Chip.Label>{children}</Chip.Label>
            {onCancel ? (
                // shared close × — bakes transparent-at-rest + tonal hover (same
                // treatment as Callout's dismiss). `tone={tone}` so the X + its hover
                // read the chip's own colour, not a foreign grey.
                <ElementCloseButton
                    label={cancelLabel ?? ""}
                    onPress={onCancel}
                    tone={tone}
                    className="shrink-0"
                />
            ) : null}
        </Chip>
    )
}
