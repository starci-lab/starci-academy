import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `PageContainer` layout primitive.
 * Authored in Storybook (not `src`); synced to `src` later. No `@/components`
 * imports (design-spec ports stay self-contained).
 */

/** Props for the {@link PageContainer} block. */
export interface PageContainerProps {
    /** Page content, composed by the caller. */
    children: ReactNode
    /** Extra classes on the page shell. */
    className?: string
}

/**
 * Standard page shell — full width of the parent with a right gutter + vertical
 * rhythm. No `mx-auto` centering and no left padding (flush start). Owns page
 * spacing so features (which must not use `p-*`) compose inside it. Override
 * via `className`.
 *
 * @param props - {@link PageContainerProps}
 */
export const PageContainer = ({ children, className }: PageContainerProps) => {
    return (
        <div
            className={cn(
                "w-full py-16 pr-4 @app-sm:pr-6 @app-lg:pr-8",
                className,
            )}
        >
            {children}
        </div>
    )
}
