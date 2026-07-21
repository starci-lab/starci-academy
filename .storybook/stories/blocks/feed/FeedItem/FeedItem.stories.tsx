import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { UserPlusIcon } from "@phosphor-icons/react"
import { FeedItem } from "./FeedItem"
import { ActivityAvatar } from "../ActivityAvatar/ActivityAvatar"
import { ReactionBar, ReactionType } from "../ReactionBar/ReactionBar"
import { EntityLink } from "../EntityLink/EntityLink"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof FeedItem> = {
    title: "Block/Feed/FeedItem",
    component: FeedItem,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FeedItem>

const ANATOMY = {
    primitives: [
        { name: "ActivityAvatar", role: "slot leading — avatar + badge loại hoạt động" },
        { name: "EntityLink", role: "mốc thực thể bấm được trong câu action" },
        { name: "ReactionBar", role: "slot footer — thả cảm xúc" },
        { name: "Typography", role: "câu action + mốc thời gian muted" },
    ],
    reason:
        "Một hàng thuật lại một SỰ KIỆN đã xảy ra (ai làm gì, khi nào) — chỉ đọc, khác ListRow bấm được. Bố cục leading + cột text + footer để feature ghép avatar/câu/reaction vào đúng chỗ mà không tự dựng lại layout hàng.",
}

export const Default: Story = {
    render: () =>
        blockShell(
            <div className="w-96">
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="minhanh_dev"
                            avatar="https://i.pravatar.cc/150?img=12"
                            icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="2 giờ trước"
                >
                    <span>
                        <EntityLink label="minhanh_dev" onPress={() => {}} />
                        {" "}đã follow{" "}
                        <EntityLink label="quochuy_backend" onPress={() => {}} />
                    </span>
                </FeedItem>
            </div>,
            ANATOMY,
        ),
}

export const WithReaction: Story = {
    render: () =>
        blockShell(
            <div className="w-96">
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="quochuy_backend"
                            avatar="https://i.pravatar.cc/150?img=33"
                            icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="15 phút trước"
                    footer={<ReactionBar count={8} myReaction={ReactionType.Like} onReact={() => {}} />}
                >
                    <span>
                        <EntityLink label="quochuy_backend" onPress={() => {}} />
                        {" "}đã hoàn thành challenge{" "}
                        <EntityLink label="Xử lý luồng bất đồng bộ" onPress={() => {}} />
                    </span>
                </FeedItem>
            </div>,
            ANATOMY,
        ),
}

export const NoLeading: Story = {
    render: () =>
        blockShell(
            <div className="w-96">
                <FeedItem timestamp="Hôm qua lúc 21:40">
                    Hệ thống đã tự động backup tiến độ khóa học của bạn
                </FeedItem>
            </div>,
            ANATOMY,
        ),
}

export const LongText: Story = {
    render: () =>
        blockShell(
            <div className="w-72">
                <FeedItem
                    leading={(
                        <ActivityAvatar
                            username="thuha_ux"
                            avatar="https://i.pravatar.cc/150?img=45"
                            icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                        />
                    )}
                    timestamp="3 ngày trước"
                >
                    <span>
                        <EntityLink label="thuha_ux" onPress={() => {}} />
                        {" "}đã hoàn thành milestone{" "}
                        <EntityLink label="Building a scalable design system for enterprise applications" onPress={() => {}} />
                        {" "}trong khóa{" "}
                        <EntityLink label="System Design Mastery" onPress={() => {}} />
                    </span>
                </FeedItem>
            </div>,
            ANATOMY,
        ),
}
