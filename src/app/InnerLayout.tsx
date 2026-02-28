"use client"
import {
    HeroUIProvider,
    NextThemesProvider,
    SwrProvider,
} from "@/components"
import { ToastProvider } from "@heroui/react"
import { Navbar } from "@/components"
import React, { PropsWithChildren, Suspense } from "react"

export const InnerLayout = ({ children }: PropsWithChildren) => {
    return (
        <Suspense>
            <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="kani-theme">
                <HeroUIProvider>
                    <SwrProvider>
                        <Navbar />
                        {children}
                        <ToastProvider />
                    </SwrProvider>
                </HeroUIProvider>
            </NextThemesProvider>
        </Suspense>
    )
}