import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AvatarGroup } from "@/components/blocks/identity/AvatarGroup"
import { users } from "./components"

const meta: Meta<typeof AvatarGroup> = {
    title: "Block/Identity/AvatarGroup",
    component: AvatarGroup,
}
export default meta
type Story = StoryObj<typeof AvatarGroup>

/** Use when the answer to convey is "how many people / roughly who" — rather than `UserCell` (one person, name and handle need to be legible) or `UserAvatar` (exactly one face). Overlapping avatars read as a crowd, not a lookupable list: if each person needs to be clickable, that's a `UserCell` list, not this block. */
export const Default: Story = {
    parameters: { usage: "Use when the answer to convey is \"how many people / roughly who\" — rather than `UserCell` (one person, name and handle need to be legible) or `UserAvatar` (exactly one face). Overlapping avatars read as a crowd, not a lookupable list: if each person needs to be clickable, that's a `UserCell` list, not this block." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    Skip max when the list is inherently short and cannot grow: attendees of one session, the
                    authors of one post. Anyone without a photo falls back to an avatar generated from their username.
                </Typography>
            </div>
            <AvatarGroup users={users.slice(0, 3)} />
        </div>
    ),
}

/** Set `max` when the count can grow with the data, so the group doesn't stretch endlessly out of frame. */
export const OverflowChip: Story = {
    parameters: { usage: "Set `max` when the count can grow with the data, so the group doesn't stretch endlessly out of frame." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Overflow</Label>
                <Typography type="body-sm" color="muted">
                    Set max anywhere the count comes from user data and has no ceiling: followers, learners.
                    The +N chip absorbs the remainder, so the frame keeps its width no matter how long the
                    list gets.
                </Typography>
            </div>
            <AvatarGroup max={3} users={users} />
        </div>
    ),
}

/** Empty-list state — the block renders nothing instead of leaving an empty frame. */
export const Empty: Story = {
    parameters: { usage: "Empty-list state — the block renders nothing instead of leaving an empty frame." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Empty</Label>
                <Typography type="body-sm" color="muted">
                    When no one has joined, the block simply disappears, leaving no gap. That means anywhere
                    you need to spell out "no one yet" you must build your own empty state around it — don't
                    rely on this block.
                </Typography>
            </div>
            <AvatarGroup users={[]} />
        </div>
    ),
}
