import { cn } from "@heroui/react"

/** Semantic verdict tones with a literal Tailwind class (Tailwind's JIT scanner only
 * sees literal strings — this map is what makes `variant` safe with no extra config). */
export type VerdictBandVariant = "accent" | "success" | "warning" | "danger"

/**
 * Shared shape for the `withVerdict` left-band prop on {@link SectionCard}/
 * {@link SurfaceListCardItem} (`card.md` §3i — "card mang tín hiệu từ DATA").
 * Pass exactly ONE of `variant` (semantic token, literal-safe) or `color` (raw
 * Tailwind palette color + shade, e.g. `"amber-500"` — built at runtime as
 * `before:bg-${color}`, safelisted via the `@source inline(...)` grid in
 * `globals.css` since Tailwind can't see a dynamically-built class as a literal).
 * Left band ONLY reads as a DATA signal — never ad-hoc "vùng active" decoration
 * (`card.md` §3g).
 */
export interface VerdictBand {
    /** Turn the left band on. */
    enable: boolean
    /** Semantic tone — resolves via a literal lookup, no Tailwind safelist needed. */
    variant?: VerdictBandVariant
    /** Escape hatch: a raw Tailwind color + shade (e.g. `"amber-500"`) for a non-semantic ramp (tier/zone) that doesn't map to one of the 4 tokens. Ignored when `variant` is set. */
    color?: string
}

/** Literal per-variant background class for the pill band — MUST stay literal (no template
 * interpolation) so Tailwind's static scanner picks it up. */
const VERDICT_VARIANT_CLASS: Record<VerdictBandVariant, string> = {
    accent: "before:bg-accent",
    success: "before:bg-success",
    warning: "before:bg-warning",
    danger: "before:bg-danger",
}

/**
 * Resolves a {@link VerdictBand} into a FLUSH left-edge band (a `::before` pseudo-element),
 * or `undefined` when disabled.
 *
 * The band is a `before:` bar pinned FLUSH to the left edge (`inset-y-0 left-0 w-1`) with the
 * card's own `overflow-hidden` CLIPPING it to the rounded rect — so it hugs the edge and its
 * top/bottom follow the corner curve cleanly, instead of a floating inset pill (thầy 2026-07-18:
 * "border màu sát mép trái"). A pseudo-element BACKGROUND (not a `border-l`) is untouched by
 * HeroUI's `.card { border ... !important }` reset, so it needs no `!important` dance; the
 * `overflow-hidden` is what makes a straight edge bar follow the corners without the old
 * corner-wrap clutter. `relative` anchors the pseudo; `pl-4` keeps the content off the bar.
 */
export const verdictBandClassName = (withVerdict?: VerdictBand): string | undefined => {
    if (!withVerdict?.enable) {
        return undefined
    }
    const bgClass = withVerdict.variant
        ? VERDICT_VARIANT_CLASS[withVerdict.variant]
        : withVerdict.color
            ? `before:bg-${withVerdict.color}`
            : undefined
    return cn(
        "relative overflow-hidden pl-4 before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:content-['']",
        bgClass,
    )
}
