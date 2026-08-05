import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { capitalize, DIFFICULTY_COLOR, type VariantChipDifficultyProps } from "../types"

/**
 * `VariantChipDifficulty` — a color dot by tier + a difficulty word (GitHub
 * language-dot style). A thin wrapper over the `Chip` atom; color comes from
 * {@link DIFFICULTY_COLOR}.
 *
 * The shape is ALWAYS a pill — the atom's default, and design doesn't expose a
 * shape axis to the caller (see the  note at the top of this file).
 *
 * @param props - {@link VariantChipDifficultyProps}
 */
export const VariantChipDifficulty = ({
    difficulty,
    isSkeleton,
}: VariantChipDifficultyProps) => {
    // Part name so the anatomy tree can call out exactly what this design builds —
    // the tree reads off the DOM, so without a name the story reveals nothing
    // about what it's made of.
    // The label must be the NAMESPACE name (`Chip`) because readers look it
    // up by story name.
    // Two branches because the atom's `isSkeleton` is a disjoint union (when
    // skeleton, `text` isn't required): passing a single `boolean | undefined`
    // into one call site wouldn't type-check. The skeleton branch STILL keeps
    // `dotClassName` so the atom sizes the box correctly while leaving room for
    // the dot.
    const chip = isSkeleton ? (
        <Chip
            isSkeleton
            dotClassName={DIFFICULTY_COLOR[difficulty]}

        />
    ) : (
        <Chip
            dotClassName={DIFFICULTY_COLOR[difficulty]}
            text={capitalize(difficulty)}

        />
    )
    // Part name goes on the span that WRAPS the chip itself — NOT through
    // `AnatomyOverlay`.
    //
    // The overlay emits an `inset-0` span sitting NEXT TO the chip rather than
    // wrapping it, so `Dot`/`Label` (inside the chip) walking up the ancestor
    // chain never reach `VariantChipDifficulty` → the anatomy tree flattens
    // wrong, with the two atoms jumping up to sit level with design. The tree
    // is inferred from the DOM, so the name
    // must sit on the node that ACTUALLY contains the children.
    return chip
}
