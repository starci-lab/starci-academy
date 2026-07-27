import type { ComponentType, ReactNode, SVGProps } from "react"
import { Link as HeroLink, Skeleton as HeroSkeleton, Typography as HeroTypography, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Typography.*`: custom text atom (NOT HeroUI `Typography`).
 *
 * Members by SIZE — `Typography.Xs` · `.Sm` · `.Base` · `.Lg` (easy to extend: factory
 * `makeTypography("<size>")`). Same prop set, only size/icon/skeleton changes.
 *
 * Same thinking as `Chip.Base`:
 *   • Content via PROP `text={...}` (consistent with `<Chip.Base text=…/>`, NOT children).
 *   • Color: `color` = default(foreground) | muted (§9a) | accent/success/warning/danger (§2).
 *   • Weight §9b: `weight="medium" | "bold"`. `isItalic`.
 *   • `isLink` → HeroUI `Link` (accent + hover underline + a11y). No weight/icon alongside.
 *   • Icon STRICT — `prefixIcon`/`suffixIcon` = COMPONENT (not JSX), the atom forces size=font-size,
 *     Phosphor (the atom does NOT pass `weight`). ⚠️ HAS ICON → text auto `font-medium` (icon strokes fit medium text).
 *   • `iconSlide` (§5b): ARROW slides on hover (prefix←back · suffix→forward). ONLY arrow, no caret.
 *   • `truncate`/`lineClamp` clip text · `tabularNums` for straight-column numbers (§3).
 *   • `isSkeleton` — the atom draws its own text-bar skeleton (hybrid C, §12c).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * An icon passed as a COMPONENT (e.g. `CircleCheck`), rendered by the atom at text scale.
 *
 * `weight` is open in the type so the atom can force the stroke per §5.0a. Still does NOT
 * declare `Icon` for a specific library — `weight` is a generic prop, it doesn't lock the tree to Phosphor.
 */
export type TypographyIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** Semantic text color (default = foreground). */
export type TypographyColor = "default" | "muted" | "accent" | "success" | "warning" | "danger"

/**
 * ONE SIZE AXIS for the whole system (teacher confirmed 2026-07-25 — merged the namespace,
 * only `Typography.Base` remains). Three groups, three implementations INSIDE the atom,
 * the caller only sees one prop:
 *   • `xs`/`sm`/`base`/`lg` — body scale, built with classes.
 *   • `h1`…`h5`             — wraps the compound `HeroTypography.Heading level={N}`.
 *   • `code`                — wraps `HeroTypography type="code"`.
 */
export type TypographySize = "xs" | "sm" | "base" | "lg" | "h1" | "h2" | "h3" | "h4" | "h5" | "code"

/** Body sizes (group built with classes). */
type Size = "xs" | "sm" | "base" | "lg"

const HEADING_LEVEL: Record<string, 1 | 2 | 3 | 4 | 5> = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5 }

const TEXT_CLS: Record<Size, string> = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" }
const ICON_CLS: Record<Size, string> = { xs: "size-3", sm: "size-3.5", base: "size-4", lg: "size-[18px]" }
/**
 * Weight glyph per size (§5.0a) — table placed RIGHT NEXT TO {@link ICON_CLS} so the two
 * scales cannot drift apart.
 *
 * ALL FOUR steps are smaller than `size-5` (12·14·16·18px < 20px) so all four are `bold`:
 * shrinking thins the stroke, so weight must be bumped up to compensate. Written as a TABLE
 * instead of a single `"bold"` constant because if a step ≥ `size-5` is added later, that
 * step must be `regular` — the table forces whoever edits it to see that.
 */
const ICON_WEIGHT: Record<Size, "regular" | "bold"> = { xs: "bold", sm: "bold", base: "bold", lg: "bold" }
/**
 * Skeleton bar height = the GLYPH HEIGHT of that size, for EVERY size (body + heading
 * + code). The atom owns its own leaf skeleton (§12c) so this table is the SSOT.
 */
const SKEL_H: Record<TypographySize, string> = {
    xs: "h-3",
    sm: "h-[14px]",
    base: "h-4",
    lg: "h-[18px]",
    h1: "h-9",
    h2: "h-[30px]",
    h3: "h-6",
    h4: "h-5",
    h5: "h-[18px]",
    code: "h-[14px]",
}
const COLOR_CLS: Record<TypographyColor, string | null> = {
    default: null, // foreground — not declared (§9a)
    muted: "text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
}
const CLAMP_CLS: Record<1 | 2 | 3, string> = { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3" }

/**
 * Text alignment. Added 2026-07-25 after a drift sweep: 5 blocks had to keep raw
 * HeroUI ONLY because the atom lacked this axis (a caption centered in a diagram, a
 * hero banner aligned dynamically).
 *
 * LOGICAL vocabulary (`start`/`end`) rather than physical (`left`/`right`) — matches
 * exactly what HeroUI and the blocks already use (`align={centered ? "center" : "start"}`),
 * and auto-flips under RTL. The first pass used `left|right` so 2 blocks had a type
 * mismatch and had to stay raw — fixed to match the source now.
 */
export type TypographyAlign = "start" | "center" | "end"

const ALIGN_CLS: Record<TypographyAlign, string> = {
    start: "text-start",
    center: "text-center",
    end: "text-end",
}

/** Props for every `Typography.<Size>` member. */
interface TypographyOwnProps {
    /** Font size — see {@link TypographySize}. Default `"base"`. */
    size?: TypographySize
    /** Semantic color (§9a foreground/muted + §2 accent/success/warning/danger). Default = `default`. */
    color?: TypographyColor
    /**
     * Font weight (§9b): `medium` = working emphasis · `bold` = heading.
     * `semibold` is ONLY valid with heading `size` (`h1`…`h5`); at body scale the teacher
     * already confirmed folding `semibold` → `medium` (2026-07-25).
     */
    weight?: "medium" | "semibold" | "bold"
    isItalic?: boolean
    /** Render as a LINK — HeroUI `Link` (accent + hover underline + a11y). No weight/icon alongside. */
    isLink?: boolean
    /** Link target (only with `isLink`). */
    href?: string
    /** Link press handler (only with `isLink`). */
    onPress?: () => void
    /** Leading icon as a COMPONENT (not JSX). Atom forces size=font-size. */
    prefixIcon?: TypographyIcon
    /** Trailing icon as a COMPONENT (not JSX). */
    suffixIcon?: TypographyIcon
    /** §5b: ARROW icon slides on hover (prefix ←, suffix →). Only used for arrows, NOT carets. */
    iconSlide?: boolean
    /** Clip to 1 line + ellipsis (parent needs a bounded width). */
    truncate?: boolean
    /** Clamp to N lines (1–3). Wins over `truncate`. */
    lineClamp?: 1 | 2 | 3
    /** Text alignment. Left empty = follows text flow (no class declared). */
    align?: TypographyAlign
    /** `tabular-nums` for numbers/prices/counts (§3 straight columns). */
    tabularNums?: boolean
    /** `true` → tag each part with `data-anat-part` for BlockAnatomy. */
    showAnatomy?: boolean
    /**
     * Optional `data-anat-part` name for the text node (wins over the default name
     * `"Text"`). Added 2026-07-25: several blocks name the text slot themselves
     * ("Verdict", "Original"…) so before this they had to stay raw HeroUI just because
     * the atom hardcoded one name.
     */
    anatPart?: string
    className?: string
}

/**
 * `text` is REQUIRED when rendering real text, not needed when `isSkeleton` — the
 * shimmer bar has no content. The union enforces that rule at compile-time, instead of
 * making `text` optional across the board (which would drop §12b's safety net).
 */
export type TypographyProps = TypographyOwnProps &
    (
        | { isSkeleton: true; text?: ReactNode }
        | { isSkeleton?: false; text: ReactNode }
    )

const TypographyBase = ({
    text,
    color,
    weight,
    isItalic,
    isLink,
    href,
    onPress,
    prefixIcon: Prefix,
    suffixIcon: Suffix,
    iconSlide = false,
    truncate = false,
    lineClamp,
    align,
    tabularNums = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
    size = "base",
}: TypographyProps) => {
    const textPart = anatPart ?? (showAnatomy ? "Text" : undefined)

    // ── SKELETON branch — checked BEFORE any size branch, because heading/code also
    // need to render a shimmer bar, not empty text. (If placed under the heading branch,
    // `size="h3" isSkeleton` would render an EMPTY heading — a silent bug tsc/eslint won't catch.)
    if (isSkeleton) {
        return (
            <HeroSkeleton
                className={cn("inline-block w-24 rounded", SKEL_H[size], className)}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }

    // ── HEADING branch: wraps the HeroUI compound, keeps the shape of the old `Typography.Heading`.
    if (size in HEADING_LEVEL) {
        return (
            <HeroTypography.Heading
                level={HEADING_LEVEL[size]}
                weight={weight}
                className={cn(
                    color ? COLOR_CLS[color] : null,
                    align ? ALIGN_CLS[align] : null,
                    lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null,
                    className,
                )}
                data-anat-part={textPart}
            >
                {text}
            </HeroTypography.Heading>
        )
    }

    // ── CODE branch
    if (size === "code") {
        return (
            <HeroTypography
                type="code"
                className={cn(
                    color ? COLOR_CLS[color] : null,
                    align ? ALIGN_CLS[align] : null,
                    lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null,
                    className,
                )}
                data-anat-part={textPart}
            >
                {text}
            </HeroTypography>
        )
    }

    // ── BODY branch (xs/sm/base/lg) — built with classes
    const bodySize = size as Size
    {
        if (isSkeleton) {
            return (
                <HeroSkeleton
                    className={cn("inline-block w-24 rounded", SKEL_H[bodySize], className)}
                    data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
                />
            )
        }

        // isLink → HeroUI Link (leverages HeroUI: accent + hover underline + a11y). Separate state.
        if (isLink) {
            return (
                <HeroLink
                    href={href}
                    onPress={onPress}
                    className={cn(TEXT_CLS[bodySize], "cursor-pointer text-accent underline-offset-2 hover:underline", className)}
                    data-anat-part={textPart}
                >
                    {text}
                </HeroLink>
            )
        }

        const hasIcons = Boolean(Prefix || Suffix)
        // RULE (teacher confirmed): has icon → text MUST be `font-medium` (icon strokes fit medium text).
        const weightCls = hasIcons
            ? "font-medium"
            : weight === "bold" ? "font-bold" : weight === "medium" ? "font-medium" : null
        // Clip text: lineClamp wins over truncate. `block` so overflow can clip (needs a bounded parent width).
        const clampCls = lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null
        const baseCls = cn(
            TEXT_CLS[bodySize],
            weightCls,
            isItalic && "italic",
            color ? COLOR_CLS[color] : null,
            align ? ALIGN_CLS[align] : null,
            tabularNums && "tabular-nums",
            className,
        )

        if (hasIcons) {
            const iconSpan = (Icon: TypographyIcon, part: string, slide: string) => (
                // Atom owns the glyph scale — icon inherits currentColor (matches text tone).
                <span
                    aria-hidden
                    data-anat-part={showAnatomy ? part : undefined}
                    // Tailwind v4: `translate` is its OWN CSS property → the transition must target
                    // `translate` (not `transform`), otherwise hover will jump ([[tailwind-v4-scale-is-own-property]]).
                    className={cn("inline-flex shrink-0", iconSlide && "transition-[translate] duration-200 ease-out", iconSlide && slide)}
                >
                    <Icon className={ICON_CLS[bodySize]} weight={ICON_WEIGHT[bodySize]} />
                </span>
            )
            return (
                // `group` so the child arrow can hear `group-hover` when iconSlide is on (§5b).
                <span className={cn("inline-flex items-center gap-1", iconSlide && "group", baseCls)}>
                    {Prefix ? iconSpan(Prefix, "PrefixIcon", "group-hover:-translate-x-1") : null}
                    <span data-anat-part={textPart} className={cn("min-w-0", clampCls)}>{text}</span>
                    {Suffix ? iconSpan(Suffix, "SuffixIcon", "group-hover:translate-x-1") : null}
                </span>
            )
        }
        return (
            <span className={cn(baseCls, clampCls)} data-anat-part={textPart}>
                {text}
            </span>
        )
    }
}

/**
 * `Typography.*` — text atom. A SINGLE member `Base` (teacher confirmed 2026-07-25:
 * merged the namespace). Before this there was `Xs/Sm/Base/Lg` + `H3/H4/H5/Code` +
 * `Heading` — eight entry points for ONE concept "text", so every call site had to pick
 * a member before picking content. Now there's only one PROP axis `size` (§6b: variant = prop).
 */
export const Typography = Object.assign(TypographyBase, {
    Base: TypographyBase,
})
