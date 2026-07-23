import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnumChip } from "./EnumChip"
import type { EnumChipEntry } from "./EnumChip"

const meta: Meta<typeof EnumChip> = {
    title: "Primitives/Chip/EnumChip",
    component: EnumChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EnumChip>

type OrderStatus = "pending" | "paid" | "shipped" | "cancelled" | "refunded"

const ORDER_STATUS_MAP: Record<OrderStatus, EnumChipEntry> = {
    pending: { label: "Chờ xác nhận" },
    paid: { color: "success", label: "Đã thanh toán" },
    shipped: { color: "accent", label: "Đang giao" },
    cancelled: { color: "danger", label: "Đã huỷ" },
    refunded: { color: "warning", label: "Hoàn tiền" },
}

export const Neutral: Story = {
    render: () => (
        <div className="p-8">
            <EnumChip<OrderStatus> value="pending" map={ORDER_STATUS_MAP} />
        </div>
    ),
}

export const Success: Story = {
    render: () => (
        <div className="p-8">
            <EnumChip<OrderStatus> value="paid" map={ORDER_STATUS_MAP} />
        </div>
    ),
}

export const Accent: Story = {
    render: () => (
        <div className="p-8">
            <EnumChip<OrderStatus> value="shipped" map={ORDER_STATUS_MAP} />
        </div>
    ),
}

export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <EnumChip<OrderStatus> value="cancelled" map={ORDER_STATUS_MAP} />
        </div>
    ),
}

export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <EnumChip<OrderStatus> value="refunded" map={ORDER_STATUS_MAP} />
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the chip as a pill placeholder — không giật layout khi resolve. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <EnumChip<OrderStatus> value="paid" map={ORDER_STATUS_MAP} isSkeleton />
        </div>
    ),
}
