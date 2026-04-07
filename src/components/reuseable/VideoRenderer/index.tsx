"use client"

import { VideoHostPlatform, WithClassNames } from "@/modules/types"
import { cn } from "@heroui/react"
import React, { useMemo } from "react"

// --- URL helpers (iframe `src` / direct file) --------------------------------

const toYoutubeEmbedUrl = (raw: string): string | null => {
    const trimmed = raw.trim()
    if (!trimmed) {
        return null
    }
    try {
        const u = new URL(trimmed)
        const host = u.hostname.replace(/^www\./, "")
        if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            const v = u.searchParams.get("v")
            if (v) {
                return `https://www.youtube.com/embed/${v}`
            }
            const parts = u.pathname.split("/").filter(Boolean)
            if (parts[0] === "embed" && parts[1]) {
                return `https://www.youtube.com/embed/${parts[1]}`
            }
            if (parts[0] === "shorts" && parts[1]) {
                return `https://www.youtube.com/embed/${parts[1]}`
            }
            if (parts[0] === "live" && parts[1]) {
                return `https://www.youtube.com/embed/${parts[1]}`
            }
        }
        if (host === "youtu.be") {
            const id = u.pathname.split("/").filter(Boolean)[0]
            if (id) {
                return `https://www.youtube.com/embed/${id}`
            }
        }
    } catch {
        return null
    }
    return null
}

const toVimeoEmbedUrl = (raw: string): string | null => {
    const trimmed = raw.trim()
    if (!trimmed) {
        return null
    }
    try {
        const u = new URL(trimmed)
        const host = u.hostname.replace(/^www\./, "")
        if (host === "vimeo.com") {
            const parts = u.pathname.split("/").filter(Boolean)
            const id = parts.find((p) => /^\d+$/.test(p))
            if (id) {
                return `https://player.vimeo.com/video/${id}`
            }
        }
        if (host === "player.vimeo.com") {
            return trimmed
        }
    } catch {
        return null
    }
    return null
}

const toGoogleDrivePreviewUrl = (raw: string): string | null => {
    const trimmed = raw.trim()
    if (!trimmed) {
        return null
    }
    try {
        const u = new URL(trimmed)
        const host = u.hostname.replace(/^www\./, "")
        if (host !== "drive.google.com") {
            return null
        }
        const fromPath = u.pathname.match(/\/file\/d\/([^/]+)/)
        if (fromPath?.[1]) {
            return `https://drive.google.com/file/d/${fromPath[1]}/preview`
        }
        const id = u.searchParams.get("id")
        if (id) {
            return `https://drive.google.com/file/d/${id}/preview`
        }
    } catch {
        return null
    }
    return null
}

const toCloudflareStreamEmbedUrl = (raw: string): string | null => {
    const trimmed = raw.trim()
    if (!trimmed) {
        return null
    }
    try {
        const u = new URL(trimmed)
        const host = u.hostname.toLowerCase()
        if (host.includes("cloudflarestream.com")) {
            if (u.pathname.includes("/iframe")) {
                return trimmed
            }
            const uid = u.pathname.split("/").filter(Boolean)[0]
            if (uid && /^[a-f0-9]{32}$/i.test(uid)) {
                return `${u.origin}/${uid}/iframe`
            }
        }
        if (host === "iframe.videodelivery.net" || host === "videodelivery.net") {
            const token = u.pathname.split("/").filter(Boolean)[0]
            if (token) {
                return `https://iframe.videodelivery.net/${token}`
            }
        }
    } catch {
        return null
    }
    return null
}

const isDirectVideoUrl = (raw: string): boolean => {
    const trimmed = raw.trim().toLowerCase()
    try {
        const path = new URL(trimmed).pathname
        return /\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(path)
    } catch {
        return /\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)
    }
}

const invalidBox = (message: string) => (
    <div className="text-foreground-500 flex min-h-[12rem] items-center justify-center rounded-medium border border-dashed border-divider p-4 text-center text-sm">
        {message}
    </div>
)

// --- Internal players --------------------------------------------------------

const YoutubePlayer = ({
    url,
    title = "YouTube video",
    className,
}: {
    url: string
    title?: string
    className?: string
}) => {
    const src = useMemo(() => toYoutubeEmbedUrl(url), [url])
    if (!src) {
        return invalidBox("Invalid or unsupported YouTube URL.")
    }
    return (
        <iframe
            title={title}
            className={className}
            src={src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        />
    )
}

const VimeoPlayer = ({
    url,
    title = "Vimeo video",
    className,
}: {
    url: string
    title?: string
    className?: string
}) => {
    const src = useMemo(() => toVimeoEmbedUrl(url), [url])
    if (!src) {
        return invalidBox("Invalid or unsupported Vimeo URL.")
    }
    return (
        <iframe
            title={title}
            className={className}
            src={src}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
        />
    )
}

const GoogleDrivePlayer = ({
    url,
    title = "Google Drive video",
    className,
}: {
    url: string
    title?: string
    className?: string
}) => {
    const src = useMemo(() => toGoogleDrivePreviewUrl(url), [url])
    if (!src) {
        return invalidBox(
            "Could not build a Drive preview link. Use a standard file link (`/file/d/.../view` or `?id=`).",
        )
    }
    return (
        <iframe
            title={title}
            className={className}
            src={src}
            allow="autoplay; fullscreen"
            allowFullScreen
        />
    )
}

const CloudflareStreamPlayer = ({
    url,
    title = "Streamed video",
    className,
}: {
    url: string
    title?: string
    className?: string
}) => {
    const src = useMemo(() => toCloudflareStreamEmbedUrl(url), [url])
    if (!src) {
        return invalidBox(
            "Invalid Cloudflare Stream URL. Use a stream iframe URL or customer stream link with a video id.",
        )
    }
    return (
        <iframe
            title={title}
            className={className}
            src={src}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
        />
    )
}

const OtherPlayer = ({
    url,
    title = "Video",
    className,
}: {
    url: string
    title?: string
    className?: string
}) => {
    const strategy = useMemo(() => {
        if (isDirectVideoUrl(url)) {
            return { kind: "video" as const, src: url.trim() }
        }
        const y = toYoutubeEmbedUrl(url)
        if (y) {
            return { kind: "iframe" as const, src: y }
        }
        const v = toVimeoEmbedUrl(url)
        if (v) {
            return { kind: "iframe" as const, src: v }
        }
        const d = toGoogleDrivePreviewUrl(url)
        if (d) {
            return { kind: "iframe" as const, src: d }
        }
        const c = toCloudflareStreamEmbedUrl(url)
        if (c) {
            return { kind: "iframe" as const, src: c }
        }
        return { kind: "iframe" as const, src: url.trim() }
    }, [url])

    if (strategy.kind === "video") {
        return (
            <video
                className={className}
                controls
                playsInline
                src={strategy.src}
            />
        )
    }

    return (
        <iframe
            title={title}
            className={className}
            src={strategy.src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
        />
    )
}

// --- Public API --------------------------------------------------------------

export interface VideoRendererProps extends WithClassNames<
    {
        content: string
        base: string
    }
> {
    url: string
    hostPlatform: VideoHostPlatform
    title?: string
}

/**
 * Picks an embed strategy from {@link VideoHostPlatform}: YouTube / Vimeo / Drive / Cloudflare Stream / fallback.
 */
export const VideoRenderer = (
    {
        url,
        hostPlatform,
        title,
        classNames,
        className
    }: VideoRendererProps) => {
    const renderContent = () => {
        if (!url?.trim()) {
            return invalidBox("No video URL.")
        }
        switch (hostPlatform) {
        case VideoHostPlatform.Youtube:
            return <YoutubePlayer className={cn(classNames?.content, "w-full aspect-video")} title={title} url={url} />
        case VideoHostPlatform.Vimeo:
            return <VimeoPlayer className={cn(classNames?.content, "w-full aspect-video")} title={title} url={url} />
        case VideoHostPlatform.GoogleDrive:
            return <GoogleDrivePlayer className={cn(classNames?.content, "w-full aspect-video")} title={title} url={url} />
        case VideoHostPlatform.CloudflareStream:
            return <CloudflareStreamPlayer className={cn(classNames?.content, "w-full aspect-video")} title={title} url={url} />
        case VideoHostPlatform.Other:
        default:
            return <OtherPlayer className={classNames?.content} title={title} url={url} />
        }
    }
    const content = useMemo(
        () => renderContent(), [
            url, 
            hostPlatform, 
            title, 
            classNames?.content
        ]
    )
    return <div className={
        cn(
            classNames?.base, 
            className, 
            "w-full aspect-video rounded-large overflow-hidden")
    }>
        {content}
    </div>
}
