import React from "react"
import { ArrowRightIcon, QuestionIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `CourseQaInvite` — the whole-page "nobody has asked anything yet" invitation for a
 * course's Q&A tab: icon, headline, a hint nudging the learner to read the content
 * first, and one CTA. Distinct from a search/filter-empty state (whose fix is "try a
 * different search"; this one's is "go read the content and be the first to ask").
 * Composes `SurfaceCard` + `EmptyState` + `Button`. `isSkeleton` flows only into the
 * CTA button (its destination may still be resolving); the caller-supplied title/hint
 * copy stays legible.
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
