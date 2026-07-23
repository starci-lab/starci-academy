import React from "react"
import { Typography, cn } from "@heroui/react"
import { UserAvatar } from "../../identity/UserAvatar/UserAvatar"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `PersonaIdentityChip`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Grounded in `src/components/features/learn/MockInterview/InterviewerPresence`
 * (the interviewer's avatar+name+role header cluster) — the SAME avatar+name+role
 * triad is then hand-rolled again with a raw `<img>` + two `Typography` lines
 * twice more inside `MockInterviewSession/index.tsx` (the grading screen's
 * "interviewer" header, ~L1506 and ~L1783). This block generalises that
 * recurring triad into one reusable cluster — `speaking`/TTS toggle stay
 * `InterviewerPresence`-owned (a distinct, richer composition), this is just
 * the identity itself: avatar (seed/url) + name (medium) + role (muted).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Visual size of the cluster — drives the avatar box AND the name's type scale. */
export type PersonaIdentityChipSize = "sm" | "md" | "lg"

/** Name's Typography type per size — `lg` reads at `body`, `sm`/`md` at `body-sm` (mirrors the hand-roll: size-10 avatar → body-sm name, size-12 avatar → body name). */
const NAME_TYPE: Record<PersonaIdentityChipSize, "body" | "body-sm"> = {
    sm: "body-sm",
    md: "body-sm",
    lg: "body",
}

/** Props for the {@link PersonaIdentityChip} block. */
export interface PersonaIdentityChipProps {
    /** Display name (e.g. "StarCi"). */
    name: string
    /** Static role label shown under the name (e.g. "Solution Architect"). */
    role: string
    /** Uploaded/authored avatar URL; when missing OR it fails to load, a generated default is shown. */
    avatarUrl?: string | null
    /** Stable identity seeding the generated fallback avatar. Falls back to `name` when omitted. */
    avatarSeed?: string | null
    /** Visual size — drives the avatar box + name type scale. Defaults to `"md"`. */
    size?: PersonaIdentityChipSize
    /** Extra classes on the row root. */
    className?: string
    /** `true` → render the skeleton mirror (avatar dot + two label bars). Consumer just flips the flag. */
    isSkeleton?: boolean
}

/**
 * Persona identity cluster: avatar + name + role, in a row. Composes
 * {@link UserAvatar} (resilient uploaded → generated → initials fallback
 * chain) beside two stacked {@link Typography} lines — name (medium weight)
 * over role (muted). Purely presentational; no interaction, no TTS/speaking
 * affordance (that lives one level up, in `InterviewerPresence`).
 *
 * @param props - {@link PersonaIdentityChipProps}
 */
export const PersonaIdentityChip = ({
    name,
    role,
    avatarUrl,
    avatarSeed,
    size = "md",
    className,
    isSkeleton = false,
}: PersonaIdentityChipProps) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                <Skeleton.Avatar size={size} />
                <div className="flex min-w-0 flex-col gap-1">
                    <Skeleton.Typography type={NAME_TYPE[size]} width="1/2" />
                    <Skeleton.Typography type="body-xs" width="1/3" />
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <UserAvatar username={name} avatar={avatarUrl} seed={avatarSeed ?? name} size={size} />
            <div className="flex min-w-0 flex-col">
                <Typography type={NAME_TYPE[size]} weight="medium" className="truncate">
                    {name}
                </Typography>
                <Typography type="body-xs" color="muted" className="truncate">
                    {role}
                </Typography>
            </div>
        </div>
    )
}
