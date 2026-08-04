import type { ComponentType, SVGProps } from "react"

/**
 * Shared tokens for the `Button` family — not a component. Kept in its own file so
 * no member has to import another member just to reach these tables; nothing here
 * is exported as a component, so this file does not appear in the deps tree.
 */

/** Semantic action intent, mapped to the HeroUI fork's `variant` via {@link HERO_VARIANT}. */
export type ButtonVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "ghost"
    | "danger"
    | "danger-soft"

/** HeroUI's own variant set. `danger-soft` has no HeroUI equivalent — see {@link HERO_VARIANT}. */
type HeroVariant = "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger"

/** Maps this atom's semantic `ButtonVariant` to the HeroUI fork's own `variant` values. */
export const HERO_VARIANT: Record<ButtonVariant, HeroVariant> = {
    primary: "primary",
    secondary: "secondary",
    tertiary: "tertiary",
    outline: "outline",
    ghost: "ghost",
    danger: "danger",
    "danger-soft": "secondary",
}

/** Classes layered on for variants HeroUI has no native equivalent for. Empty = use the HeroUI variant as-is. */
export const VARIANT_CLS: Partial<Record<ButtonVariant, string>> = {
    "danger-soft": "bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft/70",
}

/** Size scale, mapped directly to HeroUI's `size` (`md` = default). */
export type ButtonSize = "sm" | "md" | "lg"

/** Where the content sits inside the control — `ButtonBase`'s glyph+label row, or `ButtonGroup`'s row of buttons. */
export type ButtonAlign = "start" | "end" | "between"

/**
 * `between` bakes in `w-full`: `justify-between` with no room to spread does
 * nothing, so a caller that wants the two edges pushed apart needs the full-width
 * half too. `start`/`end` stay width-agnostic; a caller that also wants full width
 * can still reach for `classNames={["w-full"]}`.
 */
export const ALIGN_CLS: Record<ButtonAlign, string> = {
    start: "justify-start",
    end: "justify-end",
    between: "w-full justify-between",
}

/** Phosphor icon stroke weight, declared locally rather than imported from the icon library's own type. */
type IconWeight = "regular" | "bold"

/** An icon passed as a component (e.g. `PlusIcon`), rendered at button scale. `weight` is optional — the atom supplies it. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/**
 * Icon scale matches the button's font scale: `sm`/`md` text is `text-sm` (14px) →
 * `size-3.5`; `lg` text is `text-base` (16px) → `size-4`.
 *
 * The `!` is required: HeroUI's own rule `.button svg:not(…) { size-5 sm:size-4 }`
 * has higher specificity (0,2,2) than a plain Tailwind class (0,1,1), so without it
 * the icon falls back to HeroUI's scale. Applied to the wrapping span rather than
 * the button itself so it does not affect `<Spinner>`.
 */
export const ICON_CLS: Record<ButtonSize, string> = {
    sm: "[&_svg]:!size-3.5",
    md: "[&_svg]:!size-3.5",
    lg: "[&_svg]:!size-4",
}

/**
 * Phosphor's stroke thins as glyph size shrinks, so an icon below `size-5` needs
 * `bold` to read as visually thick as a `size-5` regular icon (regular is 16 units
 * vs bold 24 on Phosphor's 256 grid). All three button sizes are below `size-5`
 * (see {@link ICON_CLS}), so all map to `bold`; kept as a per-size table so a size
 * that reaches `size-5` can switch to `regular` in one place.
 */
export const ICON_WEIGHT: Record<ButtonSize, IconWeight> = {
    sm: "bold",
    md: "bold",
    lg: "bold",
}

/** Skeleton height per size, mirroring the real button's height (mobile → `@app-md` desktop). */
export const SKELETON_H: Record<ButtonSize, string> = {
    sm: "h-9 @app-md:h-8",
    md: "h-10 @app-md:h-9",
    lg: "h-11 @app-md:h-10",
}

/**
 * Skeleton width must scale with size too: a larger button has more horizontal
 * padding, so its pill is wider. Keeping this in step with the real button's
 * footprint avoids a layout shift once the button's content arrives.
 */
export const SKELETON_W: Record<ButtonSize, string> = {
    sm: "w-20",
    md: "w-24",
    lg: "w-28",
}

/** Square skeleton for icon-only buttons, matching their icon-only footprint. */
export const SKELETON_SQUARE: Record<ButtonSize, string> = {
    sm: "size-9 @app-md:size-8",
    md: "size-10 @app-md:size-9",
    lg: "size-11 @app-md:size-10",
}

/**
 * The label is a raw `<span>` (ATOM-3: an atom cannot import another house atom,
 * so it cannot go through `Typography`). This maps `ButtonSize` to the literal
 * Tailwind size class that reproduces the font size `button.css` already
 * assigns, so the two can't drift: the base `.button` rule is `text-sm` and only
 * `.button--lg` overrides it to `text-base` — `sm`/`md` never diverge from the
 * base, hence both map to `"text-sm"`.
 */
export const LABEL_SIZE: Record<ButtonSize, string> = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
}
