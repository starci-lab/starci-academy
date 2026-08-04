import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { ProfileHero } from "@sb-components/mia-mia/blocks/identity/ProfileHero"

const meta: Meta<typeof ProfileHero> = {
    title: "MiaMia/ProfileHero",
    component: ProfileHero,
    args: {
        username: "levan.dev",
        displayName: "Ethan Vaughn",
        avatar: null,
        bio: "Learning English one phrase a day. A2 → B1.",
        followerCount: 128,
        followingCount: 64,
        followersLabel: "followers",
        followingLabel: "following",
        rankLabel: "Gold rank",
    },
}

export default meta

type Story = StoryObj<typeof ProfileHero>

/** The lead block of a public profile: the person, their handle, a rank badge, the follower/following counts, and a follow control. Use it as the header of someone else's profile — not for the signed-in user's own settings header, and not in a dense list, where `UserCell` fits. */
export const Default: Story = {
    parameters: { usage: "The lead block of a public profile: the person, their handle, a rank badge, the follower/following counts, and a follow control. Use it as the header of someone else's profile — not for the signed-in user's own settings header, and not in a dense list, where `UserCell` fits." },
    render: (args) => (
        <div className="flex max-w-2xl flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    The full hero: avatar, name over handle, rank badge, a bio line, and the stats row. The
                    follow control is a slot — the owning feature passes the button so the block stays
                    presentational.
                </Typography>
            </div>
            <ProfileHero {...args} action={<Button size="sm" variant="primary">Follow</Button>} />
        </div>
    ),
}

/** The two states of the follow control, driven entirely by the feature — the block only holds the slot. */
export const FollowStates: Story = {
    parameters: { usage: "The two states of the follow control, driven entirely by the feature — the block only holds the slot." },
    render: (args) => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Not following</Label>
                    <Typography type="body-sm" color="muted">
                        A primary button invites the first action — the viewer does not follow this person yet.
                    </Typography>
                </div>
                <ProfileHero {...args} action={<Button size="sm" variant="primary">Follow</Button>} />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Already following</Label>
                    <Typography type="body-sm" color="muted">
                        Once following, the button softens to an outline so the "on" state reads as the current
                        state, not a call to act.
                    </Typography>
                </div>
                <ProfileHero {...args} action={<Button size="sm" variant="outline">Following</Button>} />
            </div>
        </div>
    ),
}

/** Counts are resolved fields the backend may not return — an absent count shows a `—`, never a misleading `0`. */
export const MissingCounts: Story = {
    args: {
        followerCount: null,
        followingCount: null,
    },
    parameters: { usage: "Counts are resolved fields the backend may not return — an absent count shows a `—`, never a misleading `0`." },
    render: (args) => (
        <div className="flex max-w-2xl flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Counts unavailable</Label>
                <Typography type="body-sm" color="muted">
                    When `followerCount` / `followingCount` are null or undefined the stat renders `—` so an
                    unimplemented field reads as "unknown", not "nobody".
                </Typography>
            </div>
            <ProfileHero {...args} action={<Button size="sm" variant="primary">Follow</Button>} />
        </div>
    ),
}

/** The barest profile: a username with no display name, bio, rank, or photo — everything optional falls away. */
export const Minimal: Story = {
    args: {
        username: "newlearner",
        displayName: undefined,
        avatar: null,
        bio: null,
        rankLabel: null,
    },
    parameters: { usage: "The barest profile: a username with no display name, bio, rank, or photo — everything optional falls away." },
    render: (args) => (
        <div className="flex max-w-2xl flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Minimal</Label>
                <Typography type="body-sm" color="muted">
                    With no display name the username leads; with no bio, rank, or action the block collapses to
                    the identity row and stats. Verify it still reads as a header, not a broken card.
                </Typography>
            </div>
            <ProfileHero {...args} />
        </div>
    ),
}

/** Check a long display name and handle in a narrow frame: both must truncate rather than push the action out. */
export const LongName: Story = {
    args: {
        username: "very.long.username.for.testing.truncation",
        displayName: "Alexandra Wellington-Fairchild With An Exceptionally Long Display Name",
    },
    parameters: { usage: "Check a long display name and handle in a narrow frame: both must truncate rather than push the action out." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long text in a narrow frame</Label>
                <Typography type="body-sm" color="muted">
                    Names are user-set and have no length ceiling; the name and handle truncate so the follow
                    action keeps its place.
                </Typography>
            </div>
            <div className="max-w-sm">
                <ProfileHero {...args} action={<Button size="sm" variant="primary">Follow</Button>} />
            </div>
        </div>
    ),
}
