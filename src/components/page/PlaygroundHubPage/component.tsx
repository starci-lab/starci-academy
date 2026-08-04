import React from "react"
import { PlaygroundHubHeader } from "@/components/starci/blocks/learn/PlaygroundHubHeader"
import { PlaygroundExerciseGrid, type PlaygroundExerciseGridItem } from "@/components/starci/blocks/learn/PlaygroundExerciseGrid"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `_PlaygroundHubPage` — the SRC TWIN of `.storybook/components/starci/pages/
 * PlaygroundHubPage/PlaygroundHubPage.tsx`. Presentational: typed props,
 * already resolved; no fetch/store/i18n (that's the connected half, `./index.tsx`).
 *
 * Same two functions, same reading order as the blueprint: orient · browse
 * the course's exercises and open one. Only `isSkeleton` forks into its own
 * leaf; having no exercises yet is data handed to `PlaygroundExerciseGrid`, a
 * state of the one `Default` leaf.
 */

// re-exported so the connected file (and anything downstream) can build data
// against the SAME types the blueprint's blocks define, rather than
// redeclaring shape that already exists.
export type { PlaygroundExerciseGridItem }

/** Props for {@link _PlaygroundHubPage}. */
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
 * @param props - {@link _PlaygroundHubPage}
 */
const _PlaygroundHubPage = ({
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
        <div data-tier="page" data-component="PlaygroundHubPage">
            <Container
                size="md"
                padding={6}
                body={() => <StackV gap={6} isSkeleton={isSkeleton} items={[() => hubSection]} />}
            />
        </div>
    )
}

export { _PlaygroundHubPage }
