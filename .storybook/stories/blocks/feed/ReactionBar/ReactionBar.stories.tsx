import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, userEvent, within } from "storybook/test"
import { Label, Typography } from "@heroui/react"
import { ReactionBar } from "@/components/blocks/feed/ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { usage, Controlled } from "./components"

const meta: Meta<typeof ReactionBar> = {
    title: "Features/Social/ReactionBar",
    component: ReactionBar,
}
export default meta
type Story = StoryObj<typeof ReactionBar>

/** Use for a post with no interactions yet, where the viewer can open the picker to react for the first time. */
export const Default: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    No one has reacted and the viewer is allowed to react: only the picker button remains, with no count.
                </Typography>
            </div>
            <Controlled initialCount={0} initialReaction={null} />
        </div>
    ),
}

/** Use when the viewer has reacted with a specific emotion; the trigger shows the exact emoji they chose. */
export const MyReactionSelected: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Viewer reacted</Label>
                <Typography type="body-sm" color="muted">
                    Pass myReaction when the viewer has reacted: the trigger switches to that exact emoji, click again to remove it.
                </Typography>
            </div>
            <Controlled initialCount={12} initialReaction={ReactionType.Love} />
        </div>
    ),
}

/** Use when the viewer is not allowed to react (for example their own activity); the bar shows only the count and the viewer's emoji, with no picker. */
export const ReadOnly: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Read only</Label>
                <Typography type="body-sm" color="muted">
                    Omit onReact when the viewer can't react, for example their own activity: the picker is gone, the count stays.
                </Typography>
            </div>
            <ReactionBar count={7} myReaction={ReactionType.Like} />
        </div>
    ),
}

/** Use when a post has no reactions yet and the viewer is also not allowed to react — the bar renders nothing at all. */
export const ReadOnlyEmpty: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Read only and empty</Label>
                <Typography type="body-sm" color="muted">
                    With no reactions and no permission to react, the bar returns null. Shown here to confirm it disappears entirely rather than leaving a gap below the content.
                </Typography>
            </div>
            <ReactionBar count={0} myReaction={null} />
        </div>
    ),
}

/**
 * The "group" case of multiple icons in this block: open the picker — a fixed row of 6 emoji
 * (Like, Love, Haha, Wow, Sad, Angry). Not a stacked summary of counts from the API.
 */
export const PickerGroup: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3 pt-12">
            <div className="flex flex-col gap-2">
                <Label>6-emoji picker group</Label>
                <Typography type="body-sm" color="muted">
                    Click the trigger to open the picker: this is when the bar shows multiple icons (the fixed group
                    👍 ❤️ 😄 😮 😢 😠). The story opens the picker itself. There's no stacked summary mode for
                    top reactions — the props are just count + myReaction.
                </Typography>
            </div>
            <Controlled initialCount={12} initialReaction={ReactionType.Love} />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole("button", { name: "React" }))
        await expect(canvas.getByRole("button", { name: ReactionType.Like })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Love })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Haha })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Wow })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Sad })).toBeInTheDocument()
        await expect(canvas.getByRole("button", { name: ReactionType.Angry })).toBeInTheDocument()
    },
}
