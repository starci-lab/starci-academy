"use client"

import { ArrowUpRightFromSquare as ArrowSquareOutIcon } from "@gravity-ui/icons"
import { Button } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { VideoRenderer } from "@/components/reuseable"
import type { FoundationEntity } from "@/modules/types"
import { FoundationKind, LessonVideoType, VideoHostPlatform } from "@/modules/types"

import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import { resolveFoundationMountFileUrl } from "../utils"


export interface FoundationCardBodyProps {
    /** Foundation entity to render. */
    foundation: FoundationEntity
}

/**
 * Renders foundation content by kind: markdown, video, or external link.
 * @param props.foundation - Foundation row from API.
 */
export const FoundationCardBody = ({
    foundation,
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
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <MarkdownContent markdown={foundation.value} />
            </div>
        )
    }

    if (foundation.kind === FoundationKind.Video && foundation.value) {
        const isYoutube = /youtube\.com|youtu\.be/i.test(foundation.value)
        return (
            <VideoRenderer
                classNames={{
                    base: "w-full overflow-hidden rounded-lg",
                    content: "w-full",
                }}
                url={foundation.value}
                hostPlatform={isYoutube ? VideoHostPlatform.Youtube : undefined}
                videoType={isYoutube ? undefined : LessonVideoType.MpegDash}
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
                className="w-full"
            >
                <ArrowSquareOutIcon className="size-4" />
                {t("foundations.openLink")} <span className="sr-only">{externalUrl}</span>
            </Button>
        )
    }

    return null
}
