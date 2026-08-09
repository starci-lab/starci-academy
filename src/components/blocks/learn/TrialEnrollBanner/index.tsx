import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Callout } from "@/components/composites/feedback/Callout"
import { Alert } from "@/components/atoms/feedback/Alert"
import { Button } from "@/components/atoms/buttons/Button"

/**
 * `TrialEnrollBanner` — the ambient "you're on a trial" nudge, reused across every
 * free surface a trial learner can reach (foundations resource page and grid, and
 * leaderboard). A caller-resolved `isVisible` drives shown vs hidden; it renders
 * both a title and a description, and `isSkeleton` covers the enrollment check still
 * being in flight. Three leaves: "shown"/"hidden" differ in structure (a node vs an
 * empty tree), and the skeleton (two text bars, no CTA) is a third structure.
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
            <Alert
                identity={{ tier: "block", component: "TrialEnrollBanner" }}
                isSkeleton
                status="accent"
            />
        )
    }

    // SELF-HIDE — the block owns its own show condition; the screen doesn't need to ask.
    if (!isVisible) {
        return null
    }

    return (
        <Callout
            identity={{ tier: "block", component: "TrialEnrollBanner" }}
            status="accent"
            title="You're on a trial"
            description="Unlock the full course and build proof of work employers can see on your profile."
            body={() => (
                <Button
                    label="Unlock the course"
                    variant="primary"
                    size="sm"
                    suffixIcon={ArrowRightIcon}
                    iconSlide
                    onPress={onEnroll}
                />
            )}
        />
    )
}

export { TrialEnrollBanner }
