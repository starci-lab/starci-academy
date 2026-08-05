import React from "react"
import { ArrowRightIcon, QuestionIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { EmptyState } from "@/components/composites/feedback/EmptyState"

/**
 * `CourseQaInvite` — the whole-page "nobody has asked anything yet" invitation
 * for a course's Q&A tab: icon, headline, hint, one way forward. Distinct from a
 * search-empty branch: true zero (never a single question) reads as an
 * invitation with a "go read the content" remedy, versus a filtered miss's "try
 * something else". `isSkeleton` only swaps the CTA's render, so it stays a state
 * of the one `Default` leaf.
 */

/** Props for {@link CourseQaInvite}. */
export interface CourseQaInviteProps {
    /** Headline saying the tab has no questions at all, localized by the caller — e.g. "No questions yet". */
    title: string
    /** Supporting sentence nudging the learner toward asking the first one. */
    hint: string
    /** Label of the single call to action, localized by the caller — e.g. "View course content". */
    ctaLabel: string
    /** Fired when the learner takes the one way forward (back into the course content). */
    onGoToContent: () => void
    /**
     * `true` → the CTA mirrors itself while its destination is still resolving.
     * `title`/`hint` stay fully real (see the file header's judgement call).
     */
    isSkeleton?: boolean
}

/**
 * Whole-page "never asked anything yet" invitation for a course's Q&A tab. See
 * the file header for the full contract.
 *
 * @param props - {@link CourseQaInviteProps}
 */
const CourseQaInvite = ({
    title,
    hint,
    ctaLabel,
    onGoToContent,
    isSkeleton = false,
}: CourseQaInviteProps) => (
    <div>
        <SurfaceCard

            body={() => (
                <EmptyState
                    icon={QuestionIcon}
                    title={title}
                    description={hint}
                    action={() => (
                        <Button
                            isSkeleton={isSkeleton}
                            label={ctaLabel}
                            variant="primary"
                            suffixIcon={ArrowRightIcon}
                            iconSlide
                            onPress={onGoToContent}

                        />
                    )}

                />
            )}
        />
    </div>
)

export { CourseQaInvite }
