import React, { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful local copy of
 * `@/components/blocks/identity/IconTile`, inlined here because ReadinessChecklist
 * depends on it and no local port exists elsewhere yet.
 * TODO: swap for the IconTile local when it is ported under `.storybook/stories`.
 */

/** Visual tone of the tile (drives the tinted background + icon colour). */
export type IconTileTone = "accent" | "success" | "warning" | "danger" | "neutral"

/** Size of the tile. */
export type IconTileSize = "sm" | "md" | "lg"

/** Props for the {@link IconTile} block. */
export interface IconTileProps {
    /** The icon (phosphor `*Icon`) — fallback when no {@link IconTileProps.src}. */
    icon: ReactNode
    /**
     * Optional cover image. When set, it FILLS the tile (`object-cover`, centered)
     * instead of the icon; falls back to {@link IconTileProps.icon} when absent/empty.
     */
    src?: string | null
    /** Alt text for the cover image (decorative tile — usually the entity title). */
    alt?: string
    /** Tinted background + icon colour. Defaults to "accent". */
    tone?: IconTileTone
    /** Tile size. Defaults to "md" (64px). */
    size?: IconTileSize
    /** Extra classes on the tile. */
    className?: string
}

/** tone → tinted background + icon colour. */
const TONE: Record<IconTileTone, string> = {
    accent: "bg-accent-soft text-accent-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    danger: "bg-danger-soft text-danger-soft-foreground",
    neutral: "bg-default text-muted",
}

/** size → tile box + auto icon size + radius. */
const SIZE: Record<IconTileSize, string> = {
    sm: "size-12 rounded-xl [&_svg]:size-6",
    md: "size-16 rounded-2xl [&_svg]:size-8",
    lg: "size-20 rounded-2xl [&_svg]:size-10",
}

/**
 * A framed icon tile — a soft tinted square with the icon centered inside. The
 * icon auto-sizes and inherits the tone colour; pass it bare.
 *
 * @param props - {@link IconTileProps}
 */
export const IconTile = ({
    icon,
    src,
    alt = "",
    tone = "accent",
    size = "md",
    className,
}: IconTileProps) => {
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])
    const showImage = Boolean(src) && !failed

    return (
        <div
            aria-hidden
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden",
                SIZE[size],
                showImage ? null : TONE[tone],
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src ?? undefined}
                    alt={alt}
                    className="size-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : (
                icon
            )}
        </div>
    )
}
