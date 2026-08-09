import { GithubLogoIcon } from "@phosphor-icons/react"
import { Callout } from "@/components/composites/feedback/Callout"
import { Alert } from "@/components/atoms/feedback/Alert"

/**
 * `CourseTeamGate` — a nudge to join the course's GitHub team. The backend
 * scopes the team by `is_enrolled = true`, so the block self-hides for trial
 * viewers and for anyone already in the team. Two leaves — shown vs. hidden (a
 * node vs. an empty tree); the two hiding reasons produce the same empty tree,
 * so they are states of the hidden leaf.
 */

/** Props for {@link CourseTeamGate}. */
export interface CourseTeamGateProps {
    /**
     * Whether the learner has PAID for the course. Only paid learners have a team to
     * join (see header). Not known yet (query hasn't returned) → pass `false` so it
     * doesn't flicker.
     */
    isEnrolled: boolean
    /** Whether they're already in the GitHub team. `true` → the block self-hides. */
    isInTeam: boolean
    /** Fires when the join-team button is pressed. */
    onJoin?: () => void
    /**
     * `true` → render the shimmer mirror INSTEAD of waiting on `isEnrolled`/`isInTeam`
     * (not knowing yet means we can't decide whether to SELF-HIDE — the mirror must
     * show to hold the slot in the loading tree).
     *
     * NOTE: `Callout` (the frame this block still uses on the live branch) does
     * NOT have `isSkeleton` yet and sits OUTSIDE the 4 files touched this pass, so the
     * flag can't be forwarded through it. But `Callout` is just a thin wrapper
     * over the `Alert` atom — and THAT atom already has `isSkeleton` (§12c). The
     * skeleton branch below calls `Alert` DIRECTLY (same `status`/`icon` that
     * `Callout` will use on the live branch) instead of hand-rolling a parallel
     * warning box.
     */
    isSkeleton?: boolean
}

/**
 * A non-blocking warning: the learner has paid but hasn't joined the course's
 * GitHub team yet (some labs need repo access). Self-hides when it doesn't apply.
 *
 * @param props - {@link CourseTeamGateProps}
 */
const CourseTeamGateBase = ({
    isEnrolled,
    isInTeam,
    onJoin,
    isSkeleton = false,
}: CourseTeamGateProps) => {
    // Loading: `isEnrolled`/`isInTeam` haven't come back yet, so we can't decide
    // whether to self-hide — show the `Alert` atom's mirror (see the
    // `isSkeleton` doc above for why it calls the atom directly instead of
    // `Callout`).
    if (isSkeleton) {
        return (
            <Alert
                identity={{ tier: "block", component: "CourseTeamGate" }}
                isSkeleton
                status="warning"
                icon={GithubLogoIcon}
            />
        )
    }

    // SELF-HIDE — the block owns its own show condition; the screen doesn't need to ask.
    if (!isEnrolled || isInTeam) {
        return null
    }

    return (
        <Callout
            identity={{ tier: "block", component: "CourseTeamGate" }}
            status="warning"
            icon={GithubLogoIcon}
            title="You haven't joined the course's GitHub team yet"
            description="Some labs need repo access — tap to join."
            actionLabel="Join team"
            onAction={onJoin}
        />
    )
}

/** `CourseTeamGate.*` — a single-component namespace ⇒ only has `.Base`. */
export { CourseTeamGateBase as CourseTeamGate }
