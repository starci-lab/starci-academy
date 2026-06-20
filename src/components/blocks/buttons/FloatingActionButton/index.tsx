"use client"

import React from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link FloatingActionButton} block. */
export interface FloatingActionButtonProps extends WithClassNames<undefined> {
    /** Press handler (open the target overlay / action). */
    onPress: () => void
    /** Accessible name for the icon-only button. */
    ariaLabel: string
    /**
     * Optional mascot / image src. When set, the image is rendered LARGER than the
     * circle and anchored so its head pokes out above the top edge.
     */
    imageSrc?: string
    /** Fallback content (icon) when no image is provided. */
    children?: ReactNode
}

/**
 * A bottom-right floating action button — a round, shadowed accent circle. When an
 * `imageSrc` is supplied (e.g. a mascot) the image overflows the top edge so the
 * character "pokes its head out" of the circle; otherwise the `children` icon is
 * centered. Pure + props-only; owns its look + fixed placement.
 *
 * @param props - {@link FloatingActionButtonProps}
 */
export const FloatingActionButton = ({
    onPress,
    ariaLabel,
    imageSrc,
    children,
    className,
}: FloatingActionButtonProps) => {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onPress}
            className={cn(
                "fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                className,
            )}
        >
            {imageSrc ? (
                // mascot pokes its head out above the circle (image taller than the button)
                <img
                    src={imageSrc}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute -top-5 left-1/2 h-[4.5rem] w-auto -translate-x-1/2 object-contain drop-shadow"
                />
            ) : children}
        </button>
    )
}
