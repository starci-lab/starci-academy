import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/verdict-band`. Authored in Storybook (not `src`);
 * synced back to `src` later. Shared by the local `SectionCard` /
 * `GroupPressableCard` ports so the left DATA-signal band stays one definition.
 */

/** Semantic verdict tones with a literal Tailwind class (Tailwind's JIT scanner only
 * sees literal strings — this map is what makes `variant` safe with no extra config). */
export type VerdictBandVariant = "accent" | "success" | "warning" | "danger"

/**
 * Shared shape for the `withVerdict` left-band prop on {@link SectionCard}/
 * {@link SurfaceListCardItem}/{@link GroupPressableCard} (`card.md` §3i — "card
 * mang tín hiệu từ DATA"). Pass exactly ONE of `variant` (semantic token,
 * literal-safe) or `color` (raw Tailwind palette color + shade, e.g.
 * `"amber-500"`). Left band ONLY reads as a DATA signal — never ad-hoc "vùng
 * active" decoration (`card.md` §3g).
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
 * Tailwind's static scanner picks it up. Uses `inset-shadow-*` (Tailwind v4's SEPARATE `--tw-inset-shadow`
 * slot) so it coexists with a consumer's own `shadow-*` (e.g. GroupPressableCard's `shadow-surface`)
 * instead of overwriting it. `var(--<token>)` are the semantic colour CSS vars. */
const VERDICT_VARIANT_CLASS: Record<VerdictBandVariant, string> = {
    accent: "inset-shadow-[2px_0_0_0_var(--accent)]",
    success: "inset-shadow-[2px_0_0_0_var(--success)]",
    warning: "inset-shadow-[2px_0_0_0_var(--warning)]",
    danger: "inset-shadow-[2px_0_0_0_var(--danger)]",
}

/**
 * Resolves a {@link VerdictBand} into a 2px left-edge band, or `undefined` when disabled.
 * The band is an INSET box-shadow (`inset 2px 0 0 0 <colour>`) — it hugs the left edge AND
 * follows the card's `border-radius`, so it CURVES around the top-left / bottom-left corners
 * instead of being cut flat. `pl-4` keeps the content off the bar. Colour: `variant` → a
 * semantic token var; `color` → the raw Tailwind palette var `--color-<name>-<shade>` (v4).
 */
export const verdictBandClassName = (withVerdict?: VerdictBand): string | undefined => {
    if (!withVerdict?.enable) {
        return undefined
    }
    const shadowClass = withVerdict.variant
        ? VERDICT_VARIANT_CLASS[withVerdict.variant]
        : withVerdict.color
            ? `inset-shadow-[2px_0_0_0_var(--color-${withVerdict.color})]`
            : undefined
    return cn("pl-4", shadowClass)
}
