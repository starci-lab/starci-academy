import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { TypographyColor } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `DotLabel` — a colour swatch + an inline text label, as ONE unit with NO
 * pill/background around it (a status line inside a card, an "Online" row beside a
 * name, a category line in a dense list — anywhere a coloured dot reads faster than
 * the word, but a chip's padding/background would be too heavy).
 *
 * Distinct from `Chip`'s dot variant, which is still a `HeroChip` with the chip's
 * background/padding/pill shell and cannot render a bare dot + label. It reuses the
 * same swatch mechanism as `Legend` (`resolveDotColor`, a size-2.5 flat circle,
 * neutral skeleton fill) but exposes it as a standalone single-instance composite,
 * whereas `Legend` only takes a repeated `items` array. No swatch/dot atom exists
 * yet, so the dot stays a plain non-animated `<span>`.
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
const resolveDotColor = (color: string): { className?: string; style?: React.CSSProperties } =>
    color.startsWith("bg-") ? { className: color } : { style: { backgroundColor: color } }

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
            data-principles="icon-text"
        >
            {isSkeleton ? (
                // ATOM GAP (same one `Legend` already flags): no swatch/dot atom exists
                // yet, so the dot stays a real plain span in both states — a neutral
                // flat fill (no hand-drawn `animate-pulse`, COMPOSITE-10) instead of
                // reaching for a vendor Skeleton.
                <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full bg-default"

                />
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
