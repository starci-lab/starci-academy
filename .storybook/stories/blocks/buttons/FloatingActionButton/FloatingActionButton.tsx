"use client"

import React from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import { Button } from "../Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `FloatingActionButton`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 */

/** Props for the {@link FloatingActionButton} block. */
export interface FloatingActionButtonProps {
    /** Press handler (open the target overlay / action). */
    onPress: () => void
    /** Accessible name for the icon-only button. */
    ariaLabel: string
    /**
     * Icon content, centered and sized by the base `Button` (icon-size §5a) — pass
     * a bare icon, no size class.
     */
    children?: ReactNode
    /** `true` → skeleton mirror (round FAB box, same placement) while loading. */
    isSkeleton?: boolean
    /** Extra classes on the button. */
    className?: string
}

/**
 * A bottom-right floating action button — a round, shadowed accent circle. COMPOSES
 * the base `<Button iconOnly>` primitive (§6): the primitive owns the icon-only look,
 * native icon sizing (§5a) and interaction; this block only layers the fixed
 * placement, round shape, shadow and z-index. Pure + props-only.
 *
 * @param props - {@link FloatingActionButtonProps}
 */
export const FloatingActionButton = ({
    onPress,
    ariaLabel,
    children,
    isSkeleton = false,
    className,
}: FloatingActionButtonProps) => {
    return (
        <Button
            iconOnly
            variant="primary"
            ariaLabel={ariaLabel}
            onPress={onPress}
            icon={children}
            isSkeleton={isSkeleton}
            className={cn(
                "fixed bottom-6 right-[calc(var(--app-rail-w,0px)+1.5rem)] z-40 rounded-full shadow-lg",
                className,
            )}
        />
    )
}
