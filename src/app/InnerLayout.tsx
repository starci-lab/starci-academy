"use client"
import {
    HeroUIProvider,
    NextThemesProvider,
    SwrProvider,
} from "@/components"
import { ToastProvider } from "@heroui/react"
import { Navbar } from "@/components"
import React, { PropsWithChildren, Suspense } from "react"
import { SingletonHookProvider } from "@/hooks/singleton"
import { ReduxProvider } from "@/redux"
import { UseEffects } from "@/hooks"

export const InnerLayout = ({ children }: PropsWithChildren) => {
    return (
        <Suspense>
            <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="kani-theme">
                <HeroUIProvider>
                    <ReduxProvider>
                        <SwrProvider>
                            <SingletonHookProvider>
                                <UseEffects />
                                <Navbar />
                                {children}
                            </SingletonHookProvider>
                            <ToastProvider />
                        </SwrProvider>
                    </ReduxProvider>
                </HeroUIProvider>
            </NextThemesProvider>
        </Suspense>
    )
}