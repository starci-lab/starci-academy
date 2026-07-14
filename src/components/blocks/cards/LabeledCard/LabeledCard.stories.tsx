import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Badge, Button } from "@heroui/react"
import { BookOpenIcon, ClockIcon } from "@phosphor-icons/react"
import { LabeledCard } from "./index"

/**
 * The StarCi section card (UI 2.0): title `Label` sits OUTSIDE, above the card,
 * while `Card` holds only content. See `src/components/blocks/cards/LabeledCard/index.tsx`.
 */
const meta: Meta<typeof LabeledCard> = {
    title: "Blocks/LabeledCard",
    component: LabeledCard,
    parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof LabeledCard>

const SampleBody = () => (
    <div className="flex flex-col gap-2 p-4">
        <p className="text-sm text-foreground">
            Khóa học Fullstack Mastery — Module 3: React nâng cao
        </p>
        <p className="text-sm text-muted">
            Tiến độ 68% · 12/18 bài học hoàn thành
        </p>
    </div>
)

export const Default: Story = {
    args: {
        label: "Khóa học của tôi",
        children: <SampleBody />,
    },
}

export const WithIcon: Story = {
    args: {
        label: "Tài liệu tham khảo",
        icon: <BookOpenIcon className="size-4 text-accent" aria-hidden focusable="false" />,
        children: <SampleBody />,
    },
}

export const WithLabelEnd: Story = {
    args: {
        label: "Học phí còn lại",
        labelEnd: "VND",
        children: <SampleBody />,
    },
}

export const WithSeeMore: Story = {
    args: {
        label: "Khóa học nổi bật",
        onSeeMore: () => {},
        children: <SampleBody />,
    },
}

export const WithSeeMoreCustomLabel: Story = {
    args: {
        label: "Bài viết mới",
        onSeeMore: () => {},
        seeMoreLabel: "Xem tất cả",
        children: <SampleBody />,
    },
}

export const WithAction: Story = {
    args: {
        label: "Người quản lý",
        action: (
            <Button variant="secondary" size="sm">
                Thêm / quản lý
            </Button>
        ),
        children: <SampleBody />,
    },
}

export const Frameless: Story = {
    args: {
        label: "Khóa học đề xuất",
        frameless: true,
        children: (
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-default p-3 text-sm">System Design Mastery</div>
                <div className="rounded-lg border border-default p-3 text-sm">DevOps Mastery</div>
            </div>
        ),
    },
}

export const FlushContent: Story = {
    args: {
        label: "Danh sách bài học",
        flushContent: true,
        children: (
            <ul className="divide-y divide-default">
                <li className="p-4 text-sm">Bài 1: Giới thiệu React Hooks</li>
                <li className="p-4 text-sm">Bài 2: useState và useEffect</li>
                <li className="p-4 text-sm">Bài 3: Custom Hooks</li>
            </ul>
        ),
    },
}

export const FillHeight: Story = {
    args: {
        label: "Trạng thái",
        fillHeight: true,
        children: (
            <div className="flex h-full items-center justify-center p-6">
                <Badge color="success">Đang hoạt động</Badge>
            </div>
        ),
    },
    decorators: [
        (StoryFn) => (
            <div className="h-64">
                <StoryFn />
            </div>
        ),
    ],
}

export const SubtleLabel: Story = {
    args: {
        label: "Hôm nay",
        icon: <ClockIcon className="size-4 text-muted" aria-hidden focusable="false" />,
        subtleLabel: true,
        labelEnd: "3 phiên",
        children: <SampleBody />,
    },
}
