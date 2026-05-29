import React from "react"
import { PlayIcon, BroadcastIcon } from "@phosphor-icons/react"
import { VideoRendererType } from "@/modules/types"
import type { RendererTypeOption } from "./types"

/**
 * Selector option metadata keyed by renderer type.
 * Drives the type-picker buttons and the preview label.
 */
export const RENDERER_TYPE_OPTION_MAP: Record<VideoRendererType, RendererTypeOption> = {
    [VideoRendererType.MpegDash]: {
        type: VideoRendererType.MpegDash,
        label: "MPEG-DASH",
        description: "dashjs adaptive streaming (.mpd)",
        color: "from-emerald-600 to-teal-600",
        icon: <BroadcastIcon className="h-4 w-4" />,
    },
    [VideoRendererType.Standard]: {
        type: VideoRendererType.Standard,
        label: "Standard",
        description: "Native <video> (mp4, webm)",
        color: "from-indigo-600 to-purple-600",
        icon: <PlayIcon className="h-4 w-4" />,
    },
    [VideoRendererType.Youtube]: {
        type: VideoRendererType.Youtube,
        label: "YouTube",
        description: "Iframe embed",
        color: "from-red-600 to-rose-600",
        icon: <PlayIcon className="h-4 w-4" />,
    },
}

/**
 * Ordered renderer-type options for the selector.
 * Order matches the original layout: MPEG-DASH, Standard, YouTube.
 */
export const RENDERER_TYPE_OPTIONS: Array<RendererTypeOption> = [
    RENDERER_TYPE_OPTION_MAP[VideoRendererType.MpegDash],
    RENDERER_TYPE_OPTION_MAP[VideoRendererType.Standard],
    RENDERER_TYPE_OPTION_MAP[VideoRendererType.Youtube],
]
