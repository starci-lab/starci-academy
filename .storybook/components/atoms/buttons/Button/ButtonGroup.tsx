import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { ButtonBase } from "./ButtonBase"
import type { ButtonSize, ButtonVariant, IconComponent } from "./button-tokens"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `ButtonGroup`: HÀNG nút (cluster) mô tả bằng `items` DỮ LIỆU.
 *
 * ⭐ COMPONENT DUY NHẤT trong họ Button CÓ DEPS: nó `import { ButtonBase }` ở trên.
 * Trước 2026-07-26 cả họ sống chung một file nên quan hệ này vô hình — giờ là import
 * thật, cây deps đọc ra được.
 *
 * Group KHÔNG đẻ nghĩa mới: chỉ layout gap + dựng lại `ButtonBase`. Mọi state của
 * TỪNG nút (`variant`/`isPending`/`isDisabled`) là prop chuyển tiếp, thuộc về
 * `ButtonBase` (§12f) — story của cụm KHÔNG lặp lại chúng.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Một nút trong {@link ButtonGroup} — mô tả bằng DỮ LIỆU, không phải JSX. */
export interface ButtonGroupItem {
    /** Khoá React + định danh hành động. */
    key: string
    /** Nhãn nút. Bỏ trống → nút CHỈ-icon (phải có `prefixIcon` + `ariaLabel`). */
    label?: ReactNode
    /** Glyph COMPONENT — dẫn đầu (khi có `label`) hoặc glyph duy nhất (khi không). */
    prefixIcon?: IconComponent
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

export const ButtonGroup = ({
    items,
    size = "md",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: ButtonGroupProps) => (
    <div className={cn("flex items-center gap-2", className)}>
        {items.map(({ key, label, prefixIcon, ariaLabel, variant, onPress, isDisabled, isPending }) => {
            // Nhãn deps: cây đọc từ DOM nên cụm phải GỌI TÊN cái nó dựng lại.
            const anatPart = showAnatomy ? "Button" : undefined
            const shared = { variant, size, onPress, isDisabled, isPending, anatPart } as const
            if (label != null) {
                return <ButtonBase key={key} label={label} prefixIcon={prefixIcon} isSkeleton={isSkeleton} {...shared} />
            }
            if (prefixIcon == null) return null
            return (
                <ButtonBase
                    key={key}
                    isIconOnly
                    prefixIcon={prefixIcon}
                    ariaLabel={ariaLabel ?? ""}
                    isSkeleton={isSkeleton}
                    {...shared}
                />
            )
        })}
    </div>
)
