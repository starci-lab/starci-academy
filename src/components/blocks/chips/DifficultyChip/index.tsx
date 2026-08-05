import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * TIER VERDICT (BLOCK-7): this folder sits under `blocks/chips`, but the
 * component takes no domain entity and owns no async/loading decision — it is
 * a pure enum-value → dot-colour/label mapping. That is a COMPOSITE (a
 * reusable shape assembled from an atom, COMPOSITE-1), not a block. Kept at
 * this folder path (importers depend on it); only the internal rules changed
 * to the composite tier's.
 *
 * Same shape as `composites/text/DotLabel` (colour dot + inline label, no
 * pill/chip shell) — checked before writing this: `DotLabel` is fixed at
 * `size="sm"` / `gap-1` / a `size-2.5` dot, one step up from this component's
 * `xs` / `gap-2` / `size-3` dot, so reusing it would change the rendered
 * pixels at every existing call site. Not reused for that reason; the shape
 * stays hand-rolled here. Same "no swatch/dot atom exists yet" gap `DotLabel`
 * and `Legend` already flag — the dot stays a raw span until one is added.
 */

/** The supported difficulty levels a piece of content can be tagged with. */
export type Difficulty = "beginner" | "intermediate" | "advanced" | "insane"

/**
 * The difficulty level → dot color scale — the SINGLE source of truth for the
 * difficulty color ramp. Import this instead of re-declaring the mapping so no
 * surface diverges. A Tailwind palette ramp (sequential, hottest = hardest), not the
 * 5 semantic tokens (`accent`/`success`/`warning`/`danger`/`default`): difficulty is a
 * TIER, not a status, and 4 tiers would otherwise collide onto `danger` twice. Change
 * the ramp here once.
 */
export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
    beginner: "bg-emerald-500",
    intermediate: "bg-amber-500",
    advanced: "bg-orange-500",
    insane: "bg-rose-500",
}

/** Props for {@link DifficultyChip}. */
export interface DifficultyChipProps {
    /** Difficulty level to display. Drives the dot color via {@link DIFFICULTY_COLOR}. */
    difficulty: Difficulty
    /** Optional label override; defaults to the capitalized difficulty word. */
    label?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** Title-case a difficulty key for the default label. */
const capitalize = (value: Difficulty): string => value.charAt(0).toUpperCase() + value.slice(1)

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "DifficultyChip" } as const

/**
 * GitHub-style difficulty indicator — a small tier-coloured dot followed by the
 * difficulty word, mirroring {@link import("../LanguageChip").LanguageChip}'s shape.
 * No pill/box; the dot carries the colour. Colour comes from the shared
 * {@link DIFFICULTY_COLOR} scale.
 *
 * @param props - {@link DifficultyChipProps}
 * @see Story: .storybook/stories/blocks/chips/DifficultyChip/DifficultyChip.stories
 */
export const DifficultyChip = ({ difficulty, label, classNames }: DifficultyChipProps) => {
    return (
        <span
            className={cn("inline-flex items-center gap-2", classNames)}
            data-tier="composite"
            data-component="DifficultyChip"
        >
            <span aria-hidden className={cn("size-3 shrink-0 rounded-full", DIFFICULTY_COLOR[difficulty])} />
            <Typography size="xs" color="muted" text={label ?? capitalize(difficulty)} />
        </span>
    )
}
