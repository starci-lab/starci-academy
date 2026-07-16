import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Label, Typography } from "@heroui/react"
import { UserCell } from "@/components/blocks/identity/UserCell"

const meta: Meta<typeof UserCell> = {
    title: "Block/Identity/UserCell",
    component: UserCell,
    args: {
        username: "levan.dev",
        displayName: "Ethan Vaughn",
        avatar: null,
        handle: "@levan.dev",
        size: "sm",
    },
}

export default meta

type Story = StoryObj<typeof UserCell>

/** Use when the answer needed is "who is this" — an avatar with name and handle — rather than `UserAvatar` (just the face, no name) or `AvatarGroup` (several people on one line). If the photo is editable in place, use `AvatarUploadButton`. `UserCell` is purely presentational: to make it clickable, wrap it in an `<a>`/`<button>` at the call site. */
export const Default: Story = {
    parameters: { usage: "Use when the answer needed is \"who is this\" — an avatar with name and handle — rather than `UserAvatar` (just the face, no name) or `AvatarGroup` (several people on one line). If the photo is editable in place, use `AvatarUploadButton`. `UserCell` is purely presentational: to make it clickable, wrap it in an `<a>`/`<button>` at the call site." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    Use for most places that show a user in a dense list: size sm with a handle to tell apart
                    two people with the same display name.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** Pick the size by the density of the area the cell sits in, not by the importance of the person. */
export const Sizes: Story = {
    parameters: { usage: "Pick the size by the density of the area the cell sits in, not by the importance of the person." },
    render: (args) => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Small (sm)</Label>
                    <Typography type="body-sm" color="muted">
                        Use when each row is one person and the rows sit packed together: comments, a member
                        table, search results, a dropdown.
                    </Typography>
                </div>
                <UserCell {...args} size="sm" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Medium (md)</Label>
                    <Typography type="body-sm" color="muted">
                        Use when the person is the lead of the whole block and there's room to breathe around
                        them: a profile header, an author intro card.
                    </Typography>
                </div>
                <UserCell {...args} size="md" />
            </div>
        </div>
    ),
}

/** Use where the person has no public handle to look up — the cell shrinks to a single name line. */
export const NoHandle: Story = {
    args: {
        username: "jamesanderson",
        displayName: "James Anderson",
        handle: undefined,
    },
    parameters: { usage: "Use where the person has no public handle to look up — the cell shrinks to a single name line." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No handle</Label>
                <Typography type="body-sm" color="muted">
                    Drop the handle when the person has no public identifier to search for: a system account,
                    an internal author. Don't drop it just to look tidy — losing the handle loses the way to
                    tell apart people with the same name.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** The state where the user has uploaded a real photo, to contrast with the auto-generated avatar in the other stories. */
export const WithUploadedAvatar: Story = {
    args: {
        username: "sophiachen",
        displayName: "Sophia Chen",
        avatar: "https://i.pravatar.cc/150?img=47",
        handle: "@sophiachen",
    },
    parameters: { usage: "The state where the user has uploaded a real photo, to contrast with the auto-generated avatar in the other stories." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With an uploaded photo</Label>
                <Typography type="body-sm" color="muted">
                    Not a choice made by whoever builds the UI but a matter of data: when there's an avatar the
                    real photo shows, and when it's empty it falls back to an image generated from the username.
                    Always pass username even when there's a photo, so there's a fallback when the URL breaks.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** Use when each row needs one more piece of info classifying the person themselves, not an action. */
export const WithTrailing: Story = {
    args: {
        username: "emmafoster",
        displayName: "Emma Foster",
        handle: "@emmafoster",
        trailing: <Chip size="sm" variant="soft" color="warning">Admin</Chip>,
    },
    parameters: { usage: "Use when each row needs one more piece of info classifying the person themselves, not an action." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With a secondary label</Label>
                <Typography type="body-sm" color="muted">
                    Put in trailing whatever describes who the person is in this context: a role, an invite
                    status. Don't stuff a button in here — the cell is not a place for actions.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** Check the cell in a narrow column: a long name and handle must truncate rather than break the frame. */
export const LongNameTruncation: Story = {
    args: {
        username: "very.long.username.for.testing.truncation",
        displayName: "Alexandra Wellington-Fairchild With An Exceptionally Long Display Name For Testing Truncation",
        handle: "@very.long.username.for.testing.truncation.overflow",
    },
    parameters: { usage: "Check the cell in a narrow column: a long name and handle must truncate rather than break the frame." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long text in a narrow frame</Label>
                <Typography type="body-sm" color="muted">
                    Check this story before placing the cell in a narrow column: a sidebar, dropdown, or rail.
                    Names are user-set and have no length ceiling — anywhere it can't truncate, don't put the
                    cell.
                </Typography>
            </div>
            <div className="w-48">
                <UserCell {...args} />
            </div>
        </div>
    ),
}
