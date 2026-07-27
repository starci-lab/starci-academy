import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DESIGN — `VariantChip.*`: chip family that APPLIES ONE MEANINGFUL ROLE on top of
 * the `Chip.*` atom.
 *
 * True to the `design` tier (§14d — design carries WHY): it doesn't invent a new
 * shape, it just attaches the MEANING + the color scale of that role onto the
 * shape the atom already has. Changing the chip's SHAPE is the atom's job;
 * changing the MEANING "difficulty" / "language" / "platform" is this file's job.
 *
 * MEMBER = MEANINGFUL ROLE, not shape. This is where the design tier differs from
 * the atom tier: the atom has only ONE chip (`Chip`) split by PROP, while
 * design splits by WHY.
 *
 * ⛔ **DESIGN MUST NEVER EXPOSE `custom` OR `bare`** (teacher's call, 2026-07-26):
 * no caller-chosen label, no shape swap. Opening those two up would let the caller
 * change both the text and the look — at that point it stops being a MEANINGFUL
 * ROLE and is just a chip again. Design must be the ONE CANONICAL FORM of that
 * role; anyone who wants a free-form chip should call the atom `Chip.*` directly.
 *
 * Consequence: `difficulty` is the ONE axis — it decides both the label and the
 * color.
 *
 * NO `Base` member: a "variant chip" carrying no role IS `Chip` with a dot —
 * adding an empty `Base` here would be an empty namespace (§12a forbids it).
 *
 * This family will also grow `.Language` · `.HostPlatform` · `.AiCategory`
 * (currently in `_legacy`). Only build the member a SCREEN ACTUALLY NEEDS — don't
 * feed a member nobody calls.
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
    /** Extra classes on the wrapper. */
    className?: string
    /** `true` → shimmer bar mirroring the exact dot+label shape (the atom draws it itself). */
    isSkeleton?: boolean
    /** Dev/spec: overlay anatomy labels on this chip. */
    showAnatomy?: boolean
    /** Anatomy tag: name the part so a BlockAnatomy panel can badge it. */
    anatPart?: string
}

/** Title-case a difficulty key for the default label. */
const capitalize = (value: Difficulty): string => value.charAt(0).toUpperCase() + value.slice(1)

/**
 * `VariantChipDifficulty` — a color dot by tier + a difficulty word (GitHub
 * language-dot style). A thin wrapper over the `Chip` atom; color comes from
 * {@link DIFFICULTY_COLOR}.
 *
 * ⚠️ Changed 2026-07-26: this used to call `Chip.Dot`. The atom folded the dot
 * into a PROP of the ONE chip, so the dot is now `dotClassName` on `Chip` —
 * no separate member anymore. The shape didn't change, only how you call it.
 *
 * The shape is ALWAYS a pill — the atom's default, and design doesn't expose a
 * shape axis to the caller (see the ⛔ note at the top of this file).
 *
 * @param props - {@link VariantChipDifficultyProps}
 */
const VariantChipDifficulty = ({
    difficulty,
    className,
    isSkeleton,
    showAnatomy = false,
    anatPart,
}: VariantChipDifficultyProps) => {
    // Part name so the anatomy tree can call out exactly what this design builds —
    // the tree reads off the DOM, so without a name the story reveals nothing
    // about what it's made of (teacher caught this 2026-07-25).
    // The label must be the NAMESPACE name (`Chip`) because readers look it
    // up by story name.
    const chipPart = showAnatomy ? "Chip" : undefined
    // Two branches because the atom's `isSkeleton` is a disjoint union (when
    // skeleton, `text` isn't required): passing a single `boolean | undefined`
    // into one call site wouldn't type-check. The skeleton branch STILL keeps
    // `dotClassName` so the atom sizes the box correctly while leaving room for
    // the dot.
    const chip = isSkeleton ? (
        <Chip
            isSkeleton
            dotClassName={DIFFICULTY_COLOR[difficulty]}
            className={className}
            anatPart={chipPart}
        />
    ) : (
        <Chip
            dotClassName={DIFFICULTY_COLOR[difficulty]}
            text={capitalize(difficulty)}
            className={className}
            anatPart={chipPart}
        />
    )
    // Part name goes on the span that WRAPS the chip itself — NOT through
    // `AnatomyOverlay`.
    //
    // The overlay emits an `inset-0` span sitting NEXT TO the chip rather than
    // wrapping it, so `Dot`/`Label` (inside the chip) walking up the ancestor
    // chain never reach `VariantChipDifficulty` → the anatomy tree flattens
    // wrong, with the two atoms jumping up to sit level with design (teacher
    // caught this 2026-07-26). The tree is inferred from the DOM, so the name
    // must sit on the node that ACTUALLY contains the children.
    return showAnatomy ? (
        <span className="inline-flex" data-anat-part={anatPart ?? "VariantChipDifficulty"}>
            {chip}
        </span>
    ) : chip
}

/**
 * `VariantChip.*` — the family of chips carrying a meaningful role. Members are
 * named by ROLE (§14d), not by shape. No `Base` (see the doc at the top of this
 * file).
 */
export { VariantChipDifficulty }
