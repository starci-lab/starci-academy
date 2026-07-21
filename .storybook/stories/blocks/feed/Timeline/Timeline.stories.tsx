import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { TrophyIcon } from "@phosphor-icons/react"
import { Timeline } from "./Timeline"
import { FeedItem } from "../FeedItem/FeedItem"
import { ActivityAvatar } from "../ActivityAvatar/ActivityAvatar"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "FeedItem", role: "mỗi dòng hoạt động bên cạnh đường nối" },
        { name: "ActivityAvatar", role: "leading của từng FeedItem" },
    ],
    reason:
        "Bọc một chuỗi FeedItem để nối chúng bằng một đường kẻ dọc bên trái, cho thấy chúng thuộc cùng một mạch thời gian. Timeline chỉ vẽ đường nối + thụt lề; nội dung từng dòng do FeedItem đảm nhiệm.",
}

export const ActivitySequence: Story = {
    render: () =>
        blockShell(
            <div className="w-[360px]">
                <Timeline>
                    <FeedItem
                        leading={(
                            <ActivityAvatar
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
                        leading={(
                            <ActivityAvatar
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
                        leading={(
                            <ActivityAvatar
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
            </div>,
            ANATOMY,
        ),
}
