import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `TrialEnrollBanner`: the ambient "you're on a trial" nudge. Reused
 * as-is across every free surface a trial learner can reach — foundations
 * (both the resource page and the grid), leaderboard — the wording and shape
 * live HERE, not on any one screen.
 *
 * ⭐ CONSOLIDATED FROM THREE BLOCKS INTO ONE (teacher 2026-07-29, "ok, go ahead" —
 * merging `TrialEnrollNudge`/`FoundationTrialEnrollBanner`/`TrialEnrollBanner`).
 * All three were independent ports of the SAME real `src` component
 * (`components/features/learn/shared/TrialEnrollHook`) — a Foundations audit
 * caught them shipping three different invented Vietnamese strings for the
 * one real `enrollGate.hookTitle`/`hookDesc`/`hookCta` copy. `LeaderboardPage`
 * had already independently flagged this exact drift in its own file header
 * before the audit ran, and chose to reuse this block rather than add a
 * fourth — this pass finishes what that flag started. Shape decisions below
 * were picked from whichever of the three sources got it right, not just
 * "whatever this file already had":
 *   - `description` — the removed `FoundationTrialEnrollBanner` had a second
 *     line; the OLD version of THIS block argued "one sentence only" — wrong,
 *     real `TrialEnrollHook`'s `Callout` always renders both `hookTitle` AND
 *     `hookDesc`.
 *   - CTA composed as an explicit `Button` CHILD, not `Callout`'s
 *     `actionLabel`/`onAction` shorthand — kept from the removed
 *     `TrialEnrollNudge`.
 *   - `isSkeleton` — kept from the removed `FoundationTrialEnrollBanner`.
 *     Copy is fixed (nothing to shimmer about the WORDS), but the enrollment
 *     check feeding `isVisible` can still be in flight — this reserves the
 *     banner's footprint for that window so the surrounding list/header does
 *     not jump once the check resolves. Wins over `isVisible`: while still
 *     checking, the caller cannot yet compute a meaningful `isVisible`.
 *
 * SELF-GATING, NOT A DUMB WRAPPER. `isVisible` is the caller's RESOLVED
 * answer to "is this learner an enrolled/known non-trial learner" — the
 * caller derives it from whatever raw enrolled/trial-known state it holds
 * (e.g. `isEnrollmentKnown && !isEnrolled`); this block never fetches.
 * `isVisible = false` is a real STRUCTURAL leaf (the whole node disappears).
 *
 * FIXED VIETNAMESE COPY (§14d.1) — `title`/`description`/CTA are NOT props.
 * A caller-supplied string here would let five different screens drift into
 * five different nudges for the same fact; the block owns the one sentence.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link TrialEnrollBanner}. */
export interface TrialEnrollBannerProps {
    /**
     * `true` → the caller has resolved the learner as a known trial learner
     * (not yet enrolled) and wants the nudge shown. `false` covers BOTH
     * "enrolled" and "not yet known" — either way the banner renders nothing
     * (the "not yet known" window instead goes through {@link isSkeleton}).
     */
    isVisible: boolean
    /** Fired when the learner taps the CTA (caller owns opening the enroll flow). */
    onEnroll: () => void
    /**
     * `true` → the enrollment check that feeds `isVisible` is still in flight.
     * Reserves the banner's shape without shimmering the copy (fixed, not
     * fetched) and without a CTA (nothing to press before the check lands).
     * Wins over `isVisible`.
     */
    isSkeleton?: boolean
}

/**
 * The trial → enroll ambient nudge. See the file header for the self-gating
 * condition, the consolidation history, and why `isSkeleton` is a separate
 * window from `isVisible = false`.
 *
 * @param props - {@link TrialEnrollBannerProps}
 */
const TrialEnrollBanner = ({
    isVisible,
    onEnroll,
    isSkeleton = false,
}: TrialEnrollBannerProps) => {
    if (isSkeleton) {
        // `Callout` has no `isSkeleton` of its own (§12c gap, same one
        // `CourseTeamGate` already documents) — its `title`/`description` slots
        // render inside `<p>` (`Alert.Title`/`Alert.Description`), which cannot
        // legally contain the `<div>` a hand-built `Typography isSkeleton` bar
        // emits (real hydration error, caught live in this exact leaf). `Alert`
        // itself DOES own `isSkeleton` and draws two safe `<div>` bars straight
        // inside its content region — call it directly, same precedent as
        // `CourseTeamGate.tsx`.
        return (
            <div>
                <Alert
                    isSkeleton
                    status="accent"

                />
            </div>
        )
    }

    // SELF-HIDE — the block owns its own show condition; the screen doesn't need to ask.
    if (!isVisible) {
        return null
    }

    return (
        <div>
            <Callout
                status="accent"
                title="You're on a trial"
                description="Unlock the full course and build proof of work employers can see on your profile."

            >
                <Button
                    label="Unlock the course"
                    variant="primary"
                    size="sm"
                    suffixIcon={ArrowRightIcon}
                    iconSlide
                    onPress={onEnroll}

                />
            </Callout>
        </div>
    )
}

export { TrialEnrollBanner }
