import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * FRAME — `Measure`: caps readable/content width at a named Tailwind scale step.
 * Owns `max-w-sm|md|lg` so callers never write those classes. Parent owns
 * placement and spacing. Distinct from {@link Container}'s app-measure tokens.
 *
 * Earned by Footer's brand column (`max-w-sm`).
 */

/** Readable-content width step. */
export type MeasureSize = "sm" | "md" | "lg"

/** {@link MeasureSize} → Tailwind max-width class (Footer-proven scale). */
const SIZE_CLASS: Record<MeasureSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
}

/** Props for {@link Measure}. */
export interface MeasureProps {
    /** Content rendered inside the width cap. */
    body: ComponentTypeWithSkeleton
    /** Width step. */
    size: MeasureSize
    /** Renders `body` in its skeleton state. */
    isSkeleton?: boolean
}

/**
 * Caps content to a named readable width. See the file header.
 *
 * @param props - {@link MeasureProps}
 */
const Measure = ({
    body: Body,
    size,
    isSkeleton,
}: MeasureProps) => (
    <div
        data-tier="frame"
        data-component="Measure"
        className={cn(SIZE_CLASS[size])}
    >
        <Body isSkeleton={isSkeleton} />
    </div>
)

export { Measure }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "Measure" } as const
