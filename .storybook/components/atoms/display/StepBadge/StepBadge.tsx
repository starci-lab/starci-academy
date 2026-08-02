import React from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `StepBadge`: the system's one numbered circle for multi-step flows.
 * 
 * 1 PROP = 1 LEAF. Every prop with a shape gets its own leaf rendering every value it can
 * produce: `state` · `size` · `isSkeleton`. Props with no shape (`className`) get no leaf.
 * `number` gets no leaf — it's free-form content, not a finite union.
 * 
 * `showAnatomy` (group E) tags `data-anat-part` onto the real root (`"Badge"`), the skeleton
 * root (`"Skeleton"`), and the check-icon wrapper when `state="done"` (`"Icon"`). The `States`
 * leaf turns anatomy on at the `done` cell so both `Badge` and `Icon` surface in one tree.
 * 
 * `Badge` (root span) and `Icon` (wraps the passed `CheckIcon`) are plain elements, not
 * importable components, so neither is named in `annotate`. Only `Skeleton` is a real,
 * direct HeroUI import — `tier: "heroui"`, no `storyId`.
 */
export type StepBadgeState = "done" | "active" | "muted"

/** Badge size. */
export type StepBadgeSize = "sm" | "md"

/** Props shared, excluding the `number`/`isSkeleton` pair — see {@link StepBadgeProps}. */
interface StepBadgeOwnProps {
    /**
     * Visual state. `"done"` swaps the number for a check and fills success
     * (step completed); `"active"` fills accent-soft (the current step —
     * matches the original hand-rolled badge); `"muted"` reads as a
     * not-yet-reached step. Defaults to `"active"`.
     */
    state?: StepBadgeState
    /** Badge size. Defaults to `"sm"` (20px, matches the hand-rolled `size-5`). */
    size?: StepBadgeSize
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `number` is required to render the live badge, optional when `isSkeleton` —
 * the pill shimmer has no content to center.
 */
export type StepBadgeProps = StepBadgeOwnProps &
    ({ isSkeleton: true; number?: ReactNode } | { isSkeleton?: false; number: ReactNode })

/** state → filled tone. */
const STATE: Record<StepBadgeState, string> = {
    done: "bg-success text-success-foreground",
    active: "bg-accent-soft text-accent-soft-foreground",
    muted: "bg-default text-muted",
}

/** size → badge box + text scale + auto icon size (text-xs → size-4, text-sm → size-5). */
const SIZE: Record<StepBadgeSize, string> = {
    sm: "size-5 text-xs [&_svg]:size-4",
    md: "size-6 text-sm [&_svg]:size-5",
}

/**
 * size → icon weight, kept beside {@link SIZE} so the two scales stay aligned.
 * `sm` renders the icon at `size-4` (16px, below the 20px baseline), so `bold`
 * compensates for the smaller glyph; `md` renders at `size-5` (20px, the
 * baseline), so `regular` applies.
 */
const ICON_WEIGHT: Record<StepBadgeSize, "regular" | "bold"> = {
    sm: "bold",
    md: "regular",
}

/** size → skeleton box (mirrors {@link SIZE} without the text/icon scale). */
const SKELETON_SIZE: Record<StepBadgeSize, string> = {
    sm: "size-5",
    md: "size-6",
}

/**
 * A generic, round numbered badge for step-by-step flows — a leading
 * indicator showing either a number/glyph or (once `state="done"`) a check.
 * Pure/props-only; owns its size + tone so callers just pass the number
 * and a state, e.g. a guided-flow ordered list (`1` active → `2`/`3` muted,
 * flipping to `done` as each step completes).
 *
 * @param props - {@link StepBadgeProps}
 */
const StepBadgeBase = ({
    number,
    state = "active",
    size = "sm",
    classNames,
    isSkeleton = false,
}: StepBadgeProps) => {
    if (isSkeleton) {
        // Checked before any visual branch — there's no `number` to center yet.
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="StepBadge"
                className={cn("rounded-full", SKELETON_SIZE[size], classNames)}

            />
        )
    }
    // The root span IS the StepBadge atom, so it hard-codes its own name.
    return (
        <span
            aria-hidden
            data-tier="atom"
            data-component="StepBadge"

            className={cn(
                "flex shrink-0 items-center justify-center rounded-full font-medium",
                SIZE[size],
                STATE[state],
                classNames,
            )}
        >
            {state === "done" ? (
                <span aria-hidden className="inline-flex shrink-0">
                    <CheckIcon weight={ICON_WEIGHT[size]} />
                </span>
            ) : (
                number
            )}
        </span>
    )
}

/** `StepBadge.*` — numbered step-badge namespace. */
export { StepBadgeBase as StepBadge }

export const meta = { tier: "atom", name: "StepBadge" } as const
