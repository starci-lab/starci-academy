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
    // Footer hiện ở LANDING — cả locale root ("/", "/vi", "/en") LẪN /home ("/home",
    // "/vi/home"): /home là bản ungated của CÙNG trang landing (user đã login xem ở đây).
    // Mọi trang khác (dashboard / learn / profile / auth / …) KHÔNG có footer — thầy chốt 2026-06-26.
    const footerPath = pathname ?? ""
    const showFooter = /^\/(?:[a-z]{2})?\/?$/.test(footerPath) || /^\/(?:[a-z]{2}\/)?home\/?$/.test(footerPath)
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