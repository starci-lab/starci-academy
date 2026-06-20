"use client"

import React from "react"
import {
    Drawer,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useContentAiChatOverlayState } from "@/hooks"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { ContentAiChat } from "@/components/features/learn/ContentAiChat"

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
    const contentTitle = useAppSelector((state) => state.content.entity?.title)

    return (
        <Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className="p-0 sm:max-w-md">
                        <div className="p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    {contentTitle ?? t("contentAi.title")}
                                </Drawer.Heading>
                            </Drawer.Header>
                        </div>
                        <div className="border-b" />
                        <Drawer.Body className="p-3">
                            <ContentAiChat />
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
