import React from "react"
import { PlaygroundHubHeader } from "@sb-components/starci/blocks/learn/PlaygroundHubHeader/PlaygroundHubHeader"
import { PlaygroundExerciseGrid, type PlaygroundExerciseGridItem } from "@sb-components/starci/blocks/learn/PlaygroundExerciseGrid/PlaygroundExerciseGrid"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PlaygroundHubPage` — the screen to land on the course's Playground hub, see
 * what it is for, and open a hands-on exercise. A screen owns a list of
 * functions: it calls blocks, places them in frames, and hands each typed data.
 * Two functions, in reading order: orient · browse the course's exercises and
 * open one. Only `isSkeleton` forks into its own leaf; having no exercises yet
 * is data handed to `PlaygroundExerciseGrid`, a state of the one `Default` leaf.
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
            body={() => <StackV gap={6} isSkeleton={isSkeleton} items={[() => hubSection]} />}
        />
    )
}

export { PlaygroundHubPage }
