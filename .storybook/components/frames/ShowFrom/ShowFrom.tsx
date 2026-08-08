import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * FRAME — `ShowFrom`: shows its body once the nearest `@container` reaches a
 * named step. Owns the `hidden` + `@app-*:flex` visibility switch so callers
 * never write those classes (FRAME-10: name the width as a prop).
 *
 * Inverse of {@link HideAbove}. Earned by Footer wordmark (icon-only below `md`,
 * wordmark from `md` up).
 */

/** Container step the body appears from upward. */
export type ShowFromAt = "sm" | "md" | "lg"

/** {@link ShowFromAt} → show-from-this-step-up class pair. */
const SHOW_FROM_CLASS: Record<ShowFromAt, string> = {
    sm: "hidden @app-sm:flex",
    md: "hidden @app-md:flex",
    lg: "hidden @app-lg:flex",
}

/** Props for {@link ShowFrom}. */
export interface ShowFromProps {
    /** Content shown from `at` upward. */
    body: ComponentTypeWithSkeleton
    /** Container step at which the body becomes visible as flex. */
    at: ShowFromAt
    /** Renders `body` in its skeleton state. */
    isSkeleton?: boolean
}

/**
 * Shows `body` from a named container step upward. See the file header.
 *
 * @param props - {@link ShowFromProps}
 */
const ShowFrom = ({
    body: Body,
    at,
    isSkeleton,
}: ShowFromProps) => (
    <div
        data-tier="frame"
        data-component="ShowFrom"
        className={cn(SHOW_FROM_CLASS[at])}
    >
        <Body isSkeleton={isSkeleton} />
    </div>
)

export { ShowFrom }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "ShowFrom" } as const
