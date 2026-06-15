"use client"
import {
    HeroUIProvider,
    NextThemesProvider,
    SwrProvider,
} from "@/components/providers"
import { DrawerContainer } from "@/components/drawers"
import { Navbar } from "@/components/layouts/shell/Navbar"
import { ToastProvider } from "@heroui/react"
import React, { PropsWithChildren, Suspense } from "react"
import { SocketIoSideEffects } from "@/hooks/socketio"
import { SwrSideEffects } from "@/hooks/swr"
import { ReduxProvider } from "@/redux"
import { ModalContainer } from "@/components/modals"
import { UseEffects } from "@/hooks"

export const InnerLayout = ({ children }: PropsWithChildren) => {
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
                            <Navbar />
                            <ModalContainer />
                            <DrawerContainer />
                            {children}
                            <ToastProvider />
                        </SwrProvider>
                    </ReduxProvider>
                </HeroUIProvider>
            </NextThemesProvider>
        </Suspense>
    )
}