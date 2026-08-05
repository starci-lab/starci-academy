/** The supported difficulty levels a piece of content can be tagged with. */
export type Difficulty = "beginner" | "intermediate" | "advanced" | "insane"

/**
 * Dot color scale by difficulty tier — the SSOT for this ramp, import it, don't
 * redeclare it.
 *
 * Uses a sequential Tailwind palette ramp (hotter = harder) INSTEAD OF the 5
 * semantic tokens (`accent`/`success`/`warning`/`danger`/`default`): difficulty is
 * a **TIER**, not a **STATE** — forcing 4 tiers into semantic tokens would collide
 * on `danger` twice.
 */
export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
    beginner: "text-emerald-500",
    intermediate: "text-amber-500",
    advanced: "text-orange-500",
    insane: "text-rose-500",
}

/** Props for {@link VariantChipDifficulty}. */
export interface VariantChipDifficultyProps {
    /** Difficulty tier — decides BOTH the label AND the dot color. The one axis. */
    difficulty: Difficulty
    /**
     * Extra classes on the wrapper. A closed union, not a free string: this
     * value is handed straight to `Chip`'s own closed `classNames` union, so an
     * unconstrained string here would only fail one tier down.
     */
    classNames?: Array<import("@sb-components/atoms/_allowed-class-name").AllowedClassName>
    /** `true` → shimmer bar mirroring the exact dot+label shape (the atom draws it itself). */
    isSkeleton?: boolean
    /** Dev/spec: overlay anatomy labels on this chip. */
}

/** Title-case a difficulty key for the default label. */
export const capitalize = (value: Difficulty): string => value.charAt(0).toUpperCase() + value.slice(1)
