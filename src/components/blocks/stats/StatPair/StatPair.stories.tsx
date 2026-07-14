import type { Meta, StoryObj } from "@storybook/nextjs"

import { StatPair } from "./index"

const meta: Meta<typeof StatPair> = {
    title: "Blocks/StatPair",
    component: StatPair,
    parameters: {
        layout: "centered",
    },
    args: {
        value: "1,204",
        label: "Người theo dõi",
        align: "start",
        size: "md",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

export const Default: Story = {
    args: {
        value: "1,204",
        label: "Người theo dõi",
    },
}

export const CenterAligned: Story = {
    args: {
        value: "87%",
        label: "Tỉ lệ hoàn thành",
        align: "center",
    },
}

export const LargeSize: Story = {
    args: {
        value: "12",
        label: "Khóa học đã đăng ký",
        size: "lg",
    },
}

export const LargeCenterAligned: Story = {
    args: {
        value: "4.9",
        label: "Đánh giá trung bình",
        size: "lg",
        align: "center",
    },
}

export const ShortLabel: Story = {
    args: {
        value: "320",
        label: "XP",
    },
}
