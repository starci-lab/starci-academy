"use client"

import React from "react"
import { Button, cn } from "@heroui/react"
import type { ReactNode } from "react"

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
     * Icon content, centered and sized by the icon-only button (HeroUI sizes the
     * child svg to `size-5`, or `size-4` on ≥sm) — pass a bare icon, no size class.
     */
    children?: ReactNode
    /** Extra classes on the button. */
    className?: string
}

/**
 * A bottom-right floating action button — a round, shadowed accent circle wrapping
 * a HeroUI `<Button isIconOnly>` (so the `children` icon inherits the button's
 * native svg sizing). Pure + props-only; owns its look + fixed placement.
 *
 * @param props - {@link FloatingActionButtonProps}
 */
export const FloatingActionButton = ({
    onPress,
    ariaLabel,
    children,
    className,
}: FloatingActionButtonProps) => {
    return (
        <Button
            isIconOnly
            variant="primary"
            aria-label={ariaLabel}
            onPress={onPress}
            className={cn(
                "fixed bottom-6 right-[calc(var(--app-rail-w,0px)+1.5rem)] z-40 rounded-full shadow-lg",
                className,
            )}
        >
            {children}
        </Button>
    )
}
