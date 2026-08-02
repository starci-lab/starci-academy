import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"

/**
 * `ModuleContinueBand` — the flat (no card frame) "resume + progress" cluster that opens
 * both course-home and module-home. Deliberately unframed — no `SurfaceCard`, streak, or
 * watermark — which is why it is not `ContinueCardHero`.
 *
 * Owns the summary sentence ("Read X/Y lessons · Completed Z/W challenges") from plain
 * numbers. The resume title + `Button` disappear together when `resumeLessonTitle` is
 * unset (the "all done" state); `onResume` is optional and only forwarded, never
 * inspected to decide rendering. Skeleton paints the fuller shape (title bar + button);
 * `ProgressMeter` has no skeleton of its own, so a bare `h-1` bar stands in.
 */

/** Resume label — a block-owned wording constant (§14d.1), not a caller prop. */
const RESUME_LABEL = "Continue learning"
/** Eyebrow shown while a lesson still waits to be resumed. */
const EYEBROW_CONTINUE = "Keep learning"
/** Eyebrow shown once nothing is left to resume — the whole title/button row drops out with it. */
const EYEBROW_ALL_DONE = "You have finished this content"

/** Props for {@link ModuleContinueBand}. */
export interface ModuleContinueBandProps {
    /**
     * Title of the next unread lesson. `undefined` means every lesson is
     * already read — the block switches to its "all done" eyebrow and drops
     * the title line and the resume button together.
     */
    resumeLessonTitle?: string
    /** Lessons already read / total lessons in scope (module or course). */
    lessonsRead: number
    lessonsTotal: number
    /** Challenges already completed / total challenges in scope. */
    challengesDone: number
    challengesTotal: number
    /**
     * Press "Continue learning". Optional: the button itself only renders when
     * {@link ModuleContinueBandProps.resumeLessonTitle} is set (content-driven
     * omission), never withheld because this handler is missing.
     */
    onResume?: () => void
    /** `true` → every composed atom swaps to its own shimmer. */
    isSkeleton?: boolean
    /** Anatomy tag for THIS block itself — lets the screen badge it as ONE node (§11a.1). */
}

/**
 * Flat "resume + progress" band: eyebrow + resume title + resume button on one
 * row, a progress meter, then the stat sentence the block writes itself.
 *
 * @param props - {@link ModuleContinueBandProps}
 */
const ModuleContinueBand = ({
    resumeLessonTitle,
    lessonsRead,
    lessonsTotal,
    challengesDone,
    challengesTotal,
    onResume,
    isSkeleton = false,
}: ModuleContinueBandProps) => {
    // Loading state doesn't know which branch it will land in yet, so it always
    // shows the fuller "still has a lesson to resume" shape (see file header).
    const showResumeRow = isSkeleton || resumeLessonTitle !== undefined

    const eyebrowAndTitle = (
        <StackV
            gap={1}
            classNames={["min-w-0"]}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={showResumeRow ? EYEBROW_CONTINUE : EYEBROW_ALL_DONE}

                    />
                ),
                ...(showResumeRow ? [() => (
                    <Typography
                        size="base"
                        weight="semibold"
                        truncate
                        isSkeleton={isSkeleton}
                        text={resumeLessonTitle}

                    />
                )] : []),
            ]}
        />
    )

    const headerRow = (
        <StackH
            gap={4}
            justify="between"
            align="start"
            isSkeleton={isSkeleton}
            items={[
                () => eyebrowAndTitle,
                ...(showResumeRow ? [() => (
                    <Button
                        isSkeleton={isSkeleton}
                        variant="primary"
                        size="lg"
                        label={RESUME_LABEL}
                        suffixIcon={ArrowRightIcon}
                        onPress={onResume}
                        classNames={["shrink-0"]}

                    />
                )] : []),
            ]}
        />
    )

    const progress = isSkeleton ? (
        // `ProgressMeter` has no `isSkeleton` of its own (same gap `ContinueCard`
        // documents) — a bare track-height bar stands in for it here.
        <HeroSkeleton className="h-1 w-full rounded-full" />
    ) : (
        <ProgressMeter
            value={lessonsRead}
            max={lessonsTotal}
            label="Completed"
            showValue

        />
    )

    const statLine = (
        <Typography
            size="xs"
            color="muted"
            isSkeleton={isSkeleton}
            text={`Read ${lessonsRead}/${lessonsTotal} lessons · Completed ${challengesDone}/${challengesTotal} challenges`}

        />
    )

    return (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}
            items={[
                () => headerRow,
                () => progress,
                () => statLine,
            ]}
        />
    )
}

export { ModuleContinueBand }
