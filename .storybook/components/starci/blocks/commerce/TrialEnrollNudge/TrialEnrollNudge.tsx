import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { FeedbackCallout } from "@sb-components/composites/feedback/Feedback/Feedback"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `TrialEnrollNudge`: a self-hiding, accent one-liner urging a still-trial
 * learner to enroll. Ported from `src`'s `TrialEnrollHook`
 * (`components/features/learn/shared/TrialEnrollHook`).
 *
 * ⚠️ NAMING/PLACEMENT IS A JUDGEMENT CALL, FLAGGED FOR CONFIRMATION. `src` puts
 * this under `features/learn/shared/`, not under any single feature — the SAME
 * hook is reused verbatim on the leaderboard, Foundations, and flashcard-study
 * surfaces. So it is NOT a `learn/Foundations` block; it lives here in
 * `blocks/commerce`, next to `TrialConversionStrip` — its fuller, later-funnel
 * sibling (this is the ambient EARLY nudge; that one is the priced STRIP once the
 * learner is already looking at a course). If a dedicated `shared/` group gets
 * introduced for cross-surface ambient blocks later, this is the first candidate
 * to move there.
 *
 * WHY A BLOCK ON TOP OF `FeedbackCallout`: the composite knows how to lay out a
 * tinted title/description/action strip; it does not know WHEN a trial nudge
 * should appear, what tone it wears, or what the CTA says. This block owns all
 * three: the caller hands typed domain data, never a formatted string (§14d.1).
 *
 * ⭐ SELF-HIDING IS A PROP, NOT A FETCH. `src`'s original reads Redux
 * (`state.user.enrolled` / `enrollKnown`) itself and renders `null` until the
 * trial status is KNOWN and not enrolled. A block must not fetch (§1) — so this
 * collapses to ONE boolean, `isVisible`, that the CALLER resolves from whatever
 * enrolled/trial-known state it holds. `isVisible = false` is a real STRUCTURAL
 * leaf (the whole node disappears), not a state inside one — same rule that
 * makes `NoOutcomes` its own leaf on `ContentHeader`.
 *
 * ⭐ JUDGEMENT CALL — Button composed as an explicit CHILD, not via
 * `FeedbackCallout`'s `actionLabel`/`onAction` convenience. That convenience
 * builds its own internal button from a bare label and never tags it with
 * `data-anat-part`, so it would be invisible to a BlockAnatomy deps tree and
 * could not carry the slide-arrow "keep going" affordance the original CTA had.
 * Composing `Button` directly as `FeedbackCallout`'s child keeps it a REAL,
 * inspectable node — the same idiom `QuizEnrollGate` already uses to pair
 * `FeedbackEmpty` with its own `Button` rather than the frame's built-in action.
 *
 * NEVER SKELETONISED, on purpose. This block is only ever mounted once the
 * caller has already resolved trial-vs-enrolled — `isVisible` gates it, so there
 * is no loading shape to draw (unlike `TrialConversionStrip`, which mounts
 * before its price arrives).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link TrialEnrollNudge}. */
export interface TrialEnrollNudgeProps {
    /** Headline, localized by the caller — e.g. "Học thử — mở khoá toàn bộ khoá học". */
    title: string
    /** One supporting sentence naming what enrolling opens up. */
    description: string
    /** Label of the single CTA, localized by the caller. */
    ctaLabel: string
    /** Fired when the learner takes the nudge. */
    onEnroll: () => void
    /**
     * Whether the nudge should render at all. The caller resolves this from its
     * own enrolled/trial-known state — this block never fetches, so a learner
     * who is already paid (or whose status is still unknown) simply passes `false`.
     */
    isVisible: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The trial → enroll ambient nudge. See the file header for the self-hiding
 * contract, the placement judgement call, and why the CTA is a real composed
 * `Button` rather than `FeedbackCallout`'s built-in action shorthand.
 *
 * @param props - {@link TrialEnrollNudgeProps}
 */
const TrialEnrollNudge = ({
    title,
    description,
    ctaLabel,
    onEnroll,
    isVisible,
    showAnatomy = false,
    anatPart,
}: TrialEnrollNudgeProps) => {
    // Only a settled trial (not yet enrolled) sees the nudge — the caller already
    // resolved that into `isVisible`, so this is the ONE branch this block owns.
    if (!isVisible) {
        return null
    }

    return (
        <FeedbackCallout
            status="accent"
            title={title}
            description={description}
            // Parent wins when this runs inside a bigger tree; running in its own
            // story it self-names so the Deps tree doesn't read as an empty root.
            anatPart={anatPart ?? (showAnatomy ? "FeedbackCallout" : undefined)}
        >
            <Button
                label={ctaLabel}
                variant="primary"
                size="sm"
                suffixIcon={ArrowRightIcon}
                iconSlide
                onPress={onEnroll}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        </FeedbackCallout>
    )
}

export { TrialEnrollNudge }
