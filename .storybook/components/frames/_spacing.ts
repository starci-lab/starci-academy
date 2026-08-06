/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME TIER -- the SHARED spacing/alignment vocabulary of the frame tier
 * (`Stack` - `Split` - `Cluster` - `Grid` - `Flex` - `ResponsiveRow` - `Container`).
 * Internal module (`_`-prefixed): it is a type + class table, NOT a component,
 * and never leaves this folder.
 *
 * SSOT FOR THE COUNTS AND THE REASONING:
 *   design/storybook/architecture/principles/gap.md
 *   design/storybook/architecture/principles/padding.md
 *   design/storybook/architecture/principles/responsive.md
 * This file only encodes what those hold. principles/README.md's rule for the
 * folder -- "a value is written out here and nowhere else" -- is why the class
 * tables live beside the type instead of inside each frame that consumes them.
 *
 * WHY NUMBERS, NOT WORDS (the migration this file carries out). The scale used
 * to be `flush - tight - related - grouped - section - page`, and it is gone --
 * there is no deprecated stage, the old union does not exist any more:
 *
 *   gap="flush"    -> gap={1}      padding="flush" -> padding={1}
 *   gap="tight"    -> gap={2}      padding="snug"  -> padding={3}
 *   gap="related"  -> gap={3}      padding="cozy"  -> padding={4}
 *   gap="grouped"  -> gap={4}      padding="roomy" -> padding={6}
 *   gap="section"  -> gap={6}      padding="airy"  -> padding={6}  (p-8 never
 *   gap="page"     -> gap={7}       earned its own step -- see padding.md)
 *
 * The seventh rung is `gap-8` (32px), the LAYOUT seam -- two columns left/right,
 * a header and the content under it. It was `gap-10` (40px) for a while, chosen
 * on raw counts, but the design decision is 32px: it sits one step above the
 * `gap-6` (24px) block seam, and the ladder 24 -> 32 -> 48 reads cleaner than
 * 24 -> 40 -> 48. `gap-10` call sites migrate down to `gap-8`; `gap-12` (marketing
 * air) is the eighth. See gap.md -- layout-split.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * A step on the gap scale. An INDEX into the table below, never a measurement:
 * `gap={3}` is `gap-2` (8px) because row `3` says so, not because `3` means
 * anything in pixels. `gap={2}` twice is not `gap={4}` -- see gap.md.
 *
 * Eight rungs, each earned by call sites counted on `src/components`
 * (gap.md): the six carried over from the old word scale, plus the two the
 * app's wide end actually uses -- `7` (`gap-10`, page bands, 55 uses) and `8`
 * (`gap-12`, marketing air, 9 uses). Step `5` (`gap-4`) has no settled meaning
 * yet; 56 call sites chose it, which earns the rung, but nobody has read them
 * (see gap.md's open question).
 */
export type AllowedGap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/** {@link AllowedGap} step -> literal Tailwind class. Tailwind never emits an interpolated class, so this is written out in full rather than templated. */
export const GAP_CLASS: Record<AllowedGap, string> = {
    1: "gap-0",
    2: "gap-1",
    3: "gap-2",
    4: "gap-3",
    5: "gap-4",
    6: "gap-6",
    7: "gap-8",
    8: "gap-12",
}

/** {@link AllowedGap} step at the `@app-sm` container query. */
const GAP_CLASS_SM: Record<AllowedGap, string> = {
    1: "@app-sm:gap-0",
    2: "@app-sm:gap-1",
    3: "@app-sm:gap-2",
    4: "@app-sm:gap-3",
    5: "@app-sm:gap-4",
    6: "@app-sm:gap-6",
    7: "@app-sm:gap-8",
    8: "@app-sm:gap-12",
}

/** {@link AllowedGap} step at the `@app-md` container query. */
const GAP_CLASS_MD: Record<AllowedGap, string> = {
    1: "@app-md:gap-0",
    2: "@app-md:gap-1",
    3: "@app-md:gap-2",
    4: "@app-md:gap-3",
    5: "@app-md:gap-4",
    6: "@app-md:gap-6",
    7: "@app-md:gap-8",
    8: "@app-md:gap-12",
}

/** {@link AllowedGap} step at the `@app-lg` container query. */
const GAP_CLASS_LG: Record<AllowedGap, string> = {
    1: "@app-lg:gap-0",
    2: "@app-lg:gap-1",
    3: "@app-lg:gap-2",
    4: "@app-lg:gap-3",
    5: "@app-lg:gap-4",
    6: "@app-lg:gap-6",
    7: "@app-lg:gap-8",
    8: "@app-lg:gap-12",
}

/** {@link AllowedGap} step at the `@app-xl` container query. */
const GAP_CLASS_XL: Record<AllowedGap, string> = {
    1: "@app-xl:gap-0",
    2: "@app-xl:gap-1",
    3: "@app-xl:gap-2",
    4: "@app-xl:gap-3",
    5: "@app-xl:gap-4",
    6: "@app-xl:gap-6",
    7: "@app-xl:gap-8",
    8: "@app-xl:gap-12",
}

/**
 * A value, or that value per container width. One generic for every scale in this folder --
 * see responsive.md for why `ResponsiveGap`/`ResponsivePadding` would be three copies of the
 * same idea. `base` is required in the object form: a responsive value with no floor depends
 * on which breakpoint happens to match first, and that is not a decision anybody made.
 *
 * The four steps are container queries (`@app-sm` ... `@app-xl`), never viewport media queries --
 * see responsive.md for why a component must not know how wide the screen is.
 */
export type Responsive<T> = T | { base: T; sm?: T; md?: T; lg?: T; xl?: T }

const isResponsiveValue = <T,>(v: Responsive<T>): v is { base: T; sm?: T; md?: T; lg?: T; xl?: T } =>
    typeof v === "object" && v !== null && "base" in v

/**
 * Resolve a {@link Responsive}<{@link AllowedGap}> into the class list a frame's `cn()` composes.
 * Centralised here rather than in each of the six frames that take `gap`, so the responsive
 * shape is read the same way everywhere -- see principles/README.md's "one place" rule.
 */
export const gapClassNames = (gap: Responsive<AllowedGap>): Array<string | false> => {
    if (!isResponsiveValue(gap)) return [GAP_CLASS[gap]]
    return [
        GAP_CLASS[gap.base],
        gap.sm != null && GAP_CLASS_SM[gap.sm],
        gap.md != null && GAP_CLASS_MD[gap.md],
        gap.lg != null && GAP_CLASS_LG[gap.lg],
        gap.xl != null && GAP_CLASS_XL[gap.xl],
    ]
}

/**
 * A step on the padding scale. An index, never a measurement, same discipline as
 * {@link AllowedGap}. Six rungs (padding.md): `p-5`/`p-7`/`p-9`/`p-10` dropped by evidence,
 * `p-8` folds into `6` -- `airy` never earned a step of its own.
 */
export type AllowedPadding = 1 | 2 | 3 | 4 | 5 | 6

/** {@link AllowedPadding} step -> literal `p-*` class, all four sides. */
export const PADDING_CLASS: Record<AllowedPadding, string> = {
    1: "p-0",
    2: "p-1",
    3: "p-2",
    4: "p-3",
    5: "p-4",
    6: "p-6",
}

/** {@link AllowedPadding} step -> literal `px-*` class. padding.md: the dominant horizontal shape. */
const PADDING_X_CLASS: Record<AllowedPadding, string> = {
    1: "px-0",
    2: "px-1",
    3: "px-2",
    4: "px-3",
    5: "px-4",
    6: "px-6",
}

/** {@link AllowedPadding} step -> literal `py-*` class. padding.md: the dominant vertical shape. */
const PADDING_Y_CLASS: Record<AllowedPadding, string> = {
    1: "py-0",
    2: "py-1",
    3: "py-2",
    4: "py-3",
    5: "py-4",
    6: "py-6",
}

const PADDING_CLASS_SM: Record<AllowedPadding, string> = {
    1: "@app-sm:p-0",
    2: "@app-sm:p-1",
    3: "@app-sm:p-2",
    4: "@app-sm:p-3",
    5: "@app-sm:p-4",
    6: "@app-sm:p-6",
}
const PADDING_X_CLASS_SM: Record<AllowedPadding, string> = {
    1: "@app-sm:px-0",
    2: "@app-sm:px-1",
    3: "@app-sm:px-2",
    4: "@app-sm:px-3",
    5: "@app-sm:px-4",
    6: "@app-sm:px-6",
}
const PADDING_Y_CLASS_SM: Record<AllowedPadding, string> = {
    1: "@app-sm:py-0",
    2: "@app-sm:py-1",
    3: "@app-sm:py-2",
    4: "@app-sm:py-3",
    5: "@app-sm:py-4",
    6: "@app-sm:py-6",
}

const PADDING_CLASS_MD: Record<AllowedPadding, string> = {
    1: "@app-md:p-0",
    2: "@app-md:p-1",
    3: "@app-md:p-2",
    4: "@app-md:p-3",
    5: "@app-md:p-4",
    6: "@app-md:p-6",
}
const PADDING_X_CLASS_MD: Record<AllowedPadding, string> = {
    1: "@app-md:px-0",
    2: "@app-md:px-1",
    3: "@app-md:px-2",
    4: "@app-md:px-3",
    5: "@app-md:px-4",
    6: "@app-md:px-6",
}
const PADDING_Y_CLASS_MD: Record<AllowedPadding, string> = {
    1: "@app-md:py-0",
    2: "@app-md:py-1",
    3: "@app-md:py-2",
    4: "@app-md:py-3",
    5: "@app-md:py-4",
    6: "@app-md:py-6",
}

const PADDING_CLASS_LG: Record<AllowedPadding, string> = {
    1: "@app-lg:p-0",
    2: "@app-lg:p-1",
    3: "@app-lg:p-2",
    4: "@app-lg:p-3",
    5: "@app-lg:p-4",
    6: "@app-lg:p-6",
}
const PADDING_X_CLASS_LG: Record<AllowedPadding, string> = {
    1: "@app-lg:px-0",
    2: "@app-lg:px-1",
    3: "@app-lg:px-2",
    4: "@app-lg:px-3",
    5: "@app-lg:px-4",
    6: "@app-lg:px-6",
}
const PADDING_Y_CLASS_LG: Record<AllowedPadding, string> = {
    1: "@app-lg:py-0",
    2: "@app-lg:py-1",
    3: "@app-lg:py-2",
    4: "@app-lg:py-3",
    5: "@app-lg:py-4",
    6: "@app-lg:py-6",
}

const PADDING_CLASS_XL: Record<AllowedPadding, string> = {
    1: "@app-xl:p-0",
    2: "@app-xl:p-1",
    3: "@app-xl:p-2",
    4: "@app-xl:p-3",
    5: "@app-xl:p-4",
    6: "@app-xl:p-6",
}
const PADDING_X_CLASS_XL: Record<AllowedPadding, string> = {
    1: "@app-xl:px-0",
    2: "@app-xl:px-1",
    3: "@app-xl:px-2",
    4: "@app-xl:px-3",
    5: "@app-xl:px-4",
    6: "@app-xl:px-6",
}
const PADDING_Y_CLASS_XL: Record<AllowedPadding, string> = {
    1: "@app-xl:py-0",
    2: "@app-xl:py-1",
    3: "@app-xl:py-2",
    4: "@app-xl:py-3",
    5: "@app-xl:py-4",
    6: "@app-xl:py-6",
}

type PaddingTable = { all: Record<AllowedPadding, string>; x: Record<AllowedPadding, string>; y: Record<AllowedPadding, string> }

const PADDING_TABLE: Record<"base" | "sm" | "md" | "lg" | "xl", PaddingTable> = {
    base: { all: PADDING_CLASS, x: PADDING_X_CLASS, y: PADDING_Y_CLASS },
    sm: { all: PADDING_CLASS_SM, x: PADDING_X_CLASS_SM, y: PADDING_Y_CLASS_SM },
    md: { all: PADDING_CLASS_MD, x: PADDING_X_CLASS_MD, y: PADDING_Y_CLASS_MD },
    lg: { all: PADDING_CLASS_LG, x: PADDING_X_CLASS_LG, y: PADDING_Y_CLASS_LG },
    xl: { all: PADDING_CLASS_XL, x: PADDING_X_CLASS_XL, y: PADDING_Y_CLASS_XL },
}

/**
 * Padding may differ per axis, because in this tree it usually does (padding.md: the dominant
 * horizontal value is `4`, the dominant vertical value is `2` -- a single scalar cannot say that).
 */
export type PaddingValue = AllowedPadding | { x?: AllowedPadding; y?: AllowedPadding }

const isPaddingAxisValue = (v: PaddingValue): v is { x?: AllowedPadding; y?: AllowedPadding } =>
    typeof v === "object" && v !== null

const paddingValueClassNames = (value: PaddingValue, table: PaddingTable): Array<string | false> => {
    if (!isPaddingAxisValue(value)) return [table.all[value]]
    return [value.x != null && table.x[value.x], value.y != null && table.y[value.y]]
}

/**
 * Resolve a {@link Responsive}<{@link PaddingValue}> into the class list a frame's `cn()`
 * composes. Centralised for the same reason {@link gapClassNames} is.
 */
export const paddingClassNames = (padding: Responsive<PaddingValue>): Array<string | false> => {
    if (!isResponsiveValue(padding)) return paddingValueClassNames(padding, PADDING_TABLE.base)
    return [
        ...paddingValueClassNames(padding.base, PADDING_TABLE.base),
        ...(padding.sm != null ? paddingValueClassNames(padding.sm, PADDING_TABLE.sm) : []),
        ...(padding.md != null ? paddingValueClassNames(padding.md, PADDING_TABLE.md) : []),
        ...(padding.lg != null ? paddingValueClassNames(padding.lg, PADDING_TABLE.lg) : []),
        ...(padding.xl != null ? paddingValueClassNames(padding.xl, PADDING_TABLE.xl) : []),
    ]
}

/**
 * Cross-axis alignment of a track.
 *
 * `baseline` is for rows carrying text at SEVERAL sizes: a price in `h4`
 * beside a struck-through price in `sm` beside a chip in `xs` must line up on the LETTER FEET
 * rather than on the centre of each box, because `center` leaves the three numbers sitting at
 * different heights. The frame could not express that before, so `PriceTag` hand-typed
 * `items-baseline`, and migrating it onto a frame without this step would have BROKEN the
 * layout. Adding a value to the union is additive: no live call-site changes, and the compiler
 * forces every `Record<LayoutAlign, ...>` table to cover the new member.
 */
export type LayoutAlign = "start" | "center" | "end" | "stretch" | "baseline"

/** Main-axis distribution of a flex track. */
export type LayoutJustify = "start" | "center" | "end" | "between"

/** {@link LayoutAlign} -> literal class. */
export const ALIGN_CLASS: Record<LayoutAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
}

/** {@link LayoutJustify} -> literal class. */
export const JUSTIFY_CLASS: Record<LayoutJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
}
