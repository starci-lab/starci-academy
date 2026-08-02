import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProfileHero, type ProfileHeroUser } from "@sb-components/starci/blocks/profile/ProfileHero/ProfileHero"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
const meta: Meta<typeof ProfileHero> = {
    title: "StarCi/Blocks/Profile/ProfileHero/ProfileHero",
    component: ProfileHero,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProfileHero>

const PHOTO_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

const FULL_USER: ProfileHeroUser = {
    id: "user-1",
    fullName: "Gia-Bao Pham",
    handle: "baophamgia",
    roleTitle: "Senior Backend Engineer",
    bio: "8 years building large-scale backend systems. Enjoys writing about Kubernetes and event-driven architecture.",
    location: "Da Nang, Vietnam",
    workMode: "hybrid",
    avatarUrl: PHOTO_SRC,
    rank: 2,
    followersCount: 1240,
    badges: [
        { id: "badge-1", label: "Top mentor" },
        { id: "badge-2", label: "Verified" },
    ],
    joinedAt: "2022-03-14T00:00:00.000Z",
    social: {
        github: "https://github.com/example",
        linkedin: "https://linkedin.com/in/example",
        website: "https://example.dev",
    },
}

const MINIMAL_USER: ProfileHeroUser = {
    id: "user-2",
    fullName: "Ngoc-Anh Tran",
    handle: "ngocanh",
    joinedAt: "2026-01-05T00:00:00.000Z",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the sidebar's own card face, holding every part of the identity block on one surface", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "the vertical frame stacking the block's own regions — identity, bio, location row, stats, actions, meta list — one seam per region", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame pairing followers with badges, and the primary CTA with the share button", storyId: "frames-stack-stackh--with-divider" },
    "Cluster": { tier: "frame", role: "the wrapping row holding the location fact beside the work-mode chip, both peers of one set", storyId: "frames-cluster-cluster--default" },
    "Avatar": { tier: "atom", role: "the person's photo, wrapped in this block's own rank-tinted ring — a plain className on top of the atom's own fallback chain", storyId: "atoms-display-avatar-avatar--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — name, handle, role, bio, rank caption, follower count, or a social link — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "Chip": { tier: "atom", role: "one earned-achievement badge, or its skeleton pill while badges are still loading", storyId: "atoms-chips-chip-chip--default" },
    "EnumChip": { tier: "composite", role: "the work-mode fact, its tone and label coming from this block's own remote/onsite/hybrid map", storyId: "composites-chips-enumchip--neutral" },
    "InlineIconLabel": { tier: "composite", role: "an icon + text meta row — the location fact, or the joined-date fact at the foot of the sidebar", storyId: "composites-texts-inlineiconlabel--foreground" },
    "Button": { tier: "atom", role: "the one primary CTA (hire, follow, or edit — the caller's state decides which) or the icon-only share trigger beside it", storyId: "atoms-buttons-button-button--default" },
    "Divider": { tier: "atom", role: "the rule separating the profile's own content from its external meta list", storyId: "atoms-display-divider-divider--default" },
}

/** LEAF — full set: rank-framed avatar → identity → bio → location/work-mode → stats → actions → meta list. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                states={[
                    {
                        name: "visitor, not following",
                        why: "A visitor who does not yet follow this person sees the full identity, both stats, and a primary 'Follow' CTA beside share.",
                        code: `<ProfileHero
    user={fullUser}
    following={false}
    onToggleFollow={() => toggleFollow(fullUser.id)}
    onShare={() => shareProfile(fullUser.id)}
/>`,
                        render: (
                            <ProfileHero

                               
                                user={FULL_USER}
                                following={false}
                                onToggleFollow={() => {}}
                                onShare={() => {}}
                            />
                        ),
                    },
                    {
                        name: "already following",
                        why: "Once the viewer already follows this person, the SAME button slot flips to a quieter 'Following' state — content changes, the tree does not.",
                        code: `<ProfileHero
    user={fullUser}
    following
    onToggleFollow={() => toggleFollow(fullUser.id)}
    onShare={() => shareProfile(fullUser.id)}
/>`,
                        render: (
                            <ProfileHero
                                user={FULL_USER}
                                following
                                onToggleFollow={() => {}}
                                onShare={() => {}}
                            />
                        ),
                    },
                    {
                        name: "recruiter, canHire",
                        why: "A recruiter-context viewer sees 'Hire me' in the same CTA slot instead of follow — the three CTA modes are mutually exclusive, never stacked.",
                        code: `<ProfileHero
    user={fullUser}
    canHire
    onHire={() => openHireFlow(fullUser.id)}
    onShare={() => shareProfile(fullUser.id)}
/>`,
                        render: (
                            <ProfileHero
                                user={FULL_USER}
                                canHire
                                onHire={() => {}}
                                onShare={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSelf",
                        why: "The profile owner sees 'Edit profile' instead of follow/hire — editing your own profile is the one action that makes sense here.",
                        code: `<ProfileHero
    user={fullUser}
    isSelf
    onEdit={() => openEditProfile()}
    onShare={() => shareProfile(fullUser.id)}
/>`,
                        render: (
                            <ProfileHero
                                user={FULL_USER}
                                isSelf
                                onEdit={() => {}}
                                onShare={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every real part — avatar, name, bio, location, stats, CTA, meta list — switches to its own shimmer while the profile is still loading, and the CTA stops accepting presses.",
                        code: `<ProfileHero
    user={{ id: "", fullName: "", handle: "", joinedAt: "" }}
    isSkeleton
/>`,
                        render: (
                            <ProfileHero
                                user={{ id: "", fullName: "", handle: "", joinedAt: "" }}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a fresh account: no rank, role, bio, location, work-mode, badges or social links yet. */
export const Minimal: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                leaf="Minimal"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                states={[
                    {
                        name: "rank / role / bio / location / work-mode / badges / social all absent",
                        why: "A brand-new profile has nothing to prove yet — no rank frame, no role or bio line, no location/work-mode row, no badge row, and the meta list ends at the joined date. Only the name, handle, follower count (zero, a real known fact) and the follow CTA remain.",
                        code: `<ProfileHero
    user={{
        id: "user-2",
        fullName: "Ngoc-Anh Tran",
        handle: "ngocanh",
        joinedAt: "2026-01-05T00:00:00.000Z",
    }}
    onToggleFollow={() => toggleFollow("user-2")}
    onShare={() => shareProfile("user-2")}
/>`,
                        render: (
                            <ProfileHero

                               
                                user={MINIMAL_USER}
                                onToggleFollow={() => {}}
                                onShare={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
