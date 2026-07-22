import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Button, type ButtonSize } from "../Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — a NEW primitive (no `src` yet; synced later).
 *
 * Cụm nút hành động: nút CHÍNH (primary) + nút PHỤ (secondary). COMPOSE base
 * {@link Button} (KHÔNG import HeroUI trực tiếp) → skeleton/icon-size/slide sống ở
 * base Button (§4). ButtonGroup chỉ lo: VAI + THỨ TỰ (2 slot có tên), `size`, `gap`,
 * responsive, và **PASS `isSkeleton` xuống mỗi Button** (mỗi nút tự vẽ skeleton).
 *
 * Anatomy đọc `ButtonGroup · nút chính + nút phụ`, KHÔNG `Button ×2`.
 */

export type ButtonGroupSize = ButtonSize

/** Cấu hình 1 nút — group dựng base Button đúng variant + size. */
export interface ButtonGroupAction {
    /** Nhãn nút. */
    label: ReactNode
    /** Icon tuỳ chọn (TRẦN — base Button ép size theo size nút, §5a). */
    icon?: ReactNode
    /** Handler bấm. */
    onPress?: () => void
}

/** Props for the {@link ButtonGroup} primitive. */
export interface ButtonGroupProps {
    /** Nút CHÍNH — variant="primary", đặt TRƯỚC. */
    primary: ButtonGroupAction
    /** Nút PHỤ — variant="secondary", đặt SAU. Bỏ trống → 1 nút. */
    secondary?: ButtonGroupAction
    /** Kích thước áp cho CẢ cụm (truyền xuống từng Button). Mặc định `"md"`. */
    size?: ButtonGroupSize
    /** Ép DỌC + full-width mọi breakpoint. Mặc định: responsive (dọc ở hẹp → ngang từ `@app-sm`). */
    vertical?: boolean
    /** `true` → PASS `isSkeleton` xuống mỗi Button (mỗi nút tự vẽ skeleton). */
    isSkeleton?: boolean
    className?: string
}

export const ButtonGroup = ({
    primary,
    secondary,
    size = "md",
    vertical = false,
    isSkeleton = false,
    className,
}: ButtonGroupProps) => {
    const dir = vertical ? "flex-col" : "flex-col @app-sm:flex-row @app-sm:items-center"
    // Loaded: stretch full-width ở hẹp → auto từ @app-sm. Skeleton: giữ fixed-width (tránh w-auto collapse div rỗng).
    const stretch = isSkeleton ? "" : vertical ? "[&>*]:w-full" : "[&>*]:w-full @app-sm:[&>*]:w-auto"
    // sm → bỏ icon (nút nhỏ trong cụm CTA không mang icon).
    const iconOf = (a: ButtonGroupAction) => (size === "sm" ? undefined : a.icon)

    return (
        <div className={cn("flex gap-2", dir, stretch, className)}>
            <Button variant="primary" size={size} isSkeleton={isSkeleton} icon={iconOf(primary)} onPress={primary.onPress}>
                {primary.label}
            </Button>
            {secondary ? (
                <Button variant="secondary" size={size} isSkeleton={isSkeleton} icon={iconOf(secondary)} onPress={secondary.onPress}>
                    {secondary.label}
                </Button>
            ) : null}
        </div>
    )
}
