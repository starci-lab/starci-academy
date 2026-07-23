import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Button, type ButtonSize, type ButtonVariant } from "../Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — a NEW primitive (no `src` yet; synced later).
 *
 * Container GENERIC/structural cho nhiều nút hành động (§6c) — KHÔNG áp vai nghĩa
 * (không tự gán "cái đầu = primary"). Caller truyền `actions[]`, mỗi phần tử tự
 * chọn `variant`/thứ tự/icon/pending/disabled — container CHỈ lo layout (align,
 * vertical, gap, size áp chung, isSkeleton passthrough).
 *
 * COMPOSE base {@link Button} cho MỌI action (KHÔNG import HeroUI trực tiếp) →
 * skeleton/icon-size/slide/isPending-spinner sống ở base Button (§4).
 *
 * Anatomy đọc `ButtonGroup · N action theo container` — KHÔNG `Button ×N`.
 */

export type ButtonGroupSize = ButtonSize
export type ButtonGroupAlign = "start" | "end" | "between" | "stretch"

/** Cấu hình 1 action — container dựng base Button đúng variant/size cho action đó. */
export interface ButtonGroupAction {
    /** Nhãn nút. Bỏ trống khi {@link ButtonGroupAction.iconOnly}. */
    label?: ReactNode
    /** Vai nút — caller chọn (container không áp đặt). Mặc định `"primary"`. */
    variant?: ButtonVariant
    /** Icon (TRẦN — base Button ép size §5a) — hoặc icon DUY NHẤT khi `iconOnly`. */
    icon?: ReactNode
    /** `true` → nút CHỈ-icon. Cần {@link ButtonGroupAction.ariaLabel} cho a11y. */
    iconOnly?: boolean
    /** Accessible name khi `iconOnly`. */
    ariaLabel?: string
    onPress?: () => void
    /** `true` → action này BUSY (Spinner nội bộ ở base Button). */
    isPending?: boolean
    isDisabled?: boolean
}

/** Props for the {@link ButtonGroup} primitive. */
export interface ButtonGroupProps {
    /** Danh sách action — render theo ĐÚNG thứ tự, mỗi cái = base Button. */
    actions: ButtonGroupAction[]
    /** Kích thước áp cho CẢ cụm. Mặc định `"md"`. */
    size?: ButtonGroupSize
    /**
     * Canh cụm khi ngang: `"stretch"` (mặc định) = full-width dọc ở hẹp → auto-width
     * ngang từ `@app-sm` (hành vi cũ); `"start"`/`"end"`/`"between"` = hàng ngang
     * canh trái/phải/giãn-đều, auto-width mọi breakpoint.
     */
    align?: ButtonGroupAlign
    /** Ép DỌC + full-width mọi breakpoint (bỏ qua `align`). */
    vertical?: boolean
    /** `true` → PASS `isSkeleton` xuống mỗi Button (mỗi nút tự vẽ skeleton). */
    isSkeleton?: boolean
    className?: string
}

const ALIGN_CLS: Record<ButtonGroupAlign, string> = {
    stretch: "flex-col @app-sm:flex-row @app-sm:items-center",
    start: "flex-row items-center justify-start",
    end: "flex-row items-center justify-end",
    between: "flex-row items-center justify-between",
}

export const ButtonGroup = ({
    actions,
    size = "md",
    align = "stretch",
    vertical = false,
    isSkeleton = false,
    className,
}: ButtonGroupProps) => {
    const dir = vertical ? "flex-col" : ALIGN_CLS[align]
    // Stretch width chỉ áp cho vertical hoặc align="stretch" (hành vi cũ); start/end/between = auto-width.
    // Skeleton: giữ fixed-width (tránh w-auto collapse div rỗng) → không ép stretch.
    const stretch = isSkeleton
        ? ""
        : vertical
            ? "[&>*]:w-full"
            : align === "stretch"
                ? "[&>*]:w-full @app-sm:[&>*]:w-auto"
                : ""

    return (
        <div className={cn("flex gap-2", dir, stretch, className)}>
            {actions.map((action, i) => (
                <Button
                    key={i}
                    variant={action.variant ?? "primary"}
                    size={size}
                    icon={action.icon}
                    iconOnly={action.iconOnly}
                    ariaLabel={action.ariaLabel}
                    isPending={action.isPending}
                    isDisabled={action.isDisabled}
                    isSkeleton={isSkeleton}
                    onPress={action.onPress}
                >
                    {action.label}
                </Button>
            ))}
        </div>
    )
}
