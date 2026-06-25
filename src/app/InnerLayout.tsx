"use client"
import {
    HeroUIProvider,
    NextThemesProvider,
    SwrProvider,
} from "@/components/providers"
import { DrawerContainer } from "@/components/drawers"
import { AmbientBackground } from "@/components/blocks"
import { Navbar } from "@/components/features/navbar/Navbar"
import { Footer } from "@/components/features/footer/Footer"
import { ToastProvider } from "@heroui/react"
import React, { PropsWithChildren, Suspense } from "react"
import { SocketIoSideEffects } from "@/hooks/socketio"
import { SwrSideEffects } from "@/hooks/swr"
import { ReduxProvider } from "@/redux"
import { ModalContainer } from "@/components/modals"
import { UseEffects } from "@/hooks"
import { usePathname } from "next/navigation"

export const InnerLayout = ({ children }: PropsWithChildren) => {
    // Suppress the drifting ember background on Learn routes — it competes with
    // long-form reading. Keep it on marketing / dashboard / the rest of the app.
    const pathname = usePathname()
    const isLearnRoute = pathname?.includes("/learn") ?? false
    // Hide the footer on the long-form reader shell and the auth flows; show it
    // on marketing / dashboard / the rest of the app.
    const isAuthRoute = pathname?.includes("/authentication") ?? false
    const showFooter = !isLearnRoute && !isAuthRoute
    return (
        <Suspense>
            <NextThemesProvider 
                attribute="class" 
                defaultTheme="dark" 
                enableSystem={true} 
                storageKey="starci-academy-theme"
            >
                <HeroUIProvider>
                    <ReduxProvider>
                        <SwrProvider>
                            <SwrSideEffects />
                            <SocketIoSideEffects />
                            <UseEffects />
                            {!isLearnRoute ? <AmbientBackground /> : null}
                            <Navbar />
                            <ModalContainer />
                            <DrawerContainer />
                            {children}
                            {showFooter ? <Footer /> : null}
                            <ToastProvider />
                        </SwrProvider>
                    </ReduxProvider>
                </HeroUIProvider>
            </NextThemesProvider>
        </Suspense>
    )
}