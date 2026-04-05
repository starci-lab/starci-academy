import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import React, { PropsWithChildren } from "react"
import { InnerLayout } from "./InnerLayout"
import { NextIntlClientProvider } from "next-intl"

const font = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
})

export const metadata: Metadata = {
    title: "StarCi Academy",
    description: "StarCi Academy is a platform for learning and growing",
}

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <html lang="en">
            <body
                className={`${font.className} antialiased`}
            >
                <NextIntlClientProvider>
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

export default Layout