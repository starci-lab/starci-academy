import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { UserPlusIcon } from "@phosphor-icons/react"
import { FeedItem } from "./FeedItem"
import { ActivityAvatar } from "../ActivityAvatar/ActivityAvatar"
import { ReactionBar, ReactionType } from "../ReactionBar/ReactionBar"
import { EntityLink } from "../EntityLink/EntityLink"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a generic activity-row that narrates one event that already happened
 * (who did what, when) — read-only.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. FeedItem emits no anchors, so the
 * `Sơ đồ` tab is a clean render + numbered legend.
 */
const meta: Meta<typeof FeedItem> = {
    title: "Design/Feed/FeedItem",
    component: FeedItem,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FeedItem>

/** Frame each leaf's anatomy panel with breathing room. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// BASE leaf: leading avatar + entity-link action sentence + muted timestamp (no footer).
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "ActivityAvatar", tier: "design", role: "slot leading — avatar + badge loại hoạt động" },
    { name: "EntityLink", tier: "primitive", role: "mốc thực thể bấm được trong câu action" },
    { name: "Typography", tier: "primitive", role: "câu action + mốc thời gian muted" },
]

// REACTION leaf: same chrome + a ReactionBar in the footer slot.
const REACTION_PARTS: Array<AnatomyNode> = [
    { name: "ActivityAvatar", tier: "design", role: "slot leading — avatar + badge loại hoạt động" },
    { name: "EntityLink", tier: "primitive", role: "mốc thực thể bấm được trong câu action" },
    { name: "Typography", tier: "primitive", role: "câu action + mốc thời gian muted" },
    { name: "ReactionBar", tier: "design", role: "slot footer — thả cảm xúc" },
]

// TEXT-ONLY leaf: no leading, no entity link — just the action text + timestamp.
const TEXT_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "câu action (text thuần) + mốc thời gian muted" },
]

export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="FeedItem"
                tier="design"
                leaf="Có avatar"
                parts={BASE_PARTS}
                reason="Một hàng thuật lại một SỰ KIỆN đã xảy ra (ai làm gì, khi nào) — chỉ đọc, khác ListRow bấm được. Bố cục leading + cột text + footer để feature ghép avatar/câu/reaction vào đúng chỗ mà không tự dựng lại layout hàng."
            >
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
                </div>
            </BlockAnatomy>,
        ),
}

export const WithReaction: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="FeedItem"
                tier="design"
                leaf="Có reaction"
                parts={REACTION_PARTS}
                note="Thêm ReactionBar vào slot footer (thả cảm xúc được) — composition khác leaf 'Có avatar'."
            >
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
                </div>
            </BlockAnatomy>,
        ),
}

export const ReadOnlyFooter: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="FeedItem"
                tier="design"
                leaf="Footer chỉ đọc"
                parts={REACTION_PARTS}
                note="CÙNG composition với leaf 'Có reaction' — nhưng ReactionBar không có onReact nên chỉ đọc số cảm xúc."
            >
                <div className="w-96">
                    <FeedItem
                        leading={(
                            <ActivityAvatar
                                username="minhanh_dev"
                                avatar="https://i.pravatar.cc/150?img=12"
                                icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                            />
                        )}
                        timestamp="1 giờ trước"
                        footer={<ReactionBar count={5} myReaction={null} />}
                    >
                        <span>
                            <EntityLink label="minhanh_dev" onPress={() => {}} />
                            {" "}đã hoàn thành milestone{" "}
                            <EntityLink label="Xử lý luồng bất đồng bộ" onPress={() => {}} />
                        </span>
                    </FeedItem>
                </div>
            </BlockAnatomy>,
        ),
}

export const NoLeading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="FeedItem"
                tier="design"
                leaf="Không avatar"
                parts={TEXT_ONLY_PARTS}
                note="Bỏ slot leading + không mốc thực thể → chỉ còn cột text thuần + timestamp (composition tối giản nhất)."
            >
                <div className="w-96">
                    <FeedItem timestamp="Hôm qua lúc 21:40">
                        Hệ thống đã tự động backup tiến độ khóa học của bạn
                    </FeedItem>
                </div>
            </BlockAnatomy>,
        ),
}

export const LongText: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="FeedItem"
                tier="design"
                leaf="Text dài"
                parts={BASE_PARTS}
                note="CÙNG composition với leaf 'Có avatar' — chỉ khác câu action dài + khung hẹp để soi wrap."
            >
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
                </div>
            </BlockAnatomy>,
        ),
}
