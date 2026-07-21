import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { CrossListCard, CrossListItem } from "./CrossListCard"

const meta: Meta<typeof CrossListCard> = {
    title: "Primitives/Card/CrossListCard",
    component: CrossListCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CrossListCard>

const row = (text: string) => <Typography type="body-sm">{text}</Typography>

export const Checks: Story = {
    render: () => (
        <div className="p-8">
            <CrossListCard>
                <CrossListItem mark="check">{row("Xây 3 dự án thực chiến từ đầu đến khi triển khai")}</CrossListItem>
                <CrossListItem mark="check">{row("Chấm bài bằng AI theo checklist tuyển dụng thật")}</CrossListItem>
                <CrossListItem mark="check">{row("Mock interview không giới hạn số lần")}</CrossListItem>
            </CrossListCard>
        </div>
    ),
}

export const Crosses: Story = {
    render: () => (
        <div className="p-8">
            <CrossListCard>
                <CrossListItem mark="cross">{row("Không có chứng chỉ nộp cho nhà tuyển dụng")}</CrossListItem>
                <CrossListItem mark="cross">{row("Không hỗ trợ 1-1 với mentor")}</CrossListItem>
            </CrossListCard>
        </div>
    ),
}

/** The point of the merge: ONE list mixing included (✓) and excluded (✗) rows. */
export const Mixed: Story = {
    render: () => (
        <div className="p-8">
            <CrossListCard>
                <CrossListItem mark="check">{row("Toàn bộ 12 tuần nội dung + bài tập tự chấm")}</CrossListItem>
                <CrossListItem mark="check">{row("Mock interview không giới hạn")}</CrossListItem>
                <CrossListItem mark="cross">{row("Chưa gồm 1-1 review với mentor")}</CrossListItem>
                <CrossListItem mark="cross">{row("Chưa gồm hỗ trợ giới thiệu việc làm")}</CrossListItem>
            </CrossListCard>
        </div>
    ),
}

/** `mark="none"` — a plain row (e.g. a prerequisite, NOT an achievement, so no tick). */
export const NoMark: Story = {
    render: () => (
        <div className="p-8">
            <CrossListCard>
                <CrossListItem mark="none">{row("Biết một ngôn ngữ lập trình bất kỳ")}</CrossListItem>
                <CrossListItem mark="none">{row("Máy tính cài được Node.js")}</CrossListItem>
            </CrossListCard>
        </div>
    ),
}

/** Bordered — surface-in-surface (nested in a modal/drawer/panel). */
export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            <div className="rounded-3xl bg-surface p-4 shadow-surface">
                <CrossListCard bordered>
                    <CrossListItem mark="check">{row("Gồm: toàn bộ nội dung khoá")}</CrossListItem>
                    <CrossListItem mark="cross">{row("Chưa gồm: mentor 1-1")}</CrossListItem>
                </CrossListCard>
            </div>
        </div>
    ),
}
