import React from "react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { cn } from "@heroui/react"
import { Typography, type TypographySize } from "@sb-components/atoms/text/Typography/Typography"
import { UserAvatar } from "@sb-components/atoms/display/UserAvatar/UserAvatar"

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

/**
 * Cỡ chữ của tên theo size chip. Sau khi atom gộp namespace (thầy chốt 2026-07-25),
 * bảng này là DỮ LIỆU (chuỗi `size`) chứ không còn là bảng component.
 */
const NAME_SIZE: Record<PersonaIdentityChipSize, TypographySize> = {
    sm: "sm",
    md: "sm",
    lg: "base",
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
    /** When on, emit `data-anat-part` on this cluster's own direct sub-parts (avatar · name · role) so a `BlockAnatomy` panel can badge them. */
    showAnatomy?: boolean
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
    showAnatomy = false,
}: PersonaIdentityChipProps) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                <Avatar.Base isSkeleton size={size} showAnatomy={showAnatomy} />
                <div className="flex min-w-0 flex-col gap-1">
                    <Typography
                        size={NAME_SIZE[size]}
                        isSkeleton
                        className="w-1/2"
                        anatPart={showAnatomy ? "Skeleton" : undefined}
                    />
                    <Typography size="xs" isSkeleton className="w-1/3" anatPart={showAnatomy ? "Skeleton" : undefined} />
                </div>
            </div>
        )
    }

    const nameSize = NAME_SIZE[size]

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <UserAvatar.Base
                username={name}
                avatar={avatarUrl}
                seed={avatarSeed ?? name}
                size={size}
                anatPart={showAnatomy ? "UserAvatar" : undefined}
            />
            <div className="flex min-w-0 flex-col">
                <Typography.Base size={nameSize}
                    weight="medium"
                    showAnatomy={showAnatomy}
                    className="truncate"
                    text={name}
                />
                <Typography.Base size="xs"
                    color="muted"
                    showAnatomy={showAnatomy}
                    className="truncate"
                    text={role}
                />
            </div>
        </div>
    )
}
