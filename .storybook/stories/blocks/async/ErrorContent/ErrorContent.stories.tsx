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

// title-only leaf: EmptyState danger. WarningIcon + the title Typography are CUT —
// both are elements rendering VALUES passed into EmptyState's `icon`/`title` props;
// EmptyState itself is the node that composes them.
const BASIC_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
    },
]

// +description leaf: same EmptyState node; `description` is likewise a prop value.
const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
    },
]

// +retry leaf: adds a real Button composed into the action slot (onRetry + retryLabel).
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
            { name: "Button", tier: "primitive", role: "nút thử lại (onRetry + retryLabel)", state: "secondary" },
        ],
    },
]

// custom-icon leaf: same shape; the overridden icon is still just a prop value, so
// it carries no node of its own (WifiSlashIcon cut, same as WarningIcon above).
const CUSTOM_ICON_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
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
                leaf="Basic"
                parts={BASIC_PARTS}
                reason={"Trạng thái lỗi của một vùng dữ liệu async cần đúng anatomy của EmptyState tone=\"danger\" (icon cảnh báo + tiêu đề + mô tả + nút thử lại canh giữa). ErrorContent chỉ thêm icon WarningOctagon mặc định và truyền onRetry/retryLabel xuống action — nên nó là một lớp mỏng trên EmptyState, không nên tự vẽ lại."}
            >
                <ErrorContent title="Đã có lỗi xảy ra" showAnatomy />
            </BlockAnatomy>,
        ),
}

export const WithDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ErrorContent"
                tier="design"
                leaf="WithDescription"
                parts={DESCRIPTION_PARTS}
                note="Thêm dòng mô tả muted dưới tiêu đề — vẫn chưa có nút hành động."
            >
                <ErrorContent
                    title="Không tải được dữ liệu"
                    description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
                    showAnatomy
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
                leaf="WithRetry"
                parts={RETRY_PARTS}
                note="onRetry + retryLabel → thêm Button vào slot action của EmptyState."
            >
                <ErrorContent
                    title="Không tải được dữ liệu"
                    description="Đã có lỗi xảy ra khi tải nội dung."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                    showAnatomy
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
                leaf="CustomIcon"
                parts={CUSTOM_ICON_PARTS}
                note="Cùng shape đầy đủ, chỉ thay icon mặc định bằng icon caller truyền vào."
            >
                <ErrorContent
                    icon={<WifiSlashIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                    title="Mất kết nối mạng"
                    description="Kiểm tra kết nối rồi thử lại."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
