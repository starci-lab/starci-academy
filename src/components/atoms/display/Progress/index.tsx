import {
    ProgressBar as HeroProgressBar,
    ProgressCircle as HeroProgressCircle,
    Meter as HeroMeter,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `Progress.*` — the progress-indicator atom namespace, wrapping HeroUI.
 *
 * Members, by shape and meaning:
 *   - `ProgressBar` — linear bar for ongoing progress. Determinate (`value`) or
 *     `isIndeterminate` (duration unknown).
 *   - `ProgressCircle` — circular, same progress semantics as Bar.
 *   - `ProgressMeter` — static measurement (capacity, battery level, score).
 *     Always determinate — react-aria's Meter has no indeterminate state.
 *
 * Bar/Circle wrap react-aria's ProgressBar (supports indeterminate); Meter wraps
 * react-aria's Meter (measurement only). Each member owns its size/color mapping
 * and draws its own leaf skeleton (`isSkeleton`). Track/Fill are internal parts —
 * owned by the atom, not inserted by the consumer.
 */

/** Fill tone shared by all three members. */
export type ProgressColor = "accent" | "success" | "warning" | "danger" | "default"

/** Size preset shared by all three members. */
export type ProgressSize = "sm" | "md" | "lg"

/** Shared props for the DETERMINATE-or-indeterminate members (Bar · Circle). */
interface ProgressTrackProps {
    /** Current value in `[0, max]`. Ignored when `isIndeterminate`. */
    value?: number
    /** Maximum value = 100% completion. Default `100`. */
    max?: number
    /** Ongoing work of unknown duration — the fill animates instead of measuring a value. */
    isIndeterminate?: boolean
    /** Fill tone. Default `accent`; pass a semantic tone when the VALUE carries meaning. */
    color?: ProgressColor
    /** Size preset. Default `md`. */
    size?: ProgressSize
    /** Accessible name (announced by screen readers). */
    ariaLabel?: string
    /** Render the leaf skeleton instead of the indicator. */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/** Per-size circle diameter (skeleton match + `ProgressCircle` doesn't force a box). */
const CIRCLE_BOX: Record<ProgressSize, string> = { sm: "size-10", md: "size-14", lg: "size-20" }

/** `ProgressBar` — linear progress (HeroUI ProgressBar). Determinate or indeterminate. */
const ProgressBar = ({
    value = 0,
    max = 100,
    isIndeterminate = false,
    color = "accent",
    size = "md",
    ariaLabel = "Progress",
    isSkeleton = false,
    classNames,
}: ProgressTrackProps) => {
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="ProgressBar"
                className={cn("h-2 w-full rounded-full", classNames)}
            />
        )
    }
    return (
        <HeroProgressBar
            data-tier="atom"
            data-component="ProgressBar"
            aria-label={ariaLabel}
            value={value}
            maxValue={max}
            isIndeterminate={isIndeterminate}
            color={color}
            size={size}
            className={cn("w-full", classNames)}
        >
            <HeroProgressBar.Track
            >
                <HeroProgressBar.Fill
                />
            </HeroProgressBar.Track>
        </HeroProgressBar>
    )
}

/** `ProgressCircle` — circular progress (HeroUI ProgressCircle). Determinate or indeterminate. */
const ProgressCircle = ({
    value = 0,
    max = 100,
    isIndeterminate = false,
    color = "accent",
    size = "md",
    ariaLabel = "Progress",
    isSkeleton = false,
    classNames,
}: ProgressTrackProps) => {
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="ProgressCircle"
                className={cn("rounded-full", CIRCLE_BOX[size], classNames)}
            />
        )
    }
    return (
        <HeroProgressCircle
            data-tier="atom"
            data-component="ProgressCircle"
            aria-label={ariaLabel}
            value={value}
            maxValue={max}
            isIndeterminate={isIndeterminate}
            color={color}
            size={size}
            className={cn(classNames)}
        >
            <HeroProgressCircle.Track
            >
                <HeroProgressCircle.TrackCircle />
                <HeroProgressCircle.FillCircle
                />
            </HeroProgressCircle.Track>
        </HeroProgressCircle>
    )
}

/** Props shared by {@link Meter}, excluding the `value`/`isSkeleton` pair. */
interface MeterOwnProps {
    /** Maximum value = full. Default `100`. */
    max?: number
    /** Tone. Default `accent`; pass success/warning/danger to signal a threshold band. */
    color?: ProgressColor
    /** Size preset. Default `md`. */
    size?: ProgressSize
    /** Accessible name (announced by screen readers). */
    ariaLabel?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `value` is required for a live meter, optional when `isSkeleton` — the
 * shimmer has nothing measured yet to show.
 */
type MeterProps = MeterOwnProps &
    (
        | { isSkeleton: true; value?: number }
        | { isSkeleton?: false; value: number }
    )

/** `ProgressMeter` — static gauge (HeroUI Meter). Always determinate; tone signals a band. */
const Meter = ({
    value,
    max = 100,
    color = "accent",
    size = "md",
    ariaLabel = "Meter",
    isSkeleton = false,
    classNames,
}: MeterProps) => {
    if (isSkeleton) {
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="ProgressGauge"
                className={cn("h-2 w-full rounded-full", classNames)}
            />
        )
    }
    return (
        <HeroMeter
            data-tier="atom"
            data-component="ProgressGauge"
            aria-label={ariaLabel}
            value={value}
            maxValue={max}
            color={color}
            size={size}
            className={cn("w-full", classNames)}
        >
            <HeroMeter.Track
            >
                <HeroMeter.Fill
                />
            </HeroMeter.Track>
        </HeroMeter>
    )
}

/**
 * `Progress.*` — progress-indicator atom namespace. `Bar`/`Circle` are progress
 * (determinate/indeterminate); `Gauge` is a static measurement (determinate only).
 * Exported as `ProgressGauge` rather than `ProgressMeter` because `ProgressMeter`
 * is the name of a separate composite block component.
 */
export { ProgressBar, ProgressCircle, Meter as ProgressGauge }

export const meta = [
    { tier: "atom", name: "ProgressBar" },
    { tier: "atom", name: "ProgressCircle" },
    { tier: "atom", name: "ProgressGauge" },
] as const
