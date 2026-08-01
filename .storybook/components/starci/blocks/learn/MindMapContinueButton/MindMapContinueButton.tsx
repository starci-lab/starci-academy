import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `MindMapContinueButton`: the SINGLE primary next-step action floating
 * over the course mind-map. "Jump to whatever I have not read yet", or a quiet
 * confirmation once there is nothing left to jump to.
 *
 * GROUNDED IN THE REAL SCREEN — read
 * `src/components/features/learn/MindMap/MindMapContinueButton/index.tsx`
 * before touching this file. That component decides between THREE outcomes, not
 * two, and this block reproduces the same precedence:
 *   1. `resumeHref` present → the resume pill, REGARDLESS of `allContentDone`.
 *   2. `resumeHref` null AND `allContentDone` → the quiet "all done" note.
 *   3. `resumeHref` null AND NOT `allContentDone` (a guest with nothing
 *      resolved yet) → renders nothing. Real, but not one of the two STORY
 *      leaves — the storybook LEAVES describe the two states that have a
 *      shape; "nothing" has none to show.
 *
 * ⭐ `resumeHref` WINS ON PURPOSE (not "content-driven omission" by wording
 * alone, but the same *rule*, §7): a caller cannot flag `allContentDone = true`
 * while still handing back a real href and have this block show the CTA
 * anyway — but the reverse (href present, done flag stale) is exactly the
 * state a screen has for one tick when a learner finishes the last lesson and
 * a new "next" target has not resolved yet. Picking `resumeHref` as the single
 * source of truth for "is there something to resume" avoids a button that
 * would go nowhere, which is the one thing a primary CTA must never do.
 *
 * TWO LEAVES, TWO DIFFERENT ATOMS — not a style flip on one shape. The resume
 * state is an ACTION (`Button`, pressable, carries the arrow); the done state
 * is a NOTICE (`Typography`, inert, no press handler at all). Collapsing them
 * into one "pill" component with an `isDone` flag would let a caller wire
 * `onResume` to a note that can never fire it — the type split makes that
 * combination unrepresentable instead of merely unwise.
 *
 * JUDGEMENT CALL — `shadow-lg` on both leaves. This block has exactly one call
 * site (floating over the map canvas, `<Panel position="top-center">` in the
 * real screen) and is never read sitting flush on a page — the shadow is what
 * tells the eye "this is on top of the canvas, not part of it". The PANEL
 * POSITIONING itself (`top-center`, the `m-4` offset) stays out of this file:
 * that is where-on-screen, decided by whatever embeds this block into
 * `ReactFlow`, not what-this-button-is.
 *
 * SKELETON GUESSES THE FULLER SHAPE, same reasoning as `ModuleContinueBand`:
 * while loading, neither `resumeHref` nor `allContentDone` is known yet, and a
 * returning learner mid-course sees the resume pill far more often than the
 * done note — so the shimmer mirrors the `Button` pill rather than the
 * `Typography` note, and does not jump shape once data lands.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Label the block writes itself (§14d.1) — not opened to the caller. */
const CONTINUE_LABEL = "Continue"
/** Quiet confirmation once every lesson/challenge on the map has been read. */
const ALL_DONE_LABEL = "You've completed everything"

/** Props for {@link MindMapContinueButton}. */
export interface MindMapContinueButtonProps {
    /**
     * Href of the viewer's next unread lesson/challenge, or `null` when none
     * resolves. Non-null is the single source of truth for "show the resume
     * pill" — see the file header for why it outranks {@link allContentDone}.
     */
    resumeHref: string | null
    /**
     * `true` → the viewer has read everything the map has to offer. Only
     * consulted when {@link resumeHref} is `null`; ignored otherwise.
     */
    allContentDone: boolean
    /**
     * Fired on a resume press. Optional: the button itself only renders while
     * {@link resumeHref} is set, so a caller mid-wiring still sees the true shape.
     */
    onResume?: () => void
    /**
     * Accessible name for the resume action, localized by the caller (blocks
     * carry no i18n) — richer than the visible "Continue" label alone, since a
     * screen reader hears it with no page context around it.
     */
    continueAriaLabel: string
    /** `true` → the block shows its loading shimmer instead of either leaf. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The map's one primary action. See the file header for the three-way
 * precedence and why the two real leaves are two different atoms.
 *
 * @param props - {@link MindMapContinueButtonProps}
 */
const MindMapContinueButton = ({
    resumeHref,
    allContentDone,
    onResume,
    continueAriaLabel,
    isSkeleton = false,
}: MindMapContinueButtonProps) => {
    if (isSkeleton) {
        return (
            <Button
                isSkeleton
                size="lg"
                label={CONTINUE_LABEL}
            />
        )
    }

    if (resumeHref != null) {
        return (
            <Button
                variant="primary"
                size="lg"
                label={CONTINUE_LABEL}
                suffixIcon={ArrowRightIcon}
                iconSlide
                ariaLabel={continueAriaLabel}
                onPress={onResume}
                isElevated
            />
        )
    }

    if (allContentDone) {
        return (
            <div

                className="rounded-full border border-default bg-surface px-3 py-2 shadow-lg"
            >
                <Typography
                    size="sm"
                    weight="semibold"
                    color="success"
                    text={ALL_DONE_LABEL}

                />
            </div>
        )
    }

    // Neither a resolved resume target nor a confirmed "all done" — e.g. a guest
    // whose progress has not loaded into a verdict either way. There is nothing
    // true this block can claim yet, so it renders nothing rather than guessing.
    return null
}

export { MindMapContinueButton }
