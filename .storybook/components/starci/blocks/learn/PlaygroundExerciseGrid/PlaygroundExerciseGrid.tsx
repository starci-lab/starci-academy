import React from "react"
import { ArrowRightIcon, ListChecksIcon, TerminalWindowIcon } from "@phosphor-icons/react"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundExerciseGrid`: the core function of the Playground hub
 * screen — browse the course's hands-on exercises and open one.
 *
 * REUSE, NOT A REBUILD (the exact trap `ContentModeNav`'s file header warns
 * about — a "new" grid-of-press-target-cards is almost always wrong). Wraps
 * `SurfaceCardPressableGroup`, the catalog's grid-of-press-target-cards
 * composite: the SAME shape `src`'s `PlaygroundCard` grid is, just previously
 * hand-rolled from a bare HeroUI `Card`/`Button` instead of going through it.
 * This block owns everything the composite itself doesn't know:
 *
 *   1. THE ICON IS ALWAYS `TerminalWindowIcon`, via the `IconTile` atom. An
 *      exercise tile is never a generic press target with a caller-chosen
 *      icon — it is always "a hands-on terminal exercise", so the block hard-
 *      codes the glyph rather than exposing an `icon` prop that could drift
 *      per call-site.
 *
 *   2. THE TILE BODY IS ICON + TITLE + STEP-COUNT CHIP, STACKED. Built as the
 *      composite's `content` (not its `icon` leading-slot — that slot lays the
 *      icon out BESIDE the content in a row, which is the wrong shape here;
 *      `PlaygroundCard`'s own layout stacks the tile icon above its text).
 *
 *   3. THE CLOSING "Enter playground →" CUE ROW is DECORATIVE affordance text,
 *      not a second interactive element. Because the whole tile is ONE press
 *      target (`SurfaceCardPressableGroup`'s "simple" whole-card pattern — no
 *      `actions` passed), nesting a real `<button>`/`<a>` for the cue inside it
 *      would be the exact illegal-nesting trap `SurfaceCard.Pressable`'s own
 *      file header warns about (a `<button>` inside a `<button>`/`<a>`). The
 *      row is plain `Typography` with a sliding arrow suffix — it reads as an
 *      affordance without being its own target.
 *
 *   4. THE EMPTY BRANCH is OWNED HERE, not exposed as a separate top-level
 *      block. `SurfaceCardPressableGroup` renders nothing (`null`) for zero
 *      items, so a caller-visible hole would appear with no explanation. This
 *      block instead swaps in `EmptyState` — the SAME composite
 *      `FoundationCategoryList` reaches for on its own bounded list — mirroring
 *      that block's judgement to keep the surface's SPOT on the screen filled
 *      by a real, worded state rather than a component that silently vanishes.
 *
 * JUDGEMENT CALL — TWO LEAVES, `isSkeleton` FOLDED IN AS A STATE OF `Default`
 * (§14d.2, same call `FoundationCategoryList`'s file header makes). Loading
 * never changes the STRUCTURE: it is still one `role="group"` grid, just every
 * tile mirrored by the composite's own generic skeleton tile — so it stays a
 * state, not its own leaf. Losing all exercises DOES change the structure (the
 * grid is replaced outright by `EmptyState`), so `Empty` earns its own leaf.
 *
 * JUDGEMENT CALL — SKELETON PLACEHOLDER COUNT. `SurfaceCardPressableGroup`
 * returns `null` for an empty `items` array REGARDLESS of `isSkeleton` (it
 * checks length before it checks the flag), so the very first fetch — before
 * any real exercise has landed — needs a GUESSED placeholder row set, same as
 * `FoundationCategoryList`'s `SKELETON_CATEGORIES` convention. Four tiles: the
 * smallest count that fills both steps of this block's own two-column grid.
 *
 * COLUMNS: `{ base: 1, sm: 2 }` — a literal match for the real screen's
 * `grid-cols-1 @app-sm:grid-cols-2` (`src`'s `PlaygroundHub`).
 *
 * ⛔ A ROW NEVER SWALLOWS ITS PRESS ON BUSINESS GROUNDS (rule 7). There is no
 * lock/disabled concept in this domain — every real tile is a plain press
 * target; only the guessed SKELETON placeholders carry no handler, because
 * nothing underneath them can act yet.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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
                body={
                    <>
                        <div>
                            <Typography size="base" weight="bold" truncate text={exercise.title} />
                        </div>
                        <div>
                            <Chip tone="default" icon={ListChecksIcon} text={stepCountLabel(exercise.stepCount)} classNames={["w-fit"]} />
                        </div>
                    </>
                }
            />
        )

        return (
            <StackV
                gap={4}
                body={
                    <>
                        <div>
                            <IconTile icon={TerminalWindowIcon} tone="accent" size="lg" />
                        </div>
                        {titleAndSteps}
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
                    </>
                }
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
