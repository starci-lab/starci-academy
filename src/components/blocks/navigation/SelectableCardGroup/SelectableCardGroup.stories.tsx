import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"

import { SelectableCardGroup } from "./index"
import type { SelectableCardItem } from "./index"

type PlanValue = "monthly" | "quarterly" | "yearly"

const PLAN_ITEMS: Array<SelectableCardItem<PlanValue>> = [
    {
        value: "monthly",
        label: "Hàng tháng",
        description: "299.000đ / tháng",
    },
    {
        value: "quarterly",
        label: "Hàng quý",
        description: "799.000đ / quý",
        badge: (
            <span className="rounded-full bg-accent/10 px-2 py-0 text-xs font-medium text-accent">
                Tiết kiệm 11%
            </span>
        ),
    },
    {
        value: "yearly",
        label: "Hàng năm",
        description: "2.499.000đ / năm",
        badge: (
            <span className="rounded-full bg-accent/10 px-2 py-0 text-xs font-medium text-accent">
                Tiết kiệm 30%
            </span>
        ),
    },
]

const StarIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M8 1.5l1.9 4.2 4.6.5-3.4 3.2.9 4.6L8 11.8l-4 2.2.9-4.6-3.4-3.2 4.6-.5L8 1.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
        />
    </svg>
)

const LANGUAGE_ITEMS: Array<SelectableCardItem<"ts" | "java" | "csharp" | "go">> = [
    {
        value: "ts",
        label: "TypeScript",
        description: "Node.js / NestJS",
        icon: <StarIcon />,
    },
    {
        value: "java",
        label: "Java",
        description: "Spring Boot",
    },
    {
        value: "csharp",
        label: "C#",
        description: ".NET",
    },
    {
        value: "go",
        label: "Go",
        description: "Sắp ra mắt",
        isDisabled: true,
    },
]

/**
 * Wraps the story render in local `useState` so the group is genuinely
 * interactive in the Storybook canvas (the block itself is fully controlled —
 * no internal store/hook — so this is plain prop-mocking, not a provider).
 */
const ControlledGroup = <T extends string>({
    items,
    initialValue,
    ariaLabel,
    columns,
    width = "420px",
}: {
    items: Array<SelectableCardItem<T>>
    initialValue: T
    ariaLabel: string
    columns?: 1 | 2 | 3
    width?: string
}) => {
    const [value, setValue] = useState<T>(initialValue)
    return (
        <div style={{ width }}>
            <SelectableCardGroup
                items={items}
                value={value}
                onChange={setValue}
                ariaLabel={ariaLabel}
                columns={columns}
            />
        </div>
    )
}

const meta: Meta<typeof SelectableCardGroup> = {
    title: "Blocks/SelectableCardGroup",
}

export default meta

type Story = StoryObj<typeof meta>

/**
 * Dùng cho chọn 1-trong-N phương án có mô tả kèm theo (chu kỳ thanh toán,
 * gói dịch vụ…) — không phải danh sách điều hướng thuần.
 */
export const Default: Story = {
    parameters: {
        usage: "Dùng cho chọn 1-trong-N phương án có mô tả kèm theo (chu kỳ thanh toán, gói dịch vụ…) — không phải danh sách điều hướng thuần.",
    },
    render: () => (
        <ControlledGroup
            items={PLAN_ITEMS}
            initialValue="monthly"
            ariaLabel="Chọn chu kỳ thanh toán"
            columns={2}
        />
    ),
}

/**
 * Chọn số cột theo bối cảnh: 1 cột cho khối hẹp/sidebar, 3 cột khi liệt kê
 * nhiều lựa chọn ngang hàng (ví dụ chọn ngôn ngữ lập trình).
 */
export const Columns: Story = {
    name: "Columns (1 / 3)",
    parameters: {
        usage: "Chọn số cột theo bối cảnh: 1 cột cho khối hẹp/sidebar, 3 cột khi liệt kê nhiều lựa chọn ngang hàng (ví dụ chọn ngôn ngữ lập trình).",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="mb-2 text-xs text-default-500">columns = 1</p>
                <ControlledGroup
                    items={PLAN_ITEMS}
                    initialValue="quarterly"
                    ariaLabel="Chọn chu kỳ thanh toán"
                    columns={1}
                />
            </div>
            <div>
                <p className="mb-2 text-xs text-default-500">columns = 3</p>
                <ControlledGroup
                    items={LANGUAGE_ITEMS}
                    initialValue="ts"
                    ariaLabel="Chọn ngôn ngữ"
                    columns={3}
                    width="640px"
                />
            </div>
        </div>
    ),
}

/**
 * Dùng khi lựa chọn cần icon nhận diện (ngôn ngữ, công nghệ) và có phương án
 * chưa khả dụng — card disabled vẫn hiển thị để báo "sắp ra mắt", không ẩn đi.
 */
export const WithIconAndDisabled: Story = {
    parameters: {
        usage: "Dùng khi lựa chọn cần icon nhận diện (ngôn ngữ, công nghệ) và có phương án chưa khả dụng — card disabled vẫn hiển thị để báo \"sắp ra mắt\", không ẩn đi.",
    },
    render: () => (
        <ControlledGroup
            items={LANGUAGE_ITEMS}
            initialValue="java"
            ariaLabel="Chọn ngôn ngữ"
            columns={2}
        />
    ),
}

/**
 * Gắn badge khi cần nhấn mạnh ưu đãi/khuyến khích chọn một phương án cụ thể
 * (VD "Tiết kiệm 30%") — không lạm dụng cho mọi item, chỉ item muốn nổi bật.
 */
export const WithBadge: Story = {
    parameters: {
        usage: "Gắn badge khi cần nhấn mạnh ưu đãi/khuyến khích chọn một phương án cụ thể (VD \"Tiết kiệm 30%\") — không lạm dụng cho mọi item, chỉ item muốn nổi bật.",
    },
    render: () => (
        <ControlledGroup
            items={PLAN_ITEMS}
            initialValue="yearly"
            ariaLabel="Chọn chu kỳ thanh toán"
            columns={1}
        />
    ),
}
