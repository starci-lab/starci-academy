import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import type { TypographyColor } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE — `DotLabel`: a colour swatch + an inline text label, as ONE unit —
 * NO pill/background around it (a status line inside a card, an "Online" row
 * beside a name, a category line in a dense list — anywhere a coloured dot
 * reads faster than the word alone, but a full chip's padding/background would
 * be too heavy for the surface it sits in).
 *
 * CHECKED BEFORE BUILDING (per the build brief's "two candidates" audit):
 *
 * ⭐ NOT already covered by `Chip`'s dot variant (`dotColor`/`dotClassName` on
 * `atoms/chips/Chip`, informally "Chip.Dot"). That variant is still a real
 * `HeroChip` underneath — `variant="soft"`, the chip's own background/padding/
 * rounded-full pill shell, just with a coloured dot in the leading-glyph slot
 * instead of an icon. It answers "a status **chip**"; it cannot render a bare
 * dot + label with no chip shell around it, because `ChipBase` never renders
 * without the `HeroChip` wrapper. Confirmed by reading `ChipBase.tsx` directly
 * — every branch (skeleton and real) returns a `<HeroChip>` root.
 *
 * ⭐ THE SAME BARE SHAPE ALREADY EXISTS, but only INLINED inside `Legend`
 * (`composites/stats/Legend`), one entry of its `items` list, and its own file
 * flags the same thing this composite now fixes: *"ATOM GAP: no swatch/dot
 * atom exists yet, so the dot stays a real plain span"*. `DotLabel` reuses
 * that exact swatch mechanism (`resolveDotColor`, size-2.5 flat circle,
 * neutral skeleton fill) so the two composites don't invent two different dots
 * for the same idea — but exposes it as its own standalone single-instance
 * composite, since `Legend` only takes a repeated `items` array and is scoped
 * to "a legend for a chart", not any dot+label row in the app.
 *
 * SAME ATOM GAP AS `Legend`: no swatch/dot atom exists yet in `atoms/`. Kept
 * as a plain `<span>` here for the same reason — a flat, non-animated fill is
 * already a correct "not loaded yet" indicator for a shape this simple, so
 * reaching for a vendor `Skeleton` here would be COMPOSITE-10 for no gain.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Label tone — the 6-value scale every composite text draws from. Default `muted` (a status line reads as secondary text; the swatch already carries the emphasis). */
export type DotLabelTone = "default" | "muted" | "accent" | "success" | "warning" | "danger"

const TONE_TO_TYPOGRAPHY: Record<DotLabelTone, TypographyColor> = {
    default: "default",
    muted: "muted",
    accent: "accent",
    success: "success",
    warning: "warning",
    danger: "danger",
}

/**
 * Resolve a swatch `color` into the right paint channel — same dual-mode
 * split `Legend` uses for its own dot: a Tailwind `bg-*` utility applies as a
 * className; anything else (a raw hex, `var(--…)`, `rgb(…)`) applies as an
 * inline `backgroundColor`, so a caller can pass either a token or a value
 * outside the Tailwind palette (e.g. a GitHub language colour) through one prop.
 */
/** The resolved dot paint channel — a Tailwind `bg-*` className, or a raw-colour inline style, never both. */
interface ResolvedDotColor {
    className?: string
    style?: React.CSSProperties
}

const resolveDotColor = (color: string): ResolvedDotColor => {
    if (color.startsWith("bg-")) {
        return { className: color }
    }
    return { style: { backgroundColor: color } }
}

/** Props shared regardless of loading state — see {@link DotLabelProps} for the `color`/`label`/`isSkeleton` union. */
interface DotLabelOwnProps {
    /** Label tone. Defaults to `"muted"`. */
    tone?: DotLabelTone
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `color`/`label` are required when rendering a real row; not needed when
 * `isSkeleton` — the shimmer mirror has no swatch colour or text of its own.
 */
export type DotLabelProps = DotLabelOwnProps &
    (
        | { isSkeleton: true; color?: string; label?: string }
        | {
              isSkeleton?: false
              /**
               * Swatch colour — a Tailwind `bg-*` class OR a raw colour value
               * (`var(--success)`, `#3178c6`).
               */
              color: string
              /**
               * The label text, rendered through `Typography` — the composite owns
               * the tone (see {@link DotLabelOwnProps.tone}), so this is `string`,
               * never a pre-built node.
               */
              label: string
          }
    )

/**
 * `DotLabel` — a colour dot beside an inline text label, no chip/pill shell.
 * See the file header for why this is not already `Chip`'s dot variant or
 * `Legend`.
 *
 * @param props - {@link DotLabelProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "DotLabel" } as const

/** A colour dot beside an inline text label, with no chip/pill shell around it. */
export const DotLabel = ({
    color,
    label,
    tone = "muted",
    classNames,
    isSkeleton = false,
}: DotLabelProps) => {
    const dot = color ? resolveDotColor(color) : undefined

    return (
        <span
            className={cn("inline-flex items-center gap-1", classNames)}
            data-tier="composite"
            data-component="DotLabel"
            data-principle="icon-text"
        >
            {isSkeleton ? (
                // ATOM GAP (same one `Legend` already flags): no swatch/dot atom exists
                // yet, so the dot stays a real plain span in both states — a neutral
                // flat fill (no hand-drawn `animate-pulse`, COMPOSITE-10) instead of
                // reaching for a vendor Skeleton.
                <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-default" />
            ) : (
                <span
                    aria-hidden
                    style={dot?.style}
                    className={cn("size-2.5 shrink-0 rounded-full", dot?.className)}
                />
            )}
            <Typography
                size="sm"
                color={isSkeleton ? undefined : TONE_TO_TYPOGRAPHY[tone]}
                classNames={isSkeleton ? ["w-1/3"] : undefined}
                isSkeleton={isSkeleton}
                text={label}
            />
        </span>
    )
}
