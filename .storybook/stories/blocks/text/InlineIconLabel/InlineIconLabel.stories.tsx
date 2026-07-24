import type { Meta, StoryObj } from "@storybook/nextjs"
import { UsersIcon, SparkleIcon, WarningCircleIcon, ChatCircleIcon } from "@phosphor-icons/react"
import { InlineIconLabel } from "./InlineIconLabel"

/**
 * PRIMITIVE — a leading icon + inline text label as ONE unit. Use this instead of
 * hand-rolling `flex items-center gap-1` + a bare icon + a Typography every time a
 * count, eyebrow, tab label, or toned caption needs an icon. The primitive OWNS the
 * icon size (per the text scale, §5) and the tone colour.
 */
const meta: Meta<typeof InlineIconLabel> = {
    title: "Primitives/Text/InlineIconLabel",
    component: InlineIconLabel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof InlineIconLabel>

const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** COUNT — the default: an icon + a muted count (e.g. learner count on a card). */
export const Count: Story = {
    render: () => shell(
        <InlineIconLabel icon={<UsersIcon aria-hidden focusable="false" />} tone="muted">
            1.284 học viên
        </InlineIconLabel>,
    ),
}

/** EYEBROW — a muted kind label above content. */
export const Eyebrow: Story = {
    render: () => shell(
        <InlineIconLabel icon={<SparkleIcon aria-hidden focusable="false" />} tone="muted">
            Chấm bằng AI
        </InlineIconLabel>,
    ),
}

/** TONES — muted · accent · warning · danger · success (icon + text share ONE colour). */
export const Tones: Story = {
    render: () => shell(
        <div className="flex flex-col gap-3">
            <InlineIconLabel icon={<SparkleIcon aria-hidden focusable="false" />} tone="accent">Chấm bằng Claude</InlineIconLabel>
            <InlineIconLabel icon={<WarningCircleIcon aria-hidden focusable="false" />} tone="warning">Còn 3 suất — giá sắp tăng</InlineIconLabel>
            <InlineIconLabel icon={<WarningCircleIcon aria-hidden focusable="false" />} tone="danger">Hết hạn nộp bài</InlineIconLabel>
            <InlineIconLabel icon={<SparkleIcon aria-hidden focusable="false" />} tone="success">Đã chấm xong</InlineIconLabel>
        </div>,
    ),
}

/** SIZES — xs (body-xs) · sm (body-sm); icon stays size-4 for both (inline-meta glyph). */
export const Sizes: Story = {
    render: () => shell(
        <div className="flex flex-col gap-3">
            <InlineIconLabel icon={<ChatCircleIcon aria-hidden focusable="false" />} tone="muted" size="xs">128 bình luận</InlineIconLabel>
            <InlineIconLabel icon={<ChatCircleIcon aria-hidden focusable="false" />} tone="muted" size="sm">128 bình luận</InlineIconLabel>
        </div>,
    ),
}

/** FOREGROUND — no tone: icon + text inherit the ambient foreground (e.g. a tab label). */
export const Foreground: Story = {
    render: () => shell(
        <InlineIconLabel icon={<SparkleIcon aria-hidden focusable="false" />}>Tổng quan</InlineIconLabel>,
    ),
}

/** TRUNCATE — the label clamps to one line inside a bounded width. */
export const Truncate: Story = {
    render: () => shell(
        <div className="w-44 rounded-2xl border border-separator p-3">
            <InlineIconLabel icon={<SparkleIcon aria-hidden focusable="false" />} tone="muted" truncate>
                Một nhãn rất dài sẽ bị cắt ở cuối dòng
            </InlineIconLabel>
        </div>,
    ),
}

/** SKELETON — the loading mirror (icon dot + text bar). */
export const Skeleton: Story = {
    render: () => shell(
        <div className="flex flex-col gap-3">
            <InlineIconLabel icon={null} isSkeleton size="xs">x</InlineIconLabel>
            <InlineIconLabel icon={null} isSkeleton size="sm" skeletonWidth="w-24">x</InlineIconLabel>
        </div>,
    ),
}
