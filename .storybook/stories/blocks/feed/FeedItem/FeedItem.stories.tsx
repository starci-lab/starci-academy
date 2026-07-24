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

// BASE leaf: leading avatar + the action Typography (wrapping EntityLink(s) in the
// sentence) + the timestamp Typography. Both Typography ARE FeedItem's OWN direct
// renders (§ granularity — every Typography a block writes itself is its own node,
// same as DeckCard's title/description/count) → each gets its own "Typography" part.
// EntityLink (a real composed component, not plain text) nests inside the action
// Typography's own node since that's where it visually renders.
const BASE_PARTS: Array<AnatomyNode> = [
    {
        name: "ActivityAvatar",
        tier: "design",
        role: "slot leading — avatar + badge loại hoạt động",
        children: [
            { name: "UserAvatar", tier: "primitive", role: "avatar nền (ảnh/initials)" },
        ],
    },
    {
        name: "Typography",
        tier: "primitive",
        role: "câu action — bọc children",
        children: [
            { name: "EntityLink", tier: "design", role: "mốc thực thể bấm được, dựng trong câu action" },
        ],
    },
    { name: "Typography", tier: "primitive", role: "timestamp muted" },
]

// REACTION leaf: same chrome + a ReactionBar in the footer slot (a sibling of the text column).
const REACTION_PARTS: Array<AnatomyNode> = [
    {
        name: "ActivityAvatar",
        tier: "design",
        role: "slot leading — avatar + badge loại hoạt động",
        children: [
            { name: "UserAvatar", tier: "primitive", role: "avatar nền (ảnh/initials)" },
        ],
    },
    {
        name: "Typography",
        tier: "primitive",
        role: "câu action — bọc children",
        children: [
            { name: "EntityLink", tier: "design", role: "mốc thực thể bấm được, dựng trong câu action" },
        ],
    },
    { name: "Typography", tier: "primitive", role: "timestamp muted" },
    { name: "ReactionBar", tier: "design", role: "slot footer — thả cảm xúc" },
]

// TEXT-ONLY leaf: no leading, no entity link — the action sentence is plain text.
// FeedItem STILL directly renders its own two Typography (action + timestamp); only
// the leading slot and the nested EntityLink are absent for this leaf.
const TEXT_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "primitive", role: "câu action — text thuần, không mốc thực thể" },
    { name: "Typography", tier: "primitive", role: "timestamp muted" },
]

export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="FeedItem"
                tier="design"
                leaf="Default"
                parts={BASE_PARTS}
                reason="Một hàng thuật lại một SỰ KIỆN đã xảy ra (ai làm gì, khi nào) — chỉ đọc, khác ListRow bấm được. Bố cục leading + cột text + footer để feature ghép avatar/câu/reaction vào đúng chỗ mà không tự dựng lại layout hàng."
            >
                <div className="w-96">
                    <FeedItem
                        showAnatomy
                        leading={(
                            <ActivityAvatar
                                anatPart="ActivityAvatar"
                                showAnatomy
                                username="minhanh_dev"
                                avatar="https://i.pravatar.cc/150?img=12"
                                icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                            />
                        )}
                        timestamp="2 giờ trước"
                    >
                        <span>
                            <EntityLink anatPart="EntityLink" label="minhanh_dev" onPress={() => {}} />
                            {" "}đã follow{" "}
                            <EntityLink anatPart="EntityLink" label="quochuy_backend" onPress={() => {}} />
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
                leaf="WithReaction"
                parts={REACTION_PARTS}
                note="Thêm ReactionBar vào slot footer (thả cảm xúc được) — composition khác leaf 'Có avatar'."
            >
                <div className="w-96">
                    <FeedItem
                        showAnatomy
                        leading={(
                            <ActivityAvatar
                                anatPart="ActivityAvatar"
                                showAnatomy
                                username="quochuy_backend"
                                avatar="https://i.pravatar.cc/150?img=33"
                                icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                            />
                        )}
                        timestamp="15 phút trước"
                        footer={<ReactionBar anatPart="ReactionBar" count={8} myReaction={ReactionType.Like} onReact={() => {}} />}
                    >
                        <span>
                            <EntityLink anatPart="EntityLink" label="quochuy_backend" onPress={() => {}} />
                            {" "}đã hoàn thành challenge{" "}
                            <EntityLink anatPart="EntityLink" label="Xử lý luồng bất đồng bộ" onPress={() => {}} />
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
                leaf="ReadOnlyFooter"
                parts={REACTION_PARTS}
                note="CÙNG composition với leaf 'Có reaction' — nhưng ReactionBar không có onReact nên chỉ đọc số cảm xúc."
            >
                <div className="w-96">
                    <FeedItem
                        showAnatomy
                        leading={(
                            <ActivityAvatar
                                anatPart="ActivityAvatar"
                                showAnatomy
                                username="minhanh_dev"
                                avatar="https://i.pravatar.cc/150?img=12"
                                icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                            />
                        )}
                        timestamp="1 giờ trước"
                        footer={<ReactionBar anatPart="ReactionBar" count={5} myReaction={null} />}
                    >
                        <span>
                            <EntityLink anatPart="EntityLink" label="minhanh_dev" onPress={() => {}} />
                            {" "}đã hoàn thành milestone{" "}
                            <EntityLink anatPart="EntityLink" label="Xử lý luồng bất đồng bộ" onPress={() => {}} />
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
                leaf="NoLeading"
                parts={TEXT_ONLY_PARTS}
                note="Bỏ slot leading + không mốc thực thể → chỉ còn cột text thuần + timestamp (composition tối giản nhất)."
            >
                <div className="w-96">
                    <FeedItem showAnatomy timestamp="Hôm qua lúc 21:40">
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
                leaf="LongText"
                parts={BASE_PARTS}
                note="CÙNG composition với leaf 'Có avatar' — chỉ khác câu action dài + khung hẹp để soi wrap."
            >
                <div className="w-72">
                    <FeedItem
                        showAnatomy
                        leading={(
                            <ActivityAvatar
                                anatPart="ActivityAvatar"
                                showAnatomy
                                username="thuha_ux"
                                avatar="https://i.pravatar.cc/150?img=45"
                                icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                            />
                        )}
                        timestamp="3 ngày trước"
                    >
                        <span>
                            <EntityLink anatPart="EntityLink" label="thuha_ux" onPress={() => {}} />
                            {" "}đã hoàn thành milestone{" "}
                            <EntityLink anatPart="EntityLink" label="Building a scalable design system for enterprise applications" onPress={() => {}} />
                            {" "}trong khóa{" "}
                            <EntityLink anatPart="EntityLink" label="System Design Mastery" onPress={() => {}} />
                        </span>
                    </FeedItem>
                </div>
            </BlockAnatomy>,
        ),
}
