import React from "react"
import { cn } from "../../../_cn"

/** Colour role of a {@link ChunkyButton}. */
export type ChunkyTone = "pink" | "sun" | "ink"

/** Hard-shadow colour cast behind the button — ink on light surfaces, cream on the dark banner. */
export type ChunkyShadow = "ink" | "cream"

/** Props for {@link ChunkyButton}. */
export interface ChunkyButtonProps {
    /** Button label (and any inline nodes). */
    children: React.ReactNode
    /** Destination — the marketing button is always a link. */
    href: string
    /** Colour role: `pink` (primary CTA, white text), `sun` (secondary, ink text), `ink` (reserved). */
    tone?: ChunkyTone
    /** `md` for nav/inline CTAs, `lg` for the hero and closing-banner CTAs. */
    size?: "md" | "lg"
    /** Colour of the offset hard shadow; `cream` for the button sitting on the dark banner. */
    shadow?: ChunkyShadow
    /** Trailing icon slot — typically an arrow or a play triangle. */
    endIcon?: React.ReactNode
    /** Placement class from the caller (e.g. width). Appearance stays owned here. */
    className?: string
}

const TONE: Record<ChunkyTone, string> = {
    pink: "bg-[var(--nb-pink)] text-white",
    sun: "bg-[var(--nb-sun)] text-[var(--nb-ink)]",
    ink: "bg-[var(--nb-ink)] text-[var(--nb-cream)]",
}

const SIZE: Record<"md" | "lg", string> = {
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
}

const SHADOW: Record<ChunkyShadow, string> = {
    ink: "shadow-[4px_4px_0_0_var(--nb-ink)] hover:shadow-[5px_5px_0_0_var(--nb-ink)] active:shadow-[2px_2px_0_0_var(--nb-ink)]",
    cream: "shadow-[4px_4px_0_0_var(--nb-cream)] hover:shadow-[5px_5px_0_0_var(--nb-cream)] active:shadow-[2px_2px_0_0_var(--nb-cream)]",
}

/**
 * The neo-brutalist CTA: a chunky, hard-shadowed link that lifts on hover and presses
 * down on click. It is the ONE interactive value the whole marketing surface repeats —
 * nav, hero, feature links and the closing banner all reach for it — so its border,
 * shadow and press motion live in exactly one place. Purely presentational: it renders
 * an `<a>` from props, holds no state, and consumes only `var(--nb-*)` tokens.
 *
 * Colour is a ROLE (`tone`), never a hex at the call site: `pink` is the primary CTA,
 * `sun` the secondary. The offset shadow flips to `cream` for the single button that
 * sits on the dark banner, where an ink shadow would vanish.
 *
 * @param props - {@link ChunkyButtonProps}
 * @see Story: .storybook/stories/mia-mia/atoms/buttons/ChunkyButton/ChunkyButton.stories
 */
export const ChunkyButton = ({
    children,
    href,
    tone = "pink",
    size = "md",
    shadow = "ink",
    endIcon,
    className,
}: ChunkyButtonProps) => (
    <a
        href={href}
        className={cn(
            "inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--nb-ink)] font-extrabold",
            "transition hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]",
            TONE[tone],
            SIZE[size],
            SHADOW[shadow],
            className,
        )}
    >
        {children}
        {endIcon}
    </a>
)
