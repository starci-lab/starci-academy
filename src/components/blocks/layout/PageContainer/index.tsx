import React from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link PageContainer} block. */
export interface PageContainerProps extends WithClassNames<undefined> {
    /** Page content, composed by the caller. */
    children: ReactNode
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
                "w-full py-16 pr-4 sm:pr-6 lg:pr-8",
                className,
            )}
        >
            {children}
        </div>
    )
}
