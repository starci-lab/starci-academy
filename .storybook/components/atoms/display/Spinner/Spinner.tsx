import { Spinner as HeroSpinner, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * @noSkeleton the spinner IS the loading indicator — a shimmer standing in for one is circular.
 *
 * The house spinner over HeroUI's. Size and tone are props, not separate components.
 */

/** Spinner size preset. */
export type SpinnerSize = "sm" | "md" | "lg" | "xl"

/** Spinner tone. `current` inherits the surrounding text colour (e.g. inside a button). */
export type SpinnerTone = "accent" | "current" | "danger" | "success" | "warning"

/** Props for {@link SpinnerBase}. */
export interface SpinnerBaseProps {
    /** Size preset. Default `md`. */
    size?: SpinnerSize
    /** Tone. Default `accent`; `current` follows the container's text colour. */
    tone?: SpinnerTone
    /** Accessible name, announced by screen readers. Default `"Loading"`. */
    label?: string
    /** Tags the spinner with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The base spinner atom — a busy indicator.
 *
 * @param props - {@link SpinnerBaseProps}
 */
const SpinnerBase = ({
    size = "md",
    tone = "accent",
    label = "Loading",
    showAnatomy = false,
    classNames,
}: SpinnerBaseProps) => (
    <HeroSpinner
        data-tier="atom"
        data-component="Spinner"
        aria-label={label}
        size={size}
        color={tone}
        className={cn(classNames)}
        data-anat-part={showAnatomy ? "Spinner" : undefined}
    />
)

export { SpinnerBase as Spinner }

export const meta = { tier: "atom", name: "Spinner" } as const
