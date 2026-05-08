"use client"

import {
    LessonVideoType,
    VideoHostPlatform,
    VideoRendererType,
    type WithClassNames,
} from "@/modules/types"
import { cn } from "@heroui/react"
import React, { useMemo } from "react"
import { StandardPlayer } from "./Standard"
import { MpegDashPlayer } from "./MpegDash"
import { YoutubePlayer } from "./Youtube"

// ---------------------------------------------------------------------------
// Resolve which sub-player to use
// ---------------------------------------------------------------------------

const resolveRendererType = (
    videoType?: LessonVideoType,
    hostPlatform?: VideoHostPlatform,
): VideoRendererType => {
    if (videoType === LessonVideoType.MpegDash) return VideoRendererType.MpegDash
    if (hostPlatform === VideoHostPlatform.Youtube) return VideoRendererType.Youtube
    return VideoRendererType.Standard
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface VideoRendererProps
    extends WithClassNames<{
        content: string
        base: string
    }> {
    url: string
    hostPlatform?: VideoHostPlatform
    /** Video delivery format — Standard (mp4) or MpegDash. Defaults to Standard. */
    videoType?: LessonVideoType
    /** Explicit renderer type override. Takes precedence over auto-resolve. */
    rendererType?: VideoRendererType
    title?: string
}

/**
 * Universal video renderer — picks 1 of 3 sub-players based on type:
 *
 * | Type       | Player          | Controls          |
 * |------------|-----------------|-------------------|
 * | Standard   | `<video>`       | Custom HeroUI     |
 * | MpegDash   | dashjs          | Custom + Quality  |
 * | Youtube    | iframe          | YouTube built-in  |
 */
export const VideoRenderer = ({
    url,
    hostPlatform,
    videoType,
    rendererType,
    title,
    classNames,
    className,
}: VideoRendererProps) => {
    const type =
        rendererType ?? resolveRendererType(videoType, hostPlatform)

    const renderContent = () => {
        if (!url?.trim()) {
            return (
                <div className="text-foreground-500 flex min-h-[12rem] items-center justify-center rounded-medium border border-dashed p-4 text-center text-sm">
                    No video URL.
                </div>
            )
        }

        switch (type) {
        case VideoRendererType.MpegDash:
            return (
                <MpegDashPlayer
                    src={url}
                    className={classNames?.content}
                />
            )
        case VideoRendererType.Youtube:
            return (
                <YoutubePlayer
                    url={url}
                    title={title}
                    className={classNames?.content}
                />
            )
        case VideoRendererType.Standard:
        default:
            return (
                <StandardPlayer
                    src={url}
                    className={classNames?.content}
                />
            )
        }
    }

    const content = useMemo(
        () => renderContent(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [url, type, title, classNames?.content],
    )

    return (
        <div
            className={cn(
                classNames?.base,
                className,
                "w-full aspect-video rounded-large overflow-hidden",
            )}
        >
            {content}
        </div>
    )
}
