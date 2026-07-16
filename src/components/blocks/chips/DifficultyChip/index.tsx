import React from "react"
import { Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** The supported difficulty levels a piece of content can be tagged with. */
export type Difficulty = "beginner" | "intermediate" | "advanced" | "insane"

/**
 * The difficulty level → dot color scale — the SINGLE source of truth for the
 * difficulty color ramp. Import this instead of re-declaring the mapping so no
 * surface diverges. A Tailwind palette ramp (sequential, hottest = hardest), not the
 * 5 semantic tokens (`accent`/`success`/`warning`/`danger`/`default`): difficulty is a
 * TIER, not a status, and 4 bậc would otherwise collide onto `danger` twice. Change
 * the ramp here once.
 */
export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
    beginner: "bg-emerald-500",
    intermediate: "bg-amber-500",
    advanced: "bg-orange-500",
    insane: "bg-rose-500",
}

/** Props for {@link DifficultyChip}. */
export interface DifficultyChipProps extends WithClassNames<undefined> {
    /** Difficulty level to display. Drives the dot color via {@link DIFFICULTY_COLOR}. */
    difficulty: Difficulty
    /** Optional label override; defaults to the capitalized difficulty word. */
    label?: ReactNode
}

/** Title-case a difficulty key for the default label. */
const capitalize = (value: Difficulty): string => value.charAt(0).toUpperCase() + value.slice(1)

/**
 * GitHub-style difficulty indicator — a small tier-coloured dot followed by the
 * difficulty word, mirroring {@link import("../LanguageChip").LanguageChip}'s shape.
 * No pill/box; the dot carries the colour. Colour comes from the shared
 * {@link DIFFICULTY_COLOR} scale.
 *
 * @param props - {@link DifficultyChipProps}
 * @see Story: .storybook/stories/blocks/chips/DifficultyChip/DifficultyChip.stories
 */
export const DifficultyChip = ({ difficulty, label, className }: DifficultyChipProps) => {
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <span aria-hidden className={cn("size-3 shrink-0 rounded-full", DIFFICULTY_COLOR[difficulty])} />
            <Typography type="body-xs" color="muted">
                {label ?? capitalize(difficulty)}
            </Typography>
        </span>
    )
}
