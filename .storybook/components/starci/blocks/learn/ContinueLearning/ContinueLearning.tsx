import React from "react"
import { ContinueCardHero } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"

/**
 * `ContinueLearning.*` — the "jump back to where you left off" feature of the learning
 * page. Takes progress numbers (`lessonsRead`/`lessonsTotal`…) and writes the summary
 * sentence itself, handing an already-built node down to the design tier for shape.
 */

/** Props for {@link ContinueLearning}. */
export interface ContinueLearningBaseProps {
    /** Title of the lesson in progress — raw data, the block prefixes it with "Lesson N ·" itself. */
    lessonTitle: string
    /** Lesson's order number within the course (1-based). */
    lessonIndex: number
    /** Number of lessons read / total lessons. */
    lessonsRead: number
    lessonsTotal: number
    /** Number of completed challenges / total challenges. */
    challengesDone: number
    challengesTotal: number
    /** Course progress percentage (0–100). */
    progressPercent: number
    /** Press "Continue" — the caller opens the exact lesson in progress. */
    onResume?: () => void
    /** `true` → the card switches to shimmer (the flag flows straight down to design). */
    isSkeleton?: boolean
    /** Anatomy tag for THIS block itself — lets the screen badge it as ONE node (§11a.1). */
}

/**
 * "Resume in-progress session" card — the ONE focal point of the learning page.
 *
 * Uses the design's `.Hero` variant (card face + light streak), NOT `.Item`: `.Item` is
 * one of N cards in a list, whereas this is a standalone block.
 *
 * @param props - {@link ContinueLearningBaseProps}
 */
const ContinueLearningBase = ({
    lessonTitle,
    lessonIndex,
    lessonsRead,
    lessonsTotal,
    challengesDone,
    challengesTotal,
    progressPercent,
    onResume,
    isSkeleton = false,
}: ContinueLearningBaseProps) => (
    // EVERY sentence is produced RIGHT HERE. Design doesn't know what a "lesson"/"challenge"
    // is — it only receives an already-worded `title` + `meta` (§14d.1: design receives a
    // node, never a domain concept).
    <ContinueCardHero

        title={`Lesson ${lessonIndex} · ${lessonTitle}`}
        meta={[
            `Read ${lessonsRead}/${lessonsTotal} lessons`,
            `Completed ${challengesDone}/${challengesTotal} challenges`,
        ]}
        value={progressPercent}
        max={100}
        onPress={onResume}
        isSkeleton={isSkeleton}
    />
)

/** `ContinueLearning.*` — a single-shape namespace ⇒ only `.Base` (§12a). */
export { ContinueLearningBase as ContinueLearning }
