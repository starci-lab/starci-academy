import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { WifiSlashIcon } from "@phosphor-icons/react"
import { ErrorContent } from "./ErrorContent"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the standard error state for an async data region: a warning icon +
 * title + optional description + optional retry button, centered. A THIN wrapper
 * over the `EmptyState` primitive with `tone="danger"`.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ErrorContent> = {
    title: "Design/Async/ErrorContent",
    component: ErrorContent,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ErrorContent>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// title-only leaf: EmptyState danger with just icon + title (no description, no action).
const BASIC_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "design",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
            { name: "WarningIcon", tier: "primitive", role: "icon cảnh báo duotone mặc định" },
            { name: "Typography · title", tier: "primitive", role: "dòng lỗi chính" },
        ],
    },
]

// +description leaf: same chrome, adds the supporting muted line (still no action).
const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "design",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
            { name: "WarningIcon", tier: "primitive", role: "icon cảnh báo duotone mặc định" },
            { name: "Typography · title", tier: "primitive", role: "dòng lỗi chính" },
            { name: "Typography · description", tier: "primitive", role: "dòng phụ giải thích / hướng dẫn" },
        ],
    },
]

// +retry leaf: adds a Button into the action slot (onRetry + retryLabel).
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "design",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
            { name: "WarningIcon", tier: "primitive", role: "icon cảnh báo duotone mặc định" },
            { name: "Typography · title", tier: "primitive", role: "dòng lỗi chính" },
            { name: "Typography · description", tier: "primitive", role: "dòng phụ giải thích / hướng dẫn" },
            { name: "Button", tier: "primitive", role: "nút thử lại (onRetry + retryLabel)", state: "secondary" },
        ],
    },
]

// custom-icon leaf: same full shape, default WarningIcon swapped for a caller icon.
const CUSTOM_ICON_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "design",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
            { name: "WifiSlashIcon", tier: "primitive", role: "icon do caller truyền (override mặc định)" },
            { name: "Typography · title", tier: "primitive", role: "dòng lỗi chính" },
            { name: "Typography · description", tier: "primitive", role: "dòng phụ giải thích / hướng dẫn" },
            { name: "Button", tier: "primitive", role: "nút thử lại (onRetry + retryLabel)", state: "secondary" },
        ],
    },
]

export const Basic: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ErrorContent"
                tier="design"
                leaf="Chỉ tiêu đề"
                parts={BASIC_PARTS}
                reason={"Trạng thái lỗi của một vùng dữ liệu async cần đúng anatomy của EmptyState tone=\"danger\" (icon cảnh báo + tiêu đề + mô tả + nút thử lại canh giữa). ErrorContent chỉ thêm icon WarningOctagon mặc định và truyền onRetry/retryLabel xuống action — nên nó là một lớp mỏng trên EmptyState, không nên tự vẽ lại."}
            >
                <ErrorContent title="Đã có lỗi xảy ra" />
            </BlockAnatomy>,
        ),
}

export const WithDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ErrorContent"
                tier="design"
                leaf="Có mô tả"
                parts={DESCRIPTION_PARTS}
                note="Thêm dòng mô tả muted dưới tiêu đề — vẫn chưa có nút hành động."
            >
                <ErrorContent
                    title="Không tải được dữ liệu"
                    description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
                />
            </BlockAnatomy>,
        ),
}

export const WithRetry: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ErrorContent"
                tier="design"
                leaf="Có nút thử lại"
                parts={RETRY_PARTS}
                note="onRetry + retryLabel → thêm Button vào slot action của EmptyState."
            >
                <ErrorContent
                    title="Không tải được dữ liệu"
                    description="Đã có lỗi xảy ra khi tải nội dung."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                />
            </BlockAnatomy>,
        ),
}

export const CustomIcon: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ErrorContent"
                tier="design"
                leaf="Icon tuỳ biến"
                parts={CUSTOM_ICON_PARTS}
                note="Cùng shape đầy đủ, chỉ thay icon mặc định bằng icon caller truyền vào."
            >
                <ErrorContent
                    icon={<WifiSlashIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                    title="Mất kết nối mạng"
                    description="Kiểm tra kết nối rồi thử lại."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                />
            </BlockAnatomy>,
        ),
}
