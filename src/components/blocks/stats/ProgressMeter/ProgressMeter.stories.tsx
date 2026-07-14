import type { Meta, StoryObj } from "@storybook/nextjs"

import { ProgressMeter } from "./index"

const meta: Meta<typeof ProgressMeter> = {
    title: "Blocks/ProgressMeter",
    component: ProgressMeter,
    parameters: {
        layout: "padded",
    },
}

export default meta

type Story = StoryObj<typeof ProgressMeter>

export const Default: Story = {
    args: {
        value: 45,
    },
}

export const WithLabel: Story = {
    args: {
        value: 62,
        label: "Tiến độ khóa học",
    },
}

export const WithLabelAndValue: Story = {
    args: {
        value: 78,
        label: "Hoàn thành module",
        showValue: true,
    },
}

export const ValueOnly: Story = {
    args: {
        value: 33,
        showValue: true,
    },
}

export const ToneSuccess: Story = {
    args: {
        value: 100,
        label: "Bài kiểm tra",
        showValue: true,
        color: "success",
    },
}

export const ToneWarning: Story = {
    args: {
        value: 55,
        label: "Thời gian còn lại",
        showValue: true,
        color: "warning",
    },
}

export const ToneDanger: Story = {
    args: {
        value: 12,
        label: "Điểm số hiện tại",
        showValue: true,
        color: "danger",
    },
}

export const Empty: Story = {
    args: {
        value: 0,
        label: "Chưa bắt đầu",
        showValue: true,
    },
}

export const Complete: Story = {
    args: {
        value: 100,
        label: "Hoàn thành",
        showValue: true,
        color: "success",
    },
}

export const CustomMax: Story = {
    args: {
        value: 7,
        max: 10,
        label: "7 / 10 bài học",
        showValue: true,
    },
}
