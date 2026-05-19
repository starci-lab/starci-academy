"use client"

import { cn } from "@heroui/react"
import { StackIcon } from "@phosphor-icons/react"
import React, { useMemo } from "react"

export interface FoundationItemThumbnailProps {
    /** Foundation-specific cover image URL (full-bleed when set). */
    thumbnailUrl?: string | null
    /** Accessible label for the image (usually foundation title). */
    title: string
    /** Visual size preset for list vs detail layouts. */
    size?: "card" | "detail"
}

/**
 * 16:9 media area: foundation thumbnail as full cover, or centered icon when missing.
 * @param props.thumbnailUrl - Per-foundation cover from API only (no category logo fallback).
 * @param props.title - Alt text for the image.
 * @param props.size - `card` for grid cards, `detail` for the item page header.
 */
export const FoundationItemThumbnail = ({
    thumbnailUrl,
    title,
    size = "card",
}: FoundationItemThumbnailProps) => {
    const resolvedThumbnailUrl = useMemo(
        () => thumbnailUrl?.trim() || undefined,
        [thumbnailUrl],
    )

    return (
        <div
            className={cn(
                "relative aspect-video w-full shrink-0 overflow-hidden bg-accent/10",
                size === "detail" && "max-h-72",
            )}
        >
            {resolvedThumbnailUrl ? (
                <img
                    src={resolvedThumbnailUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <StackIcon
                        className="text-accent/60 size-14"
                        weight="duotone"
                        aria-hidden
                    />
                </div>
            )}
        </div>
    )
}
