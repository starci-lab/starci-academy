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
 * Resolves a {@link VerdictBand} into the INSET ROUNDED-PILL band classes (a `::before`
 * pseudo-element), or `undefined` when disabled.
 *
 * The band is a `before:` pill — `w-1 rounded-full`, absolutely positioned and INSET on
 * every side (`left-2`, `top-2`, `bottom-2`) — NOT a `border-l`. A straight left border
 * gets hooked/clipped by the card's rounded corners (`rounded-3xl overflow-hidden`): on
 * the first/last row of a `SurfaceListCard`, or a standalone `SectionCard`, it wraps the
 * corner and reads cluttered (thầy 2026-07-18: "fix B ... nhìn đỡ rối"). Insetting top +
 * bottom always clears the corner for a first/last row AND a standalone card, so the pill
 * floats free of every edge in every consumer — no first/last-child fragility.
 *
 * Bonus: a pseudo-element BACKGROUND is not touched by HeroUI's `.card { border ... !important }`
 * reset, so this drops the whole `!important` / per-side `border-style` dance the old
 * `border-l` band needed to fight that reset. `relative` anchors the pseudo; `pl-4` clears
 * the pill from the content.
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
        "relative pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:content-['']",
        bgClass,
    )
}
