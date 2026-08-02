import type { ComponentType, ReactNode, SVGProps } from "react"
import { Link as HeroLink, Skeleton as HeroSkeleton, Typography as HeroTypography, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `Typography` — text atom (not HeroUI's `Typography`, though it wraps it internally).
 *
 * One component, one `size` prop that spans body scale (`xs`–`lg`), headings (`h1`–`h5`,
 * wrapping HeroUI's `Typography.Heading`), and `code` (wrapping `HeroTypography
 * type="code"`).
 *
 * Content goes through the `text` prop, not children (matches `Chip`). Other axes:
 * `color`, `weight`, `isItalic`, `isLink`/`isButton` for interactive text,
 * `prefixIcon`/`suffixIcon` as components (the atom controls their size and weight),
 * `truncate`/`lineClamp`, `tabularNums`, and `isSkeleton` for a self-drawn loading bar.
 */

/**
 * An icon passed as a COMPONENT (e.g. `CircleCheck`), rendered by the atom at text scale.
 *
 * `weight` stays open in the type so the atom can force the stroke; the type doesn't
 * declare Phosphor's `Icon` type, so it doesn't lock the tree to one icon library.
 */
export type TypographyIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/**
 * Semantic text color (default = foreground).
 *
 * `info` mirrors `AlertStatus`'s value in `Alert.tsx` — both read the same `--info` token.
 */
export type TypographyColor =
    | "default" | "muted" | "accent" | "success" | "warning" | "danger" | "info"
    /** Foreground tokens for text sitting on a soft-tinted surface (e.g. inside a soft chip/badge). */
    | "accent-soft" | "success-soft"

/**
 * The single size axis for the whole system. Three groups, three implementations
 * inside the atom, one prop for the caller:
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
 * Icon weight per size, placed right next to {@link ICON_CLS} so the two scales can't
 * drift apart.
 *
 * All four steps are under `size-5` (12/14/16/18px < 20px), so all four are `bold` —
 * shrinking an icon thins its stroke, so weight compensates. Written as a table instead
 * of a single `"bold"` constant so that if a step ≥ `size-5` is added later, the table
 * forces whoever edits it to notice that step must be `regular`.
 */
const ICON_WEIGHT: Record<Size, "regular" | "bold"> = { xs: "bold", sm: "bold", base: "bold", lg: "bold" }
/**
 * Skeleton bar height, matched to the glyph height of that size for every size (body,
 * heading, and code). This table is the single source of truth for it.
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
// Every branch resolves color through `COLOR_CLS[color ?? "default"]`, never leaving
// `color` unset — HeroUI's vendor CSS (e.g. `.accordion__body-inner { color: var(--muted) }`)
// bleeds into unstyled text nested inside it, so an explicit class must always be
// emitted here rather than relying on inheritance.
const COLOR_CLS: Record<TypographyColor, string | null> = {
    default: "text-foreground",
    muted: "text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info",
    "accent-soft": "text-accent-soft-foreground",
    "success-soft": "text-success-soft-foreground",
}
/** Same tokens as {@link COLOR_CLS}, `hover:` prefixed — for `isButton`'s `hoverColor`. */
const HOVER_COLOR_CLS: Record<TypographyColor, string> = {
    default: "hover:text-foreground",
    muted: "hover:text-muted",
    accent: "hover:text-accent",
    success: "hover:text-success",
    warning: "hover:text-warning",
    danger: "hover:text-danger",
    info: "hover:text-info",
    "accent-soft": "hover:text-accent-soft-foreground",
    "success-soft": "hover:text-success-soft-foreground",
}
const CLAMP_CLS: Record<1 | 2 | 3, string> = { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3" }
/**
 * `noWrap`'s class — see the prop doc on {@link TypographyOwnProps.noWrap}.
 * Centralized next to {@link CLAMP_CLS} because both are wrapping controls the atom owns.
 */
const NO_WRAP_CLS = "whitespace-nowrap"
/** `preserveWhitespace`'s class — see {@link TypographyOwnProps.preserveWhitespace}. */
const PRESERVE_WHITESPACE_CLS = "whitespace-pre-wrap"
/** `isInline`'s class — see {@link TypographyOwnProps.isInline}. */
const INLINE_CLS = "inline"

/**
 * Text alignment.
 *
 * Uses logical vocabulary (`start`/`end`) rather than physical (`left`/`right`) —
 * matches what HeroUI itself uses, and auto-flips under RTL.
 */
export type TypographyAlign = "start" | "center" | "end"

const ALIGN_CLS: Record<TypographyAlign, string> = {
    start: "text-start",
    center: "text-center",
    end: "text-end",
}

/**
 * `underlineOnGroupHover`'s class — see the prop doc. Centralized so the CSS lives in
 * one place.
 *
 * `decoration-[1.5px]` is pinned explicitly because this renders on a plain span, not a
 * `HeroLink` — HeroUI's real `Link` component bakes that thickness into its base `.link`
 * class, which this span doesn't inherit, so without pinning it the underline would fall
 * back to the browser's thinner default.
 */
const GROUP_HOVER_UNDERLINE_CLS = "underline-offset-4 decoration-[1.5px] decoration-[var(--separator-tertiary)] group-hover:underline"

/**
 * `underlineOnHover`'s class — the same quiet-underline recipe as
 * {@link GROUP_HOVER_UNDERLINE_CLS}, triggered by the text's own hover instead of an
 * ancestor `.group`. Distinct from `isLink`'s plainer default (`underline-offset-2`).
 */
const SELF_HOVER_UNDERLINE_CLS = "underline-offset-4 decoration-[1.5px] decoration-[var(--separator-tertiary)] hover:underline"

/**
 * `parseInlineCode`'s class — same recipe `MarkdownContent`'s inline `<code>` renderer
 * uses, sized relative to surrounding text (`text-[0.9em]`) instead of a fixed
 * `text-sm`, since `Typography` renders at every size from `xs` to a heading.
 */
const INLINE_CODE_CLS = "rounded-md bg-default px-1 py-0 font-mono text-[0.9em] [overflow-wrap:anywhere]"

/**
 * Splits `` `code` `` segments out of otherwise-plain text into styled inline code,
 * without full markdown/block parsing — an accordion title sits inside a `<button>`,
 * and `MarkdownContent` emits block-level markup that can't legally nest there. The
 * only markdown syntax this understands is backticks.
 */
const renderInlineCode = (raw: string): ReactNode => {
    if (!raw.includes("`")) return raw
    const parts = raw.split(/(`[^`]+`)/g)
    if (parts.length === 1) return raw
    return parts.map((part, index) => (
        part.startsWith("`") && part.endsWith("`")
            ? <code key={index} className={INLINE_CODE_CLS}>{part.slice(1, -1)}</code>
            : <span key={index}>{part}</span>
    ))
}

/** Props for every `Typography.<Size>` member. */
interface TypographyOwnProps {
    /** Font size — see {@link TypographySize}. Default `"base"`. */
    size?: TypographySize
    /** Semantic color (foreground/muted, or accent/success/warning/danger). Default `default`. */
    color?: TypographyColor
    /**
     * Font weight: `medium` for working emphasis, `bold` for heading weight. `semibold`
     * is only meaningful at heading `size` (`h1`…`h5`); at body scale it folds to `medium`.
     */
    weight?: "medium" | "semibold" | "bold"
    isItalic?: boolean
    /**
     * `true` → strikes the text through. For a superseded value shown beside the one
     * that replaced it — an original price beside a discounted one.
     */
    isStruck?: boolean
    /**
     * Render as a LINK — HeroUI `Link` (hover underline + a11y). No weight/icon
     * alongside. Color defaults to accent; pass {@link TypographyOwnProps.color}
     * explicitly to override (e.g. a muted external-source link that inherits
     * its surrounding row's tone rather than calling attention to itself).
     */
    isLink?: boolean
    /**
     * Render as a plain pressable `<button>` — text that DOES something but is
     * not navigation (a reply/edit/delete action, a view-more toggle). No
     * underline, no link semantics (unlike {@link isLink}) — only an optional
     * {@link hoverColor} transition. Fires {@link onPress}.
     */
    isButton?: boolean
    /** Color to transition to on hover (only with `isButton`) — e.g. `muted` at rest, `default` (foreground) or `danger` on hover. */
    hoverColor?: TypographyColor
    /** Opens in a new tab (only with `isLink`) — e.g. an external evidence link. */
    target?: string
    /** `rel` attribute (only with `isLink` + `target`), e.g. `"noopener noreferrer"`. */
    rel?: string
    /**
     * `true` → underlines when an ANCESTOR with Tailwind's `.group` class is
     * hovered (not this text's own hover) — the "whole row is the link, only
     * the title underlines" shape (e.g. a list row where `onPress`/`href`
     * lives on the row, not on this text). Foreground color, no accent —
     * unlike {@link isLink}, this does not imply link styling, only the
     * underline-on-row-hover behavior. The atom owns the `group-hover:`
     * class; the CALLER only owns putting `.group` on the actual hoverable
     * ancestor (a composite's row already does this when it says so).
     */
    underlineOnGroupHover?: boolean
    /**
     * `true` → the quiet underline recipe (`underline-offset-4` + a muted
     * decoration color), triggered by THIS text's own hover — the "external
     * evidence link that inherits its row's tone" shape. With {@link isLink},
     * replaces its plainer default underline; without it, still needs a real
     * interactive ancestor (this prop draws no `cursor-pointer` on its own).
     */
    underlineOnHover?: boolean
    /**
     * `true` → `` `code` `` segments inside `text` render as styled inline code
     * (same recipe `MarkdownContent` uses), WITHOUT any other markdown syntax.
     * For text that must stay a `<span>`/inline (an accordion trigger title, a
     * label sitting inside a button) rather than the block-level tree
     * `MarkdownContent` produces. No effect when `text` is not a plain string.
     */
    parseInlineCode?: boolean
    /** Link target (only with `isLink`). */
    href?: string
    /** Link press handler (only with `isLink`). */
    onPress?: () => void
    /** Leading icon as a COMPONENT (not JSX). Atom forces size=font-size. */
    prefixIcon?: TypographyIcon
    /** Trailing icon as a COMPONENT (not JSX). */
    suffixIcon?: TypographyIcon
    /** Arrow icon slides on hover (prefix ←, suffix →). Only used for arrows, not carets. */
    iconSlide?: boolean
    /** Clip to 1 line + ellipsis (parent needs a bounded width). */
    truncate?: boolean
    /** Clamp to N lines (1–3). Wins over `truncate`. */
    lineClamp?: 1 | 2 | 3
    /**
     * `true` → `white-space: nowrap`; text stays on one line without clipping into an
     * ellipsis. Distinct from {@link truncate}: `truncate` forces `overflow-hidden` +
     * `text-overflow: ellipsis`, which needs a bounded-width block to read correctly.
     * This is for a label that must never wrap but already sits in a container sized to
     * fit it — an ellipsis there would be the wrong failure mode and would falsely imply
     * more text is hidden.
     */
    noWrap?: boolean
    /**
     * `true` → `white-space: pre-wrap`; keeps `text`'s own newlines and runs of spaces
     * instead of collapsing them into a single space, while still wrapping at the
     * container edge like normal text. For content that already carries its own line
     * breaks — a pasted error message, a multi-line description saved as plain text —
     * where full markdown parsing or hand-splitting on `\n` into `<br/>`s would be more
     * than the case needs.
     */
    preserveWhitespace?: boolean
    /**
     * `true` → `display: inline`. A body span is already inline by default, so this
     * only changes anything for `size="h1"`…`"h5"` (wraps a real `<h1>`…`<h5>`,
     * block by default) or for `size="code"`/a body span already forced to `block`
     * by {@link truncate}/{@link lineClamp} — a heading- or code-styled run of text
     * that must sit inside a sentence's flow instead of starting its own line.
     */
    isInline?: boolean
    /** Text alignment. Left empty = follows text flow (no class declared). */
    align?: TypographyAlign
    /** `tabular-nums` for numbers/prices/counts, so digits line up in straight columns. */
    tabularNums?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `text` is required when rendering real text, not needed when `isSkeleton` — the
 * shimmer bar has no content. The union enforces that at compile-time, instead of
 * making `text` optional across the board.
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
    isStruck,
    isLink,
    isButton = false,
    hoverColor,
    underlineOnGroupHover = false,
    underlineOnHover = false,
    parseInlineCode = false,
    href,
    target,
    rel,
    onPress,
    prefixIcon: Prefix,
    suffixIcon: Suffix,
    iconSlide = false,
    truncate = false,
    lineClamp,
    noWrap = false,
    preserveWhitespace = false,
    isInline = false,
    align,
    tabularNums = false,
    isSkeleton = false,
    classNames,
    size = "base",
}: TypographyProps) => {
    // Node name = the REAL component being rendered in that branch (not a role word):
    // heading/code/link branches wrap a HeroUI component, so the default name must say
    // which one — "Text" would hide that a `Typography.Heading`/`Typography`/`Link` is
    // actually on screen. The plain body span isn't wrapping any named component, so it
    // keeps the generic "Text" default.
    // The name is written at each branch rather than through a helper. A helper here is invisible
    // to every tool that strips the overlay by token — its own name says nothing about anatomy —
    // so it survives into the app's copy as a call to something that no longer exists.
    const renderedText = parseInlineCode && typeof text === "string" ? renderInlineCode(text) : text

    // ── SKELETON branch — checked BEFORE any size branch, because heading/code also
    // need to render a shimmer bar, not empty text. (If placed under the heading branch,
    // `size="h3" isSkeleton` would render an EMPTY heading — a silent bug tsc/eslint won't catch.)
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="Typography"
                className={cn("inline-block w-1/2 rounded", SKEL_H[size], classNames)}

            />
        )
    }

    // ── HEADING branch: wraps the HeroUI compound `Typography.Heading`.
    if (size in HEADING_LEVEL) {
        return (
            <HeroTypography.Heading
                data-tier="atom"
                data-component="Typography"
                level={HEADING_LEVEL[size]}
                weight={weight}
                className={cn(
                    COLOR_CLS[color ?? "default"],
                    align ? ALIGN_CLS[align] : null,
                    lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null,
                    noWrap && NO_WRAP_CLS,
                    preserveWhitespace && PRESERVE_WHITESPACE_CLS,
                    isInline && INLINE_CLS,
                    underlineOnGroupHover && GROUP_HOVER_UNDERLINE_CLS,
                    classNames,
                )}

            >
                {renderedText}
            </HeroTypography.Heading>
        )
    }

    // ── CODE branch
    if (size === "code") {
        return (
            <HeroTypography
                data-tier="atom"
                data-component="Typography"
                type="code"
                className={cn(
                    COLOR_CLS[color ?? "default"],
                    align ? ALIGN_CLS[align] : null,
                    lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null,
                    noWrap && NO_WRAP_CLS,
                    preserveWhitespace && PRESERVE_WHITESPACE_CLS,
                    isInline && INLINE_CLS,
                    underlineOnGroupHover && GROUP_HOVER_UNDERLINE_CLS,
                    classNames,
                )}

            >
                {renderedText}
            </HeroTypography>
        )
    }

    // ── BODY branch (xs/sm/base/lg) — built with classes
    const bodySize = size as Size
    {
        if (isSkeleton) {
            return (
                <HeroSkeleton
                    data-tier="atom"
                    data-component="Typography"
                    className={cn("inline-block w-1/2 rounded", SKEL_H[bodySize], classNames)}

                />
            )
        }

        // isLink → HeroUI Link (leverages HeroUI: hover underline + a11y). Separate state.
        // Color defaults to accent; an explicit `color` overrides it (e.g. a muted
        // external-source link that inherits its row's tone). `underlineOnHover` swaps
        // the plain default underline for the quiet recipe (see its own prop doc).
        if (isLink) {
            return (
                <HeroLink
                    data-tier="atom"
                    data-component="Typography"
                    href={href}
                    target={target}
                    rel={rel}
                    onPress={onPress}
                    className={cn(
                        TEXT_CLS[bodySize],
                        color ? COLOR_CLS[color] : "text-accent",
                        "cursor-pointer",
                        underlineOnHover ? SELF_HOVER_UNDERLINE_CLS : "underline-offset-2 hover:underline",
                        classNames,
                    )}

                >
                    {renderedText}
                </HeroLink>
            )
        }

        // isButton → a plain pressable button: text that DOES something but is not
        // navigation. No underline (unlike isLink) — only an optional hover color shift.
        if (isButton) {
            return (
                <button
                    data-tier="atom"
                    data-component="Typography"
                    type="button"
                    onClick={onPress}
                    className={cn(
                        TEXT_CLS[bodySize],
                        // `semibold` folds to `font-medium` at body scale — a real third
                        // tier only at heading scale (see the HEADING branch above).
                        weight === "bold" ? "font-bold" : weight === "medium" || weight === "semibold" ? "font-medium" : null,
                        COLOR_CLS[color ?? "default"],
                        "cursor-pointer transition-colors",
                        hoverColor && HOVER_COLOR_CLS[hoverColor],
                        classNames,
                    )}

                >
                    {renderedText}
                </button>
            )
        }

        const hasIcons = Boolean(Prefix || Suffix)
        // Has icon → text is forced to `font-medium` (icon strokes fit medium text
        // better). `semibold` folds to `font-medium` at body scale — a real third tier
        // only at heading scale (see the HEADING branch above).
        //
        // The "no weight" branch emits `font-normal` explicitly rather than no class:
        // HeroUI's own `.accordion__trigger { font-medium }` bleeds into unstyled text
        // nested inside it, so leaving this unset lets an ancestor's font-weight silently win.
        const weightCls = hasIcons
            ? "font-medium"
            : weight === "bold" ? "font-bold" : weight === "medium" || weight === "semibold" ? "font-medium" : "font-normal"
        // Clip text: lineClamp wins over truncate. `block` so overflow can clip (needs a bounded parent width).
        const clampCls = lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null
        const baseCls = cn(
            TEXT_CLS[bodySize],
            weightCls,
            isItalic && "italic",
            isStruck && "line-through",
            COLOR_CLS[color ?? "default"],
            align ? ALIGN_CLS[align] : null,
            tabularNums && "tabular-nums",
            noWrap && NO_WRAP_CLS,
            preserveWhitespace && PRESERVE_WHITESPACE_CLS,
            isInline && INLINE_CLS,
            underlineOnGroupHover && GROUP_HOVER_UNDERLINE_CLS,
            classNames,
        )

        if (hasIcons) {
            // One discriminator, not two. `side` decides both the part name and which way the glyph
            // slides, so the two can never be handed each other's value — and because it still earns
            // its keep with the overlay stripped, the app's copy keeps the same signature.
            const iconSpan = (Icon: TypographyIcon, side: "Prefix" | "Suffix") => (
                // Atom owns the glyph scale — icon inherits currentColor (matches text tone).
                <span
                    aria-hidden
                    // Tailwind v4: `translate` is its OWN CSS property → the transition must target
                    // `translate` (not `transform`), otherwise hover will jump ([[tailwind-v4-scale-is-own-property]]).
                    className={cn(
                        "inline-flex shrink-0",
                        iconSlide && "transition-[translate] duration-200 ease-out",
                        iconSlide && (side === "Prefix" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"),
                    )}
                >
                    <Icon className={ICON_CLS[bodySize]} weight={ICON_WEIGHT[bodySize]} />
                </span>
            )
            return (
                // `group` so the child arrow can hear `group-hover` when iconSlide is on.
                <span data-tier="atom" data-component="Typography" className={cn("inline-flex items-center gap-1", iconSlide && "group", baseCls)}>
                    {Prefix ? iconSpan(Prefix, "Prefix") : null}
                    <span className={cn("min-w-0", clampCls)}>{renderedText}</span>
                    {Suffix ? iconSpan(Suffix, "Suffix") : null}
                </span>
            )
        }
        return (
            <span data-tier="atom" data-component="Typography" className={cn(baseCls, clampCls)}>
                {renderedText}
            </span>
        )
    }
}

/** `Typography` — text atom: one component, one `size` prop spanning body, heading, and code scales. */
export { TypographyBase as Typography }

export const meta = { tier: "atom", name: "Typography" } as const
