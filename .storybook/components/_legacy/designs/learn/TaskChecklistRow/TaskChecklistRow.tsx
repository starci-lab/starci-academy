import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `TaskChecklistRow`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Grounded in the per-task checklist rows of
 * `src/components/features/profile/PublicProfile/ProfileProjectsTab/ProfileProjectRoadmap`
 * (the capstone milestone roadmap): each task renders a `CheckCircleIcon`
 * (passed) or `CircleIcon` (not yet passed) beside a truncated title, `gap-3`,
 * `py-2`, the passed title tinted success. This block GENERALISES that row —
 * `label`/`done` become plain props (the hand-roll's score/date trailing meta
 * stays feature-owned, composed BESIDE this row, not baked into it) so any
 * checklist surface (roadmap, mock-interview rubric, onboarding steps…) can
 * reuse ONE row instead of hand-rolling the icon/title pair again.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for the {@link TaskChecklistRow} block. */
export interface TaskChecklistRowProps {
    /** Task title — single line, truncated when it overflows. */
    label: string
    /** Whether the task is done (passed) — drives the icon + title tint. */
    done: boolean
    /** Optional press handler — when set, the row renders as an interactive button. */
    onClick?: () => void
    /** Extra classes on the row root. */
    className?: string
    /** `true` → render the skeleton mirror (icon dot + title bar). Consumer just flips the flag. */
    isSkeleton?: boolean
    /** Storybook-only: emit `data-anat-part` on the icon/title parts for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * Generic checklist row: a `CheckCircleIcon`/`CircleIcon` (phosphor) driven by
 * {@link TaskChecklistRowProps.done} beside a truncated title. Presentational —
 * the only callback it takes is {@link TaskChecklistRowProps.onClick} for a
 * pressable row (e.g. jump to the task). Optional trailing content (score,
 * timestamp…) is feature-owned and composed beside this row, not a prop here.
 */
export const TaskChecklistRow = ({
    label,
    done,
    onClick,
    className,
    isSkeleton = false,
    showAnatomy = false,
}: TaskChecklistRowProps) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex items-center gap-3 py-2", className)}>
                <HeroSkeleton className="size-5 shrink-0 rounded-full" data-anat-part={showAnatomy ? "Skeleton.Icon" : undefined} />
                <Typography size="sm" isSkeleton className="w-1/2" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            </div>
        )
    }

    const content = (
        <>
            {done ? (
                <CheckCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success-soft-foreground" data-anat-part={showAnatomy ? "Icon" : undefined} />
            ) : (
                <CircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted-foreground" data-anat-part={showAnatomy ? "Icon" : undefined} />
            )}
            <Typography size="sm"
                text={label}
                className={cn("min-w-0 flex-1 truncate text-left", done && "text-success-soft-foreground")}
                showAnatomy={showAnatomy}
            />
        </>
    )

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-xl py-2 outline-none transition hover:bg-default focus-visible:ring-2 focus-visible:ring-accent",
                    className,
                )}
            >
                {content}
            </button>
        )
    }

    return (
        <div className={cn("flex items-center gap-3 py-2", className)}>
            {content}
        </div>
    )
}
