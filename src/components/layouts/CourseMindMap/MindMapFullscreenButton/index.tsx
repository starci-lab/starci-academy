"use client"

import { ArrowsOppositeToDots as ExpandIcon } from "@gravity-ui/icons"
import React, { type RefObject, useCallback } from "react"
import { Button } from "@heroui/react"
import { useTranslations } from "next-intl"

/** Props for {@link MindMapFullscreenButton}. */
export interface MindMapFullscreenButtonProps {
    /** The element to toggle into fullscreen (the mind-map canvas container). */
    targetRef: RefObject<HTMLElement | null>
}

/**
 * Floating "view fullscreen" button for the mind-map canvas.
 *
 * Sits bottom-right (where the Next.js dev badge sits) and toggles the browser Fullscreen API on
 * the canvas container, so a guest can blow the map up to full screen — no auth needed.
 *
 * @param props.targetRef - ref to the canvas container element.
 */
export const MindMapFullscreenButton = ({ targetRef }: MindMapFullscreenButtonProps) => {
    const t = useTranslations()

    const onPress = useCallback(() => {
        const element = targetRef.current
        if (!element) {
            return
        }
        // toggle: exit if already fullscreen, otherwise request it on the canvas container
        if (document.fullscreenElement) {
            void document.exitFullscreen()
            return
        }
        void element.requestFullscreen?.()
    }, [targetRef])

    return (
        <Button
            isIconOnly
            variant="secondary"
            aria-label={t("mindMap.fullscreen")}
            onPress={onPress}
            className="absolute bottom-4 right-4 z-10 rounded-full shadow-lg"
        >
            <ExpandIcon className="size-5" />
        </Button>
    )
}
