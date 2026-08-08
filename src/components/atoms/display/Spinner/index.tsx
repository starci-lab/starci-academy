import { Spinner as HeroSpinner } from "@heroui/react"

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
}: SpinnerBaseProps) => (
    <HeroSpinner
        data-tier="atom"
        data-component="Spinner"
        aria-label={label}
        size={size}
        color={tone}
    />
)

export { SpinnerBase as Spinner }

/** Tier metadata for `Spinner`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "Spinner" } as const
