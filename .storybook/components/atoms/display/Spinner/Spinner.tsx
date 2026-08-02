import { Spinner as HeroSpinner, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
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
    classNames,
}: SpinnerBaseProps) => (
    <HeroSpinner
        data-tier="atom"
        data-component="Spinner"
        aria-label={label}
        size={size}
        color={tone}
        className={cn(classNames)}

    />
)

export { SpinnerBase as Spinner }

export const meta = { tier: "atom", name: "Spinner" } as const
