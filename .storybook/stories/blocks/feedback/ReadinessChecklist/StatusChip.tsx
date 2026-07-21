import React from "react"
import type { ReactNode } from "react"
import { Chip, CloseButton, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful local copy of
 * `@/components/blocks/chips/StatusChip`, inlined here because ReadinessChecklist
 * depends on it and no local port exists elsewhere yet. Its `ElementCloseButton`
 * dependency (used only by the `onCancel` branch) is inlined below.
 * TODO: swap for the StatusChip local when it is ported under `.storybook/stories`.
 */

/** Semantic tone of the status chip. `neutral` maps to the default color. */
export type StatusChipTone = "neutral" | "success" | "warning" | "danger" | "accent"

/** Per-tone colour + hover fill for the inlined close button (LITERAL classes). */
const CLOSE_TONE: Record<StatusChipTone, string> = {
    neutral: "!text-muted hover:!bg-default",
    accent: "!text-accent-soft-foreground hover:!bg-accent-soft",
    success: "!text-success-soft-foreground hover:!bg-success-soft",
    warning: "!text-warning-soft-foreground hover:!bg-warning-soft",
    danger: "!text-danger-soft-foreground hover:!bg-danger-soft",
}

/** Inlined faithful copy of `ElementCloseButton` — transparent at rest, tonal hover. */
const ElementCloseButton = ({
    label,
    onPress,
    tone = "neutral",
    className,
}: {
    label: string
    onPress: () => void
    tone?: StatusChipTone
    className?: string
}) => {
    return (
        <CloseButton
            aria-label={label}
            onPress={onPress}
            className={cn("!bg-transparent", CLOSE_TONE[tone], className)}
        />
    )
}

/** Props for the {@link StatusChip} block. */
export interface StatusChipProps {
    /** Semantic tone that drives the chip color. Defaults to "neutral". */
    tone?: StatusChipTone
    /** Optional leading icon (typically a Phosphor icon) rendered before the label. */
    icon?: ReactNode
    /** Label content rendered inside the chip. */
    children: ReactNode
    /**
     * When provided, renders a TRAILING cancel button (X at the end). When set,
     * the leading {@link StatusChipProps.icon} is DROPPED — a removable chip carries
     * EITHER a leading status icon OR a trailing cancel-X, never both.
     */
    onCancel?: () => void
    /** Accessible label for the cancel button. */
    cancelLabel?: string
    /** Extra classes on the chip. */
    className?: string
}

/** Maps a {@link StatusChipTone} to the matching HeroUI Chip color. */
const toneToColor: Record<StatusChipTone, "default" | "success" | "warning" | "danger" | "accent"> = {
    neutral: "default",
    success: "success",
    warning: "warning",
    danger: "danger",
    accent: "accent",
}

/**
 * Generic, presentational status chip — a thin pill-shaped wrapper over HeroUI
 * Chip that maps a semantic tone to a chip color and optionally renders a leading
 * icon before the label, or a trailing cancel-X for a removable/filter chip.
 *
 * @param props - {@link StatusChipProps}
 */
export const StatusChip = ({ tone = "neutral", icon, children, onCancel, cancelLabel, className }: StatusChipProps) => {
    return (
        <Chip
            color={toneToColor[tone]}
            variant="soft"
            size="sm"
            className={cn("w-fit", className)}
        >
            {icon && !onCancel ? <span className="shrink-0 [&_svg]:size-4">{icon}</span> : null}
            <Chip.Label>{children}</Chip.Label>
            {onCancel ? (
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
