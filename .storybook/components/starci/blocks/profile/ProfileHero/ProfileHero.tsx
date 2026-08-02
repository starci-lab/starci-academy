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
    ShareNetworkIcon,
    UserCheckIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import type { AvatarRing } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import type { ButtonVariant } from "@sb-components/atoms/buttons/Button/Button"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ProfileHero` — the identity sidebar for a profile page: a rank-framed avatar,
 * name/@handle/role, bio, location + work-mode, follower and badge social proof,
 * one primary CTA + share, and a github/linkedin/website/joined meta list.
 * Composes `SurfaceCard`/frames/atoms plus the domain leaves `ProfileRankAvatar`,
 * `ProfileFollowers`, `ProfileBadges`, `ShareProfileButton`. Rank is a number;
 * "Rank #N" is the block's own sentence, and the rank ring is a `className` on
 * `Avatar`, not a new shape. `onHire` fires the `canHire`-gated CTA. Social links
 * render as `Typography isLink`; `InlineIconLabel` is used only for the
 * plain-text meta rows. `isSkeleton` flows into every content atom.
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

// ─────────────────────────────────────────────────────────────────────────────
// Leaf — ProfileRankAvatar: the avatar + its rank frame + rank caption.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ring tone for a ranked avatar — top-3 gets the strongest (warning) frame,
 * any other rank a quieter accent frame, no rank at all → no ring. A fact
 * about standing, not decoration chosen for its own sake. The atom (`Avatar`'s
 * `ring` prop) owns the frame's shape; this only picks the tone.
 */
const rankRingTone = (rank: number | undefined): AvatarRing | undefined => {
    if (rank == null) return undefined
    return rank <= 3 ? "warning" : "accent"
}

interface ProfileRankAvatarProps {
    name: string
    avatarUrl?: string
    rank?: number
    isSkeleton?: boolean
}

/** Avatar with an optional rank-tinted ring, plus the "Rank #N" caption underneath. */
const ProfileRankAvatar = ({ name, avatarUrl, rank, isSkeleton = false}: ProfileRankAvatarProps) => {
    const rankBody = (
        <>
            <div>
                <Avatar
                    name={name}
                    src={avatarUrl}
                    size="lg"
                    isSkeleton={isSkeleton}

                    ring={isSkeleton ? undefined : rankRingTone(rank)}
                />
            </div>
            {isSkeleton || rank != null ? (
                <Typography
                    size="xs"
                    color="muted"
                    weight="medium"
                    isSkeleton={isSkeleton}
                    text={rank != null ? `Rank #${rank}` : undefined}

                />
            ) : null}
        </>
    )
    return <StackV gap={2} align="center" items={[() => rankBody]} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Leaf — ProfileFollowers: the follower count stat.
// ─────────────────────────────────────────────────────────────────────────────

interface ProfileFollowersProps {
    followersCount?: number
    isSkeleton?: boolean
}

/** Follower count + caption, same "big tabular number over a muted label" idiom `FlashcardDueHero` uses for its due-count (file header, judgement call 4). */
const ProfileFollowers = ({ followersCount, isSkeleton = false}: ProfileFollowersProps) => {
    const followersBody = (
        <>
            <Typography
                size="h5"
                weight="bold"
                tabularNums
                isSkeleton={isSkeleton}
                text={isSkeleton ? undefined : String(followersCount ?? 0)}

            />
            <Typography
                size="xs"
                color="muted"
                isSkeleton={isSkeleton}
                text="Followers"

            />
        </>
    )
    return <StackV gap={1} items={[() => followersBody]} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Leaf — ProfileBadges: the earned-achievement chip row.
// ─────────────────────────────────────────────────────────────────────────────

interface ProfileBadgesProps {
    badges?: ReadonlyArray<ProfileBadge>
    isSkeleton?: boolean
}

/** Two placeholder pills while loading — enough to read as "a row of badges", not a guess at the real count. */
const SKELETON_BADGE_KEYS = ["skeleton-badge-1", "skeleton-badge-2"] as const

/** A wrapping row of earned-achievement chips. */
const ProfileBadges = ({ badges, isSkeleton = false}: ProfileBadgesProps) => {
    const items = isSkeleton
        ? SKELETON_BADGE_KEYS.map((key) => ({
            key,
            content: <Chip isSkeleton />,
        }))
        : (badges ?? []).map((badge) => ({
            key: badge.id,
            content: (
                <Chip
                    tone="accent"
                    icon={badge.icon}
                    text={badge.label}

                />
            ),
        }))
    return <Cluster items={items} gap={2} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Leaf — ShareProfileButton: the icon-only share trigger.
// ─────────────────────────────────────────────────────────────────────────────

interface ShareProfileButtonProps {
    onShare?: () => void
    isSkeleton?: boolean
}

/** Icon-only share trigger — the caller decides what "share" does (copy link, open a sheet, …). */
const ShareProfileButton = ({ onShare, isSkeleton = false}: ShareProfileButtonProps) => {
    if (isSkeleton) {
        return <Button isSkeleton isIconOnly />
    }
    return (
        <Button
            isIconOnly
            variant="tertiary"
            prefixIcon={ShareNetworkIcon}
            ariaLabel="Share profile"
            onPress={onShare}

        />
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Primary CTA — hire / follow / edit, mutually exclusive (one slot, §ProfileHero brief).
// ─────────────────────────────────────────────────────────────────────────────

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
            <StackV gap={1} align="center" items={[() => nameBlock]} />
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
                classNames={["flex-1"]}
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
                return <StackH key={entry.key} gap={2} items={[() => socialRow]} />
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
            <StackV gap={4} items={[() => metaList]} />
        </>
    ) : null

    const cardBody = (
        <>
            <StackV gap={4} align="center" items={[() => identitySection]} />

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
                    justify="center"


                    items={[
                        ...(isSkeleton || location
                            ? [
                                {
                                    key: "location",
                                    content: (
                                        <InlineIconLabel
                                            icon={MapPinIcon}
                                            isSkeleton={isSkeleton}
                                            label={location}
                                        />
                                    ),
                                },
                            ]
                            : []),
                        ...(isSkeleton || workMode
                            ? [
                                {
                                    key: "workMode",
                                    content: (
                                        <EnumChip
                                            value={(workMode ?? "remote") as ProfileWorkMode}
                                            map={WORK_MODE_MAP}
                                            isSkeleton={isSkeleton}

                                        />
                                    ),
                                },
                            ]
                            : []),
                    ]}
                />
            ) : null}

            <StackH gap={3} divider items={[() => statsRow]} />

            <StackH gap={3} items={[() => actionsRow]} />

            {metaSection}
        </>
    )

    return (
        <div>
            <SurfaceCard


                body={() => <StackV gap={6} items={[() => cardBody]} />}
            />
        </div>
    )
}

export { ProfileHero }
