import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { TrophyIcon } from "@phosphor-icons/react"

import { Timeline } from "@/components/blocks/feed/Timeline"
import { FeedItem } from "@/components/blocks/feed/FeedItem"
import { ActivityAvatar } from "@/components/blocks/feed/ActivityAvatar"
import { usage } from "./components"

const meta: Meta<typeof Timeline> = {
    title: "Core/Feed/Timeline",
    component: Timeline,
}
export default meta
type Story = StoryObj<typeof Timeline>

/** Use when you need to show a sequence of activities or attempts in chronological order, connected by a vertical line on the left. */
export const Default: Story = {
    parameters: { usage },
    render: () => (
        <div className="flex w-[360px] flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    Wrap FeedItems directly, exactly as the block's JSDoc describes: Timeline handles the connecting line, FeedItem handles the row content.
                </Typography>
            </div>
            <Timeline>
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="2 hours ago"
                >
                    Submitted the Module 3 assignment
                </FeedItem>
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="Yesterday, 14:20"
                >
                    Completed the quiz
                </FeedItem>
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="3 days ago"
                >
                    Started the course
                </FeedItem>
            </Timeline>
        </div>
    ),
}
