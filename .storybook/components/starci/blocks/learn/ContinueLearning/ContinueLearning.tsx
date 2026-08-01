import React from "react"
import { ContinueCardHero } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContinueLearning.*`: the "jump back to where you left off" feature of
 * the learning page.
 *
 * ⭐ WHY THIS BLOCK EXISTS (teacher confirmed 2026-07-27): the `CourseContents`
 * screen used to import `ContinueCard` DIRECTLY from the **design** tier — leapfrogging
 * the block tier. Looking at the screen's Deps tree exposes the mismatch right away: the
 * other five nodes are `block`, this one alone is `design`.
 *
 * **Design is UI/UX ONLY.** It knows how to draw a pretty "continue" card; it must NOT
 * know what "lessons read" is, what a "challenge" is, or which sentence describes them.
 * When the screen assembles the string `"Read 8/23 lessons"` itself and throws it down
 * to design via `meta`, two bad things happen at once:
 *   1. **The screen ends up doing presentation work** — it decides the wording, the
 *      order, the `/` separator. Another screen that needs the exact same phrase will
 *      copy it, and the two copies will drift apart.
 *   2. **Nobody owns the wording.** Changing "lesson" → "chapter" means hunting across
 *      every screen.
 *
 * This block takes **NUMBERS** (`lessonsRead`/`lessonsTotal`…) and writes the sentence
 * itself. The screen only hands over typed data (§14d.1); design only receives an
 * already-built node and handles the shape.
 * ─────────────────────────────────────────────────────────────────────────────
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
    anatPart?: string
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
    anatPart,
}: ContinueLearningBaseProps) => (
    // EVERY sentence is produced RIGHT HERE. Design doesn't know what a "lesson"/"challenge"
    // is — it only receives an already-worded `title` + `meta` (§14d.1: design receives a
    // node, never a domain concept).
    <ContinueCardHero
        anatPart={anatPart}
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
