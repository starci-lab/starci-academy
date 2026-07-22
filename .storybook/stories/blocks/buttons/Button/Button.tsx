import React from "react"
import type { ReactNode } from "react"
import { Button as HeroUIButton, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — base `Button` primitive (no `src` yet; synced later).
 *
 * Bọc HeroUI Button (import ALIAS `HeroUIButton`) + thêm **`isSkeleton`** (if-else:
 * true → skeleton mirror, false → button thật). Mọi thứ khác trong họ Button
 * (ButtonGroup, FAB…) COMPOSE primitive NÀY — KHÔNG import HeroUI trực tiếp — để
 * skeleton/icon-size/interaction sống Ở MỘT NƠI (§4).
 *
 * - **icon-size §5a**: trailing `icon` co theo size nút (sm→size-4 · md→size-5 · lg→size-6).
 * - **§5b**: trailing icon trượt khi hover (`group-hover:translate-x-1`).
 * - **isSkeleton**: tự vẽ `Skeleton.Button` đúng size → consumer chỉ bật cờ.
 */

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"

// §5a: icon size ĐỐI CHIẾU text-size của button (sm=text-xs→4 · md=text-sm→5 · lg=text-base→6).
const ICON_CLS: Record<ButtonSize, string> = {
    sm: "[&_svg]:size-4",
    md: "[&_svg]:size-5",
    lg: "[&_svg]:size-6",
}
// Skeleton mirror width theo size nút.
const SKELETON_W: Record<ButtonSize, string> = { sm: "w-20", md: "w-24", lg: "w-28" }
// Skeleton VUÔNG cho iconOnly (khớp chiều cao HeroUI iconOnly button).
const ICON_ONLY_SKEL: Record<ButtonSize, string> = { sm: "size-8", md: "size-9", lg: "size-10" }

/** Props for the base {@link Button} primitive. */
export interface ButtonProps {
    /** Nhãn nút. Bỏ trống khi {@link ButtonProps.iconOnly}. */
    children?: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    /** Icon: TRAILING (cạnh label) — hoặc icon DUY NHẤT khi `iconOnly`. Primitive ép size §5a + trượt §5b (khi có label). */
    icon?: ReactNode
    /** `true` → nút CHỈ-icon (close X, FAB…). Cần {@link ButtonProps.ariaLabel} cho a11y. */
    iconOnly?: boolean
    /** Accessible name khi `iconOnly` (nút không có text). */
    ariaLabel?: string
    /** `true` → render skeleton mirror (đúng size; VUÔNG nếu iconOnly). Consumer chỉ bật cờ. */
    isSkeleton?: boolean
    onPress?: () => void
    className?: string
}

/**
 * Base Button — HeroUI Button + `isSkeleton` mirror + icon-size §5 (primitive sở hữu).
 * @param props - {@link ButtonProps}
 * @see Story: .storybook/stories/blocks/buttons/Button/Button.stories
 */
export const Button = ({
    children,
    variant = "primary",
    size = "md",
    icon,
    iconOnly = false,
    ariaLabel,
    isSkeleton = false,
    onPress,
    className,
}: ButtonProps) => {
    if (isSkeleton) {
        return iconOnly ? (
            <Skeleton className={cn(ICON_ONLY_SKEL[size], "shrink-0 rounded-full", className)} />
        ) : (
            <Skeleton.Button width={SKELETON_W[size]} className={className} />
        )
    }
    if (iconOnly) {
        // Nút chỉ-icon: icon ép size theo size nút (§5a), a11y qua aria-label.
        return (
            <HeroUIButton isIconOnly variant={variant} size={size} aria-label={ariaLabel} onPress={onPress} className={cn(ICON_CLS[size], className)}>
                {icon}
            </HeroUIButton>
        )
    }
    return (
        <HeroUIButton variant={variant} size={size} onPress={onPress} className={cn("group", className)}>
            {children}
            {icon ? (
                <span className={cn(ICON_CLS[size], "transition-transform group-hover:translate-x-1")}>{icon}</span>
            ) : null}
        </HeroUIButton>
    )
}
