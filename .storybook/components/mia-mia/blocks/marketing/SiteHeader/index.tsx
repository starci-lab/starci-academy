import React from "react"
import { ChunkyButton } from "@sb-components/mia-mia/atoms/buttons/ChunkyButton"

/** One primary-nav destination. */
export interface SiteNavLink {
    /** Visible label. */
    label: string
    /** Destination. */
    href: string
}

/** Props for {@link SiteHeader}. */
export interface SiteHeaderProps {
    /** Wordmark text (e.g. `mia mia`). */
    brand: string
    /** Primary-nav links, hidden below `md`. */
    links: SiteNavLink[]
    /** Label of the top-right CTA. */
    ctaLabel: string
    /** Where the CTA points (the app). */
    ctaHref: string
}

/** The chunky right-arrow trailing the header CTA. */
const HeaderArrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
)

/**
 * The marketing top bar: a tilted-square wordmark, a row of primary-nav links (hidden
 * on small screens), and a single {@link ChunkyButton} into the app. Presentational and
 * props-only — copy and hrefs are passed in, and the CTA chrome is owned by the atom so
 * the bar never hand-rolls a button.
 *
 * @param props - {@link SiteHeaderProps}
 * @see Story: .storybook/stories/mia-mia/blocks/marketing/SiteHeader/SiteHeader.stories
 */
export const SiteHeader = ({ brand, links, ctaLabel, ctaHref }: SiteHeaderProps) => (
    <nav className="border-b-2 border-[var(--nb-ink)] bg-[var(--nb-cream)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-[var(--nb-ink)]">
            <span className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
                <span className="inline-block size-5 -rotate-6 rounded-lg border-2 border-[var(--nb-ink)] bg-[var(--nb-pink)] shadow-[2px_2px_0_0_var(--nb-ink)]" aria-hidden="true" />
                {brand}
            </span>
            <span className="hidden gap-7 font-semibold md:flex">
                {links.map((link) => (
                    <a key={link.label} href={link.href} className="hover:underline">{link.label}</a>
                ))}
            </span>
            <ChunkyButton href={ctaHref} tone="pink" size="md" endIcon={<HeaderArrow />}>
                {ctaLabel}
            </ChunkyButton>
        </div>
    </nav>
)
