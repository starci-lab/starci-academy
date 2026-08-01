import React from "react"
import { ArrowRightIcon, QuestionIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseQaInvite`: the whole-page "nobody has asked anything yet"
 * invitation for a course's Q&A tab. Icon, a headline saying the tab is
 * genuinely empty, a hint nudging the learner to look at the content first, and
 * one way forward.
 *
 * WHY A BLOCK: deciding that TRUE zero (no filter, no search, the tab has never
 * had a single question) reads as an INVITATION rather than a dead end — and
 * picking the one CTA that makes sense here (go read the content, not "clear
 * filters") — is a domain call about the Q&A feature, not a generic empty-state
 * detail a composite could make on its own.
 *
 * ⭐ GENUINELY DIFFERENT FROM A SEARCH-EMPTY BRANCH (same gotcha `ContentDiscussion`
 * vs `ContentRelatedList` already documents for this codebase). A sibling
 * "no results for this filter/search" state inside the Q&A LIST is a narrower
 * miss — the list just has nothing matching THIS query, and the fix is "try a
 * different search". This block is the opposite scope: the tab has never had a
 * single question at all, so the fix is not "search something else", it's "go
 * read the content and be the first to ask". Same word ("empty"), opposite
 * remedy — they are not one component with a prop switch.
 *
 * COMPOSE: `SurfaceCard` gives it a face consistent with the other Q&A/course
 * surfaces; `EmptyState` is the centered icon/title/description/action stack
 * every other empty spot in this codebase already uses (do not hand-roll a
 * second one); `Button` is the one CTA, built by this block so the caller never
 * has to hold the atom.
 *
 * ⚠️ JUDGEMENT CALL — `isSkeleton` does NOT shimmer through `EmptyState`
 * (that composite has no shimmer variant of its own yet — see its file header).
 * `title`/`hint` are caller-supplied, ALREADY-RESOLVED copy — same reasoning as
 * `ContentPaywall`'s headline: known before any request, so shimmering them
 * would hide legible copy that was never waiting on anything. The one thing
 * that legitimately can be pending is the destination behind the CTA (which
 * course/content id to route into), so the flag flows into `Button` only — the
 * single real atom this block owns that can be mid-flight — instead of
 * inventing a parallel skeleton tree.
 * ─────────────────────────────────────────────────────────────────────────────
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
                    action={
                        <Button
                            isSkeleton={isSkeleton}
                            label={ctaLabel}
                            variant="primary"
                            suffixIcon={ArrowRightIcon}
                            iconSlide
                            onPress={onGoToContent}

                        />
                    }

                />
            )}
        />
    </div>
)

export { CourseQaInvite }
