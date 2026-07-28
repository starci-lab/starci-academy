import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ModuleContinueBand`: the "resume + progress" cluster that opens both
 * `course-home` and `module-home`.
 *
 * ⭐ WHY A NEW BLOCK INSTEAD OF `ContinueLearning`/`ContinueCardHero`: read the
 * actual markup in `src/components/features/learn/CourseContents/index.tsx`
 * (`// continue + progress — flat (no card frame), the honest unified meter`)
 * and `src/components/features/learn/ModulePage/index.tsx` (`// continue +
 * progress — flat (no card frame), mirrors course-home`). Both screens spell
 * out, in a comment, that this band is deliberately FLAT — no `SurfaceCard`, no
 * light streak, no watermark glyph. `ContinueCardHero` (which `ContinueLearning`
 * wraps) is a CARD: face + highlight streak, meant to be the one focal surface
 * on a page. Reaching for it here would have bought a shape the real screen
 * explicitly opts out of, for a component that is not "continue-learning but
 * plainer" — it is a different composition (two atoms + a composite stacked
 * directly on the page background), not a variant of the card. Confirmed no
 * existing block/composite draws an unframed resume-row-plus-meter shape before
 * adding this one (grepped `components/starci/blocks/**` and
 * `components/composites/**`).
 *
 * WHAT IT OWNS: the sentence. `lessonsRead`/`lessonsTotal`/`challengesDone`/
 * `challengesTotal` come in as plain numbers (§14d.1) — the block writes
 * "Đã đọc X/Y bài · Hoàn thành Z/W thử thách" itself, same wording precedent as
 * `ContinueLearningBase`. A caller handing over a pre-built string would have
 * re-opened the exact drift the sibling block was built to close.
 *
 * CONTENT-DRIVEN OMISSION, NOT EVENT-SWALLOWING (§7 of the block rules): the
 * resume title + `Button` disappear together when `resumeLessonTitle` is
 * unset — that is the "all done" state both screens hit once every lesson in
 * the module/course is read, and there is genuinely no lesson left to jump to.
 * `onResume` stays OPTIONAL and is simply forwarded to the button's `onPress`
 * when the title is present; the block never inspects it to decide whether to
 * render — that decision is `resumeLessonTitle`'s alone, so a caller that has a
 * title but hasn't wired a handler yet still sees the true shape.
 *
 * SKELETON: while loading, neither branch is known yet, so the shimmer always
 * paints the FULLER shape (title bar + button pill) rather than guessing
 * "all done" — that matches what a returning learner almost always sees, and
 * avoids a layout jump if the real data turns out to have a lesson to resume.
 * `ProgressMeter` has no `isSkeleton` of its own (same gap `ContinueCard`
 * documents), so a bare `h-1` bar stands in for it, matching the real track.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Resume label — a block-owned wording constant (§14d.1), not a caller prop. */
const RESUME_LABEL = "Tiếp tục học"
/** Eyebrow shown while a lesson still waits to be resumed. */
const EYEBROW_CONTINUE = "Học tiếp"
/** Eyebrow shown once nothing is left to resume — the whole title/button row drops out with it. */
const EYEBROW_ALL_DONE = "Bạn đã hoàn thành nội dung này"

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
     * Press "Tiếp tục học". Optional: the button itself only renders when
     * {@link ModuleContinueBandProps.resumeLessonTitle} is set (content-driven
     * omission), never withheld because this handler is missing.
     */
    onResume?: () => void
    /** `true` → every composed atom swaps to its own shimmer. */
    isSkeleton?: boolean
    /** `true` → tag each composed part with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag for THIS block itself — lets the screen badge it as ONE node (§11a.1). */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: ModuleContinueBandProps) => {
    // Loading state doesn't know which branch it will land in yet, so it always
    // shows the fuller "still has a lesson to resume" shape (see file header).
    const showResumeRow = isSkeleton || resumeLessonTitle !== undefined

    return (
        <StackV gap="grouped" anatPart={anatPart}>
            <StackH gap="grouped" justify="between" align="start" anatPart={showAnatomy ? "StackH" : undefined}>
                <StackV gap="flush" className="min-w-0" anatPart={showAnatomy ? "StackV" : undefined}>
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={showResumeRow ? EYEBROW_CONTINUE : EYEBROW_ALL_DONE}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    {showResumeRow ? (
                        <Typography
                            size="base"
                            weight="semibold"
                            truncate
                            isSkeleton={isSkeleton}
                            text={resumeLessonTitle}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    ) : null}
                </StackV>
                {showResumeRow ? (
                    <Button
                        isSkeleton={isSkeleton}
                        variant="primary"
                        size="lg"
                        label={RESUME_LABEL}
                        suffixIcon={ArrowRightIcon}
                        onPress={onResume}
                        className="shrink-0"
                        anatPart={showAnatomy ? "Button" : undefined}
                    />
                ) : null}
            </StackH>
            {isSkeleton ? (
                // `ProgressMeter` has no `isSkeleton` of its own (same gap `ContinueCard`
                // documents) — a bare track-height bar stands in for it here.
                <HeroSkeleton className="h-1 w-full rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            ) : (
                <ProgressMeter
                    value={lessonsRead}
                    max={lessonsTotal}
                    label="Hoàn thành"
                    showValue
                    anatPart={showAnatomy ? "ProgressMeter" : undefined}
                />
            )}
            <Typography
                size="xs"
                color="muted"
                isSkeleton={isSkeleton}
                text={`Đã đọc ${lessonsRead}/${lessonsTotal} bài · Hoàn thành ${challengesDone}/${challengesTotal} thử thách`}
                anatPart={showAnatomy ? "Typography" : undefined}
            />
        </StackV>
    )
}

export { ModuleContinueBand }
