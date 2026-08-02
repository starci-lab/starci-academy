import type { ProfileWorkMode } from "@/components/starci/blocks/profile/ProfileHero"
import { WorkMode } from "@/modules/types/enums/work-mode"
import type { UserEntity } from "@/modules/types/entities/user"
import type { PublicProfileUser } from "./component"

/** `WorkMode` (GraphQL/DB enum) → the block's own `ProfileWorkMode` string union — same values, different (nominal enum vs. literal) types. */
const WORK_MODE_MAP: Record<WorkMode, ProfileWorkMode> = {
    [WorkMode.Remote]: "remote",
    [WorkMode.Hybrid]: "hybrid",
    [WorkMode.Onsite]: "onsite",
}

/**
 * Convert the real {@link UserEntity} (as returned by `useQueryUserProfileSwr`)
 * into the block-shaped {@link PublicProfileUser} `_PublicProfileLayout` renders.
 *
 * TODO(map): `rank` and `badges` have no equivalent field on `UserEntity` — the
 * real feature renders them via its own self-fetching `ProfileRankAvatar` /
 * `ProfileBadges` leaves (see `src/components/features/profile/PublicProfile/
 * ProfileHero/ProfileRankAvatar` and `.../ProfileBadges`), which this pilot does
 * not wire up (out of scope — see task scope limit). Left `undefined`/`[]` so the
 * rank frame + badge row simply do not render, same as an unranked/unbadged user.
 */
export const toPublicProfileUser = (user: UserEntity): PublicProfileUser => {
    const hasDisplayName = Boolean(user.displayName?.trim())
    return {
        id: user.id,
        fullName: hasDisplayName ? (user.displayName as string) : user.username,
        handle: user.username,
        roleTitle: user.roleTitle ?? undefined,
        bio: user.bio ?? undefined,
        location: user.location ?? undefined,
        workMode: user.workMode ? WORK_MODE_MAP[user.workMode] : undefined,
        avatarUrl: user.avatar,
        // TODO(map): no rank field on `UserEntity` — see file header.
        rank: undefined,
        followersCount: user.followerCount,
        // TODO(map): no badges field on `UserEntity` — see file header.
        badges: [],
        joinedAt: new Date(user.createdAt).toISOString(),
        social: {
            github: user.githubUsername ? `https://github.com/${user.githubUsername}` : undefined,
            linkedin: user.linkedinUrl ?? undefined,
            website: user.websiteUrl ?? undefined,
        },
        profileLocked: user.profileLocked,
        sectionVisibility: user.sectionVisibility,
        openToWork: user.openToWork,
    }
}
