import React from "react"
import { ChunkyButton } from "@sb-components/mia-mia/atoms/buttons/ChunkyButton"

/** Props for {@link CtaBanner}. */
export interface CtaBannerProps {
    /** Closing headline. */
    title: string
    /** One-line reassurance under it. */
    description: string
    /** CTA label. */
    ctaLabel: string
    /** Where the CTA points (the app). */
    ctaHref: string
}

/** The chunky arrow trailing the banner CTA. */
const BannerArrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
)

/**
 * The closing call-to-action: a dark rounded slab with a pink offset shadow, a headline,
 * a reassurance line, and one {@link ChunkyButton} whose shadow flips to cream so it reads
 * on the dark fill. Presentational and props-only; colour is `var(--nb-*)`.
 *
 * @param props - {@link CtaBannerProps}
 * @see Story: .storybook/stories/mia-mia/blocks/marketing/CtaBanner/CtaBanner.stories
 */
export const CtaBanner = ({ title, description, ctaLabel, ctaHref }: CtaBannerProps) => (
    <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-[var(--nb-ink)] bg-[var(--nb-ink)] px-8 py-8 text-center text-[var(--nb-cream)] shadow-[8px_8px_0_0_var(--nb-pink)]">
            <h2 className="text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold text-balance text-white">{title}</h2>
            <p className="max-w-[46ch] font-medium text-white/80">{description}</p>
            <ChunkyButton href={ctaHref} tone="pink" size="lg" shadow="cream" endIcon={<BannerArrow />}>
                {ctaLabel}
            </ChunkyButton>
        </div>
    </section>
)
