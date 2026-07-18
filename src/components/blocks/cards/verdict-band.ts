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

/** Literal per-variant inset-shadow class — MUST stay literal (no template interpolation) so
 * Tailwind's static scanner picks it up. `var(--<token>)` are the semantic colour CSS vars. */
const VERDICT_VARIANT_CLASS: Record<VerdictBandVariant, string> = {
    accent: "shadow-[inset_2px_0_0_0_var(--accent)]",
    success: "shadow-[inset_2px_0_0_0_var(--success)]",
    warning: "shadow-[inset_2px_0_0_0_var(--warning)]",
    danger: "shadow-[inset_2px_0_0_0_var(--danger)]",
}

/**
 * Resolves a {@link VerdictBand} into a 2px left-edge band, or `undefined` when disabled.
 *
 * The band is an INSET box-shadow (`inset 2px 0 0 0 <colour>`) — it hugs the left edge AND follows
 * the card's `border-radius`, so it CURVES ("móc") around the top-left / bottom-left corners
 * instead of being cut flat at the rounded corner (thầy 2026-07-18: "cái móc lên"). box-shadow is
 * untouched by HeroUI's `.card { border ... !important }` reset, so no `!important` dance; and it
 * needs no `overflow-hidden`. `pl-4` keeps the content off the bar. On a flush-row consumer
 * (`SurfaceListCard`) the first/last row must own the matching corner radius for the hook to land
 * (see those blocks). Colour: `variant` → a semantic token var; `color` → the raw Tailwind palette
 * var `--color-<name>-<shade>` (v4), safelisted in `globals.css`.
 */
export const verdictBandClassName = (withVerdict?: VerdictBand): string | undefined => {
    if (!withVerdict?.enable) {
        return undefined
    }
    const shadowClass = withVerdict.variant
        ? VERDICT_VARIANT_CLASS[withVerdict.variant]
        : withVerdict.color
            ? `shadow-[inset_2px_0_0_0_var(--color-${withVerdict.color})]`
            : undefined
    return cn("pl-4", shadowClass)
}
