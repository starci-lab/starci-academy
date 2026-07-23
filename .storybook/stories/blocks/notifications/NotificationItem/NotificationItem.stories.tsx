import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Typography } from "@heroui/react"
import { BellIcon, ChatCircleIcon, CheckCircleIcon, FlameIcon } from "@phosphor-icons/react"
import { NotificationItem } from "./NotificationItem"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one notification row: an optional tone-colored icon tile + a
 * title/body/time text column + optional unread signal + optional action slot.
 *
 * ANATOMY IS PER-LEAF: each shape below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes (icon
 * present/absent · unread dot · body present/absent · trailing action) — there is
 * no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof NotificationItem> = {
    title: "Design/Notifications/NotificationItem",
    component: NotificationItem,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof NotificationItem>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// FULL — icon + title + body + time, already read (no unread dot, no action).
// Shared by the default, read and long-text leaves (same composition).
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "ô icon vuông tô màu theo tone (default/success/warning/accent)" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "dòng chính medium, clamp 2 dòng" },
    { name: "Typography · nội dung", tier: "primitive", role: "dòng phụ muted, clamp 2 dòng" },
    { name: "Typography · thời gian", tier: "primitive", role: "nhãn thời gian đã format, muted" },
]

// UNREAD — FULL + accent dot cạnh tiêu đề và nền accent-soft cả dòng.
const UNREAD_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "ô icon vuông tô màu theo tone" },
    { name: "Dot chưa đọc", tier: "primitive", role: "chấm accent (span) cạnh tiêu đề báo chưa đọc", state: "unread" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "dòng chính medium, clamp 2 dòng" },
    { name: "Typography · nội dung", tier: "primitive", role: "dòng phụ muted, clamp 2 dòng" },
    { name: "Typography · thời gian", tier: "primitive", role: "nhãn thời gian đã format, muted" },
]

// ACTION — UNREAD + actionSlot cuối dòng; leaf này truyền một Typography ('View')
// làm node hành động (giữ kích thước riêng, không bóp cột chữ).
const ACTION_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "ô icon vuông tô màu theo tone" },
    { name: "Dot chưa đọc", tier: "primitive", role: "chấm accent (span) cạnh tiêu đề báo chưa đọc", state: "unread" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "dòng chính medium, clamp 2 dòng" },
    { name: "Typography · nội dung", tier: "primitive", role: "dòng phụ muted, clamp 2 dòng" },
    { name: "Typography · thời gian", tier: "primitive", role: "nhãn thời gian đã format, muted" },
    { name: "Typography · hành động", tier: "primitive", role: "slot actionSlot cuối dòng — 'View' (body-xs), giữ kích thước riêng" },
]

// NO_ICON — text-only row: the leading IconTile is omitted (`icon` not passed).
const NO_ICON_PARTS: Array<AnatomyNode> = [
    { name: "Typography · tiêu đề", tier: "primitive", role: "dòng chính medium, clamp 2 dòng" },
    { name: "Typography · nội dung", tier: "primitive", role: "dòng phụ muted, clamp 2 dòng" },
    { name: "Typography · thời gian", tier: "primitive", role: "nhãn thời gian đã format, muted" },
]

// TITLE_ONLY — icon + unread dot + title + time, body omitted (`body` not passed).
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "ô icon vuông tô màu theo tone" },
    { name: "Dot chưa đọc", tier: "primitive", role: "chấm accent (span) cạnh tiêu đề báo chưa đọc", state: "unread" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "dòng chính medium, clamp 2 dòng" },
    { name: "Typography · thời gian", tier: "primitive", role: "nhãn thời gian đã format, muted" },
]

/** Default — neutral `tone="default"`, already read, no `onPress` (static row, not interactive). */
export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="NotificationItem"
                tier="design"
                leaf="Mặc định"
                parts={FULL_PARTS}
                reason="Một dòng thông báo gộp ô icon theo tone + cột title/body + nhãn thời gian đã format + tín hiệu unread (dot accent + nền accent nhạt) + action slot cuối dòng, để feature chỉ ánh xạ kind → icon/tone và truyền copy đã dịch. Cả dòng bấm được khi có onPress."
            >
                <NotificationItem
                    icon={<BellIcon />}
                    title="A new lesson was published in your course"
                    body="System Design Mastery — module 4, lesson 3 is now available."
                    timeLabel="3 days ago"
                />
            </BlockAnatomy>,
        ),
}

export const Unread: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="NotificationItem"
                tier="design"
                leaf="Chưa đọc"
                parts={UNREAD_PARTS}
                note="Thêm chấm accent cạnh tiêu đề + nền accent-soft báo chưa đọc; cả dòng bấm được (onPress)."
            >
                <NotificationItem
                    icon={<CheckCircleIcon />}
                    tone="success"
                    title="Your submission has been graded"
                    body="API Gateway challenge — scored 92/100, passed every test case."
                    timeLabel="2 hours ago"
                    isUnread
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const Read: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="NotificationItem"
                tier="design"
                leaf="Đã đọc"
                parts={FULL_PARTS}
                note="Đã đọc — không chấm/không nền accent; CÙNG composition với leaf mặc định, cả dòng bấm được."
            >
                <NotificationItem
                    icon={<FlameIcon />}
                    tone="warning"
                    title="Don't lose your 12-day study streak"
                    body="Study one more lesson today to keep your streak going."
                    timeLabel="Yesterday"
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const WithAction: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="NotificationItem"
                tier="design"
                leaf="Có nút hành động"
                parts={ACTION_PARTS}
                note="Thêm actionSlot cuối dòng ('View') cạnh trạng thái chưa đọc; slot giữ kích thước riêng, không bóp cột chữ."
            >
                <NotificationItem
                    icon={<ChatCircleIcon />}
                    tone="accent"
                    title="Ethan replied to your comment"
                    body="Right, that part should be split out into its own service."
                    timeLabel="45 minutes ago"
                    isUnread
                    actionSlot={
                        <Typography type="body-xs" className="text-accent-soft-foreground">
                            View
                        </Typography>
                    }
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

/** No icon — a text-only row; the leading icon tile is omitted entirely (`icon` not passed). */
export const TextOnly: Story = {
    name: "Không icon",
    render: () =>
        frame(
            <BlockAnatomy
                name="NotificationItem"
                tier="design"
                leaf="Không icon"
                parts={NO_ICON_PARTS}
                note="Bỏ IconTile → hàng chỉ chữ (không truyền `icon`), cột title/body/time tràn hết bề ngang."
            >
                <NotificationItem
                    title="Your payment method was updated"
                    body="Visa ending in 4242 is now your default payment method."
                    timeLabel="1 day ago"
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

/** No body — title-only row, the optional secondary detail line is omitted. */
export const TitleOnly: Story = {
    name: "Chỉ tiêu đề",
    render: () =>
        frame(
            <BlockAnatomy
                name="NotificationItem"
                tier="design"
                leaf="Chỉ tiêu đề"
                parts={TITLE_ONLY_PARTS}
                note="Bỏ body → hàng chỉ tiêu đề + thời gian (không truyền `body`)."
            >
                <NotificationItem
                    icon={<CheckCircleIcon />}
                    tone="success"
                    title="Your certificate has been issued"
                    timeLabel="Just now"
                    isUnread
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

/** Long title + body — both `line-clamp-2`, so overflow clips to two lines instead of pushing the row taller. */
export const LongText: Story = {
    name: "Chữ dài (clamp 2 dòng)",
    render: () =>
        frame(
            <BlockAnatomy
                name="NotificationItem"
                tier="design"
                leaf="Chữ dài (clamp 2 dòng)"
                parts={FULL_PARTS}
                note="CÙNG composition leaf mặc định; title/body clamp 2 dòng nên tràn thì cắt, không đẩy hàng cao."
            >
                <div className="w-80">
                    <NotificationItem
                        icon={<FlameIcon />}
                        tone="warning"
                        title="Don't lose your 45-day study streak — you have studied every single day since you first enrolled and it would be a shame to lose it now"
                        body="Study one more lesson today to keep your streak going, otherwise your progress resets back down to zero and you will have to start building it up again from scratch"
                        timeLabel="6 hours ago"
                        onPress={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}
