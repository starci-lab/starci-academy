import React from "react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `Spacer` layout primitive.
 * Authored in Storybook (not `src`); synced to `src` later. No `@/components`
 * imports (design-spec ports stay self-contained).
 */

/** Tailwind spacing steps → rem, matched to the app scale. */
const spacingScale: Record<number, string> = {
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
}

/** Props for the {@link Spacer} primitive. */
export interface SpacerProps {
    /** Horizontal size (Tailwind spacing step). */
    x?: number
    /** Vertical size (Tailwind spacing step). */
    y?: number
    /** Extra classes on the spacing div. */
    className?: string
}

/**
 * An `aria-hidden` div that reserves a FIXED gap along the horizontal (`x`)
 * and/or vertical (`y`) axis — used in place of a flex `gap` when the two
 * neighbours are DIRECT children of a non-flex/grid container (e.g. content
 * composed conditionally). Values match `spacingScale` (0.5 → 48) mapped to
 * the Tailwind rem scale; off-scale values fall back to `n * 0.25rem`.
 *
 * @param props - {@link SpacerProps}
 */
export const Spacer = ({ x, y, className }: SpacerProps) => {
    const width = x ? spacingScale[x] ?? `${x * 0.25}rem` : undefined
    const height = y ? spacingScale[y] ?? `${y * 0.25}rem` : undefined

    return (
        <div
            aria-hidden="true"
            className={className}
            style={{
                width: width ?? (x !== undefined ? "auto" : undefined),
                height: height ?? (y !== undefined ? "auto" : undefined),
                flexShrink: 0,
            }}
        />
    )
}
