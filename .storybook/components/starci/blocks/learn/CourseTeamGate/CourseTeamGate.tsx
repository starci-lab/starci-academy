import React from "react"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseTeamGate`: reminds the learner to join the course's GitHub team.
 *
 * REASON FOR EXISTING (§14a): a screen may only list BLOCKS. Before this, the
 * `/learn/content` screen called `Callout` (composite tier) directly and wrote
 * the content itself — the screen was declaring a feature's details instead of just
 * naming it. This block is thin, but it exists for the TIER BOUNDARY + because it
 * owns the SHOW CONDITION (below).
 *
 * 🔴 SHOW CONDITION — for learners who have **PAID** (teacher's call, 2026-07-25).
 * The backend scopes the team by `is_enrolled = true` (`features/auth/GithubTeamGate`), so:
 *   • PAID + not yet in the team → SHOW the warning
 *   • Trial / already in the team → SELF-HIDE
 * Not paid means there's no team to join in the first place.
 *
 * ⚠️ The screen built on 2026-07-25 had the gate INVERTED (`viewer === "trial"`) —
 * showing for people who hadn't paid, hiding for people who had. That was a regression
 * from the tree approved on 07/24 (the tree explicitly says "paid, not yet in team").
 * Keep this note so it doesn't flip back again.
 *
 * §14c — the block only ASSEMBLES: all of its visuals go through `Callout`,
 * it draws nothing itself.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link CourseTeamGate}. */
export interface CourseTeamGateBaseProps {
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
     * ⚠️ `Callout` (the frame this block still uses on the live branch) does
     * NOT have `isSkeleton` yet and sits OUTSIDE the 4 files touched this pass, so the
     * flag can't be forwarded through it. But `Callout` is just a thin wrapper
     * over the `Alert` atom — and THAT atom already has `isSkeleton` (§12c). The
     * skeleton branch below calls `Alert` DIRECTLY (same `status`/`icon` that
     * `Callout` will use on the live branch) instead of hand-rolling a parallel
     * warning box.
     */
    isSkeleton?: boolean
    /**
     * Passed DOWN to `Callout` so the anatomy panel can see what this block
     * refs. Without forwarding it, the anatomy view can't tell what it's built from.
     */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * A non-blocking warning: the learner has paid but hasn't joined the course's
 * GitHub team yet (some labs need repo access). Self-hides when it doesn't apply.
 *
 * @param props - {@link CourseTeamGateBaseProps}
 */
const CourseTeamGateBase = ({
    isEnrolled,
    isInTeam,
    onJoin,
    isSkeleton = false,
}: CourseTeamGateBaseProps) => {
    // Loading: `isEnrolled`/`isInTeam` haven't come back yet, so we can't decide
    // whether to self-hide — show the `Alert` atom's mirror (see the
    // `isSkeleton` doc above for why it calls the atom directly instead of
    // `Callout`).
    if (isSkeleton) {
        return (
            <Alert
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
