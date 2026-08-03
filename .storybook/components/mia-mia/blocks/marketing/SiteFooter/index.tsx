import React from "react"

/** One footer link. */
export interface FooterLink {
    /** Visible label. */
    label: string
    /** Destination. */
    href: string
}

/** A labelled column of footer links. */
export interface FooterColumn {
    /** Stable key. */
    key: string
    /** Uppercase column heading. */
    heading: string
    /** Links in display order. */
    items: FooterLink[]
}

/** Props for {@link SiteFooter}. */
export interface SiteFooterProps {
    /** Wordmark text. */
    brand: string
    /** One-line description under the wordmark. */
    tagline: string
    /** Link columns (three across from `md`). */
    columns: FooterColumn[]
    /** Copyright line in the bottom bar. */
    copyright: string
    /** Right-aligned bottom-bar note. */
    madeIn: string
}

/**
 * The site footer: a wordmark with a tagline beside link columns, over a ruled bottom bar
 * carrying the copyright and a made-in note. Presentational and props-only; the columns
 * and links are passed in. Colour is `var(--nb-*)`.
 *
 * @param props - {@link SiteFooterProps}
 * @see Story: .storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories
 */
export const SiteFooter = ({ brand, tagline, columns, copyright, madeIn }: SiteFooterProps) => (
    <footer className="border-t-2 border-[var(--nb-ink)] bg-[var(--nb-blush)] text-[var(--nb-ink)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
            <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
                <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
                    <span className="inline-block size-4 -rotate-6 rounded-md border-2 border-[var(--nb-ink)] bg-[var(--nb-pink)] shadow-[2px_2px_0_0_var(--nb-ink)]" aria-hidden="true" />
                    {brand}
                </span>
                <p className="max-w-[26ch] text-sm font-medium text-[var(--nb-muted)]">{tagline}</p>
            </div>
            {columns.map((col) => (
                <div key={col.key} className="flex flex-col gap-3">
                    <div className="text-xs font-extrabold uppercase tracking-widest text-[var(--nb-pink-deep)]">{col.heading}</div>
                    <ul className="flex flex-col gap-2 text-sm font-semibold">
                        {col.items.map((item) => (
                            <li key={item.label}><a href={item.href} className="hover:underline hover:decoration-2 hover:underline-offset-4">{item.label}</a></li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
        <div className="border-t-2 border-[var(--nb-ink)]">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm font-semibold text-[var(--nb-muted)] sm:flex-row">
                <span>{copyright}</span>
                <span>{madeIn}</span>
            </div>
        </div>
    </footer>
)
