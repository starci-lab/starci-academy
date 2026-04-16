"use client"
import {
    DrawerContainer,
    HeroUIProvider,
    Navbar,
    NextThemesProvider,
    SwrProvider,
    // Navbar,
} from "../components"
import { ToastProvider } from "@heroui/react"
import React, { PropsWithChildren, Suspense } from "react"
import { SingletonHookProvider } from "@/hooks/singleton"
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
                            <SingletonHookProvider>
                                <UseEffects />
                                <Navbar />
                                <ModalContainer />
                                <DrawerContainer />
                                {/*
                                <Navbar />  
                                 */}
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