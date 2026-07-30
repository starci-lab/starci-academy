import type { ComponentType, ReactNode, SVGProps } from "react"
import { Link as HeroLink, Skeleton as HeroSkeleton, Typography as HeroTypography, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Typography.*`: custom text atom (NOT HeroUI `Typography`).
 *
 * Members by SIZE — `Typography.Xs` · `.Sm` · `.Base` · `.Lg` (easy to extend: factory
 * `makeTypography("<size>")`). Same prop set, only size/icon/skeleton changes.
 *
 * Same thinking as `Chip`:
 *   • Content via PROP `text={...}` (consistent with `<Chip text=…/>`, NOT children).
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

/**
 * Semantic text color (default = foreground).
 *
 * AUDIT 2026-07-30 (feedback ChallengePage/Graded round-9): `info` added,
 * mirrors `AlertStatus`'s addition in `Alert.tsx` — same new `--info` token.
 */
export type TypographyColor = "default" | "muted" | "accent" | "success" | "warning" | "danger" | "info"

/**
 * ONE SIZE AXIS for the whole system (teacher confirmed 2026-07-25 — merged the namespace,
 * only `Typography` remains). Three groups, three implementations INSIDE the atom,
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
// AUDIT 2026-07-30 (feedback ChallengePage/Graded round-3 + round-6): `default` used to be
// `null` ("foreground — not declared", §9a) — relied on CSS inheritance instead of an
// explicit class. HeroUI's vendor `.accordion__body-inner { color: var(--muted) }` bleeds
// through exactly that gap: any Typography inside an accordion PANEL with no explicit
// `color` silently rendered muted, including a nested `.Accordion`'s own trigger title.
// Same class of bug as `weightCls` (round-1) — an atom must own its own value defensively,
// not assume no ancestor will ever override it.
//
// round-3 only fixed the VALUE in this table (`null` → `"text-foreground"`) but every call
// site read it through `color ? COLOR_CLS[color] : null` — when a caller omits `color`
// entirely (the common case, e.g. an accordion trigger title), that ternary never even
// looks at the table, so the bug survived unchanged for every "no color passed" call site.
// round-6 fixed the READ side too: every branch below now does `COLOR_CLS[color ?? "default"]`
// so an unset `color` explicitly resolves through this table instead of skipping it.
const COLOR_CLS: Record<TypographyColor, string | null> = {
    default: "text-foreground",
    muted: "text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info",
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

/**
 * `underlineOnGroupHover` — see the prop doc. Centralized so the complex CSS lives in exactly
 * one place.
 *
 * ⚠️ `decoration-[1.5px]` (thầy 2026-07-29, "lấy css của Link underline của heroui mà?"):
 * real `src`'s "quiet link" call-sites (`CommentItem`, `SubmissionResult`, `RichText`) render
 * through HeroUI's OWN `Link` component, which bakes `decoration-[1.5px]` into its base `.link`
 * class (`node_modules/@heroui/styles/.../link.css`) — the className override at those
 * call-sites only ever touched offset/color, never thickness, because it never needed to.
 * Copying JUST the visible override (offset+color) here — onto a plain heading/code/body span
 * that is NOT a `HeroLink` and inherits no such base class — left thickness at the browser's
 * `auto` default, which reads as thinner/uneven next to the real 1.5px. Pinning it explicitly
 * here is the one class that source's className string never had to spell out for itself.
 */
const GROUP_HOVER_UNDERLINE_CLS = "underline-offset-4 decoration-[1.5px] decoration-[var(--separator-tertiary)] group-hover:underline"

/**
 * `underlineOnHover` — the SAME quiet-underline recipe as {@link GROUP_HOVER_UNDERLINE_CLS},
 * triggered by the text's OWN hover instead of an ancestor `.group` (e.g. a plain inline link
 * that is its own hover target). Real `src` repeats this exact recipe verbatim in several
 * places (`SubmissionResult`, `RichText`) — this is the canonical "quiet link" underline in
 * this design system, distinct from `isLink`'s plainer default (`underline-offset-2`).
 */
const SELF_HOVER_UNDERLINE_CLS = "underline-offset-4 decoration-[1.5px] decoration-[var(--separator-tertiary)] hover:underline"

/**
 * `parseInlineCode` — same recipe `MarkdownContent`'s own inline `<code>` renderer
 * uses (`rounded-md bg-default px-1 py-0 font-mono`), just sized relative to the
 * SURROUNDING text (`text-[0.9em]`) instead of a fixed `text-sm` — `Typography`
 * renders at every size from `xs` to a heading, `MarkdownContent` bodies do not.
 */
const INLINE_CODE_CLS = "rounded-md bg-default px-1 py-0 font-mono text-[0.9em] [overflow-wrap:anywhere]"

/**
 * Splits `` `code` `` segments out of otherwise-plain text into styled inline
 * code, WITHOUT going through full markdown/block parsing (thầy 2026-07-29,
 * "với accordion title thì không thể render dạng markdown" — an accordion title
 * sits inside `Accordion.Trigger`, a `<button>`; `MarkdownContent` emits
 * block-level markup that cannot legally nest there). This is the safe,
 * span-only alternative — the ONLY markdown syntax it understands is backticks.
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
    /** Semantic color (§9a foreground/muted + §2 accent/success/warning/danger). Default = `default`. */
    color?: TypographyColor
    /**
     * Font weight (§9b): `medium` = working emphasis · `bold` = heading.
     * `semibold` is ONLY valid with heading `size` (`h1`…`h5`); at body scale the teacher
     * already confirmed folding `semibold` → `medium` (2026-07-25).
     */
    weight?: "medium" | "semibold" | "bold"
    isItalic?: boolean
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
    align,
    tabularNums = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
    size = "base",
}: TypographyProps) => {
    // Node name = the REAL component being rendered in that branch (not a role word):
    // heading/code/link branches wrap a HeroUI component, so the default name must say
    // which one — "Text" would hide that a `Typography.Heading`/`Typography`/`Link` is
    // actually on screen. The plain body span isn't wrapping any named component, so it
    // keeps the generic "Text" default.
    const partName = (fallback: string) => anatPart ?? (showAnatomy ? fallback : undefined)
    const textPart = partName("Text")
    const renderedText = parseInlineCode && typeof text === "string" ? renderInlineCode(text) : text

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
                    COLOR_CLS[color ?? "default"],
                    align ? ALIGN_CLS[align] : null,
                    lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null,
                    underlineOnGroupHover && GROUP_HOVER_UNDERLINE_CLS,
                    className,
                )}
                data-anat-part={partName("Typography.Heading")}
            >
                {renderedText}
            </HeroTypography.Heading>
        )
    }

    // ── CODE branch
    if (size === "code") {
        return (
            <HeroTypography
                type="code"
                className={cn(
                    COLOR_CLS[color ?? "default"],
                    align ? ALIGN_CLS[align] : null,
                    lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null,
                    underlineOnGroupHover && GROUP_HOVER_UNDERLINE_CLS,
                    className,
                )}
                data-anat-part={partName("Typography")}
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
                    className={cn("inline-block w-24 rounded", SKEL_H[bodySize], className)}
                    data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
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
                    href={href}
                    target={target}
                    rel={rel}
                    onPress={onPress}
                    className={cn(
                        TEXT_CLS[bodySize],
                        color ? COLOR_CLS[color] : "text-accent",
                        "cursor-pointer",
                        underlineOnHover ? SELF_HOVER_UNDERLINE_CLS : "underline-offset-2 hover:underline",
                        className,
                    )}
                    data-anat-part={partName("Link")}
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
                    type="button"
                    onClick={onPress}
                    className={cn(
                        TEXT_CLS[bodySize],
                        // `semibold` folds to `font-medium` at body scale (§9b, teacher 2026-07-25) —
                        // it is only a real third tier at heading scale (see the HEADING branch above).
                        weight === "bold" ? "font-bold" : weight === "medium" || weight === "semibold" ? "font-medium" : null,
                        COLOR_CLS[color ?? "default"],
                        "cursor-pointer transition-colors",
                        hoverColor && HOVER_COLOR_CLS[hoverColor],
                        className,
                    )}
                    data-anat-part={partName("Button")}
                >
                    {renderedText}
                </button>
            )
        }

        const hasIcons = Boolean(Prefix || Suffix)
        // RULE (teacher confirmed): has icon → text MUST be `font-medium` (icon strokes fit medium text).
        // `semibold` folds to `font-medium` at body scale (§9b, teacher 2026-07-25) — it is only
        // a real third tier at heading scale (see the HEADING branch above).
        // AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1): the "no weight" branch
        // used to emit `null` (no class), letting an ancestor's own font-weight bleed through
        // (neo: HeroUI's `.accordion__trigger { font-medium }` leaked into a plain-regular
        // Typography sitting inside an accordion trigger's `titleEnd` slot — measured 500 on
        // the DOM though the atom never asked for it). Emit `font-normal` explicitly so this
        // atom always owns its own weight regardless of what wraps it.
        const weightCls = hasIcons
            ? "font-medium"
            : weight === "bold" ? "font-bold" : weight === "medium" || weight === "semibold" ? "font-medium" : "font-normal"
        // Clip text: lineClamp wins over truncate. `block` so overflow can clip (needs a bounded parent width).
        const clampCls = lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null
        const baseCls = cn(
            TEXT_CLS[bodySize],
            weightCls,
            isItalic && "italic",
            COLOR_CLS[color ?? "default"],
            align ? ALIGN_CLS[align] : null,
            tabularNums && "tabular-nums",
            underlineOnGroupHover && GROUP_HOVER_UNDERLINE_CLS,
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
                    <span data-anat-part={textPart} className={cn("min-w-0", clampCls)}>{renderedText}</span>
                    {Suffix ? iconSpan(Suffix, "SuffixIcon", "group-hover:translate-x-1") : null}
                </span>
            )
        }
        return (
            <span className={cn(baseCls, clampCls)} data-anat-part={textPart}>
                {renderedText}
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
export { TypographyBase as Typography }
