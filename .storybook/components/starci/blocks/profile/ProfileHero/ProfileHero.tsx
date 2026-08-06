import React from "react"
import type { ComponentType, SVGProps } from "react"
import {
    CalendarBlankIcon,
    GithubLogoIcon,
    GlobeIcon,
    HandshakeIcon,
    LinkedinLogoIcon,
    MapPinIcon,
    PencilSimpleIcon,
    UserCheckIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { ProfileRankAvatar } from "./ProfileRankAvatar"
import { ProfileFollowers } from "./ProfileFollowers"
import { ProfileBadges } from "./ProfileBadges"
import { ShareProfileButton } from "./ShareProfileButton"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import type { ButtonVariant } from "@sb-components/atoms/buttons/Button/Button"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ProfileHero` — the identity sidebar for a person's profile page:
 * rank-framed avatar, name/@handle/role, bio, location + work-mode, follower
 * and badge social proof, one primary CTA (hire/follow/edit) + share, and a
 * github/linkedin/website/joined meta list. Composed from `SurfaceCard` around
 * `StackV`/`StackH`/`Cluster` holding `Avatar`/`Typography`/`Chip`/`Button`/
 * `Divider` plus `EnumChip`/`InlineIconLabel`. Two leaves: `Default` (every
 * optional row present; CTA/skeleton/follow-state are content states) and
 * `Minimal` (no rank/role/bio/location/work-mode/badges/social links — losing
 * those removes real nodes, earning its own leaf).
 */

/** An icon passed as a COMPONENT (e.g. a Phosphor `*Icon`), rendered at the tile's own scale. Declared locally per atom convention (§5.0) rather than importing one library's type. */
type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** How this person works — the block owns the label wording (§14d.1), the caller only says which one. */
export type ProfileWorkMode = "remote" | "onsite" | "hybrid"

/** External profile links. Each is optional; an absent one simply drops its meta row. */
export interface ProfileSocialLinks {
    /** GitHub profile URL. */
    github?: string
    /** LinkedIn profile URL. */
    linkedin?: string
    /** Personal site/portfolio URL. */
    website?: string
}

/** One achievement/verification badge earned by this person. */
export interface ProfileBadge {
    /** Stable id — used as the chip's React key. */
    id: string
    /** Badge label, already worded by the caller's domain (e.g. "Top mentor"). */
    label: string
    /** Optional leading glyph for the badge chip. */
    icon?: IconComponent
}

/** The person this hero profiles — plain data, the block builds the sidebar from it. */
export interface ProfileHeroUser {
    /** Stable id (not rendered; kept for parity with other domain-user shapes). */
    id: string
    /** Full display name. */
    fullName: string
    /** Handle WITHOUT the leading `@` — the block adds it (§14d.1). */
    handle: string
    /** Role/title line under the name. Row disappears when absent. */
    roleTitle?: string
    /** Short bio/about text. Row disappears when absent. */
    bio?: string
    /** Free-text location (e.g. "Hanoi, Vietnam"). Row disappears when absent. */
    location?: string
    /** How this person works. Row disappears when absent. */
    workMode?: ProfileWorkMode
    /** Photo URL. Empty/missing → `Avatar`'s own fallback chain, never a blank frame. */
    avatarUrl?: string
    /** Leaderboard-style standing (1 = top). Absent → no rank frame/caption at all. */
    rank?: number
    /** Total followers. Absent renders as `0` (a real, known count of nothing). */
    followersCount?: number
    /** Achievement badges earned. Empty/absent → the badges row disappears entirely. */
    badges?: ReadonlyArray<ProfileBadge>
    /** ISO date string this person joined. Required — every profile has one. */
    joinedAt: string
    /** External links. Absent/all-empty → the social rows of the meta list disappear. */
    social?: ProfileSocialLinks
}

/** Props for {@link ProfileHero}. */
export interface ProfileHeroProps {
    /** The profiled person. */
    user: ProfileHeroUser
    /** `true` → the viewer IS this person: the primary CTA becomes "Edit profile", follow/hire never show. */
    isSelf?: boolean
    /** `true` (and not `isSelf`) → the primary CTA becomes "Hire me" instead of follow. */
    canHire?: boolean
    /** Whether the viewer already follows this person. Ignored when `isSelf`/`canHire`. */
    following?: boolean
    /** `true` → the follow CTA shows its busy state while the toggle is in flight. */
    isFollowPending?: boolean
    /** Fired when the viewer toggles follow (only reachable when neither `isSelf` nor `canHire`). */
    onToggleFollow?: () => void
    /** Fired when the viewer presses "Hire me" (only reachable when `canHire` and not `isSelf`). See file header, judgement call 3. */
    onHire?: () => void
    /** Fired when the profile owner presses "Edit profile" (only reachable when `isSelf`). */
    onEdit?: () => void
    /** Fired when the share action is pressed. */
    onShare?: () => void
    /** `true` → every real part switches to its own shimmer; the profile stops accepting presses. */
    isSkeleton?: boolean
}

interface PrimaryAction {
    label: string
    variant: ButtonVariant
    prefixIcon: IconComponent
    onPress?: () => void
    isPending?: boolean
}

/** Inputs {@link resolvePrimaryAction} needs to pick the one CTA slot. */
interface ResolvePrimaryActionParams {
    isSelf: boolean
    canHire: boolean
    following: boolean
    isFollowPending: boolean
    onEdit?: () => void
    onHire?: () => void
    onToggleFollow?: () => void
}

const resolvePrimaryAction = (params: ResolvePrimaryActionParams): PrimaryAction => {
    const { isSelf, canHire, following, isFollowPending, onEdit, onHire, onToggleFollow } = params
    if (isSelf) {
        return { label: "Edit profile", variant: "secondary", prefixIcon: PencilSimpleIcon, onPress: onEdit }
    }
    if (canHire) {
        return { label: "Hire me", variant: "primary", prefixIcon: HandshakeIcon, onPress: onHire }
    }
    return {
        label: following ? "Following" : "Follow",
        variant: following ? "secondary" : "primary",
        prefixIcon: following ? UserCheckIcon : UserPlusIcon,
        onPress: onToggleFollow,
        isPending: isFollowPending,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Meta list — social links (as text-links) + joined date (plain).
// ─────────────────────────────────────────────────────────────────────────────

/** One entry of the social meta list — the block's own icon + label per platform. */
interface ProfileSocialMetaEntry {
    key: keyof ProfileSocialLinks
    icon: IconComponent
    label: string
}

/** The block's own label per platform (§14d.1) — the caller only supplies the URL. */
const SOCIAL_META: ReadonlyArray<ProfileSocialMetaEntry> = [
    { key: "github", icon: GithubLogoIcon, label: "GitHub" },
    { key: "linkedin", icon: LinkedinLogoIcon, label: "LinkedIn" },
    { key: "website", icon: GlobeIcon, label: "Personal site" },
]

/** `Intl`-formatted "Month M, YYYY" from an ISO date string. Empty input → empty string (no bogus date printed). */
const formatJoinedDate = (isoDate: string): string => {
    const date = new Date(isoDate)
    if (Number.isNaN(date.getTime())) return ""
    return new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(date)
}

/** How this person works, worded by the block (§14d.1). */
const WORK_MODE_MAP: Record<ProfileWorkMode, EnumChipEntry> = {
    remote: { label: "Remote" },
    onsite: { label: "Onsite" },
    hybrid: { label: "Hybrid", color: "accent" },
}

/**
 * The bare identity sidebar. See the file header for the reuse contract and the
 * four judgement calls.
 *
 * @param props - {@link ProfileHeroProps}
 */
const ProfileHero = ({
    user,
    isSelf = false,
    canHire = false,
    following = false,
    isFollowPending = false,
    onToggleFollow,
    onHire,
    onEdit,
    onShare,
    isSkeleton = false,
}: ProfileHeroProps) => {
    const { fullName, handle, roleTitle, bio, location, workMode, avatarUrl, rank, followersCount, badges, joinedAt, social } = user

    const action = resolvePrimaryAction({ isSelf, canHire, following, isFollowPending, onEdit, onHire, onToggleFollow })
    const hasBadgesRow = isSkeleton || Boolean(badges && badges.length > 0)
    const hasLocationRow = isSkeleton || Boolean(location) || Boolean(workMode)

    const socialLinks = social ?? {}
    const socialEntries = SOCIAL_META.filter((entry) => Boolean(socialLinks[entry.key]))
    const hasMetaList = isSkeleton || socialEntries.length > 0 || Boolean(joinedAt)

    const nameBlock = (
        <>
            <Typography
                size="h5"
                weight="bold"
                align="center"
                isSkeleton={isSkeleton}
                text={fullName}

            />
            <Typography
                size="sm"
                color="muted"
                align="center"
                isSkeleton={isSkeleton}
                text={isSkeleton ? undefined : `@${handle}`}

            />
            {isSkeleton || roleTitle ? (
                <Typography
                    size="sm"
                    weight="medium"
                    align="center"
                    isSkeleton={isSkeleton}
                    text={roleTitle}

                />
            ) : null}
        </>
    )

    const identitySection = (
        <>
            <ProfileRankAvatar
                name={fullName}
                avatarUrl={avatarUrl}
                rank={rank}
                isSkeleton={isSkeleton}

            />
            <StackV gap={1} principle="name-handle"
                explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                align="center" isSkeleton={isSkeleton} items={[() => nameBlock]}  />
        </>
    )

    const statsRow = (
        <>
            <ProfileFollowers followersCount={followersCount} isSkeleton={isSkeleton} />
            {hasBadgesRow ? (
                <ProfileBadges badges={badges} isSkeleton={isSkeleton} />
            ) : null}
        </>
    )

    const actionsRow = (
        <>
            <Button

                variant={action.variant}
                label={action.label}
                prefixIcon={action.prefixIcon}
                onPress={action.onPress}
                isPending={action.isPending}
                isSkeleton={isSkeleton}

            />
            <ShareProfileButton onShare={onShare} isSkeleton={isSkeleton} />
        </>
    )

    const metaList = (
        <>
            {(isSkeleton ? SOCIAL_META : socialEntries).map((entry) => {
                const socialRow = (
                    <>
                        <span aria-hidden className="inline-flex shrink-0 text-muted [&_svg]:size-4">
                            <entry.icon />
                        </span>
                        <Typography
                            size="xs"
                            isLink={!isSkeleton}
                            href={isSkeleton ? undefined : socialLinks[entry.key]}
                            isSkeleton={isSkeleton}
                            truncate
                            text={isSkeleton ? undefined : entry.label}

                        />
                    </>
                )
                return <StackH key={entry.key} gap={2} isSkeleton={isSkeleton} items={[() => socialRow]} />
            })}
            <InlineIconLabel
                icon={CalendarBlankIcon}
                tone="default"
                isSkeleton={isSkeleton}
                label={isSkeleton ? undefined : `Joined ${formatJoinedDate(joinedAt)}`}
            />
        </>
    )

    const metaSection = hasMetaList ? (
        <>
            <Divider />
            <StackV gap={4} isSkeleton={isSkeleton} items={[() => metaList]} />
        </>
    ) : null

    const cardBody = (
        <>
            <StackV gap={4} principle="card-caption"
                explain="Holds caption text under card media so the caption stays attached to the image above it."
                align="center" isSkeleton={isSkeleton} items={[() => identitySection]}  />

            {isSkeleton || bio ? (
                <Typography
                    size="sm"
                    color="muted"
                    align="center"
                    lineClamp={3}
                    isSkeleton={isSkeleton}
                    text={bio}

                />
            ) : null}

            {hasLocationRow ? (
                <Cluster
                    gap={3}
                    principle="chip-row"
                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                    justify="center"
                    items={[
                        ...(isSkeleton || location
                            ? [
                                () => (
                                    <InlineIconLabel
                                        icon={MapPinIcon}
                                        isSkeleton={isSkeleton}
                                        label={location}
                                    />
                                ),
                            ]
                            : []),
                        ...(isSkeleton || workMode
                            ? [
                                () => (
                                    <EnumChip
                                        value={(workMode ?? "remote") as ProfileWorkMode}
                                        map={WORK_MODE_MAP}
                                        isSkeleton={isSkeleton}
                                    />
                                ),
                            ]
                            : []),
                    ]}
                />
            ) : null}

            <StackH gap={3} principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                divider isSkeleton={isSkeleton} items={[() => statsRow]}  />

            <StackH gap={3} isSkeleton={isSkeleton} items={[() => actionsRow]} />

            {metaSection}
        </>
    )

    return (
        <div>
            <SurfaceCard


                body={() => <StackV gap={6} isSkeleton={isSkeleton} items={[() => cardBody]} />}
            />
        </div>
    )
}

export { ProfileHero }
