"use client"

import React from "react"
import {
    Drawer,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { ContentAiChat } from "@/components/features/learn/ContentAiChat"
import { ContentAiChatModeSwitch } from "@/components/features/learn/ContentAiChat/ContentAiChatModeSwitch"
import { useAppSelector } from "@/redux/hooks"
import { useContentAiChatOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useContentAiChatModeStore } from "@/hooks/zustand/contentAiChatMode/store"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"

/**
 * Global "ask StarCi AI" chat drawer — the PANEL half of the content-AI feature
 * (the trigger is {@link import("@/components/features/learn/OnThisPage/ContentAiCopilot").ContentAiCopilot}
 * in the lesson right rail). Open-state lives in the shared overlay store
 * (`contentAiChat` key); the thread + composer are rendered by {@link ContentAiChat},
 * which reads the active content from redux. Mounted once by
 * {@link import("./../DrawerContainer").DrawerContainer}.
 */
export const ContentAiChatDrawer = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useContentAiChatOverlayState()
    const { isMobile } = useSmViewpoint()
    const { mode } = useContentAiChatModeStore()
    const contentTitle = useAppSelector((state) => state.content.entity?.title)
    // no lesson open (flashcards / mind-map / leaderboard) → name the COURSE instead,
    // so the drawer header still says what this conversation belongs to
    const courseTitle = useAppSelector((state) => state.course.entity?.title)

    // The drawer renders when the presentation mode resolves to "drawer": a phone
    // is always forced to it, and desktop may pick it. The other desktop modes
    // (popover / dock) are rendered by {@link import("@/components/features/learn/ContentAiFab").ContentAiFab}.
    const effectiveMode = isMobile ? "drawer" : mode
    if (effectiveMode !== "drawer") {
        return null
    }

    return (
        <Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
                {/* desktop = slide-in from the RIGHT (like every other side drawer, e.g.
                    MiniCart); a phone gets the bottom sheet (a right drawer is too narrow). */}
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className="p-0 sm:max-w-md">
                        <div className="p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading className="flex items-center gap-2">
                                    <span className="min-w-0 flex-1">
                                        {contentTitle
                                            ? (
                                                <MarkdownContent
                                                    markdown={contentTitle}
                                                    className="[&_p]:m-0 [&_p]:inline"
                                                />
                                            )
                                            : courseTitle ?? t("contentAi.title")}
                                    </span>
                                    {/* desktop drawer-mode can switch back to popover / dock; a
                                        phone is forced to the drawer, so hide the switch there. */}
                                    {!isMobile ? <ContentAiChatModeSwitch /> : null}
                                </Drawer.Heading>
                            </Drawer.Header>
                        </div>
                        <Drawer.Body className="p-3">
                            <ContentAiChat />
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
