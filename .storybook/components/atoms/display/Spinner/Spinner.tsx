import { Spinner as HeroSpinner } from "@heroui/react"

/**
 * @noSkeleton the spinner IS the loading indicator — a shimmer standing in for one is circular.
 *
 * ATOM — `Spinner`: wraps HeroUI Spinner directly, only forcing `size`/`tone`.
 *
 * LEAF atom — it composes no atom of our own with a story, so it has no atom-tier dep.
 * It renders one `@heroui/react` import directly, so `HeroSpinner` enters the tree with
 * `tier: "heroui"` (no `storyId`, the library has no story of ours to jump to).
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
