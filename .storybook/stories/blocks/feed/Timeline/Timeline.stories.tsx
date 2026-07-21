import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrophyIcon } from "@phosphor-icons/react"

import { Timeline } from "@/components/blocks/feed/Timeline"
import { FeedItem } from "@/components/blocks/feed/FeedItem"
import { ActivityAvatar } from "@/components/blocks/feed/ActivityAvatar"
import { usage } from "./components"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof Timeline> = {
    title: "Blocks/Feed/Timeline",
    component: Timeline,
}
export default meta
type Story = StoryObj<typeof Timeline>

/**
 * Chuỗi hoạt động nối bằng đường kẻ dọc bên trái. Timeline chỉ vẽ đường nối +
 * khoảng cách, nội dung từng dòng do FeedItem đảm nhiệm — đúng như JSDoc của
 * block mô tả.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Chuỗi hoạt động theo thời gian"
                hint="Bọc trực tiếp các FeedItem, đúng như JSDoc của block mô tả: Timeline vẽ đường nối bên trái, FeedItem đảm nhiệm nội dung từng dòng. Dùng khi thứ tự giữa các dòng đáng được nhìn thấy."
            >
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
            </Variant>
        </Gallery>
    ),
    parameters: { usage },
}
