import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { InnerLayout } from "../InnerLayout"
import React, { PropsWithChildren } from "react"
import { Open_Sans } from "next/font/google"

const font = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
})

export default async function LocaleLayout({
    children,
    params,
}: PropsWithChildren & { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages()

    return (
        <html lang={locale}>
            <body className={`${font.className} antialiased`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <InnerLayout>
                        <div className="p-6 max-w-[1024px] mx-auto">
                            {children}
                        </div>
                    </InnerLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
