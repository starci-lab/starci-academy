"use client"

import {
    ChevronsCollapseUpRight as ExitFullscreenIcon,
    ChevronsExpandUpRight as EnterFullscreenIcon,
    MagnifierMinus as ZoomOutIcon,
    MagnifierPlus as ZoomInIcon,
} from "@gravity-ui/icons"
import React, { type RefObject, useCallback, useEffect, useState } from "react"
import { Button } from "@heroui/react"
import { useTranslations } from "next-intl"
import { Panel, useReactFlow } from "@xyflow/react"

/** Props for {@link MindMapFullscreenButton}. */
export interface MindMapFullscreenButtonProps {
    /** The element to toggle into fullscreen (the mind-map canvas container). */
    targetRef: RefObject<HTMLElement | null>
}

/**
 * Floating zoom + fullscreen controls for the mind-map canvas.
 *
 * Sits bottom-right (where the Next.js dev badge sits): zoom in/out via React Flow and
 * toggles the browser Fullscreen API on the canvas container — no auth needed.
 * The fullscreen button icon switches between expand / collapse based on active fullscreen state.
 *
 * Must render as a child of {@link ReactFlow} so {@link useReactFlow} is available.
 *
 * @param props.targetRef - ref to the canvas container element.
 */
export const MindMapFullscreenButton = ({ targetRef }: MindMapFullscreenButtonProps) => {
    const t = useTranslations()
    const { zoomIn, zoomOut } = useReactFlow()
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === targetRef.current)
        }

        document.addEventListener("fullscreenchange", onFullscreenChange)
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
    }, [targetRef])

    const onPressZoomIn = useCallback(() => {
        void zoomIn({ duration: 200 })
    }, [zoomIn])

    const onPressZoomOut = useCallback(() => {
        void zoomOut({ duration: 200 })
    }, [zoomOut])

    const onPressFullscreen = useCallback(() => {
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

    const fullscreenLabel = isFullscreen
        ? t("mindMap.exitFullscreen")
        : t("mindMap.fullscreen")

    return (
        <Panel className="!m-4 flex flex-col gap-1.5" position="bottom-right">
            <Button
                isIconOnly
                variant="secondary"
                aria-label={t("mindMap.zoomIn")}
                onPress={onPressZoomIn}
                className="rounded-full shadow-lg"
            >
                <ZoomInIcon className="size-5" />
            </Button>
            <Button
                isIconOnly
                variant="secondary"
                aria-label={t("mindMap.zoomOut")}
                onPress={onPressZoomOut}
                className="rounded-full shadow-lg"
            >
                <ZoomOutIcon className="size-5" />
            </Button>
            <Button
                isIconOnly
                variant="secondary"
                aria-label={fullscreenLabel}
                onPress={onPressFullscreen}
                className="rounded-full shadow-lg"
            >
                {isFullscreen ? (
                    <ExitFullscreenIcon className="size-5" />
                ) : (
                    <EnterFullscreenIcon className="size-5" />
                )}
            </Button>
        </Panel>
    )
}
