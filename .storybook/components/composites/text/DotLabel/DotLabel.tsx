import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { TypographyColor } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "DotLabel" } as const

/**
 * `DotLabel` — a colour dot + an inline text label as one unit, with no pill/background. Use
 * where a coloured dot reads faster than the word alone but a full chip's padding would be too
 * heavy (a status line inside a card, an "Online" row beside a name, a category line in a dense
 * list). Leaves: `tone`, `color`, `isSkeleton`. The dot is a plain span (no bare-swatch atom yet).
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

                isSkeleton={isSkeleton}
                text={label}
            />
        </span>
    )
}
