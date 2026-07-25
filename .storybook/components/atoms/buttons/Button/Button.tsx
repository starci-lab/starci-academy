import type { ComponentType, ReactNode, SVGProps } from "react"
import { Button as HeroUIButton, Spinner, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Button.*`: the action-trigger atom namespace over HeroUI Button.
 *
 * Members phân theo HÌNH THÁI trigger:
 *   • `Button.Base`  — nút có NHÃN (text-first action).
 *   • `Button.Icon`  — nút CHỈ-icon (close ×, FAB…), a11y qua `ariaLabel`.
 *   • `Button.Group` — HÀNG nút (cluster) mô tả bằng `items` DỮ LIỆU (không JSX
 *     con) — layout gap, KHÔNG đẻ nghĩa mới.
 *
 * Rules chung (Chip/Input):
 *   • Bọc HeroUI TỐI ĐA (alias `HeroUIButton`), `variant` map THẲNG xuống HeroUI
 *     (fork có `danger` riêng cho destructive — không phải `color` prop).
 *   • STRICT §4: prop hẹp (`variant`/`label`/`onPress`…), KHÔNG mở structure.
 *   • KHÔNG `children` (luật thầy chốt 2026-07-25): nút KHÔNG bọc phần tử khác nên
 *     nhãn đi bằng PROP DỮ LIỆU `label`; cụm nút đi bằng `items` (không JSX con).
 *   • `isSkeleton` → skeleton pill CO-LOCATED (HeroSkeleton, hybrid C — KHÔNG
 *     `Skeleton.*` compound) đúng size nút.
 *   • `isPending`: react-aria `isPending` KHÔNG tự vẽ spinner (chỉ khoá tương
 *     tác) — atom render TAY `<Spinner size="sm" color="current">` + khoá press.
 *   • `icon` LUÔN là COMPONENT (như `Chip`); scale icon SUY TỪ `size` theo luật
 *     gravity "size icon = size chữ" (xem {@link ICON_CLS}) — KHÔNG có prop icon-size.
 *   • `variant` (ý nghĩa) và `size` (tỉ lệ) là HAI TRỤC ĐỘC LẬP.
 *   • Icon lib = gravity (`@gravity-ui/icons`) — KHÔNG có prop `weight`.
 *   • Anatomy tier `atom`; parts gắn `data-anat-part` khi `showAnatomy`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Semantic action intent → maps straight to the HeroUI fork's `variant`. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

/** Scale bậc thang → map THẲNG xuống HeroUI `size` (`md` = default). */
export type ButtonSize = "sm" | "md" | "lg"

/** An icon passed as a COMPONENT (e.g. `Plus`), rendered by the atom at button scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/**
 * ICON SCALE = FONT SCALE (luật gravity: size icon = size chữ — thầy chốt
 * 2026-07-25). `sm`/`md` chữ `text-sm` (14px) → `size-3.5`; `lg` chữ `text-base`
 * (16px) → `size-4`. Áp CHUNG cho cả glyph-duy-nhất (`Button.Icon`) — một luật
 * duy nhất, không có thang riêng theo box.
 *
 * ⚠️ `!` là BẮT BUỘC: HeroUI có rule `.button svg:not(…) { size-5 sm:size-4 }`
 * specificity (0,2,2) — cao hơn class Tailwind thường (0,1,1) nên không ép thì
 * icon rơi về thang HeroUI. Đặt trên SPAN bọc icon (không phải trên button) để
 * KHÔNG đụng `<Spinner>`.
 */
const ICON_CLS: Record<ButtonSize, string> = {
    sm: "[&_svg]:!size-3.5",
    md: "[&_svg]:!size-3.5",
    lg: "[&_svg]:!size-4",
}

/** Skeleton box theo size — mirror đúng chiều cao nút (mobile → `@app-md` desktop). */
const SKELETON_H: Record<ButtonSize, string> = {
    sm: "h-9 @app-md:h-8",
    md: "h-10 @app-md:h-9",
    lg: "h-11 @app-md:h-10",
}
/** Skeleton VUÔNG cho nút chỉ-icon (khớp cả bề ngang iconOnly). */
const SKELETON_SQUARE: Record<ButtonSize, string> = {
    sm: "size-9 @app-md:size-8",
    md: "size-10 @app-md:size-9",
    lg: "size-11 @app-md:size-10",
}

/** Props for the base {@link ButtonBase} — a labelled action trigger. */
export interface ButtonBaseProps {
    /** Nhãn nút qua PROP (bắt buộc — nút chỉ-icon dùng {@link ButtonIcon}). */
    label: ReactNode
    /**
     * Glyph dẫn đầu như COMPONENT (`icon={Plus}`, KHÔNG JSX) — atom ép `size-4`
     * (khớp nhãn text-sm; glyph-duy-nhất của `Button.Icon` to hơn: `size-5`).
     */
    icon?: IconComponent
    /** Action intent → HeroUI variant. Default `primary`. */
    variant?: ButtonVariant
    /** Scale nút. Default `md`. Icon TỰ SUY theo size (caller không chỉnh). */
    size?: ButtonSize
    onPress?: () => void
    /** `true` → disable nút (forward xuống HeroUI, OR với `isPending`). */
    isDisabled?: boolean
    /** `true` → BUSY: chèn `<Spinner>` trước nhãn + khoá press (react-aria không tự vẽ). */
    isPending?: boolean
    /** `true` → render skeleton pill co-located (đúng size nút). */
    isSkeleton?: boolean
    /** `true` → gắn `data-anat-part` cho mỗi part để BlockAnatomy badge. */
    showAnatomy?: boolean
    className?: string
}

/** Base button — nhãn text, `isPending` tự vẽ Spinner, `isSkeleton` mirror pill. */
const ButtonBase = ({
    label,
    icon: Icon,
    variant = "primary",
    size = "md",
    onPress,
    isDisabled = false,
    isPending = false,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: ButtonBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED bởi atom (hybrid C) — pill khớp box HeroUI Button theo size.
        return (
            <HeroSkeleton
                className={cn("w-24 rounded-full", SKELETON_H[size], className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            />
        )
    }
    return (
        <HeroUIButton
            variant={variant}
            size={size}
            onPress={onPress}
            isPending={isPending}
            isDisabled={isDisabled || isPending}
            className={className}
        >
            {isPending ? (
                // BUSY → Spinner THAY glyph (không chồng 2 tín hiệu ở cùng vị trí dẫn đầu).
                <span aria-hidden className="inline-flex shrink-0" data-anat-part={showAnatomy ? "Spinner" : undefined}>
                    <Spinner size="sm" color="current" />
                </span>
            ) : Icon ? (
                // Atom sở hữu glyph scale (§4/§5) — caller không chèn được sai size.
                <span aria-hidden className={cn("inline-flex shrink-0", ICON_CLS[size])} data-anat-part={showAnatomy ? "Icon" : undefined}>
                    <Icon />
                </span>
            ) : null}
            <span data-anat-part={showAnatomy ? "Label" : undefined}>{label}</span>
        </HeroUIButton>
    )
}

/** Props for {@link ButtonIcon} — an icon-only trigger. */
export interface ButtonIconProps {
    /** Glyph as a COMPONENT reference (e.g. `Plus`). Atom ép scale theo `size`. */
    icon: IconComponent
    /** Accessible name (nút không có text → bắt buộc cho a11y). */
    ariaLabel: string
    variant?: ButtonVariant
    /** Scale nút. Default `md`. Glyph bám FONT y như nút có nhãn (một luật duy nhất). */
    size?: ButtonSize
    onPress?: () => void
    isDisabled?: boolean
    /** `true` → BUSY: Spinner thay icon + khoá press. */
    isPending?: boolean
    /** `true` → render skeleton VUÔNG (khớp box iconOnly). */
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
}

/** Icon-only button — glyph duy nhất, a11y qua `ariaLabel`. */
const ButtonIcon = ({
    icon: Icon,
    ariaLabel,
    variant = "primary",
    size = "md",
    onPress,
    isDisabled = false,
    isPending = false,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: ButtonIconProps) => {
    if (isSkeleton) {
        // Skeleton VUÔNG khớp box iconOnly theo size.
        return (
            <HeroSkeleton
                className={cn("rounded-full", SKELETON_SQUARE[size], className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            />
        )
    }
    return (
        <HeroUIButton
            isIconOnly
            variant={variant}
            size={size}
            aria-label={ariaLabel}
            onPress={onPress}
            isPending={isPending}
            isDisabled={isDisabled || isPending}
            className={className}
        >
            {isPending ? (
                <span aria-hidden className="inline-flex shrink-0" data-anat-part={showAnatomy ? "Spinner" : undefined}>
                    <Spinner size="sm" color="current" />
                </span>
            ) : (
                // Atom sở hữu glyph scale (§4/§5) — caller không chèn được sai size.
                <span aria-hidden className={cn("inline-flex shrink-0", ICON_CLS[size])} data-anat-part={showAnatomy ? "Icon" : undefined}>
                    <Icon />
                </span>
            )}
        </HeroUIButton>
    )
}

/** Một nút trong {@link ButtonGroup} — mô tả bằng DỮ LIỆU, không phải JSX. */
export interface ButtonGroupItem {
    /** Khoá React + định danh hành động. */
    key: string
    /** Nhãn nút. Bỏ trống → nút CHỈ-icon (phải có `icon` + `ariaLabel`). */
    label?: ReactNode
    /** Glyph COMPONENT — dẫn đầu (khi có `label`) hoặc glyph duy nhất (khi không). */
    icon?: IconComponent
    /** Accessible name — BẮT BUỘC khi không có `label`. */
    ariaLabel?: string
    /** Action intent → variant. Default `primary`. */
    variant?: ButtonVariant
    onPress?: () => void
    isDisabled?: boolean
    /** `true` → BUSY: Spinner + khoá press (chỉ nút đó). */
    isPending?: boolean
}

/** Props for {@link ButtonGroup} — a row cluster of buttons. */
export interface ButtonGroupProps {
    /**
     * Hàng nút mô tả bằng DỮ LIỆU (§4 STRICT — consumer KHÔNG truyền structure/JSX
     * con). Item có `label` → nút nhãn; không `label` → nút chỉ-icon.
     */
    items: Array<ButtonGroupItem>
    /**
     * Scale CHUNG cả cụm (default `md`) — cluster luôn ĐỒNG CỠ, nên `size` ở
     * group chứ không ở từng item (item chỉ mang vai trò/hành vi).
     */
    size?: ButtonSize
    /** `true` → skeleton mirror đúng số nút (pill/vuông theo từng item). */
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
}

/**
 * `Button.Group` — CLUSTER layout (hàng nút, gap §10). Chỉ xếp hàng, KHÔNG đẻ
 * nghĩa mới (§4) — vai trò/semantic vẫn ở từng item. Atom tự dựng `Button.Base`/
 * `Button.Icon` từ `items` nên caller không lắp sai cấu trúc/size.
 */
const ButtonGroup = ({ items, size = "md", isSkeleton = false, showAnatomy = false, className }: ButtonGroupProps) => (
    <div className={cn("flex items-center gap-2", className)} data-anat-part={showAnatomy ? "Group" : undefined}>
        {items.map(({ key, label, icon, ariaLabel, variant, onPress, isDisabled, isPending }) =>
            label != null ? (
                <ButtonBase
                    key={key}
                    label={label}
                    icon={icon}
                    variant={variant}
                    size={size}
                    onPress={onPress}
                    isDisabled={isDisabled}
                    isPending={isPending}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
            ) : icon != null ? (
                <ButtonIcon
                    key={key}
                    icon={icon}
                    ariaLabel={ariaLabel ?? ""}
                    variant={variant}
                    size={size}
                    onPress={onPress}
                    isDisabled={isDisabled}
                    isPending={isPending}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
            ) : null,
        )}
    </div>
)

/**
 * `Button.*` — action-trigger atom namespace. `Base` (nhãn) · `Icon` (chỉ-icon) ·
 * `Group` (hàng nút). Biến thể thị giác phân bằng `variant` (leaf = prop).
 */
export const Button = Object.assign(ButtonBase, {
    Base: ButtonBase,
    Icon: ButtonIcon,
    Group: ButtonGroup,
})
