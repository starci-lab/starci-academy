import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `MindMapContinueButton` — the single primary next-step action floating over the course
 * mind-map: a resume pill, or a quiet "all done" note. Precedence: `resumeHref` present →
 * resume pill (regardless of `allContentDone`); null + `allContentDone` → the note; null
 * + not done → renders nothing. `resumeHref` is the single source of truth for "is there
 * something to resume", so the CTA never goes nowhere.
 *
 * Two leaves with two different atoms — the resume state is a pressable `Button` (with
 * arrow), the done state an inert `Typography`. Both carry `shadow-lg` (this floats over
 * the canvas). Skeleton mirrors the resume pill (the more common returning-learner
 * shape). Panel positioning stays with whatever embeds this into `ReactFlow`.
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
