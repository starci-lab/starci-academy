"use client"
import { Navbar } from "@/components/features/navbar/Navbar"
import { Footer } from "@/components/features/footer/Footer"
import { ToastProvider } from "@heroui/react"
import React, { PropsWithChildren, Suspense } from "react"
import { CookieConsentBanner } from "@/components/features/cookie-consent/CookieConsentBanner"
import { usePathname } from "next/navigation"
import { HeroUIProvider } from "@/components/providers/HeroUIProvider"
import { NextThemesProvider } from "@/components/providers/NextThemesProvider"
import { SwrProvider } from "@/components/providers/SwrProvider"
import { DrawerContainer } from "@/components/drawers/DrawerContainer"
import { AmbientBackgroundGate } from "@/components/blocks/layout/AmbientBackground/AmbientBackgroundGate"
import { TopLoader } from "@/components/blocks/layout/TopLoader"
import { AppSplash } from "@/components/blocks/layout/AppSplash"
import { SocketConnectionStatus } from "@/components/blocks/layout/SocketConnectionStatus"
import { SocketIoSideEffects } from "@/hooks/socketio/SocketIoSideEffects"
import { SwrSideEffects } from "@/hooks/swr/SwrSideEffects"
import { ReduxProvider } from "@/redux/ReduxProvider"
import { ModalContainer } from "@/components/modals/ModalContainer"
import { UseEffects } from "@/hooks/effects/UseEffects"
import { ContentAiChatRail } from "@/components/features/learn/ContentAiChat/ContentAiChatRail"
import { useContentAiChatOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useContentAiChatModeStore } from "@/hooks/zustand/contentAiChatMode/store"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"

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

    // The content-AI chat rail docks beside the WHOLE app, not beside the learn
    // content: it used to live in `LearnShell`'s right-rail slot, which kept the
    // navbar full-width and left the reading column to absorb the squeeze alone.
    // Hoisting it here makes the split honest — the app column owns its own navbar
    // and re-lays-out against ITS width (`@container` below), so a wide rail turns
    // the app compact instead of breaking it.
    const { isOpen: chatOpen } = useContentAiChatOverlayState()
    const { mode: chatMode } = useContentAiChatModeStore()
    // Still viewport-driven ON PURPOSE: this decides whether the panel exists as a
    // docked rail at all, and that is a question about the SCREEN. Once the rail is
    // mounted, everything inside the app column keys off the column instead.
    const { isMobile } = useSmViewpoint()
    // ASSESSMENT INTEGRITY: a live quiz / mock-interview grades an answer that feeds
    // job-readiness + recruiter signals, so a course-grounded chat open beside it is
    // a cheat channel (ask the AI, copy the answer, inflate the score). Suppress the
    // rail on those routes even if the learner left it open before navigating in.
    // Detected by URL shape (the dedicated resumable session routes), matching
    // `learn/layout.tsx`'s `isFlashcardQuizLive` / `isMockInterviewLive`.
    const isAssessmentLive = /\/learn\/(?:flashcards\/quiz|mock-interview\/interview)\/(?:sessions\/)?[^/]+/.test(pathname ?? "")
    const chatRailActive = chatOpen && chatMode === "rail" && !isMobile && !isAssessmentLive

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
                            <AppSplash />
                            <TopLoader />
                            {!isLearnRoute ? <AmbientBackgroundGate /> : null}
                            {/* The SPLIT. Left column = the entire app (its own navbar,
                                page, footer) marked `@container` so every `@app-*`
                                breakpoint inside measures THIS column. Right column =
                                the docked chat rail. `items-start` keeps the rail's
                                `sticky` free (a stretched flex child has no room to
                                stick), and the page keeps ONE scroll container, so the
                                navbar's `sticky top-0` and the learn rails' `top-16`
                                behave exactly as before. */}
                            <div className="flex w-full items-start">
                                <div className="@container min-w-0 flex-1">
                                    <Navbar />
                                    {children}
                                    {showFooter ? <Footer /> : null}
                                </div>
                                {chatRailActive ? <ContentAiChatRail /> : null}
                            </div>
                            {/* Overlays live OUTSIDE the split: they cover the screen,
                                so they size against the viewport, not the app column. */}
                            <SocketConnectionStatus />
                            <ModalContainer />
                            <DrawerContainer />
                            <CookieConsentBanner />
                            <ToastProvider />
                        </SwrProvider>
                    </ReduxProvider>
                </HeroUIProvider>
            </NextThemesProvider>
        </Suspense>
    )
}