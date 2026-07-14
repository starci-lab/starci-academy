import type { Meta, StoryObj } from "@storybook/nextjs"

import { StatusChip } from "./index"

const meta: Meta<typeof StatusChip> = {
    title: "Blocks/StatusChip",
    component: StatusChip,
    args: {
        children: "Đang hoạt động",
    },
}

export default meta

type Story = StoryObj<typeof StatusChip>

export const Default: Story = {
    args: {
        tone: "neutral",
        children: "Nháp",
    },
}

export const Success: Story = {
    args: {
        tone: "success",
        children: "Đã hoàn thành",
    },
}

export const Warning: Story = {
    args: {
        tone: "warning",
        children: "Sắp hết hạn",
    },
}

export const Danger: Story = {
    args: {
        tone: "danger",
        children: "Đã huỷ",
    },
}

export const Accent: Story = {
    args: {
        tone: "accent",
        children: "Nổi bật",
    },
}

const CheckIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M13.5 4.5L6 12L2.5 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export const WithIcon: Story = {
    args: {
        tone: "success",
        icon: <CheckIcon />,
        children: "Đã xác minh",
    },
}
