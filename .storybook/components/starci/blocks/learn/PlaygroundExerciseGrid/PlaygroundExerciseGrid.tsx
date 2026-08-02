import React from "react"
import { ArrowRightIcon, ListChecksIcon, TerminalWindowIcon } from "@phosphor-icons/react"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PlaygroundExerciseGrid` — the Playground hub's core: browse the course's
 * hands-on exercises and open one. Wraps `SurfaceCardPressableGroup` and owns
 * what the composite doesn't: the fixed `TerminalWindowIcon`, the stacked
 * icon + title + step-count-chip tile body, a decorative "Enter playground ->"
 * cue row (plain text, not a nested target — the whole tile is one press
 * target), and the empty branch via `EmptyState`. Two leaves: `Default` (grid,
 * with `isSkeleton` as a state; four guessed placeholder tiles) and `Empty`.
 * Columns `{ base: 1, sm: 2 }`.
 */

/** One hands-on exercise offered by the course. */
export interface PlaygroundExerciseGridItem {
    /** Stable id — also what `onSelect` fires with. */
    id: string
    /** Display title of the exercise. */
    title: string
    /** Number of guided steps in the exercise. */
    stepCount: number
}

/** Props for {@link PlaygroundExerciseGrid}. */
export interface PlaygroundExerciseGridProps {
    /** The course's exercises, in display order. */
    exercises: Array<PlaygroundExerciseGridItem>
    /** Fired with an exercise's id on tile press. */
    onSelect: (id: string) => void
    /**
     * Accessible name for the tile grid — REQUIRED. Without it a screen reader
     * hears N loose press targets with nothing tying them together.
     */
    ariaLabel: string
    /**
     * `true` → the grid draws its own tile mirror (via the composite's generic
     * skeleton tile). `exercises` empty while loading (§12c) → guesses 4
     * tiles, this block's own SSOT convention (see file header).
     */
    isSkeleton?: boolean
}

/** Step-count wording — the block's own vocabulary (§14d.1: a block owns its wording). */
const stepCountLabel = (count: number) => `${count} steps`

/** The closing affordance cue — decorative, never its own press target (see file header, judgement 3). */
const CUE_LABEL = "Enter playground"

/** The library-itself-is-empty wording — this course has no Playground exercises at all. */
const EMPTY_TITLE = "No hands-on exercises yet"
const EMPTY_DESCRIPTION = "This course has no Playground exercise yet — check back later."

/** Guessed placeholder rows for the first fetch (§12c), mirroring `FoundationCategoryList`'s convention. */
const SKELETON_EXERCISES: Array<PlaygroundExerciseGridItem> = Array.from({ length: 4 }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "",
    stepCount: 0,
}))

/**
 * The Playground hub's browse-and-open grid. See the file header for why the
 * icon is fixed, why the cue row stays decorative, and why the empty branch
 * lives here rather than in a separate top-level block.
 *
 * @param props - {@link PlaygroundExerciseGridProps}
 */
const PlaygroundExerciseGrid = ({
    exercises,
    onSelect,
    ariaLabel,
    isSkeleton = false,
}: PlaygroundExerciseGridProps) => {
    // Empty while loading (no real exercise yet) → guess 4 tiles, keeping the
    // right shape for when real data lands (§8). Once real `exercises` exist,
    // keep the EXACT tile count already there.
    const usingPlaceholders = isSkeleton && exercises.length === 0
    const source = usingPlaceholders ? SKELETON_EXERCISES : exercises

    // Depends on the loop variable, so it cannot be hoisted to a const above the
    // return — a small named helper instead, in the style this file already uses.
    const renderExerciseContent = (exercise: PlaygroundExerciseGridItem) => {
        const titleAndSteps = (
            <StackV
                gap={2}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <div>
                            <Typography size="base" weight="bold" truncate text={exercise.title} />
                        </div>
                    ),
                    () => (
                        <div>
                            <Chip tone="default" icon={ListChecksIcon} text={stepCountLabel(exercise.stepCount)} classNames={["w-fit"]} />
                        </div>
                    ),
                ]}
            />
        )

        return (
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <div>
                            <IconTile icon={TerminalWindowIcon} tone="accent" size="lg" />
                        </div>
                    ),
                    () => titleAndSteps,
                    () => (
                        <div>
                            <Typography
                                size="sm"
                                weight="medium"
                                color="accent"
                                suffixIcon={ArrowRightIcon}
                                iconSlide
                                text={CUE_LABEL}
                            />
                        </div>
                    ),
                ]}
            />
        )
    }

    const items: Array<SurfaceCardPressableGroupItem> = source.map((exercise) => ({
        key: exercise.id,
        content: renderExerciseContent(exercise),
        // Guessed placeholder tiles never become press targets — nothing
        // underneath can act yet, and a clickable shimmer tile would be a
        // false affordance (rule 7's boundary: this is NOT a business lock).
        onPress: usingPlaceholders ? undefined : () => onSelect(exercise.id),
    }))

    // The grid is REPLACED outright by the empty message — never while
    // loading, where "empty" just means "not fetched yet" (see file header,
    // judgement on the two leaves).
    if (!isSkeleton && exercises.length === 0) {
        return (
            <div>
                <EmptyState
                    icon={TerminalWindowIcon}
                    title={EMPTY_TITLE}
                    description={EMPTY_DESCRIPTION}


                />
            </div>
        )
    }

    return (
        <div>
            <div>
                <SurfaceCardPressableGroup
                    items={items}
                    ariaLabel={ariaLabel}
                    columns={{ base: 1, sm: 2 }}
                    isSkeleton={isSkeleton}

                />
            </div>
        </div>
    )
}

export { PlaygroundExerciseGrid }
