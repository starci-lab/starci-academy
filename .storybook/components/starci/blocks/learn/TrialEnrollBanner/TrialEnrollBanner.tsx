import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * `TrialEnrollBanner` — the ambient "you're on a trial" nudge, reused as-is
 * across every free surface a trial learner reaches (foundations, leaderboard).
 * Composes `Callout` with a title, description, and an explicit `Button` CTA.
 * Self-gating: `isVisible` is the caller's resolved "enrolled/known non-trial"
 * answer, and `isVisible=false` is a real structural leaf (the node disappears);
 * `isSkeleton` reserves the footprint while the enrollment check is in flight and
 * wins over `isVisible`. The Vietnamese copy is fixed and block-owned, not a
 * prop, so screens can't drift into different nudges for the same fact.
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
