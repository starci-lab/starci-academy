"use client"

import { ArrowUpRightFromSquare as ArrowSquareOutIcon } from "@gravity-ui/icons"
import { Button, cn } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { VideoRenderer } from "@/components/reuseable"
import type { FoundationEntity, WithClassNames } from "@/modules/types"
import { FoundationKind, VideoHostPlatform } from "@/modules/types"

import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import { resolveFoundationMountFileUrl } from "../../utils"


export interface FoundationCardBodyProps extends WithClassNames<undefined> {
    /** Foundation entity to render. */
    foundation: FoundationEntity
}

/**
 * Renders foundation content by kind: markdown, video, or external link.
 * @param props.foundation - Foundation row from API.
 */
export const FoundationCardBody = ({
    foundation,
    className,
}: FoundationCardBodyProps) => {
    const t = useTranslations()

    const externalUrl = useMemo(() => {
        if (!foundation.value?.trim()) {
            return undefined
        }
        return resolveFoundationMountFileUrl(foundation.value)
    }, [foundation.value])

    if (foundation.kind === FoundationKind.Document && foundation.value) {
        return (
            <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
                <MarkdownContent markdown={foundation.value} />
            </div>
        )
    }

    if (foundation.kind === FoundationKind.Video && foundation.value) {
        const isYoutube = /youtube\.com|youtu\.be/i.test(foundation.value)
        // resolve mount-relative values to a full URL (full URLs pass through);
        // VideoRenderer then auto-picks the player from the URL (.mpd → DASH,
        // mp4/webm → Standard, YouTube → embed)
        const videoUrl = resolveFoundationMountFileUrl(foundation.value)
        return (
            <VideoRenderer
                classNames={{
                    base: cn("w-full overflow-hidden rounded-lg", className),
                    content: "w-full",
                }}
                url={videoUrl}
                hostPlatform={isYoutube ? VideoHostPlatform.Youtube : undefined}
                title={foundation.title}
            />
        )
    }

    if (foundation.kind === FoundationKind.ExternalLink && externalUrl) {
        return (
            <Button
                onPress={
                    () => {
                        window.open(externalUrl, "_blank", "noopener,noreferrer")
                    }
                }
                variant="secondary"
                size="sm"
                className={cn("w-full", className)}
            >
                <ArrowSquareOutIcon className="size-5" />
                {t("foundations.openLink")} <span className="sr-only">{externalUrl}</span>
            </Button>
        )
    }

    return null
}
