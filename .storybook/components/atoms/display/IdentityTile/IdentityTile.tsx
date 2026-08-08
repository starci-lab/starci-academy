"use client"

import React, { useEffect, useState } from "react"
import type { ComponentType, SVGProps } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"

/**
 * ATOM — `IdentityTile`: the squared identity frame of a thing (course, project,
 * section…). Ported from the legacy `blocks/identity/IconTile` visual contract.
 *
 * Distinct from circular `IconTile`. Size map (immutable):
 *   sm → 48px + rounded-xl
 *   md → 64px + rounded-2xl
 *   lg → 80px + rounded-2xl
 *
 * The icon takes a component (`icon={GraduationCapIcon}`), not JSX; the atom
 * forces its scale per `size`. No public className/classNames/width/height API.
 */

/** Visual tone of the tile (drives the tinted background + icon colour). */
export type IdentityTileTone = "accent" | "success" | "warning" | "danger" | "neutral"

/** Size of the tile. */
export type IdentityTileSize = "sm" | "md" | "lg"

/** Two weight steps for the glyph; only a glyph smaller than `size-5` needs `bold`. */
export type IconWeight = "regular" | "bold"

/**
 * Icon is passed in as a COMPONENT (e.g. `GraduationCapIcon`); the atom renders
 * it and forces its own scale at the tile's size.
 */
export type IdentityTileIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Shared props — EXCEPT the `icon`/`isSkeleton` pair, see {@link IdentityTileProps}. */
interface IdentityTileOwnProps {
    /**
     * Optional cover image. When set, it FILLS the tile (`object-cover`, centered —
     * a 16:9 source is cropped to the square frame) instead of the icon; falls back
     * to `icon` when absent/empty.
     */
    src?: string | null
    /** Alt text for the cover image (decorative tile — usually the entity title). */
    alt?: string
    /** Tinted background + icon colour. Defaults to "accent". */
    tone?: IdentityTileTone
    /** Tile size. Defaults to "md" (64px). */
    size?: IdentityTileSize
}

/**
 * `icon` is required when rendering the real tile, not needed when
 * `isSkeleton` (the shimmer box has no icon inside).
 */
export type IdentityTileProps = IdentityTileOwnProps &
    (
        | {
            /** `true` → renders a shimmer box at the exact tile size, in place of content. */
            isSkeleton: true
            /** The icon component — fallback when no {@link IdentityTileOwnProps.src}. */
            icon?: IdentityTileIcon
        }
        | {
            isSkeleton?: false
            /** The icon component — fallback when no {@link IdentityTileOwnProps.src}. */
            icon: IdentityTileIcon
        }
    )

/** tone → tinted background + icon colour. */
const TONE: Record<IdentityTileTone, string> = {
    accent: "bg-accent-soft text-accent-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    danger: "bg-danger-soft text-danger-soft-foreground",
    neutral: "bg-default text-muted",
}

/** size → tile box. */
const SIZE_BOX: Record<IdentityTileSize, string> = {
    sm: "size-12",
    md: "size-16",
    lg: "size-20",
}

/** size → corner rounding (identity chrome — not circular). */
const SIZE_RADIUS: Record<IdentityTileSize, string> = {
    sm: "rounded-xl",
    md: "rounded-2xl",
    lg: "rounded-2xl",
}

/**
 * size → the inner icon size. Matches the legacy block's `[&_svg]:size-*` steps
 * (sm 24 / md 32 / lg 40). All three are ≥ `size-5`, so no `weight` is passed.
 */
const SIZE_ICON: Record<IdentityTileSize, string> = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
}

/**
 * A framed identity tile — soft tinted square with the icon centered inside,
 * or a cover image filling the frame. Owns size, radius, tone, image fallback,
 * and skeleton geometry.
 *
 * @param props - {@link IdentityTileProps}
 */
const IdentityTileBase = ({
    icon: Icon,
    src,
    alt = "",
    tone = "accent",
    size = "md",
    isSkeleton = false,
}: IdentityTileProps) => {
    // a broken cover URL (404 / unsynced asset) falls back to the icon instead of a
    // broken-image glyph; reset when the src changes.
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])
    const showImage = Boolean(src) && !failed

    // The tile is a solid box (icon/image fills it), so the shimmer is the whole
    // box — exact {@link SIZE_BOX} + {@link SIZE_RADIUS}. Checked before any content
    // branch so real content never leaks through while loading.
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="IdentityTile"
                className={cn("shrink-0", SIZE_BOX[size], SIZE_RADIUS[size])}
            />
        )
    }

    return (
        <div
            aria-hidden
            data-tier="atom"
            data-component="IdentityTile"
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden",
                SIZE_BOX[size],
                SIZE_RADIUS[size],
                // skip the tint when a cover image fills the tile
                showImage ? null : TONE[tone],
            )}
        >
            {showImage ? (
                <img
                    src={src ?? undefined}
                    alt={alt}
                    className="size-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : Icon ? (
                <span aria-hidden className="inline-flex shrink-0">
                    <Icon className={SIZE_ICON[size]} />
                </span>
            ) : null}
        </div>
    )
}

/** `IdentityTile.*` — framed identity-tile namespace. */
export { IdentityTileBase as IdentityTile }

/** Tier metadata for `IdentityTile`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "IdentityTile" } as const
