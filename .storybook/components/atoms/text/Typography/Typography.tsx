import type { ComponentType, ReactNode, SVGProps } from "react"
import { Link as HeroLink, Skeleton as HeroSkeleton, Typography as HeroTypography, cn } from "@heroui/react"

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
 *     Phosphor (atom KHÔNG truyền `weight`). ⚠️ CÓ ICON → text TỰ `font-medium` (nét icon fit medium text).
 *   • `iconSlide` (§5b): ARROW trượt khi hover (prefix←back · suffix→forward). CHỈ arrow, không caret.
 *   • `truncate`/`lineClamp` cắt chữ · `tabularNums` số thẳng cột (§3).
 *   • `isSkeleton` — atom TỰ vẽ text-bar skeleton (hybrid C, §12c).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (e.g. `CircleCheck`), rendered by the atom at text scale. */
export type TypographyIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic text color (default = foreground). */
export type TypographyColor = "default" | "muted" | "accent" | "success" | "warning" | "danger"

/**
 * MỘT TRỤC CỠ CHỮ cho toàn hệ (thầy chốt 2026-07-25 — gộp namespace, chỉ còn
 * `Typography.Base`). Ba nhóm, ba cách hiện thực BÊN TRONG atom, caller chỉ thấy
 * một prop:
 *   • `xs`/`sm`/`base`/`lg` — body scale, dựng bằng class.
 *   • `h1`…`h5`             — bọc compound `HeroTypography.Heading level={N}`.
 *   • `code`                — bọc `HeroTypography type="code"`.
 */
export type TypographySize = "xs" | "sm" | "base" | "lg" | "h1" | "h2" | "h3" | "h4" | "h5" | "code"

/** Cỡ body (nhóm dựng bằng class). */
type Size = "xs" | "sm" | "base" | "lg"

const HEADING_LEVEL: Record<string, 1 | 2 | 3 | 4 | 5> = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5 }

const TEXT_CLS: Record<Size, string> = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" }
const ICON_CLS: Record<Size, string> = { xs: "size-3", sm: "size-3.5", base: "size-4", lg: "size-[18px]" }
/**
 * Chiều cao thanh skeleton = CHIỀU CAO GLYPH của cỡ đó, cho MỌI cỡ (body + heading
 * + code). Atom sở hữu skeleton lá của chính nó (§12c) nên bảng này là SSOT.
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
    default: null, // foreground — không khai báo (§9a)
    muted: "text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
}
const CLAMP_CLS: Record<1 | 2 | 3, string> = { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3" }

/**
 * Canh chữ. Thêm 2026-07-25 sau đợt quét drift: 5 block phải giữ raw HeroUI CHỈ vì
 * atom không có trục này (caption canh giữa trong sơ đồ, hero banner canh động).
 *
 * Từ vựng LOGICAL (`start`/`end`) chứ KHÔNG phải physical (`left`/`right`) — khớp
 * đúng cái HeroUI và các block đang dùng (`align={centered ? "center" : "start"}`),
 * và tự đảo chiều khi RTL. Bản đầu trò đặt `left|right` nên 2 block không khớp kiểu,
 * phải giữ raw — sửa lại cho đúng nguồn.
 */
export type TypographyAlign = "start" | "center" | "end"

const ALIGN_CLS: Record<TypographyAlign, string> = {
    start: "text-start",
    center: "text-center",
    end: "text-end",
}

/** Props for every `Typography.<Size>` member. */
interface TypographyOwnProps {
    /** Cỡ chữ — xem {@link TypographySize}. Default `"base"`. */
    size?: TypographySize
    /** Semantic color (§9a foreground/muted + §2 accent/success/warning/danger). Default = `default`. */
    color?: TypographyColor
    /**
     * Font weight (§9b): `medium` = nhấn làm-việc · `bold` = heading.
     * `semibold` CHỈ hợp lệ với `size` heading (`h1`…`h5`); ở body scale thầy đã chốt
     * dồn `semibold` → `medium` (2026-07-25).
     */
    weight?: "medium" | "semibold" | "bold"
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
    /** Canh chữ. Bỏ trống = theo dòng chảy (không khai báo class). */
    align?: TypographyAlign
    /** `tabular-nums` cho số/giá/đếm (§3 thẳng cột). */
    tabularNums?: boolean
    /** `true` → tag each part với `data-anat-part` cho BlockAnatomy. */
    showAnatomy?: boolean
    /**
     * Tên `data-anat-part` TUỲ Ý cho node chữ (thắng tên mặc định `"Text"`). Thêm
     * 2026-07-25: nhiều block đặt tên riêng cho slot chữ ("Verdict", "Original"…) nên
     * trước đó phải giữ raw HeroUI chỉ vì atom ép cứng một tên.
     */
    anatPart?: string
    className?: string
}

/**
 * `text` BẮT BUỘC khi render chữ thật, KHÔNG cần khi `isSkeleton` — gạch shimmer
 * không có nội dung. Union ép luật đó ở compile-time, thay vì hạ `text` xuống
 * optional đại trà (sẽ mất lưới an toàn của §12b).
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

    // ── nhánh SKELETON — xét TRƯỚC mọi nhánh cỡ, vì heading/code cũng phải ra thanh
    // gạch chứ không phải chữ rỗng. (Để dưới nhánh heading thì `size="h3" isSkeleton`
    // render heading TRỐNG — lỗi câm, tsc/eslint không bắt.)
    if (isSkeleton) {
        return (
            <HeroSkeleton
                className={cn("inline-block w-24 rounded", SKEL_H[size], className)}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }

    // ── nhánh HEADING: bọc compound HeroUI, giữ nguyên hình của `Typography.Heading` cũ.
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

    // ── nhánh CODE
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

    // ── nhánh BODY (xs/sm/base/lg) — dựng bằng class
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

        // isLink → HeroUI Link (tận dụng HeroUI: accent + hover underline + a11y). State riêng.
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
        // RULE (thầy chốt): có icon → text BẮT BUỘC `font-medium` (nét icon fit medium text).
        const weightCls = hasIcons
            ? "font-medium"
            : weight === "bold" ? "font-bold" : weight === "medium" ? "font-medium" : null
        // Cắt chữ: lineClamp thắng truncate. `block` để overflow clip được (cần parent giới hạn width).
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
                    // Tailwind v4: `translate` là CSS property RIÊNG → transition phải target
                    // `translate` (không `transform`), nếu không hover sẽ giật ([[tailwind-v4-scale-is-own-property]]).
                    className={cn("inline-flex shrink-0", iconSlide && "transition-[translate] duration-200 ease-out", iconSlide && slide)}
                >
                    <Icon className={ICON_CLS[bodySize]} />
                </span>
            )
            return (
                // `group` để arrow con nghe `group-hover` khi bật iconSlide (§5b).
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
 * `Typography.*` — text atom. MỘT member duy nhất `Base` (thầy chốt 2026-07-25:
 * gộp namespace). Trước đó có `Xs/Sm/Base/Lg` + `H3/H4/H5/Code` + `Heading` — tám
 * cửa vào cho MỘT khái niệm "chữ", nên mỗi call-site phải chọn member trước khi
 * chọn nội dung. Nay chỉ còn một trục PROP `size` (§6b: biến thể = prop).
 */
export const Typography = Object.assign(TypographyBase, {
    Base: TypographyBase,
})
