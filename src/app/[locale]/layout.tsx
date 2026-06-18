import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { InnerLayout } from "../InnerLayout"
import React, { PropsWithChildren } from "react"
import { Open_Sans } from "next/font/google"

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

const Layout = async ({
    children,
    params,
}: LocaleLayoutProps) => {
    const { locale } = await params
    const messages = await getMessages()
    return (
        <html lang={locale}>
            <body className={`${font.className} ${font.variable} antialiased  bg-background`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <InnerLayout>
                        <div>
                            {children}
                        </div>
                    </InnerLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
export default Layout
