import type { ComponentType, ReactNode, SVGProps } from "react"
import { Link as HeroLink, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Typography.*`: custom text atom (KHÔNG phải HeroUI `Typography`).
 *
 * Members theo CỠ — `Typography.Xs` · `.Sm` · `.Base` · `.Lg` (mở rộng dễ: factory
 * `makeTypography("<size>")`). Cùng bộ prop, chỉ đổi cỡ chữ/icon/skeleton.
 *
 * Đúng tư duy `Chip.Base`:
 *   • Content qua PROP `text={...}` (thống nhất `<Chip.Base text=…/>`, KHÔNG children).
 *   • Màu: `color` = default(foreground) | muted (§9a) | accent/success/warning/danger (§2).
 *   • Weight §9b: `weight="medium" | "bold"`. `isItalic`.
 *   • `isLink` → HeroUI `Link` (accent + hover underline + a11y). KHÔNG kèm weight/icon.
 *   • Icon STRICT — `prefixIcon`/`suffixIcon` = COMPONENT (không JSX), atom ép size=font-size,
 *     gravity (không `weight`). ⚠️ CÓ ICON → text TỰ `font-medium` (icon gravity fit medium text).
 *   • `iconSlide` (§5b): ARROW trượt khi hover (prefix←back · suffix→forward). CHỈ arrow, không caret.
 *   • `truncate`/`lineClamp` cắt chữ · `tabularNums` số thẳng cột (§3).
 *   • `isLoading` — atom TỰ vẽ text-bar skeleton (hybrid C).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (e.g. `CircleCheck`), rendered by the atom at text scale. */
export type TypographyIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic text color (default = foreground). */
export type TypographyColor = "default" | "muted" | "accent" | "success" | "warning" | "danger"

type Size = "xs" | "sm" | "base" | "lg"

const TEXT_CLS: Record<Size, string> = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" }
const ICON_CLS: Record<Size, string> = { xs: "size-3", sm: "size-3.5", base: "size-4", lg: "size-[18px]" }
const SKEL_H: Record<Size, string> = { xs: "h-3", sm: "h-[14px]", base: "h-4", lg: "h-[18px]" }
const COLOR_CLS: Record<TypographyColor, string | null> = {
    default: null, // foreground — không khai báo (§9a)
    muted: "text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
}
const CLAMP_CLS: Record<1 | 2 | 3, string> = { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3" }

/** Props for every `Typography.<Size>` member. */
export interface TypographyProps {
    /** Text content — PROP `text={...}` (thống nhất `Chip.Base`, KHÔNG children). */
    text: ReactNode
    /** Semantic color (§9a foreground/muted + §2 accent/success/warning/danger). Default = `default`. */
    color?: TypographyColor
    /** Font weight (§9b): `medium` = nhấn làm-việc · `bold` = heading. Bỏ trống = normal. */
    weight?: "medium" | "bold"
    isItalic?: boolean
    /** Render như LINK — HeroUI `Link` (accent + hover underline + a11y). KHÔNG kèm weight/icon. */
    isLink?: boolean
    /** Link target (chỉ với `isLink`). */
    href?: string
    /** Link press handler (chỉ với `isLink`). */
    onPress?: () => void
    /** Leading icon as a COMPONENT (not JSX). Atom ép size=font-size. */
    prefixIcon?: TypographyIcon
    /** Trailing icon as a COMPONENT (not JSX). */
    suffixIcon?: TypographyIcon
    /** §5b: ARROW icon trượt khi hover (prefix ←, suffix →). CHỈ dùng cho arrow, KHÔNG caret. */
    iconSlide?: boolean
    /** Cắt 1 dòng + ellipsis (cần parent có bề rộng giới hạn). */
    truncate?: boolean
    /** Clamp N dòng (1–3). Thắng `truncate`. */
    lineClamp?: 1 | 2 | 3
    /** `tabular-nums` cho số/giá/đếm (§3 thẳng cột). */
    tabularNums?: boolean
    /** Render leaf skeleton (text bar) thay vì chữ. */
    isLoading?: boolean
    /** `true` → tag each part với `data-anat-part` cho BlockAnatomy. */
    showAnatomy?: boolean
    className?: string
}

const makeTypography = (size: Size) => {
    const Typo = ({
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
        tabularNums = false,
        isLoading = false,
        showAnatomy = false,
        className,
    }: TypographyProps) => {
        if (isLoading) {
            return (
                <HeroSkeleton
                    className={cn("inline-block w-24 rounded", SKEL_H[size], className)}
                    data-anat-part={showAnatomy ? "Skeleton" : undefined}
                />
            )
        }

        // isLink → HeroUI Link (tận dụng HeroUI: accent + hover underline + a11y). State riêng.
        if (isLink) {
            return (
                <HeroLink
                    href={href}
                    onPress={onPress}
                    className={cn(TEXT_CLS[size], "cursor-pointer text-accent underline-offset-2 hover:underline", className)}
                    data-anat-part={showAnatomy ? "Text" : undefined}
                >
                    {text}
                </HeroLink>
            )
        }

        const hasIcons = Boolean(Prefix || Suffix)
        // RULE (thầy chốt): có icon → text BẮT BUỘC `font-medium` (size icon gravity fit medium text).
        const weightCls = hasIcons
            ? "font-medium"
            : weight === "bold" ? "font-bold" : weight === "medium" ? "font-medium" : null
        // Cắt chữ: lineClamp thắng truncate. `block` để overflow clip được (cần parent giới hạn width).
        const clampCls = lineClamp ? CLAMP_CLS[lineClamp] : truncate ? "block truncate" : null
        const baseCls = cn(
            TEXT_CLS[size],
            weightCls,
            isItalic && "italic",
            color ? COLOR_CLS[color] : null,
            tabularNums && "tabular-nums",
            className,
        )

        if (hasIcons) {
            const iconSpan = (Icon: TypographyIcon, part: string, slide: string) => (
                // Atom owns the glyph scale — icon inherits currentColor (matches text tone).
                <span
                    aria-hidden
                    data-anat-part={showAnatomy ? part : undefined}
                    // Tailwind v4: `translate` là CSS property RIÊNG → transition phải target
                    // `translate` (không `transform`), nếu không hover sẽ giật ([[tailwind-v4-scale-is-own-property]]).
                    className={cn("inline-flex shrink-0", iconSlide && "transition-[translate] duration-200 ease-out", iconSlide && slide)}
                >
                    <Icon className={ICON_CLS[size]} />
                </span>
            )
            return (
                // `group` để arrow con nghe `group-hover` khi bật iconSlide (§5b).
                <span className={cn("inline-flex items-center gap-1", iconSlide && "group", baseCls)}>
                    {Prefix ? iconSpan(Prefix, "PrefixIcon", "group-hover:-translate-x-1") : null}
                    <span data-anat-part={showAnatomy ? "Text" : undefined} className={cn("min-w-0", clampCls)}>{text}</span>
                    {Suffix ? iconSpan(Suffix, "SuffixIcon", "group-hover:translate-x-1") : null}
                </span>
            )
        }
        return (
            <span className={cn(baseCls, clampCls)} data-anat-part={showAnatomy ? "Text" : undefined}>
                {text}
            </span>
        )
    }
    return Typo
}

/**
 * `Typography.*` — custom text atom namespace (size-partitioned). Members share
 * {@link TypographyProps}; size sets the text/icon/skeleton scale.
 */
export const Typography = {
    Xs: makeTypography("xs"),
    Sm: makeTypography("sm"),
    Base: makeTypography("base"),
    Lg: makeTypography("lg"),
}
