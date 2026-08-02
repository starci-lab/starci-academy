"use client"

import { useMemo, useState } from "react"
import type { ComponentType, SVGProps } from "react"
import { Avatar as HeroAvatar, AvatarImage as HeroAvatarImage, AvatarFallback as HeroAvatarFallback, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `Avatar` — the constrained avatar atom over HeroUI Avatar.
 *
 * Fallback chain, in order: real image (`src`) → generated image (DiceBear,
 * seeded by `seed ?? name`) → initials (`name`) → icon. `fallback` selects what
 * shows when there is no `src`: `"generated"` (default) joins DiceBear to the
 * image chain; `"initials"`/`"icon"` skip it and show directly.
 *
 * The image chain advances on load ERROR: HeroUI/Radix mounts the `<img>` only
 * after it loads, so the atom listens to `onLoadingStatusChange` rather than
 * `onError`. It forces size (sm/md/lg), draws its own status dot and leaf
 * skeleton (`isSkeleton`), and takes `icon` as a COMPONENT (e.g. `icon={UserIcon}`).
 *
 * Icons are `@phosphor-icons/react` only; glyph weight is derived from size
 * (`bold` below `size-5` to keep the stroke visible), never set by callers.
 */

/**
 * Icon stroke weight; the atom picks between these two based on `size`.
 * Declared locally instead of importing phosphor's own type, so this file
 * does not depend on one icon provider.
 */
export type IconWeight = "regular" | "bold"

/**
 * An icon passed as a COMPONENT (e.g. `UserIcon`), rendered by the atom at
 * avatar scale. Typed as `SVGProps` plus `weight`, independent of any icon library.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Presence status → status-dot tone (the SINGLE source for status colour). */
export type AvatarStatus = "online" | "offline" | "busy" | "away"

/**
 * Decorative frame tone — a ring drawn around the avatar. The atom owns the
 * ring's shape; the caller only names the tone.
 */
export type AvatarRing = "warning" | "accent"

/** Avatar size preset. */
export type AvatarSize = "sm" | "md" | "lg"

/** Fallback tint when initials/icon show (HeroUI avatar `color`). */
export type AvatarColor = "accent" | "danger" | "default" | "success" | "warning"

/**
 * What shows when there is no `src`. `"generated"` (default) adds DiceBear to
 * the image candidate chain; `"initials"` / `"icon"` skip it and show the
 * initials or icon directly.
 */
export type AvatarFallback = "generated" | "initials" | "icon"

export const STATUS_TONE: Record<AvatarStatus, string> = {
    online: "bg-success",
    offline: "bg-default-400",
    busy: "bg-danger",
    away: "bg-warning",
}

/** `ring` tone → the ring's own colour utility (paired with the shared frame shape below). */
export const RING_TONE: Record<AvatarRing, string> = {
    warning: "ring-warning",
    accent: "ring-accent",
}

/** Frame shape shared by every ring tone — only the colour utility (`RING_TONE`) varies. */
const RING_FRAME = "rounded-full ring-2 ring-offset-2 ring-offset-background"

/**
 * Per-size chrome: skeleton box, status-dot diameter, fallback glyph scale
 * and weight. Class set one avatar size resolves to.
 */
export interface AvatarSizeStyle {
    /** Box size of the avatar itself. */
    box: string
    /** Size of the status dot. */
    dot: string
    /** Size of the fallback glyph. */
    glyph: string
    /** Stroke weight for the glyph; `undefined` means the `weight` prop is omitted entirely. */
    glyphWeight?: IconWeight
}

export const SIZE_MAP: Record<AvatarSize, AvatarSizeStyle> = {
    sm: { box: "size-8", dot: "size-2", glyph: "size-4", glyphWeight: "bold" },
    md: { box: "size-10", dot: "size-2.5", glyph: "size-5" },
    lg: { box: "size-12", dot: "size-3", glyph: "size-6" },
}

/**
 * Builds a stable DiceBear "thumbs" avatar URL from a seed — the same seed
 * always yields the same face. Mirrors `src/utils/avatar.ts#dicebearAvatarUrl`;
 * duplicated here (not imported) so this Storybook atom stays self-contained.
 *
 * @param seed - stable identity string (prefer email/username, then name)
 * @returns DiceBear SVG avatar URL
 */
export const dicebearAvatarUrl = (seed: string): string =>
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed || "anonymous")}`

/** Props for {@link AvatarBase}. */
export interface AvatarBaseProps {
    /** Uploaded image URL. Absent → the atom falls back per `fallback`. */
    src?: string
    /**
     * Stable identity used to seed the generated (DiceBear) avatar — email or
     * username, so the same person always gets the same generated face. Falls
     * back to `name` when omitted.
     */
    seed?: string
    /** Display name: drives image `alt` + the initials fallback (first two letters). */
    name?: string
    /** Fallback glyph as a COMPONENT reference (shown per the `fallback` chain). */
    icon?: IconComponent
    /** What to show when there is no `src`. Default `"generated"` (DiceBear). */
    fallback?: AvatarFallback
    /** When set → renders a presence dot at the bottom-right, tinted by status. */
    status?: AvatarStatus
    /**
     * When set → draws a decorative frame ring around the avatar, tinted by
     * tone (`"warning"` strongest, `"accent"` quieter). Omit for no ring. The
     * atom owns the ring's shape; the caller only names the tone. See {@link AvatarRing}.
     */
    ring?: AvatarRing
    /** Size preset. Default `md`. */
    size?: AvatarSize
    /** Fallback tint (initials/icon). Default `default`. */
    color?: AvatarColor
    /** Render the leaf skeleton (a circle shimmer) instead of the avatar. */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The base avatar atom. See file header for the strict fallback-chain + icon contract.
 *
 * @param props - {@link AvatarBaseProps}
 */
export const AvatarBase = ({
    src,
    seed,
    name,
    icon: Icon,
    fallback = "generated",
    status,
    ring,
    size = "md",
    color = "default",
    isSkeleton = false,
    classNames,
}: AvatarBaseProps) => {
    const { box, dot, glyph, glyphWeight } = SIZE_MAP[size]

    // Checked before any other branch: while skeleton, still draws the status
    // wrapper/dot (neutral tone, unknown status) so loading and loaded layouts
    // match pixel-for-pixel.
    if (isSkeleton) {
        return (
            <span
                data-tier="atom"
                data-component="Avatar"
                className={cn("relative inline-flex", ring ? cn(RING_FRAME, RING_TONE[ring]) : undefined, classNames)}
            >
                <HeroSkeleton className={cn("rounded-full", box)} />
                {status ? (
                    <span
                        aria-hidden

                        className={cn("ring-background absolute bottom-0 right-0 rounded-full ring-2", dot, "bg-default-300")}
                    />
                ) : null}
            </span>
        )
    }

    // Image candidates in order: src (if any) → DiceBear generated from seed ?? name.
    // fallback="initials"/"icon" excludes DiceBear from the chain (src only, if present).
    const candidates = useMemo(() => {
        const uploaded = src?.trim()
        if (fallback !== "generated") return uploaded ? [uploaded] : []
        const generated = dicebearAvatarUrl(seed ?? name ?? "")
        return uploaded ? [uploaded, generated] : [generated]
    }, [src, seed, name, fallback])

    // Index of the candidate currently being tried; advances on load ERROR, not
    // just a missing URL (see onLoadingStatusChange note above). Keyed by the
    // candidate chain's signature, so changing src/seed/name/fallback resets to 0.
    const signature = candidates.join("|")
    const [state, setState] = useState({ signature, index: 0 })
    const index = state.signature === signature ? state.index : 0
    const imageSrc = candidates[index]

    // Once image candidates are exhausted: fallback="icon" shows the glyph
    // directly; otherwise initials take priority, dropping to the icon only
    // when `name` is empty.
    const initials = (name ?? "").trim().slice(0, 2).toUpperCase()
    const iconGlyph = Icon ? (
        <span aria-hidden className="inline-flex">
            <Icon className={glyph} weight={glyphWeight} />
        </span>
    ) : null
    const fallbackContent = fallback === "icon" && iconGlyph ? iconGlyph : initials || iconGlyph

    return (
        // Relative wrapper so the status dot can anchor to the bottom-right corner.
        // `classNames` applies here too, matching the skeleton branch above, so
        // caller positioning stays consistent across the loading/loaded transition.
        <span
            data-tier="atom"
            data-component="Avatar"
            className={cn("relative inline-flex", ring ? cn(RING_FRAME, RING_TONE[ring]) : undefined, classNames)}
        >
            <HeroAvatar size={size} color={color} className="rounded-full">
                {imageSrc ? (
                    <HeroAvatarImage
                        src={imageSrc}
                        alt={name ?? ""}

                        onLoadingStatusChange={(loadStatus) => {
                            if (loadStatus === "error") {
                                setState({ signature, index: index + 1 })
                            }
                        }}
                    />
                ) : null}
                <HeroAvatarFallback>{fallbackContent}</HeroAvatarFallback>
            </HeroAvatar>
            {status ? (
                <span
                    aria-hidden

                    className={cn(
                        "ring-background absolute bottom-0 right-0 rounded-full ring-2",
                        dot,
                        STATUS_TONE[status],
                    )}
                />
            ) : null}
        </span>
    )
}

export const meta = { tier: "atom", name: "Avatar" } as const
