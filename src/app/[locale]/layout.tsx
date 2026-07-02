import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import type { Metadata } from "next"
import { AnalyticsGate } from "@/components/features/cookie-consent/AnalyticsGate"
import { InnerLayout } from "../InnerLayout"
import React, { PropsWithChildren } from "react"
import { Open_Sans } from "next/font/google"
import { SEO_CONFIG } from "@/config/seo"

const font = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
})

/** Route params for the `[locale]` segment. */
interface LocaleRouteParams {
    /** Active locale code resolved from the URL (e.g. `vi`, `en`). */
    locale: string
}

/** Props for the locale root layout: page subtree plus the awaited route params. */
interface LocaleLayoutProps extends PropsWithChildren {
    /** Promise of the resolved `[locale]` route params (Next.js App Router). */
    params: Promise<LocaleRouteParams>
}

/**
 * Locale-level metadata: sets the OpenGraph locale so inherited (non-builder)
 * pages still unfurl with the right `og:locale`. Per-page `generateMetadata`
 * (via `buildPageMetadata`) overrides canonical/hreflang/title as needed.
 *
 * @param props.params - the awaited `[locale]` route params.
 */
export const generateMetadata = async ({
    params,
}: {
    params: Promise<LocaleRouteParams>
}): Promise<Metadata> => {
    const { locale } = await params
    return {
        openGraph: {
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
    }
}

const Layout = async ({
    children,
    params,
}: LocaleLayoutProps) => {
    const { locale } = await params
    const messages = await getMessages()
    return (
        <html lang={locale}>
            <body className={`${font.className} ${font.variable} antialiased  bg-background`}>
                {/* Blocking no-flash script (same pattern next-themes uses for light/dark
                    itself, applied to our custom accent-color override): reads the cached
                    accent hex from localStorage and applies --accent/--accent-foreground
                    to <html> synchronously, before hydration paints anything with the
                    default brand accent. The server (UserEntity.accentColor, synced via
                    useAccentOverride once `me` resolves) stays the source of truth — this
                    is only a same-device fast-path so a reload never flashes. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "(function(){try{var c=localStorage.getItem('appearance:accent_color');if(!c)return;var h=c.replace('#','');if(h.length===3)h=h.split('').map(function(x){return x+x}).join('');var r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);var yiq=(r*299+g*587+b*114)/1000;var root=document.documentElement;root.style.setProperty('--accent',c);root.style.setProperty('--accent-foreground',yiq>=150?'oklch(21.03% 0.0015 354.13)':'oklch(100% 0 0)')}catch(e){}})()",
                    }}
                />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <InnerLayout>
                        <div>
                            {children}
                        </div>
                    </InnerLayout>
                </NextIntlClientProvider>
                {/* GA4 — injected only when a measurement id is configured AND the visitor has
                    consented to analytics (AnalyticsGate gates on cookie consent) */}
                {SEO_CONFIG.gaId ? <AnalyticsGate gaId={SEO_CONFIG.gaId} /> : null}
            </body>
        </html>
    )
}
export default Layout
