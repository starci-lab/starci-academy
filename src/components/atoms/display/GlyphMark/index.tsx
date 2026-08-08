import type { ComponentType, SVGProps } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"

/**
 * ATOM — `GlyphMark`: a bare size-5 status/affordance glyph (no tile frame).
 *
 * One prop = one leaf, each rendering every state the prop produces: `tone` ·
 * `isSkeleton`. Props with no visual (`ariaLabel`) get no leaf. `icon` has no
 * leaf of its own — it is required content (except while `isSkeleton`), not a
 * caller-toggled axis.
 *
 * The icon takes a component (`icon={CheckCircleIcon}`), not JSX; the atom
 * forces its scale to `size-5`. In the anatomy, `Mark`/`Icon` are plain
 * elements (unnamed); only `Skeleton` is a nameable HeroUI node.
 */

/** Visual tone of the glyph (drives icon colour only — no tinted background). */
export type GlyphMarkTone = "default" | "accent" | "success" | "warning"

/** Two weight steps for the glyph; only a glyph smaller than `size-5` needs `bold`. */
export type IconWeight = "regular" | "bold"

/**
 * Icon is passed in as a COMPONENT (e.g. `CheckCircleIcon`); the atom renders
 * it and forces its own scale. Typed as `SVGProps` plus an optional `weight`,
 * not against Phosphor's own `Icon` type, so this file does not depend on one
 * icon provider. Same pattern as IconTile's `IconComponent`.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Local alias of {@link IconComponent} for GlyphMark call sites. */
export type GlyphMarkIcon = IconComponent

/** Shared props — EXCEPT the `icon`/`isSkeleton` pair, see {@link GlyphMarkProps}. */
interface GlyphMarkOwnProps {
    /** Icon colour. Defaults to `"default"` (`text-foreground`). */
    tone?: GlyphMarkTone
    /**
     * Accessible name when the glyph is meaningful on its own. Omitted → the
     * mark is decorative (`aria-hidden`).
     */
    ariaLabel?: string
}

/**
 * `icon` is required when rendering the real mark, not needed when
 * `isSkeleton` (the shimmer box has no icon inside). Same union shape as
 * `IconTileProps`.
 */
export type GlyphMarkProps = GlyphMarkOwnProps &
    (
        | {
            /** `true` → renders a shimmer box at the exact glyph size, in place of content. */
            isSkeleton: true
            /** The icon component (vd phosphor `*Icon`). */
            icon?: IconComponent
        }
        | {
            isSkeleton?: false
            /** The icon component (vd phosphor `*Icon`). */
            icon: IconComponent
        }
    )

/** tone → icon colour (no background fill — this is a bare glyph, not a tile). */
const TONE: Record<GlyphMarkTone, string> = {
    default: "text-foreground",
    accent: "text-accent-soft-foreground",
    success: "text-success-soft-foreground",
    warning: "text-warning-soft-foreground",
}

/** Fixed glyph footprint — intrinsic; callers cannot retune size/placement. */
const BOX = "size-5 shrink-0"

/**
 * A bare size-5 status/affordance glyph — icon colour only, no tinted tile
 * frame. Pass the icon COMPONENT (not JSX); the atom renders + scales it
 * itself. Pure/props-only; owns its look.
 *
 * @param props - {@link GlyphMarkProps}
 */
const GlyphMarkBase = ({
    icon: Icon,
    tone = "default",
    isSkeleton = false,
    ariaLabel,
}: GlyphMarkProps) => {
    // The mark IS the glyph, so the shimmer takes the glyph's exact footprint
    // (`size-5`) with `rounded-full` — same shape as sibling bare size-5
    // glyph skeletons (`Menu` row icon, `SnippetIcon`, `StepBadge` sm).
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="GlyphMark"
                className={cn(BOX, "rounded-full")}
            />
        )
    }

    const decorative = ariaLabel == null

    return (
        // Mark/Icon are plain elements, not importable components — but the
        // mark itself IS the atom, so it badges as its own name like any other
        // atom's root (Rule 10).
        <span
            data-tier="atom"
            data-component="GlyphMark"
            className={cn("inline-flex items-center justify-center", BOX, TONE[tone])}
            {...(decorative
                ? { "aria-hidden": true as const }
                : { role: "img" as const, "aria-label": ariaLabel })}
        >
            {Icon ? (
                // size-5 matches {@link BOX}; at this step no `weight` is
                // passed — only a glyph < size-5 forces "bold".
                <Icon className="size-5" aria-hidden />
            ) : null}
        </span>
    )
}

export { GlyphMarkBase as GlyphMark }

/** Tier metadata for `GlyphMark`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "GlyphMark" } as const
