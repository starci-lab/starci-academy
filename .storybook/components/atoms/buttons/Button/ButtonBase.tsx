import type { ReactNode } from "react"
import { Button as HeroUIButton, Spinner, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import {
    HERO_VARIANT,
    ICON_CLS,
    ICON_WEIGHT,
    SKELETON_H,
    SKELETON_SQUARE,
    SKELETON_W,
    VARIANT_CLS,
    type ButtonSize,
    type ButtonVariant,
    type IconComponent,
} from "./button-tokens"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `ButtonBase`: nút DUY NHẤT của hệ. Bọc HeroUI Button.
 *
 * HAI THAY ĐỔI LỚN 2026-07-26 (thầy chốt):
 *
 * 1. **`Button.Icon` XOÁ, gộp vào đây bằng `isIconOnly`.** Nút chỉ-icon không phải
 *    một hình thái khác — nó là cùng cái nút, bỏ nhãn đi. Nuôi hai component song
 *    song nghĩa là mọi luật (variant · size · weight · skeleton) phải sửa hai chỗ.
 *
 * 2. **`icon` đổi tên thành `prefixIcon`.** Có `suffixIcon` rồi mà đầu kia vẫn tên
 *    `icon` thì đọc không ra cặp; giờ hai ô glyph gọi tên đối xứng, khớp luôn từ
 *    vựng của `Typography` (§5b).
 *
 * Rules:
 *   • STRICT §4: prop hẹp, KHÔNG mở structure. KHÔNG `children` (§12b) — nhãn đi
 *     bằng prop dữ liệu `label`.
 *   • `isIconOnly` ⇒ `prefixIcon` + `ariaLabel` BẮT BUỘC (nút không có chữ thì
 *     screen-reader câm), `label` vô nghĩa.
 *   • `isSkeleton` → shimmer CO-LOCATED (§12c): pill khi có nhãn, VUÔNG khi iconOnly.
 *   • `isPending`: react-aria KHÔNG tự vẽ spinner — atom render TAY + khoá press.
 *   • Glyph: scale + `weight` do ATOM ép theo `size` (§5.0a) — caller chọn "hình gì".
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props chung — TRỪ cụm `label`/`isIconOnly`/`isSkeleton`, xem {@link ButtonBaseProps}. */
interface ButtonBaseOwnProps {
    /**
     * Glyph DẪN ĐẦU như COMPONENT (`prefixIcon={PlusIcon}`, KHÔNG JSX). Khi
     * `isIconOnly` thì đây là glyph DUY NHẤT. Atom ép cả scale lẫn `weight` theo `size`.
     */
    prefixIcon?: IconComponent
    /**
     * Glyph ĐUÔI (sau nhãn). Cùng luật scale/weight với `prefixIcon`.
     * ⚠️ Vô nghĩa khi `isIconOnly` — nút chỉ có một ô glyph.
     */
    suffixIcon?: IconComponent
    /**
     * §5b — ARROW trượt khi hover: `prefixIcon` lùi ←, `suffixIcon` tiến →.
     * CHỈ dùng cho mũi tên điều hướng; caret/glyph tĩnh bật cái này là gây nhiễu.
     */
    iconSlide?: boolean
    /** Action intent → HeroUI variant. Default `primary`. */
    variant?: ButtonVariant
    /** Scale nút. Default `md`. Glyph TỰ SUY theo size (caller không chỉnh). */
    size?: ButtonSize
    onPress?: () => void
    /** `true` → disable nút (forward xuống HeroUI, OR với `isPending`). */
    isDisabled?: boolean
    /** `true` → BUSY: Spinner THAY glyph dẫn đầu + khoá press (react-aria không tự vẽ). */
    isPending?: boolean
    /** `true` → gắn `data-anat-part` cho part để BlockAnatomy badge. */
    showAnatomy?: boolean
    /**
     * Tên `data-anat-part` gắn ở GỐC nút. Component BỌC nó (vd `ButtonGroup`) truyền
     * `"ButtonBase"` xuống để cây deps nhận ra "chỗ này là một ButtonBase" và cho bấm
     * sang story của nó — cây dựng từ DOM nên không có nhãn thì không thấy.
     */
    anatPart?: string
    className?: string
}

/**
 * Ba hình thái loại trừ nhau, ép ở compile-time thay vì tin caller:
 *   • skeleton      — không cần nhãn (shimmer không có chữ).
 *   • chỉ-icon      — `prefixIcon` + `ariaLabel` BẮT BUỘC, không nhãn.
 *   • nút có nhãn   — `label` BẮT BUỘC.
 */
export type ButtonBaseProps = ButtonBaseOwnProps &
    (
        | { isSkeleton: true; isIconOnly?: boolean; label?: ReactNode; ariaLabel?: string }
        | { isSkeleton?: false; isIconOnly: true; prefixIcon: IconComponent; ariaLabel: string; label?: never }
        | { isSkeleton?: false; isIconOnly?: false; label: ReactNode; ariaLabel?: string }
    )

export const ButtonBase = ({
    label,
    prefixIcon: PrefixIcon,
    suffixIcon: SuffixIcon,
    iconSlide = false,
    isIconOnly = false,
    ariaLabel,
    variant = "primary",
    size = "md",
    onPress,
    isDisabled = false,
    isPending = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
}: ButtonBaseProps) => {
    if (isSkeleton) {
        // Shimmer CO-LOCATED (§12c) — VUÔNG khi chỉ-icon, pill khi có nhãn.
        return (
            <HeroSkeleton
                className={cn(
                    "rounded-full",
                    isIconOnly ? SKELETON_SQUARE[size] : cn(SKELETON_W[size], SKELETON_H[size]),
                    className,
                )}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }

    /** Glyph dẫn đầu — hoặc Spinner thay chỗ nó khi BUSY (không chồng 2 tín hiệu một ô). */
    const leading = isPending ? (
        <span aria-hidden className="inline-flex shrink-0">
            <Spinner size="sm" color="current" />
        </span>
    ) : PrefixIcon ? (
        <span
            aria-hidden
            className={cn(
                "inline-flex shrink-0",
                ICON_CLS[size],
                // Tailwind v4: translate là property RIÊNG — phải transition-[translate], KHÔNG phải -transform.
                iconSlide && "transition-[translate] group-hover:-translate-x-0.5",
            )}
        >
            <PrefixIcon weight={ICON_WEIGHT[size]} />
        </span>
    ) : null

    return (
        <HeroUIButton
            isIconOnly={isIconOnly}
            variant={HERO_VARIANT[variant]}
            size={size}
            aria-label={ariaLabel}
            onPress={onPress}
            isPending={isPending}
            isDisabled={isDisabled || isPending}
            className={cn("group", VARIANT_CLS[variant], className)}
            data-anat-part={anatPart}
        >
            {leading}
            {isIconOnly ? null : <span>{label}</span>}
            {!isIconOnly && SuffixIcon ? (
                // Glyph ĐUÔI — iconSlide: TIẾN → khi hover (nghĩa "đi tiếp").
                <span
                    aria-hidden
                    className={cn(
                        "inline-flex shrink-0",
                        ICON_CLS[size],
                        iconSlide && "transition-[translate] group-hover:translate-x-0.5",
                    )}
                >
                    <SuffixIcon weight={ICON_WEIGHT[size]} />
                </span>
            ) : null}
        </HeroUIButton>
    )
}
