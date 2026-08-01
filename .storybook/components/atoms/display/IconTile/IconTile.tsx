"use client"

import React, { useEffect, useState } from "react"
import type { ComponentType, SVGProps } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/IconTile`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/**
 * Visual tone of the tile (drives the tinted background + icon colour).
 * Alias of {@link AlertStatus}, not a redeclaration — the same five values,
 * with `default` as neutral rather than a separate `neutral` value.
 */
export type IconTileTone = AlertStatus

/** Size of the tile. */
export type IconTileSize = "sm" | "md" | "lg"

/** Two weight steps for the glyph; only a glyph smaller than `size-5` needs `bold`. */
export type IconWeight = "regular" | "bold"

/**
 * Icon is passed in as a COMPONENT (e.g. `GraduationCapIcon`); the atom renders
 * it and forces its own scale at the tile's size. Typed as `SVGProps` plus an
 * optional `weight`, not against Phosphor's own `Icon` type, so this file does
 * not depend on one icon provider.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Shared props — EXCEPT the `icon`/`isSkeleton` pair, see {@link IconTileProps}. */
interface IconTileOwnProps {
    /**
     * Optional cover image. When set, it FILLS the tile (`object-cover`, centered —
     * a 16:9 source is cropped to the square frame) instead of the icon; falls back
     * to `icon` when absent/empty.
     */
    src?: string | null
    /** Alt text for the cover image (decorative tile — usually the entity title). */
    alt?: string
    /** Tinted background + icon colour. Defaults to "accent". */
    tone?: IconTileTone
    /** Tile size. Defaults to "md" (64px). */
    size?: IconTileSize
    /** `true` → attaches `data-anat-part` to each part for the BlockAnatomy badge. */
    showAnatomy?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `icon` is required when rendering the real tile, not needed when
 * `isSkeleton` (the shimmer box has no icon inside). Same union shape as
 * `ChipBaseProps`/`TypographyProps`.
 */
export type IconTileProps = IconTileOwnProps &
    (
        | {
            /** `true` → renders a shimmer box at the exact tile size, in place of content. */
            isSkeleton: true
            /** The icon component (vd phosphor `*Icon`) — fallback when no {@link IconTileOwnProps.src}. */
            icon?: IconComponent
        }
        | {
            isSkeleton?: false
            /** The icon component (vd phosphor `*Icon`) — fallback when no {@link IconTileOwnProps.src}. */
            icon: IconComponent
        }
    )

/** tone → tinted background + icon colour. */
const TONE: Record<IconTileTone, string> = {
    accent: "bg-accent-soft text-accent-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    danger: "bg-danger-soft text-danger-soft-foreground",
    info: "bg-info-soft text-info-soft-foreground",
    default: "bg-default text-muted",
}

/**
 * Corner rounding — round, a single fixed shape (no `shape` prop/axis).
 *
 * `src` (the real app) currently uses square rounding by size instead and has
 * no `shape` prop; the two are not yet in sync.
 */
const SHAPE_CLASS = "rounded-full"

/**
 * size → the tile's box (corner rounding is {@link SHAPE_CLASS}'s job, kept separate).
 *
 * Default `sm` = `size-10` (40px) with icon `size-5` — the standard pairing for
 * an `IconTile + TitledText` row or an empty state. Icon size is a function of
 * tile size ({@link SIZE_ICON}); callers cannot tune it separately.
 */
const SIZE_BOX: Record<IconTileSize, string> = {
    sm: "size-10",
    md: "size-16",
    lg: "size-20",
}

/**
 * size → the inner icon size. All three steps are `size-5` or above, so no
 * `weight` is passed (the glyph stays `regular`); only a glyph under `size-5`
 * needs `bold`, and IconTile has no step that small.
 */
const SIZE_ICON: Record<IconTileSize, string> = {
    sm: "size-5",
    md: "size-6",
    lg: "size-8",
}

/**
 * A framed icon tile — a soft tinted square (`bg-{tone}/20`) with the icon
 * centered inside, used as the avatar of a *thing* (course, project, section…)
 * to give it breathing room and a consistent identity. The icon auto-sizes and
 * inherits the tone colour; pass the icon COMPONENT (not JSX) and the tile
 * renders + scales it itself. Pure/props-only; owns its look.
 *
 * @param props - {@link IconTileProps}
 */
const IconTileBase = ({
    icon: Icon,
    src,
    alt = "",
    tone = "accent",
    size = "sm",
    isSkeleton = false,
    classNames,
    showAnatomy = false,
}: IconTileProps) => {
    // a broken cover URL (404 / unsynced asset) falls back to the icon instead of a
    // broken-image glyph; reset when the src changes.
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])
    const showImage = Boolean(src) && !failed

    // The tile is a solid box (icon/image fills it), so the shimmer is the whole
    // box — exact {@link SIZE_BOX}, same rounding. Checked before any content
    // branch so real content never leaks through while loading.
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="IconTile"
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
                className={cn("shrink-0", SIZE_BOX[size], SHAPE_CLASS, classNames)}
            />
        )
    }

    return (
        // Tile/Cover/Icon are plain elements, not importable components — but the
        // tile itself IS the atom, so it badges as its own name like any other
        // atom's root (Rule 10); there is nothing here for a caller to name better.
        <div
            aria-hidden
            data-tier="atom"
            data-component="IconTile"
            data-anat-part={showAnatomy ? "IconTile" : undefined}
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden",
                SIZE_BOX[size],
                SHAPE_CLASS,
                // skip the tint when a cover image fills the tile
                showImage ? null : TONE[tone],
                classNames,
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
                    {/* SIZE_ICON is already ≥ size-5 at all three steps, so no
                        `weight` is passed — only a glyph < size-5 forces "bold". */}
                    <Icon className={SIZE_ICON[size]} />
                </span>
            ) : null}
        </div>
    )
}

/** `IconTile.*` — framed icon-tile namespace. */
export { IconTileBase as IconTile }

export const meta = { tier: "atom", name: "IconTile" } as const
