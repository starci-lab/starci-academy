import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { FeedbackCallout } from "@sb-components/composites/feedback/Feedback/Feedback"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationTrialEnrollBanner`: the plain one-line "you're on a trial"
 * nudge, self-gated by the caller's own enrollment check.
 *
 * SIBLING OF `TrialConversionStrip`, NOT A DUPLICATE. `TrialConversionStrip` is
 * the price-preview + phase-scarcity strip built for `CourseContents` — it earns
 * a whole `SurfaceCard` because it also shows a price and a scarcity line. This
 * block carries none of that: it is the plain `FeedbackCallout` variant the real
 * app's `TrialEnrollHook` renders IDENTICALLY across three surfaces — leaderboard,
 * foundations, flashcard study. Built once here so those three surfaces reuse
 * this instead of re-hand-rolling a callout each time, which is exactly the
 * `ContentModeNav`-vs-`Toolbar` mistake this run exists to avoid on the OTHER
 * side: reaching PAST an existing composite. There is no composite shaped like
 * "one accent line + one CTA that also knows it's a trial nudge" to reach for
 * instead, so this block is the thin domain layer ON TOP of `FeedbackCallout`
 * (§10, "condition" clause): it owns the copy and the self-gating condition,
 * `FeedbackCallout` owns the strip shape.
 *
 * SELF-GATING, NOT A DUMB WRAPPER. `isVisible` is the caller's RESOLVED answer
 * to "is this learner an enrolled/known non-trial learner" — once that's true,
 * the banner renders nothing rather than the caller having to wrap every
 * call site in its own `{condition && <Banner />}`. That condition is the
 * whole reason this earns block tier under rule 10.
 *
 * `isSkeleton` IS A DIFFERENT STATE FROM `isVisible = false`, on purpose. The
 * copy here is fixed (rule 4 — the block owns its own wording, there is no
 * per-call text to fetch), so there is nothing to shimmer about the WORDS.
 * What IS still resolving, on all three surfaces this reuses across, is the
 * enrollment check itself — the caller does not yet know whether to render
 * the banner at all. `isSkeleton` reserves the banner's exact footprint for
 * that window so the surrounding list/header does not jump once the check
 * resolves, mirroring the reserved-space skeleton in `TrialConversionStrip`'s
 * price region. It therefore WINS over `isVisible`: while still checking, the
 * caller cannot yet compute a meaningful `isVisible`, so the skeleton renders
 * regardless of what that prop currently holds. The CTA does not skeletonize —
 * `FeedbackCallout` builds its action button from `actionLabel`/`onAction`, and
 * neither prop has a mirror shape to swap to, so the skeleton state simply
 * omits the action rather than shipping a fake un-clickable button.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link FoundationTrialEnrollBanner}. */
export interface FoundationTrialEnrollBannerProps {
    /**
     * `true` → the caller has resolved the learner as a known trial learner and
     * wants the nudge shown. `false` covers BOTH "enrolled" and "not yet known" —
     * either way the banner renders nothing (see the file header on why the
     * "not yet known" window instead goes through {@link isSkeleton}).
     */
    isVisible: boolean
    /** Fired when the learner taps the CTA (caller owns opening the enroll flow). */
    onEnroll: () => void
    /**
     * `true` → the enrollment check that feeds `isVisible` is still in flight.
     * Reserves the banner's shape without shimmering the copy (which is fixed,
     * not fetched) and without a CTA (nothing to press before the check lands).
     * Wins over `isVisible` — see the file header.
     */
    isSkeleton?: boolean
    /** When on, emit `data-anat-part` on each composed part for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The trial-enroll nudge. See the file header for the self-gating condition and
 * why `isSkeleton` is a separate window from `isVisible = false`.
 *
 * @param props - {@link FoundationTrialEnrollBannerProps}
 */
const FoundationTrialEnrollBanner = ({
    isVisible,
    onEnroll,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: FoundationTrialEnrollBannerProps) => {
    if (isSkeleton) {
        return (
            <div data-anat-part={anatPart}>
                <FeedbackCallout
                    status="accent"
                    title={<Typography isSkeleton className="w-40" anatPart={showAnatomy ? "Typography" : undefined} />}
                    description={<Typography isSkeleton size="xs" className="w-72" anatPart={showAnatomy ? "Typography" : undefined} />}
                    anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                />
            </div>
        )
    }

    // The self-gating condition (rule 10): once the caller knows the learner is
    // enrolled, or does not yet know either way, there is nothing to nudge about.
    if (!isVisible) {
        return null
    }

    return (
        <div data-anat-part={anatPart}>
            <FeedbackCallout
                status="accent"
                title="Bạn đang học thử"
                description="Mở khóa để học trọn khóa + dựng bằng chứng đi làm cho hồ sơ nhà tuyển dụng thấy."
                actionLabel="Mở khóa học"
                onAction={onEnroll}
                anatPart={showAnatomy ? "FeedbackCallout" : undefined}
            />
        </div>
    )
}

export { FoundationTrialEnrollBanner }
