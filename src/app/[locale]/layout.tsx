import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { InnerLayout } from "../InnerLayout"
import React, { PropsWithChildren } from "react"
import { JetBrains_Mono } from "next/font/google"

const font = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
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
                        <div className="p-6 max-w-[1256px] mx-auto">
                            {children}
                        </div>
                    </InnerLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
export default Layout
