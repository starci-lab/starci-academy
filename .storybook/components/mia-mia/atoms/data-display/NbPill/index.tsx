import React from "react"
import { cn } from "../../../_cn"

/** Colour role of an {@link NbPill}. */
export type NbPillTone = "sun" | "white" | "pink" | "mint" | "blush" | "ink"

/** Props for {@link NbPill}. */
export interface NbPillProps {
    /** Pill label (and any inline nodes). */
    children: React.ReactNode
    /** Fill colour role. */
    tone?: NbPillTone
    /** `round` for a full radius, `soft` for a rounded rectangle. */
    shape?: "round" | "soft"
    /** `sm` = compact meta/status tag, `md` = the hero eyebrow. */
    size?: "sm" | "md"
    /** Leading icon slot (e.g. the eyebrow star). */
    icon?: React.ReactNode
    /** Whether to draw the 2px ink border. */
    bordered?: boolean
    /** Whether to cast the offset hard shadow. */
    shadow?: boolean
    /** Placement class from the caller. */
    className?: string
}

const TONE: Record<NbPillTone, string> = {
    sun: "bg-[var(--nb-sun)] text-[var(--nb-ink)]",
    white: "bg-white text-[var(--nb-ink)]",
    pink: "bg-[var(--nb-pink)] text-white",
    mint: "bg-[var(--nb-mint)] text-[var(--nb-ink)]",
    blush: "bg-[var(--nb-blush)] text-[var(--nb-ink)]",
    ink: "bg-[var(--nb-ink)] text-[var(--nb-cream)]",
}

const SIZE: Record<"sm" | "md", string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-4 py-2 text-sm",
}

/**
 * The neo-brutalist pill: a small bordered, optionally hard-shadowed label. It is the
 * marketing surface's smallest labelled value — the hero eyebrow, a card's meta tag
 * (`50 questions · 60′`), a status chip (`Submitted`). Extracting it keeps the blocks and cards
 * free of hand-rolled chip chrome and off-scale padding. Purely presentational: props
 * in, `var(--nb-*)` out, no state.
 *
 * Colour is a `tone` role; `shape`, `size`, `bordered` and `shadow` cover the two shapes
 * that recur — a shadowed sunny eyebrow and a flat white meta tag.
 *
 * @param props - {@link NbPillProps}
 * @see Story: .storybook/stories/mia-mia/atoms/data-display/NbPill/NbPill.stories
 */
export const NbPill = ({
    children,
    tone = "white",
    shape = "round",
    size = "md",
    icon,
    bordered = true,
    shadow = false,
    className,
}: NbPillProps) => (
    <span
        className={cn(
            "inline-flex w-fit items-center gap-2 font-bold",
            shape === "round" ? "rounded-full" : "rounded-lg",
            bordered && "border-2 border-[var(--nb-ink)]",
            shadow && "shadow-[4px_4px_0_0_var(--nb-ink)]",
            TONE[tone],
            SIZE[size],
            className,
        )}
    >
        {icon}
        {children}
    </span>
)
