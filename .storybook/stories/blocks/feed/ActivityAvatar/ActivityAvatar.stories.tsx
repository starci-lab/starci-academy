import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import {
    BookOpenIcon,
    ChatCircleIcon,
    FlagIcon,
    GraduationCapIcon,
    SparkleIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import { ActivityAvatar } from "./ActivityAvatar"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a feed avatar that carries an activity-type badge. Composed from the
 * `UserAvatar` primitive + a small soft-accent icon disc.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ActivityAvatar> = {
    title: "Design/Feed/ActivityAvatar",
    component: ActivityAvatar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ActivityAvatar>

/** Plain canvas — each leaf's anatomy panel gets breathing room. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Every leaf composes the SAME parts: the base avatar + the activity badge that
// WRAPS the passed-in icon. avatar-vs-initials is internal to UserAvatar, not a
// different part. The badge is a raw soft-accent disc (span) whose only child is
// the phosphor icon → the icon nests INSIDE the badge, it is not a sibling.
const AVATAR_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar nền (ảnh thật / initials sinh theo username)" },
    {
        name: "Activity badge",
        tier: "primitive",
        role: "đĩa soft-accent ở góc dưới-phải (span bg-surface + ring surface, bọc span bg-accent-soft)",
        children: [
            { name: "Icon", tier: "primitive", role: "icon phosphor loại hoạt động (đọc · follow · mốc · bình luận), accent size-3" },
        ],
    },
]

/** Plain baseline: an uploaded photo + a single activity badge. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityAvatar"
                tier="design"
                leaf="Có ảnh"
                parts={AVATAR_PARTS}
                reason="Một hàng feed cần avatar CÓ dấu hiệu loại hoạt động ngay trên avatar. Gói UserAvatar + badge icon vào một block để mọi loại event (follow, milestone, comment) dùng chung một khung avatar-kèm-badge, feature chỉ đổi icon."
            >
                <ActivityAvatar
                    username="lananh_pham"
                    avatar="https://i.pravatar.cc/150?img=5"
                    icon={<BookOpenIcon aria-hidden focusable="false" weight="bold" />}
                />
            </BlockAnatomy>,
        ),
}

export const WithPhoto: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityAvatar"
                tier="design"
                leaf="Ảnh thật · follow"
                parts={AVATAR_PARTS}
                note="Ảnh upload + badge follow — CÙNG composition với leaf 'Có ảnh', chỉ khác icon."
            >
                <ActivityAvatar
                    username="minhanh_dev"
                    avatar="https://i.pravatar.cc/150?img=12"
                    icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                />
            </BlockAnatomy>,
        ),
}

export const GeneratedFallback: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityAvatar"
                tier="design"
                leaf="Không ảnh (initials)"
                parts={AVATAR_PARTS}
                note="avatar=null → UserAvatar rơi về initials sinh theo username; badge vẫn nguyên, composition không đổi."
            >
                <ActivityAvatar
                    username="quochuy_backend"
                    avatar={null}
                    icon={<GraduationCapIcon aria-hidden focusable="false" weight="bold" />}
                />
            </BlockAnatomy>,
        ),
}

export const ActivityIconTypes: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ActivityAvatar"
                tier="design"
                leaf="Các loại icon"
                parts={AVATAR_PARTS}
                note="Cùng khung avatar-kèm-badge, chỉ đổi icon theo loại event (đọc · mốc · sinh · bình luận)."
            >
                <div className="flex items-center gap-6">
                    <ActivityAvatar
                        username="thuha_ux"
                        avatar="https://i.pravatar.cc/150?img=45"
                        icon={<BookOpenIcon aria-hidden focusable="false" weight="bold" />}
                    />
                    <ActivityAvatar
                        username="quochuy_backend"
                        avatar="https://i.pravatar.cc/150?img=33"
                        icon={<FlagIcon aria-hidden focusable="false" weight="bold" />}
                    />
                    <ActivityAvatar
                        username="lananh_pham"
                        avatar={null}
                        icon={<SparkleIcon aria-hidden focusable="false" weight="bold" />}
                    />
                    <ActivityAvatar
                        username="minhanh_dev"
                        avatar="https://i.pravatar.cc/150?img=12"
                        icon={<ChatCircleIcon aria-hidden focusable="false" weight="bold" />}
                    />
                </div>
            </BlockAnatomy>,
        ),
}
