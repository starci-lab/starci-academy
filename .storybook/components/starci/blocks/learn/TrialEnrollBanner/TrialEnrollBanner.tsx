import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { FeedbackCallout } from "@sb-components/composites/feedback/Feedback/Feedback"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `TrialEnrollBanner`: the ambient "you're on a trial" nudge. Reused
 * as-is across every free surface a trial learner can reach — foundations,
 * flashcard study, leaderboard — this screen (Quiz) is just one caller among
 * several, which is why the wording lives HERE and not on any one screen.
 *
 * ⭐ SAME SHAPE AS `CourseTeamGate` — same self-hiding `FeedbackCallout`
 * ambient-nudge pattern, just the opposite audience. `CourseTeamGate` nudges
 * someone who ALREADY PAID toward a follow-up action; this nudges someone who
 * has NOT YET paid toward the purchase itself. Modeled directly on it rather
 * than invented fresh — REUSE FIRST applies to shape/idiom, not only to whole
 * components.
 *
 * JUDGEMENT CALL — `actionLabel`/`onAction`, NOT a hand-held `Button`. The
 * file header of `Feedback.tsx` is explicit: "the frame builds the CTA
 * ITSELF from `actionLabel`/`onAction` ⇒ the caller … no longer touches the
 * atom." `QuizEnrollGate` passes a `Button` through `FeedbackEmpty`'s
 * `body`/`children` slot, but that slot renders BELOW the title as its own
 * line — right for a centered placeholder, wrong for a strip that has to
 * read as ONE LINE. `FeedbackCallout`'s `actionLabel` path renders the CTA as
 * a `shrink-0` sibling on the SAME row as the icon + title (see `Alert`'s
 * layout), which is the only path that actually produces "ambient one-line".
 * Reaching for `Button` directly here would rebuild what `FeedbackCallout`
 * already owns — the exact anti-pattern this run exists to avoid.
 *
 * NO `description` — the whole nudge (situation + what to do about it) is
 * ONE sentence in `title`, on purpose: a second line would make this a small
 * card, not the one-line strip the purpose calls for.
 *
 * SELF-HIDES on two different grounds that land on the same empty tree: not
 * knowing enrollment status yet (`!isKnown`, e.g. the query hasn't returned —
 * showing a wrong nudge is worse than a beat of nothing) and already being
 * enrolled (`isEnrolled`, nothing left to nudge toward). Same idiom as
 * `CourseTeamGate`'s two hide-reasons collapsing into one `Hidden` leaf.
 *
 * NO `isSkeleton` (task-confirmed): unlike `CourseTeamGate`, which renders a
 * shimmer while it can't yet decide whether to hide, this block's caller is
 * expected to hold rendering it at all until `isKnown` flips — the real
 * banner never shimmers, it only appears or stays absent.
 *
 * FIXED VIETNAMESE COPY (§14d.1) — `title`/`actionLabel` are NOT props. A
 * caller-supplied string here would let five different screens drift into
 * five different nudges for the same fact; the block owns the one sentence.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link TrialEnrollBanner}. */
export interface TrialEnrollBannerProps {
    /**
     * `true` once enrollment status has actually resolved. `false` while it's
     * still unknown (query in flight) → the block stays hidden rather than
     * risk nudging a learner who is, in fact, already enrolled.
     */
    isKnown: boolean
    /** Whether the viewer is enrolled in the course. `true` → the block self-hides. */
    isEnrolled: boolean
    /** Fired when the learner takes the nudge. */
    onEnroll: () => void
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The trial → enroll ambient nudge. See the file header for the full contract.
 *
 * @param props - {@link TrialEnrollBannerProps}
 */
const TrialEnrollBanner = ({
    isKnown,
    isEnrolled,
    onEnroll,
    showAnatomy = false,
    anatPart,
}: TrialEnrollBannerProps) => {
    // SELF-HIDE — the block owns its own show condition; the screen doesn't need to ask.
    if (!isKnown || isEnrolled) {
        return null
    }

    return (
        <FeedbackCallout
            anatPart={anatPart ?? (showAnatomy ? "FeedbackCallout" : undefined)}
            status="accent"
            icon={LockIcon}
            title="Bạn đang dùng bản dùng thử — mở khoá khoá học để học không giới hạn"
            actionLabel="Mở khoá ngay"
            onAction={onEnroll}
        />
    )
}

export { TrialEnrollBanner }
