import React from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import { EnumChip } from "../EnumChip"
import type { EnumChipColor, EnumChipEntry } from "../EnumChip"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** The supported difficulty levels a piece of content can be tagged with. */
export type Difficulty = "beginner" | "intermediate" | "advanced" | "insane"

/**
 * The difficulty level → chip color scale — the SINGLE source of truth for the
 * difficulty color ramp. Import this instead of re-declaring the mapping so no
 * surface diverges (easy → success, hardest → accent). Change the ramp here once.
 */
export const DIFFICULTY_COLOR: Record<Difficulty, EnumChipColor> = {
    beginner: "success",
    intermediate: "warning",
    advanced: "danger",
    insane: "accent",
}

/** Props for {@link DifficultyChip}. */
export interface DifficultyChipProps extends WithClassNames<undefined> {
    /** Difficulty level to display. Drives the chip color via {@link DIFFICULTY_COLOR}. */
    difficulty: Difficulty
    /** Optional label override; defaults to the capitalized difficulty word. */
    label?: ReactNode
}

/** Title-case a difficulty key for the default label. */
const capitalize = (value: Difficulty): string => value.charAt(0).toUpperCase() + value.slice(1)

/**
 * Presentational difficulty badge whose color encodes the difficulty intensity.
 * Thin domain map over the shared {@link EnumChip} primitive; colors come from the
 * shared {@link DIFFICULTY_COLOR} scale.
 *
 * @param props - {@link DifficultyChipProps}
 */
export const DifficultyChip = ({ difficulty, label, className }: DifficultyChipProps) => {
    const map: Record<Difficulty, EnumChipEntry> = {
        beginner: { color: DIFFICULTY_COLOR.beginner, label: capitalize("beginner") },
        intermediate: { color: DIFFICULTY_COLOR.intermediate, label: capitalize("intermediate") },
        advanced: { color: DIFFICULTY_COLOR.advanced, label: capitalize("advanced") },
        insane: { color: DIFFICULTY_COLOR.insane, label: capitalize("insane") },
    }
    if (label != null) {
        map[difficulty] = { ...map[difficulty], label }
    }
    return <EnumChip value={difficulty} map={map} className={cn("w-fit", className)} />
}
