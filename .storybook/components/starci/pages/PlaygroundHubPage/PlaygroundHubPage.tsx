import React from "react"
import { PlaygroundHubHeader } from "@sb-components/starci/blocks/learn/PlaygroundHubHeader/PlaygroundHubHeader"
import { PlaygroundExerciseGrid, type PlaygroundExerciseGridItem } from "@sb-components/starci/blocks/learn/PlaygroundExerciseGrid/PlaygroundExerciseGrid"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `PlaygroundHubPage`: land on the course's Playground hub, see what
 * it is for, and open a hands-on exercise.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide.
 *
 * TWO FUNCTIONS, in the order the reader meets them:
 *   1. Orient — what this hub is for.                          → `PlaygroundHubHeader`
 *   2. Browse the course's exercises and open one.              → `PlaygroundExerciseGrid`
 *
 * CUT PER §B1 (state, not function): "see a clear empty message when the
 * course has no exercises yet" is a STATE of function 2
 * (`PlaygroundExerciseGrid`'s own empty-state branch), not its own function —
 * it never appears independent of browsing, so it is not a third block here.
 * Same precedent `FoundationsGridPage`'s file header sets for its own list's
 * empty search result.
 *
 * ⛔ NO ROUTING HERE EITHER. `onSelectExercise` fires with an exercise id;
 * resolving that id to the real `pathConfig().course(courseId).learn().playground(slug)`
 * push is the CALLER's job (the real page component), not this screen's — a
 * screen hands data down and events up, it does not know what a route is.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link PlaygroundHubPage}. */
export interface PlaygroundHubPageProps {
    /** Hub title, e.g. "Playground". */
    title: string
    /** One-sentence purpose line explaining what the hub is for. */
    description?: string

    /** The course's exercises, in display order. */
    exercises: Array<PlaygroundExerciseGridItem>
    /** Fired with an exercise's id on tile press. */
    onSelectExercise: (id: string) => void
    /** Accessible name for the exercise tile grid. */
    exerciseGridAriaLabel: string

    /** `true` → every block that can mirror itself does. */
    isSkeleton?: boolean
}

/**
 * The Playground-hub landing screen. See the file header for the function list
 * and why routing stays out of this tier.
 *
 * @param props - {@link PlaygroundHubPageProps}
 */
const PlaygroundHubPage = ({
    title,
    description,
    exercises,
    onSelectExercise,
    exerciseGridAriaLabel,
    isSkeleton = false,
}: PlaygroundHubPageProps) => {
    const hubSection = (
        <>
            <PlaygroundHubHeader

                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            <PlaygroundExerciseGrid

                exercises={exercises}
                onSelect={onSelectExercise}
                ariaLabel={exerciseGridAriaLabel}
                isSkeleton={isSkeleton}

            />
        </>
    )

    return (
        <Container
            size="md"
            padding={6}
            body={<StackV gap={6} body={hubSection} />}
        />
    )
}

export { PlaygroundHubPage }
