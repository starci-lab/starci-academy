"use client"

import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"

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
     * The single icon (§13b: named slot, not `children` — this block wraps no
     * caller content, it just carries one icon), centered and sized by the base
     * `Button` (icon-size §5a) — pass a bare icon, no size class.
     */
    icon?: ReactNode
    /** `true` → skeleton mirror (round FAB box, same placement) while loading. */
    isSkeleton?: boolean
    /** Extra classes on the button. */
    className?: string
}

/**
 * A bottom-right floating action button — a round, shadowed accent circle. COMPOSES
 * the base `<Button iconOnly>` atom (§6): the atom owns the icon-only look,
 * native icon sizing (§5a) and interaction; this block only layers the fixed
 * placement, round shape, shadow and z-index. Pure + props-only.
 *
 * @param props - {@link FloatingActionButtonProps}
 */
export const FloatingActionButton = ({
    onPress,
    ariaLabel,
    icon,
    isSkeleton = false,
    className,
}: FloatingActionButtonProps) => {
    return (
        <Button
            iconOnly
            variant="primary"
            ariaLabel={ariaLabel}
            onPress={onPress}
            icon={icon}
            isSkeleton={isSkeleton}
            className={cn(
                "fixed bottom-6 right-[calc(var(--app-rail-w,0px)+1.5rem)] z-40 shadow-lg",
                className,
            )}
        />
    )
}
