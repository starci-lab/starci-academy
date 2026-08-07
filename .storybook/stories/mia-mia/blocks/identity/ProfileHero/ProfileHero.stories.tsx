import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { ProfileHero } from "@sb-components/mia-mia/blocks/identity/ProfileHero"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ProfileHero`: the lead block of a public profile — a large
 * avatar, the display name over its `@username`, an optional rank badge and
 * bio, a followers/following stats row, and a caller-supplied follow-action
 * slot.
 *
 * One prop = one leaf: each visual prop gets its own leaf rendering that
 * prop's full value set — `displayName` · `avatar` · `bio` ·
 * `followerCount` · `followingCount` · `rankLabel` · `action`. `username`
 * and `followersLabel` / `followingLabel` are required-but-arbitrary text
 * with no enumerable value set, so they carry no leaf of their own.
 */
const meta: Meta<typeof ProfileHero> = {
    title: "MiaMia/ProfileHero",
    component: ProfileHero,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProfileHero>

/**
 * `Avatar`/`Typography`/`Chip` are the actual `@heroui/react` elements this
 * block renders directly (via `UserAvatar` for the avatar); `Button` is the
 * caller-supplied node passed into the `action` slot in these demos — the
 * block itself never renders a button. No `storyId`: there's no story of
 * OURS to jump to for a library component.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": { tier: "heroui", role: "the HeroUI avatar this block's `UserAvatar` wraps — photo, generated fallback, or initials, at the large `lg` size" },
    "Typography": { tier: "heroui", role: "the display name, the `@username` line, the bio, and each stat's value/label" },
    "Chip": { tier: "heroui", role: "the rank badge, dropped entirely when `rankLabel` is absent" },
    "Button": { tier: "heroui", role: "the caller-supplied follow action passed into the `action` slot — the block never owns this button" },
}

/** Bare leaf — no optional prop turned on, showing the floor every richer state below builds on. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="No prop turned on"
                reason="Public-profile hero: a large avatar beside the display name over its `@username`, an optional bio, a rank badge, a followers/following stats row, and a caller-supplied action slot. Purely presentational — no store, data, or router access; the owning feature fetches the user and supplies the localized labels and the follow control. This leaf is the baseline every prop-leaf below differs from by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (required props only)",
                        why: "With every optional prop unset, the hero collapses to just the identity row and the stats — no bio, no rank badge, no action — and both counts show `—` since neither was resolved. This is the floor every richer state below builds on.",
                        code: `<ProfileHero
    username="newlearner"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="newlearner"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `displayName` — falls back to `username`; long values truncate rather than push the action out. */
export const DisplayName: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="Prop `displayName`"
                reason="The `h4` name reads `displayName` when the account has set one, else it falls back to `username` — the same fallback `FriendRow` uses, so a profile is never headed by a blank name. Long names truncate rather than push the action slot out of the row."
                states={[
                    {
                        name: "displayName = undefined (falls back to username)",
                        why: "A fresh account with no display name still needs a heading, so the hero falls back to the bare `username`.",
                        code: `<ProfileHero
    username="newlearner"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="newlearner"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                    {
                        name: "displayName = \"Ethan Vaughn\"",
                        why: "Once the account has a display name it leads the heading, with `@username` still visible underneath for the exact handle.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                    {
                        name: "displayName long, narrow frame (truncation)",
                        why: "Names are user-set with no length ceiling; in a narrow frame both the name and the handle truncate with an ellipsis so the action slot on the right never gets pushed out of the row.",
                        code: `<div className="max-w-sm">
    <ProfileHero
        username="very.long.username.for.testing.truncation"
        displayName="Alexandra Wellington-Fairchild With An Exceptionally Long Display Name"
        followersLabel="followers"
        followingLabel="following"
        action={<Button size="sm" variant="primary">Follow</Button>}
    />
</div>`,
                        render: (
                            <div className="max-w-sm">
                                <ProfileHero
                                    username="very.long.username.for.testing.truncation"
                                    displayName="Alexandra Wellington-Fairchild With An Exceptionally Long Display Name"
                                    followersLabel="followers"
                                    followingLabel="following"
                                    action={<Button size="sm" variant="primary">Follow</Button>}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `avatar` — forwarded to `UserAvatar`'s own resilient fallback chain, at the hero's `lg` size. */
export const Avatar: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="Prop `avatar`"
                reason="`avatar` is forwarded straight to `UserAvatar` at the large `lg` size — an uploaded photo when present, else its own deterministic generated face seeded by the username."
                states={[
                    {
                        name: "avatar = \"https://i.pravatar.cc/256?img=47\" (uploaded photo)",
                        why: "An uploaded photo renders directly at the hero's large avatar size.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    avatar="https://i.pravatar.cc/256?img=47"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                avatar="https://i.pravatar.cc/256?img=47"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                    {
                        name: "avatar = undefined (generated fallback)",
                        why: "No photo on file, so the large avatar falls back to `UserAvatar`'s own generated face rather than a blank circle.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `bio` — dropped entirely when absent, never rendered as an empty line. */
export const Bio: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="Prop `bio`"
                reason="The bio line sits under the identity row and above the stats, only when the account has written one — an absent bio drops the line entirely rather than reserving empty space for it."
                states={[
                    {
                        name: "bio = \"Learning English one phrase a day. A2 → B1.\"",
                        why: "A short tagline gives the profile a voice beyond the name and the numbers.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    bio="Learning English one phrase a day. A2 → B1."
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                bio="Learning English one phrase a day. A2 → B1."
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                    {
                        name: "bio = undefined (hidden)",
                        why: "Without a bio, the line between the identity row and the stats is dropped rather than left blank.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `followerCount` — a resolved field; missing renders `—`, never a misleading `0`. */
export const FollowerCount: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="Prop `followerCount`"
                reason="`followerCount` is a resolved field the backend may not always return; a missing count renders `—` rather than a misleading `0`, so an unimplemented field reads as unknown, not as nobody."
                states={[
                    {
                        name: "followerCount = 128",
                        why: "A resolved count formats with `toLocaleString()` and sits above the `followersLabel` caption.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followerCount={128}
    followingCount={64}
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followerCount={128}
                                followingCount={64}
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                    {
                        name: "followerCount = null (unresolved)",
                        why: "The backend has not resolved this field yet, so the stat shows `—` instead of a `0` that would read as \"no followers\".",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followerCount={null}
    followingCount={64}
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followerCount={null}
                                followingCount={64}
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `followingCount` — same resolved-field contract as `followerCount`, on the second stat cell. */
export const FollowingCount: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="Prop `followingCount`"
                reason="Same resolved-field contract as `followerCount`, on the second stat cell: a missing count renders `—`, never a misleading `0`."
                states={[
                    {
                        name: "followingCount = 64",
                        why: "A resolved count formats with `toLocaleString()` and sits above the `followingLabel` caption.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followerCount={128}
    followingCount={64}
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followerCount={128}
                                followingCount={64}
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                    {
                        name: "followingCount = null (unresolved)",
                        why: "The backend has not resolved this field yet, so the second stat shows `—` instead of a `0`.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followerCount={128}
    followingCount={null}
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followerCount={128}
                                followingCount={null}
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `rankLabel` — the badge is dropped entirely when absent, never rendered empty. */
export const RankLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="Prop `rankLabel`"
                reason="The rank badge is a `Chip` under the name, shown only once the account has earned a rank — its own component is dropped entirely when `rankLabel` is absent, not rendered empty."
                states={[
                    {
                        name: "rankLabel = \"Gold rank\"",
                        why: "A soft accent chip with a medal glyph sits under the name once the account has a rank to show.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    rankLabel="Gold rank"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                rankLabel="Gold rank"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                    {
                        name: "rankLabel = undefined (hidden)",
                        why: "Without a rank yet, the chip is dropped entirely rather than rendered empty under the name.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `action` — a caller-owned slot, never a button the block builds itself. */
export const Action: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileHero"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-2xl"
                leaf="Prop `action`"
                reason="The follow control is a slot, not a built-in button: the owning feature decides which button and which state to pass, so the block stays presentational and never owns the follow mutation itself."
                states={[
                    {
                        name: "action = primary Follow button (not yet following)",
                        why: "The viewer does not follow this person yet, so the feature passes a primary button inviting the first action.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followersLabel="followers"
    followingLabel="following"
    action={<Button size="sm" variant="primary">Follow</Button>}
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followersLabel="followers"
                                followingLabel="following"
                                action={<Button size="sm" variant="primary">Follow</Button>}
                            />
                        ),
                    },
                    {
                        name: "action = outline Following button (already following)",
                        why: "Once following, the feature swaps in an outline button so the \"on\" state reads as current status, not a call to act.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followersLabel="followers"
    followingLabel="following"
    action={<Button size="sm" variant="outline">Following</Button>}
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followersLabel="followers"
                                followingLabel="following"
                                action={<Button size="sm" variant="outline">Following</Button>}
                            />
                        ),
                    },
                    {
                        name: "action = undefined (no slot rendered)",
                        why: "On the signed-in user's own profile there is no follow action at all, so the slot renders nothing rather than an empty gap.",
                        code: `<ProfileHero
    username="levan.dev"
    displayName="Ethan Vaughn"
    followersLabel="followers"
    followingLabel="following"
/>`,
                        render: (
                            <ProfileHero
                                username="levan.dev"
                                displayName="Ethan Vaughn"
                                followersLabel="followers"
                                followingLabel="following"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
