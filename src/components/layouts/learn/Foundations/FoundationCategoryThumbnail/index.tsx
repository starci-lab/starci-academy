"use client"

import { Layers as StackIcon } from "@gravity-ui/icons"

import React from "react"


export interface FoundationCategoryThumbnailProps {
    /** Public thumbnail URL from API; when missing shows fallback icon. */
    thumbnailUrl?: string | null
    /** Category title for accessible image alt text. */
    title: string
}

/**
 * Category card thumbnail: full-bleed 16:9 brand banner.
 *
 * The synced assets are complete 16:9 artworks (logo + label on a dark grid
 * backdrop), so the image fills the whole thumbnail box with `object-cover`.
 * When no thumbnail is set, a centered fallback icon is shown instead.
 *
 * @param props.thumbnailUrl - Full URL to the 16:9 banner asset.
 * @param props.title - Category title used for accessible alt text.
 */
export const FoundationCategoryThumbnail = ({
    thumbnailUrl,
    title,
}: FoundationCategoryThumbnailProps) => {
    return (
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-accent/10">
            {thumbnailUrl ? (
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="absolute inset-0 block h-full w-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <StackIcon className="text-accent/60 size-14" aria-hidden />
                </div>
            )}
        </div>
    )
}
