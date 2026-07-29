"use client"

import React, { useEffect, useState } from "react"
import type { ComponentType, SVGProps } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/IconTile`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/**
 * Visual tone of the tile (drives the tinted background + icon colour).
 *
 * Alias, not a redeclaration (thầy chốt 2026-07-29): the same five values
 * {@link AlertStatus} already carries — trung lập is `default`, matching every
 * other status-driven prop in the system instead of this atom's own `neutral`.
 */
export type IconTileTone = AlertStatus

/** Size of the tile. */
export type IconTileSize = "sm" | "md" | "lg"

/** Two weight steps for the glyph — matches §5.0a (only a glyph smaller than `size-5` needs `bold`). */
export type IconWeight = "regular" | "bold"

/**
 * Icon is passed in as a COMPONENT (e.g. `GraduationCapIcon`); the atom renders it
 * and forces its own scale at the tile's size. The type stays OPEN (`SVGProps` +
 * optional `weight`), NOT typed against Phosphor's `Icon` — typing tightly against
 * one library locks the whole tree to a single provider (§5.0).
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
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    className?: string
}

/**
 * `icon` is REQUIRED when rendering the real tile, NOT needed when `isSkeleton` —
 * the shimmer box has no icon inside. Same union shape as `ChipBaseProps`/
 * `TypographyProps` (§12c: content optional-when-skeleton via a UNION, not a
 * blanket optional).
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
    default: "bg-default text-muted",
}

/**
 * Corner rounding — ROUND, a single shape (teacher decided 2026-07-26: "round
 * reads nicer", then decided the same day to DROP the `shape` axis entirely).
 *
 * The old `square`/`circle` axis only lived inside its own story — no consumer in
 * the design tree ever passed `shape`, so it was a choice nobody made. A tile
 * usually stands ALONE in open space (an empty state, the top of a dialog) where
 * there's no straight edge nearby to line up against, so round reads softer.
 *
 * ⚠️ `src` (the real app) currently uses hard square rounding by size
 * (`rounded-xl`/`rounded-2xl`) and has NO `shape` prop — the design intentionally
 * leads; sync comes later (§0).
 */
const SHAPE_CLASS = "rounded-full"

/**
 * size → the tile's BOX (corner rounding is {@link SHAPE_CLASS}'s job, not mixed
 * in here).
 *
 * Default `sm` = `size-10` (40px) + icon `size-5` — the standard pairing for an
 * `IconTile + TitledText` row and for an empty state. The icon is a FUNCTION of
 * size — the caller never tunes it separately (§12d) — see {@link SIZE_ICON}.
 *
 * 🕰️ `sm` used to be `size-12` (48px, decided 2026-07-26) → lowered to `size-10`
 * (teacher decided 2026-07-27): 48px overpowered an `sm`/`xs` text cluster — the
 * tile read as the main character instead of an identity mark.
 */
const SIZE_BOX: Record<IconTileSize, string> = {
    sm: "size-10",
    md: "size-16",
    lg: "size-20",
}

/**
 * size → the inner ICON size. All three steps are `size-5` or above ⇒ per §5.0a we
 * do NOT pass `weight` (the glyph stays natural `regular`) — only a glyph under
 * `size-5` needs `bold` forced, and IconTile has no step that small.
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
    className,
    showAnatomy = false,
    anatPart,
}: IconTileProps) => {
    // a broken cover URL (404 / unsynced asset) falls back to the icon instead of a
    // broken-image glyph; reset when the src changes.
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])
    const showImage = Boolean(src) && !failed

    // Skeleton CO-LOCATED (§12c): the tile is a SOLID BOX (icon/image fills it), so
    // the shimmer bar IS the whole box — exact {@link SIZE_BOX}, same rounding.
    // Checked BEFORE any shape branch (icon vs image) so real content never leaks.
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
                className={cn("shrink-0", SIZE_BOX[size], SHAPE_CLASS, className)}
            />
        )
    }

    return (
        // Tile/Cover/Icon are plain elements/arbitrary content, not fixed importable
        // components (§ naming pass, 2026-07-28 — see the story's own note), so none
        // of them gets a self-badge fallback here; only `anatPart` from a PARENT names
        // this root as one opaque node.
        <div
            aria-hidden
            data-anat-part={anatPart}
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden",
                SIZE_BOX[size],
                SHAPE_CLASS,
                // skip the tint when a cover image fills the tile
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
            ) : Icon ? (
                <span aria-hidden className="inline-flex shrink-0">
                    {/* The atom owns the glyph scale (§4): SIZE_ICON is already ≥ size-5
                        at all three steps, so no `weight` is passed (§5.0a — only a
                        glyph < size-5 forces "bold"). */}
                    <Icon className={SIZE_ICON[size]} />
                </span>
            ) : null}
        </div>
    )
}

/** `IconTile.*` — framed icon-tile namespace. */
export { IconTileBase as IconTile }
