import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { TrophyIcon } from "@phosphor-icons/react"
import { Timeline } from "./Timeline"
import { FeedItem } from "../FeedItem/FeedItem"
import { ActivityAvatar } from "../ActivityAvatar/ActivityAvatar"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Timeline> = {
    title: "Block/Feed/Timeline",
    component: Timeline,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Timeline>

/** Plain canvas for the demo stories — each leaf wraps its own BlockAnatomy. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// The timeline composition: a chain of FeedItem rows. Each FeedItem mounts its
// `leading` (an ActivityAvatar) then its own text column — the action-text
// Typography and the muted timestamp Typography, in DOM order.
const TIMELINE_PARTS: Array<AnatomyNode> = [
    {
        name: "FeedItem",
        tier: "design",
        role: "mỗi dòng hoạt động bên cạnh đường nối",
        children: [
            { name: "ActivityAvatar", tier: "block", role: "leading của từng FeedItem" },
        ],
    },
]

export const ActivitySequence: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Timeline"
                tier="block"
                leaf="Chuỗi hoạt động"
                parts={TIMELINE_PARTS}
                reason="Bọc một chuỗi FeedItem để nối chúng bằng một đường kẻ dọc bên trái, cho thấy chúng thuộc cùng một mạch thời gian. Timeline chỉ vẽ đường nối + thụt lề; nội dung từng dòng do FeedItem đảm nhiệm."
            >
                <div className="w-[360px]">
                    <Timeline showAnatomy>
                        <FeedItem
                            anatPart="FeedItem"
                            leading={(
                                <ActivityAvatar
                                    anatPart="ActivityAvatar"
                                    showAnatomy
                                    username="minhanh_dev"
                                    avatar="https://i.pravatar.cc/150?img=12"
                                    icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                                />
                            )}
                            timestamp="2 giờ trước"
                        >
                            Nộp bài tập Module 3
                        </FeedItem>
                        <FeedItem
                            anatPart="FeedItem"
                            leading={(
                                <ActivityAvatar
                                    anatPart="ActivityAvatar"
                                    showAnatomy
                                    username="minhanh_dev"
                                    avatar="https://i.pravatar.cc/150?img=12"
                                    icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                                />
                            )}
                            timestamp="Hôm qua, 14:20"
                        >
                            Hoàn thành bài quiz
                        </FeedItem>
                        <FeedItem
                            anatPart="FeedItem"
                            leading={(
                                <ActivityAvatar
                                    anatPart="ActivityAvatar"
                                    showAnatomy
                                    username="minhanh_dev"
                                    avatar="https://i.pravatar.cc/150?img=12"
                                    icon={<TrophyIcon aria-hidden focusable="false" weight="bold" />}
                                />
                            )}
                            timestamp="3 ngày trước"
                        >
                            Bắt đầu khóa học
                        </FeedItem>
                    </Timeline>
                </div>
            </BlockAnatomy>,
        ),
}
