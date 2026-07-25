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
 *     atom-layer "size icon = size chữ" (xem {@link ICON_CLS}) — KHÔNG có prop icon-size.
 *   • `variant` (ý nghĩa) và `size` (tỉ lệ) là HAI TRỤC ĐỘC LẬP.
 *   • Icon lib = Phosphor (`@phosphor-icons/react`) — MỘT BỘ DUY NHẤT (§5.0).
 *     `weight` cũng do ATOM ép theo `size` (§5.0a, xem {@link ICON_WEIGHT}) —
 *     caller chỉ chọn "hình gì", KHÔNG chọn "nét dày mỏng".
 *   • Anatomy tier `atom`; parts gắn `data-anat-part` khi `showAnatomy`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Semantic action intent → maps straight to the HeroUI fork's `variant`. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-soft"

/**
 * HeroUI KHÔNG có variant `danger-soft` — chỉ có `danger` đặc. Bản mềm phải mượn một
 * variant trung tính của HeroUI rồi đắp token `danger-soft` lên. Tách hai bảng để khi
 * HeroUI có variant thật thì chỉ xoá đúng một dòng mỗi bảng.
 *
 * Dùng cho hành động phá huỷ ở ngữ cảnh NHẸ (xoá một dòng trong danh sách) — `danger`
 * đặc dành cho nút chốt của hộp thoại xác nhận.
 */
type HeroVariant = "primary" | "secondary" | "ghost" | "danger"

const HERO_VARIANT: Record<ButtonVariant, HeroVariant> = {
    primary: "primary",
    secondary: "secondary",
    ghost: "ghost",
    danger: "danger",
    "danger-soft": "secondary",
}

/** Class đắp thêm cho variant HeroUI không có sẵn. Rỗng = dùng nguyên variant HeroUI. */
const VARIANT_CLS: Partial<Record<ButtonVariant, string>> = {
    "danger-soft": "bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft/70",
}

/** Scale bậc thang → map THẲNG xuống HeroUI `size` (`md` = default). */
export type ButtonSize = "sm" | "md" | "lg"

/**
 * Nét icon Phosphor mà ATOM tự ép (§5.0a) — khai TẠI CHỖ, KHÔNG import kiểu `Icon`
 * của thư viện: khai chặt theo lib là khoá cả cây vào một nhà cung cấp.
 */
type IconWeight = "regular" | "bold"

/**
 * An icon passed as a COMPONENT (e.g. `PlusIcon`), rendered by the atom at button
 * scale. Prop `weight` để OPTIONAL vì atom tự truyền (§5.0a); component icon nào
 * không hiểu `weight` vẫn nhận được.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/**
 * ICON SCALE = FONT SCALE (luật atom-layer: size icon = size chữ — thầy chốt
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

/**
 * WEIGHT THEO SIZE (§5.0a — thầy chốt 2026-07-26): nét Phosphor co theo cỡ, nên
 * icon NHỎ HƠN `size-5` phải `bold` mới nhìn dày BẰNG icon `size-5` regular
 * (regular 16 đơn vị vs bold 24 trên lưới 256). Cả 3 size của nút đều dưới
 * `size-5` (xem {@link ICON_CLS}) → `bold` hết; vẫn giữ map theo size để bậc nào
 * lên `size-5` thì đổi về `regular` tại đúng một chỗ.
 */
const ICON_WEIGHT: Record<ButtonSize, IconWeight> = {
    sm: "bold",
    md: "bold",
    lg: "bold",
}

/** Skeleton box theo size — mirror đúng chiều cao nút (mobile → `@app-md` desktop). */
const SKELETON_H: Record<ButtonSize, string> = {
    sm: "h-9 @app-md:h-8",
    md: "h-10 @app-md:h-9",
    lg: "h-11 @app-md:h-10",
}
/**
 * Bề NGANG skeleton cũng phải theo `size` — nút lớn thì padding ngang lớn hơn nên pill
 * dài hơn. Sửa 2026-07-26: trước đó dùng `w-24` CỨNG cho cả ba bậc, chỉ khác chiều cao
 * 4px ⇒ ba skeleton nhìn y hệt nhau, và footprint sai so với nút thật (layout nhảy khi
 * dữ liệu về). Bản legacy vốn có bảng này, bản live làm rơi mất.
 */
const SKELETON_W: Record<ButtonSize, string> = {
    sm: "w-20",
    md: "w-24",
    lg: "w-28",
}
/** Skeleton VUÔNG cho nút chỉ-icon (khớp cả bề ngang iconOnly). */
const SKELETON_SQUARE: Record<ButtonSize, string> = {
    sm: "size-9 @app-md:size-8",
    md: "size-10 @app-md:size-9",
    lg: "size-11 @app-md:size-10",
}

/** Props chung — TRỪ cặp `label`/`isSkeleton`, xem {@link ButtonBaseProps}. */
interface ButtonBaseOwnProps {
    /**
     * Glyph dẫn đầu như COMPONENT (`icon={PlusIcon}`, KHÔNG JSX) — atom ép CẢ scale
     * ({@link ICON_CLS}) lẫn `weight` ({@link ICON_WEIGHT}) theo `size`.
     */
    icon?: IconComponent
    /**
     * Glyph ĐUÔI (sau nhãn) như COMPONENT. Cùng luật scale/weight với `icon`.
     * Thêm 2026-07-26: trước đó atom chỉ có ô glyph dẫn đầu nên nút "Tiếp tục →"
     * không dựng được, phải chèn tay ở caller — đúng thứ §4 cấm.
     */
    suffixIcon?: IconComponent
    /**
     * §5b — ARROW trượt khi hover: `icon` (dẫn đầu) lùi ←, `suffixIcon` tiến →.
     * CHỈ dùng cho mũi tên điều hướng; caret/glyph tĩnh bật cái này là gây nhiễu.
     */
    iconSlide?: boolean
    /** Action intent → HeroUI variant. Default `primary`. */
    variant?: ButtonVariant
    /** Scale nút. Default `md`. Icon TỰ SUY theo size (caller không chỉnh). */
    size?: ButtonSize
    onPress?: () => void
    /** `true` → disable nút (forward xuống HeroUI, OR với `isPending`). */
    isDisabled?: boolean
    /** `true` → BUSY: chèn `<Spinner>` trước nhãn + khoá press (react-aria không tự vẽ). */
    isPending?: boolean
    /** `true` → gắn `data-anat-part` cho mỗi part để BlockAnatomy badge. */
    showAnatomy?: boolean
    className?: string
}

/**
 * `label` BẮT BUỘC khi render nút thật (nút chỉ-icon dùng {@link ButtonIcon}),
 * KHÔNG cần khi `isSkeleton` — pill shimmer không có nhãn. Cùng khuôn với
 * `TypographyProps`/`ChipBaseProps`.
 */
export type ButtonBaseProps = ButtonBaseOwnProps &
    (
        | { isSkeleton: true; label?: ReactNode }
        | { isSkeleton?: false; label: ReactNode }
    )

/** Base button — nhãn text, `isPending` tự vẽ Spinner, `isSkeleton` mirror pill. */
const ButtonBase = ({
    label,
    icon: Icon,
    suffixIcon: SuffixIcon,
    iconSlide = false,
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
                className={cn("rounded-full", SKELETON_W[size], SKELETON_H[size], className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            />
        )
    }
    return (
        <HeroUIButton
            variant={HERO_VARIANT[variant]}
            size={size}
            onPress={onPress}
            isPending={isPending}
            isDisabled={isDisabled || isPending}
            className={cn("group", VARIANT_CLS[variant], className)}
        >
            {isPending ? (
                // BUSY → Spinner THAY glyph (không chồng 2 tín hiệu ở cùng vị trí dẫn đầu).
                <span aria-hidden className="inline-flex shrink-0" data-anat-part={showAnatomy ? "Spinner" : undefined}>
                    <Spinner size="sm" color="current" />
                </span>
            ) : Icon ? (
                // Atom sở hữu glyph scale + weight (§4/§5) — caller không chèn được sai size/nét.
                // iconSlide: glyph dẫn đầu LÙI ← khi hover (nghĩa "quay lại").
                <span
                    aria-hidden
                    className={cn(
                        "inline-flex shrink-0",
                        ICON_CLS[size],
                        // Tailwind v4: translate là property RIÊNG — phải transition-[translate], KHÔNG phải -transform.
                        iconSlide && "transition-[translate] group-hover:-translate-x-0.5",
                    )}
                    data-anat-part={showAnatomy ? "Icon" : undefined}
                >
                    <Icon weight={ICON_WEIGHT[size]} />
                </span>
            ) : null}
            <span data-anat-part={showAnatomy ? "Label" : undefined}>{label}</span>
            {SuffixIcon ? (
                // Glyph ĐUÔI — iconSlide: TIẾN → khi hover (nghĩa "đi tiếp").
                <span
                    aria-hidden
                    className={cn(
                        "inline-flex shrink-0",
                        ICON_CLS[size],
                        iconSlide && "transition-[translate] group-hover:translate-x-0.5",
                    )}
                    data-anat-part={showAnatomy ? "SuffixIcon" : undefined}
                >
                    <SuffixIcon weight={ICON_WEIGHT[size]} />
                </span>
            ) : null}
        </HeroUIButton>
    )
}

/** Props for {@link ButtonIcon} — an icon-only trigger. */
export interface ButtonIconProps {
    /** Glyph as a COMPONENT reference (e.g. `PlusIcon`). Atom ép scale + weight theo `size`. */
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
                // Atom sở hữu glyph scale + weight (§4/§5) — caller không chèn được sai size/nét.
                <span aria-hidden className={cn("inline-flex shrink-0", ICON_CLS[size])} data-anat-part={showAnatomy ? "Icon" : undefined}>
                    <Icon weight={ICON_WEIGHT[size]} />
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
