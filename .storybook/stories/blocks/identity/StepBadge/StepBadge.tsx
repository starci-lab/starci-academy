import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `StepBadge`. Authored in Storybook
 * (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Grounded in the numbered step badge hand-rolled inline in `GithubTeamGate`
 * (`src/components/features/auth/GithubTeamGate/index.tsx`, `stepBadge(n)`:
 * `flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft
 * text-xs font-medium text-accent-soft-foreground`) and generalised against the
 * private `StepIndicator` inside the `Stepper` port
 * (`.storybook/stories/blocks/navigation/Stepper/Stepper.tsx`, states
 * done/current/upcoming) into a standalone, reusable numbered/checked badge so
 * any step-style flow (guided modals, wizards, changelogs…) can drop it in
 * without re-hand-rolling a local `stepBadge` closure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Visual state of the badge. */
export type StepBadgeState = "done" | "active" | "muted"

/** Badge size. */
export type StepBadgeSize = "sm" | "md"

/** Props for the {@link StepBadge} primitive. */
export interface StepBadgeProps {
    /**
     * The step number (or any short glyph) to center in the badge. Ignored
     * when {@link StepBadgeProps.state} is `"done"` — a check replaces it.
     */
    number: ReactNode
    /**
     * Visual state. `"done"` swaps the number for a check and fills success
     * (step completed); `"active"` fills accent-soft (the current step —
     * matches the original hand-rolled badge); `"muted"` reads as a
     * not-yet-reached step. Defaults to `"active"`.
     */
    state?: StepBadgeState
    /** Badge size. Defaults to `"sm"` (20px, matches the hand-rolled `size-5`). */
    size?: StepBadgeSize
    /** Extra classes. */
    className?: string
    /** `true` → render the skeleton mirror (a round placeholder). Consumer just flips the flag. */
    isSkeleton?: boolean
}

/** state → filled tone. */
const STATE: Record<StepBadgeState, string> = {
    done: "bg-success text-success-foreground",
    active: "bg-accent-soft text-accent-soft-foreground",
    muted: "bg-default text-muted",
}

/** size → badge box + text scale + auto icon size (§5: text-xs → size-4, text-sm → size-5). */
const SIZE: Record<StepBadgeSize, string> = {
    sm: "size-5 text-xs [&_svg]:size-4",
    md: "size-6 text-sm [&_svg]:size-5",
}

/** size → skeleton box (mirrors {@link SIZE} without the text/icon scale). */
const SKELETON_SIZE: Record<StepBadgeSize, string> = {
    sm: "size-5",
    md: "size-6",
}

/**
 * A generic, round numbered badge for step-by-step flows — a leading
 * indicator showing either a number/glyph or (once `state="done"`) a check.
 * Pure/props-only; owns its size + tone (§4) so callers just pass the number
 * and a state, e.g. a guided-flow ordered list (`1` active → `2`/`3` muted,
 * flipping to `done` as each step completes).
 *
 * @param props - {@link StepBadgeProps}
 */
export const StepBadge = ({
    number,
    state = "active",
    size = "sm",
    className,
    isSkeleton = false,
}: StepBadgeProps) => {
    if (isSkeleton) {
        return <Skeleton className={cn("rounded-full", SKELETON_SIZE[size], className)} />
    }
    return (
        <span
            aria-hidden
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full font-medium",
                SIZE[size],
                STATE[state],
                className,
            )}
        >
            {state === "done" ? <CheckIcon weight="bold" /> : number}
        </span>
    )
}
