import React from "react"
import { cn } from "../../../_cn"

/** Surface colour of a {@link FeatureCard}. */
export type FeatureTone = "white" | "blush"

/** Props for {@link FeatureCard}. */
export interface FeatureCardProps {
    /** Leading glyph, rendered inside the sunny tile — caller passes the SVG. */
    icon: React.ReactNode
    /** Feature name. */
    title: React.ReactNode
    /** One or two lines describing the feature. */
    description: React.ReactNode
    /** Text of the closing link. */
    ctaLabel: React.ReactNode
    /** Where the link points. */
    ctaHref: string
    /** Card fill; the three-across row alternates `white` and `blush`. */
    tone?: FeatureTone
    /** Resting tilt — the cards lean alternately for the sticker-board feel. */
    tilt?: "left" | "right"
    /** Placement class from the caller. */
    className?: string
}

const TONE: Record<FeatureTone, string> = {
    white: "bg-white",
    blush: "bg-[var(--nb-blush)]",
}

const TILT = {
    left: "-rotate-1",
    right: "rotate-1",
}

/** The chunky right-arrow that trails the feature link. */
const FeatureArrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E01F7E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
)

/**
 * The neo-brutalist feature card: a sunny icon tile over a title, a short description,
 * and a pink "learn more" link, on a tilted hard-shadowed surface that deepens its
 * shadow on hover. It is the repeating cell of the "three ways to get better" row.
 * Purely presentational and props-only; the icon is a slot so the card stays generic,
 * and colour comes from `var(--nb-*)`.
 *
 * @param props - {@link FeatureCardProps}
 * @see Story: .storybook/stories/mia-mia/composites/cards/FeatureCard/FeatureCard.stories
 */
export const FeatureCard = ({
    icon,
    title,
    description,
    ctaLabel,
    ctaHref,
    tone = "white",
    tilt = "left",
    className,
}: FeatureCardProps) => (
    <div
        className={cn(
            "flex flex-col gap-3 rounded-3xl border-2 border-[var(--nb-ink)] p-6 shadow-[var(--nb-shadow)] transition-shadow hover:shadow-[10px_10px_0_0_var(--nb-ink)]",
            TONE[tone],
            TILT[tilt],
            className,
        )}
    >
        <div className="grid size-12 place-items-center rounded-2xl border-2 border-[var(--nb-ink)] bg-[var(--nb-sun)] shadow-[4px_4px_0_0_var(--nb-ink)]">
            {icon}
        </div>
        <div className="flex flex-col gap-2">
            <h3 className="text-xl font-extrabold text-[var(--nb-ink)]">{title}</h3>
            <p className="font-medium text-[var(--nb-muted)]">{description}</p>
        </div>
        <a href={ctaHref} className="inline-flex items-center gap-2 font-extrabold text-[var(--nb-pink-deep)]">
            {ctaLabel}
            <FeatureArrow />
        </a>
    </div>
)
