import type { Meta, StoryObj } from "@storybook/nextjs"
import { FriendRow } from "@sb-components/mia-mia/blocks/identity/FriendRow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FriendRow`: an avatar with a presence dot, a linked name, an
 * optional `@handle`, and a right-aligned follow/unfollow action.
 *
 * One prop = one leaf: each visual prop gets its own leaf rendering that
 * prop's full value set — `displayName` · `avatar` · `handle` · `isOnline` ·
 * `isFollowing` · `isPending`. `username`, `profileHref`, `onlineLabel` /
 * `offlineLabel`, `followLabel` / `followingLabel`, and `onToggleFollow` are
 * required-but-arbitrary (a string with no enumerable value set, or a
 * callback with no visual effect of its own), so they carry no leaf of their
 * own — see the story file for exactly why each is left out.
 */
const meta: Meta<typeof FriendRow> = {
    title: "MiaMia/FriendRow",
    component: FriendRow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FriendRow>

/**
 * `Avatar`/`Typography`/`Button`/`Spinner` are the actual `@heroui/react`
 * elements this block renders directly (via `UserAvatar` for the avatar) —
 * tagged with the identifiers imported from `@heroui/react`, not made-up
 * role names. No `storyId`: there's no story of OURS to jump to for a
 * library component.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": { tier: "heroui", role: "the HeroUI avatar this block's `UserAvatar` wraps — photo, generated fallback, or initials" },
    "Typography": { tier: "heroui", role: "the linked display name and the muted `@handle` line beneath it" },
    "Button": { tier: "heroui", role: "the follow/unfollow action, flipping variant with `isFollowing`" },
    "Spinner": { tier: "heroui", role: "the busy indicator shown beside the button copy while `isPending`" },
}

/** Bare leaf — no optional prop turned on, showing the resting shape a suggestion list shows before the viewer acts. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FriendRow"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                leaf="No prop turned on"
                reason="Presentational friend/suggestion row: an avatar with a presence dot, a linked name, an optional handle, and a right-aligned follow action. Pure and props-only — the caller owns the follow mutation via `onToggleFollow`; presence and copy are passed in so the block stays store-free and locale-agnostic. This leaf is the baseline every prop-leaf below differs from by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (isOnline = false, isFollowing = false, isPending = false)",
                        why: "The resting shape a suggestion list shows before the viewer has acted: an offline dot, no handle line, and the primary follow action. Every optional prop below is unset at its own default.",
                        code: `<FriendRow
    username="an.nguyen"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="an.nguyen"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `displayName` — falls back to `username` when unset. */
export const DisplayName: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FriendRow"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                leaf="Prop `displayName`"
                reason="The linked name reads `displayName` when the account has set one; a fresh account without a display name still needs a name to show, so the row falls back to `username` rather than leaving the link blank."
                states={[
                    {
                        name: "displayName = \"An Nguyen\"",
                        why: "The human-friendly name leads the row once the account has set one — this is what most suggestions show.",
                        code: `<FriendRow
    username="an.nguyen"
    displayName="An Nguyen"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="an.nguyen"
                                displayName="An Nguyen"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                    {
                        name: "displayName = undefined (falls back to username)",
                        why: "A brand-new account has not chosen a display name yet, so the row falls back to `username` rather than rendering a nameless link.",
                        code: `<FriendRow
    username="an.nguyen"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="an.nguyen"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `avatar` — forwarded to `UserAvatar`'s own resilient fallback chain. */
export const Avatar: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FriendRow"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                leaf="Prop `avatar`"
                reason="`avatar` is forwarded straight to `UserAvatar`, which resolves it against its own resilient fallback chain — an uploaded photo when present, else a deterministic generated face seeded by the username."
                states={[
                    {
                        name: "avatar = \"https://i.pravatar.cc/128?img=32\" (uploaded photo)",
                        why: "The account has an uploaded photo, so the row shows it directly rather than the generated placeholder.",
                        code: `<FriendRow
    username="linh.dao"
    displayName="Linh Dao"
    avatar="https://i.pravatar.cc/128?img=32"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="linh.dao"
                                displayName="Linh Dao"
                                avatar="https://i.pravatar.cc/128?img=32"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                    {
                        name: "avatar = undefined (generated fallback)",
                        why: "No photo on file, so `UserAvatar` draws its deterministic generated face seeded by the username instead of leaving the row blank.",
                        code: `<FriendRow
    username="linh.dao"
    displayName="Linh Dao"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="linh.dao"
                                displayName="Linh Dao"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `handle` — the secondary `@handle` line, dropped entirely when absent. */
export const Handle: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FriendRow"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                leaf="Prop `handle`"
                reason="The secondary `@handle` line is optional chrome under the name — some surfaces feed it, some don't, so the row hides the line entirely rather than rendering it empty."
                states={[
                    {
                        name: "handle = \"@minh.tran\"",
                        why: "A second, muted line under the name gives the reader the exact handle without competing with the linked display name above it.",
                        code: `<FriendRow
    username="minh.tran"
    displayName="Minh Tran"
    handle="@minh.tran"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="minh.tran"
                                displayName="Minh Tran"
                                handle="@minh.tran"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                    {
                        name: "handle = undefined (hidden)",
                        why: "Without a handle to show, the second line is dropped entirely instead of leaving an empty row underneath the name.",
                        code: `<FriendRow
    username="minh.tran"
    displayName="Minh Tran"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="minh.tran"
                                displayName="Minh Tran"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isOnline` — the ONLY place presence shows: the avatar's corner dot. */
export const IsOnline: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FriendRow"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                leaf="Prop `isOnline`"
                reason="The presence dot on the avatar's corner is the only place online/offline shows — green while the person is active, muted grey otherwise. `onlineLabel`/`offlineLabel` carry the dot's accessible name for each state."
                states={[
                    {
                        name: "isOnline = true",
                        why: "A green dot on the avatar's corner tells the viewer this person is active right now.",
                        code: `<FriendRow
    username="linh.dao"
    displayName="Linh Dao"
    profileHref="#"
    isOnline
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onlineLabel="Active now"
    offlineLabel="Offline"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="linh.dao"
                                displayName="Linh Dao"
                                profileHref="#"
                                isOnline
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onlineLabel="Active now"
                                offlineLabel="Offline"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isOnline = false (default)",
                        why: "A muted grey dot is the default the row falls back to whenever presence is unknown or the person is offline.",
                        code: `<FriendRow
    username="an.nguyen"
    displayName="An Nguyen"
    profileHref="#"
    isOnline={false}
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onlineLabel="Active now"
    offlineLabel="Offline"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="an.nguyen"
                                displayName="An Nguyen"
                                profileHref="#"
                                isOnline={false}
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onlineLabel="Active now"
                                offlineLabel="Offline"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isFollowing` — flips BOTH the button's variant and its copy at once. */
export const IsFollowing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FriendRow"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                leaf="Prop `isFollowing`"
                reason="Whether the viewer already follows this person decides both the button's variant and its copy — primary + `followLabel` when not yet following, outline + `followingLabel` once they do."
                states={[
                    {
                        name: "isFollowing = false",
                        why: "Not yet following, so the button carries the filled primary variant and invites the first action.",
                        code: `<FriendRow
    username="an.nguyen"
    displayName="An Nguyen"
    profileHref="#"
    isFollowing={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="an.nguyen"
                                displayName="An Nguyen"
                                profileHref="#"
                                isFollowing={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isFollowing = true",
                        why: "Already following, so the button softens to the outline variant and reads `followingLabel` — the current state, not a call to act.",
                        code: `<FriendRow
    username="minh.tran"
    displayName="Minh Tran"
    profileHref="#"
    isFollowing
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="minh.tran"
                                displayName="Minh Tran"
                                profileHref="#"
                                isFollowing
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isPending` — an inline Spinner beside the button copy, never a swapped label. */
export const IsPending: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FriendRow"
                tier="block"
                annotate={ANNOTATE}
                renderClassName="max-w-md"
                leaf="Prop `isPending`"
                reason="The follow toggle is a mutation in flight for a moment; the button carries an inline spinner beside its copy so the row reads as busy rather than silently ignoring the next click."
                states={[
                    {
                        name: "isPending = true",
                        why: "The follow mutation is in flight, so a spinner sits beside the button copy and the row reads as busy until it resolves.",
                        code: `<FriendRow
    username="phuc.le"
    displayName="Phuc Le"
    profileHref="#"
    isFollowing={false}
    isPending
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="phuc.le"
                                displayName="Phuc Le"
                                profileHref="#"
                                isFollowing={false}
                                isPending
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isPending = false (default)",
                        why: "Idle between toggles, the button shows only its label — no spinner competing with the copy.",
                        code: `<FriendRow
    username="phuc.le"
    displayName="Phuc Le"
    profileHref="#"
    isFollowing={false}
    isPending={false}
    followLabel="Add friend"
    followingLabel="Friends"
    onToggleFollow={() => {}}
/>`,
                        render: (
                            <FriendRow
                                username="phuc.le"
                                displayName="Phuc Le"
                                profileHref="#"
                                isFollowing={false}
                                isPending={false}
                                followLabel="Add friend"
                                followingLabel="Friends"
                                onToggleFollow={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
