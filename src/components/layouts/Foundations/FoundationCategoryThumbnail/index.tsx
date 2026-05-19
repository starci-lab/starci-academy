"use client"

import { cn } from "@heroui/react"
import { StackIcon } from "@phosphor-icons/react"
import React from "react"

export interface FoundationCategoryThumbnailProps {
    /** Public thumbnail URL from API; when missing shows fallback icon. */
    thumbnailUrl?: string | null
    /** Category title for accessible image alt text. */
    title: string
}

/** Bottom fade so the logo blends into the card body (matches category card mockup). */
const thumbnailMaskClass = cn(
    "[mask-image:linear-gradient(to_bottom,black_42%,transparent_86%)]",
    "[mask-size:100%_100%]",
    "[mask-repeat:no-repeat]",
    "[-webkit-mask-image:linear-gradient(to_bottom,black_42%,transparent_86%)]",
)

/**
 * Category card thumbnail: logo anchored left (aligns with card text), fade at bottom.
 * @param props.thumbnailUrl - Full URL to SVG/PNG asset.
 * @param props.title - Category title used for accessible alt text.
 */
export const FoundationCategoryThumbnail = ({
    thumbnailUrl,
    title,
}: FoundationCategoryThumbnailProps) => {
    return (
        <div className="relative h-52 w-full shrink-0 overflow-hidden bg-accent/10">
            {thumbnailUrl ? (
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className={cn(
                        "absolute -bottom-6 left-4 block",
                        "h-[11.75rem] w-auto max-w-[calc(100%-2rem)]",
                        "origin-bottom-left object-contain object-left-bottom",
                        thumbnailMaskClass,
                    )}
                />
            ) : (
                <div className="absolute inset-x-0 bottom-6 flex justify-start pl-4">
                    <StackIcon
                        className={cn(
                            "text-accent/60 size-14",
                            thumbnailMaskClass,
                        )}
                        weight="duotone"
                        aria-hidden
                    />
                </div>
            )}
        </div>
    )
}
