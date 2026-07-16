import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { UserPlusIcon } from "@phosphor-icons/react"
import { FeedItem } from "@/components/blocks/feed/FeedItem"
import { ActivityAvatar } from "@/components/blocks/feed/ActivityAvatar"
import { ReactionBar } from "@/components/blocks/feed/ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { usage } from "./components"

const meta: Meta<typeof FeedItem> = {
    title: "Blocks/Feed/FeedItem",
    component: FeedItem,
}
export default meta
type Story = StoryObj<typeof FeedItem>

/** Use for a basic activity item in the feed: an avatar with an activity-type badge, a sentence describing the action, and a relative timestamp. */
export const Default: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    An activity tied to one person that no one can interact back with.
                </Typography>
            </div>
            <FeedItem
                leading={(
                    <ActivityAvatar
                        username="minhanh_dev"
                        avatar="https://i.pravatar.cc/150?img=12"
                        icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                    />
                )}
                timestamp="2 hours ago"
            >
                <span><strong>minhanh_dev</strong> followed <strong>quochuy_backend</strong></span>
            </FeedItem>
        </div>
    ),
}

/** When the activity can be interacted with by the community (for example completing a challenge), add a reaction bar at the bottom so viewers can react. */
export const WithReactionBar: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With reaction bar</Label>
                <Typography type="body-sm" color="muted">
                    Use the footer slot when the activity is worth a community reaction, for example passing a challenge. Leave it empty for private activities or system logs.
                </Typography>
            </div>
            <FeedItem
                leading={(
                    <ActivityAvatar
                        username="quochuy_backend"
                        avatar="https://i.pravatar.cc/150?img=33"
                        icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                    />
                )}
                timestamp="15 minutes ago"
                footer={(
                    <ReactionBar
                        count={8}
                        myReaction={ReactionType.Like}
                        onReact={() => {}}
                    />
                )}
            >
                <span><strong>quochuy_backend</strong> passed the challenge <strong>Handling asynchronous flows</strong></span>
            </FeedItem>
        </div>
    ),
}

/** When the activity isn't tied to a specific user or doesn't need an avatar (for example a system log), skip the leading slot so the row is text only. */
export const WithoutLeading: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Without leading</Label>
                <Typography type="body-sm" color="muted">
                    Leave the leading slot empty when the activity isn't caused by anyone, for example a system log. Don't stuff a placeholder avatar in just to balance the row.
                </Typography>
            </div>
            <FeedItem timestamp="Yesterday at 21:40">
                The system automatically backed up your course progress
            </FeedItem>
        </div>
    ),
}

/** When the action description is long (many linked entities), the text column flexes and wraps naturally instead of overflowing the row. */
export const LongActivityText: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex w-72 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long activity text</Label>
                <Typography type="body-sm" color="muted">
                    Shown in a narrow column to test a long sentence with many entities: the text column must wrap, without pushing the timestamp out of the row.
                </Typography>
            </div>
            <FeedItem
                leading={(
                    <ActivityAvatar
                        username="thuha_ux"
                        avatar="https://i.pravatar.cc/150?img=45"
                        icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                    />
                )}
                timestamp="3 days ago"
            >
                <span>
                    <strong>thuha_ux</strong> completed the milestone
                    {" "}
                    <strong>Building a scalable design system for enterprise applications</strong>
                    {" "}
                    in the <strong>System Design Mastery</strong> course
                </span>
            </FeedItem>
        </div>
    ),
}
