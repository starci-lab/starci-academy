import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import {
    BookOpenIcon,
    ChatCircleIcon,
    CheckCircleIcon,
    FlameIcon,
    VideoCameraIcon,
} from "@phosphor-icons/react"
import { NotificationList } from "./NotificationList"
import type { NotificationGroup } from "./NotificationList"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the notification list REGION in the bell popover: an optional header
 * (title + mark-all-read) over day-grouped `NotificationItem` rows, falling to an
 * `EmptyState` when nothing is present.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof NotificationList> = {
    title: "Block/Notifications/NotificationList",
    component: NotificationList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof NotificationList>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** Date-based groups ("Today" / "Earlier") with real learning data and pre-formatted times. */
const SAMPLE_GROUPS: NotificationGroup[] = [
    {
        label: "Today",
        items: [
            {
                icon: <CheckCircleIcon />,
                tone: "success",
                title: "Your submission has been graded",
                body: "API Gateway challenge — scored 92/100.",
                timeLabel: "2 hours ago",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <ChatCircleIcon />,
                tone: "accent",
                title: "Ethan replied to your comment",
                body: "Right, that part should be split out into its own service.",
                timeLabel: "45 minutes ago",
                isUnread: true,
                onPress: () => {},
            },
            {
                icon: <VideoCameraIcon />,
                tone: "warning",
                title: "Your mock interview is about to start",
                body: "System Design interview at 8:00 PM — about an hour to go.",
                timeLabel: "1 hour ago",
                onPress: () => {},
            },
        ],
    },
    {
        label: "Earlier",
        items: [
            {
                icon: <BookOpenIcon />,
                tone: "accent",
                title: "New course just launched: Kubernetes in practice",
                body: "Enroll early this week to get a special offer.",
                timeLabel: "Yesterday",
                onPress: () => {},
            },
            {
                icon: <FlameIcon />,
                tone: "warning",
                title: "Don't lose your 12-day study streak",
                body: "Study one more lesson today to keep your streak going.",
                timeLabel: "2 days ago",
                onPress: () => {},
            },
        ],
    },
]

/** A framed surface so the list reads like it does inside the bell popover. */
const listFrame = (children: React.ReactNode) => (
    <div className="w-[380px] rounded-2xl border border-separator bg-surface p-1">{children}</div>
)

// Populated leaf: header (title Typography + mark-all-read Button) over day-grouped
// NotificationItem rows, each day group prefixed by its own label Typography. The header
// title and each group's label are Typography THIS list renders DIRECTLY (not inside
// another primitive's slot) → each gets its own node. The Button OWNS its leading
// ChecksIcon (kept) but its label Typography renders `markAllReadLabel` INSIDE the
// Button's own children slot → collapsed (granularity: content in a primitive's slot).
// Each NotificationItem composes an IconTile + (when unread) the Dot indicator + its own
// title/body/time Typography — mirrored byte-identical to `NotificationItem.stories.tsx`'s
// own tree for this same composition.
const POPULATED_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Header", tier: "primitive", role: "tiêu đề panel (\"Notifications\") — hiện prop title" },
    {
        name: "Button",
        tier: "primitive",
        role: "nút đánh dấu tất cả đã đọc (tertiary · sm) — nhãn mark-all-read hiện qua children",
        state: "tertiary",
        children: [
            { name: "ChecksIcon", tier: "primitive", role: "icon check dẫn đầu (leading, size-4)" },
        ],
    },
    { name: "Typography.GroupLabel", tier: "primitive", role: "nhãn nhóm ngày (\"Today\"/\"Earlier\") — hiện prop group.label" },
    {
        name: "NotificationItem",
        tier: "design",
        role: "mỗi dòng thông báo (design con, lặp ×N)",
        children: [
            { name: "IconTile", tier: "primitive", role: "ô icon dẫn đầu, tô màu theo tone" },
            { name: "Dot", tier: "primitive", role: "chấm accent cạnh tiêu đề báo chưa đọc (2/5 dòng mẫu)", state: "unread" },
            { name: "Typography.Title", tier: "primitive", role: "tiêu đề dòng" },
            { name: "Typography.Body", tier: "primitive", role: "chi tiết phụ dòng" },
            { name: "Typography.Time", tier: "primitive", role: "nhãn thời gian dòng" },
        ],
    },
]

// Empty leaf: header STILL renders (title="Notifications" is passed) but with no
// mark-all-read Button (onMarkAllRead omitted); the body falls to a single EmptyState.
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Header", tier: "primitive", role: "tiêu đề panel (\"Notifications\") — hiện prop title, không có Button (onMarkAllRead bỏ trống)" },
    { name: "EmptyState", tier: "primitive", role: "fallback \"Chưa có thông báo nào\" (tiêu đề + mô tả)", state: "empty" },
]

// Loading leaf: story-authored skeleton scaffold mirroring the populated chrome —
// header (Skeleton.Typography + Skeleton.Button), one day group (bare Skeleton label
// bar) over SkeletonNotificationRow ×3, each mirroring a NotificationItem's tile + bars.
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton.Typography.Header", tier: "primitive", role: "tiêu đề header — skeleton mirror", state: "skeleton" },
    { name: "Skeleton.Button", tier: "primitive", role: "nút mark-all-read — skeleton mirror", state: "skeleton" },
    { name: "Skeleton.GroupLabel", tier: "primitive", role: "nhãn nhóm ngày — skeleton mirror", state: "skeleton" },
    {
        name: "SkeletonNotificationRow",
        tier: "design",
        role: "mirror NotificationItem ×3 (giữ đúng footprint)",
        state: "skeleton",
        children: [
            { name: "Skeleton.Tile", tier: "primitive", role: "ô icon tone — skeleton mirror", state: "skeleton" },
            { name: "Skeleton.Typography.Title", tier: "primitive", role: "thanh tiêu đề dòng", state: "skeleton" },
            { name: "Skeleton.Typography.Body", tier: "primitive", role: "thanh nội dung phụ", state: "skeleton" },
            { name: "Skeleton.Typography.Time", tier: "primitive", role: "thanh thời gian", state: "skeleton" },
        ],
    },
]

/** DATA — day-based groups with real learning data and pre-formatted times. */
export const Populated: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NotificationList"
                tier="block"
                leaf="Populated"
                parts={POPULATED_PARTS}
                reason="Gom nhiều NotificationItem thành một danh sách cuộn có header (tiêu đề + đánh dấu đã đọc hết) và nhãn gom theo ngày; khi rỗng thì tự rơi về EmptyState thay vì một khối trống. Feature chỉ gom dữ liệu theo ngày và truyền các dòng đã format — không phải tự dựng lại header, nhóm, và trạng thái rỗng ở mỗi nơi. Khi tải: Skeleton mirror đúng khung này."
            >
                {listFrame(
                    <NotificationList
                        title="Notifications"
                        onMarkAllRead={() => {}}
                        groups={SAMPLE_GROUPS}
                        showAnatomy
                    />,
                )}
            </BlockAnatomy>,
        ),
}

export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NotificationList"
                tier="block"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="Header vẫn render (title được truyền) nhưng KHÔNG có nút mark-all-read (onMarkAllRead bỏ trống); mọi nhóm rỗng → body rơi về EmptyState duy nhất (khác leaf data)."
            >
                {listFrame(
                    <NotificationList
                        title="Notifications"
                        groups={[{ items: [] }]}
                        showAnatomy
                        emptyState={
                            <EmptyState
                                title="Chưa có thông báo nào"
                                description="Khi có hoạt động mới trên khoá học của bạn, thông báo sẽ xuất hiện ở đây."
                                anatPart="EmptyState"
                            />
                        }
                    />,
                )}
            </BlockAnatomy>,
        ),
}

/** One skeleton notification row — mirrors NotificationItem: tone tile + title/body/time text bars. */
const SkeletonNotificationRow = () => (
    <div
        className="flex w-full items-start gap-3 rounded-2xl p-3"
        data-anat-part="SkeletonNotificationRow"
    >
        <Skeleton className="size-10 shrink-0 rounded-2xl" anatPart="Skeleton.Tile" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton.Typography type="body-sm" width="3/4" anatPart="Skeleton.Typography.Title" />
            <Skeleton.Typography type="body-xs" width="full" anatPart="Skeleton.Typography.Body" />
            <Skeleton.Typography type="body-xs" width="1/3" anatPart="Skeleton.Typography.Time" />
        </div>
    </div>
)

export const SkeletonLoading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="NotificationList"
                tier="block"
                leaf="SkeletonLoading"
                parts={LOADING_PARTS}
                note="Chrome giữ nguyên, mọi phần đổi sang Skeleton mirror đúng footprint của leaf data (không dòng thật)."
            >
                {listFrame(
                    <div className="flex flex-col">
                        {/* header: title + mark-all-read button */}
                        <div className="flex items-center justify-between gap-3 px-3 py-2">
                            <Skeleton.Typography
                                type="body-sm"
                                width="1/3"
                                anatPart="Skeleton.Typography.Header"
                            />
                            <Skeleton.Button width="w-28" anatPart="Skeleton.Button" />
                        </div>
                        {/* one day group: label + rows */}
                        <div className="flex max-h-[420px] flex-col gap-3 p-1">
                            <div className="flex flex-col gap-1">
                                <Skeleton
                                    className="mx-3 mt-1 h-3 w-16 rounded"
                                    anatPart="Skeleton.GroupLabel"
                                />
                                <SkeletonNotificationRow />
                                <SkeletonNotificationRow />
                                <SkeletonNotificationRow />
                            </div>
                        </div>
                    </div>,
                )}
            </BlockAnatomy>,
        ),
}
