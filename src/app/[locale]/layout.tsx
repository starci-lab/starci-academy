import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { InnerLayout } from "../InnerLayout"
import React, { PropsWithChildren } from "react"
import { Nunito } from "next/font/google"

const font = Nunito({
    subsets: ["latin"],
    variable: "--font-nunito",
})

const Layout = async ({
    children,
    params,
}: PropsWithChildren & { params: Promise<{ locale: string }> }) => {
    const { locale } = await params
    const messages = await getMessages()
    return (
        <html lang={locale}>
            <body className={`${font.className} antialiased  bg-background`}>
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
