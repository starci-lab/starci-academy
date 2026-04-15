import type { Metadata } from "next"
import "./globals.css"
import { PropsWithChildren } from "react"
import React from "react"
import { Open_Sans } from "next/font/google"
export const metadata: Metadata = {
    title: "StarCi Academy",
    description: "StarCi Academy is a platform for learning and growing",
}

const font = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
})

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <html lang="en">
            <body className={`${font.className} antialiased`}>
                {children}
            </body>
        </html>
    )
}

export default Layout